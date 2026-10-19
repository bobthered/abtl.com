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
		await expect(page.getByText('Online catalog coming soon')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Shellfish', exact: true })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Beverage', exact: true })).toHaveCount(0);
		await page.getByRole('link', { name: 'Shop Fire Suppression' }).click();
		await expect(page).toHaveURL(/\/shop\/fire-suppression$/);
		await expect(
			page.getByRole('heading', { name: 'Welcome, Fire Suppression Demo.' })
		).toBeVisible();
		const cookie = (await context.cookies()).find((entry) => entry.name === 'abtl-demo-session');
		expect(cookie?.httpOnly).toBe(true);
		expect(cookie?.sameSite).toBe('Lax');
		expect(cookie!.expires - Date.now() / 1000).toBeGreaterThan(29 * 24 * 60 * 60);
		await page.reload();
		await expect(page).toHaveURL(/\/shop\/fire-suppression$/);
		await page.getByRole('button', { name: 'Sign out' }).click();
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
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const response = await request.post('/shop/fire-suppression?/reorder', {
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
	await expect(page.getByRole('heading', { name: 'Your markets' })).toBeVisible();
	await page.getByRole('button', { name: 'Sign out' }).click();
	await expect(page).toHaveURL(/\/sign-in$/);
});
