import { expect, test, type Page } from '@playwright/test';

const pauseClient = async (page: Page) => {
	let resume = () => {};
	const gate = new Promise<void>((resolve) => {
		resume = resolve;
	});
	await page.route('**/*', async (route) => {
		if (route.request().resourceType() === 'script') await gate;
		await route.continue();
	});
	return resume;
};
const recordPaints = async (page: Page) => {
	await page.addInitScript(() => {
		const paints: number[] = [];
		Object.assign(window, { revealPaints: paints });
		const frame = () => {
			let element: Element | null = document.querySelector('main h1');
			if (element) {
				let opacity = 1;
				while (element) {
					opacity *= Number(getComputedStyle(element).opacity);
					element = element.parentElement;
				}
				paints.push(opacity);
			}
			requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	});
};
const expectNoRehide = async (page: Page) => {
	await expect
		.poll(() =>
			page.evaluate(() => {
				const paints = (window as unknown as { revealPaints: number[] }).revealPaints;
				return paints.at(-1) ?? 0;
			})
		)
		.toBeGreaterThan(0.99);
	const paints = await page.evaluate(
		() => (window as unknown as { revealPaints: number[] }).revealPaints
	);
	const firstVisible = paints.findIndex((opacity) => opacity > 0.02);
	expect(firstVisible).toBeGreaterThanOrEqual(0);
	expect(paints.slice(firstVisible).every((opacity) => opacity > 0.001)).toBe(true);
};

test('first SSR paint stays staged until reveal targets are ready', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await recordPaints(page);
	const resume = await pauseClient(page);
	try {
		await page.goto('/about', { waitUntil: 'commit' });
		await expect(page.locator('html')).toHaveAttribute('data-scroll-reveal-boot', 'pending');
		await expect(page.locator('main')).toHaveCSS('opacity', '0');
		await expect(page.locator('footer')).toHaveCSS('opacity', '0');
		await expect(page.locator('header')).toHaveCSS('opacity', '1');
	} finally {
		resume();
	}
	await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
	await expect(page.locator('html')).not.toHaveAttribute('data-scroll-reveal-boot');
	await expectNoRehide(page);
});

for (const reason of ['timeout', 'keyboard', 'reduced-motion'] as const) {
	test(`startup fails open for ${reason} and late hydration never re-hides content`, async ({
		page
	}) => {
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await recordPaints(page);
		const resume = await pauseClient(page);
		try {
			await page.goto('/about', { waitUntil: 'commit' });
			await expect(page.locator('main')).toHaveCSS('opacity', '0');
			if (reason === 'keyboard') await page.getByRole('link', { name: 'Skip to content' }).focus();
			if (reason === 'reduced-motion') await page.emulateMedia({ reducedMotion: 'reduce' });
			await expect(page.locator('html')).toHaveAttribute('data-scroll-reveal-boot', 'visible');
			await expect(page.locator('main')).toHaveCSS('opacity', '1');
		} finally {
			resume();
		}
		await expect(page.locator('main h1')).toHaveAttribute('data-scroll-reveal-state', 'complete');
		await expectNoRehide(page);
	});
}

test('reduced motion is visible before hydration without a staging gate', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const resume = await pauseClient(page);
	try {
		await page.goto('/about', { waitUntil: 'commit' });
		await expect(page.locator('main')).toHaveCSS('opacity', '1');
		await expect(page.locator('html')).not.toHaveAttribute('data-scroll-reveal-boot');
	} finally {
		resume();
	}
});
