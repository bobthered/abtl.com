<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Br,
		ColorSwatch,
		Container,
		Div,
		H1,
		H2,
		P,
		RadioChoice,
		Section,
		Span
	} from '#lib/components';
	import { ContentLayout } from '#lib/layouts';
	import MerchandiseTag from './MerchandiseTag.svelte';
	import { merchandiseSizes } from './sizes';
	import { onMount } from 'svelte';
	import { stockColors } from '#lib/data/stockColors.js';

	// consts
	const controlId = $props.id();

	// $state
	let isReady = $state(false);
	let selectedColorId = $state('manila');
	let selectedSizeNumber = $state(4);

	// $derived
	const selectedColor = $derived(
		stockColors.find((color) => color.id === selectedColorId) ?? stockColors[0]
	);
	const selectedSize = $derived(
		merchandiseSizes.find((size) => size.number === selectedSizeNumber) ?? merchandiseSizes[3]
	);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

{#snippet introduction()}
	<P variants={['eyebrow']}>Markets / Merchandise Tags</P>
	<H1 variants={['h2.variant.section']}>A small tag.<Br />Part of the presentation.</H1>
	<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
		Merchandise tags. Marking tags. Jewelry tags. Whatever you call them, our scalloped tags pair a
		distinctive shape with knotted string, in all 21 stock colors and sizes #1 through #8.
	</P>
{/snippet}

{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		Put the finishing detail in place
	</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Your merchandise.<Br />A tag that belongs with it.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Tell us your preferred stock color and numbered size, or send a sample of the tag you use. We'll
		help work through the details for your merchandise.
	</P>
	<A href="/contact" variants={['button.base', 'button.variant.large', 'button.variant.neutral']}>
		<ActionLabel>Plan your merchandise tags</ActionLabel>
	</A>
{/snippet}

<Div data-merchandise-ready={isReady}>
	<ContentLayout {callToAction} {introduction}>
		<Section
			id="merchandise-colors"
			variants={['surfaceAlternate']}
			aria-labelledby="merchandise-colors-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div class="py-6 lg:pr-12">
						<P variants={['eyebrow']}>01 / Scalloped. Strung. Yours.</P>
						<H2 id="merchandise-colors-heading" class="text-4xl font-light sm:text-5xl">
							A familiar shape.<Br />A color of your own.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							A scalloped shoulder gives these tags their character. The string passes through the
							hole and is knotted near its ends, ready to become part of your product's
							presentation.
						</P>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Choose a quiet neutral or make the tag stand out. Try the same 21 stock colors
							available across our stock-color collection.
						</P>
						<P class="mt-8 mb-3 text-sm font-medium">Choose your stock color</P>
						<Div
							role="radiogroup"
							aria-label="Merchandise stock color"
							class="flex max-w-sm flex-wrap gap-2"
						>
							{#each stockColors as color (color.id)}<ColorSwatch
									{color}
									bind:group={selectedColorId}
									name={`${controlId}-stock`}
									label={`Preview ${color.name}`}
								/>{/each}
						</Div>
						<P class="mt-4 text-sm text-gray-600 dark:text-gray-300">
							Selected color: <Span
								class="font-medium text-gray-950 dark:text-gray-50"
								data-merchandise-color-name
							>
								{selectedColor.name}
							</Span>
						</P>
						<A href="/capabilities/stock-colors" class="mt-6 inline-flex">
							<ActionLabel>Explore the stock-color collection</ActionLabel>
						</A>
					</Div>
					<Div
						variants={['illustration']}
						class="flex h-128 flex-col items-center p-6 sm:h-144"
						data-merchandise-color-preview
					>
						<Div class="min-h-0 w-full flex-1">
							<MerchandiseTag colorClass={selectedColor.className} colorId={selectedColor.id} />
						</Div>
						<P class="mt-4 shrink-0 text-center text-sm text-gray-600 dark:text-gray-300">
							Scalloped merchandise tag / {selectedColor.name}<Br />Knotted string
						</P>
					</Div>
				</Div>
			</Container>
		</Section>

		<Section
			id="merchandise-sizes"
			variants={['surface']}
			aria-labelledby="merchandise-sizes-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div
						variants={['illustration']}
						class="flex h-128 flex-col items-center p-6 sm:h-144"
						data-merchandise-size-preview
					>
						<Div class="min-h-0 w-full flex-1">
							<MerchandiseTag
								colorClass={selectedColor.className}
								colorId={selectedColor.id}
								scale={selectedSize.scale}
							/>
						</Div>
						<P class="mt-4 shrink-0 text-center text-sm text-gray-600 dark:text-gray-300">
							Size #{selectedSize.number} / {selectedColor.name}<Br />Relative size illustration
						</P>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>02 / Sizes #1 through #8</P>
						<H2 id="merchandise-sizes-heading" class="text-4xl font-light sm:text-5xl">
							Find the right presence.<Br />Keep the same character.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							From a discreet marking tag to a more prominent merchandise detail, choose from eight
							numbered sizes. The scalloped shape and knotted string carry through the range.
						</P>
						<Div
							role="radiogroup"
							aria-label="Merchandise tag size"
							class="mt-8 grid grid-cols-4 gap-4"
						>
							{#each merchandiseSizes as size (size.number)}<RadioChoice
									name={`${controlId}-size`}
									value={size.number}
									bind:group={selectedSizeNumber}
								>
									#{size.number}
								</RadioChoice>{/each}
						</Div>
						<P class="mt-6 text-lg font-medium" data-merchandise-size-name>
							Size #{selectedSize.number}
						</P>
						<P class="mt-3 text-gray-600 dark:text-gray-300">
							Your chosen stock color stays with the preview as you compare sizes.
						</P>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							The progression is illustrative, not a dimensioned size chart. Ask us for the
							dimensions of your numbered size, or send a sample to match. Screen colors are
							representations; compare physical stock when color matching matters.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Div>
