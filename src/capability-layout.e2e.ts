import { expect, test } from '@playwright/test';

const routes = [
	'/stock-colors',
	'/shipping',
	'/variable-data',
	'/warehousing',
	'/full-color-printing',
	'/synthetic-materials',
	'/attachments'
];

for (const width of [390, 1440]) {
	test(`capability pages share title and closing CTA geometry at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		let reference: { size: string; left: number; top: string } | undefined;
		for (const route of routes) {
			await page.goto(`/capabilities${route}`, { waitUntil: 'domcontentloaded' });
			if (route && route !== '/attachments')
				await expect(page.locator('[data-topic-ready]')).toHaveAttribute(
					'data-topic-ready',
					'true'
				);
			const main = page.locator('main');
			await expect(main.locator('[data-content-layout]')).toHaveCount(1);
			await expect(main.locator('h1')).toHaveCount(1);
			const title = main.locator('[data-content-title]');
			const cta = main.locator('[data-content-cta]');
			await expect(title).toBeVisible();
			const geometry = await title.evaluate((el) => {
				const heading = el.querySelector('h1')!;
				return {
					size: getComputedStyle(heading).fontSize,
					left: heading.getBoundingClientRect().left,
					top: getComputedStyle(el.firstElementChild!).paddingTop
				};
			});
			reference ??= geometry;
			expect(geometry).toEqual(reference);
			expect(await main.evaluate((el) => el.scrollWidth <= innerWidth)).toBe(true);
			await expect(cta.locator('h2')).toHaveCount(1);
			expect(await cta.evaluate((el) => getComputedStyle(el).textAlign)).toBe('center');
			const order = await main.evaluate((el) => {
				const title = el.querySelector('[data-content-title]')!;
				const body = el.querySelector('[data-content-body]')!;
				const cta = el.querySelector('[data-content-cta]')!;
				return (
					!!(title.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING) &&
					!!(body.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING)
				);
			});
			expect(order).toBe(true);
		}
	});
}

test('stock sample requests and the homepage topic dialog retain their controls', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/capabilities/stock-colors', { waitUntil: 'domcontentloaded' });
	await expect(page.locator('[data-topic-ready]')).toHaveAttribute('data-topic-ready', 'true');
	await page.getByRole('button', { name: 'Request Samples', exact: true }).click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.goto('/', { waitUntil: 'domcontentloaded' });
	await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true');
	await page.locator('[data-bento-topic="colors"]').click();
	const dialog = page.getByRole('dialog');
	await expect(dialog.locator('[data-content-layout]')).toHaveCount(1);
	await expect(dialog.locator('#bento-dialog-heading')).toBeVisible();
	await expect(dialog.locator('[data-content-cta]')).toHaveCount(1);
});
