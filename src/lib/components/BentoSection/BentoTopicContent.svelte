<script lang="ts">
	// Imports
	import {
		A,
		BentoPreview,
		Button,
		Container,
		Div,
		H1,
		H2,
		H3,
		P,
		Section,
		Skeleton,
		StockColorContent,
		StockColorMarquee,
		StockTagExamples
	} from '#lib/components';
	import { ArrowRight } from '#lib/icons';
	import type { Snippet } from 'svelte';
	import type { Topic } from './topics';

	// consts
	const detailSections = ['Options at a glance', 'Examples & applications', 'Planning your order'];

	// $props()
	let {
		isStandalone = false,
		onClose,
		topic
	}: { isStandalone?: boolean; onClose?: () => void; topic: Topic } = $props();
</script>

{#snippet constrained(children: Snippet)}
	{#if isStandalone && topic.id === 'colors'}
		<Container>{@render children()}</Container>
	{:else}
		{@render children()}
	{/if}
{/snippet}

{#snippet introduction()}
	<P variants={['eyebrow']}>{topic.id === 'colors' ? 'Stock tag colors' : 'Content preview'}</P>
	{#if isStandalone}
		<H1 id="bento-dialog-heading" variants={['h2.variant.section']}>{topic.title}</H1>
	{:else}
		<H2 id="bento-dialog-heading" variants={['section']}>{topic.title}</H2>
	{/if}
	<P id="bento-dialog-description" class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300"
		>{#if topic.id === 'colors'}
			Make the next step easy to spot. Use color to distinguish a process, organize a collection, or
			give your tags a look of their own.
		{:else}This is a layout preview for {topic.description
				.toLowerCase()
				.replace(/^explore /, '')
				.replace(/\.$/, '')}. Product details, examples, and artwork will be added here.{/if}</P
	>
{/snippet}

{#snippet examplesIntroduction()}
	<H3 id="stock-examples-heading" class="text-3xl sm:text-4xl">Color, out in the world.</H3>
	<P variants={['dialogBody']} class="mt-4"
		>Illustrative examples of stock colors at work, from the parts shelf to the service bench.</P
	>
{/snippet}

{#snippet colorDetails()}<StockColorContent />{/snippet}

<Div class={isStandalone ? (topic.id === 'colors' ? 'py-20 lg:py-28' : '') : 'pt-12 sm:pt-20'}>
	{@render constrained(introduction)}
	{#if topic.id === 'colors'}
		<Div variants={isStandalone ? [] : ['dialogBleed']} class="my-12 flex min-w-0">
			<StockColorMarquee />
		</Div>
	{:else}
		<Div variants={['dialogArtwork']}>
			<BentoPreview kind={topic.preview} isDialogPreview />
		</Div>
	{/if}
	{#if topic.id === 'colors'}
		<Section
			variants={['dialogSection']}
			aria-labelledby="stock-examples-heading"
			data-color-section="examples"
		>
			{@render constrained(examplesIntroduction)}
			<Div variants={isStandalone ? [] : ['dialogBleed']} class="mt-8 flex min-w-0">
				<StockTagExamples />
			</Div>
		</Section>

		{@render constrained(colorDetails)}
	{:else}
		{#each detailSections as title, index (title)}
			<Section
				aria-labelledby={`bento-detail-${index}`}
				variants={['dialogSection']}
				class="grid gap-8 lg:grid-cols-2 lg:gap-16"
			>
				<Div class="space-y-6">
					<H3 id={`bento-detail-${index}`} class="text-2xl font-medium tracking-tight">{title}</H3>
					{#each [0, 1, 2] as line (line)}
						<Div class="space-y-3" aria-hidden="true"
							><Skeleton variants={['bento']} class="h-3 w-full" /><Skeleton
								variants={['bento']}
								class="h-3 w-5/6"
							/><Skeleton variants={['bento']} class="h-3 w-2/3" /></Div
						>
					{/each}
				</Div>
				<Skeleton variants={['bento']} class="min-h-64 rounded-sm" />
			</Section>
		{/each}
	{/if}
	{#if topic.id !== 'colors'}
		<Section
			variants={['dialogSection']}
			class="flex flex-wrap items-center gap-4"
			aria-label="Discuss this topic"
		>
			<A
				href={`mailto:sales@abtl.com?subject=${encodeURIComponent(topic.title)}`}
				variants={['button.base']}
				>Discuss your project
				<ArrowRight class="size-4" aria-hidden="true" /></A
			>
			{#if onClose}
				<Button variants={['ghost']} onclick={onClose}>Back to possibilities</Button>
			{:else}
				<A href="/#possibilities" variants={['button.base', 'button.variant.ghost']}
					>Back to possibilities</A
				>
			{/if}
		</Section>
	{/if}
</Div>
