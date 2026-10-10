import '../../../routes/layout.css';
import BentoPreview from './BentoPreview.svelte';
import BentoSection from './BentoSection.svelte';
import { expect, it } from 'vitest';
import { initializeTheme } from '#lib/theme.js';
import { render } from 'vitest-browser-svelte';
import { stockColors } from './stockColors';

it('loops complete stock palettes in opposite directions with a title fade', async () => {
	initializeTheme();
	const { container, unmount } = render(BentoPreview, { kind: 'columns' });
	const root = container.querySelector<HTMLElement>('[data-stock-columns]')!;
	const tracks = [...root.querySelectorAll<HTMLElement>('[data-stock-column-track]')];
	const visibleTracks = tracks.filter((track) => track.offsetWidth > 0);
	await expect
		.poll(() => visibleTracks.every((track) => track.getAnimations().length === 1))
		.toBe(true);
	expect(getComputedStyle(root).maskImage).toContain('linear-gradient');
	const palettes = tracks.map((track) => {
		const copies = [...track.children];
		const palette = [...copies[0].children].map((tag) => tag.getAttribute('class'));
		expect(palette).toHaveLength(stockColors.length);
		for (const color of stockColors)
			expect(palette.some((classes) => classes?.includes(color.className))).toBe(true);
		expect([...copies[1].children].map((tag) => tag.getAttribute('class'))).toEqual(palette);
		return palette;
	});
	expect(palettes[0]).not.toEqual(palettes[1]);
	const animations = visibleTracks.map((track) => track.getAnimations()[0]);
	animations.forEach((animation, index) => {
		const frames = (animation.effect as KeyframeEffect).getKeyframes();
		const start = Number(String(frames[0].transform).match(/-?[\d.]+/)![0]);
		const end = Number(String(frames[1].transform).match(/-?[\d.]+/)![0]);
		expect(index % 2 === 0 ? end > start : end < start).toBe(true);
		expect(animation.effect!.getTiming().iterations).toBe(Infinity);
	});
	await unmount();
	expect(animations.every((animation) => animation.playState === 'idle')).toBe(true);
});

it('smoothly accelerates on tile hover and keyboard focus without restarting the loops', async () => {
	initializeTheme();
	const { container } = render(BentoSection);
	const root = container.querySelector<HTMLElement>('[data-stock-columns]')!;
	const tile = root.closest<HTMLElement>('a')!;
	const track = root.querySelector<HTMLElement>('[data-stock-column-track]')!;
	await expect.poll(() => track.getAnimations()[0]?.playState).toBe('running');
	const animation = track.getAnimations()[0];
	tile.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
	await expect.poll(() => animation.playbackRate).toBe(2.5);
	expect(track.getAnimations()[0]).toBe(animation);
	tile.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
	await expect.poll(() => animation.playbackRate).toBe(1);
	tile.focus();
	await expect.poll(() => animation.playbackRate).toBe(2.5);
	tile.blur();
	await expect.poll(() => animation.playbackRate).toBe(1);
});
