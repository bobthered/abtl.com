import { describe, expect, it } from 'vitest';
import { initializeTheme } from '#lib/theme.js';
import Logo from './Logo.svelte';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { Theme } from 'sveltewind/theme';

describe('Logo', () => {
	it('preserves the supplied geometry and default colors', async () => {
		initializeTheme();
		render(Logo);
		const logo = page.getByRole('img', { name: 'Allen-Bailey Tag & Label' });
		await expect.element(logo).toBeInTheDocument();
		const element = logo.element();
		expect(element.getAttribute('viewBox')).toBe('0 0 24 14');
		expect(element.hasAttribute('width')).toBe(false);
		expect(element.hasAttribute('height')).toBe(false);
		await expect.element(logo).toHaveClass('inline-block', 'h-auto', 'w-32');
		expect(element.querySelectorAll('path')).toHaveLength(25);
		expect(getComputedStyle(element.querySelector('path')!).fill).toBe('rgb(40, 45, 91)');
		expect(getComputedStyle(element.querySelector('path:last-child')!).fill).toBe(
			'rgb(138, 24, 29)'
		);
	});

	it('supports independent color overrides, logo variants, and SVG attributes', async () => {
		const theme = new Theme({
			logo: { base: 'inline-block h-auto w-32', variants: { large: 'w-48' } }
		});
		render(Logo, {
			'aria-label': 'Custom logo',
			blueColor: '#ffffff',
			class: 'w-64',
			id: 'custom-logo',
			redColor: '#000000',
			theme,
			variants: ['large']
		});
		const logo = page.getByRole('img', { name: 'Custom logo' });
		await expect.element(logo).toHaveClass('inline-block', 'w-64', 'h-auto');
		await expect.element(logo).not.toHaveClass('w-32');
		await expect.element(logo).not.toHaveClass('w-48');
		const element = logo.element();
		expect(element.id).toBe('custom-logo');
		expect(getComputedStyle(element.querySelector('path')!).fill).toBe('rgb(255, 255, 255)');
		expect(getComputedStyle(element.querySelector('path:last-child')!).fill).toBe('rgb(0, 0, 0)');
	});

	it('does not render when hidden', async () => {
		render(Logo, { isVisible: false });
		await expect
			.element(page.getByRole('img', { name: 'Allen-Bailey Tag & Label' }))
			.not.toBeInTheDocument();
	});
});
