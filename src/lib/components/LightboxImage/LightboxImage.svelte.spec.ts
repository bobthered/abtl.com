import '../../../routes/layout.css';
import { expect, it } from 'vitest';
import { initializeTheme } from '#lib/theme.js';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import StoryPhoto from '../../../routes/about/_components/StoryPhoto.svelte';

it('gives About photos the shared outline, expand icon, hover zoom and keyboard lightbox', async () => {
	initializeTheme();
	render(StoryPhoto, {
		src: '/images/about/golden-hour-industrial-complex-aerial.webp',
		alt: 'Aerial view',
		caption: null,
		class: 'h-64 w-96'
	});
	const trigger = page.getByRole('button', { name: 'Enlarge image: Aerial view' });
	const element = trigger.element();
	const image = element.querySelector('img')!;
	expect(element.querySelector('[data-bento-outline]')).not.toBeNull();
	expect(element.querySelector('[data-bento-expand] svg')).not.toBeNull();
	expect(Math.round(element.getBoundingClientRect().height)).toBe(256);
	await trigger.hover();
	await expect.poll(() => parseFloat(getComputedStyle(image).scale)).toBeGreaterThan(1);
	await expect
		.poll(() => Number(getComputedStyle(element.querySelector('[data-bento-outline]')!).opacity))
		.toBeGreaterThan(0);
	(element as HTMLButtonElement).focus();
	await userEvent.keyboard('{Enter}');
	const dialog = page.getByRole('dialog', { name: 'Aerial view' });
	await expect.element(dialog).toBeVisible();
	expect(dialog.element().querySelector('img')!.getAttribute('src')).toBe(
		image.getAttribute('src')
	);
	await userEvent.keyboard('{Escape}');
	await expect.element(dialog).not.toBeInTheDocument();
	await expect.element(trigger).toHaveFocus();
});
