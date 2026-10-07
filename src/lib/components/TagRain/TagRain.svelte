<script lang="ts">
	// Imports
	import { Canvas, Div, TagRainSettings } from '#lib/components';
	import type { createTagRain } from './physics';
	import { defaultRainSettings, normalizeRainSettings } from './settings';
	import { onMount, untrack } from 'svelte';
	import { theme } from 'sveltewind/theme';

	// consts
	const isDevelopment = import.meta.env.DEV;

	// helpers
	const initialize = () => {
		if (isDevelopment) {
			try {
				const saved = JSON.parse(localStorage.getItem('tag-rain-settings') ?? 'null');
				if (saved && typeof saved === 'object') settings = normalizeRainSettings(saved);
			} catch {
				// Keep defaults when storage is unavailable or invalid.
			}
		}
		isMounted = true;
		return () => {
			isMounted = false;
			surface?.destroy();
		};
	};
	const initializeSurface = async () => {
		if (isInitializing || surface || !canvas || !isMounted) return;
		const target = canvas;
		isInitializing = true;
		try {
			const { createTagRain } = await import('./physics');
			if (!isMounted) return;
			const nextSurface = await createTagRain(target);
			if (!isMounted || target !== canvas) nextSurface.destroy();
			else surface = nextSurface;
		} catch (error) {
			console.error('Unable to initialize the tag animation.', error);
		} finally {
			isInitializing = false;
		}
	};
	onMount(initialize);

	// $props()
	let { isActive }: { isActive: boolean } = $props();

	// $state
	let canvas = $state<HTMLCanvasElement | null>(null);
	let isInitializing = $state(false);
	let isMounted = $state(false);
	let isPaused = $state(false);
	let settings = $state({ ...defaultRainSettings });
	let surface = $state.raw<Awaited<ReturnType<typeof createTagRain>> | null>(null);

	// $effects
	$effect(() => {
		if (isMounted && isActive && canvas && !surface)
			untrack(() => {
				void initializeSurface();
			});
	});
	$effect(() => {
		surface?.configure(normalizeRainSettings(settings));
	});
	$effect(() => {
		surface?.update(isActive && !isPaused);
	});
	$effect(() => {
		if (!isDevelopment || !isMounted) return;
		const normalized = normalizeRainSettings(settings);
		try {
			localStorage.setItem('tag-rain-settings', JSON.stringify(normalized));
		} catch {
			// Controls still work when storage is unavailable.
		}
	});
</script>

<Div class={theme.resolve('tagRain')} aria-hidden="true" inert>
	<Canvas bind:element={canvas} variants={['tagRain']} data-tag-rain />
</Div>

{#if isDevelopment}
	<TagRainSettings bind:isPaused bind:settings onclear={() => surface?.clear()} />
{/if}
