import { expect, test } from '@playwright/test';

const topics = ['stock-colors', 'printing', 'materials', 'shapes', 'formats', 'numbering'];

test('opens route-backed dialogs and preserves the gallery through history navigation', async ({
	page
}) => {
	await page.goto('/');
	// Before hydration, real links intentionally navigate to the standalone page.
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true');
	const trigger = page.locator('[data-bento-topic="printing"]');
	await trigger.scrollIntoViewIfNeeded();
	await expect(trigger).toHaveAttribute('href', '/tags/printing');
	await trigger.click();
	await expect(page).toHaveURL(/\/tags\/printing$/);
	await expect(page.getByRole('dialog', { name: 'Make your mark.' })).toBeVisible();
	await expect(page.locator('[data-bento-section]')).toBeAttached();
	// Playwright may scroll the large tile again before clicking it. Capture the position at opening.
	const scroll = await page.evaluate(() => window.scrollY);
	await expect(page).toHaveTitle('Printing | Tags | Allen-Bailey Tag & Label');
	await page.goBack();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page).toHaveURL(/\/$/);
	await expect(trigger).toBeFocused();
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scroll, 0);
	await page.goForward();
	await expect(page).toHaveURL(/\/tags\/printing$/);
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.getByRole('button', { name: 'Close topic', exact: true }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await trigger.click();
	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await trigger.click();
	await page.getByRole('dialog').click({ position: { x: 4, y: 4 } });
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('refreshing an open dialog renders the standalone topic', async ({ page }) => {
	await page.goto('/');
	// Before hydration, real links intentionally navigate to the standalone page.
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true');
	await expect(page.locator('[data-bento-topic="colors"]')).toHaveAttribute(
		'href',
		'/tags/stock-colors'
	);
	await page.locator('[data-bento-topic="colors"]').click();
	await expect(page.getByRole('dialog', { name: 'What color will you choose?' })).toBeVisible();
	await expect(page).toHaveURL(/\/tags\/stock-colors$/);
	await page.reload();
	await expect(
		page.getByRole('heading', { level: 1, name: 'What color will you choose?' })
	).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page.locator('[data-bento-section]')).toHaveCount(0);
	await expect(page.locator('header')).toBeVisible();
	await expect(page.locator('footer')).toBeAttached();
});

test('modified link clicks open standalone content in a new tab', async ({ page, context }) => {
	await page.goto('/');
	// Before hydration, real links intentionally navigate to the standalone page.
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true');
	const popup = context.waitForEvent('page');
	await page.locator('[data-bento-topic="printing"]').click({ modifiers: ['ControlOrMeta'] });
	const standalone = await popup;
	await standalone.waitForLoadState();
	await expect(standalone).toHaveURL(/\/tags\/printing$/);
	await expect(
		standalone.getByRole('heading', { level: 1, name: 'Make your mark.' })
	).toBeVisible();
	await expect(standalone.getByRole('dialog')).toHaveCount(0);
	await expect(page).toHaveURL(/\/$/);
});

for (const topic of topics) {
	test(`serves ${topic} directly without JavaScript`, async ({ browser }) => {
		const context = await browser.newContext({ javaScriptEnabled: false });
		const page = await context.newPage();
		try {
			const response = await page.goto(`http://localhost:4173/tags/${topic}`);
			expect(response?.status()).toBe(200);
			await expect(page.locator('h1')).toBeVisible();
			await expect(page.getByRole('dialog')).toHaveCount(0);
		} finally {
			await context.close();
		}
	});
}

test('returns a real 404 for unknown topics', async ({ request }) => {
	const response = await request.get('/tags/unknown');
	expect(response.status()).toBe(404);
});

test('mobile back navigation dismisses the dialog and forward restores it', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	// Before hydration, real links intentionally navigate to the standalone page.
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true');
	const trigger = page.locator('[data-bento-topic="numbering"]');
	await trigger.click();
	await expect(page).toHaveURL(/\/tags\/numbering$/);
	await expect(page.getByRole('dialog', { name: 'Keep every number in order.' })).toBeVisible();
	await page.goBack();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(trigger).toBeFocused();
	await page.goForward();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.getByRole('button', { name: 'Close topic', exact: true }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('standalone color marquees fill the viewport without horizontal overflow', async ({
	page
}) => {
	await page.goto('/tags/stock-colors');
	await expect(
		page.getByRole('heading', { level: 1, name: 'What color will you choose?' })
	).toBeVisible();
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
		const marquees = page.locator('main [data-marquee]');
		await expect(marquees).toHaveCount(1);
		for (const marquee of await marquees.all()) {
			const bounds = await marquee.boundingBox();
			expect(bounds?.x).toBeCloseTo(0, 0);
			expect(bounds?.width).toBeCloseTo(viewportWidth, 0);
		}
		const samples = await page.locator('[data-color-section="samples"]').boundingBox();
		expect(samples?.x).toBeCloseTo(0, 0);
		expect(samples?.width).toBeCloseTo(viewportWidth, 0);
		const divider = await page.locator('[data-color-divider]').boundingBox();
		const heading = await page.locator('#bento-dialog-heading').boundingBox();
		expect(divider?.x).toBeCloseTo(heading!.x, 0);
		expect(divider?.width).toBeCloseTo(heading!.width, 0);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewportWidth);
	}
});

test('redirects the former color route to stock colors and preserves query parameters', async ({
	request
}) => {
	const response = await request.get('/tags/colors?source=sample', { maxRedirects: 0 });
	expect(response.status()).toBe(308);
	expect(response.headers().location).toBe('/tags/stock-colors?source=sample');
});

test('mobile sample picker keeps selections compact and its request action visible', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/tags/stock-colors');
	await expect(page.locator('[data-topic-ready]')).toHaveAttribute('data-topic-ready', 'true');
	const trigger = page.getByRole('button', { name: 'Request Samples', exact: true }).first();
	await trigger.click();
	const picker = page.getByRole('dialog', { name: 'Request Samples', exact: true });
	await expect(picker).toBeVisible();
	await expect(picker.locator('[data-stock-swatch]')).toHaveCount(21);
	await picker.getByRole('button', { name: 'Select all', exact: true }).click();
	await expect(picker.locator('[data-stock-swatch][aria-pressed="true"]')).toHaveCount(21);
	const request = picker.getByRole('link', { name: 'Email sample request' });
	await expect(request).toBeInViewport();
	const bounds = await picker.locator('[data-sample-picker-card]').boundingBox();
	expect(bounds!.width).toBeLessThanOrEqual(390 - 32);
	expect(bounds!.height).toBeLessThanOrEqual(844 - 32);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
	await page.keyboard.press('Escape');
	await expect(picker).toHaveCount(0);
	await expect(trigger).toBeFocused();
});
