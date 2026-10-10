<script lang="ts">
	// Imports
	import {
		A,
		Br,
		Button,
		Container,
		Div,
		H3,
		H4,
		P,
		Section,
		Span,
		StockTag,
		WeatherTag
	} from '#lib/components';
	import { ArrowRight, Check, Droplets, Hand, Link, ShieldCheck, Wind } from '#lib/icons';
	import type { Snippet } from 'svelte';
	import { syntheticMaterials } from './materials';

	// consts
	const attachments = [
		{
			id: 'wire',
			name: 'Wire',
			description:
				'A secure connection for your tag. Tell us about the item, handling, and environment so we can discuss the right wire option.'
		},
		{
			id: 'string',
			name: 'String',
			description:
				'A familiar way to tie on identification. Discuss the length and application with us to find the right fit.'
		},
		{
			id: 'elastic',
			name: 'Elastic',
			description:
				'A flexible attachment option. Let us know how the tag will be fitted and used so we can help with the selection.'
		}
	] as const;

	// $props()
	let { isStandalone = false }: { isStandalone?: boolean } = $props();

	// $state
	let attachment = $state<'wire' | 'string' | 'elastic'>('wire');
	let isStorm = $state(false);
	let selectedMaterial = $state<string>('tyvek');

	// $derived
	const currentAttachment = $derived(attachments.find((item) => item.id === attachment)!);
	const material = $derived(syntheticMaterials.find((item) => item.id === selectedMaterial)!);
	const sampleHref = $derived(
		`mailto:sales@abtl.com?subject=${encodeURIComponent('Synthetic tag samples')}&body=${encodeURIComponent(`I'd like to compare synthetic tag materials.\nMaterial of interest: ${material.name}\nApplication: \nOutdoor exposure and handling: \nAttachment: ${currentAttachment.name}\nQuantity: \nSample shipping address: `)}`
	);
</script>

{#snippet constrained(children: Snippet)}
	{#if isStandalone}<Container>{@render children()}</Container>{:else}{@render children()}{/if}
{/snippet}

{#snippet weather()}
	<Section
		variants={['dialogSection']}
		data-synthetic-section="weather"
		aria-labelledby="synthetic-weather-heading"
	>
		<Div class="grid items-center gap-10 lg:grid-cols-5 lg:gap-16">
			<Div class="lg:col-span-2">
				<P variants={['eyebrow']}>Durability starts with the stock</P>
				<H3 id="synthetic-weather-heading" class="text-4xl sm:text-5xl"
					>The forecast changes.<Br />The job goes on.</H3
				>
				<P variants={['dialogBody']} class="mt-6"
					>A tag outside has more to contend with than a little rain. Handling, movement, and the
					way it is attached all matter. Our waterproof synthetic materials give outdoor
					identification a tougher starting point.</P
				>
				<Div class="mt-8 space-y-5">
					<Div class="flex gap-4" data-scroll-reveal
						><Droplets class="mt-1 size-5 shrink-0 text-primary-500" aria-hidden="true" /><Div
							><H4 class="text-base font-medium">Waterproof materials</H4><P
								class="mt-1 text-sm text-gray-600 dark:text-gray-300"
								>Stock options made for applications beyond the indoors.</P
							></Div
						></Div
					>
					<Div class="flex gap-4" data-scroll-reveal
						><Hand class="mt-1 size-5 shrink-0 text-primary-500" aria-hidden="true" /><Div
							><H4 class="text-base font-medium">Durability for the way you work</H4><P
								class="mt-1 text-sm text-gray-600 dark:text-gray-300"
								>Match tear resistance and feel to the handling your tag will see.</P
							></Div
						></Div
					>
					<Div class="flex gap-4" data-scroll-reveal
						><Link class="mt-1 size-5 shrink-0 text-primary-500" aria-hidden="true" /><Div
							><H4 class="text-base font-medium">A considered connection</H4><P
								class="mt-1 text-sm text-gray-600 dark:text-gray-300"
								>Material, reinforced hole, and attachment work together.</P
							></Div
						></Div
					>
				</Div>
			</Div>
			<Div
				data-scroll-reveal
				class="relative overflow-hidden rounded-sm bg-gray-100 lg:col-span-3 dark:bg-gray-900"
			>
				<Div class="absolute inset-x-6 top-6 z-10 flex items-center justify-between gap-4"
					><Span class="text-xs font-medium tracking-widest uppercase">Out in the elements</Span
					><Span class="flex items-center gap-2 text-xs"
						><Span
							class={`size-1.5 rounded-full ${isStorm ? 'bg-secondary-500' : 'bg-primary-500'}`}
						/>{isStorm ? 'Wind + rain' : 'A passing shower'}</Span
					></Div
				>
				<WeatherTag class="min-h-100 sm:min-h-128" {isStorm} />
				<Div class="relative flex flex-wrap items-center justify-between gap-4 px-6 pb-6"
					><P class="max-w-64 text-xs text-gray-500 dark:text-gray-400"
						>Illustrative motion. Let's match the actual material and print to your conditions.</P
					><Button
						variants={['neutral-outline']}
						aria-pressed={isStorm}
						onclick={() => (isStorm = !isStorm)}
						data-weather-control
						><Wind class="size-4" aria-hidden="true" />{isStorm
							? 'Ease the wind'
							: 'Turn up the wind'}</Button
					></Div
				>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet explorer()}
	<Section
		variants={['dialogSection']}
		data-synthetic-section="materials"
		aria-labelledby="synthetic-material-heading"
	>
		<Div class="grid gap-6 lg:grid-cols-2 lg:gap-16"
			><Div
				><P variants={['eyebrow']}>Five ways to go outside</P><H3
					id="synthetic-material-heading"
					class="text-4xl sm:text-5xl">Find your<Br />kind of tough.</H3
				></Div
			><P variants={['dialogBody']} class="lg:self-end"
				>All five are waterproof options for outdoor use. The differences are in the construction,
				surface, handling, and value. Explore a starting point, then compare samples for your
				application.</P
			></Div
		>
		<Div class="mt-10 flex flex-wrap gap-2" role="group" aria-label="Explore synthetic materials">
			{#each syntheticMaterials as option (option.id)}<Button
					variants={['neutral', 'neutral-selectable']}
					aria-pressed={selectedMaterial === option.id}
					onclick={() => (selectedMaterial = option.id)}
					data-synthetic-material={option.id}>{option.name}</Button
				>{/each}
		</Div>
		<Div class="mt-6 grid overflow-hidden rounded-sm bg-gray-100 lg:grid-cols-5 dark:bg-gray-900">
			<Div
				data-scroll-reveal
				class="relative flex min-h-80 items-center justify-center overflow-hidden bg-radial from-primary-200/60 to-transparent p-8 lg:col-span-2 dark:from-primary-800/40"
			>
				<Span class="absolute top-5 left-6 text-xs font-medium tracking-widest uppercase"
					>Material / 0{syntheticMaterials.indexOf(material) + 1}</Span
				>
				<Div
					class="relative w-36 -rotate-6 drop-shadow-lg hover:rotate-0 motion-safe:transition-transform motion-safe:duration-500"
					><StockTag class="w-full text-white" /><Div
						class="absolute inset-x-4 top-1/3 text-gray-950"
						><Span class="text-xs font-medium text-gray-950 dark:text-gray-950"
							>SYNTHETIC STOCK</Span
						><P class="mt-3 text-2xl font-semibold text-gray-950 dark:text-gray-950"
							>{material.name}</P
						><Span class="mt-4 block h-1 w-12 bg-primary-500" /><P
							class="mt-4 text-xs text-gray-950 dark:text-gray-950"
							>Made for life<Br />out in the open.</P
						></Div
					></Div
				>
				<Span class="absolute right-6 bottom-5 text-xs text-gray-500 dark:text-gray-400"
					>Illustrative sample</Span
				>
			</Div>
			<Div
				class="flex flex-col justify-center p-6 sm:p-10 lg:col-span-3"
				aria-live="polite"
				aria-atomic="true"
				data-material-detail
			>
				<H4 class="text-2xl sm:text-3xl">{material.heading}</H4><P
					class="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">{material.description}</P
				>
				<Div class="mt-8 grid gap-6 sm:grid-cols-2"
					><Div
						><P class="flex items-center gap-2 text-sm font-semibold"
							><Check class="size-4 text-primary-500" aria-hidden="true" />Why consider it</P
						><P class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
							>{material.strength}</P
						></Div
					><Div
						><P class="text-sm font-semibold">What to weigh</P><P
							class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
							>{material.consideration}</P
						></Div
					></Div
				>
				<Div class="mt-6 border-t border-gray-300 pt-6 dark:border-gray-700"
					><P class="text-sm font-semibold">Application starting point</P><P
						class="mt-2 text-sm text-gray-600 dark:text-gray-300">{material.application}</P
					></Div
				>
				{#if material.source}<A
						href={material.source}
						class="mt-6 inline-flex items-center gap-1 self-start text-xs"
						target="_blank"
						rel="noreferrer"
						>{material.sourceName}<ArrowRight class="size-3" aria-hidden="true" /></A
					>{/if}
			</Div>
		</Div>
		<P class="mt-5 max-w-3xl text-sm text-gray-500 dark:text-gray-400"
			>The finished tag is a system: stock, ink, thickness, and attachment. We'll help confirm the
			right grade and printing for the exposure and handling you describe.</P
		>
	</Section>
{/snippet}

{#snippet connections()}
	<Section
		variants={['dialogSection']}
		data-synthetic-section="attachments"
		aria-labelledby="synthetic-attachment-heading"
	>
		<Div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
			<Div
				data-scroll-reveal
				class="relative overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-900"
				><WeatherTag
					class="min-h-88 sm:min-h-100"
					{attachment}
					material="THE CONNECTION MATTERS"
				/><Span class="absolute bottom-6 left-6 text-sm font-medium"
					>{currentAttachment.name} attachment</Span
				></Div
			>
			<Div
				><P variants={['eyebrow']}>More than the material</P><H3
					id="synthetic-attachment-heading"
					class="text-4xl sm:text-5xl">The connection<Br />matters.</H3
				><P variants={['dialogBody']} class="mt-6"
					>A tough tag still needs the right way to hang on. We offer wire, string, and elastic
					attachments, so the connection can be considered alongside the stock.</P
				>
				<Div class="mt-8 flex flex-wrap gap-2" role="group" aria-label="Explore tag attachments"
					>{#each attachments as option (option.id)}<Button
							variants={['neutral', 'neutral-selectable']}
							aria-pressed={attachment === option.id}
							onclick={() => (attachment = option.id)}>{option.name}</Button
						>{/each}</Div
				>
				<P class="mt-6 min-h-24 leading-relaxed text-gray-600 dark:text-gray-300" aria-live="polite"
					>{currentAttachment.description}</P
				>
				<P class="mt-6 text-sm font-medium"
					>Start with the whole job. We'll help with the details.</P
				>
			</Div>
		</Div>
	</Section>
{/snippet}

<Div data-synthetic-content>
	{@render constrained(weather)}
	{@render constrained(explorer)}
	{@render constrained(connections)}
	<Section
		variants={['sampleInvitation']}
		class={isStandalone ? '' : '-mx-6 sm:-mx-8 lg:-mx-16'}
		data-synthetic-section="samples"
	>
		<Container class="flex flex-col items-center gap-6"
			><Div data-scroll-reveal><ShieldCheck class="size-8" aria-hidden="true" /></Div><P
				variants={['eyebrow']}
				class="text-gray-300 dark:text-gray-600">Take the comparison into your own hands</P
			><H3 class="max-w-3xl text-4xl sm:text-5xl">Feel the difference.<Br />Find the right fit.</H3
			><P class="max-w-xl text-lg text-gray-300 dark:text-gray-600"
				>Request individual materials or a selection of synthetic samples. Tell us where your tags
				will work and how they'll be attached.</P
			><A
				variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
				href={sampleHref}
				data-synthetic-samples
				>Request Synthetic Samples<ArrowRight class="size-5" aria-hidden="true" /></A
			></Container
		>
	</Section>
</Div>
