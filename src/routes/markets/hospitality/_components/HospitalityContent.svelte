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
	import { applications } from './applications';
	import { ContentLayout } from '#lib/layouts';
	import { floatIllustration } from '#lib/attachments';
	import HospitalityArtwork from './HospitalityArtwork.svelte';
	import HospitalityClaimTag from './HospitalityClaimTag.svelte';
	import { onMount } from 'svelte';
	import { Layers, Scissors } from '#lib/icons';

	// consts
	const controlId = $props.id();

	// $state
	let isDoorBack = $state(false);
	let isLabelSeparated = $state(false);
	let isReady = $state(false);
	let isSeparated = $state(false);
	let number = $state('02841');
	let property = $state('Your Hotel');
	let selectedApplicationId = $state('valet');

	// $derived
	const selectedApplication = $derived(
		applications.find((application) => application.id === selectedApplicationId) ?? applications[0]
	);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

{#snippet introduction()}
	<P variants={['eyebrow']}>Markets / Hospitality</P><H1 variants={['h2.variant.section']}>
		A warm welcome.<Br />A well-kept detail.
	</H1>
	<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
		From the first bag at the bell desk to the last item returned, thoughtful printed tags help keep
		the guest experience moving. Plan your claim checks, service tags, and guest messages around the
		way your property works.
	</P>
{/snippet}

{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		Put your property in the details
	</P><H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Your welcome.<Br />Carried through every handoff.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Bring a sample, your branding, or a list of the tags your team uses. We'll work through the
		format, numbering, printed information, and finishing for your hospitality project.
	</P>
	<A href="/contact" variants={['button.base', 'button.variant.large', 'button.variant.neutral']}>
		<ActionLabel>Plan your hospitality tags</ActionLabel>
	</A>
{/snippet}

<Div data-hospitality-ready={isReady}>
	<ContentLayout {callToAction} {introduction}>
		<Section id="luggage-claim" variants={['surfaceAlternate']} aria-labelledby="luggage-heading">
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div
						variants={['illustration']}
						class="flex h-160 flex-col gap-4 p-6 sm:h-192"
						data-hospitality-claim
						data-claim-separated={isSeparated}
					>
						<Div {@attach floatIllustration} class="min-h-0 flex-1">
							<HospitalityClaimTag {isLabelSeparated} {isSeparated} {number} {property} />
						</Div>
						<Div class="flex shrink-0 flex-wrap justify-center gap-4">
							<Button
								variants={['neutral-outline']}
								onclick={() => (isLabelSeparated = !isLabelSeparated)}
								aria-pressed={isLabelSeparated}
							>
								<Layers class="size-4" aria-hidden="true" />{isLabelSeparated
									? 'Replace the luggage label'
									: 'Peel a luggage label'}
							</Button>
							<Button
								variants={['neutral-outline']}
								onclick={() => (isSeparated = !isSeparated)}
								aria-pressed={isSeparated}
							>
								<Scissors class="size-4" aria-hidden="true" />{isSeparated
									? 'Rejoin the example'
									: 'Separate the claim check'}
							</Button>
						</Div>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>01 / Luggage claim tags</P><H2
							id="luggage-heading"
							class="text-4xl font-light sm:text-5xl"
						>
							Their bags.<Br />One matching claim.
						</H2><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							A set of matching labels identifies multiple pieces of luggage, while a separate claim
							check stays with the guest. Put the same reference on every part, with your property
							identity at the top.
						</P>
						<Div class="mt-8 grid gap-4 sm:grid-cols-2">
							<Div>
								<Label for={`${controlId}-property`} class="mb-2 block text-sm font-medium">
									Property name
								</Label><Input
									id={`${controlId}-property`}
									bind:value={property}
									maxlength={22}
									class="w-full"
									autocomplete="off"
								/>
							</Div><Div>
								<Label for={`${controlId}-claim`} class="mb-2 block text-sm font-medium">
									Claim number
								</Label><Input
									id={`${controlId}-claim`}
									bind:value={number}
									maxlength={8}
									class="w-full"
									autocomplete="off"
								/>
							</Div>
						</Div>
						<P class="mt-6 text-sm text-gray-600 dark:text-gray-300">
							Peel a label for another bag, then separate the guest claim check. All six labels and
							the claim check keep the same reference.
						</P><A href="/capabilities/variable-data" class="mt-4 inline-flex">
							<ActionLabel>Explore matching variable data</ActionLabel>
						</A>
						<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Original concept preview. Your entries stay on this page; final construction is
							planned around your application.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
		<Section
			id="hospitality-applications"
			variants={['surface']}
			aria-labelledby="applications-heading"
		>
			<Container class="py-12 sm:py-16">
				<P variants={['eyebrow']}>02 / Beyond the bell desk</P><H2
					id="applications-heading"
					class="max-w-3xl text-4xl font-light sm:text-5xl"
				>
					Every handoff<Br />deserves a clear record.
				</H2><P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
					Explore custom-tag applications across your property, from guest belongings to the
					services that support a stay.
				</P>
				<Div
					class="mt-8 flex flex-wrap gap-4"
					role="radiogroup"
					aria-label="Hospitality tag application"
				>
					{#each applications as application (application.id)}<RadioChoice
							bind:group={selectedApplicationId}
							value={application.id}
							name={`${controlId}-application`}
						>
							{application.name}
						</RadioChoice>{/each}
				</Div>
				<Div class="mt-8 grid items-center gap-4 lg:grid-cols-2">
					<Div class="py-6 lg:pr-12">
						<P
							class="text-sm font-medium text-primary-600 dark:text-primary-300"
							aria-live="polite"
						>
							{selectedApplication.name}
						</P><H3 class="mt-4 text-3xl font-light sm:text-4xl">{selectedApplication.title}</H3><P
							class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
						>
							{selectedApplication.description}
						</P><P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							A custom layout starts with the information your team needs. Share an existing tag or
							describe the process you want to support.
						</P>
					</Div><Div
						variants={['illustration']}
						class="h-112 p-6 sm:h-128"
						data-hospitality-application={selectedApplicationId}
					>
						<Div {@attach floatIllustration} class="size-full">
							<HospitalityArtwork
								format="tag"
								fields={selectedApplication.fields}
								heading={selectedApplication.printTitle}
								{number}
								{property}
							/>
						</Div>
					</Div>
				</Div>
			</Container>
		</Section>
		<Section id="guest-room" variants={['surfaceAlternate']} aria-labelledby="guest-room-heading">
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div variants={['illustration']} class="h-112 p-6 sm:h-128" data-hospitality-door>
						<FlipPreview bind:isBack={isDoorBack}>
							{#snippet artwork(isReverseVisible: boolean)}<HospitalityArtwork
									format="door"
									isBack={isReverseVisible}
									{property}
								/>{/snippet}
						</FlipPreview>
					</Div>
					<Div class="py-6 lg:pl-12">
						<P variants={['eyebrow']}>03 / Guest-room door hangers</P><H2
							id="guest-room-heading"
							class="text-4xl font-light sm:text-5xl"
						>
							A small sign.<Br />A considerate message.
						</H2><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Give guests a clear way to request privacy or housekeeping. Use both sides for
							complementary messages, with your property identity carried across the design.
						</P><P
							class="mt-6 text-sm font-medium text-primary-600 dark:text-primary-300"
							aria-live="polite"
						>
							{isDoorBack ? 'Service request / Reverse' : 'Privacy message / Front'}
						</P><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Door-hanger projects can also start with a breakfast request, a pet-in-room notice, or
							a maintenance message. Bring the wording and handle fit your property needs.
						</P><P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
							Illustrative shape and artwork. Share your required opening, dimensions, and supplied
							messaging.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Div>
