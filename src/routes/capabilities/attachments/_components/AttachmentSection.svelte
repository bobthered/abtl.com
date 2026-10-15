<script lang="ts">
	// Imports
	import { A, ActionLabel, Container, Div, H2, Li, P, Section, Span, Ul } from '#lib/components';
	import AttachmentArtwork from './AttachmentArtwork.svelte';
	import type { AttachmentOption } from './options';
	import { floatIllustration } from '#lib/attachments';
	import { twMerge } from 'tailwind-merge';

	// $props()
	let { index, option }: { index: number; option: AttachmentOption } = $props();

	// $derived
	const enquiryHref = $derived(
		`mailto:sales@abtl.com?subject=${encodeURIComponent(`${option.name} for my tags`)}&body=${encodeURIComponent(`I'd like to discuss ${option.name.toLowerCase()} for my tags.\nOption of interest: \nItem to identify: \nTag stock and size: \nAttachment point: \nHandling and exposure: \nQuantity: `)}`
	);
</script>

<Section
	id={option.id}
	variants={[index % 2 === 0 ? 'surfaceAlternate' : 'surface']}
	class="scroll-mt-28"
	aria-labelledby={`${option.id}-heading`}
	data-attachment-section={option.id}
>
	<Container class="py-12 sm:py-16">
		<Div class="grid items-center gap-4 lg:grid-cols-2">
			<Div class={twMerge('py-4', index % 2 === 0 ? 'lg:order-1 lg:pr-10' : 'lg:order-2 lg:pl-10')}>
				<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
					{option.category}
				</P>
				<H2 id={`${option.id}-heading`} class="text-4xl sm:text-5xl">{option.name}</H2>
				<P class="mt-4 text-xl font-light">{option.title}</P>
				<P variants={['dialogBody']} class="mt-6 leading-relaxed">{option.description}</P>
				{#if option.variants.length}
					<P class="mt-8 text-sm font-medium">Available options</P>
					<Ul
						class="mt-4 grid list-none gap-4 p-0 sm:grid-cols-2"
						aria-label={`${option.name} options`}
					>
						{#each option.variants as variant (variant)}
							<Li
								class="rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium inset-ring-1 inset-ring-gray-200 dark:bg-gray-800 dark:inset-ring-gray-700"
							>
								{variant}
							</Li>
						{/each}
					</Ul>
				{/if}
				<P class="mt-8 font-medium">{option.question}</P>
				<P class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{option.brief}</P>
				<A
					href={enquiryHref}
					variants={['button.base', 'button.variant.neutral-outline']}
					class="mt-6"
					data-attachment-enquiry
				>
					<ActionLabel>Discuss {option.name.toLowerCase()}</ActionLabel>
				</A>
			</Div>
			<Div
				variants={['illustration']}
				class={twMerge(
					'relative min-h-80 sm:min-h-100',
					index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
				)}
				data-attachment-artwork={option.id}
			>
				<Span class="absolute top-6 left-6 text-xs font-medium tracking-widest uppercase">
					The finishing detail / {option.name}
				</Span>
				<Div {@attach floatIllustration} class="h-80 px-6 pt-8 sm:h-100">
					<AttachmentArtwork kind={option.id} />
				</Div>
			</Div>
		</Div>
	</Container>
</Section>
