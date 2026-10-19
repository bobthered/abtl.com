import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
	for (const width of [390, 1440]) {
		test(`contact form and address render at ${width}px in ${colorScheme}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/contact');
			await expect(page.locator('[data-contact-ready]')).toHaveAttribute(
				'data-contact-ready',
				'true'
			);
			await expect(page).toHaveTitle('Contact | Allen-Bailey Tag & Label');
			const form = page.getByRole('form', { name: 'Contact inquiry' });
			await expect(form.getByRole('textbox', { name: 'Your name', exact: true })).toBeVisible();
			await form.getByRole('textbox', { name: 'Your name', exact: true }).fill('Pat Customer');
			await form
				.getByRole('textbox', { name: 'Email address', exact: true })
				.fill('pat@example.test');
			await form
				.getByRole('textbox', { name: 'Your message', exact: true })
				.fill('Can we discuss a tag project?');
			expect(await form.evaluate((node) => (node as HTMLFormElement).checkValidity())).toBe(true);
			await expect(form.getByRole('radio')).toHaveCount(0);
			await expect(page.locator('[data-content-layout]')).toHaveCount(1);
			await expect(page.locator('[data-content-body] > section')).toHaveCount(3);
			await expect(page.locator('[data-content-cta] a')).toHaveAttribute(
				'href',
				'tel:+18005418868'
			);
			await expect(page.locator('#contact-location img')).toHaveAttribute(
				'src',
				'/images/about/golden-hour-industrial-complex-aerial.webp'
			);
			await expect(page.locator('#contact-location iframe')).toHaveCount(0);
			await expect(page.locator('#contact-location address')).toContainText('3177 Lehigh St.');
			await expect(page.locator('#contact-location address')).toContainText('Caledonia, NY 14423');
			await expect(page.getByRole('link', { name: /Open directions/ })).toHaveAttribute(
				'href',
				/google.com\/maps\/search/
			);
			await expect(page.getByRole('link', { name: '800.541.8868', exact: true })).toHaveAttribute(
				'href',
				'tel:+18005418868'
			);
			// Local delivery is intentionally unconfigured; no real emails are sent by browser checks.
			await expect(form.getByRole('button', { name: 'Send inquiry', exact: true })).toBeDisabled();
			await expect(form).toContainText('Online sending is currently unavailable.');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.screenshot({
				path: `.svelte-kit/contact-${width}-${colorScheme}.png`,
				fullPage: true
			});
		});
	}
}

test('contact action validates and preserves an undelivered inquiry without JavaScript', async ({
	browser,
	request
}) => {
	const invalid = await request.post('/contact', {
		form: { name: ' ', email: 'bad', message: ' ' }
	});
	expect(invalid.status()).toBe(400);
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 390, height: 1000 }
	});

	const page = await context.newPage();
	await page.goto('/contact');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	// Exercise the native POST fallback even though the unconfigured-delivery button is disabled.
	await page.locator('input[name="name"]').fill('Pat Customer');
	await page.locator('input[name="email"]').fill('pat@example.test');
	await page.locator('textarea[name="message"]').fill('Please retain my message.');
	await Promise.all([
		page.waitForNavigation(),
		page.locator('form').evaluate((node) => (node as HTMLFormElement).submit())
	]);
	await expect(page.getByRole('alert')).toContainText('could not be sent');
	await expect(page.locator('input[name="name"]')).toHaveValue('Pat Customer');
	await expect(page.locator('textarea[name="message"]')).toHaveValue('Please retain my message.');
	await context.close();
});

test('enhanced contact failure retains input and focuses feedback', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/contact');
	await expect(page.locator('[data-contact-ready]')).toHaveAttribute('data-contact-ready', 'true');
	const form = page.getByRole('form', { name: 'Contact inquiry' });
	await form.getByRole('textbox', { name: 'Your name', exact: true }).fill('Pat Customer');
	await form.getByRole('textbox', { name: 'Email address', exact: true }).fill('pat@example.test');
	await form
		.getByRole('textbox', { name: 'Your message', exact: true })
		.fill('Keep these project details.');
	await page.locator('input[name="reference"]').fill('Order AB-104');
	await Promise.all([
		page.waitForResponse(
			(response) => response.url().endsWith('/contact') && response.request().method() === 'POST'
		),
		form.evaluate((node) => (node as HTMLFormElement).requestSubmit())
	]);
	await expect(form.getByRole('alert')).toContainText('could not be sent');
	await expect(form.getByRole('alert')).toBeFocused();
	await expect(form.getByRole('textbox', { name: 'Your message', exact: true })).toHaveValue(
		'Keep these project details.'
	);
	await expect(page.locator('input[name="reference"]')).toHaveValue('Order AB-104');
});

test('a client network failure keeps the inquiry editable', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/contact');
	await expect(page.locator('[data-contact-ready]')).toHaveAttribute('data-contact-ready', 'true');
	const form = page.getByRole('form', { name: 'Contact inquiry' });
	await form.getByRole('textbox', { name: 'Your name', exact: true }).fill('Pat Customer');
	await form.getByRole('textbox', { name: 'Email address', exact: true }).fill('pat@example.test');
	await form
		.getByRole('textbox', { name: 'Your message', exact: true })
		.fill('Do not lose this inquiry.');
	await page.route('**/contact', (route) =>
		route.request().method() === 'POST' ? route.abort() : route.continue()
	);
	await form.evaluate((node) => (node as HTMLFormElement).requestSubmit());
	await expect(form.getByRole('alert')).toContainText('could not connect');
	await expect(form.getByRole('alert')).toBeFocused();
	await expect(form.getByRole('textbox', { name: 'Your message', exact: true })).toHaveValue(
		'Do not lose this inquiry.'
	);
});
