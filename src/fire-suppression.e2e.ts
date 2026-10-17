import { expect, test } from '@playwright/test';
import { collars, labels, tags } from './routes/markets/fire-suppression/_components/products';

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
			await page.getByRole('button', { name: 'Turn it over' }).click();
			await expect(page.locator('[data-fire-tag-preview] [data-flip-face="back"]')).toContainText(
				'IN USE'
			);
			await page.getByRole('button', { name: 'View the face' }).click();
			await expect(page.locator('[data-fire-tag-preview] [data-flip-face="front"]')).toContainText(
				'EMPTY'
			);
			const labelGroup = page.getByRole('radiogroup', { name: 'Fire-service label type' });
			await expect(labelGroup.getByRole('radio')).toHaveCount(labels.length);
			await expect(page.locator('#labels select')).toHaveCount(0);
			await expect(page.getByText('The label range', { exact: true })).toHaveCount(0);
			const previewHeight = (await page.locator('[data-fire-label-preview]').boundingBox())!.height;
			for (const product of labels) {
				await labelGroup.getByRole('radio', { name: product.name, exact: true }).check();
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
			const collarGroup = page.getByRole('radiogroup', { name: 'Collar size' });
			await expect(page.getByRole('radio', { name: 'View on equipment' })).toHaveCount(0);
			for (const collar of collars) {
				await collarGroup
					.getByRole('radio', { name: `${collar.name} / ${collar.color}`, exact: true })
					.check();
				const preview = page.locator('[data-fire-collar-preview]');
				await expect(preview).toHaveAttribute('data-fire-collar-preview', collar.id);
				await expect(preview.locator('[data-fire-collar-ink]')).toHaveClass(
					new RegExp(collar.className)
				);
				await expect(preview.locator('[data-fire-collar-stock]')).toHaveCSS(
					'fill',
					'rgb(255, 255, 255)'
				);
				const ink = await preview
					.locator('[data-fire-collar-ink]')
					.evaluate((node) => getComputedStyle(node).color);
				for (const text of await preview.locator('[data-fire-collar-ink] text').all()) {
					await expect(text).toHaveCSS('fill', ink);
				}
				for (const text of await preview.locator('[data-fire-collar-personalization] text').all()) {
					await expect(text).toHaveCSS('fill', 'rgb(0, 0, 0)');
				}
			}
			await collarGroup.getByRole('radio').first().press('ArrowRight');
			await expect(collarGroup.getByRole('radio').nth(1)).toBeChecked();
			const tagPreview = page.locator('[data-fire-tag-preview]');
			const flip = tagPreview.getByRole('button', { name: 'Turn it over' });
			await flip.scrollIntoViewIfNeeded();
			const panelBox = (await tagPreview.boundingBox())!;
			const flipBox = (await flip.boundingBox())!;
			expect(
				Math.abs(flipBox.x + flipBox.width / 2 - panelBox.x - panelBox.width / 2)
			).toBeLessThan(1);
			expect(flipBox.y).toBeGreaterThan(panelBox.y + panelBox.height * 0.75);
			expect(flipBox.y + flipBox.height).toBeLessThanOrEqual(panelBox.y + panelBox.height);

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
