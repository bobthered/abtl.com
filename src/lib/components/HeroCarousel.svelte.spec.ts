import '../../routes/layout.css';
import { describe, expect, it } from 'vitest';
import HeroCarousel from './HeroCarousel.svelte';
import { initializeTheme } from '#lib/theme.js';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

describe('HeroCarousel', () => {
	it('autoplays through the slides and loops back to the first', async () => {
		initializeTheme();
		render(HeroCarousel, { autoplayInterval: 1000 });
		const first = page.getByRole('button', { name: 'Show slide 1: Made with purpose' });
		const second = page.getByRole('button', { name: 'Show slide 2: Custom tags and labels' });
		const third = page.getByRole('button', { name: 'Show slide 3: Tags for your industry' });
		await expect.element(first).toHaveAttribute('aria-current', 'true');
		await expect.element(second).toHaveAttribute('aria-current', 'true');
		await expect.element(third).toHaveAttribute('aria-current', 'true');
		await expect.element(first).toHaveAttribute('aria-current', 'true');
	});

	it('supports manual controls while paused and keeps inactive slides inert', async () => {
		initializeTheme();
		render(HeroCarousel);
		await page.getByRole('button', { name: 'Pause carousel' }).click();
		await expect
			.element(page.getByRole('button', { name: 'Play carousel' }))
			.toHaveAttribute('aria-pressed', 'true');
		await page.getByRole('button', { name: 'Next slide' }).click();
		await expect
			.element(page.getByRole('button', { name: 'Show slide 2: Custom tags and labels' }))
			.toHaveAttribute('aria-current', 'true');
		expect(document.querySelector('[aria-roledescription="slide"]')?.hasAttribute('inert')).toBe(
			true
		);
		await page.getByRole('button', { name: 'Previous slide' }).click();
		await expect
			.element(page.getByRole('button', { name: 'Show slide 1: Made with purpose' }))
			.toHaveAttribute('aria-current', 'true');
	});
});
