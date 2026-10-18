<script lang="ts">
	// Imports
	import { contactDetails } from '#lib/data/contact.js';
	import { createMapStyles, mapColorToHex, type MapPalette } from '../_lib/mapStyles';
	import { A, ActionLabel, Div, Iframe, P, Span } from '#lib/components';
	import { MapPin } from '#lib/icons';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// consts
	const colorTokens = [
		{ key: 'background', className: 'text-gray-50 dark:text-gray-950' },
		{ key: 'foreground', className: 'text-gray-600 dark:text-gray-300' },
		{ key: 'park', className: 'text-secondary-50 dark:text-secondary-950' },
		{ key: 'primary', className: 'text-primary-500' },
		{ key: 'road', className: 'text-gray-200 dark:text-gray-700' },
		{ key: 'secondary', className: 'text-secondary-500' },
		{ key: 'water', className: 'text-primary-100 dark:text-primary-900' }
	] as const;
	const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${contactDetails.company}, ${contactDetails.street}, ${contactDetails.locality}`)}&z=15&output=embed`;

	// helpers
	const readPalette = (): MapPalette =>
		Object.fromEntries(
			colorTokens.map((token) => [
				token.key,
				mapColorToHex(getComputedStyle(probes[token.key]!).color)
			])
		) as MapPalette;

	// $props()
	let { apiKey }: { apiKey?: string } = $props();

	// $state
	let canvas = $state<HTMLDivElement | null>(null);
	let isClient = $state(false);
	let isMapReady = $state(false);
	let probes = $state<Record<keyof MapPalette, HTMLSpanElement | null>>({
		background: null,
		foreground: null,
		park: null,
		primary: null,
		road: null,
		secondary: null,
		water: null
	});

	// $effects
	onMount(() => {
		isClient = true;
		let circle: google.maps.Circle | undefined;
		let isActive = true;
		let map: google.maps.Map | undefined;
		let observer: MutationObserver | undefined;
		let themeFrame = 0;
		const updateTheme = () => {
			const palette = readPalette();
			map?.setOptions({ backgroundColor: palette.background, styles: createMapStyles(palette) });
			circle?.setOptions({ fillColor: palette.primary, strokeColor: palette.secondary });
		};
		const initialize = async () => {
			if (!apiKey || !canvas) return;
			try {
				const { loadGoogleMaps } = await import('../_lib/maps');
				const [maps, geocoding] = await loadGoogleMaps(apiKey);
				if (!isActive) return;
				const { results } = await new geocoding.Geocoder().geocode({
					address: `${contactDetails.street}, ${contactDetails.locality}`
				});
				if (!isActive || !results[0]) return;
				const palette = readPalette();
				map = new maps.Map(canvas, {
					center: results[0].geometry.location,
					zoom: 15,
					renderingType: maps.RenderingType.RASTER,
					backgroundColor: palette.background,
					styles: createMapStyles(palette),
					mapTypeControl: false,
					streetViewControl: false,
					gestureHandling: 'cooperative',
					scrollwheel: false
				});
				circle = new maps.Circle({
					map,
					center: results[0].geometry.location,
					radius: 40,
					fillColor: palette.primary,
					fillOpacity: 0.65,
					strokeColor: palette.secondary,
					strokeOpacity: 1,
					strokeWeight: 3,
					clickable: false
				});
				observer = new MutationObserver(() => {
					cancelAnimationFrame(themeFrame);
					themeFrame = requestAnimationFrame(updateTheme);
				});
				observer.observe(document.documentElement, {
					attributes: true,
					attributeFilter: ['class', 'data-theme']
				});
				isMapReady = true;
			} catch {
				/* The embedded Google map remains available if loading or geocoding fails. */
			}
		};
		void initialize();
		return () => {
			isActive = false;
			observer?.disconnect();
			cancelAnimationFrame(themeFrame);
			circle?.setMap(null);
			if (map) google.maps.event.clearInstanceListeners(map);
		};
	});
</script>

<Div
	class="relative h-112 overflow-hidden rounded-sm bg-gray-50 inset-ring-1 inset-ring-gray-200 sm:h-128 dark:bg-gray-950 dark:inset-ring-gray-800"
	data-contact-map
	data-map-ready={isMapReady}
>
	<!-- SDK panes and moving tiles must remain immediately usable rather than receive individual reveals. -->
	<Div
		bind:element={canvas}
		class={twMerge(
			'absolute inset-0 size-full',
			isMapReady ? 'opacity-100' : 'pointer-events-none opacity-0'
		)}
		data-scroll-reveal="off"
		aria-label="Google map of Allen-Bailey Tag & Label"
	/>
	{#if !isMapReady && isClient}<Iframe
			src={embedUrl}
			title="Google map showing Allen-Bailey Tag & Label in Caledonia"
			loading="lazy"
			allowfullscreen
			referrerpolicy="no-referrer-when-downgrade"
			class="absolute inset-0 size-full border-0"
			data-scroll-reveal="off"
		/>{/if}
	{#if isMapReady}<Div
			class="pointer-events-none absolute top-4 left-4 z-1 max-w-52 rounded-sm bg-gray-50/95 p-4 text-gray-950 shadow-sm inset-ring-1 inset-ring-gray-200 dark:bg-gray-950/95 dark:text-gray-50 dark:inset-ring-gray-800"
		>
			<MapPin class="mb-2 size-5 text-primary-500" aria-hidden="true" /><P
				class="text-sm font-medium"
			>
				Allen-Bailey Tag &amp; Label
			</P><P class="mt-1 text-xs text-gray-600 dark:text-gray-300">Caledonia, New York</P>
		</Div>{/if}

	{#if !isClient}<Div
			class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center"
		>
			<MapPin class="size-10 text-primary-500" aria-hidden="true" /><P>
				Find Allen-Bailey in Caledonia.
			</P><A
				href={contactDetails.mapsHref}
				target="_blank"
				rel="noopener noreferrer"
				variants={['button.base']}
			>
				<ActionLabel>Open Google Maps</ActionLabel>
			</A>
		</Div>{/if}
	<Div class="sr-only" aria-hidden="true">
		{#each colorTokens as token (token.key)}<Span
				bind:element={probes[token.key]}
				class={token.className}
			>
				Map palette
			</Span>{/each}
	</Div>
</Div>
