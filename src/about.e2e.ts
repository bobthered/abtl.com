import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
	test(`about page tells the company story in ${colorScheme} mode`, async ({ page }) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		for (const width of [1440, 390]) {
			await page.setViewportSize({ width, height: 1000 });
			const response = await page.goto('/about');
			expect(response?.status()).toBe(200);
			await expect(page).toHaveTitle('About | Allen-Bailey Tag & Label');
			await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(
				/Small-town roots\.\s+Far-reaching possibilities\./
			);
			await expect(page.locator('main')).toContainText('1911');
			await expect(page.locator('main')).toContainText('2018');
			await expect(page.locator('main')).toContainText('Caledonia, New York');
			await expect(page.getByRole('link', { name: 'Discover ours' })).toHaveAttribute(
				'href',
				'#our-story'
			);
			await expect(
				page.locator('main').getByRole('link', { name: 'Start a conversation' })
			).toHaveAttribute('href', '/contact');
			await expect(
				page.locator('main').getByRole('link', { name: 'Explore careers' })
			).toHaveAttribute('href', '/careers');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.screenshot({
				path: `test-results/about-${colorScheme}-${width}.png`,
				fullPage: true
			});
		}
	});
}

test('about story remains readable without JavaScript', async ({ browser, baseURL }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(`${baseURL}/about`);
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(
		page.getByRole('heading', { name: 'More than a century in the making.' })
	).toBeVisible();
	await expect(page.locator('main')).toContainText('90M+');
	await context.close();
});

test('about landscape rotates and placeholder photography is explicit', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/about');
	const landscape = page.getByRole('img', { name: /Illustrative isometric landscape/ });
	const pin = landscape.locator('g');
	const initial = await pin.getAttribute('transform');
	// Wait for client enhancement before exercising the SSR-rendered controls.
	await page.waitForFunction(() =>
		document.getAnimations().some((animation) => animation.id === 'illustration-float')
	);
	await page.getByRole('button', { name: 'Rotate landscape right' }).click();
	await expect(pin).not.toHaveAttribute('transform', initial!);
	await page.getByRole('button', { name: 'Rotate landscape left' }).click();
	await expect(pin).toHaveAttribute('transform', initial!);
	await expect(page.locator('main img')).toHaveCount(7);
	for (const photo of await page.locator('main img').all()) {
		await photo.scrollIntoViewIfNeeded();
		await expect(photo).toHaveAttribute('alt', /Generated/);
		await expect
			.poll(() =>
				photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
			)
			.toBe(true);
	}
	await expect(page.locator('main')).toContainText('2011');
});
