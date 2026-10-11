import { expect, test } from '@playwright/test';

for (const [width, count] of [
	[390, 2],
	[800, 3],
	[1440, 5]
]) {
	test(`news uses golden proportions and cycles its stories at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
			timeout: 60000
		});
		const section = page.locator('[data-news-highlights]');
		await section.scrollIntoViewIfNeeded();
		await expect(section.getByText('1 / 6', { exact: true })).toBeVisible();
		const slides = section.locator('[data-news-image]');
		await expect(slides.filter({ visible: true })).toHaveCount(count);
		const widths = await slides.evaluateAll((nodes) =>
			nodes.map((node) => node.getBoundingClientRect().width)
		);
		for (let index = 1; index < count; index++) {
			expect(widths[index - 1] / widths[index]).toBeCloseTo(1 + Math.sqrt(5), 2);
		}
		const imageLayout = await slides.evaluateAll((nodes) =>
			nodes
				.filter((node) => node.getBoundingClientRect().width > 0)
				.map((node) => {
					const image = node.querySelector('img')!;
					const bounds = node.getBoundingClientRect();
					const imageBounds = image.getBoundingClientRect();
					return {
						width: imageBounds.width,
						center: (imageBounds.left + imageBounds.right) / 2 - (bounds.left + bounds.right) / 2,
						gap: parseFloat(getComputedStyle(node).marginRight),
						fit: getComputedStyle(image).objectFit
					};
				})
		);
		for (let index = 0; index < imageLayout.length; index++) {
			expect(imageLayout[index].width).toBe(imageLayout[0].width);
			expect(Math.abs(imageLayout[index].center)).toBeLessThan(1);
			expect(imageLayout[index].gap).toBe(index < count - 1 ? 16 : 0);
			expect(imageLayout[index].fit).not.toBe('cover');
		}
		const next = section.getByRole('button', { name: 'Next article', exact: true });
		expect((await next.boundingBox())!.y + (await next.boundingBox())!.height).toBeLessThan(
			(await section.locator('[data-news-track]').boundingBox())!.y
		);
		await next.focus();
		await next.click();
		await expect
			.poll(() =>
				section.locator('[data-news-track]').evaluate((track) => {
					const animation = track
						.firstElementChild!.getAnimations()
						.find((item) =>
							(item.effect as KeyframeEffect)
								.getKeyframes()
								.some((frame) => frame.flexGrow !== undefined)
						);
					return animation
						? (animation.effect as KeyframeEffect).getKeyframes().map((frame) => frame.flexGrow)
						: [];
				})
			)
			.toEqual(['1', '0']);
		await expect(slides.first()).toHaveAttribute('data-news-image', 'nursery');
		await expect(section.locator('[data-news-story]')).toContainText('A little detail.');
		await expect(slides.last()).toHaveAttribute('data-news-image', 'equipment');
		await expect(next).toHaveAttribute('aria-disabled', 'false');
		await expect(next).toBeFocused();
		await section.getByRole('button', { name: 'Previous article' }).click();
		await expect(section.locator('[data-news-story]')).toContainText('Every inspection');
		await expect(slides.first()).toHaveAttribute('data-news-image', 'equipment');
		await expect(next).toHaveAttribute('aria-disabled', 'false');
		await next.focus();
		await page.keyboard.press('ArrowRight');
		await expect(section.locator('[data-news-story]')).toContainText('A little detail.');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}

test('news wraps and respects reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
	await page.goto('/');
	await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const section = page.locator('[data-news-highlights]');
	await section.scrollIntoViewIfNeeded();
	const next = section.getByRole('button', { name: 'Next article', exact: true });
	for (let index = 0; index < 6; index++) {
		await next.click();
		await expect(next).toHaveAttribute('aria-disabled', 'false');
	}
	await expect(section.locator('[data-news-story]')).toContainText('Every inspection');
	await expect(section.locator('[data-news-image]').first()).toHaveAttribute(
		'data-news-image',
		'equipment'
	);
	expect(
		await section
			.locator('[data-news-track]')
			.evaluate((track) => track.getAnimations({ subtree: true }).length)
	).toBe(0);
});

for (const width of [390, 1440]) {
	test(`news articles are linked from the homepage and news index at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		const highlights = page.locator('[data-news-highlights]');
		await highlights.getByRole('link', { name: 'All news', exact: true }).click();
		await expect(page).toHaveURL(/\/news$/);
		const grid = page.locator('[data-news-grid]');
		await expect(grid.locator(':scope > a')).toHaveCount(6);
		expect(await grid.evaluate((node) => getComputedStyle(node).gap)).toBe('16px');
		await grid.getByRole('link', { name: /Every inspection has a story/ }).click();
		await expect(page).toHaveURL(/\/news\/equipment$/);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			'Every inspection has a story.'
		);
		await page.reload();
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			'Every inspection has a story.'
		);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}

test('unknown news articles return a real 404', async ({ page }) => {
	const response = await page.goto('/news/not-a-post');
	expect(response?.status()).toBe(404);
});

for (const width of [390, 1440]) {
	test(`active news images expand and open route-backed dialogs at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
			timeout: 60000
		});
		const section = page.locator('[data-news-highlights]');
		await section.scrollIntoViewIfNeeded();
		await page.mouse.move(0, 0);
		const slide = section.locator('[data-news-image="equipment"]');
		const tile = slide.getByRole('button');
		const initialWidth = (await slide.boundingBox())!.width;
		await tile.scrollIntoViewIfNeeded();
		await expect(section.locator('[data-news-images-reveal]')).toHaveAttribute(
			'data-scroll-reveal-state',
			'complete'
		);
		await tile.hover();

		await expect
			.poll(async () => (await slide.boundingBox())!.width - initialWidth)
			.toBeCloseTo(32, 0);
		await expect(tile.locator('[data-bento-expand]')).toBeVisible();
		await expect(tile.locator('[data-bento-outline]')).toHaveCSS('opacity', '0.6');
		await expect(section.locator('[data-news-image]').locator('[data-bento-expand]')).toHaveCount(
			1
		);
		await page.mouse.move(0, 0);
		await expect.poll(async () => (await slide.boundingBox())!.width).toBeCloseTo(initialWidth, 0);
		await tile.click();
		await expect(page).toHaveURL(/\/news\/equipment$/);
		const dialog = page.locator('[data-news-dialog]');
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('heading', { level: 1 })).toHaveText(
			'Every inspection has a story.'
		);
		await expect(page.locator('[data-news-highlights]')).toBeAttached();
		await expect(dialog.getByRole('button', { name: 'Close article' })).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(page).toHaveURL(/\/$/);
		await expect(dialog).toHaveCount(0);
		await expect(tile).toBeFocused();
		await page.goForward();
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: 'Close article' }).click();
		await expect(page).toHaveURL(/\/$/);
		await expect(dialog).toHaveCount(0);
		await tile.click();
		await expect(dialog).toBeVisible();
		await dialog.click({ position: { x: 2, y: 2 } });
		await expect(page).toHaveURL(/\/$/);
		await expect(dialog).toHaveCount(0);
		await tile.click();
		await expect(dialog).toBeVisible();
		await page.reload();
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			'Every inspection has a story.'
		);
		await expect(page.locator('[data-news-dialog]')).toHaveCount(0);
		await expect(page.locator('[data-news-highlights]')).toHaveCount(0);
	});
}

for (const [width, index, id, title] of [
	[390, 1, 'nursery', 'A little detail. A growing connection.'],
	[1440, 3, 'textile', 'Make the first impression count.']
] as const) {
	test(`selecting image ${index + 1} animates it to the front at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
			timeout: 60000
		});
		const section = page.locator('[data-news-highlights]');
		const slides = section.locator('[data-news-image]');
		const target = section.locator(`[data-news-image="${id}"]`);
		const button = target.getByRole('button', { name: `Select ${title}`, exact: true });
		await button.scrollIntoViewIfNeeded();
		await expect(section.locator('[data-news-images-reveal]')).toHaveAttribute(
			'data-scroll-reveal-state',
			'complete'
		);
		await button.focus();
		await button.click();
		await expect
			.poll(() =>
				target.evaluate((element) =>
					element
						.getAnimations()
						.some((animation) =>
							(animation.effect as KeyframeEffect)
								.getKeyframes()
								.some((frame) => frame.flexGrow === '1')
						)
				)
			)
			.toBe(true);
		await expect(slides.first()).toHaveAttribute('data-news-image', id);
		await expect(section.locator('[data-news-story]')).toContainText(title);
		await expect(section.locator('[data-news-story]')).toContainText(
			id === 'textile' ? 'bringing a brand and its product details together' : 'identifying plants'
		);
		await expect(page).toHaveURL(/\/$/);
		await expect(page.locator('[data-news-dialog]')).toHaveCount(0);
		await expect(target.getByRole('button')).toBeFocused();
		await expect(target.locator('[data-bento-expand]')).toBeVisible();
		await expect(slides.nth(1).locator('[data-bento-expand]')).toHaveCount(0);
		await target.getByRole('button', { name: `Read ${title}` }).press('Enter');
		await expect(page).toHaveURL(new RegExp(`/news/${id}$`));
		await expect(page.locator('[data-news-dialog]').getByRole('heading', { level: 1 })).toHaveText(
			title
		);
		await page.keyboard.press('Escape');
		await expect(page.locator('[data-news-dialog]')).toHaveCount(0);
		await expect(slides.first()).toHaveAttribute('data-news-image', id);
		await page.emulateMedia({ reducedMotion: 'reduce' });
		const following = slides.nth(1);
		const nextId = await following.getAttribute('data-news-image');
		await following.getByRole('button').press('Enter');
		await expect(slides.first()).toHaveAttribute('data-news-image', nextId!);
		await expect(page).toHaveURL(/\/$/);
		await expect(page.locator('[data-news-dialog]')).toHaveCount(0);
	});
}

test('multi-image advances animate all incoming slots and preserve their geometry at handoff', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/');
	await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const section = page.locator('[data-news-highlights]');
	const target = section.locator('[data-news-image="textile"] button');
	await target.scrollIntoViewIfNeeded();
	await expect(section.locator('[data-news-images-reveal]')).toHaveAttribute(
		'data-scroll-reveal-state',
		'complete'
	);
	await page.mouse.move(0, 0);
	await target.evaluate((element) => (element as HTMLButtonElement).click());
	const track = section.locator('[data-news-track]');
	await expect
		.poll(
			() =>
				track.evaluate((element) =>
					element.children[3]
						.getAnimations()
						.some((animation) =>
							(animation.effect as KeyframeEffect)
								.getKeyframes()
								.some((frame) => frame.flexGrow === '1')
						)
				),
			{ intervals: [20] }
		)
		.toBe(true);
	const before = await track.evaluate((element) => {
		const nodes = [...element.children] as HTMLElement[];
		const transitions = nodes.flatMap((node) =>
			node
				.getAnimations()
				.filter((animation) =>
					(animation.effect as KeyframeEffect)
						.getKeyframes()
						.some((frame) => frame.flexGrow !== undefined)
				)
		);
		transitions.forEach((animation) => {
			animation.pause();
			animation.currentTime = 350;
		});
		const incoming = nodes.slice(3, 8);
		const halfway = incoming.map((node) => node.getBoundingClientRect().width);
		const isImagesReady = incoming.every((node) => {
			const image = node.querySelector('img')!;
			return image.complete && image.naturalWidth > 0;
		});
		transitions.forEach((animation) => {
			animation.currentTime = 699.99;
		});
		const bounds = incoming.map((node) => {
			const rect = node.getBoundingClientRect();
			return { x: rect.x, width: rect.width };
		});
		return { isImagesReady, bounds, halfway };
	});
	expect(before.isImagesReady).toBe(true);
	before.halfway.forEach((width) => expect(width).toBeGreaterThan(0));
	await track.evaluate((element) =>
		[...element.children].forEach((node) =>
			node.getAnimations().forEach((animation) => {
				if (
					(animation.effect as KeyframeEffect)
						.getKeyframes()
						.some((frame) => frame.flexGrow !== undefined)
				)
					animation.finish();
			})
		)
	);
	await expect(section.locator('[data-news-image]').first()).toHaveAttribute(
		'data-news-image',
		'textile'
	);
	await expect(section.getByRole('button', { name: 'Next article', exact: true })).toHaveAttribute(
		'aria-disabled',
		'false'
	);
	const after = await section.locator('[data-news-image]').evaluateAll((nodes) =>
		nodes.slice(0, 5).map((node) => {
			const rect = node.getBoundingClientRect();
			return { x: rect.x, width: rect.width };
		})
	);
	after.forEach((bounds, index) => {
		expect(bounds.x).toBeCloseTo(before.bounds[index].x, 0);
		expect(bounds.width).toBeCloseTo(before.bounds[index].width, 0);
	});
});

test('hovered fourth image holds its width while decoding and uses a primary article CTA', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/');
	await expect(page.locator('[data-bento-ready]')).toHaveAttribute('data-bento-ready', 'true', {
		timeout: 60000
	});
	const section = page.locator('[data-news-highlights]');
	const target = section.locator('[data-news-image="textile"]');
	await target.scrollIntoViewIfNeeded();
	await expect(section.locator('[data-news-images-reveal]')).toHaveAttribute(
		'data-scroll-reveal-state',
		'complete'
	);
	await target.getByRole('button').hover();
	await target.evaluate(async (node) => {
		await Promise.all(
			node.getAnimations().map((animation) => animation.finished.catch(() => undefined))
		);
	});
	// Keep decoding pending to expose any base-layout flash before movement starts.
	await page.evaluate(() => {
		const decode = HTMLImageElement.prototype.decode;
		HTMLImageElement.prototype.decode = async function () {
			await new Promise((resolve) => setTimeout(resolve, 400));
			return decode.call(this);
		};
	});
	const widths = await target.evaluate(async (node) => {
		const before = node.getBoundingClientRect().width;
		node.querySelector<HTMLButtonElement>('button')!.focus();
		node.querySelector<HTMLButtonElement>('button')!.click();
		await new Promise((resolve) => setTimeout(resolve, 150));
		return { before, during: node.getBoundingClientRect().width };
	});
	expect(widths.during).toBeCloseTo(widths.before, 0);
	await expect(section.locator('[data-news-image]').first()).toHaveAttribute(
		'data-news-image',
		'textile'
	);
	await expect(section.getByRole('button', { name: 'Next article', exact: true })).toHaveAttribute(
		'aria-disabled',
		'false'
	);
	await expect(target.getByRole('button')).toBeFocused();
	const isHoverAnimation = await target.evaluate((node) =>
		node.getAnimations().some((animation) => animation.effect?.getTiming().duration === 300)
	);
	expect(isHoverAnimation).toBe(false);
	const cta = section.getByRole('link', { name: 'Read article', exact: true });
	await expect(cta).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});
