import { expect, test } from '@playwright/test';
import { createPageTitle } from './lib/pageTitle.js';
import { mainNavigation as sections, navigation as routeSections } from './lib/data/navigation.js';

test('megamenu clips horizontal travel and animates height in both directions', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/products');
	await page.waitForFunction(() =>
		document.getAnimations().some((animation) => animation.id === 'illustration-float')
	);
	// Stress natural content sizing now that compact labels normally fit the minimum panel height.
	await page.addStyleTag({ content: '[data-nav-panel] nav > a { min-height: 100px; }' });
	const navigation = page.getByRole('navigation', { name: 'Main navigation', exact: true });
	await navigation.getByRole('button', { name: 'Markets', exact: true }).hover();
	const viewport = page.locator('[data-nav-viewport]');
	await expect(viewport).toBeVisible();
	await viewport.evaluate(async (node) => {
		await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished));
	});
	const smallHeight = (await viewport.boundingBox())!.height;
	const heightFrames = () =>
		viewport.evaluate((node) =>
			node
				.getAnimations()
				.filter((animation) => animation.playState === 'running')
				.map((animation) => (animation.effect as KeyframeEffect).getKeyframes())
				.find((frames) => frames.some((frame) => frame.height !== undefined))
				?.map((frame) => parseFloat(String(frame.height)))
		);
	await navigation.getByRole('button', { name: 'Capabilities', exact: true }).hover();
	await expect.poll(heightFrames).toEqual([smallHeight, expect.any(Number)]);
	const growing = (await heightFrames())!;
	expect(growing[1]).toBeGreaterThan(growing[0]);
	const timingGap = await viewport.evaluate((node) => {
		const heightAnimation = node
			.getAnimations()
			.find((animation) =>
				(animation.effect as KeyframeEffect)
					.getKeyframes()
					.some((frame) => frame.height !== undefined)
			)!;
		const panel = node.querySelector('[data-nav-active="true"]')!;
		const slide = panel
			.getAnimations()
			.find((animation) => animation.effect?.getTiming().duration === 320)!;
		return Math.abs(Number(heightAnimation.currentTime) - Number(slide.currentTime));
	});
	expect(timingGap).toBeLessThan(34);
	await expect(viewport).toHaveCSS('overflow-x', 'hidden');
	await expect(viewport).toHaveCSS('overflow-y', 'hidden');
	await viewport.evaluate(async (node) => {
		await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished));
	});
	const largeHeight = (await viewport.boundingBox())!.height;
	await expect(viewport).toHaveCSS('overflow-y', 'hidden');
	await navigation.getByRole('button', { name: 'Markets', exact: true }).hover();
	await expect.poll(heightFrames).toEqual([largeHeight, smallHeight]);
	await expect(viewport).toHaveCSS('overflow-x', 'hidden');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await navigation.getByRole('button', { name: 'Capabilities', exact: true }).hover();
	await expect(viewport).toHaveCSS('height', `${largeHeight}px`);
	expect(await heightFrames()).toBeUndefined();
});

test('capability megamenu fits all links and scrolls within short viewports', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/');
	await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const trigger = page
		.getByRole('navigation', { name: 'Main navigation', exact: true })
		.getByRole('button', { name: 'Capabilities', exact: true });
	await trigger.hover();
	const panel = page.locator('[data-nav-panel]:not([inert])');
	const links = panel.locator('nav a');
	await expect(links).toHaveCount(7);
	for (const link of await links.all()) {
		expect((await link.boundingBox())!.y + (await link.boundingBox())!.height).toBeLessThanOrEqual(
			(await panel.boundingBox())!.y + (await panel.boundingBox())!.height
		);
	}
	await page.setViewportSize({ width: 1440, height: 500 });
	const last = links.last();
	await last.focus();
	await last.scrollIntoViewIfNeeded();
	await expect(page.locator('[data-nav-viewport]')).toHaveCSS('overflow-y', 'auto');
	const bounds = (await last.boundingBox())!;
	expect(bounds.y).toBeGreaterThanOrEqual(0);
	expect(bounds.y + bounds.height).toBeLessThanOrEqual(500);
	await expect(last).toBeFocused();
});

const routes = [
	'products',
	'markets',
	'capabilities',
	'about',
	'news',
	'contact',
	'careers',
	'resources'
];

test('navigation pages render with real links and a sign-in placeholder', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 1440, height: 1000 });
	for (const route of routes) {
		const response = await page.goto(`/${route}`);
		expect(response?.status()).toBe(200);
		await expect(page.locator('main h1')).toBeVisible();
		const expectedRoute =
			route === 'markets'
				? '/markets/fire-suppression'
				: (routeSections.find((section) => section.href === `/${route}`)?.children[0]?.href ??
					`/${route}`);
		await expect(page).toHaveURL(expectedRoute);
		await expect(page).toHaveTitle(
			expectedRoute === '/capabilities/attachments'
				? 'Attachments | Allen-Bailey Tag & Label'
				: expectedRoute === '/markets/fire-suppression'
					? 'Fire Suppression | Allen-Bailey Tag & Label'
					: createPageTitle(expectedRoute)
		);
		const mainNavigation = page.getByRole('navigation', { name: 'Main navigation', exact: true });
		await expect(mainNavigation.getByRole('button', { name: 'Products', exact: true })).toHaveCount(
			0
		);
		for (const section of sections) {
			await expect(
				mainNavigation.getByRole(section.children.length ? 'button' : 'link', {
					name: section.label,
					exact: true
				})
			).toBeVisible();
		}
		await expect(
			page.locator('header').getByRole('link', { name: 'Contact', exact: true })
		).toBeVisible();
		await expect(
			page.locator('header').getByRole('link', { name: 'Sign in', exact: true })
		).toHaveAttribute('href', '/sign-in');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	}
	await expect(page.locator('header')).not.toContainText('Request a Quote');
});

test('compact navigation reaches pages and closes after selection', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/products');
	await page.waitForFunction(() =>
		document.getAnimations().some((animation) => animation.id === 'illustration-float')
	);
	await page.getByRole('button', { name: 'Open navigation menu' }).click();
	const navigation = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
	await expect(navigation.getByRole('button', { name: 'Products', exact: true })).toHaveCount(0);
	for (const section of sections.filter((section) => section.children.length)) {
		await navigation.getByRole('button', { name: section.label, exact: true }).click();
		await expect(
			navigation.getByRole('link', { name: `All ${section.label.toLowerCase()}`, exact: true })
		).toHaveCount(0);
		await expect(
			navigation.getByRole('link', { name: section.children[0].label, exact: true })
		).toBeVisible();
	}
	await navigation.getByRole('link', { name: 'Fire Suppression', exact: true }).click();
	await expect(page).toHaveURL(/\/markets\/fire-suppression$/);
	await expect(navigation).not.toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('landing pages fit compact screens in dark mode', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 375, height: 812 });
	for (const route of routes.filter((route) => route !== 'news')) {
		await page.goto(`/${route}`);
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		await expect(page.locator('main h1')).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	}
	await page.screenshot({ path: 'test-results/navigation-dark-mobile.png' });
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/products');
	await expect(
		page.getByRole('navigation', { name: 'Main navigation', exact: true })
	).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.screenshot({ path: 'test-results/navigation-desktop.png' });
});

test('mega menu transitions directionally and supports keyboard dismissal', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/products');
	await page.waitForFunction(() =>
		document.getAnimations().some((animation) => animation.id === 'illustration-float')
	);
	const mainNavigation = page.getByRole('navigation', { name: 'Main navigation', exact: true });
	await mainNavigation.getByRole('button', { name: 'Capabilities', exact: true }).hover();
	await expect(page.locator('[data-nav-panel]:not([inert])')).toHaveAttribute(
		'data-direction',
		'1'
	);
	await mainNavigation.getByRole('button', { name: 'Resources', exact: true }).hover();
	await expect(page.locator('[data-nav-panel]:not([inert])')).toHaveAttribute(
		'data-direction',
		'1'
	);
	await expect(
		page
			.locator('[data-nav-panel]:not([inert])')
			.getByRole('link', { name: 'Artwork planning', exact: true })
	).toBeVisible();
	await mainNavigation.getByRole('button', { name: 'Markets', exact: true }).hover();
	await expect(page.locator('[data-nav-panel]:not([inert])')).toHaveAttribute(
		'data-direction',
		'-1'
	);
	await page.screenshot({ path: 'test-results/mega-menu-desktop.png' });
	await page.mouse.move(20, 700);
	await expect(page.locator('#desktop-subnavigation')).not.toBeVisible();
	const resources = mainNavigation.getByRole('button', { name: 'Resources', exact: true });
	await resources.focus();
	await resources.press('ArrowDown');
	await expect(page.locator('[data-nav-panel] a').first()).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(resources).toBeFocused();
	await expect(resources).toHaveAttribute('aria-expanded', 'false');
});

test('submenus show sorted route titles and all destinations exist', async ({ page, request }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/products');
	await page.waitForFunction(() =>
		document.getAnimations().some((animation) => animation.id === 'illustration-float')
	);
	const mainNavigation = page.getByRole('navigation', { name: 'Main navigation', exact: true });
	for (const section of sections) {
		if (section.children.length) {
			const response = await request.get(`${section.href}?source=menu`, { maxRedirects: 0 });
			expect(response.status()).toBe(308);
			expect(section.children.map((child) => `${child.href}?source=menu`)).toContain(
				response.headers().location
			);
			await mainNavigation.getByRole('button', { name: section.label, exact: true }).hover();
			await expect(
				page
					.locator('[data-nav-panel]:not([inert])')
					.getByRole('link', { name: `All ${section.label.toLowerCase()}`, exact: true })
			).toHaveCount(0);
			const links = page.locator('[data-nav-panel]:not([inert]) nav a');
			await expect(links).toHaveText(
				section.children
					.map((child) => child.label)
					.sort((first, second) => first.localeCompare(second, 'en'))
			);
		}
		for (const child of section.children) {
			const response = await request.get(child.href);
			expect(response.status(), child.href).toBe(200);
			expect(await response.text()).toContain('main-content');
		}
	}
	for (const route of ['products', 'markets', 'capabilities', 'resources'])
		expect((await request.get(`/${route}/not-a-page`)).status()).toBe(404);
});

test('mega menu runs reveal and real horizontal panel transitions', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/products');
	await page.waitForFunction(() =>
		document.getAnimations().some((animation) => animation.id === 'illustration-float')
	);
	const navigation = page.getByRole('navigation', { name: 'Main navigation', exact: true });
	await navigation.getByRole('button', { name: 'Markets', exact: true }).hover();
	const menu = page.locator('#desktop-subnavigation');
	await expect(menu).toBeVisible();
	expect(
		await menu.evaluate((node) =>
			node
				.getAnimations()
				.some(
					(animation) =>
						animation.effect?.getTiming().duration === 240 &&
						(animation.effect as KeyframeEffect)
							.getKeyframes()
							.some((frame) => String(frame.transform).includes('scale'))
				)
		)
	).toBe(true);
	await menu.evaluate(async (node) => {
		await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished));
	});
	await navigation.getByRole('button', { name: 'Resources', exact: true }).hover();
	const incoming = page.locator('[data-nav-panel]:not([inert])');
	const getTravel = async () =>
		incoming.evaluate((node) => {
			const animation = node
				.getAnimations()
				.find((animation) => animation.effect?.getTiming().duration === 320);
			if (!animation) return null;
			const frames = (animation.effect as KeyframeEffect).getKeyframes();
			return {
				start: new DOMMatrix(String(frames[0].transform)).m41,
				end: new DOMMatrix(String(frames.at(-1)?.transform)).m41
			};
		});
	await expect.poll(getTravel).toEqual({ start: 96, end: 0 });
	await expect(page.locator('[data-nav-panel][inert]')).toContainText('Explore Markets');
	await menu.evaluate(async (node) => {
		await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished));
	});
	await navigation.getByRole('button', { name: 'Markets', exact: true }).hover();
	await expect.poll(getTravel).toEqual({ start: -96, end: 0 });
	await menu.evaluate(async (node) => {
		await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished));
	});
	await page.mouse.move(20, 700);
	await expect
		.poll(() =>
			menu.evaluate((node) =>
				node.getAnimations().some((animation) => animation.effect?.getTiming().duration === 240)
			)
		)
		.toBe(true);
	await expect(menu).not.toBeVisible();
});

test('mobile utilities live in the menu and submenus slide with matching link sizing', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/products');
	await page.waitForFunction(() =>
		document.getAnimations().some((animation) => animation.id === 'illustration-float')
	);
	const header = page.locator('header');
	await expect(header.getByRole('link', { name: 'Contact', exact: true })).not.toBeVisible();
	await expect(
		header.getByRole('button', { name: 'Sign In (coming soon)', exact: true })
	).not.toBeVisible();
	await page.getByRole('button', { name: 'Open navigation menu' }).click();
	const menu = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
	await expect(menu.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
	await expect(
		menu.getByRole('button', { name: 'Sign In (coming soon)', exact: true })
	).toHaveAttribute('href', '/sign-in');
	const resources = menu.getByRole('button', { name: 'Resources', exact: true });
	const sizing = (node: HTMLElement | SVGElement) => {
		const style = getComputedStyle(node);
		return [
			style.fontSize,
			style.fontWeight,
			style.paddingTop,
			style.paddingBottom,
			style.paddingLeft,
			style.paddingRight
		];
	};
	expect(await resources.evaluate(sizing)).toEqual(
		await menu.getByRole('link', { name: 'News', exact: true }).evaluate(sizing)
	);
	await resources.click();
	const submenu = page.locator('#mobile-submenu-resources');
	await expect(resources).toHaveAttribute('aria-expanded', 'true');
	await expect(submenu).toBeVisible();
	const hasSlide = () =>
		submenu.evaluate((node) =>
			node
				.getAnimations()
				.some((animation) =>
					(animation.effect as KeyframeEffect).getKeyframes().some((frame) => 'height' in frame)
				)
		);
	await expect.poll(hasSlide).toBe(true);
	await submenu.evaluate(async (node) => {
		await Promise.all(node.getAnimations().map((animation) => animation.finished));
	});
	await resources.click();
	await expect(resources).toHaveAttribute('aria-expanded', 'false');
	await expect.poll(hasSlide).toBe(true);
	await expect(submenu).not.toBeVisible();
});

test('section roots redirect on the server without JavaScript', async ({ browser, baseURL }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	for (const section of sections.filter((section) => section.children.length)) {
		const response = await page.goto(`${baseURL}${section.href}?source=direct`);
		expect(response?.status()).toBe(200);
		expect(section.children.map((child) => `${baseURL}${child.href}?source=direct`)).toContain(
			page.url()
		);
		await expect(page.locator('main h1')).toBeVisible();
	}
	await context.close();
});
