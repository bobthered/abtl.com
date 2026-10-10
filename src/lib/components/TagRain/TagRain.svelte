<script lang="ts">
	// Imports
	import { Canvas, Div, TagViewer } from '#lib/components';
	import type { createTagRain } from './physics';
	import type { TagSelection } from './physics';
	import { onMount, untrack } from 'svelte';
	import { theme } from 'sveltewind/theme';

	// helpers
	const initialize = () => {
		const viewport = window.matchMedia('(min-width: 64rem)');
		const updateViewport = () => {
			isDesktop = viewport.matches;
		};
		updateViewport();
		viewport.addEventListener('change', updateViewport);
		isMounted = true;
		return () => {
			viewport.removeEventListener('change', updateViewport);
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
			const nextSurface = await createTagRain(target, (nextSelection) => {
				selection = nextSelection;
			});
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
	let isDesktop = $state(false);
	let isInitializing = $state(false);
	let isMounted = $state(false);
	let selection = $state.raw<TagSelection | null>(null);
	let surface = $state.raw<Awaited<ReturnType<typeof createTagRain>> | null>(null);

	// $effects
	$effect(() => {
		if (isMounted && isActive && isDesktop && canvas && !surface)
			untrack(() => {
				void initializeSurface();
			});
	});
	$effect(() => {
		surface?.update(isActive && isDesktop && selection === null);
	});
	$effect(() => {
		if (!isDesktop) selection = null;
	});
</script>

<Div class={theme.resolve('tagRain')}>
	<Canvas
		bind:element={canvas}
		variants={['tagRain']}
		role="button"
		tabindex={0}
		aria-label="Explore tags. Click a tag or press Enter to inspect one."
		data-tag-rain
	/>
	<!-- <Span
		class="pointer-events-none absolute right-8 bottom-6 rounded-sm bg-gray-50/90 px-3 py-2 text-xs text-gray-600 dark:bg-gray-950/90 dark:text-gray-300"
		>Hover a tag, then click to explore</Span
	> -->
</Div>

{#if selection}
	<TagViewer
		{selection}
		onclose={() => {
			selection = null;
		}}
	/>
{/if}
