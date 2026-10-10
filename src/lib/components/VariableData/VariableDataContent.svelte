<script lang="ts">
	// Imports
	import {
		A,
		Br,
		Button,
		Container,
		Div,
		H3,
		Img,
		P,
		Section,
		Span,
		VariableDataPiece
	} from '#lib/components';
	import { ArrowDown, ArrowRight, Check, Database, Mail, ScanLine } from '#lib/icons';
	import { fade } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';
	import type { Snippet } from 'svelte';
	import { variableExamples } from './examples';

	// consts
	const motionPreference = new MediaQuery('(prefers-reduced-motion: reduce)', true);

	// helpers
	const advanceRecord = () => {
		selectedIndex = (selectedIndex + 1) % variableExamples.length;
	};

	// $props()
	let { isStandalone = false }: { isStandalone?: boolean } = $props();

	// $state
	let isLabel = $state(false);
	let mailingIndex = $state(0);
	let selectedIndex = $state(0);

	// $derived
	const mailingRecord = $derived(variableExamples[mailingIndex]);
	const selectedRecord = $derived(variableExamples[selectedIndex]);
</script>

{#snippet constrained(children: Snippet)}
	{#if isStandalone}<Container>{@render children()}</Container>{:else}{@render children()}{/if}
{/snippet}

{#snippet studio()}
	<Section
		variants={['dialogSection']}
		data-variable-section="studio"
		aria-labelledby="variable-studio-heading"
	>
		<Div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<Div>
				<P variants={['eyebrow']}>Variable data printing</P>
				<H3 id="variable-studio-heading" class="text-4xl sm:text-5xl"
					>The design stays.<Br />The information moves.</H3
				>
				<P variants={['dialogBody']} class="mt-6"
					>A different asset. A different destination. A different person. We print tags and labels
					with changing barcodes, QR codes, sequential numbers, and personalized details—so each
					piece carries the information it needs.</P
				>
				<P class="mt-6 text-sm text-gray-500 dark:text-gray-400"
					>Choose a sample record to see the printed information change.</P
				>
				<Div class="mt-6 space-y-2" role="group" aria-label="Sample data records">
					{#each variableExamples as record, index (record.id)}
						<Button
							variants={['dataRecord', ...(selectedIndex === index ? ['stockSwatchSelected'] : [])]}
							aria-pressed={selectedIndex === index}
							onclick={() => (selectedIndex = index)}
						>
							<Span class="font-mono text-xs sm:text-sm">{record.id}</Span><Span
								class="min-w-0 flex-1 text-sm">{record.item}</Span
							><Check
								class={`size-4 shrink-0 ${selectedIndex === index ? 'opacity-100' : 'opacity-0'}`}
								aria-hidden="true"
							/>
						</Button>
					{/each}
				</Div>
			</Div>
			<Div
				variants={['dataArtwork']}
				class="flex min-h-128 flex-col items-center justify-center gap-8 p-6 sm:p-10"
			>
				<Div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Printed format">
					<Button
						variants={['neutral', ...(!isLabel ? ['stockSwatchSelected'] : [])]}
						aria-pressed={!isLabel}
						onclick={() => (isLabel = false)}>Tag</Button
					>
					<Button
						variants={['neutral', ...(isLabel ? ['stockSwatchSelected'] : [])]}
						aria-pressed={isLabel}
						onclick={() => (isLabel = true)}>Label</Button
					>
				</Div>
				<Div
					class="flex min-h-112 w-full items-center justify-center"
					aria-live="polite"
					aria-atomic="true"
				>
					{#key `${selectedRecord.id}-${isLabel}`}
						<Div
							inTransition={[fade, { duration: motionPreference.current ? 0 : 180 }]}
							class={isLabel ? 'w-full max-w-80' : 'w-56'}
							data-variable-output
						>
							<VariableDataPiece record={selectedRecord} {isLabel} />
						</Div>
					{/key}
				</Div>
				<P class="max-w-sm text-center text-xs leading-relaxed text-gray-600 dark:text-gray-300"
					>Illustrative records and layouts. Both codes contain the displayed sample ID; they do not
					link to a live asset database.</P
				>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet sequence()}
	<Section
		variants={['dialogSection']}
		data-variable-section="sequence"
		aria-labelledby="variable-sequence-heading"
	>
		<Div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<Div variants={['dataArtwork']} class="order-2 overflow-hidden p-6 sm:p-10 lg:order-1">
				<Div class="mb-8 flex items-center justify-between text-primary-600 dark:text-primary-300"
					><Database class="size-6" aria-hidden="true" /><Span class="font-mono text-xs"
						>RECORD → PRINTED PIECE</Span
					></Div
				>
				<Div class="space-y-3" aria-hidden="true">
					{#each variableExamples as record, index (record.id)}
						<Div
							class={`flex items-center gap-4 rounded-sm p-4 inset-ring-1 motion-safe:transition-all motion-safe:duration-500 ${selectedIndex === index ? 'translate-x-2 bg-primary-500 text-white inset-ring-primary-500' : 'bg-white/70 text-gray-500 inset-ring-gray-200 dark:bg-gray-950/70 dark:text-gray-400 dark:inset-ring-gray-800'}`}
						>
							<Span class="font-mono text-xl tabular-nums sm:text-2xl">{record.id.slice(3)}</Span
							><ArrowRight class="size-4 shrink-0" /><Img
								src={record.barcode}
								alt=""
								class="h-10 min-w-0 flex-1 rounded-sm bg-white object-fill"
								width={242}
								height={100}
							/>
						</Div>
					{/each}
				</Div>
				<Button class="mt-8 w-full" variants={['neutral']} onclick={advanceRecord}
					>Print the next record <ArrowRight class="size-4" aria-hidden="true" /></Button
				>
			</Div>
			<Div class="order-1 lg:order-2">
				<P variants={['eyebrow']}>Barcodes · QR codes · Sequential numbering</P>
				<H3 id="variable-sequence-heading" class="text-4xl sm:text-5xl"
					>A number to read.<Br />A code to scan.</H3
				>
				<P variants={['dialogBody']} class="mt-6"
					>Put the identifier in plain sight, in a barcode, or in a QR code. Sequential numbering
					gives each piece its place in the run. Variable codes give your scanner a way to read the
					information printed on it.</P
				>
				<Div class="mt-8 grid gap-6 sm:grid-cols-2">
					<Div
						><ScanLine class="mb-3 size-6 text-primary-500" aria-hidden="true" /><P
							class="font-medium">Built around your data</P
						><P class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
							>Asset IDs, reference numbers, or other changing fields from your project.</P
						></Div
					>
					<Div
						><ArrowDown class="mb-3 size-6 text-secondary-500" aria-hidden="true" /><P
							class="font-medium">One record at a time</P
						><P class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
							>Explore the sample sequence. Each selection updates the corresponding tag or label
							above.</P
						></Div
					>
				</Div>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet mailing()}
	<Section
		variants={['dialogSection']}
		data-variable-section="mailing"
		aria-labelledby="variable-mailing-heading"
	>
		<Div class="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
			<Div class="lg:col-span-2">
				<P variants={['eyebrow']}>Personalization for mailings</P>
				<H3 id="variable-mailing-heading" class="text-4xl sm:text-5xl"
					>Make it personal.<Br />Piece by piece.</H3
				>
				<P variants={['dialogBody']} class="mt-6"
					>Your message can stay consistent while names, addresses, and other details change. Bring
					a personal touch to your mailing with tags and labels printed for each recipient.</P
				>
				<Button
					variants={['neutral']}
					class="mt-8"
					onclick={() => (mailingIndex = (mailingIndex + 1) % variableExamples.length)}
					>Meet the next recipient <ArrowRight class="size-4" aria-hidden="true" /></Button
				>
			</Div>
			<Div
				variants={['dataArtwork']}
				class="relative flex min-h-112 items-center justify-center overflow-hidden p-6 sm:p-12 lg:col-span-3"
			>
				<Div
					class="absolute inset-x-6 top-12 bottom-12 rotate-6 rounded-sm bg-secondary-200/70 sm:inset-x-12 dark:bg-secondary-900/60"
					aria-hidden="true"
				/>
				<Div class="relative w-full max-w-80 -rotate-3" aria-live="polite" aria-atomic="true">
					{#key mailingRecord.id}<Div
							inTransition={[fade, { duration: motionPreference.current ? 0 : 220 }]}
							><VariableDataPiece record={mailingRecord} isLabel isMailing /></Div
						>{/key}
				</Div>
				<Span class="absolute right-6 bottom-4 text-xs text-gray-600 dark:text-gray-300"
					>Fictional recipient · Illustrative layout</Span
				>
			</Div>
		</Div>
	</Section>
{/snippet}

<Div data-variable-content>
	{@render constrained(studio)}
	{@render constrained(sequence)}
	{@render constrained(mailing)}
	<Section
		variants={['sampleInvitation']}
		class={isStandalone ? '' : '-mx-6 sm:-mx-8 lg:-mx-16'}
		data-variable-section="contact"
	>
		<Container class="flex flex-col items-center gap-6">
			<Div><Mail class="size-8" aria-hidden="true" /></Div>
			<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600"
				>Your data. Your next project.</P
			>
			<H3 class="max-w-2xl text-4xl sm:text-5xl">What changes on your next run?</H3>
			<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600"
				>Tell us what stays the same, what changes, and how your tags or labels will be used. We'll
				work through the printing details with you.</P
			>
			<A
				variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
				href="mailto:sales@abtl.com?subject=Variable%20data%20printing&body=Tags%20or%20labels%3A%0AFields%20that%20change%3A%0ACodes%20or%20numbering%3A%0AQuantity%3A%0AHow%20they%20will%20be%20used%3A"
				>Plan your variable data project <ArrowRight class="size-5" aria-hidden="true" /></A
			>
		</Container>
	</Section>
</Div>
