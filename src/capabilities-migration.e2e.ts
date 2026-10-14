import { expect, test } from '@playwright/test';
import { allNavigation, navigation } from './lib/data/navigation.js';
import { topics, topicHref } from './lib/data/topics.js';

test('About is a direct link after the sorted submenu sections', async ({ page }) => {
	expect(navigation.map((item) => item.label)).toEqual([
		'Capabilities',
		'Markets',
		'Products',
		'Resources',
		'About',
		'Careers',
		'News'
	]);
	expect(allNavigation.map((item) => item.label)).toEqual([
		'Capabilities',
		'Markets',
		'Products',
		'Resources',
		'About',
		'Careers',
		'Contact',
		'News'
	]);
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/about');
	await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete', {
		timeout: 20000
	});
	const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
	await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveAttribute(
		'href',
		'/about'
	);
	await expect(nav.getByRole('button', { name: 'About', exact: true })).toHaveCount(0);
	await nav.getByRole('button', { name: 'Capabilities', exact: true }).hover();
	const panel = page.locator('[data-nav-panel]:not([inert])');
	for (const topic of topics)
		await expect(panel.locator(`a[href="${topicHref(topic)}"]`)).toBeVisible();
});

test('capability pages and all legacy namespaces resolve directly', async ({ request }) => {
	for (const topic of topics) {
		const canonical = topicHref(topic);
		const response = await request.get(canonical);
		expect(response.status()).toBe(200);
		expect(await response.text()).toContain(topic.title);
		for (const prefix of ['about', 'tags']) {
			const old = await request.get(`/${prefix}/${topic.slug ?? topic.id}?source=legacy`, {
				maxRedirects: 0
			});
			expect(old.status()).toBe(308);
			expect(old.headers().location).toBe(`${canonical}?source=legacy`);
		}
	}
	for (const [old, canonical] of [
		['/capabilities/printing', 'full-color-printing'],
		['/capabilities/fulfillment', 'warehousing'],
		['/capabilities/colors', 'stock-colors'],
		['/about/printing', 'variable-data'],
		['/tags/printing', 'variable-data']
	]) {
		const response = await request.get(`${old}?source=alias`, { maxRedirects: 0 });
		expect(response.status()).toBe(308);
		expect(response.headers().location).toBe(`/capabilities/${canonical}?source=alias`);
	}
	for (const prefix of ['about', 'capabilities', 'tags'])
		expect((await request.get(`/${prefix}/unknown`)).status()).toBe(404);
});
