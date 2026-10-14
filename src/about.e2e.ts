import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
	test(`about page tells the company story in ${colorScheme} mode`, async ({ page }) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		for (const width of [1440, 390]) {
			await page.setViewportSize({ width, height: 1000 });
			const response = width === 1440 ? await page.goto('/about') : await page.reload();
			expect(response?.status()).toBe(200);
			await expect(page).toHaveTitle('About | Allen-Bailey Tag & Label');
			await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(
				/Small-town roots\.\s+Far-reaching possibilities\./
			);
			await expect(page.locator('main')).toContainText('1911');
			await expect(page.locator('main')).toContainText('2018');
			await expect(page.locator('main')).toContainText('Samuel Allen and James Bailey');
			await expect(page.locator('main')).toContainText('Dansville');
			await expect(page.locator('main')).toContainText('four major railroad lines');
			await expect(page.locator('main')).toContainText('1991');
			await expect(page.locator('main')).toContainText('Caledonia, New York');
			await expect(page.getByRole('link', { name: 'Discover ours' })).toHaveAttribute(
				'href',
				'#our-story'
			);
			await expect(
				page.locator('main').getByRole('link', { name: 'Start a conversation' })
			).toHaveAttribute('href', '/contact');
			await expect(
				page.locator('main').getByRole('link', { name: 'Explore what is possible' })
			).toHaveAttribute('href', '/capabilities');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			for (const photo of await page.locator('main img').all()) {
				await photo.scrollIntoViewIfNeeded();
				await expect
					.poll(() =>
						photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
					)
					.toBe(true);
			}
			await page.evaluate(() => scrollTo(0, 0));
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

test('about landscape fades and archive photography retains accurate provenance', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/about');
	const landscape = page.getByRole('img', { name: /Three-dimensional land globe/ });
	await expect(landscape.locator('[data-terrain-region=world]').first()).toBeAttached();
	await expect(landscape.locator('[data-terrain-region=new-york]').first()).toBeAttached();
	await expect(page.getByRole('group', { name: 'Rotate landscape' })).toHaveCount(0);
	for (const name of ['world', 'new-york']) {
		const response = await page.request.get(`/images/about/terrain-${name}.svg`);
		expect(response.ok()).toBe(true);
		expect(await response.text()).toContain('opacity="0.');
	}
	await expect(page.locator('main img')).toHaveCount(11);
	await expect(page.locator('main img[src*="/archive-"]')).toHaveCount(4);
	await expect(page.locator('#our-story figcaption')).toHaveCount(0);
	await expect(page.locator('#our-story img')).toHaveCount(8);
	for (const photo of await page.locator('#our-story img').all()) {
		expect(await photo.evaluate((image) => getComputedStyle(image).objectFit)).toBe('cover');
	}
	await expect(page.locator('main img').first()).toHaveAttribute(
		'src',
		'/images/about/golden-hour-industrial-complex-aerial.webp'
	);
	for (const photo of await page.locator('main img').all()) {
		await photo.scrollIntoViewIfNeeded();
		await expect(photo).toHaveAttribute(
			'alt',
			/Generated|Golden-hour aerial|AI-extended company archive/
		);
		await expect
			.poll(() =>
				photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)
			)
			.toBe(true);
	}
	await expect(page.locator('main')).toContainText('2011');
});
test('About SSR stays small across repeated requests', async ({ request }) => {
	for (let index = 0; index < 20; index++) {
		const response = await request.get('/about');
		expect(response.ok()).toBe(true);
		const html = await response.text();
		// Terrain geometry must remain external, rather than allocating megabyte SSR strings.
		expect(Buffer.byteLength(html)).toBeLessThan(500000);
		expect(html).toContain('/images/about/terrain-world.svg');
		expect(html).not.toContain('new-york-terrain.json');
		await response.dispose();
	}
});
