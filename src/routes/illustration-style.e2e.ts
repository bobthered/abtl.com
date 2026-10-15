import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
	test(`illustrations share the stock-color studio background and floating motion in ${colorScheme} mode`, async ({
		page
	}, testInfo) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.emulateMedia({ colorScheme, reducedMotion: 'no-preference' });
		await page.goto('/capabilities/stock-colors', { waitUntil: 'domcontentloaded' });
		const reference = page.locator('[data-illustration-surface]');
		await reference.scrollIntoViewIfNeeded();
		const background = await reference.evaluate(
			(element) => getComputedStyle(element).backgroundImage
		);
		expect(background).not.toBe('none');
		for (const [route, count] of [
			['synthetic-materials', 2],
			['full-color-printing', 2]
		] as const) {
			await page.goto(`/capabilities/${route}`, { waitUntil: 'domcontentloaded' });
			const surfaces = page.locator('[data-illustration-surface]');
			await expect(surfaces).toHaveCount(count);
			for (let index = 0; index < count; index++) {
				const surface = surfaces.nth(index);
				await surface.scrollIntoViewIfNeeded();
				await page.mouse.move(0, 0);
				expect(await surface.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe(
					background
				);
				await expect
					.poll(() =>
						surface.evaluate(
							(element) =>
								element
									.getAnimations({ subtree: true })
									.filter(
										(animation) =>
											animation.id === 'illustration-float' && animation.playState === 'running'
									).length
						)
					)
					.toBe(1);
				await surface.screenshot({ path: testInfo.outputPath(`${route}-${index}.png`) });
			}
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await expect
				.poll(() =>
					surfaces.evaluateAll(
						(elements) =>
							elements
								.flatMap((element) => element.getAnimations({ subtree: true }))
								.filter(
									(animation) =>
										animation.id === 'illustration-float' && animation.playState === 'running'
								).length
					)
				)
				.toBe(0);
			await page.setViewportSize({ width: 390, height: 844 });
			for (const surface of await surfaces.all()) {
				await surface.scrollIntoViewIfNeeded();
				expect(await surface.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe(
					background
				);
			}
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
			if (route === 'synthetic-materials') {
				const wind = page.getByRole('slider', { name: 'Wind strength' });
				const thumb = page.locator('[data-wind-thumb]');
				const thumbStyle = await thumb.evaluate((node, isDark) => {
					const style = getComputedStyle(node);
					const bounds = node.getBoundingClientRect();
					return {
						isCircular:
							bounds.width === bounds.height && parseFloat(style.borderRadius) >= bounds.width / 2,
						isPrimary:
							style.backgroundColor ===
							getComputedStyle(
								node
									.closest('[class]')!
									.parentElement!.parentElement!.querySelector('[data-range-fill]')!
							).backgroundColor,
						isRingContrasting:
							style.getPropertyValue('--tw-ring-color').trim() ===
							getComputedStyle(document.documentElement)
								.getPropertyValue(isDark ? '--color-gray-50' : '--color-gray-950')
								.trim()
					};
				}, colorScheme === 'dark');
				expect(thumbStyle).toEqual({ isCircular: true, isPrimary: true, isRingContrasting: true });
				const sliderBounds = (await wind.boundingBox())!;
				const studioBounds = (await page
					.locator('[data-illustration-surface]')
					.first()
					.boundingBox())!;
				expect(sliderBounds.width).toBeCloseTo(studioBounds.width - 48, 0);
				expect(sliderBounds.x - studioBounds.x).toBeCloseTo(24, 0);
				await wind.fill('100');
				await expect(wind).toHaveValue('100');
				await expect(page.locator('[data-weather-tag]').first()).toHaveAttribute(
					'data-weather-wind',
					'100'
				);
				await wind.fill('35');
				await expect(page.locator('[data-weather-tag]').first()).toHaveAttribute(
					'data-weather-wind',
					'35'
				);
				await wind.focus();
				await page.keyboard.press('ArrowRight');
				await expect(wind).toHaveValue('36');
				await expect(page.locator('[data-synthetic-section="attachments"]')).toHaveCount(0);
			} else {
				await page.locator('[data-process-ink="C"]').click();
				await expect(page.locator('[data-process-count]')).toContainText('3 of 4');
				await page.locator('[data-process-flip]').click();
				await expect(page.locator('[data-process-side]')).toContainText('Back');
				await expect(page.locator('[data-print-backdrop]')).toHaveCount(0);
			}
			await page.setViewportSize({ width: 1440, height: 900 });
			await page.emulateMedia({ reducedMotion: 'no-preference' });
		}
	});
}
