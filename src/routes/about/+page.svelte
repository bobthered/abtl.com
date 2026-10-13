<script lang="ts">
	// Imports
	import {
		A,
		Card,
		Container,
		Div,
		H1,
		H2,
		H3,
		Logo,
		Main,
		P,
		Section,
		Span,
		StockTag
	} from '#lib/components';
	import { applications, milestones, processSteps } from './_data/about.js';
	import { ArrowRight, Factory, Flame, MapPin, Store } from '#lib/icons';
	import { floatIllustration } from '#lib/attachments';
</script>

<svelte:head>
	<meta
		name="description"
		content="Get to know Allen-Bailey Tag & Label: tag and label manufacturing since 1911, based in Caledonia, New York. Quality driven. Customer focused."
	/>
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container variants={['section']}>
			<Div class="grid items-center gap-4 lg:grid-cols-2">
				<Div class="py-8 lg:pr-10">
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
						Allen-Bailey Tag & Label / Since 1911
					</P>
					<H1 class="max-w-3xl text-5xl sm:text-6xl lg:text-7xl">Made to carry what matters.</H1>
					<P variants={['description']}>
						An inspection record. A product identity. The next step in a working day. Our tags and
						labels carry the information businesses depend on.
					</P>
					<P class="max-w-xl text-lg text-gray-600 dark:text-gray-300">
						We are Allen-Bailey Tag & Label. Based in Caledonia, New York, we have been making our
						mark for more than a century.
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
				<Div
					variants={['illustration']}
					class="flex min-h-112 items-center justify-center p-10 sm:min-h-136"
					aria-hidden="true"
				>
					<Div
						{@attach floatIllustration}
						class="relative flex w-full items-center justify-center py-8"
					>
						<StockTag
							class="absolute left-0 w-36 -rotate-12 text-primary-200 sm:left-8 sm:w-44 dark:text-primary-700"
						/>
						<StockTag
							class="absolute right-0 w-36 rotate-12 text-secondary-200 sm:right-8 sm:w-44 dark:text-secondary-700"
						/>
						<Div class="relative w-48 rotate-3 sm:w-56">
							<StockTag class="text-white" />
							<Div
								class="absolute inset-x-8 top-16 bottom-8 flex flex-col items-start justify-between text-gray-950"
							>
								<Logo class="w-24" />
								<Div>
									<Span class="text-xs font-semibold tracking-widest uppercase">
										Making our mark since
									</Span>
									<Span class="block text-5xl font-light tracking-tight sm:text-6xl">1911</Span>
								</Div>
								<Span class="border-t border-gray-200 pt-4 text-xs font-medium">
									Caledonia, New York
								</Span>
							</Div>
						</Div>
					</Div>
				</Div>
			</Div>
			<Div
				class="mt-16 grid gap-4 border-t border-gray-200 pt-8 sm:grid-cols-3 dark:border-gray-800"
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
	<Section variants={['surfaceAlternate']} id="our-story" class="scroll-mt-36">
		<Container variants={['section']}>
			<Div class="grid gap-4 lg:grid-cols-2">
				<Div>
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">Our story</P><H2
						variants={['section']}
						class="max-w-xl"
					>
						A long history. A clear purpose.
					</H2>
				</Div>
				<P class="max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
					The applications have expanded. The ways we print have evolved. What a tag needs to do is
					still wonderfully direct: keep the right information with the right thing.
				</P>
			</Div>
			<Div class="mt-12 grid gap-4 lg:grid-cols-3">
				{#each milestones as milestone (milestone.year)}
					<Div class="border-t border-gray-200 pt-6 dark:border-gray-700">
						<P
							class="mb-8 text-5xl font-light tracking-tight text-primary-600 dark:text-primary-300"
						>
							{milestone.year}
						</P>
						<H3 class="text-2xl">{milestone.title}</H3>
						<P class="mt-4 max-w-md leading-relaxed text-gray-600 dark:text-gray-300">
							{milestone.description}
						</P>
					</Div>
				{/each}
			</Div>
			<Div class="mt-12 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
				<MapPin class="size-4 shrink-0" aria-hidden="true" /><P>
					3177 Lehigh Street, Caledonia, NY 14423
				</P>
			</Div>
		</Container>
	</Section>
	<Section variants={['surface']}>
		<Container variants={['section']}>
			<Div class="max-w-3xl">
				<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
					The work behind the work
				</P><H2 variants={['section']}>A tag can be part of something much bigger.</H2><P
					class="mt-6 text-lg text-gray-600 dark:text-gray-300"
				>
					Our work reaches industrial and agricultural businesses, fire-service teams, and the
					retail, hospitality, and service markets. Different settings. Different information. A
					shared need for identification that works.
				</P>
			</Div>
			<Div class="mt-10 grid gap-4 lg:grid-cols-3">
				{#each applications as application (application.title)}
					<Card class="flex flex-col shadow-none" variants={['neutral']}>
						{#if application.icon === 'fire'}<Flame
								class="mb-8 size-8 text-primary-600 dark:text-primary-300"
								aria-hidden="true"
							/>{:else if application.icon === 'industry'}<Factory
								class="mb-8 size-8 text-primary-600 dark:text-primary-300"
								aria-hidden="true"
							/>{:else}<Store
								class="mb-8 size-8 text-primary-600 dark:text-primary-300"
								aria-hidden="true"
							/>{/if}
						<H3 class="text-2xl">{application.title}</H3><P
							class="mt-4 mb-8 leading-relaxed text-gray-600 dark:text-gray-300"
						>
							{application.description}
						</P><A
							href={application.href}
							variants={['ghost', 'accent']}
							class="mt-auto inline-flex items-center gap-2 self-start px-0"
						>
							Explore the application<ArrowRight class="size-4" aria-hidden="true" />
						</A>
					</Card>
				{/each}
			</Div>
		</Container>
	</Section>
	<Section variants={['surfaceAlternate']}>
		<Container variants={['section']}>
			<Div class="grid gap-4 lg:grid-cols-3">
				<Div class="lg:pr-12">
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
						Built one detail at a time
					</P><H2 variants={['section']}>From a roll of stock to a ready-to-work tag.</H2><P
						class="mt-6 leading-relaxed text-gray-600 dark:text-gray-300"
					>
						The finished piece is the result of a sequence of decisions. Material, ink, patch, cut,
						and attachment all play a part.
					</P>
				</Div>
				<Div class="grid gap-4 sm:grid-cols-2 lg:col-span-2">
					{#each processSteps as step, index (step.title)}
						<Div class="rounded-sm bg-gray-50 p-6 dark:bg-gray-950">
							<Span class="mb-6 block text-sm font-semibold text-primary-600 dark:text-primary-300">
								0{index + 1}
							</Span><H3 class="text-2xl">{step.title}</H3><P
								class="mt-4 mb-6 leading-relaxed text-gray-600 dark:text-gray-300"
							>
								{step.description}
							</P><A
								href={step.href}
								variants={['ghost', 'accent']}
								class="inline-flex items-center gap-2 px-0"
							>
								{step.label}<ArrowRight class="size-4" aria-hidden="true" />
							</A>
						</Div>
					{/each}
				</Div>
			</Div>
		</Container>
	</Section>
	<Section variants={['sampleInvitation']}>
		<Container class="flex flex-col items-center gap-4 text-center">
			<P variants={['eyebrow']} class="text-gray-50 dark:text-gray-950">
				Quality driven. Customer focused.
			</P><H2 class="max-w-3xl text-4xl sm:text-5xl">
				Our next chapter starts with what you need.
			</H2><P class="max-w-2xl text-lg text-gray-300 dark:text-gray-700">
				An existing product to improve. A new application to figure out. A supply plan that needs to
				work harder. Bring us the details, and let us help you make your mark.
			</P><Div class="mt-6 flex flex-wrap justify-center gap-4">
				<A href="/contact" variants={['button.base', 'button.variant.large']}>
					Start a conversation<ArrowRight class="size-5" aria-hidden="true" />
				</A><A
					href="/careers"
					variants={['button.base', 'button.variant.neutral-outline', 'button.variant.large']}
				>
					Explore careers
				</A>
			</Div>
		</Container>
	</Section>
</Main>
