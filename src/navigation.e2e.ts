import { expect, test } from '@playwright/test';
import { navigation as sections } from './lib/data/navigation.js';

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
		await expect(page).toHaveTitle(
			`${route[0].toUpperCase()}${route.slice(1)} | Allen-Bailey Tag & Label`
		);
		const mainNavigation = page.getByRole('navigation', { name: 'Main navigation', exact: true });
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
			page.getByRole('button', { name: 'Sign In (coming soon)', exact: true })
		).toBeDisabled();
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
	for (const section of sections.filter((section) => section.children.length)) {
		await navigation.getByRole('button', { name: section.label, exact: true }).click();
		await expect(
			navigation.getByRole('link', { name: `All ${section.label.toLowerCase()}`, exact: true })
		).toBeVisible();
	}
	await navigation.getByRole('link', { name: 'All markets', exact: true }).click();
	await expect(page).toHaveURL(/\/markets$/);
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
	await mainNavigation.getByRole('button', { name: 'About', exact: true }).hover();
	await expect(page.locator('[data-nav-panel]:not([inert])')).toHaveAttribute(
		'data-direction',
		'1'
	);
	await mainNavigation.getByRole('button', { name: 'Products', exact: true }).hover();
	await expect(page.locator('[data-nav-panel]:not([inert])')).toHaveAttribute(
		'data-direction',
		'1'
	);
	await expect(
		page
			.locator('[data-nav-panel]:not([inert])')
			.getByRole('link', { name: /Paper and synthetic tags/ })
	).toBeVisible();
	await mainNavigation.getByRole('button', { name: 'Markets', exact: true }).hover();
	await expect(page.locator('[data-nav-panel]:not([inert])')).toHaveAttribute(
		'data-direction',
		'-1'
	);
	await page.screenshot({ path: 'test-results/mega-menu-desktop.png' });
	await page.mouse.move(20, 700);
	await expect(page.locator('#desktop-subnavigation')).not.toBeVisible();
	const products = mainNavigation.getByRole('button', { name: 'Products', exact: true });
	await products.focus();
	await products.press('ArrowDown');
	await expect(page.locator('[data-nav-panel] a').first()).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(products).toBeFocused();
	await expect(products).toHaveAttribute('aria-expanded', 'false');
});

test('all submenu destinations exist and unknown pages return 404', async ({ request }) => {
	for (const section of sections) {
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
	await navigation.getByRole('button', { name: 'Products', exact: true }).hover();
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
	).toBeDisabled();
	const products = menu.getByRole('button', { name: 'Products', exact: true });
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
	expect(await products.evaluate(sizing)).toEqual(
		await menu.getByRole('link', { name: 'News', exact: true }).evaluate(sizing)
	);
	await products.click();
	const submenu = page.locator('#mobile-submenu-products');
	await expect(products).toHaveAttribute('aria-expanded', 'true');
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
	await products.click();
	await expect(products).toHaveAttribute('aria-expanded', 'false');
	await expect.poll(hasSlide).toBe(true);
	await expect(submenu).not.toBeVisible();
});
