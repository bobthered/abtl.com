import { expect, test } from '@playwright/test';

test('random orders preserve SSR, hydration, slot widths and dialog return order', async ({
	page,
	request
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const response = await page.goto('/');
	const html = await response!.text();
	const serverOrder = [...html.matchAll(/data-bento-topic="([^"]+)"/g)].map((match) => match[1]);
	await expect(page.locator('[data-bento-ready="true"]')).toBeVisible();
	const tiles = page.locator('[data-bento-topic]');
	const readOrder = () =>
		tiles.evaluateAll((elements) =>
			elements.map((element) => element.getAttribute('data-bento-topic'))
		);
	expect(await readOrder()).toEqual(serverOrder);
	expect(new Set(serverOrder).size).toBe(6);
	for (let index = 0; index < 6; index++) {
		await expect(tiles.nth(index)).toHaveCSS(
			'grid-column-end',
			'span ' + [4, 2, 2, 2, 2, 6][index]
		);
	}
	await tiles.first().click();
	await expect(page.locator('[data-bento-dialog]')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.locator('[data-bento-dialog]')).toHaveCount(0);
	expect(await readOrder()).toEqual(serverOrder);
	const orders = new Set([serverOrder.join(',')]);
	for (let index = 0; index < 5; index++) {
		const response = await request.get('/');
		const ids = [...(await response.text()).matchAll(/data-bento-topic="([^"]+)"/g)].map(
			(match) => match[1]
		);
		expect([...ids].sort()).toEqual([...serverOrder].sort());
		orders.add(ids.join(','));
	}
	expect(orders.size).toBeGreaterThan(1);
});

for (const span of [2, 4, 6]) {
	test(
		'every animation renders and responds at ' + span + '/6 width',
		async ({ page }, testInfo) => {
			await page.setViewportSize({ width: 1440, height: 1000 });
			await page.goto('/');
			await expect(page.locator('[data-bento-ready="true"]')).toBeVisible();
			// Exercise every artwork in each actual desktop slot width, including resize observers.
			await page.locator('[data-bento-topic]').evaluateAll((elements, span) => {
				for (const element of elements) {
					element.classList.remove('lg:col-span-2', 'lg:col-span-4', 'lg:col-span-6');
					element.classList.add('lg:col-span-' + span);
				}
			}, span);
			for (const id of [
				'colors',
				'shipping',
				'variable-data',
				'full-color-printing',
				'synthetic-materials',
				'warehousing'
			]) {
				const tile = page.locator('[data-bento-topic="' + id + '"]');
				await tile.scrollIntoViewIfNeeded();
				await page.mouse.move(0, 0);
				await expect(tile).toHaveCSS('opacity', '1');
				if (id === 'colors') {
					await expect(tile.locator('[data-stock-columns]')).toHaveCSS('opacity', '1');
					await tile.hover();
					await expect
						.poll(() =>
							tile
								.locator('[data-stock-column-track]')
								.first()
								.evaluate((element) => element.getAnimations()[0]?.playbackRate ?? 0)
						)
						.toBeGreaterThan(2);
				} else if (id === 'shipping') {
					await expect(tile.locator('[data-globe-ready="true"]')).toBeVisible();
					const globe = tile.locator('[data-shipping-globe]');
					const resting = await globe.evaluate((element) => getComputedStyle(element).scale);
					await tile.hover();
					await expect
						.poll(() => globe.evaluate((element) => getComputedStyle(element).scale))
						.not.toBe(resting);
				} else {
					const canvas = tile.locator(id === 'variable-data' ? '[data-qr-scan]' : 'canvas').last();
					if (id === 'full-color-printing') {
						await expect(tile.locator('[data-print-ready]')).toHaveAttribute(
							'data-print-ready',
							'true'
						);
						await expect(tile.locator('[data-print-motion]')).toHaveAttribute(
							'data-print-motion',
							'static'
						);
					}
					const before = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
					await tile.hover();
					await expect
						.poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()))
						.not.toBe(before);
					await expect
						.poll(() =>
							canvas.evaluate((element: HTMLCanvasElement) => {
								const bounds = element.getBoundingClientRect();
								return (
									bounds.width > 0 && bounds.height > 0 && element.width > 0 && element.height > 0
								);
							})
						)
						.toBe(true);
				}
				const code = tile.locator('[data-qr-code]');
				if (await code.count()) {
					const art = await code.boundingBox();
					const bounds = await tile.boundingBox();
					expect(art!.x).toBeGreaterThanOrEqual(bounds!.x);
					expect(art!.x + art!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width);
				}
			}
			await page.mouse.move(0, 0);
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440);
			await page
				.locator('[data-bento-section]')
				.screenshot({ path: testInfo.outputPath('all-artwork.png') });
		}
	);
}
