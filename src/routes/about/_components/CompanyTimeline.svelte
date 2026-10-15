<script lang="ts">
	// Imports
	import { Container, Div, H2, H3, Li, Ol, P, Section, Span } from '#lib/components';
	import { milestones } from '../_data/about.js';
	import StoryPhoto from './StoryPhoto.svelte';
	import { twMerge } from 'tailwind-merge';
</script>

<Section
	variants={['surface']}
	id="our-story"
	class="scroll-mt-36"
	aria-labelledby="our-story-title"
>
	<Container variants={['section']}>
		<Div class="mb-12 max-w-3xl">
			<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
				Our story, still unfolding
			</P>
			<H2 id="our-story-title" variants={['section']}>One idea. A century of forward motion.</H2>
			<P class="mt-6 text-lg text-gray-600 dark:text-gray-300">
				Before paper tags and printed labels, there were wooden nursery stakes. Our story began in
				Dansville with a practical idea: help growers identify their plants. The materials have
				changed. The purpose has carried on.
			</P>
		</Div>
		<Div class="relative">
			<Div
				aria-hidden="true"
				class="absolute inset-y-0 left-3 w-px bg-gradient-to-b from-primary-500 via-secondary-400 to-primary-500 lg:left-1/2"
			/>
			<Ol class="m-0 list-none p-0">
				{#each milestones as milestone, index (milestone.year)}
					<Li
						class="relative grid items-center gap-4 pb-16 pl-10 last:pb-0 lg:grid-cols-12 lg:pl-0"
					>
						<Span
							aria-hidden="true"
							class="absolute top-8 left-3 size-3 -translate-x-1/2 rounded-full bg-primary-500 ring-4 ring-white lg:left-1/2 dark:ring-gray-900"
						/>
						<Div class={twMerge('lg:col-span-5', index % 2 === 0 ? 'lg:order-1' : 'lg:order-3')}>
							{#if milestone.photo}
								<StoryPhoto
									{...milestone.photo}
									caption={null}
									imageClass="aspect-4/3 h-auto min-h-0 flex-none"
									lightboxCaption={`${milestone.year} — ${milestone.title}\n\n${milestone.description}`}
								/>
							{/if}
						</Div>
						<Div aria-hidden="true" class="hidden lg:order-2 lg:col-span-2 lg:block" />
						<Div
							class={twMerge(
								'py-4 lg:col-span-5',
								index % 2 === 0 ? 'lg:order-3 lg:pl-4' : 'lg:order-1 lg:pr-4'
							)}
						>
							<P
								class="mb-4 text-3xl font-light tracking-tight text-primary-600 sm:text-4xl dark:text-primary-300"
							>
								{milestone.year}
							</P>
							<H3 class="text-2xl sm:text-3xl">{milestone.title}</H3>
							<P class="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
								{milestone.description}
							</P>
						</Div>
					</Li>
				{/each}
			</Ol>
		</Div>
	</Container>
</Section>
