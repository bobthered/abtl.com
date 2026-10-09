<script lang="ts">
	// Imports
	import {
		A,
		Blockquote,
		Button,
		Card,
		Details,
		Div,
		Figcaption,
		Figure,
		H3,
		H4,
		Img,
		P,
		Section,
		Skeleton,
		Span,
		StockTag,
		Summary
	} from '#lib/components';
	import { ArrowRight, Check, Quote } from '#lib/icons';
	import inspectionBack from '#lib/assets/tags/backs/inspection-record-01.svg';
	import inspectionFront from '#lib/assets/tags/fronts/inspection-record-01.svg';
	import serviceFront from '#lib/assets/tags/fronts/service-tag-01.svg';
	import { stockColorGroups, stockColors } from './stockColors';

	// consts
	const questions = [
		{
			title: 'Can I compare more than one color?',
			answer:
				'Yes. Select any combination in the palette, then request samples using the button below.'
		},
		{
			title: 'Will the stock look exactly like my screen?',
			answer:
				'Screens and lighting can change how a color appears. Use physical samples when choosing your stock.'
		},
		{
			title: 'What should I include with my request?',
			answer:
				'Tell us the colors you want, your shipping address, and any details about the tags you are planning.'
		}
	];
	const workflow = [
		{
			color: 'blue-light',
			title: 'Receive',
			text: 'Give incoming items a recognizable starting point.'
		},
		{
			color: 'yellow',
			title: 'Review',
			text: 'Make work awaiting a decision easy to distinguish.'
		},
		{
			color: 'green-light',
			title: 'Ready',
			text: 'Keep completed work visually separate from the next batch.'
		}
	];

	// helpers
	const toggleColor = (id: string) => {
		selectedColorIds = selectedColorIds.includes(id)
			? selectedColorIds.filter((selectedId) => selectedId !== id)
			: [...selectedColorIds, id];
	};

	// $state
	let selectedColorIds = $state<string[]>([]);

	// $derived
	// Resolve the selected palette before constructing its sample-request URL.
	const selectedColors = $derived(
		stockColorGroups.flatMap((group) =>
			group.colors.filter((color) => selectedColorIds.includes(color.id))
		)
	);
	const sampleHref = $derived.by(() => {
		const colors = selectedColors.map((color) => color.name).join(', ');
		const body = [
			'Hello Allen-Bailey team,',
			'',
			"I'd like to request stock color samples.",
			'',
			`Requested colors: ${colors || '[List one or more colors]'}`,
			'Name:',
			'Company:',
			'Shipping address:',
			'Project details (optional):'
		].join('\n');
		return `mailto:sales@abtl.com?subject=${encodeURIComponent('Stock color sample request')}&body=${encodeURIComponent(body)}`;
	});
</script>

{#snippet tagImage(id: string, artwork?: string)}
	<Div class="relative w-24 sm:w-32">
		<StockTag class={stockColors.find((color) => color.id === id)?.className} />
		{#if artwork}
			<Img
				src={artwork}
				alt=""
				aria-hidden="true"
				loading="lazy"
				width="237"
				height="474"
				class="absolute inset-0 h-full w-full mix-blend-multiply"
			/>
		{/if}
	</Div>
{/snippet}

<Div data-stock-color-content>
	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-palette-heading"
		data-color-section="palette"
	>
		<P variants={['eyebrow']}>The palette</P>
		<H3 id="stock-palette-heading" variants={['item']}>Find your color.</H3>
		<P variants={['dialogBody']}
			>Tap a color to add it to your sample selection. Choose one or compare several.</P
		>
		<Div class="mt-10 space-y-10">
			{#each stockColorGroups as group (group.id)}
				<Section
					aria-labelledby={`stock-group-${group.id}`}
					data-stock-group={group.id}
					class="border-t border-gray-200 pt-8 first:border-t-0 first:pt-0 dark:border-gray-800"
				>
					<H4 id={`stock-group-${group.id}`} class="mb-4 text-lg font-medium">{group.name}</H4>
					<Div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{#each group.colors as color (color.id)}
							<Button
								type="button"
								variants={[
									'stockSwatch',
									...(selectedColorIds.includes(color.id) ? ['stockSwatchSelected'] : [])
								]}
								aria-pressed={selectedColorIds.includes(color.id)}
								aria-label={`Select ${color.name} for samples`}
								onclick={() => toggleColor(color.id)}
								data-stock-swatch={color.id}
							>
								<StockTag class={`${color.className} w-12`} />
								<Span class="text-sm font-medium">{color.name}</Span>
								{#if selectedColorIds.includes(color.id)}<Check
										class="absolute top-3 right-3 size-4 text-primary-600 dark:text-primary-300"
										aria-hidden="true"
									/>{/if}
							</Button>
						{/each}
					</Div>
				</Section>
			{/each}
		</Div>
		<P class="mt-6 text-sm text-gray-600 dark:text-gray-300" aria-live="polite"
			>{selectedColors.length
				? `${selectedColors.length} ${selectedColors.length === 1 ? 'color' : 'colors'} selected for samples.`
				: 'On-screen colors are a guide. Physical samples help you make the final choice.'}</P
		>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-neutrals-heading"
		data-color-section="neutrals"
	>
		<P variants={['eyebrow']}>A simple starting point</P>
		<H3 id="stock-neutrals-heading" variants={['item']}>Two ways to keep it classic.</H3>
		<Div class="mt-8 grid gap-6 md:grid-cols-2">
			<Card variants={['dialogPanel']}>
				<Div variants={['stockIllustration']} class="bg-gray-100 dark:bg-gray-800"
					>{@render tagImage('white', serviceFront)}</Div
				>
				<H4 class="mt-6 text-xl font-medium">White</H4>
				<P variants={['dialogBody']} class="mt-3"
					>A clean backdrop that puts your printed message in the foreground.</P
				>
			</Card>
			<Card variants={['dialogPanel']}>
				<Div variants={['stockIllustration']} class="bg-tag-manila/20"
					>{@render tagImage('manila', serviceFront)}</Div
				>
				<H4 class="mt-6 text-xl font-medium">Manila</H4>
				<P variants={['dialogBody']} class="mt-3"
					>A warm, familiar stock color for an understated look.</P
				>
			</Card>
		</Div>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-workflow-heading"
		data-color-section="workflow"
	>
		<P variants={['eyebrow']}>Color in context</P>
		<H3 id="stock-workflow-heading" variants={['item']}>Give each step a visual cue.</H3>
		<P variants={['dialogBody']}
			>Build a color system around the way your team works. Here's one possible approach.</P
		>
		<Div class="mt-8 grid gap-6 md:grid-cols-3">
			{#each workflow as step, index (step.title)}
				<Card variants={['dialogPanel']}>
					<Span class="text-sm font-medium text-primary-600 dark:text-primary-300"
						>0{index + 1}</Span
					>
					<Div variants={['stockIllustration']} class="my-6">{@render tagImage(step.color)}</Div>
					<H4 class="text-xl font-medium">{step.title}</H4><P variants={['dialogBody']} class="mt-3"
						>{step.text}</P
					>
				</Card>
			{/each}
		</Div>
		<P class="mt-6 text-sm text-gray-600 dark:text-gray-300"
			>Illustrative workflow. Color meanings should be defined by your team and supported with
			printed text.</P
		>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-ink-heading"
		data-color-section="ink"
	>
		<Div class="grid items-center gap-10 lg:grid-cols-3">
			<Div
				><P variants={['eyebrow']}>Stock + ink</P><H3 id="stock-ink-heading" variants={['item']}
					>The stock is part of the design.</H3
				><P variants={['dialogBody']}
					>Compare the same artwork on different backgrounds. Consider the ink and stock together
					when planning your printed tags.</P
				></Div
			>
			<Figure class="lg:col-span-2">
				<Div
					variants={['stockIllustration']}
					class="gap-6 bg-primary-50 p-8 sm:gap-12 dark:bg-gray-800"
					>{@render tagImage('white', inspectionFront)}{@render tagImage(
						'yellow',
						inspectionFront
					)}</Div
				>
				<Figcaption variants={['dialogCaption']}
					>Supplied inspection artwork on two stock colors. Visual example, not a print proof.</Figcaption
				>
			</Figure>
		</Div>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-fluorescents-heading"
		data-color-section="fluorescents"
	>
		<Div class="text-center"
			><P variants={['eyebrow']}>The bright end of the palette</P><H3
				id="stock-fluorescents-heading"
				variants={['item']}>Five colors that ask to be seen.</H3
			><P variants={['dialogBody']} class="mx-auto"
				>Explore fluorescent green, orange, pink, red, and yellow when your color system calls for a
				bolder distinction.</P
			></Div
		>
		<Div
			class="mt-10 grid grid-cols-5 items-center gap-3 rounded-sm bg-gray-100 px-4 py-10 sm:gap-8 sm:px-10 dark:bg-gray-800"
			aria-hidden="true"
		>
			{#each stockColors.filter( (color) => color.id.startsWith('fluorescent-') ) as color (color.id)}<StockTag
					class={color.className}
				/>{/each}
		</Div>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-artwork-heading"
		data-color-section="artwork"
	>
		<P variants={['eyebrow']}>Front to back</P><H3 id="stock-artwork-heading" variants={['item']}
			>Think beyond the first impression.</H3
		><P variants={['dialogBody']}
			>Plan how information is organized on both sides. These supplied inspection-record designs
			show one way to give each face a purpose.</P
		>
		<Div class="mt-10 grid gap-6 md:grid-cols-2">
			{#each [{ title: 'The front', artwork: inspectionFront }, { title: 'The back', artwork: inspectionBack }] as face (face.title)}
				<Figure
					><Div variants={['stockIllustration']} class="bg-gray-100 dark:bg-gray-800"
						>{@render tagImage('manila', face.artwork)}</Div
					><Figcaption variants={['dialogCaption']}
						>{face.title} · supplied inspection-record artwork</Figcaption
					></Figure
				>
			{/each}
		</Div>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-legibility-heading"
		data-color-section="legibility"
	>
		<Div class="grid items-center gap-10 lg:grid-cols-3">
			<Div class="rounded-sm bg-tag-yellow/20 p-8 text-center"
				><Div class="mx-auto w-24"><StockTag class="text-tag-yellow" /></Div><P
					class="mt-6 text-2xl font-semibold">REVIEW · 024</P
				></Div
			>
			<Div class="lg:col-span-2"
				><P variants={['eyebrow']}>More than a color</P><H3
					id="stock-legibility-heading"
					variants={['item']}>Make the message clear for everyone.</H3
				><P variants={['dialogBody']}
					>Pair your stock color with words, numbers, or symbols. That gives people another way to
					recognize the next step when colors are difficult to distinguish.</P
				><P variants={['dialogBody']} class="mt-4"
					>Check the printed information at the distance and in the lighting where your team will
					use it.</P
				></Div
			>
		</Div>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-combinations-heading"
		data-color-section="combinations"
	>
		<P variants={['eyebrow']}>Build a visual system</P><H3
			id="stock-combinations-heading"
			variants={['item']}>A palette with a job to do.</H3
		>
		<Div class="mt-8 grid gap-6 md:grid-cols-3">
			<Card variants={['dialogPanel']} class="md:col-span-2"
				><Div class="flex items-center justify-center gap-8 py-8" aria-hidden="true"
					><Div class="w-16 sm:w-24"><StockTag class="text-tag-blue-light" /></Div><Div
						class="w-16 sm:w-24"><StockTag class="text-tag-blue-dark" /></Div
					><Div class="w-16 sm:w-24"><StockTag class="text-tag-white" /></Div></Div
				><H4 class="text-xl font-medium">Group related work</H4><P
					variants={['dialogBody']}
					class="mt-3"
					>Start with a small set of colors, then use printed details to distinguish individual
					items.</P
				></Card
			>
			<Card variants={['dialogPanel']}
				><Div class="mx-auto w-20 py-8"><StockTag class="text-tag-orange" /></Div><H4
					class="text-xl font-medium">Make exceptions visible</H4
				><P variants={['dialogBody']} class="mt-3"
					>Reserve a contrasting stock color for items that need a different next step.</P
				></Card
			>
			<Card variants={['dialogPanel']} class="md:col-span-3"
				><Div class="grid gap-6 md:grid-cols-2"
					><H4 class="text-xl font-medium">Keep the meaning consistent.</H4><P
						variants={['dialogBody']}
						>Document your color choices so a new team member can follow the same system. These
						combinations are examples to help you plan your own.</P
					></Div
				></Card
			>
		</Div>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-light-heading"
		data-color-section="lighting"
	>
		<P variants={['eyebrow']}>The real-world check</P><H3
			id="stock-light-heading"
			variants={['item']}>Look at samples where you'll use them.</H3
		>
		<Div class="mt-8 grid gap-6 md:grid-cols-2">
			<Figure
				><Div variants={['stockIllustration']} class="bg-tertiary-50 dark:bg-tertiary-950"
					>{@render tagImage('buff')}</Div
				><Figcaption variants={['dialogCaption']}>Consider warm indoor lighting.</Figcaption
				></Figure
			>
			<Figure
				><Div variants={['stockIllustration']} class="bg-primary-50 dark:bg-primary-950"
					>{@render tagImage('buff')}</Div
				><Figcaption variants={['dialogCaption']}
					>Compare with daylight or cooler lighting.</Figcaption
				></Figure
			>
		</Div>
		<P variants={['dialogBody']} class="mt-6"
			>These panels suggest different environments; they don't simulate a physical color match. Take
			your samples into the actual workspace before deciding.</P
		>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-story-heading"
		data-color-section="story"
	>
		<Div class="grid items-center gap-10 lg:grid-cols-2">
			<Div
				><P variants={['eyebrow']}>Customer story · layout preview</P><H3
					id="stock-story-heading"
					variants={['item']}>Color at work.</H3
				><Quote class="mt-8 size-8 text-primary-500" aria-hidden="true" /><Blockquote
					class="mt-4 text-2xl leading-relaxed"
					>An approved customer quote about their color system will appear here.</Blockquote
				><P class="mt-6 text-sm text-gray-600 dark:text-gray-300"
					>Testimonial placeholder — customer permission, quote, and attribution needed.</P
				></Div
			>
			<Figure
				><Div
					class="relative flex aspect-4/3 items-center justify-center rounded-sm bg-gray-100 dark:bg-gray-800"
					><Skeleton variants={['bento']} class="absolute inset-0 rounded-sm" /><Span
						class="relative px-8 text-center text-sm text-gray-600 dark:text-gray-300"
						>Customer workspace photography placeholder</Span
					></Div
				><Figcaption variants={['dialogCaption']}
					>A future image of the customer's tags in use.</Figcaption
				></Figure
			>
		</Div>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-questions-heading"
		data-color-section="questions"
	>
		<Div class="grid gap-10 lg:grid-cols-3">
			<Div
				><P variants={['eyebrow']}>Before you choose</P><H3
					id="stock-questions-heading"
					variants={['item']}>A few useful answers.</H3
				></Div
			>
			<Div class="space-y-4 lg:col-span-2"
				>{#each questions as question (question.title)}<Details variants={['stockQuestion']}
						><Summary variants={['stockQuestion']}>{question.title}</Summary><P
							variants={['dialogBody']}
							class="mt-4">{question.answer}</P
						></Details
					>{/each}</Div
			>
		</Div>
	</Section>

	<Section
		variants={['dialogSection']}
		aria-labelledby="stock-samples-heading"
		data-color-section="samples"
	>
		<Div class="flex flex-col items-center gap-6 text-center">
			<Div
				><P variants={['eyebrow']}>Your next step</P><H3
					id="stock-samples-heading"
					variants={['item']}>Find your color in person.</H3
				><P variants={['dialogBody']}
					>We'll send one color or several. Compare samples side by side.</P
				></Div
			>
			<P class="text-sm text-gray-600 dark:text-gray-300" aria-live="polite"
				>{selectedColors.length
					? `Your selection: ${selectedColors.map((color) => color.name).join(', ')}`
					: 'Select colors from the palette above, or tell us what you have in mind.'}</P
			>
			<A
				href={sampleHref}
				variants={['button.base', 'button.variant.large']}
				class="w-full sm:w-auto"
				data-stock-sample-request
				>Request samples <ArrowRight class="size-5" aria-hidden="true" /></A
			>
		</Div>
	</Section>
</Div>
