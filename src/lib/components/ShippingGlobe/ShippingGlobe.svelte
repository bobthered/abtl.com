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
	import type { createShippingGlobe } from './renderer';
	import { globeFallbackPath, shipmentFallbackPath } from './geometry';
	import { onMount } from 'svelte';

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
						isDark: document.documentElement.dataset.theme === 'dark'
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
	aria-label="Shipping globe showing destinations from our order report"
	data-shipping-globe
	data-globe-ready={isReady}
>
	<Span
		bind:element={northElement}
		class="hidden text-primary-600 dark:text-primary-400"
		aria-hidden="true"
	/>
	<Span
		bind:element={southElement}
		class="hidden text-secondary-600 dark:text-secondary-400"
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
					class="text-primary-600 dark:text-primary-400"
				/><Stop
					offset="1"
					stop-color="currentColor"
					class="text-secondary-600 dark:text-secondary-400"
				/></LinearGradient
			></Defs
		>
		<Circle
			cx="150"
			cy="150"
			r="125"
			fill="none"
			class="stroke-primary-300 stroke-1 dark:stroke-primary-900"
		/>
		<Path d={globeFallbackPath} fill={`url(#${gradientId})`} />
		<Path
			d={shipmentFallbackPath}
			fill={`url(#${gradientId})`}
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
