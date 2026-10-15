import { expect, test } from '@playwright/test';

for (const [route, selector] of [
	['/about', 'main button[aria-haspopup="dialog"]'],
	['/capabilities/stock-colors', '[data-stock-photo-color]'],
	['/news', '[data-news-grid] a'],
	['/', '[data-bento-topic]']
]) {
	test(`shared cards reveal fixed-size media without zoom on ${route}`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.goto(route);
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light', { timeout: 60000 });
		const card = page.locator(selector).first();
		await card.scrollIntoViewIfNeeded();
		await expect(card).toHaveCSS('opacity', '1');
		await page.mouse.move(0, 0);
		const media = card.locator('[data-bento-media]').first();
		const surface = card.locator('[data-bento-surface]');
		const initial = (await media.boundingBox())!;
		const layout = (await card.boundingBox())!;
		const restingClip = await media.evaluate((node) => getComputedStyle(node).clipPath);
		expect(restingClip).toContain('4px');
		await card.hover();
		if (route === '/capabilities/stock-colors') {
			// A moving marquee can carry the hovered item away; keyboard focus holds its interaction.
			await page.keyboard.press('Tab');
			await card.focus();
		}
		await expect
			.poll(() => media.evaluate((node) => getComputedStyle(node).clipPath))
			.toContain('inset(0px');
		expect((await media.boundingBox())!.width).toBeCloseTo(initial.width);
		expect((await media.boundingBox())!.height).toBeCloseTo(initial.height);
		await expect
			.poll(async () => (await surface.boundingBox())!.width)
			.toBeCloseTo(layout.width + 8, 0);
		expect((await card.boundingBox())!.width).toBeCloseTo(layout.width);
		await expect(card.locator('[data-bento-outline]')).toHaveCSS('opacity', '0.6');
		for (const image of await media.locator('img').all()) {
			await expect(image).toHaveCSS('scale', 'none');
			await expect(image).toHaveCSS('transform', 'none');
		}
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await expect(media).toHaveCSS('clip-path', 'none');
		await expect
			.poll(async () => (await media.boundingBox())!.width)
			.toBeCloseTo(initial.width - 8, 0);
		await expect
			.poll(async () => (await surface.boundingBox())!.width)
			.toBeCloseTo(layout.width, 0);
		await page.setViewportSize({ width: 390, height: 900 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}

test('homepage hover keeps every artwork viewport and canvas resolution stable', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/');
	await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	for (const card of await page.locator('[data-bento-topic]').all()) {
		await card.scrollIntoViewIfNeeded();
		await expect(card).toHaveCSS('opacity', '1');
		await page.mouse.move(0, 0);
		const media = card.locator('[data-bento-media]');
		await media.evaluate(async () => {
			for (let frame = 0; frame < 3; frame++) await new Promise(requestAnimationFrame);
		});
		const [samples] = await Promise.all([
			media.evaluate(async (node) => {
				const samples: string[] = [];
				for (let frame = 0; frame < 30; frame++) {
					await new Promise(requestAnimationFrame);
					const bounds = node.getBoundingClientRect();
					samples.push(
						JSON.stringify({
							width: bounds.width,
							height: bounds.height,
							canvases: [...node.querySelectorAll('canvas')].map((canvas) => [
								canvas.width,
								canvas.height
							])
						})
					);
				}
				return samples;
			}),
			card.hover()
		]);
		expect(new Set(samples).size).toBe(1);
	}
});
