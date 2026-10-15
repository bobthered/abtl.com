import '../../../routes/layout.css';
import { expect, it } from 'vitest';
import { initializeTheme } from '#lib/theme.js';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import StoryPhoto from '../../../routes/about/_components/StoryPhoto.svelte';

it('expands About photo containers without scaling images and preserves keyboard lightboxes', async () => {
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
	const media = element.querySelector<HTMLElement>('[data-bento-media]')!;
	const surface = element.querySelector<HTMLElement>('[data-bento-surface]')!;
	const initialBounds = element.getBoundingClientRect();
	const initialImageBounds = image.getBoundingClientRect();
	expect(element.querySelector('[data-bento-outline]')).not.toBeNull();
	expect(element.querySelector('[data-bento-expand] svg')).not.toBeNull();
	expect(Math.round(element.getBoundingClientRect().height)).toBe(256);
	await trigger.hover();
	await expect.poll(() => Math.round(media.getBoundingClientRect().width)).toBe(392);
	expect(Math.round(media.getBoundingClientRect().height)).toBe(264);
	await expect
		.poll(() => surface.getBoundingClientRect().left)
		.toBeCloseTo(media.getBoundingClientRect().left);
	expect(image.getBoundingClientRect().width).toBe(initialImageBounds.width);
	expect(image.getBoundingClientRect().height).toBe(initialImageBounds.height);
	expect(image.getBoundingClientRect().width).toBeCloseTo(media.getBoundingClientRect().width);
	expect(image.getBoundingClientRect().height).toBeCloseTo(media.getBoundingClientRect().height);
	expect(getComputedStyle(image).scale).toBe('none');
	expect(getComputedStyle(image).transform).toBe('none');
	expect(element.getBoundingClientRect().width).toBe(initialBounds.width);
	expect(element.getBoundingClientRect().height).toBe(initialBounds.height);
	expect(Number(getComputedStyle(surface).zIndex)).toBeGreaterThan(0);
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
