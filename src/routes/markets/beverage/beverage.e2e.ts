import { expect, test } from '@playwright/test';
import { beerConcepts, wineConcepts } from './_components/options';

for (const colorScheme of ['light', 'dark'] as const) {
	for (const width of [390, 1440]) {
		test(`beverage examples work at ${width}px in ${colorScheme}`, async ({ page, request }) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/markets/beverage');
			await expect(page.locator('[data-beverage-ready]')).toHaveAttribute(
				'data-beverage-ready',
				'true'
			);
			await expect(page).toHaveTitle('Beverage | Allen-Bailey Tag & Label');
			await expect(page.locator('[data-content-body] > section')).toHaveCount(3);
			const beer = page.locator('[data-beer-preview]');
			const beerHeight = (await beer.boundingBox())!.height;
			for (const concept of beerConcepts) {
				await page.getByRole('radio', { name: concept.name, exact: true }).check();
				await expect(beer.locator('[data-beer-title]')).toHaveText(concept.title);
				if (concept.id !== 'citrus')
					expect(
						await beer.locator('[data-beer-title]').evaluate((node) => getComputedStyle(node).fill)
					).toBe('rgb(255, 255, 255)');
				await page.getByRole('radio', { name: 'Flat artwork', exact: true }).check();
				await expect(beer.locator('[data-beer-view]')).toHaveAttribute('data-beer-view', 'flat');
				await expect(beer.locator('[data-beer-title]')).toHaveText(concept.title);
				expect((await beer.boundingBox())!.height).toBe(beerHeight);
				await page.getByRole('radio', { name: 'On the can', exact: true }).check();
			}
			const growler = page.locator('[data-growler-preview]');
			const growlerHeight = (await growler.boundingBox())!.height;
			const black = await growler
				.locator('[data-growler-elastic-loop]')
				.evaluate((node) => getComputedStyle(node).stroke);
			await page.getByRole('radio', { name: 'White', exact: true }).check();
			await expect(growler.locator('[data-growler-elastic]')).toHaveAttribute(
				'data-growler-elastic',
				'White'
			);
			expect(
				await growler
					.locator('[data-growler-elastic-loop]')
					.evaluate((node) => getComputedStyle(node).stroke)
			).not.toBe(black);
			await page.getByRole('radio', { name: 'Tag detail', exact: true }).check();
			await expect(growler.locator('[data-growler-view]')).toHaveAttribute(
				'data-growler-view',
				'detail'
			);
			await expect(growler.locator('[data-growler-patch]')).toHaveCount(1);
			await expect(growler.locator('[data-growler-tag]')).toHaveAttribute('fill-rule', 'evenodd');
			expect((await growler.boundingBox())!.height).toBe(growlerHeight);
			await page.getByRole('radio', { name: 'On the growler', exact: true }).check();
			const wine = page.locator('[data-wine-preview]');
			const wineHeight = (await wine.boundingBox())!.height;
			for (const concept of wineConcepts) {
				await page.getByRole('radio', { name: concept.name, exact: true }).check();
				await expect(wine.locator('[data-flip-face="front"] [data-wine-concept]')).toHaveAttribute(
					'data-wine-concept',
					concept.id
				);
			}
			await wine.getByRole('button', { name: 'Turn it over' }).click();
			await expect(wine.locator('[data-flip-preview]')).toHaveAttribute('data-flip-side', 'back');
			await expect(wine.locator('[data-flip-face="back"]')).toContainText('THE STORY CONTINUES.');
			await wine.getByRole('button', { name: 'View the face' }).press('Space');
			await expect(wine.locator('[data-flip-preview]')).toHaveAttribute('data-flip-side', 'front');
			expect((await wine.boundingBox())!.height).toBe(wineHeight);
			const elasticGroup = page.getByRole('radiogroup', { name: 'Growler elastic color' });
			await elasticGroup.getByRole('radio', { name: 'Black', exact: true }).focus();
			await elasticGroup.getByRole('radio', { name: 'Black', exact: true }).press('ArrowRight');
			await expect(elasticGroup.getByRole('radio', { name: 'White', exact: true })).toBeChecked();
			await expect(page.locator('[data-content-cta] a')).toHaveAttribute('href', '/contact');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			expect(
				(await request.get('/markets?source=beverage', { maxRedirects: 0 })).headers().location
			).toBe('/markets/fire-suppression?source=beverage');
			await page.screenshot({
				path: `.svelte-kit/beverage-${width}-${colorScheme}.png`,
				fullPage: true
			});
		});
	}
}

test('beverage defaults render without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 390, height: 1000 }
	});
	const page = await context.newPage();
	await page.goto('/markets/beverage');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByRole('radio', { name: 'Coastal', exact: true })).toBeChecked();
	await expect(page.locator('[data-beer-title]')).toHaveText('TIDE LINE');
	await expect(page.locator('[data-growler-tag]')).toHaveCount(1);
	await expect(page.locator('[data-content-cta] a')).toHaveAttribute('href', '/contact');
	await context.close();
});
