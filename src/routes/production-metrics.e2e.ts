import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
	test(`metrics highlight follows hover and keyboard focus at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
			timeout: 60000
		});
		const section = page.locator('[data-production-metrics]');
		await section.scrollIntoViewIfNeeded();
		const links = section.locator('[data-metric-index]');
		const highlight = section.locator('[data-metric-highlight]');
		await expect(links).toHaveCount(4);
		await expect(links.nth(2).locator('[data-count-up]')).toHaveAttribute(
			'data-scroll-reveal-state',
			'complete'
		);
		await expect(links.nth(2).locator('[data-count-up]')).toHaveText('21');
		await expect(links.nth(0)).toHaveAccessibleName(/Over 90 million/);
		await expect(links.nth(1)).toHaveAttribute('href', '/tags/shipping');
		await expect(links.nth(2)).toHaveAttribute('href', '/tags/stock-colors');
		await expect(links.nth(3)).toHaveAttribute('href', '/tags/full-color-printing');
		await page.mouse.move(0, 0);
		await links.first().focus();
		await expect(links.first()).toHaveAttribute('data-active', 'true');
		await expect
			.poll(async () =>
				Math.abs((await highlight.boundingBox())!.x - (await links.first().boundingBox())!.x)
			)
			.toBeLessThan(2);
		const start = (await highlight.boundingBox())!.x;
		await links.last().hover();
		await expect(links.last()).toHaveAttribute('data-active', 'true');
		await expect
			.poll(async () =>
				Math.abs((await highlight.boundingBox())!.x - (await links.last().boundingBox())!.x)
			)
			.toBeLessThan(2);
		expect((await highlight.boundingBox())!.x).toBeGreaterThan(start);
		await links.nth(2).focus();
		await expect(links.nth(2)).toHaveAttribute('data-active', 'true');
		await expect
			.poll(async () =>
				Math.abs((await highlight.boundingBox())!.y - (await links.nth(2).boundingBox())!.y)
			)
			.toBeLessThan(2);
		await expect(links.nth(2)).toHaveCSS('outline-offset', '4px');
		expect(await section.evaluate((el) => el.scrollWidth <= innerWidth)).toBe(true);
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await expect(highlight).toHaveCSS('transition-property', 'none');
		await links.nth(1).focus();
		await expect(links.nth(1)).toHaveAttribute('data-active', 'true');
		await expect
			.poll(async () =>
				Math.abs((await highlight.boundingBox())!.x - (await links.nth(1).boundingBox())!.x)
			)
			.toBeLessThan(2);
	});
}
