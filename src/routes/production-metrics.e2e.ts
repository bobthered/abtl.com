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
		await expect(links.first()).toHaveAttribute('aria-pressed', 'true');
		await expect(section.locator('[data-metric-animation]')).toHaveAttribute(
			'data-metric-animation',
			'0'
		);
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
		await expect(links.first()).toHaveAttribute('aria-pressed', 'true');
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

for (const width of [390, 1440]) {
	test(`abstract scenes switch on selection and respond to pointer and keyboard interaction at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
			timeout: 60000
		});
		const panel = page.locator('[data-metric-animation]');
		const canvas = panel.locator('canvas');
		const section = page.locator('[data-production-metrics]');
		const background = section.locator('[data-scene-background]');
		const bounds = await background.boundingBox();
		expect(bounds!.x).toBeCloseTo(0);
		expect(bounds!.width).toBe(width);
		const sectionBounds = await section.boundingBox();
		expect(bounds!.y).toBeCloseTo(sectionBounds!.y);
		expect(bounds!.height).toBeCloseTo(sectionBounds!.height);
		await expect(panel).toHaveCSS('padding-bottom', '0px');
		const images = new Set<string>();
		for (const [index, name] of [
			'Flow field',
			'Orbital ribbons',
			'Helical current',
			'Torus knot'
		].entries()) {
			const selector = page.locator(`[data-metric-index="${index}"]`);
			await selector.click();
			await expect(selector).toHaveAttribute('aria-pressed', 'true');
			await expect(panel).toHaveAttribute('data-metric-animation', String(index));
			await expect(canvas).toHaveAccessibleName(new RegExp(name));
			await canvas.scrollIntoViewIfNeeded();
			await expect
				.poll(() => canvas.evaluate((el) => (el as HTMLCanvasElement).width))
				.toBeGreaterThan(0);
			const before = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
			images.add(before);
			await canvas.click();
			await expect
				.poll(() => canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL()))
				.not.toBe(before);
			await canvas.focus();
			const beforeKey = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
			await canvas.press('ArrowRight');
			await canvas.press('Space');
			await expect
				.poll(() => canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL()))
				.not.toBe(beforeKey);
		}
		expect(images.size).toBe(4);
		expect(new URL(page.url()).pathname).toBe('/');
		await expect(panel.getByRole('button')).toHaveCount(0);
		await expect(panel.locator('p')).toHaveCount(0);
		expect(await panel.evaluate((el) => el.scrollWidth <= innerWidth)).toBe(true);
	});
}

test('points gather into a springy sphere before reaching the latest selected formation', async ({
	page
}, testInfo) => {
	await page.setViewportSize({ width: 1440, height: 1200 });
	await page.goto('/');
	await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const canvas = page.locator('[data-abstract-canvas]');
	await canvas.scrollIntoViewIfNeeded();
	const original = await canvas.elementHandle();
	await page.locator('[data-metric-index="2"]').click();
	await canvas.scrollIntoViewIfNeeded();
	await expect(canvas).toHaveAttribute('data-particle-phase', 'gather');
	await expect(canvas).toHaveAttribute('data-particle-count', '1200');
	await expect(canvas).toHaveAttribute('data-particle-phase', 'sphere');
	const extent = await canvas.evaluate((element) => {
		const el = element as HTMLCanvasElement;
		const pixels = el.getContext('2d')!.getImageData(0, 0, el.width, el.height).data;
		let minX = el.width,
			maxX = 0,
			minY = el.height,
			maxY = 0;
		for (let y = 0; y < el.height; y++)
			for (let x = 0; x < el.width; x++) {
				if (pixels[(y * el.width + x) * 4 + 3] > 10) {
					minX = Math.min(minX, x);
					maxX = Math.max(maxX, x);
					minY = Math.min(minY, y);
					maxY = Math.max(maxY, y);
				}
			}
		return { x: (maxX - minX) / el.width, y: (maxY - minY) / el.height };
	});
	expect(extent.x).toBeLessThan(0.5);
	expect(extent.y).toBeLessThan(0.7);
	await canvas.screenshot({ path: testInfo.outputPath('particle-sphere.png') });
	await expect(canvas).toHaveAttribute('data-particle-phase', 'release');
	await expect(canvas).toHaveAttribute('data-particle-phase', 'settled');
	await canvas.screenshot({ path: testInfo.outputPath('particle-helix.png') });
	await page.locator('[data-metric-index="1"]').click();
	await canvas.scrollIntoViewIfNeeded();
	await expect(canvas).toHaveAttribute('data-particle-phase', 'gather');
	await page.locator('[data-metric-index="3"]').click();
	await canvas.scrollIntoViewIfNeeded();
	await expect(page.locator('[data-metric-animation]')).toHaveAttribute(
		'data-metric-animation',
		'3'
	);
	await expect(canvas).toHaveAttribute('data-particle-phase', 'settled');
	expect(
		await original!.evaluate(
			(element) => element === document.querySelector('[data-abstract-canvas]')
		)
	).toBe(true);
	await canvas.screenshot({ path: testInfo.outputPath('particle-knot.png') });
});
