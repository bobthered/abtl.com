<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
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
	import { Globe2, MapPin, PackageCheck } from '#lib/icons';
	import {
		internationalLocations,
		shippedStateCount,
		stateRows
	} from '../../../../../lib/components/ShippingGlobe/shippingLocations';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// consts
	const shippingArtworkClass =
		'overflow-hidden rounded-sm bg-gradient-to-br from-primary-50 via-gray-100 to-secondary-50 dark:from-primary-950 dark:via-gray-900 dark:to-secondary-950';

	// $props()
	let { isStandalone = false }: { isStandalone?: boolean } = $props();

	// $state
	let selectedLocationId = $state(internationalLocations[0].id);
</script>

{#snippet constrained(children: Snippet)}
	{#if isStandalone}
		<Container>{@render children()}</Container>
	{:else}{@render children()}{/if}
{/snippet}

{#snippet domestic()}
	<Section
		variants={['dialogSection']}
		data-shipping-section="domestic"
		aria-labelledby="shipping-domestic-heading"
	>
		<Div class="grid items-center gap-4 lg:grid-cols-2">
			<Div>
				<P variants={['eyebrow']}>Across the country</P>
				<H3 id="shipping-domestic-heading" class="text-4xl font-light tracking-tight sm:text-5xl">
					Every state.<Br />Every possibility.
				</H3>
				<P variants={['dialogBody']} class="mt-6">
					From a neighborhood workshop to an operation with locations coast to coast. We ship tags
					and labels to all 50 states, including Alaska and Hawaii.
				</P>
				<Div class="mt-8 flex items-center gap-5">
					<Span
						class="text-8xl font-semibold tracking-tight text-primary-500 tabular-nums dark:text-primary-400"
						aria-hidden="true"
						data-count-up={shippedStateCount}
						data-shipping-state-count
					>
						{shippedStateCount}
					</Span>
					<P class="max-w-36">states.<Br />One place to start.</P>
					<Span class="sr-only">Shipping to all 50 states.</Span>
				</Div>
			</Div>
			<Div class={twMerge(shippingArtworkClass, 'group p-6 sm:p-8')}>
				<Svg
					data-scroll-stagger
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
											? 'fill-primary-300 stroke-primary-400 stroke-1 dark:fill-primary-900 dark:stroke-primary-700'
											: 'fill-secondary-300 stroke-secondary-400 stroke-1 dark:fill-secondary-950 dark:stroke-secondary-700'}
									/>
									<Text
										x={x * 48 + 25}
										y={y * 48 + 30}
										text-anchor="middle"
										class="fill-gray-950 text-xs font-semibold dark:fill-gray-50"
									>
										{state}
									</Text>
								</G>
							{/if}
						{/each}
					{/each}
				</Svg>
				<P class="mt-5 text-sm text-gray-600 dark:text-gray-300">
					Coast to coast, and beyond the lower 48.
				</P>
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
		<Div class="grid items-center gap-4 lg:grid-cols-2">
			<Div class="order-2 lg:order-1">
				<Div class={twMerge(shippingArtworkClass, 'relative')}>
					<ShippingGlobe activeLocationId={selectedLocationId} />
				</Div>
			</Div>
			<Div class="order-1 lg:order-2">
				<P variants={['eyebrow']}>Beyond borders</P>
				<H3
					id="shipping-international-heading"
					class="text-4xl font-light tracking-tight sm:text-5xl"
				>
					Your work goes places.<Br />Your tags can, too.
				</H3>
				<P variants={['dialogBody']} class="mt-6">
					Need your product shipped internationally? Tell us where your order needs to go and we'll
					handle the rest.
				</P>
				<P class="mt-8 mb-3 text-sm font-medium">Some of our recent shipments</P>
				<Div
					class="flex flex-wrap gap-2"
					role="group"
					aria-label="Actual international destinations"
				>
					{#each internationalLocations as location (location.id)}
						<Button
							variants={[
								'neutral-outline',
								...(selectedLocationId === location.id ? ['selected'] : [])
							]}
							aria-pressed={selectedLocationId === location.id}
							onclick={() => (selectedLocationId = location.id)}
						>
							<MapPin class="size-4" aria-hidden="true" />{location.countryName}
						</Button>
					{/each}
				</Div>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet invitation()}
	<Container class="flex flex-col items-center gap-6">
		<Div class="flex gap-3" aria-hidden="true">
			<PackageCheck class="size-7" /><Globe2 class="size-7" />
		</Div>
		<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
			Let's put your project on the map
		</P>
		<H3
			id="shipping-contact-heading"
			class="max-w-2xl text-4xl font-light tracking-tight sm:text-5xl"
		>
			Where do your tags need to go?
		</H3>
		<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
			Share your destination, the tags you need, and your timing. We'll help you work through the
			next steps.
		</P>
		<A
			href="mailto:sales@abtl.com?subject=Shipping%20inquiry&body=Destination%3A%0ATags%20or%20labels%20needed%3A%0AQuantity%3A%0ATiming%3A"
			variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
		>
			<ActionLabel>Talk about shipping</ActionLabel>
		</A>
		<P class="text-sm text-gray-300 dark:text-gray-600">
			Your destination. Your project. Let's make a plan.
		</P>
	</Container>
{/snippet}

<Div data-shipping-content>
	{@render constrained(domestic)}
	{@render constrained(international)}
	<Section
		variants={['sampleInvitation']}
		class={isStandalone ? '' : '-mx-6 sm:-mx-8 lg:-mx-16'}
		data-shipping-section="contact"
		aria-labelledby="shipping-contact-heading"
	>
		{@render invitation()}
	</Section>
</Div>
