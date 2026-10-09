<script lang="ts">
	// Imports
	import {
		A,
		BentoItem,
		Button,
		Card,
		Container,
		Dialog,
		Div,
		H2,
		H3,
		P,
		Section,
		Skeleton,
		Span,
		StockColorContent,
		StockColorMarquee,
		StockTag,
		StockTagExamples
	} from '#lib/components';
	import { ArrowRight, X } from '#lib/icons';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { onMount, tick } from 'svelte';
	import { stockColors } from './stockColors';

	// Types
	type Topic = {
		columns: 'full' | 'third' | 'wide';
		description: string;
		id: string;
		preview: 'fan' | 'print' | 'layers' | 'shape' | 'feed' | 'sequence';
		title: string;
	};

	// consts
	const columnClasses = {
		full: 'sm:col-span-2 lg:col-span-6',
		third: 'lg:col-span-2',
		wide: 'sm:col-span-2 lg:col-span-4'
	};
	const detailSections = ['Options at a glance', 'Examples & applications', 'Planning your order'];
	const topics: Topic[] = [
		{
			id: 'colors',
			title: 'What color will you choose?',
			description: 'Explore stock tag colors.',
			preview: 'fan',
			columns: 'wide'
		},
		{
			id: 'printing',
			title: 'Make your mark.',
			description: 'Explore custom printing.',
			preview: 'print',
			columns: 'third'
		},
		{
			id: 'materials',
			title: 'The right material for the job.',
			description: 'Explore paper and synthetic options.',
			preview: 'layers',
			columns: 'third'
		},
		{
			id: 'shapes',
			title: 'A shape that fits.',
			description: 'Explore sizes, shapes, and details.',
			preview: 'shape',
			columns: 'third'
		},
		{
			id: 'formats',
			title: 'Ready for your workflow.',
			description: 'Explore single, continuous, and roll formats.',
			preview: 'feed',
			columns: 'third'
		},
		{
			id: 'numbering',
			title: 'Keep every number in order.',
			description: 'Explore consecutive numbering.',
			preview: 'sequence',
			columns: 'full'
		}
	];

	// helpers
	const closeDialog = () => {
		isDialogVisible = false;
	};
	const initializeMotion = () => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			isReducedMotion = preference.matches;
		};
		const updateViewport = () => {
			viewportHeight = window.innerHeight;
		};
		updatePreference();
		updateViewport();
		preference.addEventListener('change', updatePreference);
		window.addEventListener('resize', updateViewport);
		return () => {
			preference.removeEventListener('change', updatePreference);
			window.removeEventListener('resize', updateViewport);
		};
	};
	const openDialog = async (topic: Topic) => {
		isCardVisible = false;
		selectedTopic = topic;
		isDialogVisible = true;
		// Mount the overlay first so Card's local visibility transition runs on every opening.
		await tick();
		isCardVisible = true;
		await tick();
		// Focusing a translated card must not scroll the overlay to its animated position.
		dialogElement
			?.querySelector<HTMLButtonElement>('[data-bento-close]')
			?.focus({ preventScroll: true });
	};
	onMount(initializeMotion);

	// $state
	let dialogElement = $state<HTMLDialogElement | null>(null);
	let isCardVisible = $state(false);
	let isDialogVisible = $state(false);
	let isReducedMotion = $state(true);
	let selectedTopic = $state<Topic | null>(null);
	let viewportHeight = $state(800);

	// $effects
	$effect(() => {
		// Keep the page locked through the exit transition, until Dialog removes its element.
		if (!dialogElement) return;
		const root = document.documentElement;
		const isAlreadyLocked = root.classList.contains('overflow-hidden');
		root.classList.add('overflow-hidden');
		return () => {
			if (!isAlreadyLocked) root.classList.remove('overflow-hidden');
		};
	});
</script>

{#snippet preview(kind: Topic['preview'], isDialogPreview = false)}
	<Div variants={[isDialogPreview ? 'bentoDialogPreview' : 'bentoPreview']} aria-hidden="true">
		{#if kind === 'fan'}
			<Div variants={['stockFan']} data-stock-fan>
				{#each stockColors as color (color.id)}
					<Div variants={['stockFanTag']} class={color.fanClass} data-stock-color={color.id}>
						<StockTag class={color.className} />
					</Div>
				{/each}
			</Div>
		{:else if kind === 'print'}
			<Skeleton variants={['bentoTag']}>
				<Div
					class="absolute inset-x-4 top-16 space-y-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1"
				>
					<Skeleton variants={['bento']} class="h-3 w-full bg-gray-400 dark:bg-gray-500" />
					<Skeleton variants={['bento']} class="h-3 w-3/4 bg-gray-400 dark:bg-gray-500" />
					<Skeleton variants={['bento']} class="h-12 w-full bg-gray-400 dark:bg-gray-500" />
				</Div>
			</Skeleton>
		{:else if kind === 'layers'}
			<Skeleton variants={['bentoLayer', 'layerBack']} />
			<Skeleton variants={['bentoLayer', 'layerMiddle']} />
			<Skeleton variants={['bentoLayer']} />
		{:else if kind === 'shape'}
			<Div class="rounded-sm p-6 inset-ring-1 inset-ring-gray-300 dark:inset-ring-gray-600">
				<Skeleton
					variants={['bentoTag']}
					class="relative motion-safe:group-hover:rotate-3 motion-safe:group-focus-visible:rotate-3"
				/>
			</Div>
		{:else if kind === 'feed'}
			<Div
				class="flex gap-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-4 motion-safe:group-focus-visible:translate-x-4"
			>
				{#each [0, 1, 2, 3] as tag (tag)}
					<Skeleton variants={['bentoTag']} class="relative shrink-0" />
				{/each}
			</Div>
		{:else}
			<Div
				class="flex flex-col gap-3 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-2 motion-safe:group-focus-visible:-translate-y-2"
			>
				{#each ['001', '002', '003'] as number (number)}
					<Skeleton variants={['bento']} class="flex h-16 w-56 items-center justify-between px-6">
						<Skeleton variants={['bento']} class="h-2 w-12 bg-gray-400 dark:bg-gray-500" />
						<Span class="font-mono text-xs text-gray-600 dark:text-gray-300">{number}</Span>
					</Skeleton>
				{/each}
			</Div>
		{/if}
	</Div>
{/snippet}

<Section
	id="possibilities"
	variants={['surface']}
	aria-label="Tag and label options"
	data-bento-section
>
	<Container variants={['section']}>
		<!-- <P variants={['eyebrow']}>Explore the possibilities</P>
		<H2 id="bento-heading" variants={['section']}>Your tag. Every detail.</H2>
		<P class="mt-4 max-w-xl text-gray-600 dark:text-gray-300"
			>A first look at the options. Open a topic to explore its content preview.</P
		> -->
		<Div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
			{#each topics as topic (topic.id)}
				<BentoItem
					class={columnClasses[topic.columns]}
					title={topic.title}
					aria-label={`Explore ${topic.title}`}
					aria-haspopup="dialog"
					data-bento-topic={topic.id}
					onclick={() => openDialog(topic)}
				>
					{@render preview(topic.preview)}
				</BentoItem>
			{/each}
		</Div>
	</Container>
</Section>

<Dialog
	bind:element={dialogElement}
	bind:isVisible={isDialogVisible}
	variants={['bento']}
	inTransition={[fade, { duration: isReducedMotion ? 0 : 200 }]}
	outTransition={[fade, { duration: isReducedMotion ? 0 : 250 }]}
	aria-labelledby="bento-dialog-heading"
	aria-describedby="bento-dialog-description"
	data-bento-dialog
>
	{#if selectedTopic}
		<Container class="py-8 sm:py-16">
			<Card
				isVisible={isCardVisible}
				class="px-6 py-0 sm:px-8 lg:px-16"
				data-bento-card
				inTransition={[
					fly,
					{ y: viewportHeight, duration: isReducedMotion ? 0 : 500, easing: cubicOut }
				]}
				outTransition={[
					fly,
					{ y: viewportHeight, duration: isReducedMotion ? 0 : 250, easing: cubicIn }
				]}
			>
				<Div variants={['bentoDialogHeader']}>
					<Button
						type="button"
						variants={['neutral', 'icon']}
						aria-label="Close topic"
						onclick={closeDialog}
						data-bento-close><X class="size-5" aria-hidden="true" /></Button
					>
				</Div>
				<Div class="pt-12 sm:pt-20">
					<P variants={['eyebrow']}
						>{selectedTopic.id === 'colors' ? 'Stock tag colors' : 'Content preview'}</P
					>
					<H2 id="bento-dialog-heading" variants={['section']}>{selectedTopic.title}</H2>
					<P
						id="bento-dialog-description"
						class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300"
						>{#if selectedTopic.id === 'colors'}
							Make the next step easy to spot. Use color to distinguish a process, organize a
							collection, or give your tags a look of their own.
						{:else}This is a layout preview for {selectedTopic.description
								.toLowerCase()
								.replace(/^explore /, '')
								.replace(/\.$/, '')}. Product details, examples, and artwork will be added here.{/if}</P
					>
					{#if selectedTopic.id === 'colors'}
						<Div variants={['dialogBleed']} class="my-12">
							<StockColorMarquee />
						</Div>
					{:else}
						<Div variants={['dialogArtwork']}>
							{@render preview(selectedTopic.preview, true)}
						</Div>
					{/if}
					{#if selectedTopic.id === 'colors'}
						<Section
							variants={['dialogSection']}
							aria-labelledby="stock-examples-heading"
							data-color-section="examples"
						>
							<H3 id="stock-examples-heading" class="text-3xl sm:text-4xl"
								>Color, out in the world.</H3
							>
							<P variants={['dialogBody']} class="mt-4"
								>Illustrative examples of stock colors at work, from the parts shelf to the service
								bench.</P
							>
							<Div variants={['dialogBleed']} class="mt-8">
								<StockTagExamples />
							</Div>
						</Section>
						<StockColorContent />
					{:else}
						{#each detailSections as title, index (title)}
							<Section
								aria-labelledby={`bento-detail-${index}`}
								variants={['dialogSection']}
								class="grid gap-8 lg:grid-cols-2 lg:gap-16"
							>
								<Div class="space-y-6">
									<H3 id={`bento-detail-${index}`} class="text-2xl font-medium tracking-tight"
										>{title}</H3
									>
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
					{#if selectedTopic.id !== 'colors'}
						<Section
							variants={['dialogSection']}
							class="flex flex-wrap items-center gap-4"
							aria-label="Discuss this topic"
						>
							<A
								href={`mailto:sales@abtl.com?subject=${encodeURIComponent(selectedTopic.title)}`}
								variants={['button.base']}
								>Discuss your project
								<ArrowRight class="size-4" aria-hidden="true" /></A
							>
							<Button variants={['ghost']} onclick={closeDialog}>Back to possibilities</Button>
						</Section>
					{/if}
				</Div>
			</Card>
		</Container>
	{/if}
</Dialog>
