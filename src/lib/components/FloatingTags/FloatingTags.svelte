<script lang="ts">
	// Imports
	import { createTags, defaultSettings, getTagFrames, normalizeSettings } from './scene.js';
	import { Div, FloatingTagSettings, Path, Svg } from '#lib/components';
	import { onMount } from 'svelte';
	import type { TagPlacement, TagSettings } from './scene.js';
	import { theme } from 'sveltewind/theme';

	// consts
	const isDevelopment = import.meta.env.DEV;

	// helpers
	const initializeParallax = (currentTags: TagPlacement[], currentSettings: TagSettings) => {
		if (!element) return;
		const animations = currentTags.map((tag) => {
			const node = element!.querySelector<HTMLElement>(`[data-floating-tag="${tag.id}"]`)!;
			const animation = node.animate(getTagFrames(tag, currentSettings), {
				duration: 1000,
				fill: 'both'
			});
			animation.pause();
			animation.currentTime = 0;
			return animation;
		});
		let frame: number | null = null;
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => {
			frame = null;
			const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
			const progress = preference.matches
				? 0
				: Math.min(1, Math.max(0, window.scrollY / scrollRange));
			for (const animation of animations) animation.currentTime = progress * 1000;
		};
		const scheduleUpdate = () => {
			if (frame === null) frame = requestAnimationFrame(update);
		};
		const handleScroll = () => {
			if (!preference.matches) scheduleUpdate();
		};
		const observer = new ResizeObserver(scheduleUpdate);
		observer.observe(document.body);
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', scheduleUpdate);
		preference.addEventListener('change', scheduleUpdate);
		update();
		return () => {
			if (frame !== null) cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', scheduleUpdate);
			preference.removeEventListener('change', scheduleUpdate);
			for (const animation of animations) animation.cancel();
		};
	};

	onMount(() => {
		if (!isDevelopment) return;
		try {
			const saved = JSON.parse(localStorage.getItem('floating-tag-settings') ?? 'null');
			if (saved && typeof saved === 'object') settings = normalizeSettings(saved);
		} catch {
			// Keep defaults if storage is unavailable or settings are invalid.
		}
		isSettingsReady = true;
	});

	// $state
	let element = $state<HTMLDivElement | null>(null);
	let isSettingsReady = $state(false);
	let settings = $state({ ...defaultSettings });

	// $derived
	const sceneSettings = $derived(normalizeSettings(settings));
	const visibleTags = $derived(createTags(sceneSettings.tagCount));

	// $effects
	$effect(() => initializeParallax(visibleTags, sceneSettings));
	$effect(() => {
		if (!isDevelopment || !isSettingsReady) return;
		try {
			localStorage.setItem('floating-tag-settings', JSON.stringify(sceneSettings));
		} catch {
			// Controls still work when browser storage is unavailable.
		}
	});
</script>

<Div bind:element aria-hidden="true" inert class={theme.resolve('floatingTags')}>
	{#each visibleTags as tag (tag.id)}
		<Div
			data-floating-tag={tag.id}
			class={theme.resolve('floatingTag', [tag.depth], `${tag.className} ${tag.color}`)}
		>
			<Svg viewBox="0 0 100 200" aria-hidden="true" focusable="false" class={theme.resolve('tag')}>
				<Path
					d="M12 0H88L100 12V200H0V12Z M55 28a5 5 0 1 1-10 0a5 5 0 1 1 10 0Z"
					fill="currentColor"
					fill-rule="evenodd"
				/>
				<Path
					d="M66 28a16 16 0 1 1-32 0a16 16 0 1 1 32 0Z M55 28a5 5 0 1 1-10 0a5 5 0 1 1 10 0Z"
					fill-rule="evenodd"
					variants={['tagPatch']}
				/>
			</Svg>
		</Div>
	{/each}
</Div>

{#if isDevelopment}
	<FloatingTagSettings bind:settings />
{/if}
