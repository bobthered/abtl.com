<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Br,
		Button,
		Container,
		Div,
		FlipPreview,
		H1,
		H2,
		H3,
		Input,
		Label,
		P,
		RadioChoice,
		Section
	} from '#lib/components';
	import { ArrowDown, RotateCcw } from '#lib/icons';
	import { ContentLayout } from '#lib/layouts';
	import { onMount } from 'svelte';
	import { tagExamples } from './examples';
	import ShellfishArtwork from './ShellfishArtwork.svelte';
	import ShellfishSheet from './ShellfishSheet.svelte';

	// consts
	const controlId = $props.id();
	const speciesOptions = ['Oysters', 'Clams', 'Mussels'];

	// $state
	let area = $state('Your growing area');
	let company = $state('Your Shellfish Company');
	let isAdvanced = $state(false);
	let isBack = $state(false);
	let isReady = $state(false);
	let selectedExampleId = $state('harvester');
	let species = $state('Oysters');

	// $derived
	const selectedExample = $derived(
		tagExamples.find((example) => example.id === selectedExampleId) ?? tagExamples[1]
	);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

{#snippet introduction()}
	<P variants={['eyebrow']}>Markets / Shellfish</P>
	<H1 variants={['h2.variant.section']}>From growing waters.<Br />Through every handoff.</H1>
	<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
		A tag carries the details that belong with the catch. We produce standard, pinfed, and
		laser-compatible sheeted shellfish tags, including digger and harvester tags, with printed
		layouts built around your operation.
	</P>
{/snippet}

{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		Put your next harvest on record
	</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Your operation.<Br />Your information. Clearly carried.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Send your current tag, approved wording, or a sample of your current stock. We'll work through
		the format, printed fields, numbering, and finishing for your shellfish tags.
	</P>
	<A href="/contact" variants={['button.base', 'button.variant.large', 'button.variant.neutral']}>
		<ActionLabel>Plan your shellfish tags</ActionLabel>
	</A>
{/snippet}

<Div data-shellfish-ready={isReady}>
	<ContentLayout {callToAction} {introduction}>
		<Section
			id="shellfish-standard"
			variants={['surfaceAlternate']}
			aria-labelledby="shellfish-standard-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div variants={['illustration']} class="h-128 p-6 sm:h-144" data-shellfish-standard>
						<FlipPreview bind:isBack>
							{#snippet artwork(isReverseVisible: boolean)}<ShellfishArtwork
									{area}
									{company}
									heading={selectedExample.heading}
									isBack={isReverseVisible}
									{species}
								/>{/snippet}
						</FlipPreview>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>01 / Standard shellfish tags</P>
						<H2 id="shellfish-standard-heading" class="text-4xl font-light sm:text-5xl">
							The catch has a source.<Br />Give it a clear record.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							From a digger at the landing to a harvester preparing the day's catch, start with a
							familiar tag and a layout that puts the right fields in reach. Explore these print
							concepts, then make one your own.
						</P>
						<Div class="mt-8 grid gap-4" role="radiogroup" aria-label="Shellfish tag example">
							{#each tagExamples as example (example.id)}<RadioChoice
									name={`${controlId}-example`}
									value={example.id}
									bind:group={selectedExampleId}
									aria-controls={`${controlId}-example-description`}
								>
									{example.name}
								</RadioChoice>{/each}
						</Div>
						<P
							id={`${controlId}-example-description`}
							class="mt-4 min-h-18 text-sm text-gray-600 dark:text-gray-300"
						>
							{selectedExample.description}
						</P>
						<Div class="mt-6 grid gap-4">
							<Div>
								<Label for={`${controlId}-company`} class="mb-2 block text-sm font-medium">
									Company or harvester name
								</Label><Input
									id={`${controlId}-company`}
									bind:value={company}
									maxlength={24}
									autocomplete="off"
									class="w-full"
								/>
							</Div>
							<Div>
								<Label for={`${controlId}-area`} class="mb-2 block text-sm font-medium">
									Harvest area
								</Label><Input
									id={`${controlId}-area`}
									bind:value={area}
									maxlength={24}
									autocomplete="off"
									class="w-full"
								/>
							</Div>
							<Div role="group" aria-label="Shellfish type" class="grid grid-cols-3 gap-4">
								{#each speciesOptions as option (option)}<RadioChoice
										name={`${controlId}-species`}
										value={option}
										bind:group={species}
										class="px-3 pr-7"
										indicatorClass="right-2"
									>
										{option}
									</RadioChoice>{/each}
							</Div>
						</Div>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Illustrative fields, not an approved regulatory form. Your entries stay on this page.
							Final wording and layout should follow your applicable shellfish authority's
							requirements.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>

		<Section
			id="shellfish-pinfed"
			variants={['surface']}
			aria-labelledby="shellfish-pinfed-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div class="py-6 lg:pr-12">
						<P variants={['eyebrow']}>02 / Pinfed shellfish tags</P>
						<H2 id="shellfish-pinfed-heading" class="text-4xl font-light sm:text-5xl">
							Keep your tags.<Br />Keep your rhythm.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Continuous pinfed stock gives your shellfish tag layout a connected format, with feed
							holes along the edges and perforations between tags. Advance the example to see the
							next tag move into position.
						</P>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Your name, harvest area, and shellfish choice carry across from the standard-tag
							preview. Plan preprinted information and the space your team needs for changing
							harvest details.
						</P>
						<Div class="mt-8 grid gap-4 sm:grid-cols-2">
							<Div
								class="rounded-sm bg-white p-5 inset-ring-1 inset-ring-gray-200 dark:bg-gray-900 dark:inset-ring-gray-800"
							>
								<H3 class="text-lg font-medium">Match your feed setup</H3><P
									class="mt-3 text-sm text-gray-600 dark:text-gray-300"
								>
									Share your equipment, current stock, feed-hole spacing, and perforation layout so
									we can plan the construction.
								</P>
							</Div>
							<Div
								class="rounded-sm bg-white p-5 inset-ring-1 inset-ring-gray-200 dark:bg-gray-900 dark:inset-ring-gray-800"
							>
								<H3 class="text-lg font-medium">Make changing data clear</H3><P
									class="mt-3 text-sm text-gray-600 dark:text-gray-300"
								>
									Work through fixed copy, writing areas, and printed identifiers together. The
									sequence shown here is a demonstration.
								</P>
							</Div>
						</Div>
						<A href="/capabilities/variable-data" class="mt-6 inline-flex">
							<ActionLabel>Explore variable data</ActionLabel>
						</A>
					</Div>
					<Div
						variants={['illustration']}
						class="flex h-144 flex-col items-center p-6 sm:h-160"
						data-shellfish-pinfed
					>
						<Div class="min-h-0 w-full flex-1">
							<ShellfishArtwork
								{area}
								{company}
								heading={selectedExample.heading}
								{isAdvanced}
								isPinfed
								{species}
							/>
						</Div>
						<Div class="mt-4 flex shrink-0 flex-col items-center gap-4">
							<Button
								variants={['neutral-outline']}
								onclick={() => (isAdvanced = !isAdvanced)}
								aria-pressed={isAdvanced}
							>
								{#if isAdvanced}<RotateCcw class="size-4" aria-hidden="true" />Reset the feed{:else}<ArrowDown
										class="size-4"
										aria-hidden="true"
									/>Advance the strip{/if}
							</Button>
							<P class="text-center text-xs text-gray-500 dark:text-gray-400">
								Illustrative feed geometry. Dimensions and equipment fit are confirmed for your
								project.
							</P>
						</Div>
					</Div>
				</Div>
			</Container>
		</Section>

		<Section
			id="shellfish-sheets"
			variants={['surfaceAlternate']}
			aria-labelledby="shellfish-sheets-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div variants={['illustration']} class="h-128 p-6 sm:h-144" data-shellfish-laser>
						<ShellfishSheet {area} {company} heading={selectedExample.heading} {species} />
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>03 / Laser-compatible sheets</P>
						<H2 id="shellfish-sheets-heading" class="text-4xl font-light sm:text-5xl">
							Six tags.<Br />One familiar sheet.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Prefer a sheet-fed workflow? Our laser-compatible shellfish tags come six-up on an
							8.5″ × 11″ sheet. Keep your tag information together in a format sized for US Letter.
						</P>
						<Div class="mt-8 grid grid-cols-2 gap-4">
							<Div
								class="rounded-sm bg-gray-50 p-5 inset-ring-1 inset-ring-gray-200 dark:bg-gray-950 dark:inset-ring-gray-800"
							>
								<P class="text-3xl font-light">6-up</P><P
									class="mt-2 text-sm text-gray-600 dark:text-gray-300"
								>
									Tags per sheet
								</P>
							</Div>
							<Div
								class="rounded-sm bg-gray-50 p-5 inset-ring-1 inset-ring-gray-200 dark:bg-gray-950 dark:inset-ring-gray-800"
							>
								<P class="text-3xl font-light">US Letter</P><P
									class="mt-2 text-sm text-gray-600 dark:text-gray-300"
								>
									8.5″ × 11″
								</P>
							</Div>
						</Div>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							The details you entered above appear on all six examples. Bring your artwork and
							printer setup so we can work through the print layout for your operation.
						</P>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Six-up sheet concept. The sheet proportion is shown to scale; individual tag
							dimensions, arrangement, and cut lines are illustrative.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Div>
