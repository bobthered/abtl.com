import { expect, test } from '@playwright/test';
import { selectBentoTopics } from './_test/bento';
import { topics } from '../lib/data/topics.js';

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
	const seen = new Set(serverOrder);
	for (let index = 0; index < 24; index++) {
		const response = await request.get('/');
		const ids = [...(await response.text()).matchAll(/data-bento-topic="([^"]+)"/g)].map(
			(match) => match[1]
		);
		expect(ids).toHaveLength(6);
		expect(new Set(ids).size).toBe(6);
		for (const id of ids) {
			expect(topics.some((topic) => topic.id === id)).toBe(true);
			seen.add(id);
		}
		orders.add(ids.join(','));
	}
	expect(orders.size).toBeGreaterThan(1);
	expect([...seen].sort()).toEqual(topics.map((topic) => topic.id).sort());
});

for (const span of [2, 4, 6]) {
	test(
		'every animation renders and responds at ' + span + '/6 width',
		async ({ page }, testInfo) => {
			await page.setViewportSize({ width: 1440, height: 1000 });
			await selectBentoTopics(
				page,
				topics.filter((topic) => topic.id !== 'attachments').map((topic) => topic.id)
			);
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
				await tile.evaluate((element) =>
					element.scrollIntoView({ block: 'center', behavior: 'instant' })
				);
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
					const resting = await globe.boundingBox();
					const before = (await globe.screenshot()).toString('base64');
					await tile.hover();
					// The globe moves inside a fixed viewport; CSS scale is intentionally unchanged.
					await expect
						.poll(async () => (await globe.screenshot()).toString('base64'))
						.not.toBe(before);
					const hovered = await globe.boundingBox();
					expect(hovered!.width).toBe(resting!.width);
					expect(hovered!.height).toBe(resting!.height);
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

for (const width of [390, 1440]) {
	test(`attachment fan preserves geometry, keyboard motion and route content at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 1000 });
		await selectBentoTopics(page, ['attachments']);
		await page.goto('/');
		const tile = page.locator('[data-bento-topic="attachments"]');
		await tile.scrollIntoViewIfNeeded();
		await expect(tile.locator('[data-attachment-fan]')).toHaveCount(5);
		for (const span of width === 1440 ? [2, 4, 6] : [0]) {
			if (span)
				await tile.evaluate((element, span) => {
					element.classList.remove('lg:col-span-2', 'lg:col-span-4', 'lg:col-span-6');
					element.classList.add('lg:col-span-' + span);
				}, span);
			await page.mouse.move(0, 0);
			await tile.evaluate((element: HTMLElement) => element.blur());
			const fan = tile.locator('[data-attachment-fan="patch"]');
			const media = tile.locator('[data-bento-media]');
			const bounds = await media.boundingBox();
			await expect(fan).toHaveCSS('translate', '-56px');
			await tile.hover();
			await expect(fan).toHaveCSS('translate', '-96px');
			await page.mouse.move(0, 0);
			await expect(fan).toHaveCSS('translate', '-56px');
			await tile.focus();
			await expect(fan).toHaveCSS('translate', '-96px');
			const focused = await media.boundingBox();
			expect(focused!.width).toBe(bounds!.width);
			expect(focused!.height).toBe(bounds!.height);
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await expect(fan).toHaveCSS('translate', '-56px');
			await page.emulateMedia({ reducedMotion: 'no-preference' });
		}
		await tile.press('Enter');
		await expect(page).toHaveURL(/\/capabilities\/attachments$/);
		const dialog = page.locator('[data-bento-dialog]');
		await expect(dialog).toBeVisible();
		await expect(dialog.locator('[data-attachment-section]')).toHaveCount(5);
		await page.keyboard.press('Escape');
		await expect(dialog).toHaveCount(0);
		await expect(tile).toBeFocused();
		await page.goto('/capabilities/attachments');
		await expect(page.locator('h1')).toContainText('Small details.');
		await expect(page.locator('[data-attachment-section]')).toHaveCount(5);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
	});
}
