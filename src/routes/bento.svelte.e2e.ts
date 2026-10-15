import { expect, test } from '@playwright/test';

test('warehousing releases demo stock, compares workflows, and refreshes as a standalone page', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const trigger = page.locator('[data-bento-topic="warehousing"]');
	await trigger.scrollIntoViewIfNeeded();
	await expect(trigger.locator('[data-warehouse-preview]')).toHaveAttribute(
		'data-warehouse-motion',
		'static'
	);
	await trigger.click();
	await expect(page).toHaveURL(/\/capabilities\/warehousing$/);
	const dialog = page.getByRole('dialog', { name: 'Produce in volume. Release on demand.' });
	await expect(dialog).toBeVisible();
	await expect(dialog.locator('[data-warehouse-count]')).toHaveText('24cartons');
	await dialog.getByRole('button', { name: '6 cartons', exact: true }).click();
	await dialog.getByRole('button', { name: 'Release from stock', exact: true }).click();
	await expect(dialog.locator('[data-warehouse-count]')).toHaveText('18cartons');
	await expect(dialog.locator('[data-warehouse-status]')).toHaveText(
		'6 cartons released. 18 remain for your next request.'
	);
	for (let index = 0; index < 3; index++)
		await dialog.getByRole('button', { name: 'Release from stock', exact: true }).click();
	await expect(dialog.locator('[data-warehouse-count]')).toHaveText('0cartons');
	await expect(
		dialog.getByRole('button', { name: 'Release from stock', exact: true })
	).toBeDisabled();
	await dialog.getByRole('button', { name: 'Reset demo', exact: true }).click();
	await expect(dialog.locator('[data-warehouse-count]')).toHaveText('24cartons');
	await dialog.getByRole('button', { name: 'New production', exact: true }).click();
	await expect(dialog.locator('[data-warehouse-workflow]')).toContainText(
		'A new run starts with production'
	);
	await dialog.getByRole('button', { name: 'Warehoused stock', exact: true }).click();
	await expect(dialog.locator('[data-warehouse-workflow]')).toContainText(
		'Release from available stock'
	);
	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/\/$/);
	await expect(trigger).toBeFocused();
	await trigger.click();
	await page.reload();
	await expect(
		page.getByRole('heading', { level: 1, name: 'Produce in volume. Release on demand.' })
	).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
		const contact = await page.locator('[data-warehouse-section="contact"]').boundingBox();
		expect(contact!.x).toBeCloseTo(0, 0);
		expect(contact!.width).toBeCloseTo(width, 0);
	}
});

const topics = [
	'stock-colors',
	'variable-data',
	'shipping',
	'warehousing',
	'full-color-printing',
	'synthetic-materials'
];

test('variable data QR scans on hover and keyboard focus and respects reduced motion', async ({
	page
}) => {
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const trigger = page.locator('[data-bento-topic="variable-data"]');
	const preview = trigger.locator('[data-variable-preview]');
	const scan = preview.locator('[data-qr-scan]');
	await trigger.scrollIntoViewIfNeeded();
	await page.mouse.move(0, 0);
	await expect(preview).toHaveAttribute('data-qr-scanning', 'idle');
	await expect(preview).toHaveAttribute('data-qr-orbiting', 'active');
	await expect(trigger.locator('[data-qr-code]')).toHaveCSS('color', 'rgb(10, 8, 12)');
	await page.evaluate(() => (document.documentElement.dataset.theme = 'dark'));
	await expect(trigger.locator('[data-qr-code]')).toHaveCSS('color', 'rgb(250, 249, 251)');
	await trigger.hover();
	await expect(preview).toHaveAttribute('data-qr-scanning', 'active');
	const initialFrame = await scan.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
	await expect
		.poll(() => scan.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL()))
		.not.toBe(initialFrame);
	await page.mouse.move(0, 0);
	await expect(preview).toHaveAttribute('data-qr-scanning', 'idle');
	await page.keyboard.press('Tab');
	await trigger.focus();
	await expect(preview).toHaveAttribute('data-qr-scanning', 'active');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(preview).toHaveAttribute('data-qr-scanning', 'static');
	await expect(preview).toHaveAttribute('data-qr-orbiting', 'static');
	await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
	await expect(preview).toHaveAttribute('data-qr-scanning', 'idle');
	await page.setViewportSize({ width: 390, height: 844 });
	await trigger.scrollIntoViewIfNeeded();
	const codeBounds = await trigger.locator('[data-qr-code]').boundingBox();
	expect(codeBounds!.x).toBeGreaterThanOrEqual(0);
	expect(codeBounds!.x + codeBounds!.width).toBeLessThanOrEqual(390);
	await expect(trigger.locator('[data-qr-code]')).toHaveCount(1);
});

test('variable data keeps records, codes, formats, and mailing recipients in sync', async ({
	page
}) => {
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	await page.locator('[data-bento-topic="variable-data"]').click();
	const dialog = page.getByRole('dialog', {
		name: 'One design. A different story on every piece.',
		exact: true
	});
	const studio = dialog.locator('[data-variable-section="studio"]');
	const output = studio.locator('[data-variable-output]');
	await expect(output.locator('[data-variable-piece]')).toHaveAttribute(
		'data-variable-piece',
		'AB-004201'
	);
	const firstBarcode = await output.locator('img').first().getAttribute('src');
	await dialog.getByRole('button', { name: /AB-004203 Motor assembly/ }).click();
	await expect(output).toContainText('Motor assembly');
	await expect(output.locator('img').first()).toHaveAttribute(
		'alt',
		'Example Code 128 barcode encoding AB-004203'
	);
	await expect(output.locator('img').last()).toHaveAttribute(
		'alt',
		'Example QR code encoding AB-004203'
	);
	await expect.poll(() => output.locator('img').first().getAttribute('src')).not.toBe(firstBarcode);
	await dialog.getByRole('button', { name: 'Label', exact: true }).click();
	await expect(output.locator('svg')).toHaveCount(0);
	await dialog.getByRole('button', { name: 'Tag', exact: true }).click();
	await expect(output.locator('svg')).toHaveCount(1);
	await dialog.getByRole('button', { name: 'Print the next record' }).click();
	await expect(output).toContainText('AB-004204');
	await dialog.getByRole('button', { name: 'Meet the next recipient' }).click();
	await expect(dialog.locator('[data-variable-section="mailing"]')).toContainText('Morgan Lee');
	await expect(dialog.locator('[data-variable-section="contact"] a')).toHaveAttribute(
		'href',
		/^mailto:sales@abtl.com\?subject=Variable/
	);
	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/\/$/);
	await page.goto('/capabilities/variable-data');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'One design. A different story on every piece.'
	);
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
		const contact = await page.locator('[data-variable-section="contact"]').boundingBox();
		expect(contact!.x).toBeCloseTo(0, 0);
		expect(contact!.width).toBeCloseTo(width, 0);
	}
	await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
	await page.getByRole('button', { name: /AB-004202 Valve assembly/ }).click();
	await expect(page.locator('[data-variable-output]')).toContainText('Valve assembly');
	await page.goto('/about/printing');
	await expect(page).toHaveURL(/\/capabilities\/variable-data$/);
});

test('opens route-backed dialogs and preserves the gallery through history navigation', async ({
	page
}) => {
	await page.goto('/');
	// Before hydration, real links intentionally navigate to the standalone page.
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const trigger = page.locator('[data-bento-topic="variable-data"]');
	await trigger.scrollIntoViewIfNeeded();
	await expect(trigger).toHaveAttribute('href', '/capabilities/variable-data');
	await trigger.click();
	await expect(page).toHaveURL(/\/capabilities\/variable-data$/);
	await expect(
		page.getByRole('dialog', { name: 'One design. A different story on every piece.' })
	).toBeVisible();
	await expect(page.locator('[data-bento-section]')).toBeAttached();
	// Capture the settled opening position, after smooth scrolling and header resizing.
	await page.evaluate(
		() =>
			new Promise<void>((resolve) => {
				let previous = scrollY;
				let stableSince = performance.now();
				const settle = (time: number) => {
					if (Math.abs(scrollY - previous) > 0.5) stableSince = time;
					previous = scrollY;
					if (time - stableSince >= 200) resolve();
					else requestAnimationFrame(settle);
				};
				requestAnimationFrame(settle);
			})
	);
	const scroll = await page.evaluate(() => window.scrollY);
	await expect(page).toHaveTitle('Variable Data | Capabilities | Allen-Bailey Tag & Label');
	await page.goBack();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page).toHaveURL(/\/$/);
	await expect(trigger).toBeFocused();
	// Browser scroll restoration can round fractional layout positions to nearby CSS pixels.
	await expect
		.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - scroll))
		.toBeLessThanOrEqual(2);
	await page.goForward();
	await expect(page).toHaveURL(/\/capabilities\/variable-data$/);
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.getByRole('button', { name: 'Close topic', exact: true }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await trigger.click();
	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await trigger.click();
	await page.getByRole('dialog').click({ position: { x: 4, y: 4 } });
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('refreshing an open dialog renders the standalone topic', async ({ page }) => {
	await page.goto('/');
	// Before hydration, real links intentionally navigate to the standalone page.
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	await expect(page.locator('[data-bento-topic="colors"]')).toHaveAttribute(
		'href',
		'/capabilities/stock-colors'
	);
	await page.locator('[data-bento-topic="colors"]').click();
	await expect(page.getByRole('dialog', { name: 'What color will you choose?' })).toBeVisible();
	await expect(page).toHaveURL(/\/capabilities\/stock-colors$/);
	await page.reload();
	await expect(
		page.getByRole('heading', { level: 1, name: 'What color will you choose?' })
	).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page.locator('[data-bento-section]')).toHaveCount(0);
	await expect(page.locator('header')).toBeVisible();
	await expect(page.locator('footer')).toBeAttached();
});

test('modified link clicks open standalone content in a new tab', async ({ page, context }) => {
	await page.goto('/');
	// Before hydration, real links intentionally navigate to the standalone page.
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const popup = context.waitForEvent('page');
	await page.locator('[data-bento-topic="variable-data"]').click({ modifiers: ['ControlOrMeta'] });
	const standalone = await popup;
	await standalone.waitForLoadState();
	await expect(standalone).toHaveURL(/\/capabilities\/variable-data$/);
	await expect(
		standalone.getByRole('heading', {
			level: 1,
			name: 'One design. A different story on every piece.'
		})
	).toBeVisible();
	await expect(standalone.getByRole('dialog')).toHaveCount(0);
	await expect(page).toHaveURL(/\/$/);
});

for (const topic of topics) {
	test(`serves ${topic} directly without JavaScript`, async ({ baseURL, browser }) => {
		const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
		const page = await context.newPage();
		try {
			const response = await page.goto(`/capabilities/${topic}`);
			expect(response?.status()).toBe(200);
			await expect(page.locator('h1')).toBeVisible();
			await expect(page.getByRole('dialog')).toHaveCount(0);
		} finally {
			await context.close();
		}
	});
}

test('returns a real 404 for unknown topics', async ({ request }) => {
	const response = await request.get('/capabilities/unknown');
	expect(response.status()).toBe(404);
});

test('mobile back navigation dismisses the dialog and forward restores it', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	// Before hydration, real links intentionally navigate to the standalone page.
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const trigger = page.locator('[data-bento-topic="full-color-printing"]');
	await trigger.click();
	await expect(page).toHaveURL(/\/capabilities\/full-color-printing$/);
	await expect(page.getByRole('dialog', { name: 'Full color. Both sides.' })).toBeVisible();
	await page.goBack();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(trigger).toBeFocused();
	await page.goForward();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.getByRole('button', { name: 'Close topic', exact: true }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('standalone color marquees fill the viewport without horizontal overflow', async ({
	page
}) => {
	await page.goto('/capabilities/stock-colors');
	await expect(
		page.getByRole('heading', { level: 1, name: 'What color will you choose?' })
	).toBeVisible();
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
		const marquees = page.locator('main [data-marquee]');
		await expect(marquees).toHaveCount(1);
		for (const marquee of await marquees.all()) {
			const bounds = await marquee.boundingBox();
			expect(bounds?.x).toBeCloseTo(0, 0);
			expect(bounds?.width).toBeCloseTo(viewportWidth, 0);
		}
		const samples = await page.locator('[data-color-section="samples"]').boundingBox();
		expect(samples?.x).toBeCloseTo(0, 0);
		expect(samples?.width).toBeCloseTo(viewportWidth, 0);
		const divider = await page.locator('[data-color-divider]').boundingBox();
		const heading = await page.locator('#bento-dialog-heading').boundingBox();
		expect(divider?.x).toBeCloseTo(heading!.x, 0);
		expect(divider?.width).toBeCloseTo(heading!.width, 0);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewportWidth);
	}
});

test('redirects the former color route to stock colors and preserves query parameters', async ({
	request
}) => {
	const response = await request.get('/capabilities/colors?source=sample', { maxRedirects: 0 });
	expect(response.status()).toBe(308);
	expect(response.headers().location).toBe('/capabilities/stock-colors?source=sample');
});

test('mobile sample picker keeps selections compact and its request action visible', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/capabilities/stock-colors');
	await expect(page.locator('[data-topic-ready]')).toHaveAttribute('data-topic-ready', 'true');
	const trigger = page.getByRole('button', { name: 'Request Samples', exact: true }).first();
	await trigger.click();
	const picker = page.getByRole('dialog', { name: 'Request Samples', exact: true });
	await expect(picker).toBeVisible();
	await expect(picker.locator('[data-stock-swatch]')).toHaveCount(21);
	await picker.getByRole('button', { name: 'Select all', exact: true }).click();
	await expect(picker.locator('[data-stock-swatch][aria-pressed="true"]')).toHaveCount(21);
	const request = picker.getByRole('link', { name: 'Email sample request' });
	await expect(request).toBeInViewport();
	const bounds = await picker.locator('[data-sample-picker-card]').boundingBox();
	expect(bounds!.width).toBeLessThanOrEqual(390 - 32);
	expect(bounds!.height).toBeLessThanOrEqual(844 - 32);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
	await page.keyboard.press('Escape');
	await expect(picker).toHaveCount(0);
	await expect(trigger).toBeFocused();
});

test('shipping opens as a route-backed dialog, selects actual destinations, and refreshes standalone', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const trigger = page.locator('[data-bento-topic="shipping"]');
	await trigger.scrollIntoViewIfNeeded();
	await trigger.click();
	await expect(page).toHaveURL(/\/capabilities\/shipping$/);
	const dialog = page.getByRole('dialog', { name: 'Your tags. A world of possibilities.' });
	await expect(dialog).toBeVisible();
	await expect(dialog.locator('[data-shipping-state]')).toHaveCount(50);
	await expect(dialog.locator('[data-shipping-state-count]')).toHaveText('50');
	await dialog.getByRole('button', { name: 'Switzerland', exact: true }).click();
	await expect(dialog.getByRole('button', { name: 'Switzerland', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await expect(dialog.locator('[data-shipping-globe]')).toBeVisible();
	await expect(dialog.locator('[data-shipping-content]')).not.toContainText(
		/\borders\b|supplied report|42,932/i
	);
	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/\/$/);
	await expect(trigger).toBeFocused();
	await trigger.click();
	await page.reload();
	await expect(
		page.getByRole('heading', { level: 1, name: 'Your tags. A world of possibilities.' })
	).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
		const contact = await page.locator('[data-shipping-section="contact"]').boundingBox();
		expect(contact!.x).toBeCloseTo(0, 0);
		expect(contact!.width).toBeCloseTo(width, 0);
	}
});

test('synthetic materials opens a storm dialog, explores stock and attachments, and refreshes standalone', async ({
	page
}) => {
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const trigger = page.locator('[data-bento-topic="synthetic-materials"]');
	await trigger.scrollIntoViewIfNeeded();
	const weather = trigger.locator('[data-weather-tag]');
	await expect(weather).toHaveAttribute('data-weather-ready', 'true');
	await trigger.hover();
	await expect(weather).toHaveAttribute('data-weather-intensity', 'storm');
	await page.mouse.move(0, 0);
	await expect(weather).toHaveAttribute('data-weather-intensity', 'breeze');
	await trigger.focus();
	await expect(weather).toHaveAttribute('data-weather-intensity', 'storm');
	await trigger.click();
	await expect(page).toHaveURL(/\/capabilities\/synthetic-materials$/);
	const dialog = page.getByRole('dialog', { name: 'Built to weather it.' });
	await expect(dialog).toBeVisible();
	await expect(dialog.locator('[data-synthetic-material]')).toHaveCount(5);
	await dialog.getByRole('slider', { name: 'Wind strength' }).fill('100');
	await expect(dialog.locator('[data-weather-tag]').first()).toHaveAttribute(
		'data-weather-intensity',
		'storm'
	);
	for (const name of ['Tyvek', 'Valeron', 'Polyart', 'Tundra', 'V-Max']) {
		await dialog.getByRole('button', { name, exact: true }).click();
		await expect(dialog.getByRole('button', { name, exact: true })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
	}
	await expect(dialog.locator('[data-material-detail]')).toContainText(
		'balance of toughness and value'
	);
	await dialog.getByRole('button', { name: 'Elastic', exact: true }).click();
	await expect(
		dialog.locator('[data-synthetic-section="attachments"] [data-weather-tag]')
	).toHaveAttribute('data-weather-attachment', 'elastic');
	const sampleLink = await dialog.locator('[data-synthetic-samples]').getAttribute('href');
	const body = new URL(sampleLink!).searchParams.get('body');
	expect(body).toContain('V-Max');
	expect(body).toContain('Elastic');
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
	await expect(page).toHaveURL(/\/$/);
	await expect(trigger).toBeFocused();
	await trigger.click();
	await page.reload();
	await expect(page.getByRole('heading', { level: 1, name: 'Built to weather it.' })).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(page.locator('[data-weather-tag]').first()).toHaveAttribute(
		'data-weather-motion',
		'static'
	);
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
		const samples = await page.locator('[data-synthetic-section="samples"]').boundingBox();
		expect(samples!.x).toBeCloseTo(0, 0);
		expect(samples!.width).toBeCloseTo(width, 0);
	}
	await page.evaluate(() => {
		document.documentElement.classList.add('dark');
		document.documentElement.dataset.theme = 'dark';
	});
	await expect(page.getByRole('heading', { level: 1, name: 'Built to weather it.' })).toBeVisible();
});

test('animated bento artwork stays within the page on mobile and desktop', async ({ page }) => {
	for (const width of [320, 390, 768, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
			timeout: 60000
		});
		const tile = page.locator('[data-bento-topic="colors"]');
		await expect(tile.locator('[data-stock-columns]')).toHaveCSS('opacity', '1');
		await tile.hover();
		await expect
			.poll(() =>
				page.evaluate(() => {
					const footer = document.querySelector('footer')!;
					return (
						document.documentElement.scrollHeight -
						(footer.getBoundingClientRect().bottom + scrollY)
					);
				})
			)
			.toBeLessThanOrEqual(1);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
		const bounds = await tile.boundingBox();
		expect(bounds!.x).toBeGreaterThanOrEqual(0);
		expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
	}
	await page.setViewportSize({ width: 320, height: 844 });
	await page.locator('[data-bento-topic="synthetic-materials"]').click();
	const dialog = page.getByRole('dialog', { name: 'Built to weather it.' });
	await expect(dialog).toBeVisible();
	await expect
		.poll(() =>
			dialog.evaluate((element) =>
				[...element.querySelectorAll('a, button, h1, h2, p, canvas')].every((child) => {
					const bounds = child.getBoundingClientRect();
					return bounds.left >= 0 && bounds.right <= innerWidth;
				})
			)
		)
		.toBe(true);
});

test('shipping globe preview fills its artwork container at mobile and desktop widths', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const tile = page.locator('[data-bento-topic="shipping"]');
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		await tile.scrollIntoViewIfNeeded();
		const globe = tile.locator('[data-shipping-globe]');
		await expect(globe).toBeVisible();
		const dimensions = await globe.evaluate((element) => ({
			canvas: element.querySelector('canvas')!.getBoundingClientRect().width,
			container: element.parentElement!.getBoundingClientRect().width,
			globe: element.getBoundingClientRect().width
		}));
		expect(dimensions.globe).toBeCloseTo(dimensions.container, 0);
		expect(dimensions.canvas).toBeCloseTo(dimensions.container, 0);
	}
});

for (const [legacy, canonical] of [
	['stock-colors', 'stock-colors'],
	['colors', 'stock-colors'],
	['printing', 'variable-data'],
	['shipping', 'shipping'],
	['variable-data', 'variable-data'],
	['warehousing', 'warehousing'],
	['full-color-printing', 'full-color-printing'],
	['synthetic-materials', 'synthetic-materials']
]) {
	test(`redirects legacy tags/${legacy} directly to capabilities/${canonical}`, async ({
		request
	}) => {
		const response = await request.get(`/tags/${legacy}?source=legacy`, { maxRedirects: 0 });
		expect(response.status()).toBe(308);
		expect(response.headers().location).toBe(`/capabilities/${canonical}?source=legacy`);
	});
}

test('returns a real 404 for unknown legacy topics', async ({ request }) => {
	const response = await request.get('/tags/unknown', { maxRedirects: 0 });
	expect(response.status()).toBe(404);
});
