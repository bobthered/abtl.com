<script lang="ts">
	// Imports
	import { A, Br, Container, Div, H1, H2, H3, Main, P, Section, Span } from '#lib/components';
	import { applications, milestones, processSteps } from './_data/about.js';
	import { ArrowRight, MapPin } from '#lib/icons';
	import CaledoniaLandscape from './_components/CaledoniaLandscape.svelte';
	import StoryPhoto from './_components/StoryPhoto.svelte';
</script>

<svelte:head>
	<meta
		name="description"
		content="Small-town roots. Far-reaching possibilities. Meet Allen-Bailey Tag & Label: manufacturing since 1911, at home in Caledonia, New York, and serving customers across all 50 states and internationally."
	/>
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container variants={['section']}>
			<Div class="grid items-end gap-4 lg:grid-cols-3">
				<Div class="py-8 lg:col-span-2 lg:pr-12">
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
						Caledonia, New York / Since 1911
					</P>
					<H1 class="max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
						Small-town roots.
						<Br />
						Far-reaching possibilities.
					</H1>
				</Div>
				<Div class="pb-8">
					<P class="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						A village in western New York. More than a century of making. Tags and labels that find
						their way into working days across the country and around the world.
					</P>
					<Div class="mt-8 flex flex-wrap gap-4">
						<A href="/contact" variants={['button.base']}>
							Tell us your story<ArrowRight class="size-4" aria-hidden="true" />
						</A>
						<A href="#our-story" variants={['button.base', 'button.variant.neutral-outline']}>
							Discover ours
						</A>
					</Div>
				</Div>
			</Div>
			<StoryPhoto
				src="/images/about/golden-hour-industrial-complex-aerial.webp"
				alt="Golden-hour aerial view of industrial buildings surrounded by fields and trees"
				caption={null}
				isPriority
				class="mt-8 h-80 sm:h-112 lg:h-136"
			/>
			<Div
				class="mt-12 grid gap-4 border-t border-gray-200 pt-8 sm:grid-cols-3 dark:border-gray-800"
				aria-label="Allen-Bailey at a glance"
			>
				<Div>
					<P class="text-4xl font-light tracking-tight">1911</P><P
						class="mt-2 text-sm text-gray-600 dark:text-gray-300"
					>
						The year our story began
					</P>
				</Div>
				<Div>
					<P
						class="text-4xl font-light tracking-tight"
						aria-label="Over 90 million tags produced last year"
					>
						<Span data-count-up={90}>90</Span>M+
					</P><P class="mt-2 text-sm text-gray-600 dark:text-gray-300">Tags produced last year</P>
				</Div>
				<Div>
					<P class="text-4xl font-light tracking-tight"><Span data-count-up={50}>50</Span></P><P
						class="mt-2 text-sm text-gray-600 dark:text-gray-300"
					>
						States served, plus international destinations
					</P>
				</Div>
			</Div>
		</Container>
	</Section>

	<Section variants={['surfaceAlternate']}>
		<Container variants={['section']}>
			<Div class="grid items-center gap-4 lg:grid-cols-3">
				<Div class="py-6 lg:pr-10">
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
						A sense of place
					</P>
					<H2 variants={['section']}>This is where we make our mark.</H2>
					<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						Caledonia is more than an address on a shipping label. It is the place we call home, and
						the place your next tag or label begins.
					</P>
					<P class="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
						Our rural setting is part of our story. Our customers give that story its reach.
					</P>
					<Div class="mt-8 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
						<MapPin class="size-5 shrink-0" aria-hidden="true" /><P>
							3177 Lehigh Street
							<Br />
							Caledonia, NY 14423
						</P>
					</Div>
				</Div>
				<Div class="min-w-0 lg:col-span-2"><CaledoniaLandscape /></Div>
			</Div>
		</Container>
	</Section>

	<Section variants={['surface']} id="our-story" class="scroll-mt-36">
		<Container variants={['section']}>
			<Div class="grid items-end gap-4 lg:grid-cols-2">
				<Div>
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
						Our story, still unfolding
					</P><H2 variants={['section']} class="max-w-2xl">More than a century in the making.</H2>
				</Div>
				<P class="max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
					Methods evolve. Applications change. The purpose carries on: keeping the right information
					with the right thing. Since 1911, Allen-Bailey has been part of that everyday work.
				</P>
			</Div>
			<Div class="mt-12 grid gap-4 md:grid-cols-2">
				{#each milestones as milestone (milestone.year)}
					<Div class="overflow-hidden rounded-sm bg-white dark:bg-gray-900">
						<StoryPhoto src={milestone.image} alt={milestone.alt} class="h-64 sm:h-80" />
						<Div class="p-6 sm:p-8">
							<P
								class="mb-4 text-4xl font-light tracking-tight text-primary-600 dark:text-primary-300"
							>
								{milestone.year}
							</P>
							<H3 class="text-2xl">{milestone.title}</H3>
							<P class="mt-4 max-w-xl leading-relaxed text-gray-600 dark:text-gray-300">
								{milestone.description}
							</P>
						</Div>
					</Div>
				{/each}
			</Div>
		</Container>
	</Section>

	<Section variants={['surfaceAlternate']}>
		<Container variants={['section']}>
			<Div class="grid items-center gap-4 lg:grid-cols-5">
				<StoryPhoto
					src="/images/about/rural-landscape-placeholder.webp"
					alt="Generated placeholder: an imagined western New York rural landscape with fields, tree lines and a country road"
					class="h-96 lg:col-span-3 lg:h-136"
				/>
				<Div class="py-8 lg:col-span-2 lg:pl-12">
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
						Room to think bigger
					</P>
					<H2 variants={['section']}>A small-town address. An expansive outlook.</H2>
					<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						You do not have to be in a big city to be part of something big. From Caledonia, our
						tags and labels reach all 50 states and international destinations.
					</P>
					<P class="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
						Whether your business is close to home or far beyond it, the starting point is the same:
						what do you need your tag or label to do?
					</P>
					<A
						href="/capabilities/shipping"
						variants={['button.base', 'button.variant.neutral-outline']}
						class="mt-8"
					>
						See how far we go<ArrowRight class="size-4" aria-hidden="true" />
					</A>
				</Div>
			</Div>
		</Container>
	</Section>

	<Section variants={['surface']}>
		<Container variants={['section']}>
			<Div class="grid items-center gap-4 lg:grid-cols-2">
				<Div class="py-8 lg:pr-16">
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
						Experience that keeps moving
					</P>
					<H2 variants={['section']}>Rooted here. Ready for what is next.</H2>
					<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						A long history matters most when it helps with the work ahead. Full-color printing.
						Variable data. Synthetic materials. Inventory held for later release. More ways to make
						a tag or label work for your business.
					</P>
					<P class="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
						An established customer with a new challenge, or a new customer with a first idea: there
						is room for your next chapter in our story.
					</P>
					<A href="/capabilities" variants={['button.base']} class="mt-8">
						Explore what is possible<ArrowRight class="size-4" aria-hidden="true" />
					</A>
				</Div>
				<StoryPhoto
					src="/images/about/press-today-placeholder.webp"
					alt="Generated placeholder: a modern printing press and paper web, not actual Allen-Bailey machinery"
					class="h-96 lg:h-136"
				/>
			</Div>
			<Div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each processSteps as step, index (step.title)}
					<Div class="border-t border-gray-200 pt-6 dark:border-gray-800">
						<Span class="mb-6 block text-sm font-semibold text-primary-600 dark:text-primary-300">
							0{index + 1}
						</Span>
						<H3 class="text-2xl">{step.title}</H3><P
							class="mt-4 mb-6 leading-relaxed text-gray-600 dark:text-gray-300"
						>
							{step.description}
						</P>
						<A
							href={step.href}
							variants={['ghost', 'accent']}
							class="inline-flex items-center gap-2 px-0"
						>
							{step.label}<ArrowRight class="size-4 shrink-0" aria-hidden="true" />
						</A>
					</Div>
				{/each}
			</Div>
		</Container>
	</Section>

	<Section variants={['surfaceAlternate']}>
		<Container variants={['section']}>
			<Div class="max-w-3xl">
				<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
					The work behind the work
				</P><H2 variants={['section']}>Made here. At work everywhere.</H2><P
					class="mt-6 text-lg text-gray-600 dark:text-gray-300"
				>
					A service record on equipment. An identity on a product. Information that stays with
					materials in the field. Different businesses, connected by a need to make every detail
					count.
				</P>
			</Div>
			<Div class="mt-12 grid gap-4 lg:grid-cols-3">
				{#each applications as application (application.title)}
					<Div class="flex flex-col rounded-sm bg-gray-50 p-6 sm:p-8 dark:bg-gray-950">
						<H3 class="text-2xl">{application.title}</H3><P
							class="mt-4 mb-8 leading-relaxed text-gray-600 dark:text-gray-300"
						>
							{application.description}
						</P>
						<A
							href={application.href}
							variants={['ghost', 'accent']}
							class="mt-auto inline-flex items-center gap-2 self-start px-0"
						>
							Explore the application<ArrowRight class="size-4" aria-hidden="true" />
						</A>
					</Div>
				{/each}
			</Div>
		</Container>
	</Section>

	<Section variants={['sampleInvitation']}>
		<Container class="flex flex-col items-center gap-4 text-center">
			<P variants={['eyebrow']} class="text-gray-50 dark:text-gray-950">
				More than a century behind us. Your next idea ahead.
			</P>
			<H2 class="max-w-3xl text-4xl sm:text-5xl">Let us make your next chapter.</H2>
			<P class="max-w-2xl text-lg text-gray-300 dark:text-gray-700">
				Bring us the application, the challenge, or the idea you have been turning over. We will
				help you find the next step.
			</P>
			<Div class="mt-6 flex flex-wrap justify-center gap-4">
				<A href="/contact" variants={['button.base', 'button.variant.large']}>
					Start a conversation<ArrowRight class="size-5" aria-hidden="true" />
				</A>
			</Div>
		</Container>
	</Section>
</Main>
