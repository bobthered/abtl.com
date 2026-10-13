import { expect, test } from '@playwright/test';

const routes = [
	'products',
	'markets',
	'capabilities',
	'about',
	'news',
	'contact',
	'careers',
	'resources'
];

test('navigation pages render with real links and a sign-in placeholder', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 1440, height: 1000 });
	for (const route of routes) {
		const response = await page.goto(`/${route}`);
		expect(response?.status()).toBe(200);
		await expect(page.locator('main h1')).toBeVisible();
		await expect(page).toHaveTitle(
			`${route[0].toUpperCase()}${route.slice(1)} | Allen-Bailey Tag & Label`
		);
		for (const destination of routes)
			await expect(
				page
					.getByRole('navigation', { name: 'Main navigation', exact: true })
					.locator(`a[href="/${destination}"]`)
			).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Sign In (coming soon)', exact: true })
		).toBeDisabled();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	}
	await expect(page.locator('header')).not.toContainText('Request a Quote');
});

test('compact navigation reaches pages and closes after selection', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/products');
	await page.waitForFunction(() =>
		document.getAnimations().some((animation) => animation.id === 'illustration-float')
	);
	await page.getByRole('button', { name: 'Open navigation menu' }).click();
	const navigation = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
	for (const route of routes) await expect(navigation.locator(`a[href="/${route}"]`)).toBeVisible();
	await navigation.getByRole('link', { name: 'Markets', exact: true }).click();
	await expect(page).toHaveURL(/\/markets$/);
	await expect(navigation).not.toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('landing pages fit compact screens in dark mode', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 375, height: 812 });
	for (const route of routes.filter((route) => route !== 'news')) {
		await page.goto(`/${route}`);
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		await expect(page.locator('main h1')).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	}
	await page.screenshot({ path: 'test-results/navigation-dark-mobile.png' });
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/products');
	await expect(
		page.getByRole('navigation', { name: 'Main navigation', exact: true })
	).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.screenshot({ path: 'test-results/navigation-desktop.png' });
});
