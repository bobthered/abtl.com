import { expect, test } from '@playwright/test';

const preferences = [
	{ savedMode: 'dark', systemMode: 'light', expectedMode: 'dark' },
	{ savedMode: 'light', systemMode: 'dark', expectedMode: 'light' },
	{ savedMode: null, systemMode: 'dark', expectedMode: 'dark' },
	{ savedMode: null, systemMode: 'light', expectedMode: 'light' },
	{ savedMode: 'invalid', systemMode: 'dark', expectedMode: 'dark' }
] as const;

for (const { savedMode, systemMode, expectedMode } of preferences) {
	test(`applies ${expectedMode} before hydration with saved ${savedMode} and system ${systemMode}`, async ({
		page
	}) => {
		await page.emulateMedia({ colorScheme: systemMode });
		await page.addInitScript((savedMode) => {
			if (savedMode === null) localStorage.removeItem('theme');
			else localStorage.setItem('theme', savedMode);
		}, savedMode);
		// Prevent application scripts from loading: the document must choose its theme independently.
		await page.route('**/*', (route) =>
			route.request().resourceType() === 'script' ? route.abort() : route.continue()
		);
		await page.goto('/news', { waitUntil: 'domcontentloaded' });
		await expect(page.locator('html')).toHaveAttribute('data-theme', expectedMode);
		expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(expectedMode);
	});
}

test('uses the system theme before hydration when storage is blocked', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.addInitScript(() => {
		Object.defineProperty(window, 'localStorage', {
			get: () => {
				throw new DOMException('Storage blocked', 'SecurityError');
			}
		});
	});
	await page.route('**/*', (route) =>
		route.request().resourceType() === 'script' ? route.abort() : route.continue()
	);
	await page.goto('/news', { waitUntil: 'domcontentloaded' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	// Aborted application imports can reject; the preference bootstrap must not throw.
	expect(
		errors.filter((message) => !message.startsWith('Failed to fetch dynamically imported module:'))
	).toEqual([]);
});

test('preserves the early dark theme through hydration and navigation', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
	await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
	await page.goto('/news', { waitUntil: 'domcontentloaded' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', /favicon-dark|%230a080c/i);
	await page
		.getByRole('link', { name: 'Allen-Bailey Tag and Label home', exact: true })
		.first()
		.click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	expect(errors).toEqual([]);
});
