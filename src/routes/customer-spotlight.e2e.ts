import { expect, test } from '@playwright/test';

for (const [width, count] of [
	[390, 2],
	[800, 3],
	[1440, 5]
]) {
	test(`spotlight uses golden proportions and cycles its stories at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
			timeout: 60000
		});
		const section = page.locator('[data-customer-spotlight]');
		await section.scrollIntoViewIfNeeded();
		await expect(section.getByText('1 / 6', { exact: true })).toBeVisible();
		const slides = section.locator('[data-spotlight-image]');
		await expect(slides.filter({ visible: true })).toHaveCount(count);
		const widths = await slides.evaluateAll((nodes) =>
			nodes.map((node) => node.getBoundingClientRect().width)
		);
		for (let index = 1; index < count; index++) {
			expect(widths[index - 1] / widths[index]).toBeCloseTo((1 + Math.sqrt(5)) / 2, 2);
		}
		const next = section.getByRole('button', { name: 'Next customer', exact: true });
		await next.focus();
		const collapsingFrames = await next.evaluate((button) => {
			(button as HTMLButtonElement).click();
			const leading = document.querySelector('[data-spotlight-track]')!.firstElementChild!;
			const animation = leading
				.getAnimations()
				.find((item) =>
					(item.effect as KeyframeEffect)
						.getKeyframes()
						.some((frame) => frame.flexGrow !== undefined)
				);
			return animation
				? (animation.effect as KeyframeEffect).getKeyframes().map((frame) => frame.flexGrow)
				: [];
		});
		expect(collapsingFrames).toEqual(['1', '0']);
		await expect(slides.first()).toHaveAttribute('data-spotlight-image', 'nursery');
		await expect(section.locator('[data-spotlight-story]')).toContainText('A little detail.');
		await expect(slides.last()).toHaveAttribute('data-spotlight-image', 'equipment');
		await expect(next).toHaveAttribute('aria-disabled', 'false');
		await expect(next).toBeFocused();
		await section.getByRole('button', { name: 'Previous customer' }).click();
		await expect(section.locator('[data-spotlight-story]')).toContainText('Every inspection');
		await expect(slides.first()).toHaveAttribute('data-spotlight-image', 'equipment');
		await expect(next).toHaveAttribute('aria-disabled', 'false');
		await next.focus();
		await page.keyboard.press('ArrowRight');
		await expect(section.locator('[data-spotlight-story]')).toContainText('A little detail.');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}

test('spotlight wraps and respects reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
	await page.goto('/');
	await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const section = page.locator('[data-customer-spotlight]');
	await section.scrollIntoViewIfNeeded();
	const next = section.getByRole('button', { name: 'Next customer', exact: true });
	for (let index = 0; index < 6; index++) {
		await next.click();
		await expect(next).toHaveAttribute('aria-disabled', 'false');
	}
	await expect(section.locator('[data-spotlight-story]')).toContainText('Every inspection');
	await expect(section.locator('[data-spotlight-image]').first()).toHaveAttribute(
		'data-spotlight-image',
		'equipment'
	);
	expect(
		await section
			.locator('[data-spotlight-track]')
			.evaluate((track) => track.getAnimations({ subtree: true }).length)
	).toBe(0);
});
