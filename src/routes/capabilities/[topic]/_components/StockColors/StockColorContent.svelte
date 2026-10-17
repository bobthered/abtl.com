<script lang="ts">
	// Imports
	import {
		ActionLabel,
		Br,
		Button,
		Container,
		Div,
		Figcaption,
		Figure,
		H2,
		H3,
		Img,
		P,
		RadioChoice,
		Section,
		Span,
		StockTag
	} from '#lib/components';
	import { ContentLayout } from '#lib/layouts';
	import { floatIllustration } from '#lib/attachments';
	import inspectionBack from '#lib/assets/tags/backs/inspection-record-01.svg';
	import inspectionFront from '#lib/assets/tags/fronts/inspection-record-01.svg';
	import { RotateCw } from '#lib/icons';
	import serviceFront from '#lib/assets/tags/fronts/service-tag-01.svg';
	import serviceSecondFront from '#lib/assets/tags/fronts/service-tag-02.svg';
	import type { Snippet } from 'svelte';
	import { stockColors } from '#lib/data/stockColors.js';
	import { twMerge } from 'tailwind-merge';

	// consts
	const colorStudioSideClass =
		'absolute top-1/2 w-28 -translate-y-1/2 transition-transform duration-700 ease-out sm:w-36 motion-reduce:transition-none';
	const controlId = $props.id();

	// $props()
	let {
		before,
		introduction,
		isStandalone = false,
		onRequestSamples
	}: {
		before: Snippet;
		introduction: Snippet;
		isStandalone?: boolean;
		onRequestSamples: () => void;
	} = $props();

	// $state
	let isBackVisible = $state(false);
	let selectedColorId = $state('manila');

	// $derived
	const selectedColor = $derived(stockColors.find((color) => color.id === selectedColorId)!);
</script>

{#snippet tagImage(id: string, artwork?: string)}
	<Div class="relative w-full">
		<StockTag class={stockColors.find((color) => color.id === id)?.className} />
		{#if artwork}
			<Img
				src={artwork}
				alt=""
				aria-hidden="true"
				width="237"
				height="474"
				class="absolute inset-0 h-full w-full mix-blend-multiply"
			/>
		{/if}
	</Div>
{/snippet}

{#snippet studio()}
	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-count-heading"
		data-color-section="color-studio"
	>
		<Div class="grid items-center gap-4 lg:grid-cols-2">
			<Div>
				<P variants={['eyebrow']}>Your color. Your message.</P>
				<H3 id="stock-count-heading" class="text-4xl font-light tracking-tight sm:text-5xl">
					Make your message unmistakable.
				</H3>
				<P variants={['dialogBody']} class="mt-6">
					A color can say &ldquo;check this,&rdquo; &ldquo;keep this,&rdquo; or &ldquo;start
					here&rdquo; before anyone reads a word. Give every step in your workflow a color of its
					own.
				</P>
				<Div data-stock-color-counter class="mt-8 flex items-center gap-4">
					<Span
						class="text-6xl font-semibold tracking-tight text-primary-500 tabular-nums dark:text-primary-400"
						aria-hidden="true"
						data-count-up={stockColors.length}
						data-stock-color-total
					>
						{stockColors.length}
					</Span>
					<Span class="sr-only">{stockColors.length}</Span>
					<P class="max-w-40 text-base">stock colors.<Br />One unmistakable impression.</P>
				</Div>
				<P class="mt-8 mb-3 text-sm font-medium">Try a stock color</P>
				<Div
					class="flex max-w-sm flex-wrap gap-2"
					role="radiogroup"
					aria-label="Preview stock colors"
				>
					{#each stockColors as color (color.id)}
						<RadioChoice
							isIndicatorVisible={false}
							bind:group={selectedColorId}
							value={color.id}
							name={`${controlId}-stock`}
							class="size-10 min-h-0 p-2"
							aria-label={`Preview ${color.name}`}
						>
							<Span
								class={twMerge(
									color.className,
									'block size-6 rounded-full bg-current inset-ring-1 inset-ring-gray-950/20',
									selectedColorId === color.id
										? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950'
										: ''
								)}
							/>
						</RadioChoice>
					{/each}
				</Div>
			</Div>
			<Figure>
				<Div
					variants={['illustration']}
					data-illustration-surface
					class="flex flex-col items-center p-6 perspective-distant sm:p-8"
				>
					<Div {@attach floatIllustration} class="relative h-96 w-full sm:h-112">
						<Div
							class={twMerge(
								colorStudioSideClass,
								'left-1/2 -translate-x-full -rotate-12 group-focus-within:-rotate-18 group-hover:-translate-x-5/4 group-hover:-rotate-18'
							)}
						>
							{@render tagImage('white', serviceFront)}
						</Div>
						<Div
							class={twMerge(
								colorStudioSideClass,
								'right-1/2 translate-x-full rotate-12 group-focus-within:rotate-18 group-hover:translate-x-5/4 group-hover:rotate-18'
							)}
						>
							{@render tagImage('fluorescent-orange', serviceSecondFront)}
						</Div>
						<Button
							variants={['ghost']}
							class="absolute top-1/2 left-1/2 z-10 w-36 -translate-1/2 bg-transparent! p-0 hover:bg-transparent! sm:w-44"
							aria-label={isBackVisible ? 'Show tag front' : 'Show tag back'}
							onclick={() => (isBackVisible = !isBackVisible)}
						>
							<Div
								class={twMerge(
									'w-full transition-transform duration-700 transform-3d motion-reduce:transition-none',
									isBackVisible ? 'rotate-y-180' : ''
								)}
								data-stock-preview-color={selectedColorId}
								data-stock-preview-side={isBackVisible ? 'back' : 'front'}
							>
								<Div class="w-full backface-hidden">
									{@render tagImage(selectedColorId, inspectionFront)}
								</Div>
								<Div class="absolute inset-0 rotate-y-180 backface-hidden">
									{@render tagImage(selectedColorId, inspectionBack)}
								</Div>
							</Div>
						</Button>
					</Div>
					<Div class="relative flex w-full items-center justify-between gap-4">
						<P class="text-sm font-medium" aria-live="polite">
							{selectedColor.name} &middot; {isBackVisible ? 'Back' : 'Front'}
						</P>
						<Button variants={['neutral-outline']} onclick={() => (isBackVisible = !isBackVisible)}>
							<RotateCw class="size-4" aria-hidden="true" />Flip tag
						</Button>
					</Div>
				</Div>
				<Figcaption class="mt-4 text-sm text-gray-600 dark:text-gray-300">
					Your stock is part of the design. Explore our supplied tag artwork on each color; physical
					samples are the best way to choose.
				</Figcaption>
			</Figure>
		</Div>
	</Section>
{/snippet}

{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		From your screen to your hands
	</P>
	<H2 id="stock-samples-heading" class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Meet your next tag color.
	</H2>
	<P class="max-w-lg text-lg text-gray-300 dark:text-gray-600">
		One favorite or a handful of possibilities. We'll send the stock colors you want to compare.
	</P>
	<Button variants={['large', 'neutral']} onclick={onRequestSamples} aria-haspopup="dialog">
		<ActionLabel>Request Samples</ActionLabel>
	</Button>
	<P class="text-sm text-gray-300 dark:text-gray-600">Choose your colors in one quick list.</P>
{/snippet}

<Div data-stock-color-content>
	<ContentLayout
		callToActionAttributes={{
			'aria-labelledby': 'stock-samples-heading',
			'data-color-section': 'samples'
		}}
		{callToAction}
		{introduction}
		{isStandalone}
	>
		{@render before()}
		{#if isStandalone}
			<Section variants={['surface']}><Container>{@render studio()}</Container></Section>
		{:else}{@render studio()}{/if}
	</ContentLayout>
</Div>
