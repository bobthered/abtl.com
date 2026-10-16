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
		ProcessArtwork,
		Section,
		Span
	} from '#lib/components';
	import { Check, FlipHorizontal2, Layers, RotateCcw } from '#lib/icons';
	import { ContentLayout } from '#lib/layouts';
	import { floatIllustration } from '#lib/attachments';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// consts
	const inks = [
		{ code: 'C', color: 'bg-process-cyan', name: 'Cyan' },
		{ code: 'M', color: 'bg-process-magenta', name: 'Magenta' },
		{ code: 'Y', color: 'bg-process-yellow', name: 'Yellow' },
		{ code: 'K', color: 'bg-process-black', name: 'Black' }
	];

	// helpers
	const restoreInks = () => {
		isCyan = true;
		isMagenta = true;
		isYellow = true;
		isBlack = true;
	};
	const toggleInk = (index: number) => {
		if (index === 0) isCyan = !isCyan;
		else if (index === 1) isMagenta = !isMagenta;
		else if (index === 2) isYellow = !isYellow;
		else isBlack = !isBlack;
	};

	// $props()
	let { introduction, isStandalone = false }: { introduction: Snippet; isStandalone?: boolean } =
		$props();

	// $state
	let isBack = $state(false);
	let isBlack = $state(true);
	let isCyan = $state(true);
	let isMagenta = $state(true);
	let isSeparated = $state(true);
	let isYellow = $state(true);

	// $derived
	const channels = $derived(
		[isCyan, isMagenta, isYellow, isBlack].map((isEnabled) => (isEnabled ? '1' : '0')).join('')
	);
	const enabledCount = $derived(
		[isCyan, isMagenta, isYellow, isBlack].filter((isEnabled) => isEnabled).length
	);
</script>

{#snippet constrained(children: Snippet, index: number)}
	{#if isStandalone}
		<Section variants={[index % 2 === 0 ? 'surfaceAlternate' : 'surface']}>
			<Container>{@render children()}</Container>
		</Section>
	{:else}{@render children()}{/if}
{/snippet}

{#snippet process()}
	<Section
		variants={['dialogSection']}
		data-process-section="process"
		aria-labelledby="process-heading"
	>
		<Div class="grid items-center gap-4 lg:grid-cols-5">
			<Div class="lg:col-span-2">
				<P variants={['eyebrow']}>Design study / A premium product hangtag</P>
				<H3 id="process-heading" class="text-4xl sm:text-5xl">
					A first impression<Br />worth keeping.
				</H3>
				<P variants={['dialogBody']} class="mt-6">
					Imagine a home-fragrance collection on a boutique shelf. Before the customer opens the
					box, the hangtag sets the mood: warm citrus, deep botanical greens, and quiet, considered
					typography. The tag becomes part of the product experience.
				</P>
				<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
					Four-color process brings that illustration to print using cyan, magenta, yellow, and
					black. Explore each ink, then align the layers to reveal the finished design.
				</P>
				<Div class="mt-8 grid grid-cols-2 gap-4" role="group" aria-label="Process ink channels">
					{#each inks as ink, index (ink.code)}
						<Button
							variants={['neutral', ...(channels[index] === '1' ? ['selected'] : [])]}
							class="justify-start gap-3"
							aria-pressed={channels[index] === '1'}
							onclick={() => toggleInk(index)}
							data-process-ink={ink.code}
						>
							<Span
								class={twMerge(
									'size-6 shrink-0 rounded-full inset-ring-1 inset-ring-gray-950/10',
									ink.color
								)}
								aria-hidden="true"
							/>
							<Span class="flex-1 text-left">{ink.name}</Span>
							<Check
								class={twMerge('size-4', channels[index] === '1' ? 'opacity-100' : 'opacity-0')}
								aria-hidden="true"
							/>
						</Button>
					{/each}
				</Div>
				<Div class="mt-6 flex flex-wrap gap-3">
					<Button
						onclick={() => (isSeparated = !isSeparated)}
						aria-pressed={!isSeparated}
						data-process-register
					>
						<Layers class="size-4" aria-hidden="true" />{isSeparated
							? 'Bring colors together'
							: 'Separate the colors'}
					</Button>
					<Button variants={['ghost']} onclick={restoreInks}>
						<RotateCcw class="size-4" aria-hidden="true" />All four inks
					</Button>
				</Div>
			</Div>
			<Div variants={['illustration']} data-illustration-surface class="p-6 sm:p-8 lg:col-span-3">
				<Div {@attach floatIllustration}>
					<ProcessArtwork
						class="min-h-112 sm:min-h-128"
						isBackdropVisible={false}
						{channels}
						{isSeparated}
					/>
				</Div>
				<Div
					class="flex items-center justify-between gap-4 px-2 pb-2 text-xs text-gray-500 dark:text-gray-400"
				>
					<Span aria-live="polite" data-process-count>{enabledCount} of 4 inks active</Span>
					<Span>
						{isSeparated ? 'Layers separated' : 'Layers aligned'}
					</Span>
				</Div>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet sides()}
	<Section
		variants={['dialogSection']}
		data-process-section="sides"
		aria-labelledby="process-sides-heading"
	>
		<Div class="grid items-center gap-4 lg:grid-cols-5">
			<Div class="lg:col-span-2">
				<P variants={['eyebrow']}>Up to eight total colors</P>
				<H3 id="process-sides-heading" class="text-4xl sm:text-5xl">
					A beautiful front.<Br />A useful back.
				</H3>
				<P variants={['dialogBody']} class="mt-6">
					Let the face draw someone in. Let the back tell them more: the fragrance story, a
					collection detail, or a thoughtful message. Both sides can feel like one considered
					design. Our eight-color capability supports CMYK on the face and CMYK on the back.
				</P>
				<Div class="mt-8 grid grid-cols-2 gap-4">
					<Div class="rounded-sm bg-gray-100 p-5 dark:bg-gray-900">
						<P class="text-5xl font-light">4</P>
						<P class="mt-3 text-sm font-medium">Face / CMYK</P>
						<Div class="mt-4 flex gap-1" aria-hidden="true">
							{#each inks as ink (ink.code)}
								<Span class={twMerge('h-2 flex-1 rounded-sm', ink.color)} />
							{/each}
						</Div>
					</Div>
					<Div class="rounded-sm bg-gray-100 p-5 dark:bg-gray-900">
						<P class="text-5xl font-light">4</P>
						<P class="mt-3 text-sm font-medium">Back / CMYK</P>
						<Div class="mt-4 flex gap-1" aria-hidden="true">
							{#each inks as ink (ink.code)}
								<Span class={twMerge('h-2 flex-1 rounded-sm', ink.color)} />
							{/each}
						</Div>
					</Div>
				</Div>
			</Div>
			<Div variants={['illustration']} data-illustration-surface class="p-6 sm:p-8 lg:col-span-3">
				<Div class="flex items-center justify-between gap-4">
					<Span class="text-sm font-medium" aria-live="polite" data-process-side>
						{isBack ? 'Back / The fragrance story' : 'Face / The botanical collection'}
					</Span>
					<Span class="font-mono text-xs text-gray-500 dark:text-gray-400">4 + 4 = 8</Span>
				</Div>
				<Div {@attach floatIllustration}>
					<ProcessArtwork
						class="min-h-112 sm:min-h-128"
						isBackdropVisible={false}
						{isBack}
						isDuplex
					/>
				</Div>
				<Div class="flex justify-center">
					<Button
						variants={['neutral-outline']}
						onclick={() => (isBack = !isBack)}
						aria-pressed={isBack}
						data-process-flip
					>
						<FlipHorizontal2 class="size-5 rotate-90" aria-hidden="true" />{isBack
							? 'View the face'
							: 'Turn it over'}
					</Button>
				</Div>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet callToAction()}
	<Div><Layers class="size-8" aria-hidden="true" /></Div>
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">
		Four-color process. Eight-color capability.
	</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Your product has a story.<Br />Give it a tag to match.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		Start with your artwork, the stock you have in mind, and the quantity you need. Tell us what
		belongs on each side. We'll help plan the full-color printing for your tags or labels.
	</P>
	<Div class="grid w-full max-w-3xl gap-4 py-4 text-left sm:grid-cols-3">
		{#each [{ title: 'The artwork', text: 'Illustration, photography, or a mix. Share the look you want to achieve.' }, { title: 'The printed piece', text: 'Tags or labels, stock, size, and quantity. Let the application guide the choices.' }, { title: 'Both sides', text: 'Plan the image and information together, with up to eight total printing colors.' }] as detail (detail.title)}
			<Div>
				<H3 class="text-lg">{detail.title}</H3>
				<P class="mt-3 text-sm text-gray-300 dark:text-gray-600">
					{detail.text}
				</P>
			</Div>
		{/each}
	</Div>
	<A
		variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
		href="mailto:sales@abtl.com?subject=Full-color%20printing%20project&body=Tags%20or%20labels%3A%0AQuantity%3A%0AFace%20artwork%3A%0ABack%20artwork%3A%0AStock%20or%20application%3A"
	>
		<ActionLabel>Plan your full-color project</ActionLabel>
	</A>
{/snippet}

<Div data-process-content>
	<ContentLayout
		callToActionAttributes={{ 'data-process-section': 'contact' }}
		{callToAction}
		{introduction}
		{isStandalone}
	>
		{@render constrained(process, 0)}
		{@render constrained(sides, 1)}
	</ContentLayout>
</Div>
