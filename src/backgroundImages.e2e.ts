import { expect, test } from '@playwright/test';

const pixel = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5l8AAAAASUVORK5CYII=',
	'base64'
);

test('background image loading preserves responsive sources and limits concurrent promotions', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	// Make connection hints deterministic, regardless of the test machine.
	await page.addInitScript(() =>
		Object.defineProperty(navigator, 'connection', {
			configurable: true,
			value: Object.assign(new EventTarget(), { saveData: false, effectiveType: '4g' })
		})
	);
	const requests: string[] = [];
	const releases = new Map<string, () => void>();
	await page.route('**/__background-image__/**', async (route) => {
		const name = new URL(route.request().url()).pathname.split('/').at(-1)!;
		requests.push(name);
		await new Promise<void>((resolve) => releases.set(name, resolve));
		await route.fulfill({ contentType: 'image/png', body: pixel });
	});
	await page.goto('/contact');
	await page.waitForLoadState('load');
	await expect(page.locator('[data-contact-ready]')).toHaveAttribute('data-contact-ready', 'true');
	await page.evaluate(() => {
		for (const [index, top] of [20000, 30000, 40000].entries()) {
			const image = document.createElement('img');
			image.id = `background-test-${index}`;
			image.loading = 'lazy';
			image.width = 100;
			image.height = 100;
			image.style.cssText = `position:absolute;left:0;top:${top}px;width:100px;height:100px`;
			image.src = `/__background-image__/${index}.png`;
			if (index === 0) {
				const picture = document.createElement('picture');
				const source = document.createElement('source');
				source.srcset = '/__background-image__/responsive.png 1x';
				picture.append(source, image);
				document.body.append(picture);
			} else document.body.append(image);
		}
	});
	await expect.poll(() => requests.length).toBe(2);
	expect(new Set(requests)).toEqual(new Set(['responsive.png', '1.png']));
	await expect(page.locator('#background-test-0')).toHaveAttribute('fetchpriority', 'low');
	await expect(page.locator('#background-test-2')).toHaveAttribute('loading', 'lazy');
	releases.get('responsive.png')!();
	await expect.poll(() => requests.length).toBe(3);
	expect(requests[2]).toBe('2.png');
	await expect(page.locator('#background-test-0')).not.toHaveAttribute('fetchpriority', 'low');
	await expect(page.locator('#background-test-0')).toHaveAttribute('loading', 'lazy');
	for (const release of releases.values()) release();
	// The next client route must resume the persistent root attachment.
	await page
		.getByRole('navigation', { name: 'Main navigation', exact: true })
		.getByRole('link', { name: 'About', exact: true })
		.click();
	await expect(page).toHaveURL(/\/about$/);
	await page.evaluate(() => {
		const image = document.createElement('img');
		image.id = 'next-route-image';
		image.loading = 'lazy';
		image.src = '/__background-image__/next.png';
		image.width = 100;
		image.height = 100;
		image.style.cssText = 'position:absolute;top:50000px;left:0;width:100px;height:100px';
		document.body.append(image);
	});
	await expect.poll(() => requests.includes('next.png')).toBe(true);
	releases.get('next.png')!();
});

for (const mode of ['save-data', 'slow', 'fallback', 'opt-out'] as const) {
	test(`background image policy handles ${mode}`, async ({ page }) => {
		await page.addInitScript((mode) => {
			Object.defineProperty(navigator, 'connection', {
				configurable: true,
				value: Object.assign(new EventTarget(), {
					saveData: mode === 'save-data',
					effectiveType: mode === 'slow' ? '2g' : '4g'
				})
			});
			if (mode === 'fallback')
				Object.defineProperty(window, 'requestIdleCallback', {
					configurable: true,
					value: undefined
				});
		}, mode);
		let requests = 0;
		await page.route('**/__background-image__/policy.png', async (route) => {
			requests++;
			await route.fulfill({ contentType: 'image/png', body: pixel });
		});
		await page.goto('/contact');
		await page.waitForLoadState('load');
		await expect(page.locator('[data-contact-ready]')).toHaveAttribute(
			'data-contact-ready',
			'true'
		);
		await page.evaluate((mode) => {
			const image = document.createElement('img');
			image.id = 'policy-image';
			if (mode === 'opt-out') image.dataset.backgroundImages = 'off';
			image.loading = 'lazy';
			image.src = '/__background-image__/policy.png';
			image.width = 100;
			image.height = 100;
			image.style.cssText = 'position:absolute;top:50000px;left:0;width:100px;height:100px';
			document.body.append(image);
		}, mode);
		if (mode === 'fallback') await expect.poll(() => requests).toBe(1);
		else {
			await page.waitForTimeout(600);
			await expect(page.locator('#policy-image')).toHaveAttribute('loading', 'lazy');
			await expect(page.locator('#policy-image')).not.toHaveAttribute('fetchpriority', 'low');
			expect(requests).toBe(0);
		}
	});
}

test('background loading pauses while the tab is hidden and resumes on visibility change', async ({
	page
}) => {
	await page.addInitScript(() =>
		Object.defineProperty(navigator, 'connection', {
			configurable: true,
			value: Object.assign(new EventTarget(), { saveData: false, effectiveType: '4g' })
		})
	);
	let requests = 0;
	await page.route('**/__background-image__/visibility.png', async (route) => {
		requests++;
		await route.fulfill({ contentType: 'image/png', body: pixel });
	});
	await page.goto('/contact');
	await page.waitForLoadState('load');
	await expect(page.locator('[data-contact-ready]')).toHaveAttribute('data-contact-ready', 'true');
	await page.evaluate(() => {
		Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
		document.dispatchEvent(new Event('visibilitychange'));
		const image = document.createElement('img');
		image.loading = 'lazy';
		image.src = '/__background-image__/visibility.png';
		image.width = 100;
		image.height = 100;
		image.style.cssText = 'position:absolute;top:50000px;left:0;width:100px;height:100px';
		document.body.append(image);
	});
	await page.waitForTimeout(600);
	expect(requests).toBe(0);
	await page.evaluate(() => {
		Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
		document.dispatchEvent(new Event('visibilitychange'));
	});
	await expect.poll(() => requests).toBe(1);
});
