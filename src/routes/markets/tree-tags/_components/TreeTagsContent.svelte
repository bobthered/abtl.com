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
		Input,
		Label,
		P,
		Section
	} from '#lib/components';
	import { ContentLayout } from '#lib/layouts';
	import { onMount } from 'svelte';
	import TreeTagArtwork from './TreeTagArtwork.svelte';

	// consts
	const controlId = $props.id();

	// $state
	let company = $state('Your Tree Farm');
	let isReady = $state(false);
	let isStandardBack = $state(false);
	let isTreeBack = $state(false);
	let number = $state('T-1048');
	let treeName = $state('Fraser Fir');

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

{#snippet introduction()}
	<P variants={['eyebrow']}>Markets / Tree Tags</P>
	<H1 variants={['h2.variant.section']}>Rooted in your identity.<Br />Made for your trees.</H1>
	<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
		From a familiar tag to a custom tree silhouette, give every tree a place for your name, its
		details, and the information that goes with it. Produced on any substrate, with Polyart and
		Tyvek among our most popular choices.
	</P>
{/snippet}

{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		Bring your tree tags to life
	</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Your trees.<Br />Your tag. Your story.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Share a sample, your artwork, or the shape you have in mind. We'll work through the substrate,
		printed details, and finishing for your tree tags.
	</P>
	<A href="/contact" variants={['button.base', 'button.variant.large', 'button.variant.neutral']}>
		<ActionLabel>Plan your tree tags</ActionLabel>
	</A>
{/snippet}

<Div data-tree-tags-ready={isReady}>
	<ContentLayout {callToAction} {introduction}>
		<Section
			id="tree-standard"
			variants={['surfaceAlternate']}
			aria-labelledby="tree-standard-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div
						variants={['illustration']}
						class="h-112 p-6 sm:h-128"
						data-tree-shape-preview="standard"
					>
						<FlipPreview bind:isBack={isStandardBack}>
							{#snippet artwork(isReverseVisible: boolean)}<TreeTagArtwork
									{company}
									isBack={isReverseVisible}
									{number}
									shape="standard"
									{treeName}
								/>{/snippet}
						</FlipPreview>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>01 / Standard tree tags</P><H2
							id="tree-standard-heading"
							class="text-4xl font-light sm:text-5xl"
						>
							Your name.<Br />Their perfect tree.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Our standard tag shape gives your identity and tree details a clear place to live. Try
							your farm name, a tree type, and a record number, then turn it over to explore the
							reverse.
						</P>

						<Div class="mt-8 grid gap-4">
							<Div>
								<Label for={`${controlId}-company`} class="mb-2 block text-sm font-medium">
									Farm or company name
								</Label><Input
									id={`${controlId}-company`}
									bind:value={company}
									maxlength={22}
									class="w-full"
									autocomplete="off"
								/>
							</Div>
							<Div class="grid grid-cols-2 gap-4">
								<Div>
									<Label for={`${controlId}-tree`} class="mb-2 block text-sm font-medium">
										Tree type
									</Label><Input
										id={`${controlId}-tree`}
										bind:value={treeName}
										maxlength={22}
										class="w-full"
										autocomplete="off"
									/>
								</Div><Div>
									<Label for={`${controlId}-number`} class="mb-2 block text-sm font-medium">
										Record number
									</Label><Input
										id={`${controlId}-number`}
										bind:value={number}
										maxlength={12}
										class="w-full"
										autocomplete="off"
									/>
								</Div>
							</Div>
						</Div>
						<P class="mt-6 text-sm text-gray-600 dark:text-gray-300">
							Changing identifiers? Variable data can give each tree tag its own information.
						</P><A href="/capabilities/variable-data" class="mt-4 inline-flex">
							<ActionLabel>Explore variable data</ActionLabel>
						</A>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Live concept preview. Your entries stay in this page and are not submitted or saved.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
		<Section id="tree-die-cut" variants={['surface']} aria-labelledby="tree-die-cut-heading">
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div class="py-6 lg:pr-12">
						<P variants={['eyebrow']}>02 / Custom die-cut tree tags</P><H2
							id="tree-die-cut-heading"
							class="text-4xl font-light sm:text-5xl"
						>
							Unmistakably a tree.<Br />Distinctly yours.
						</H2><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Make the shape part of the presentation with a custom die-cut tree profile. Bring your
							own design or work through the silhouette, fastening area, and printed details with
							us.
						</P><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Your personalized details carry into this example, too. Explore the front and back to
							see how your identity and tree information can work within the shape.
						</P><P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Original concept artwork. Final shapes, dimensions, and printed details are planned
							around your product.
						</P>
					</Div>
					<Div
						variants={['illustration']}
						class="h-112 p-6 sm:h-128"
						data-tree-shape-preview="tree"
					>
						<FlipPreview bind:isBack={isTreeBack}>
							{#snippet artwork(isReverseVisible: boolean)}<TreeTagArtwork
									{company}
									isBack={isReverseVisible}
									{number}
									shape="tree"
									{treeName}
								/>{/snippet}
						</FlipPreview>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Div>
