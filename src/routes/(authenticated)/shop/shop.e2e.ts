import { expect, test } from '@playwright/test';

// Native POST login must work without client JavaScript as well.
test('demo sign-in, protected access, and sign-out work without JavaScript', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
	try {
		const page = await context.newPage();
		await page.goto('/shop/fire-suppression');
		await expect(page).toHaveURL(/\/sign-in$/);
		await page.getByLabel('Work email').fill('beta@example.com');
		await page.getByLabel('Password').fill('incorrect');
		await page.getByRole('button', { name: 'Sign in', exact: true }).click();
		await expect(page.getByRole('alert')).toContainText('incorrect');
		await page.getByLabel('Work email').fill('beta@example.com');
		await page.getByLabel('Password').fill('FireBeta2026!');
		await page.getByRole('button', { name: 'Sign in', exact: true }).click();
		await expect(page).toHaveURL(/\/shop$/);
		await expect(page.getByRole('heading', { name: 'Reorder your products.' })).toBeVisible();
		const cookie = (await context.cookies()).find((entry) => entry.name === 'abtl-demo-session');
		expect(cookie?.httpOnly).toBe(true);
		expect(cookie?.sameSite).toBe('Lax');
		expect(cookie!.expires - Date.now() / 1000).toBeGreaterThan(29 * 24 * 60 * 60);
		await page.reload();
		await expect(page).toHaveURL(/\/shop$/);
		await context.request.post('/account/sign-out');
		await page.goto('/shop/fire-suppression');
		await expect(page).toHaveURL(/\/sign-in$/);
	} finally {
		await context.close();
	}
});

test('remote sign-in enhances the form and route-group protection covers signed-out POSTs', async ({
	page,
	request,
	baseURL
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const response = await request.post('/shop?/reorder', {
		form: { orderId: 'demo-inspection', quantity: '1' },
		headers: { origin: baseURL! },
		maxRedirects: 0
	});
	// SvelteKit serializes action redirects for non-HTML action requests.
	expect(await response.json()).toMatchObject({
		type: 'redirect',
		status: 303,
		location: '/sign-in'
	});
	await page.goto('/account/sign-in');
	await expect(page).toHaveURL(/\/sign-in$/);
	await expect(page.locator('[data-sign-in-ready]')).toHaveAttribute('data-sign-in-ready', 'true');
	await page.getByLabel('Work email').fill('beta@example.com');
	await page.getByLabel('Password').fill('wrong-password');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('incorrect');
	await page.getByLabel('Work email').fill('beta@example.com');
	await page.getByLabel('Password').fill('FireBeta2026!');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	await expect(page).toHaveURL(/\/shop$/);
	await expect(page.getByRole('heading', { name: 'Reorder your products.' })).toBeVisible();
	await page.getByRole('button', { name: 'Shop menu' }).first().click();
	await page.getByRole('link', { name: 'View cart' }).click();
	await expect(page).toHaveURL(/\/shop\/cart$/);
	await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
	await page.getByRole('button', { name: 'Shop menu' }).first().click();
	await page.getByRole('button', { name: 'Sign out' }).click();
	await expect(page).toHaveURL(/\/sign-in$/);
});

test('mobile shop menu opens the cart and signs out', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 1000 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/sign-in');
	await expect(page.locator('[data-sign-in-ready]')).toHaveAttribute('data-sign-in-ready', 'true');
	await page.getByLabel('Work email').fill('beta@example.com');
	await page.getByLabel('Password').fill('FireBeta2026!');
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	await expect(page).toHaveURL(/\/shop$/);
	await page.getByRole('button', { name: 'Open navigation menu' }).click();
	await page.getByRole('button', { name: 'Shop menu' }).last().click();
	await page.getByRole('link', { name: 'View cart' }).click();
	await expect(page).toHaveURL(/\/shop\/cart$/);
	await page.getByRole('button', { name: 'Open navigation menu' }).click();
	await page.getByRole('button', { name: 'Shop menu' }).last().click();
	await page.getByRole('button', { name: 'Sign out' }).click();
	await expect(page).toHaveURL(/\/sign-in$/);
});
