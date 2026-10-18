import { expect, test } from '@playwright/test';

test('finds prior products and reviews reorder and new-product details', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({
		baseURL,
		javaScriptEnabled: false,
		reducedMotion: 'reduce',
		viewport: { width: 390, height: 1000 }
	});
	try {
		const page = await context.newPage();
		await page.goto('/account/sign-in');
		await page.getByLabel('Work email').fill('beta@example.com');
		await page.getByLabel('Password').fill('FireBeta2026!');
		await page.getByRole('button', { name: 'Sign in', exact: true }).click();
		await page.getByRole('link', { name: 'Shop Fire Suppression' }).click();
		await expect(
			page.getByText('18 matching products / Showing 1-10', { exact: true })
		).toBeVisible();
		await page.getByRole('link', { name: 'Next page' }).click();
		await expect(page.getByText('Page 2 of 2', { exact: true })).toBeVisible();
		await page.getByRole('link', { name: 'Reset filters' }).click();
		await page.getByLabel('Product type', { exact: true }).selectOption('tag-inspection');
		await page.getByLabel('Order date from').fill('2026-09-12');
		await page.getByLabel('Order date to').fill('2026-09-12');
		await page.getByRole('button', { name: 'Search orders' }).click();
		await expect(page.getByText('1 matching product / Showing 1-1', { exact: true })).toBeVisible();
		await page.getByRole('link', { name: 'Reset filters' }).click();

		await page.getByLabel('Search previous orders').fill('DEMO-ART-101');
		await page.getByRole('button', { name: 'Search orders' }).click();
		await expect(page.getByText('1 matching product / Showing 1-1', { exact: true })).toBeVisible();
		const reorder = page.getByRole('form', { name: 'Reorder FS-DEMO-001' });
		await reorder.getByLabel('Reorder quantity').fill('750');
		await reorder.getByRole('button', { name: 'Review reorder' }).click();
		await expect(page.getByText('Quantity: 750', { exact: true })).toBeVisible();
		await expect(page.getByText('DEMO-1042 / DEMO-ART-101', { exact: true })).toBeVisible();
		const newProduct = page.getByRole('form', { name: 'New fire suppression product' });
		await newProduct.getByLabel('Product', { exact: true }).selectOption('collars');
		await newProduct.getByLabel('Quantity needed').fill('300');
		await newProduct
			.getByLabel('What do you need?')
			.fill('Small green collars with our company details.');
		await newProduct.getByRole('button', { name: 'Review new product' }).click();
		await expect(
			page.getByText('New product: Extinguisher collars', { exact: true })
		).toBeVisible();
		await expect(page.getByText('Quantity: 300', { exact: true })).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	} finally {
		await context.close().catch(() => {});
	}
});
