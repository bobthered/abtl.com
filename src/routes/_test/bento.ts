import { test as base, type Page } from '@playwright/test';

// Content regressions need a known subset. Exercise real random selection separately
// in bento-layout.e2e.ts; keep production SSR data and hydration intact here.
export const selectBentoTopics = async (page: Page, ids: string[]) => {
	await page.route(/^https?:\/\/[^/]+\/$/, async (route) => {
		for (let attempt = 0; attempt < 100; attempt += 1) {
			const response = await route.fetch();
			const html = await response.text();
			if (ids.every((id) => html.includes(`data-bento-topic="${id}"`))) {
				await route.fulfill({ response });
				return;
			}
		}
		throw new Error(`Could not obtain a homepage containing: ${ids.join(', ')}`);
	});
};

export const test = base.extend({
	page: async ({ page }, use) => {
		await selectBentoTopics(page, [
			'colors',
			'shipping',
			'variable-data',
			'full-color-printing',
			'synthetic-materials',
			'warehousing'
		]);
		await use(page);
	}
});
