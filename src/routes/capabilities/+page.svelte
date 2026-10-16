<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Card,
		Container,
		Div,
		H1,
		H2,
		H3,
		Main,
		P,
		Section
	} from '#lib/components';
	import { ArrowUpRight } from '#lib/icons';
	import { ContentLayout } from '#lib/layouts';
	import { landingPages } from '#lib/data/landingPages.js';

	// consts
	const content = landingPages.capabilities;
</script>

<svelte:head><meta name="description" content={content.description} /></svelte:head>

{#snippet introduction()}
	<P variants={['eyebrow']}>{content.eyebrow}</P>
	<H1 variants={['h2.variant.section']}>{content.title}</H1>
	<P class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">{content.description}</P>
{/snippet}

{#snippet callToAction()}
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">{content.cta}</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">{content.ctaText}</P>
	<A
		href="mailto:sales@abtl.com"
		variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
	>
		<ActionLabel>Email our team</ActionLabel>
	</A>
{/snippet}

<Main id="main-content" tabindex={-1}>
	<ContentLayout {callToAction} {introduction}>
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
						<A
							href={content.detailHref}
							variants={['button.base', 'button.variant.neutral-outline']}
						>
							{content.detailLabel}
						</A>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Main>
