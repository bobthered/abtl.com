<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Br,
		Container,
		Div,
		FlipPreview,
		H1,
		H2,
		H3,
		P,
		RadioChoice,
		Section,
		Span
	} from '#lib/components';
	import { collars, labels, tags } from './products';
	import { ContentLayout } from '#lib/layouts';
	import { floatIllustration } from '#lib/attachments';
	import { onMount } from 'svelte';
	import ProductArtwork from './ProductArtwork.svelte';

	// consts
	const controlId = $props.id();

	// $state
	let isBackVisible = $state(false);
	let isReady = $state(false);
	let selectedCollarId = $state('small');
	let selectedLabelId = $state('six-year');
	let selectedTagId = $state('inspection');

	// $derived
	const selectedCollar = $derived(
		collars.find((collar) => collar.id === selectedCollarId) ?? collars[0]
	);
	const selectedLabel = $derived(
		labels.find((product) => product.id === selectedLabelId) ?? labels[0]
	);
	const selectedTag = $derived(tags.find((product) => product.id === selectedTagId) ?? tags[0]);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

{#snippet introduction()}
	<P variants={['eyebrow']}>Markets / Fire Suppression</P>
	<H1 variants={['h2.variant.section']}>The work matters.<Br />So does the record.</H1>
	<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
		Inspection tags. Service labels. Collars. Bring the printed details of your fire-service program
		together, from the first equipment identifier to the record left after a visit.
	</P>
	<P class="mt-6 text-sm font-medium text-primary-600 dark:text-primary-300">
		For distributors and direct customers.
	</P>
{/snippet}

{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		Build your fire-service range
	</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Your service.<Br />Your name on every detail.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Send us a sample, your artwork, or a list of the tags, labels, and collars you need. We'll work
		through the sizes, information, materials, and finishing together.
	</P>
	<A href="/contact" variants={['button.base', 'button.variant.large', 'button.variant.neutral']}>
		<ActionLabel>Plan your fire-service products</ActionLabel>
	</A>
{/snippet}

<Div data-fire-suppression-ready={isReady}>
	<ContentLayout {callToAction} {introduction}>
		<Section variants={['surfaceAlternate']}>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-end gap-4 lg:grid-cols-2">
					<Div>
						<P variants={['eyebrow']}>One coordinated range</P><H2
							class="max-w-xl text-4xl font-light sm:text-5xl"
						>
							From a hanging tag<Br />to the smallest label.
						</H2>
					</Div>
					<P class="max-w-xl text-lg text-gray-600 dark:text-gray-300">
						Different pieces. A familiar identity. Explore {tags.length + labels.length + 1} product types
						for the equipment, service visits, and records that make up your day.
					</P>
				</Div>
				<Div class="mt-10 grid gap-4 md:grid-cols-3">
					{#each [{ format: 'tag', title: 'Tags', text: 'A record that stays with the equipment.', product: tags[0], href: '#tags' }, { format: 'label', title: 'Labels', text: 'Information right where it is needed.', product: labels[1], href: '#labels' }, { format: 'collar', title: 'Collars', text: 'A service record around the neck.', product: undefined, href: '#collars' }] as item (item.format)}
						<Div class="rounded-sm bg-gray-50 p-6 dark:bg-gray-950">
							<Div class="h-64">
								<ProductArtwork
									format={item.format as 'tag' | 'label' | 'collar'}
									product={item.product}
								/>
							</Div>
							<H3 class="mt-6 text-2xl">{item.title}</H3><P
								class="mt-2 text-gray-600 dark:text-gray-300"
							>
								{item.text}
							</P>
							<A href={item.href} class="mt-4 inline-flex">
								<ActionLabel>Explore {item.title.toLowerCase()}</ActionLabel>
							</A>
						</Div>
					{/each}
				</Div>
			</Container>
		</Section>
		<Section id="tags" variants={['surface']} class="scroll-mt-28">
			<Container class="py-12 sm:py-16">
				<P variants={['eyebrow']}>01 / Tags</P><H2
					class="max-w-3xl text-4xl font-light sm:text-5xl"
				>
					The right record.<Br />Attached to the right equipment.
				</H2>
				<Div class="mt-8 flex flex-wrap gap-4" role="radiogroup" aria-label="Fire-service tag type">
					{#each tags as product (product.id)}<RadioChoice
							bind:group={selectedTagId}
							value={product.id}
							name={`${controlId}-tag`}
						>
							{product.name}
						</RadioChoice>{/each}
				</Div>
				<Div class="mt-8 grid items-center gap-4 lg:grid-cols-2">
					<Div
						variants={['illustration']}
						class="h-112 p-6 sm:h-128"
						data-fire-tag-preview={selectedTagId}
						data-fire-tag-side={isBackVisible ? 'reverse' : 'front'}
					>
						<FlipPreview
							bind:isBack={isBackVisible}
							buttonAttributes={{ 'data-fire-tag-flip': '' }}
						>
							{#snippet artwork(isReverseVisible: boolean)}
								<ProductArtwork
									format="tag"
									product={selectedTag}
									isBack={isReverseVisible}
									isBackdropVisible={false}
								/>
							{/snippet}
						</FlipPreview>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P
							class="text-sm font-medium text-primary-600 dark:text-primary-300"
							aria-live="polite"
						>
							{selectedTag.name} / {isBackVisible ? 'Reverse' : 'Front'}
						</P>
						<H3 class="mt-4 text-3xl font-light sm:text-4xl">{selectedTag.headline}</H3><P
							class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
						>
							{selectedTag.description}
						</P>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Illustrative layouts. Make the fields, wording, and artwork your own.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
		<Section id="labels" variants={['surfaceAlternate']} class="scroll-mt-28">
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div class="lg:pr-12">
						<P variants={['eyebrow']}>02 / Labels</P><H2 class="text-4xl font-light sm:text-5xl">
							Small footprint.<Br />Useful information.
						</H2><P class="mt-6 text-lg text-gray-600 dark:text-gray-300">
							From a call-for-service reminder to a maintenance record, build a label around what
							your team needs to communicate.
						</P>
						<Div
							class="mt-8 grid grid-cols-2 gap-4"
							role="radiogroup"
							aria-label="Fire-service label type"
						>
							{#each labels as product (product.id)}
								<RadioChoice
									bind:group={selectedLabelId}
									value={product.id}
									name={`${controlId}-label`}
								>
									{product.name}
								</RadioChoice>
							{/each}
						</Div>
						<Div class="mt-6 min-h-48" aria-live="polite">
							<H3 class="text-2xl font-medium">{selectedLabel.headline}</H3><P
								class="mt-4 leading-relaxed text-gray-600 dark:text-gray-300"
							>
								{selectedLabel.description}
							</P>
						</Div>
					</Div>
					<Div
						variants={['illustration']}
						class="h-88 p-4 sm:h-112 sm:p-6"
						data-fire-label-preview={selectedLabelId}
					>
						<Div {@attach floatIllustration} class="size-full">
							<ProductArtwork format="label" product={selectedLabel} />
						</Div>
					</Div>
				</Div>
				<P class="mt-8 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
					Previews illustrate layout possibilities. Make the wording, information, and artwork your
					own.
				</P>
			</Container>
		</Section>
		<Section id="collars" variants={['surface']} class="scroll-mt-28">
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div
						variants={['illustration']}
						class="h-112 p-6 sm:h-128"
						data-fire-collar-preview={selectedCollarId}
					>
						<Div {@attach floatIllustration} class="size-full">
							<ProductArtwork format="collar" collar={selectedCollar} />
						</Div>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>03 / Collars</P><H2 class="text-4xl font-light sm:text-5xl">
							A different shape.<Br />The same attention to detail.
						</H2><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Extinguisher neck collars put your printed information around the neck of the
							equipment. Start with the fit, then plan the service details and company identity
							around it.
						</P>
						<P class="mt-6 leading-relaxed text-gray-600 dark:text-gray-300">
							Four sizes, each with its own type color. Every collar is white; your company name,
							license number, phone number, and other personalized information are digitally printed
							in black using variable data.
						</P>
						<Div class="mt-8 grid grid-cols-2 gap-4" role="radiogroup" aria-label="Collar size">
							{#each collars as collar (collar.id)}
								<RadioChoice
									bind:group={selectedCollarId}
									value={collar.id}
									name={`${controlId}-collar`}
								>
									<Span class={collar.className}>
										<Span class="block size-3 rounded-full bg-current" />
									</Span>{collar.name} / {collar.color}
								</RadioChoice>
							{/each}
						</Div>
						<P class="mt-6 text-sm font-medium" aria-live="polite">
							{selectedCollar.name} / {selectedCollar.color} type / Black personalization
						</P>
						<P class="mt-4 text-sm text-gray-500 dark:text-gray-400">
							Illustrative layout. Personalize with your company details.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Div>
