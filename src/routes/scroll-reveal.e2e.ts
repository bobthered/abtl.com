import { topics, topicHref } from '../lib/components/BentoSection/topics';
import { expect, test } from '@playwright/test';

test('new content reveals once, staggers a row, and counts up without layout overflow', async ({
	page
}) => {
	await page.setViewportSize({ width: 1200, height: 900 });
	await page.goto('/');
	await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await page.evaluate(() => {
		const row = document.createElement('div');
		row.className = 'grid grid-cols-3 gap-4';
		row.dataset.revealTest = 'true';
		for (let index = 0; index < 3; index++) {
			const item = document.createElement('div');
			item.dataset.revealItem = '';
			item.className = 'h-40';
			item.textContent = `Item ${index}`;
			row.append(item);
		}
		const counter = document.createElement('span');
		counter.dataset.countUp = '10000';
		counter.textContent = '10,000';
		counter.setAttribute('aria-label', '10,000');
		row.append(counter);
		document.querySelector('main')!.append(row);
	});
	const row = page.locator('[data-reveal-test]');
	await row.scrollIntoViewIfNeeded();
	const items = row.locator('[data-reveal-item]');
	await expect(row.locator('[data-scroll-reveal]')).toHaveCount(0);
	await expect(items.first()).toHaveAttribute('data-scroll-reveal-state', 'complete');
	expect(
		await items.evaluateAll((elements) =>
			elements.map((element) => element.getAttribute('data-scroll-reveal-delay'))
		)
	).toEqual(['0', '70', '140']);
	const counter = row.locator('[data-count-up]');
	await expect
		.poll(async () => Number((await counter.textContent())!.replaceAll(',', '')))
		.toBeLessThan(10000);
	await expect(counter).toHaveText('10,000');
	await expect(counter).toHaveAttribute('aria-label', '10,000');
	await page.evaluate(() => window.scrollTo(0, 0));
	await row.scrollIntoViewIfNeeded();
	expect(await items.first().evaluate((element) => element.getAnimations().length)).toBe(0);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1200);
});

test('reduced motion finishes active counts and applies to newly opened dialogs', async ({
	page
}) => {
	await page.goto('/tags/stock-colors');
	const count = page.locator('[data-stock-color-total]');
	await count.scrollIntoViewIfNeeded();
	await expect(count).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await expect.poll(async () => Number(await count.textContent())).toBeLessThan(21);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(count).toHaveText('21');
	expect(await count.evaluate((element) => element.getAnimations().length)).toBe(0);
	await page.goto('/');
	await expect(page.locator('[data-bento-ready="true"]')).toBeVisible();
	await page.locator('[data-bento-topic="shipping"]').click();
	const dialog = page.getByRole('dialog', { name: 'Your tags. A world of possibilities.' });
	const states = dialog.locator('[data-shipping-state-count]');
	await states.scrollIntoViewIfNeeded();
	await expect(states).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await expect(states).toHaveText('50');
	expect(await states.evaluate((element) => element.getAnimations().length)).toBe(0);
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
});

test('content and final numbers remain available without JavaScript', async ({
	browser,
	baseURL
}) => {
	const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/tags/stock-colors');
	await expect(page.locator('main h1')).toBeVisible();
	await expect(page.locator('[data-stock-color-total]')).toHaveText('21');
	await context.close();
});

for (const height of [600, 900]) {
	test(`reveal is hidden until its top reaches 80% of a ${height}px viewport`, async ({ page }) => {
		await page.setViewportSize({ width: 1200, height });
		await page.goto('/');
		await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
		await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));
		await expect(page.locator('header > div').first()).toHaveCSS('padding-top', '16px');
		await page.evaluate(() => {
			const target = document.createElement('div');
			target.dataset.scrollReveal = '';
			target.dataset.offsetTest = '';
			target.className = 'h-40';
			target.textContent = 'Offset reveal';
			const space = document.createElement('div');
			space.className = 'h-screen';
			document.querySelector('main')!.append(target, space);
			window.scrollTo({
				top: target.getBoundingClientRect().top + scrollY - (innerHeight * 0.8 + 20),
				behavior: 'instant'
			});
		});
		const target = page.locator('[data-offset-test]');
		// Reposition after the sticky header has finished shrinking.
		await page.waitForTimeout(250);
		await target.evaluate((element) =>
			window.scrollTo({
				top: element.getBoundingClientRect().top + scrollY - (innerHeight * 0.8 + 20),
				behavior: 'instant'
			})
		);
		await page.waitForTimeout(150);
		const top = (await target.boundingBox())!.y;
		expect(top).toBeGreaterThan(height * 0.8);
		expect(top).toBeLessThan(height * 0.8 + 40);
		await expect(target).not.toHaveAttribute('data-scroll-reveal-state', 'complete');
		await expect(target).toHaveCSS('opacity', '0');
		await target.evaluate((element) =>
			window.scrollTo({
				top: element.getBoundingClientRect().top + scrollY - (innerHeight * 0.8 - 20),
				behavior: 'instant'
			})
		);
		await expect(target).toHaveAttribute('data-scroll-reveal-state', 'complete');
		const effect = await target.evaluate((element) => {
			const effect = element.getAnimations()[0]?.effect as KeyframeEffect;
			return { duration: effect.getTiming().duration, opacity: effect.getKeyframes()[0].opacity };
		});
		expect(effect).toEqual({ duration: 700, opacity: '0' });
		await expect(target).toHaveCSS('opacity', '1');
	});
}

test('keyboard focus and reduced motion expose pending content immediately', async ({ page }) => {
	await page.goto('/');
	const heading = page.locator('#industries-heading');
	await expect(heading).toHaveCSS('opacity', '0');
	await heading.evaluate((element) => {
		element.setAttribute('tabindex', '-1');
		(element as HTMLElement).focus({ preventScroll: true });
	});
	await expect(heading).toHaveCSS('opacity', '1');
	const products = page.locator('#products-heading');
	await expect(products).toHaveCSS('opacity', '0');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(products).toHaveCSS('opacity', '1');
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await expect(products).toHaveCSS('opacity', '1');
});

test('content at the scroll limit is revealed even below the trigger line', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await page.evaluate(() => {
		const target = document.createElement('div');
		target.dataset.scrollReveal = '';
		target.dataset.endTest = '';
		target.className = 'h-8';
		target.textContent = 'Final content';
		document.body.append(target);
	});
	const target = page.locator('[data-end-test]');
	await expect(target).toHaveCSS('opacity', '0');
	await page.evaluate(() =>
		window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
	);
	await expect(target).toHaveCSS('opacity', '1');
});

test('footer groups enter together with staggering and keep navigation accessible', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/');
	const groups = page.locator('footer [data-scroll-reveal-state]');
	await expect.poll(() => groups.count()).toBeGreaterThanOrEqual(4);
	await expect(groups.first()).toHaveCSS('opacity', '0');
	await page.evaluate(() =>
		window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
	);
	for (const group of await groups.all()) {
		await expect(group).toHaveAttribute('data-scroll-reveal-state', 'complete');
		await expect(group).toHaveCSS('opacity', '1');
	}
	const delays = await groups.evaluateAll((elements) =>
		elements.map((element) => element.getAttribute('data-scroll-reveal-delay'))
	);
	expect(delays).toContain('70');
	expect(delays).toContain('140');
	await expect(
		page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link').first()
	).toBeVisible();
});

test('stock photo marquee reveals its stationary wrapper without revealing repeated cards', async ({
	page
}) => {
	await page.goto('/tags/stock-colors');
	const marquee = page.locator('main [data-marquee]').first();
	const wrapper = marquee.locator('..');
	await expect(wrapper).not.toHaveAttribute('data-scroll-reveal');
	await expect(wrapper).toHaveCSS('opacity', '0');
	await marquee.scrollIntoViewIfNeeded();
	await expect(wrapper).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await expect(wrapper).toHaveCSS('opacity', '1');
	await expect(marquee.locator('[data-scroll-reveal-state]')).toHaveCount(0);
	const track = marquee.locator('[data-marquee-track]');
	await page.mouse.move(0, 0);
	await expect
		.poll(() =>
			track.evaluate((element) =>
				element.getAnimations().some((animation) => animation.playState === 'running')
			)
		)
		.toBe(true);
	await marquee.hover();
	await expect
		.poll(() =>
			track.evaluate((element) =>
				element.getAnimations().every((animation) => animation.playState === 'paused')
			)
		)
		.toBe(true);
});

test('shipping dialog reveals state artwork and staggers its fifty state tiles on entry', async ({
	page
}) => {
	await page.addInitScript(() => {
		const animate = Element.prototype.animate;
		const entries: number[] = [];
		Object.assign(window, { stateEntranceDelays: entries });
		// A standard function preserves the animated element as dynamic this.
		Element.prototype.animate = function (...args) {
			if (this.hasAttribute('data-shipping-state')) {
				const options = args[1];
				entries.push(typeof options === 'object' ? Number(options?.delay ?? 0) : 0);
			}
			return animate.apply(this, args);
		};
	});
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/');
	await expect(page.locator('[data-bento-ready="true"]')).toBeVisible();
	await page.locator('[data-bento-topic="shipping"]').click();
	const dialog = page.getByRole('dialog', { name: 'Your tags. A world of possibilities.' });
	const map = dialog.getByRole('img', {
		name: 'Tile map of all 50 U.S. states, including Alaska and Hawaii'
	});
	const artwork = map.locator('..');
	await expect(artwork).not.toHaveAttribute('data-scroll-reveal');

	await map.scrollIntoViewIfNeeded();
	await expect(artwork).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await expect
		.poll(() =>
			page.evaluate(
				() => (window as unknown as { stateEntranceDelays: number[] }).stateEntranceDelays.length
			)
		)
		.toBe(50);
	expect(
		await page.evaluate(
			() => (window as unknown as { stateEntranceDelays: number[] }).stateEntranceDelays
		)
	).toEqual(Array.from({ length: 50 }, (_, index) => index * 14));
	await expect(artwork).toHaveCSS('opacity', '1');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect
		.poll(() => map.evaluate((element) => element.getAnimations({ subtree: true }).length))
		.toBe(0);
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
});

for (const isDialog of [false, true]) {
	test(`stock color preview and sample action reveal in the ${isDialog ? 'dialog' : 'standalone page'}`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(isDialog ? '/' : '/tags/stock-colors');
		if (isDialog) {
			await expect(page.locator('[data-bento-ready="true"]')).toBeVisible();
			await page.locator('[data-bento-topic="colors"]').click();
		}
		const content = page.locator('[data-stock-color-content]');
		const preview = content.locator('figure');
		const swatches = content.getByRole('group', { name: 'Preview stock colors' });
		const samples = content.getByRole('button', { name: 'Request Samples', exact: true });
		for (const item of [preview, swatches, samples]) {
			await expect(item).not.toHaveAttribute('data-scroll-reveal');
			await expect(item).toHaveCSS('opacity', '0');
		}
		await preview.scrollIntoViewIfNeeded();
		await expect(preview).toHaveAttribute('data-scroll-reveal-state', 'complete');
		await expect(swatches).toHaveAttribute('data-scroll-reveal-state', 'complete');
		await expect(preview).toHaveCSS('opacity', '1');
		await swatches.getByRole('button', { name: 'Preview White', exact: true }).click();
		await expect(preview.locator('[data-stock-preview-color]')).toHaveAttribute(
			'data-stock-preview-color',
			'white'
		);
		await preview.getByRole('button', { name: 'Flip tag' }).click();
		await expect(preview.locator('[data-stock-preview-side]')).toHaveAttribute(
			'data-stock-preview-side',
			'back'
		);
		await samples.scrollIntoViewIfNeeded();
		await expect(samples).toHaveAttribute('data-scroll-reveal-state', 'complete');
		await expect(samples).toHaveCSS('opacity', '1');
		await samples.click();
		await expect(page.getByRole('dialog').last()).toContainText('Select all');
	});
}

// Audit every content leaf, including decorative artwork and labels, against actual registration.
// A unit is covered by its own entrance or a revealed ancestor. Explicit opt-outs stay immediate.
for (const width of [390, 1440]) {
	for (const route of ['/', ...topics.map(topicHref)]) {
		test(`all content has entrance coverage at ${width}px on ${route}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(route);
			await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
			const missing = await page.locator('main, footer').evaluateAll((roots) =>
				roots.flatMap((root) =>
					[
						...root.querySelectorAll(
							'h1,h2,h3,h4,h5,h6,p,figure,figcaption,img,a,button,ul,ol,dl,[role="group"],svg,canvas,span'
						)
					]
						.filter((element) => {
							if (element.closest('header, nav, .sr-only, [inert], [data-scroll-reveal="off"]'))
								return false;
							if (!element.getBoundingClientRect().width || !element.getBoundingClientRect().height)
								return false;
							return !element.closest('[data-scroll-reveal-state]');
						})
						.map((element) => element.outerHTML.slice(0, 220))
				)
			);
			expect(missing).toEqual([]);
		});
	}
}

for (const topic of topics) {
	test(`all ${topic.id} dialog content and its bottom CTA have entrance coverage`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready="true"]')).toBeVisible();
		await page.locator(`[data-bento-topic="${topic.id}"]`).click();
		const dialog = page.locator('[data-bento-dialog]');
		await expect(dialog.locator('[data-topic-ready="true"]')).toBeVisible();
		const missing = await dialog.evaluate((root) =>
			[
				...root.querySelectorAll(
					'h1,h2,h3,h4,h5,h6,p,figure,figcaption,img,a,button,ul,ol,dl,[role="group"],svg,canvas,span'
				)
			]
				.filter((element) => {
					if (element.closest('.sr-only, [inert], [data-scroll-reveal="off"]')) return false;
					if (!element.getBoundingClientRect().width || !element.getBoundingClientRect().height)
						return false;
					return !element.closest('[data-scroll-reveal-state]');
				})
				.map((element) => element.outerHTML.slice(0, 220))
		);
		expect(missing).toEqual([]);
		const cta = dialog.locator('section').last().locator('a,button').last();
		await expect(cta).toHaveAttribute('data-scroll-reveal-state', 'pending');
		await expect(cta).toHaveCSS('opacity', '0');
		await cta.scrollIntoViewIfNeeded();
		await expect(cta).toHaveAttribute('data-scroll-reveal-state', 'complete');
		await expect(cta).toHaveCSS('opacity', '1');
		await expect(dialog.getByRole('button', { name: 'Close topic' })).toBeEnabled();
	});
}

test('unmarked SVG, canvas, decorative groups and CSS artwork are discovered automatically', async ({
	page
}) => {
	await page.goto('/');
	await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await page.evaluate(() => {
		const section = document.createElement('section');
		section.dataset.automaticRevealTest = '';
		section.className = 'grid grid-cols-4 gap-4';
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '100');
		svg.setAttribute('height', '100');
		const canvas = document.createElement('canvas');
		const artwork = document.createElement('div');
		artwork.className = 'h-40 bg-primary-500';
		const decorative = document.createElement('div');
		decorative.setAttribute('aria-hidden', 'true');
		const label = document.createElement('span');
		label.textContent = 'Decorative illustration';
		decorative.append(label);
		section.append(svg, canvas, artwork, decorative);
		document.querySelector('main')!.append(section);
	});
	const section = page.locator('[data-automatic-reveal-test]');
	await expect(section.locator('[data-scroll-reveal-state="pending"]')).toHaveCount(4);
	await expect(section).not.toHaveAttribute('data-scroll-reveal-state');
	await expect(section.locator('[data-scroll-reveal]')).toHaveCount(0);
	await section.scrollIntoViewIfNeeded();
	await expect(section.locator('[data-scroll-reveal-state="complete"]')).toHaveCount(4);
	await page.evaluate(() => {
		const button = document.createElement('button');
		button.textContent = 'New control in revealed surface';
		document.querySelector('[data-automatic-reveal-test] > div')!.append(button);
	});
	await expect(section.getByRole('button')).toBeVisible();
	await expect(section.getByRole('button')).not.toHaveAttribute('data-scroll-reveal-state');
});
