<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Br,
		Button,
		Container,
		Div,
		H2,
		H3,
		P,
		Section,
		Span
	} from '#lib/components';
	import { Check, Mail } from '#lib/icons';
	import { ContentLayout } from '#lib/layouts';
	import DataApplications from './DataApplications.svelte';
	import DataFormats from './DataFormats.svelte';
	import DataPlanning from './DataPlanning.svelte';
	import { fade } from 'svelte/transition';
	import { MediaQuery } from 'svelte/reactivity';
	import type { Snippet } from 'svelte';
	import { ticketExamples } from './ticketExamples';
	import { twMerge } from 'tailwind-merge';
	import VariableDataTag from './VariableDataTag.svelte';

	// consts
	const dataArtworkClass =
		'rounded-sm bg-gradient-to-br from-primary-100 via-gray-100 to-secondary-100 dark:from-primary-950 dark:via-gray-900 dark:to-secondary-950';
	const motionPreference = new MediaQuery('(prefers-reduced-motion: reduce)', true);

	// $props()
	let { introduction, isStandalone = false }: { introduction: Snippet; isStandalone?: boolean } =
		$props();

	// $state
	let selectedTicketIndex = $state(0);

	// $derived
	const selectedTicket = $derived(ticketExamples[selectedTicketIndex]);
</script>

{#snippet constrained(children: Snippet, index: number)}
	{#if isStandalone}
		<Section variants={[index % 2 === 0 ? 'surfaceAlternate' : 'surface']}>
			<Container>{@render children()}</Container>
		</Section>
	{:else}{@render children()}{/if}
{/snippet}

{#snippet studio()}
	<Section
		variants={['dialogSection']}
		data-variable-section="studio"
		aria-labelledby="variable-studio-heading"
	>
		<Div class="grid items-center gap-4 lg:grid-cols-2">
			<Div>
				<P variants={['eyebrow']}>Variable data printing</P>
				<H3 id="variable-studio-heading" class="text-4xl sm:text-5xl">
					The design stays.<Br />The information moves.
				</H3>
				<P variants={['dialogBody']} class="mt-6">
					One tag. A set of matching references. Print a name and number, then carry that reference
					across each detachable section in text and Data Matrix form.
				</P>
				<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
					Choose a sample record to see the printed information change.
				</P>
				<Div class="mt-6 space-y-2" role="group" aria-label="Sample data records">
					{#each ticketExamples as record, index (record.reference)}
						<Button
							variants={[...(selectedTicketIndex === index ? ['selected'] : [])]}
							class="flex w-full items-center justify-between gap-3 rounded-sm bg-white px-4 py-4 text-left text-gray-950 inset-ring-1 inset-ring-gray-200 hover:bg-primary-50 hover:text-gray-950 focus:bg-primary-50 focus:text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:inset-ring-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
							aria-label={`Sample ${record.number}, reference ${record.reference}`}
							aria-pressed={selectedTicketIndex === index}
							onclick={() => (selectedTicketIndex = index)}
						>
							<Span class="font-mono text-xs sm:text-sm">{record.number}</Span>
							<Span class="min-w-0 flex-1 text-sm">
								{record.reference}
							</Span>
							<Check
								class={twMerge(
									'size-4 shrink-0',
									selectedTicketIndex === index ? 'opacity-100' : 'opacity-0'
								)}
								aria-hidden="true"
							/>
						</Button>
					{/each}
				</Div>
			</Div>
			<Div
				class={twMerge(
					dataArtworkClass,
					'flex min-h-128 flex-col items-center justify-center gap-8 p-6 sm:p-10'
				)}
			>
				<Div
					class="flex min-h-112 w-full items-center justify-center"
					aria-live="polite"
					aria-atomic="true"
				>
					{#key selectedTicket.reference}
						<Div
							inTransition={[fade, { duration: motionPreference.current ? 0 : 180 }]}
							class="w-44 sm:w-48"
							data-variable-output
						>
							<VariableDataTag record={selectedTicket} />
						</Div>
					{/key}
				</Div>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet applications()}<DataApplications record={selectedTicket} />{/snippet}
{#snippet formats()}<DataFormats record={selectedTicket} />{/snippet}
{#snippet planning()}<DataPlanning />{/snippet}

{#snippet callToAction()}
	<Div><Mail class="size-8" aria-hidden="true" /></Div>
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		Your data. Your next project.
	</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		What changes on your next run?
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Tell us what stays the same, what changes, and how your tags or labels will be used. We'll work
		through the printing details with you.
	</P>
	<A
		variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
		href="mailto:sales@abtl.com?subject=Variable%20data%20printing&body=Tags%20or%20labels%3A%0AFields%20that%20change%3A%0ACodes%20or%20numbering%3A%0AQuantity%3A%0AHow%20they%20will%20be%20used%3A"
	>
		<ActionLabel>Plan your variable data project</ActionLabel>
	</A>
{/snippet}

<Div data-variable-content>
	<ContentLayout
		callToActionAttributes={{ 'data-variable-section': 'contact' }}
		{callToAction}
		{introduction}
		{isStandalone}
	>
		{@render constrained(studio, 0)}
		{@render constrained(applications, 1)}
		{@render constrained(formats, 2)}
		{@render constrained(planning, 3)}
	</ContentLayout>
</Div>
