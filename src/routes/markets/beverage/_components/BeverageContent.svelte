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
		P,
		RadioChoice,
		Section
	} from '#lib/components';
	import BeerArtwork from './BeerArtwork.svelte';
	import { beerConcepts, wineConcepts } from './options';
	import { ContentLayout } from '#lib/layouts';
	import { floatIllustration } from '#lib/attachments';
	import GrowlerArtwork from './GrowlerArtwork.svelte';
	import { onMount } from 'svelte';
	import WineArtwork from './WineArtwork.svelte';

	// consts
	const controlId = $props.id();

	// $state
	let beerConceptId = $state('coast');
	let beerView = $state('can');
	let elastic = $state('Black');
	let growlerView = $state('growler');
	let isReady = $state(false);
	let isWineBack = $state(false);
	let wineConceptId = $state('estate');

	// $derived
	const beerConcept = $derived(
		beerConcepts.find((concept) => concept.id === beerConceptId) ?? beerConcepts[0]
	);
	const wineConcept = $derived(
		wineConcepts.find((concept) => concept.id === wineConceptId) ?? wineConcepts[0]
	);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

{#snippet introduction()}
	<P variants={['eyebrow']}>Markets / Beverage</P>
	<H1 variants={['h2.variant.section']}>The first impression.<Br />Before the first pour.</H1>
	<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
		Craft beer can labels, elastic growler tags, and wine labels. Bring your beverage identity into
		the details people see, pick up, and take home.
	</P>
{/snippet}

{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		Give your next pour a presence
	</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Your beverage.<Br />Your story, carried through.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Send your artwork, a container sample, or the tag you have in mind. We'll work through shape,
		print layout, application conditions, and attachments for your project.
	</P>
	<A href="/contact" variants={['button.base', 'button.variant.large', 'button.variant.neutral']}>
		<ActionLabel>Plan your beverage project</ActionLabel>
	</A>
{/snippet}

<Div data-beverage-ready={isReady}>
	<ContentLayout {callToAction} {introduction}>
		<Section
			id="beverage-beer"
			variants={['surfaceAlternate']}
			aria-labelledby="beverage-beer-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div variants={['illustration']} class="h-144 p-6 sm:h-160" data-beer-preview>
						<Div {@attach floatIllustration} class="size-full">
							<BeerArtwork
								concept={beerConcept.id}
								isFlat={beerView === 'flat'}
								title={beerConcept.title}
							/>
						</Div>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>01 / Craft beer can labels</P>
						<H2 id="beverage-beer-heading" class="text-4xl font-light sm:text-5xl">
							A fresh release.<Br />An unmistakable identity.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							We've produced beer can labels for craft brewers. Whether you're building a core range
							or giving a seasonal release its own look, make the artwork part of what draws people
							to the can.
						</P>
						<P class="mt-6 text-sm font-medium">Explore an artwork direction</P>
						<Div
							role="radiogroup"
							aria-label="Beer artwork direction"
							class="mt-3 grid gap-4 sm:grid-cols-3"
						>
							{#each beerConcepts as concept (concept.id)}<RadioChoice
									name={`${controlId}-beer-concept`}
									value={concept.id}
									bind:group={beerConceptId}
								>
									{concept.name}
								</RadioChoice>{/each}
						</Div>
						<P class="mt-4 min-h-12 text-sm text-gray-600 dark:text-gray-300">
							{beerConcept.description}
						</P>
						<Div
							role="radiogroup"
							aria-label="Beer preview view"
							class="mt-6 grid grid-cols-2 gap-4"
						>
							<RadioChoice name={`${controlId}-beer-view`} value="can" bind:group={beerView}>
								On the can
							</RadioChoice><RadioChoice
								name={`${controlId}-beer-view`}
								value="flat"
								bind:group={beerView}
							>
								Flat artwork
							</RadioChoice>
						</Div>
						<P class="mt-6 text-gray-600 dark:text-gray-300">
							Start with your container and application process. Share when the labels are applied
							and whether they will encounter refrigeration, condensation, or moisture so we can
							discuss the right construction.
						</P>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Original fictional artwork, shown as a label concept. Final dimensions, materials, and
							required product copy are planned for your beverage.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>

		<Section
			id="beverage-growlers"
			variants={['surface']}
			aria-labelledby="beverage-growlers-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div class="py-6 lg:pr-12">
						<P variants={['eyebrow']}>02 / Growler tags with elastic</P>
						<H2 id="beverage-growlers-heading" class="text-4xl font-light sm:text-5xl">
							From the taproom.<Br />With a detail that travels.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Add a tag around the growler neck with elastic. Give your brewery identity, the brew
							name, and a fill reference a place of their own, or use the space for a message from
							your taproom.
						</P>
						<P class="mt-6 text-sm font-medium">Choose an elastic color</P>
						<Div
							role="radiogroup"
							aria-label="Growler elastic color"
							class="mt-3 grid grid-cols-2 gap-4"
						>
							{#each ['Black', 'White'] as option (option)}<RadioChoice
									name={`${controlId}-elastic`}
									value={option}
									bind:group={elastic}
								>
									{option}
								</RadioChoice>{/each}
						</Div>
						<Div
							role="radiogroup"
							aria-label="Growler preview view"
							class="mt-6 grid grid-cols-2 gap-4"
						>
							<RadioChoice
								name={`${controlId}-growler-view`}
								value="growler"
								bind:group={growlerView}
							>
								On the growler
							</RadioChoice><RadioChoice
								name={`${controlId}-growler-view`}
								value="detail"
								bind:group={growlerView}
							>
								Tag detail
							</RadioChoice>
						</Div>
						<P class="mt-6 text-gray-600 dark:text-gray-300">
							The example uses our standard tag shape and a patch at the hole. Bring your growler
							sample so we can plan the tag size and elastic fit together.
						</P>
						<A href="/capabilities/attachments" class="mt-6 inline-flex">
							<ActionLabel>Explore attachments</ActionLabel>
						</A>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Illustrative attachment and print layout. The tag is not a tamper seal or a substitute
							for required container labeling.
						</P>
					</Div>
					<Div variants={['illustration']} class="h-144 p-6 sm:h-160" data-growler-preview>
						<Div {@attach floatIllustration} class="size-full">
							<GrowlerArtwork {elastic} isDetail={growlerView === 'detail'} />
						</Div>
					</Div>
				</Div>
			</Container>
		</Section>

		<Section
			id="beverage-wine"
			variants={['surfaceAlternate']}
			aria-labelledby="beverage-wine-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div variants={['illustration']} class="h-144 p-6 sm:h-160" data-wine-preview>
						<FlipPreview bind:isBack={isWineBack}>
							{#snippet artwork(isReverseVisible: boolean)}<WineArtwork
									concept={wineConcept.id}
									isBack={isReverseVisible}
								/>{/snippet}
						</FlipPreview>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>03 / Wine labels</P>
						<H2 id="beverage-wine-heading" class="text-4xl font-light sm:text-5xl">
							Set the tone.<Br />Let the story unfold.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							A wine label can introduce the name, establish a visual character, and leave room for
							the story on the reverse. Explore two design directions, then turn the example over to
							see how the back label carries the conversation forward.
						</P>
						<Div
							role="radiogroup"
							aria-label="Wine artwork direction"
							class="mt-8 grid grid-cols-2 gap-4"
						>
							{#each wineConcepts as concept (concept.id)}<RadioChoice
									name={`${controlId}-wine-concept`}
									value={concept.id}
									bind:group={wineConceptId}
								>
									{concept.name}
								</RadioChoice>{/each}
						</Div>
						<P class="mt-4 min-h-12 text-sm text-gray-600 dark:text-gray-300">
							{wineConcept.description}
						</P>
						<P class="mt-6 text-gray-600 dark:text-gray-300">
							Plan the front and back as a connected pair. Share the bottle shape, your artwork, and
							any chilled-service or ice-bucket exposure so material and application requirements
							can be considered together.
						</P>
						<A href="/capabilities/full-color-printing" class="mt-6 inline-flex">
							<ActionLabel>Explore full-color printing</ActionLabel>
						</A>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Fictional design concepts, not production-ready alcohol labels. Supply the approved
							product information for your project; finishes and performance are confirmed
							separately.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Div>
