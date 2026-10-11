import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
	test(`brand marquee pauses on hover and drags both directions at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
			timeout: 60000
		});
		const section = page.locator('[data-hero-marquee]');
		const marquee = section.locator('[data-marquee]');
		const track = marquee.locator('[data-marquee-track]');
		await marquee.scrollIntoViewIfNeeded();
		await expect(section.getByRole('button')).toHaveCount(0);
		await expect.poll(() => track.evaluate((el) => el.getAnimations().length)).toBe(1);
		await page.mouse.move(0, 0);
		await expect
			.poll(() => track.evaluate((el) => el.getAnimations()[0].playState))
			.toBe('running');
		await marquee.hover();
		await expect.poll(() => track.evaluate((el) => el.getAnimations()[0].playState)).toBe('paused');
		const paused = await track.evaluate((el) => Number(el.getAnimations()[0].currentTime));
		await page.waitForTimeout(150);
		expect(await track.evaluate((el) => Number(el.getAnimations()[0].currentTime))).toBe(paused);
		const bounds = (await marquee.boundingBox())!;
		const x = bounds.x + bounds.width / 2;
		const y = bounds.y + bounds.height / 2;
		await page.mouse.move(x, y);
		await page.mouse.down();
		await page.mouse.move(x - 60, y, { steps: 8 });
		const draggedLeft = await track.evaluate((el) => Number(el.getAnimations()[0].currentTime));
		const duration = await track.evaluate((el) =>
			Number(el.getAnimations()[0].effect!.getTiming().duration)
		);
		expect((draggedLeft - paused + duration) % duration).toBeCloseTo(2500, -1);
		await page.mouse.move(x, y, { steps: 8 });
		expect(await track.evaluate((el) => Number(el.getAnimations()[0].currentTime))).toBeCloseTo(
			paused,
			0
		);
		await page.mouse.up();
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await expect.poll(() => track.evaluate((el) => el.getAnimations()[0].playState)).toBe('paused');
		await marquee.focus();
		await marquee.press('ArrowRight');
		expect(await track.evaluate((el) => Number(el.getAnimations()[0].currentTime))).not.toBe(
			paused
		);
		expect(await section.evaluate((el) => el.scrollWidth <= innerWidth)).toBe(true);
	});
}
