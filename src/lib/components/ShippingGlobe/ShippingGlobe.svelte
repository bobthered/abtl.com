<script lang="ts">
	// Imports
	import {
		Canvas,
		Circle,
		Defs,
		Div,
		LinearGradient,
		Path,
		Span,
		Stop,
		Svg
	} from '#lib/components';
	import { globeFallbackPath } from './geometry';
	import { onMount } from 'svelte';
	import type { createShippingGlobe } from './renderer';

	// consts
	const gradientId = $props.id();

	// $props()
	let { activeLocationId, class: className = '' }: { activeLocationId?: string; class?: string } =
		$props();

	// $state
	let canvas = $state<HTMLCanvasElement | null>(null);
	let isReady = $state(false);
	let northElement = $state<HTMLSpanElement | null>(null);
	let southElement = $state<HTMLSpanElement | null>(null);
	let surface = $state.raw<ReturnType<typeof createShippingGlobe> | null>(null);
	let surfaceElement = $state<HTMLSpanElement | null>(null);

	// $effects
	onMount(() => {
		if (!canvas) return;
		let isDisposed = false;
		const target = canvas;
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				try {
					const { createShippingGlobe } = await import('./renderer');
					if (isDisposed) return;
					const next = createShippingGlobe(target, () => ({
						north: getComputedStyle(northElement!).color,
						south: getComputedStyle(southElement!).color,
						surface: getComputedStyle(surfaceElement!).color
					}));
					if (isDisposed) next.dispose();
					else {
						surface = next;
						isReady = true;
					}
				} catch {
					// Keep the local SVG visible on browsers without WebGL.
				}
			},
			{ rootMargin: '120px' }
		);
		observer.observe(target);
		return () => {
			isDisposed = true;
			observer.disconnect();
			surface?.dispose();
			surface = null;
		};
	});
	$effect(() => {
		surface?.select(activeLocationId);
	});
</script>

<Div
	class={`relative aspect-square w-full ${className}`}
	role="img"
	aria-label="Illustrative shipping globe with demo destinations"
	data-shipping-globe
	data-globe-ready={isReady}
>
	<Span
		bind:element={northElement}
		class="hidden text-primary-500 dark:text-primary-400"
		aria-hidden="true"
	/>
	<Span
		bind:element={southElement}
		class="hidden text-secondary-500 dark:text-secondary-400"
		aria-hidden="true"
	/>
	<Span
		bind:element={surfaceElement}
		class="hidden text-primary-50 dark:text-gray-950"
		aria-hidden="true"
	/>
	<Svg
		viewBox="0 0 300 300"
		class={`absolute inset-0 h-full w-full ${isReady ? 'invisible' : ''}`}
		aria-hidden="true"
		focusable="false"
	>
		<Defs
			><LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"
				><Stop
					offset="0"
					stop-color="currentColor"
					class="text-primary-500 dark:text-primary-400"
				/><Stop
					offset="1"
					stop-color="currentColor"
					class="text-secondary-500 dark:text-secondary-400"
				/></LinearGradient
			></Defs
		>
		<Circle
			cx="150"
			cy="150"
			r="125"
			class="fill-primary-50 stroke-primary-200 stroke-1 dark:fill-gray-950 dark:stroke-primary-900"
		/>
		<Path d={globeFallbackPath} fill={`url(#${gradientId})`} />
		<Path
			d="M58 112Q135 22 205 90M58 112Q145 52 244 180M58 112Q98 85 130 170"
			fill="none"
			stroke={`url(#${gradientId})`}
			stroke-width="1"
			opacity="0.6"
		/>
	</Svg>
	<Canvas
		bind:element={canvas}
		class={`absolute inset-0 block h-full w-full ${isReady ? '' : 'invisible'}`}
		aria-hidden="true"
	/>
</Div>
