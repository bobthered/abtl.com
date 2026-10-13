<script lang="ts">
	// Imports
	import { A, Card, Container, Div, H1, H2, H3, Main, P, Section, StockTag } from '#lib/components';
	import { ArrowUpRight } from '#lib/icons';
	import { floatIllustration } from '#lib/attachments';
	import type { LandingPageContent } from '#lib/data/landingPages.js';

	// $props()
	let { content }: { content: LandingPageContent } = $props();
</script>

<svelte:head>
	<meta name="description" content={content.description} />
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container variants={['section']}>
			<Div class="grid items-center gap-4 lg:grid-cols-3">
				<Div class="py-8 lg:col-span-2 lg:pr-16">
					<P variants={['eyebrow']} class="text-primary-600 dark:text-primary-300">
						{content.eyebrow}
					</P>
					<H1 class="max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{content.title}</H1>
					<P variants={['description']}>{content.description}</P>
					<A href={content.detailHref} variants={['button.base']}>
						{content.detailLabel}<ArrowUpRight class="size-4" aria-hidden="true" />
					</A>
				</Div>
				<Div
					variants={['illustration']}
					class="flex min-h-80 items-center justify-center p-12"
					aria-hidden="true"
				>
					<Div {@attach floatIllustration} class="relative flex items-center justify-center gap-4">
						<StockTag class="w-20 -rotate-12 text-secondary-400 sm:w-24" />
						<StockTag class="w-24 rotate-6 text-primary-400 sm:w-28" />
					</Div>
				</Div>
			</Div>
		</Container>
	</Section>
	<Section variants={['surfaceAlternate']}>
		<Container variants={['section']}>
			<H2 variants={['section']} class="mb-10 max-w-3xl">{content.heading}</H2>
			<Div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each content.cards as [title, description, href, label] (title)}
					<Card class="flex flex-col shadow-none" variants={['neutral']}>
						<H3 class="text-2xl">{title}</H3>
						<P class="mt-4 mb-8 text-gray-600 dark:text-gray-300">{description}</P>
						<A {href} variants={['ghost', 'accent']} class="mt-auto justify-start px-0">
							{label}<ArrowUpRight class="size-4" aria-hidden="true" />
						</A>
					</Card>
				{/each}
			</Div>
		</Container>
	</Section>
	<Section variants={['surface']}>
		<Container variants={['section']}>
			<Div class="grid items-start gap-4 lg:grid-cols-2">
				<H2 variants={['section']} class="max-w-xl">{content.detailTitle}</H2>
				<Div>
					<P class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						{content.detail}
					</P>
					<A href={content.detailHref} variants={['button.base', 'button.variant.neutral-outline']}>
						{content.detailLabel}
					</A>
				</Div>
			</Div>
		</Container>
	</Section>
	<Section variants={['sampleInvitation']}>
		<Container class="flex flex-col items-center gap-4 text-center">
			<H2 class="max-w-3xl text-3xl sm:text-4xl">{content.cta}</H2>
			<P class="max-w-2xl text-lg">{content.ctaText}</P>
			<A
				href="mailto:sales@abtl.com"
				variants={['button.base', 'button.variant.large']}
				class="mt-4"
			>
				Email our team<ArrowUpRight class="size-5" aria-hidden="true" />
			</A>
		</Container>
	</Section>
</Main>
