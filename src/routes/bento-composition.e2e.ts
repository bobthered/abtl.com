import { expect, test } from '@playwright/test';

for (const width of [390, 768, 1440]) {
	test(`preview compositions follow actual tile width at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/', { waitUntil: 'domcontentloaded' });
		await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true');
		for (const span of width === 1440 ? [2, 4, 6] : [0]) {
			if (span)
				await page.locator('[data-bento-topic]').evaluateAll((elements, span) => {
					for (const element of elements) {
						element.classList.remove('lg:col-span-2', 'lg:col-span-4', 'lg:col-span-6');
						element.classList.add('lg:col-span-' + span);
					}
				}, span);
			for (const id of ['full-color-printing', 'synthetic-materials', 'variable-data']) {
				const tile = page.locator(`[data-bento-topic="${id}"]`);
				await tile.scrollIntoViewIfNeeded();
				const bounds = (await tile.boundingBox())!;
				const isWide = bounds.width >= 576;
				const description = tile.locator('[data-bento-description]');
				if (isWide) {
					await expect(description).toBeVisible();
					const artwork = (await tile.locator('[data-bento-artwork]').boundingBox())!;
					const copy = (await tile.locator('[data-bento-copy]').boundingBox())!;
					expect(artwork.x).toBeGreaterThanOrEqual(copy.x + copy.width - 1);
					expect(artwork.width / bounds.width).toBeCloseTo(0.6, 1);
					const media = (await tile.locator('[data-bento-media]').boundingBox())!;
					expect(media.height).toBeGreaterThanOrEqual(bounds.height - 8);
					expect(media.x).toBeLessThanOrEqual(bounds.x + 1);
					expect(media.x + media.width).toBeGreaterThanOrEqual(bounds.x + bounds.width - 1);
					const background = tile.locator(
						id === 'variable-data' ? '[data-qr-artwork]' : '[data-artwork-glow]'
					);
					const backgroundBounds = (await background.boundingBox())!;
					expect(backgroundBounds.width).toBeGreaterThanOrEqual(bounds.width - 1);
					if (id === 'synthetic-materials') {
						const weatherBounds = (await tile.locator('[data-weather-tag] canvas').boundingBox())!;
						expect(weatherBounds.width).toBeGreaterThanOrEqual(bounds.width - 1);
						expect(weatherBounds.x).toBeLessThanOrEqual(bounds.x + 1);
					}

					const subject = tile.locator(
						id === 'variable-data'
							? '[data-qr-code]'
							: id === 'full-color-printing'
								? '[data-print-preview]'
								: '[data-weather-subject]'
					);
					const subjectBounds = (await subject.boundingBox())!;
					expect(subjectBounds.x).toBeGreaterThanOrEqual(bounds.x + bounds.width * 0.39);
				} else {
					await expect(description).toBeHidden();
					const artwork = (await tile.locator('[data-bento-artwork]').boundingBox())!;
					const copy = (await tile.locator('[data-bento-copy]').boundingBox())!;
					expect(artwork.y).toBeGreaterThanOrEqual(copy.y + copy.height);
				}
				expect(await tile.evaluate((el) => el.scrollWidth <= el.clientWidth + 8)).toBe(true);
			}
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
	});
}
