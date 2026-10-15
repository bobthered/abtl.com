<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Button,
		Container,
		Div,
		H2,
		Li,
		P,
		Section,
		Span,
		Ul
	} from '#lib/components';
	import AttachmentArtwork from './AttachmentArtwork.svelte';
	import type { AttachmentOption } from './options';
	import AttachmentSample from './AttachmentSample.svelte';
	import { Check } from '#lib/icons';
	import { floatIllustration } from '#lib/attachments';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// $props()
	let { index, option }: { index: number; option: AttachmentOption } = $props();

	// $state
	let isReady = $state(false);
	let selectedVariant = $state('');

	// $derived
	const variant = $derived(
		option.variants.find((item) => item === selectedVariant) ?? option.variants[0] ?? ''
	);
	const enquiryHref = $derived(
		`mailto:sales@abtl.com?subject=${encodeURIComponent(`${option.name} for my tags`)}&body=${encodeURIComponent(`I'd like to discuss ${option.name.toLowerCase()} for my tags.\nOption of interest: ${variant}\nItem to identify: \nTag stock and size: \nAttachment point: \nHandling and exposure: \nQuantity: `)}`
	);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

<Section
	id={option.id}
	variants={[index % 2 === 0 ? 'surfaceAlternate' : 'surface']}
	class="scroll-mt-28"
	aria-labelledby={`${option.id}-heading`}
	data-attachment-section={option.id}
	data-attachment-ready={isReady}
>
	<Container class="py-12 sm:py-16">
		<Div class="grid items-center gap-4 lg:grid-cols-2">
			<Div class={twMerge('py-4', index % 2 === 0 ? 'lg:order-1 lg:pr-10' : 'lg:order-2 lg:pl-10')}>
				<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
					0{index + 1} / {option.category}
				</P>
				<H2 id={`${option.id}-heading`} class="text-4xl sm:text-5xl">{option.name}</H2>
				<P class="mt-4 max-w-lg text-2xl font-light sm:text-3xl">{option.title}</P>
				<P variants={['dialogBody']} class="mt-6 leading-relaxed">{option.description}</P>
				<A href={enquiryHref} variants={['button.base']} class="mt-8" data-attachment-enquiry>
					<ActionLabel>Discuss {option.name.toLowerCase()}</ActionLabel>
				</A>
			</Div>
			<Div
				variants={['illustration']}
				class={twMerge(
					'relative min-h-88 sm:min-h-112',
					index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
				)}
				data-attachment-artwork={option.id}
				data-attachment-variant={variant}
			>
				<Span class="absolute top-6 left-6 text-xs font-medium tracking-widest uppercase">
					The finishing detail / {option.name}
				</Span>
				<Div {@attach floatIllustration} class="h-88 px-6 pt-8 sm:h-112">
					<AttachmentArtwork kind={option.id} {variant} />
				</Div>
				{#if variant}<P
						class="absolute right-6 bottom-5 rounded-sm bg-white/90 px-3 py-2 text-sm font-medium dark:bg-gray-950/90"
						aria-live="polite"
					>
						{variant}
					</P>{/if}
			</Div>
		</Div>
		{#if option.variants.length}
			<Div class="mt-10 flex flex-wrap items-baseline justify-between gap-4">
				<P class="text-lg font-medium">Available options</P>
				<P class="text-sm text-gray-600 dark:text-gray-300">
					Choose a detail. Picture the finished tag.
				</P>
			</Div>
			<Ul
				class={twMerge(
					'mt-4 grid list-none grid-cols-2 gap-4 p-0',
					option.variants.length === 3
						? 'sm:grid-cols-3'
						: option.variants.length === 2
							? 'lg:max-w-3xl'
							: 'lg:grid-cols-4'
				)}
				aria-label={`${option.name} options`}
			>
				{#each option.variants as item (item)}
					<Li>
						<Button
							variants={['ghost']}
							class={twMerge(
								'relative block w-full rounded-sm bg-gray-50 p-5 text-left text-gray-950 inset-ring-1 inset-ring-gray-200 hover:bg-gray-100 hover:text-gray-950 dark:bg-gray-950 dark:text-gray-50 dark:inset-ring-gray-800 dark:hover:bg-gray-900 dark:hover:text-gray-50',
								item === variant
									? 'inset-ring-2 inset-ring-primary-500 dark:inset-ring-primary-400'
									: ''
							)}
							aria-label={item}
							aria-pressed={item === variant}
							onclick={() => (selectedVariant = item)}
							data-attachment-choice={item}
						>
							<AttachmentSample kind={option.id} variant={item} />
							<Span class="mt-4 block text-base font-medium">{item}</Span>
							{#if item === variant}<Check
									class="absolute top-4 right-4 size-4 text-primary-500"
									aria-hidden="true"
								/>{/if}
						</Button>
					</Li>
				{/each}
			</Ul>
		{:else}
			<Div
				class="mt-8 flex items-center gap-4 rounded-sm bg-gray-50 px-6 py-4 inset-ring-1 inset-ring-gray-200 dark:bg-gray-950 dark:inset-ring-gray-800"
			>
				<Div class="w-32 shrink-0"><AttachmentSample kind="patch" variant="" /></Div>
				<Div>
					<P class="font-medium">Reinforcement where the pull begins.</P><P
						class="mt-2 text-sm text-gray-600 dark:text-gray-300"
					>
						A closer look at the opening, the patch, and the fastening point.
					</P>
				</Div>
			</Div>
		{/if}
		<Div class="mt-8 grid gap-4 border-t border-gray-200 pt-6 lg:grid-cols-3 dark:border-gray-700">
			<P class="text-lg font-medium">{option.question}</P>
			<P class="leading-relaxed text-gray-600 lg:col-span-2 dark:text-gray-300">
				{option.guidance}
			</P>
		</Div>
	</Container>
</Section>
