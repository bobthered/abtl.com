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
				'Made to carry what matters.'
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

test('about story remains readable without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('http://localhost:4203/about');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(
		page.getByRole('heading', { name: 'A long history. A clear purpose.' })
	).toBeVisible();
	await expect(page.locator('main')).toContainText('90M+');
	await context.close();
});
