import { expect, test } from '@playwright/test';
import sharp from 'sharp';

test.use({ launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } });

for (const colorScheme of ['light', 'dark'] as const) {
	test(`shipping bento land remains visible at every slot width in ${colorScheme} mode`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready="true"]')).toBeVisible();
		const tile = page.locator('[data-bento-topic="shipping"]');
		await tile.scrollIntoViewIfNeeded();
		await expect(tile.locator('[data-globe-ready=true]')).toBeVisible({ timeout: 60000 });
		for (const span of [2, 4, 6]) {
			await tile.evaluate((element, span) => {
				element.classList.remove('lg:col-span-2', 'lg:col-span-4', 'lg:col-span-6');
				element.classList.add(`lg:col-span-${span}`);
			}, span);
			const canvas = tile.locator('[data-shipping-globe] canvas');
			await expect
				.poll(() =>
					canvas.evaluate((element: HTMLCanvasElement) => element.width >= element.clientWidth)
				)
				.toBe(true);
			const screenshot = await canvas.screenshot({
				path: `test-results/shipping-${colorScheme}-${span}.png`
			});
			const { data, info } = await sharp(screenshot)
				.removeAlpha()
				.raw()
				.toBuffer({ resolveWithObject: true });
			let landPixels = 0;
			// The lower third contains land, away from the dense North American shipment rings.
			for (let y = Math.floor((info.height * 2) / 3); y < info.height; y++) {
				for (let x = 0; x < info.width; x++) {
					const offset = (y * info.width + x) * info.channels;
					const [r, g, b] = data.subarray(offset, offset + 3);
					if (b > g * 1.25 && b > r * 0.85 && b > 90) landPixels++;
				}
			}
			expect(landPixels).toBeGreaterThan(50);
		}
	});
}
