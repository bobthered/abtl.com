import { expect, test } from '@playwright/test';

for (const [route, count] of [
	['/capabilities/attachments', 6],
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
			if (route !== '/') {
				await expect(radios.first().locator('..').locator('[data-radio-check]')).toHaveCount(1);
			}
			await radios.first().press('ArrowRight');
			await expect(radios.nth(1)).toBeChecked();
			await expect(radios.first()).not.toBeChecked();
			if (route !== '/') {
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

for (const colorScheme of ['light', 'dark'] as const) {
	for (const [route, groupName] of [
		['/capabilities/attachments', 'Patch stock color'],
		['/capabilities/stock-colors', 'Preview stock colors']
	] as const) {
		test(`bare circular swatches show centered contrasting checks on ${route} in ${colorScheme}`, async ({
			page
		}) => {
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto(route);
			await expect(
				page
					.locator(
						route.endsWith('attachments')
							? '[data-attachment-ready="true"]'
							: '[data-topic-ready="true"]'
					)
					.first()
			).toBeVisible();
			const group = page.getByRole('radiogroup', { name: groupName });
			await expect(group.getByRole('radio')).toHaveCount(21);
			for (const radio of await group.getByRole('radio').all()) {
				await radio.check();
				await expect(group.locator('[data-radio-check]')).toHaveCount(1);
				const label = radio.locator('xpath=ancestor::label');
				await expect(label.locator('[data-radio-check]')).toBeVisible();
				const appearance = await label.evaluate((node) => {
					const check = node.querySelector('[data-radio-check]')!;
					const swatch = node.querySelector('span.bg-current')!;
					const checkBox = check.getBoundingClientRect();
					const swatchBox = swatch.getBoundingClientRect();
					const luminance = (color: string) => {
						const canvas = document.createElement('canvas');
						canvas.width = canvas.height = 1;
						const context = canvas.getContext('2d')!;
						context.fillStyle = color;
						context.fillRect(0, 0, 1, 1);
						const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map((value) => {
							const channel = value / 255;
							return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
						});
						return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
					};
					const ink = luminance(getComputedStyle(check).color);
					const paper = luminance(getComputedStyle(swatch).backgroundColor);
					return {
						background: getComputedStyle(node).backgroundColor,
						shadow: getComputedStyle(node).boxShadow,
						radius: Number.parseFloat(getComputedStyle(swatch).borderRadius),
						width: swatchBox.width,
						contrast: (Math.max(ink, paper) + 0.05) / (Math.min(ink, paper) + 0.05),
						x: Math.abs(checkBox.x + checkBox.width / 2 - swatchBox.x - swatchBox.width / 2),
						y: Math.abs(checkBox.y + checkBox.height / 2 - swatchBox.y - swatchBox.height / 2)
					};
				});
				expect(appearance.background).toBe('rgba(0, 0, 0, 0)');
				expect(appearance.shadow).toBe('none');
				expect(appearance.radius).toBeGreaterThanOrEqual(appearance.width / 2);
				expect(appearance.contrast).toBeGreaterThanOrEqual(3);
				expect(appearance.x).toBeLessThan(1);
				expect(appearance.y).toBeLessThan(1);
			}
		});
	}
}
