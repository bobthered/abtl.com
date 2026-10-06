<script lang="ts">
	// Imports
	import { Canvas, Div } from '#lib/components';
	import { onMount } from 'svelte';
	import type { createTagRain } from './physics';
	import { theme } from 'sveltewind/theme';

	// helpers
	const initialize = () => {
		isMounted = true;
		return () => {
			isMounted = false;
			surface?.destroy();
		};
	};
	onMount(initialize);

	// $props()
	let { isActive, total }: { isActive: boolean; total: number | null } = $props();

	// $state
	let canvas = $state<HTMLCanvasElement | null>(null);
	let isMounted = $state(false);
	let surface = $state.raw<Awaited<ReturnType<typeof createTagRain>> | null>(null);

	// $effects
	$effect(() => {
		if (!isMounted || !isActive || !canvas || surface) return;
		const target = canvas;
		let isCancelled = false;
		void import('./physics').then(async ({ createTagRain }) => {
			if (isCancelled || !isMounted) return;
			const nextSurface = await createTagRain(target);
			// Keep an initialized surface paused if motion stopped during the async load.
			if (!isMounted || target !== canvas) nextSurface.destroy();
			else surface = nextSurface;
		});
		return () => {
			isCancelled = true;
		};
	});
	$effect(() => {
		surface?.update(isActive, total);
	});
</script>

<Div class={theme.resolve('tagRain')} aria-hidden="true" inert>
	<Canvas bind:element={canvas} variants={['tagRain']} data-tag-rain />
</Div>
