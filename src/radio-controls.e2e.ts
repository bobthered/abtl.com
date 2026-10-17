import { expect, test } from '@playwright/test';

for (const [route, count] of [
	['/capabilities/attachments', 5],
	['/capabilities/stock-colors', 1],
	['/capabilities/synthetic-materials', 1],
	['/capabilities/variable-data', 2],
	['/capabilities/shipping', 1],
	['/capabilities/warehousing', 2],
	['/', 1]
] as const) {
	test(`exclusive state choices use independent native radio groups on ${route}`, async ({
		page
	}) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(route);
		await expect(
			page
				.locator(
					route === '/'
						? '[data-bento-ready="true"]'
						: route.endsWith('attachments')
							? '[data-attachment-ready="true"]'
							: '[data-topic-ready="true"]'
				)
				.first()
		).toBeVisible();
		const groups = page.getByRole('radiogroup');
		await expect(groups).toHaveCount(count);
		const names = new Set<string>();
		for (const group of await groups.all()) {
			const radios = group.getByRole('radio');
			await expect(group.locator('input:checked')).toHaveCount(1);
			const name = await radios.first().getAttribute('name');
			expect(name).toBeTruthy();
			expect(names.has(name!)).toBe(false);
			names.add(name!);
			await radios.first().check();
			if (route !== '/' && !route.endsWith('stock-colors')) {
				await expect(radios.first().locator('..').locator('[data-radio-check]')).toHaveCount(1);
			}
			await radios.first().press('ArrowRight');
			await expect(radios.nth(1)).toBeChecked();
			await expect(radios.first()).not.toBeChecked();
			if (route !== '/' && !route.endsWith('stock-colors')) {
				await expect(radios.first().locator('..').locator('[data-radio-check]')).toHaveCount(0);
				await expect(radios.nth(1).locator('..').locator('[data-radio-check]')).toHaveCount(1);
			}
			await expect(group.locator('input:checked')).toHaveCount(1);
			await radios.nth(1).press('ArrowLeft');
			await expect(radios.first()).toBeChecked();
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
			page.viewportSize()!.width
		);
	});
}

test('future unmarked radio groups stagger labels and expose keyboard focus', async ({ page }) => {
	await page.goto('/about');
	await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await page.evaluate(() => {
		const group = document.createElement('div');
		group.setAttribute('role', 'radiogroup');
		group.setAttribute('aria-label', 'Future radio choices');
		group.className = 'grid grid-cols-3 gap-4';
		for (let index = 0; index < 3; index++) {
			const label = document.createElement('label');
			label.className = 'rounded-sm bg-gray-100 p-6';
			const input = document.createElement('input');
			input.type = 'radio';
			input.name = 'future-choice';
			input.value = String(index);
			label.append(input, document.createTextNode(`Future choice ${index}`));
			group.append(label);
		}
		document.querySelector('main')!.append(group);
	});
	const group = page.getByRole('radiogroup', { name: 'Future radio choices' });
	const labels = group.locator('label');
	await expect(labels.first()).toHaveAttribute('data-scroll-reveal-state', 'pending');
	await group.getByRole('radio').nth(1).focus();
	await expect(labels.nth(1)).toHaveCSS('opacity', '1');
	await group.scrollIntoViewIfNeeded();
	for (const label of await labels.all())
		await expect(label).toHaveAttribute('data-scroll-reveal-state', 'complete');
	const delays = await labels.evaluateAll((elements) =>
		elements.map((element) => (element as HTMLElement).dataset.scrollRevealDelay)
	);
	expect(new Set(delays).size).toBeGreaterThan(1);
});
