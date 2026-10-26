import { expect, test } from '@playwright/test';
import { merchandiseSizes } from './_components/sizes';
import { stockColors } from '../../../lib/data/stockColors';

for (const colorScheme of ['light', 'dark'] as const) {
	for (const width of [390, 1440]) {
		test(`merchandise colors and sizes work at ${width}px in ${colorScheme}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/markets/merchandise-tags');
			await expect(page.locator('[data-merchandise-ready]')).toHaveAttribute(
				'data-merchandise-ready',
				'true'
			);
			await expect(page).toHaveTitle('Merchandise Tags | Allen-Bailey Tag & Label');
			await expect(page.locator('[data-content-body] > section')).toHaveCount(2);
			const colors = page.getByRole('radiogroup', { name: 'Merchandise stock color' });
			await expect(colors.getByRole('radio')).toHaveCount(21);
			const fills = new Set<string>();
			for (const color of stockColors) {
				await colors.getByRole('radio', { name: `Preview ${color.name}`, exact: true }).check();
				await expect(page.locator('[data-merchandise-color-name]')).toHaveText(color.name);
				await expect(page.locator(`[data-merchandise-color="${color.id}"]`)).toHaveCount(2);
				fills.add(
					await page
						.locator('[data-merchandise-color-preview] [data-merchandise-outline]')
						.evaluate((node) => getComputedStyle(node).fill)
				);
				await expect(colors.locator('[data-radio-check]')).toHaveCount(1);
			}
			expect(fills.size).toBe(21);
			await colors.getByRole('radio').first().focus();
			await colors.getByRole('radio').first().press('ArrowRight');
			await expect(colors.getByRole('radio').nth(1)).toBeChecked();
			const sizes = page.getByRole('radiogroup', { name: 'Merchandise tag size' });
			await expect(sizes.getByRole('radio')).toHaveCount(9);
			const panel = page.locator('[data-merchandise-size-preview]');
			const height = (await panel.boundingBox())!.height;
			let previousWidth = 0;
			for (let number = 1; number <= 9; number++) {
				await sizes.getByRole('radio', { name: `#${number}`, exact: true }).check();
				await expect(page.locator('[data-merchandise-size-name]')).toHaveText(`Size #${number}`);
				const box = (await panel.locator('[data-merchandise-outline]').boundingBox())!;
				expect(box.width).toBeGreaterThan(previousWidth);
				previousWidth = box.width;
				const size = merchandiseSizes[number - 1];
				await expect(page.locator('[data-merchandise-dimensions]')).toHaveText(size.dimensions);
				// Playwright's SVG bounding box includes the decorative stroke; compare paper geometry.
				const ratio = await panel.locator('[data-merchandise-outline]').evaluate((node) => {
					const bounds = node.getBoundingClientRect();
					return bounds.width / bounds.height;
				});
				expect(ratio).toBeCloseTo(size.width / size.length, 2);
				expect((await panel.boundingBox())!.height).toBe(height);
			}
			await expect(page.locator('[data-attachment-fastening="knotted"]')).toHaveCount(2);
			await expect(page.locator('[data-content-cta] a')).toHaveAttribute('href', '/contact');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.screenshot({
				path: `.svelte-kit/merchandise-${width}-${colorScheme}.png`,
				fullPage: true
			});
		});
	}
}

test('merchandise previews and contact remain available without JavaScript', async ({
	browser
}) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 390, height: 1000 }
	});
	const page = await context.newPage();
	await page.goto('/markets/merchandise-tags');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByRole('radio', { name: 'Preview Manila', exact: true })).toBeChecked();
	await expect(page.getByRole('radio', { name: '#4', exact: true })).toBeChecked();
	await expect(page.locator('[data-merchandise-color="manila"]')).toHaveCount(2);
	await expect(page.locator('[data-content-cta] a')).toHaveAttribute('href', '/contact');
	await context.close();
});
