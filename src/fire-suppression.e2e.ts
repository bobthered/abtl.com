import { expect, test } from '@playwright/test';
import { labels, tags } from './routes/markets/fire-suppression/_components/products';

for (const colorScheme of ['light', 'dark'] as const) {
	for (const width of [390, 1440]) {
		test(`fire suppression products work at ${width}px in ${colorScheme}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/markets/fire-suppression');
			await expect(page.locator('[data-fire-suppression-ready]')).toHaveAttribute(
				'data-fire-suppression-ready',
				'true'
			);
			await expect(page).toHaveTitle('Fire Suppression | Allen-Bailey Tag & Label');
			await expect(page.locator('[data-content-title] h1')).toHaveCount(1);
			await expect(page.locator('[data-content-body] > section')).toHaveCount(4);
			await expect(page.locator('[data-content-cta]').getByRole('link')).toHaveAttribute(
				'href',
				'/contact'
			);
			const tagGroup = page.getByRole('radiogroup', { name: 'Fire-service tag type' });
			for (const product of tags) {
				await tagGroup.getByRole('radio', { name: product.name, exact: true }).check();
				await expect(page.locator('[data-fire-tag-preview]')).toHaveAttribute(
					'data-fire-tag-preview',
					product.id
				);
				await expect(
					page.getByRole('heading', { name: product.headline, exact: true })
				).toBeVisible();
			}
			await tagGroup.getByRole('radio', { name: 'Empty / in use tags' }).check();
			await page.getByRole('button', { name: 'Explore the reverse' }).click();
			await expect(page.locator('[data-fire-tag-preview]')).toContainText('IN USE');
			await page.getByRole('button', { name: 'View front' }).click();
			await expect(page.locator('[data-fire-tag-preview]')).toContainText('EMPTY');
			const labelSelect = page.getByRole('combobox', { name: 'Explore a label type' });
			const previewHeight = (await page.locator('[data-fire-label-preview]').boundingBox())!.height;
			for (const product of labels) {
				await labelSelect.selectOption(product.id);
				await expect(page.locator('[data-fire-label-preview]')).toHaveAttribute(
					'data-fire-label-preview',
					product.id
				);
				await expect(
					page.getByRole('heading', { name: product.headline, exact: true })
				).toBeVisible();
				expect((await page.locator('[data-fire-label-preview]').boundingBox())!.height).toBe(
					previewHeight
				);
			}
			await page.getByRole('radio', { name: 'View on equipment' }).check();
			await expect(page.locator('[data-fire-collar-preview]')).toHaveAttribute(
				'data-fire-collar-preview',
				'fitted'
			);
			await page.getByRole('radio', { name: 'View flat', exact: true }).press('ArrowRight');
			await expect(page.getByRole('radio', { name: 'View on equipment' })).toBeChecked();
			await page.getByRole('radio', { name: 'View flat', exact: true }).check();
			await expect(page.locator('[data-fire-collar-preview]')).toHaveAttribute(
				'data-fire-collar-preview',
				'flat'
			);
			await expect(page.locator('main a[href^="/markets/"]')).toHaveCount(0);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.screenshot({
				path: `.svelte-kit/fire-suppression-${width}-${colorScheme}.png`,
				fullPage: true
			});
		});
	}
}

test('market navigation starts fresh and the root redirects without JavaScript', async ({
	browser,
	request
}) => {
	const response = await request.get('/markets?source=menu', { maxRedirects: 0 });
	expect(response.status()).toBe(308);
	expect(response.headers().location).toBe('/markets/fire-suppression?source=menu');
	for (const old of ['equipment-service', 'retail', 'outdoor']) {
		expect((await request.get(`/markets/${old}`)).status()).toBe(404);
	}
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/markets');
	await expect(page).toHaveURL(/markets\/fire-suppression$/);
	for (const product of [...tags, ...labels]) {
		await expect(page.getByText(product.name, { exact: true }).first()).toBeAttached();
	}
	await expect(page.getByRole('heading', { name: /A different shape/ })).toBeAttached();
	await context.close();
});
