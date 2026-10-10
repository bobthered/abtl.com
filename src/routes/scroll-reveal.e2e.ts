import { expect, test } from '@playwright/test';

test('new content reveals once, staggers a row, and counts up without layout overflow', async ({
	page
}) => {
	await page.setViewportSize({ width: 1200, height: 900 });
	await page.goto('/');
	await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await page.evaluate(() => {
		const row = document.createElement('div');
		row.className = 'grid grid-cols-3 gap-4';
		row.dataset.revealTest = 'true';
		for (let index = 0; index < 3; index++) {
			const item = document.createElement('div');
			item.dataset.scrollReveal = '';
			item.className = 'h-40';
			item.textContent = `Item ${index}`;
			row.append(item);
		}
		const counter = document.createElement('span');
		counter.dataset.countUp = '10000';
		counter.textContent = '10,000';
		counter.setAttribute('aria-label', '10,000');
		row.append(counter);
		document.querySelector('main')!.append(row);
	});
	const row = page.locator('[data-reveal-test]');
	await row.scrollIntoViewIfNeeded();
	const items = row.locator('[data-scroll-reveal]');
	await expect(items.first()).toHaveAttribute('data-scroll-reveal-state', 'complete');
	expect(
		await items.evaluateAll((elements) =>
			elements.map((element) => element.getAttribute('data-scroll-reveal-delay'))
		)
	).toEqual(['0', '70', '140']);
	const counter = row.locator('[data-count-up]');
	await expect
		.poll(async () => Number((await counter.textContent())!.replaceAll(',', '')))
		.toBeLessThan(10000);
	await expect(counter).toHaveText('10,000');
	await expect(counter).toHaveAttribute('aria-label', '10,000');
	await page.evaluate(() => window.scrollTo(0, 0));
	await row.scrollIntoViewIfNeeded();
	expect(await items.first().evaluate((element) => element.getAnimations().length)).toBe(0);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1200);
});

test('reduced motion finishes active counts and applies to newly opened dialogs', async ({
	page
}) => {
	await page.goto('/tags/stock-colors');
	const count = page.locator('[data-stock-color-total]');
	await count.scrollIntoViewIfNeeded();
	await expect(count).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await expect.poll(async () => Number(await count.textContent())).toBeLessThan(21);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(count).toHaveText('21');
	expect(await count.evaluate((element) => element.getAnimations().length)).toBe(0);
	await page.goto('/');
	await expect(page.locator('[data-bento-ready="true"]')).toBeVisible();
	await page.locator('[data-bento-topic="shipping"]').click();
	const dialog = page.getByRole('dialog', { name: 'Your tags. A world of possibilities.' });
	const states = dialog.locator('[data-shipping-state-count]');
	await states.scrollIntoViewIfNeeded();
	await expect(states).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await expect(states).toHaveText('50');
	expect(await states.evaluate((element) => element.getAnimations().length)).toBe(0);
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
});

test('content and final numbers remain available without JavaScript', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/tags/stock-colors');
	await expect(page.locator('main h1')).toBeVisible();
	await expect(page.locator('[data-stock-color-total]')).toHaveText('21');
	await context.close();
});
