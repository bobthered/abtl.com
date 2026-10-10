<script lang="ts">
	// Imports
	import {
		A,
		Br,
		Button,
		Container,
		Div,
		G,
		H3,
		P,
		Rect,
		Section,
		ShippingGlobe,
		Span,
		Svg,
		Text
	} from '#lib/components';
	import { ArrowRight, Globe2, MapPin, PackageCheck } from '#lib/icons';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { shippingLocations, stateRows } from '../ShippingGlobe/shippingLocations';

	// consts
	const internationalLocations = shippingLocations.filter(
		(location) => location.region === 'International'
	);

	// $props()
	let { isStandalone = false }: { isStandalone?: boolean } = $props();

	// $state
	let mapElement = $state<SVGSVGElement | null>(null);
	let selectedLocationId = $state('london');

	// $derived
	const selectedLocation = $derived(
		internationalLocations.find((location) => location.id === selectedLocationId)!
	);

	// $effects
	onMount(() => {
		if (!mapElement) return;
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		const animations: Animation[] = [];
		const finish = () => {
			if (preference.matches) animations.forEach((animation) => animation.cancel());
		};
		let observer: IntersectionObserver;
		const observeMap = () => {
			observer?.disconnect();
			if (animations.length) return;
			observer = new IntersectionObserver(
				([entry]) => {
					if (!entry.isIntersecting) return;
					observer.disconnect();
					if (preference.matches) return;
					mapElement!.querySelectorAll('[data-shipping-state]').forEach((tile, index) => {
						animations.push(
							tile.animate(
								[
									{ opacity: 0.25, transform: 'translateY(6px)' },
									{ opacity: 1, transform: 'translateY(0)' }
								],
								{ duration: 450, delay: index * 14, easing: 'ease-out', fill: 'backwards' }
							)
						);
					});
				},
				{ rootMargin: `0px 0px -${Math.round(window.innerHeight * 0.2)}px 0px`, threshold: 0 }
			);
			observer.observe(mapElement!);
		};
		observeMap();
		window.addEventListener('resize', observeMap);
		preference.addEventListener('change', finish);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', observeMap);
			animations.forEach((animation) => animation.cancel());
			preference.removeEventListener('change', finish);
		};
	});
</script>

{#snippet constrained(children: Snippet)}
	{#if isStandalone}<Container>{@render children()}</Container>{:else}{@render children()}{/if}
{/snippet}

{#snippet domestic()}
	<Section
		variants={['dialogSection']}
		data-shipping-section="domestic"
		aria-labelledby="shipping-domestic-heading"
	>
		<Div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<Div>
				<P variants={['eyebrow']}>Across the country</P>
				<H3 id="shipping-domestic-heading" class="text-4xl font-light tracking-tight sm:text-5xl"
					>Every state.<Br />Every possibility.</H3
				>
				<P variants={['dialogBody']} class="mt-6"
					>From a neighborhood workshop to an operation with locations coast to coast. We ship tags
					and labels to all 50 states, including Alaska and Hawaii.</P
				>
				<Div class="mt-8 flex items-center gap-5"
					><Span
						class="text-8xl font-semibold tracking-tight text-primary-500 tabular-nums dark:text-primary-400"
						aria-hidden="true"
						data-count-up={50}
						data-shipping-state-count>{50}</Span
					><P class="max-w-36">states.<Br />One place to start.</P><Span class="sr-only"
						>Shipping to all 50 states.</Span
					></Div
				>
			</Div>
			<Div variants={['shippingArtwork']} class="group p-6 sm:p-8" data-scroll-reveal>
				<Svg
					bind:element={mapElement}
					viewBox="0 0 600 410"
					class="w-full"
					role="img"
					aria-label="Tile map of all 50 U.S. states, including Alaska and Hawaii"
				>
					{#each stateRows as row, y (y)}
						{#each row as state, x (x)}
							{#if state}
								<G
									class="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-1"
									data-shipping-state={state}
								>
									<Rect
										x={x * 48 + 4}
										y={y * 48 + 4}
										width="42"
										height="42"
										rx="4"
										class={y < 4
											? 'fill-primary-100 stroke-primary-300 stroke-1 dark:fill-primary-900 dark:stroke-primary-700'
											: 'fill-secondary-100 stroke-secondary-300 stroke-1 dark:fill-secondary-950 dark:stroke-secondary-700'}
									/>
									<Text
										x={x * 48 + 25}
										y={y * 48 + 30}
										text-anchor="middle"
										class="fill-gray-950 text-xs font-semibold dark:fill-gray-50">{state}</Text
									>
								</G>
							{/if}
						{/each}
					{/each}
				</Svg>
				<P class="mt-5 text-sm text-gray-600 dark:text-gray-300"
					>Coast to coast, and beyond the lower 48.</P
				>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet international()}
	<Section
		variants={['dialogSection']}
		data-shipping-section="international"
		aria-labelledby="shipping-international-heading"
	>
		<Div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
			<Div class="order-2 lg:order-1"
				><Div variants={['shippingArtwork']} class="relative" data-scroll-reveal
					><ShippingGlobe activeLocationId={selectedLocationId} /><Div
						class="absolute right-6 bottom-6 left-6 rounded-sm bg-white/90 p-4 backdrop-blur-sm dark:bg-gray-950/90"
						><P class="text-sm font-medium" aria-live="polite"
							>{selectedLocation.name}
							<Span class="ml-2 text-xs text-gray-500 dark:text-gray-400">Demo destination</Span></P
						></Div
					></Div
				></Div
			>
			<Div class="order-1 lg:order-2">
				<P variants={['eyebrow']}>Beyond borders</P>
				<H3
					id="shipping-international-heading"
					class="text-4xl font-light tracking-tight sm:text-5xl"
					>Your work goes places.<Br />Your tags can, too.</H3
				>
				<P variants={['dialogBody']} class="mt-6"
					>A different country shouldn't mean starting over with your tags. We ship internationally.
					Tell us where your order needs to go, and let's plan the details together.</P
				>
				<P class="mt-8 mb-3 text-sm font-medium">Explore an illustrative destination</P>
				<Div class="flex flex-wrap gap-2" role="group" aria-label="Demo shipping destinations">
					{#each internationalLocations as location (location.id)}
						<Button
							variants={[
								'neutral',
								...(selectedLocationId === location.id ? ['stockSwatchSelected'] : [])
							]}
							aria-pressed={selectedLocationId === location.id}
							onclick={() => (selectedLocationId = location.id)}
							><MapPin class="size-4" aria-hidden="true" />{location.name}</Button
						>
					{/each}
				</Div>
				<P class="mt-5 text-xs leading-relaxed text-gray-500 dark:text-gray-400"
					>Demo visualization. Locations and connecting arcs are illustrative, not actual shipments,
					carrier routes, or transit times.</P
				>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet invitation()}
	<Container class="flex flex-col items-center gap-6">
		<Div data-scroll-reveal class="flex gap-3" aria-hidden="true"
			><PackageCheck class="size-7" /><Globe2 class="size-7" /></Div
		>
		<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600"
			>Let's put your project on the map</P
		>
		<H3
			id="shipping-contact-heading"
			class="max-w-2xl text-4xl font-light tracking-tight sm:text-5xl"
			>Where do your tags need to go?</H3
		>
		<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600"
			>Share your destination, the tags you need, and your timing. We'll help you work through the
			next steps.</P
		>
		<A
			href="mailto:sales@abtl.com?subject=Shipping%20inquiry&body=Destination%3A%0ATags%20or%20labels%20needed%3A%0AQuantity%3A%0ATiming%3A"
			variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
			>Talk about shipping <ArrowRight class="size-5" aria-hidden="true" /></A
		>
		<P class="text-sm text-gray-300 dark:text-gray-600"
			>Your destination. Your project. Let's make a plan.</P
		>
	</Container>
{/snippet}

<Div data-shipping-content>
	{@render constrained(domestic)}
	{@render constrained(international)}
	<Section
		variants={['sampleInvitation']}
		class={isStandalone ? '' : '-mx-6 sm:-mx-8 lg:-mx-16'}
		data-shipping-section="contact"
		aria-labelledby="shipping-contact-heading">{@render invitation()}</Section
	>
</Div>
