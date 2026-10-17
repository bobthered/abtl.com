<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Br,
		Button,
		Container,
		Div,
		H1,
		H2,
		H3,
		Label,
		P,
		RadioChoice,
		Section,
		Select
	} from '#lib/components';
	import { ContentLayout } from '#lib/layouts';
	import { floatIllustration } from '#lib/attachments';
	import { labels, tags } from './products';
	import { onMount } from 'svelte';
	import ProductArtwork from './ProductArtwork.svelte';
	import { RotateCw } from '#lib/icons';

	// consts
	const controlId = $props.id();

	// $state
	let collarView = $state('flat');
	let isBackVisible = $state(false);
	let isReady = $state(false);
	let selectedLabelId = $state('six-year');
	let selectedTagId = $state('inspection');

	// $derived
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
		Send us a sample, your artwork, or a list of the tags, labels, and collars you need. We?ll work
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
						class="flex h-112 items-center justify-center p-6 sm:h-128"
						data-fire-tag-preview={selectedTagId}
					>
						<Div {@attach floatIllustration} class="size-full">
							<ProductArtwork format="tag" product={selectedTag} isBack={isBackVisible} />
						</Div>
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
						<Button
							class="mt-6"
							variants={['neutral-outline']}
							onclick={() => (isBackVisible = !isBackVisible)}
						>
							<RotateCw class="size-4" aria-hidden="true" />{isBackVisible
								? 'View front'
								: 'Explore the reverse'}
						</Button>
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
						<Label for={`${controlId}-label`} class="mt-8 mb-3 block text-sm font-medium">
							Explore a label type
						</Label>
						<Select
							id={`${controlId}-label`}
							bind:value={selectedLabelId}
							options={labels.map((product) => ({ label: product.name, value: product.id }))}
							class="w-full"
						/>
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
				<P class="mt-8 text-sm font-medium">The label range</P><Div
					class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
				>
					{#each labels as product (product.id)}<P
							class="border-t border-gray-200 pt-4 text-sm dark:border-gray-700"
						>
							{product.name}
						</P>{/each}
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
						data-fire-collar-preview={collarView}
					>
						<Div {@attach floatIllustration} class="size-full">
							<ProductArtwork format="collar" isFitted={collarView === 'fitted'} />
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
						<Div class="mt-8 flex flex-wrap gap-4" role="radiogroup" aria-label="Collar view">
							{#each [{ id: 'flat', name: 'View flat' }, { id: 'fitted', name: 'View on equipment' }] as view (view.id)}<RadioChoice
									bind:group={collarView}
									value={view.id}
									name={`${controlId}-collar`}
								>
									{view.name}
								</RadioChoice>{/each}
						</Div>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Concept illustration. Share the neck opening, outside dimensions, and artwork for your
							collar.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Div>
