import { describe, expect, it } from 'vitest';
import Logo from './Logo.svelte';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { Theme } from 'sveltewind/theme';

describe('Logo', () => {
	it('preserves the supplied geometry and default colors', async () => {
		render(Logo);
		const logo = page.getByRole('img', { name: 'Allen-Bailey Tag & Label' });
		await expect.element(logo).toBeInTheDocument();
		const element = logo.element();
		expect(element.getAttribute('viewBox')).toBe('0 0 24 14');
		expect(element.querySelectorAll('path')).toHaveLength(25);
		expect(getComputedStyle(element.querySelector('path')!).fill).toBe('rgb(40, 45, 91)');
		expect(getComputedStyle(element.querySelector('path:last-child')!).fill).toBe(
			'rgb(138, 24, 29)'
		);
	});

	it('supports independent color overrides, logo variants, and SVG attributes', async () => {
		const theme = new Theme({ logo: { base: 'inline-block', variants: { large: 'w-48' } } });
		render(Logo, {
			'aria-label': 'Custom logo',
			blueColor: '#ffffff',
			class: 'h-auto',
			redColor: '#000000',
			theme,
			variants: ['large'],
			width: 192
		});
		const logo = page.getByRole('img', { name: 'Custom logo' });
		await expect.element(logo).toHaveClass('inline-block', 'w-48', 'h-auto');
		const element = logo.element();
		expect(element.getAttribute('width')).toBe('192');
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
