import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
	test(`sign-in offers beta requests and highlighted access at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/sign-in');
		await expect(page.locator('[data-sign-in-ready]')).toHaveAttribute(
			'data-sign-in-ready',
			'true'
		);
		const invitation = page.getByRole('form', { name: 'Request beta invitation' });
		await expect(invitation.getByLabel('Your name')).toBeVisible();
		await expect(invitation.getByLabel('Company', { exact: true })).toBeVisible();
		await expect(invitation.getByLabel('Business email')).toBeVisible();
		await expect(invitation.getByLabel('Market of interest')).toHaveCount(1);
		await expect(page.getByRole('link', { name: 'Email our team' })).toHaveAttribute(
			'href',
			/mailto:sales@abtl.com/
		);
		// No invitation is sent by this browser test; provider behavior is covered with mocked fetch.
		if (width === 1440) {
			const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
			await expect(nav.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
			const entry = page.locator('header').getByRole('link', { name: 'Sign in', exact: true });
			const background = await entry.evaluate((node) => getComputedStyle(node).backgroundColor);
			expect(background).toBe(
				await page
					.getByRole('form', { name: 'Shop sign in' })
					.getByRole('button', { name: 'Sign in', exact: true })
					.evaluate((node) => getComputedStyle(node).backgroundColor)
			);
		} else {
			await page.getByRole('button', { name: 'Open navigation menu' }).click();
			const nav = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
			await expect(nav.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
			await expect(nav.getByRole('link', { name: 'Sign in', exact: true })).toHaveAttribute(
				'href',
				'/sign-in'
			);
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}
