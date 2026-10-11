<script lang="ts">
	// Imports
	import {
		A,
		Article,
		BentoSection,
		Container,
		Div,
		H2,
		H3,
		Main,
		P,
		Section,
		SiteHero,
		Span
	} from '#lib/components';
	import { ArrowRight } from '#lib/icons';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import { theme } from 'sveltewind/theme';
	import { type Topic, topicHref } from '#lib/components/BentoSection/topics.js';

	// consts
	const industries = [
		{ name: 'Industrial', description: 'Identification that keeps work moving.', number: '01' },
		{ name: 'Agriculture', description: 'Tags and labels for the field and beyond.', number: '02' },
		{
			name: 'Fire safety',
			description: 'A clear record of service and maintenance.',
			number: '03'
		},
		{
			name: 'Retail & hospitality',
			description: 'Thoughtful details at every touchpoint.',
			number: '04'
		}
	];
	const products = ['Stock tags', 'Custom tags', 'Labels'];

	// helpers
	const navigateTopic = (topic: Topic | null) => {
		if (topic) void goto(topicHref(topic), { shallow: true, state: { bentoTopic: topic.id } });
		else if (page.shallow && page.state.bentoTopic) history.back();
	};

	// $props()
	let { data }: PageProps = $props();

	// $derived
	const topicId = $derived(browser && page.shallow ? (page.state.bentoTopic ?? null) : null);
</script>

{#snippet arrow()}
	<ArrowRight aria-hidden="true" strokeWidth={1.6} class={theme.resolve('svg', ['arrow'])} />
{/snippet}

<Main id="main-content" tabindex={-1}>
	<SiteHero />
	<BentoSection orderedTopics={data.bentoTopics} {topicId} onNavigate={navigateTopic} />
	<Section id="industries" variants={['surfaceAlternate']} aria-labelledby="industries-heading">
		<Container variants={['section']}>
			<P variants={['eyebrow']}>Industries</P>
			<H2 id="industries-heading" variants={['section']}>Made for the way you work.</H2>
			<Div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{#each industries as industry (industry.name)}
					<Article variants={['industry']}
						><Span variants={['index']}>{industry.number}</Span><H3 variants={['item']}
							>{industry.name}</H3
						><P variants={['body']}>{industry.description}</P></Article
					>
				{/each}
			</Div>
		</Container>
	</Section>
	<Section id="products" variants={['surface']} aria-labelledby="products-heading">
		<Container variants={['section']}>
			<P variants={['eyebrow']}>Products</P><H2 id="products-heading" variants={['section']}
				>Find your next essential.</H2
			>
			<Div class="mt-10 grid gap-6 lg:grid-cols-3">
				{#each products as product (product)}
					<Article variants={['card.base', 'product']}
						><H3 variants={['item']}>{product}</H3><A
							href={`mailto:sales@abtl.com?subject=${encodeURIComponent(product + ' inquiry')}`}
							variants={['button.base', 'button.variant.cta']}
							>Explore {product.toLowerCase()} {@render arrow()}</A
						></Article
					>
				{/each}
			</Div>
		</Container>
	</Section>
	<Section id="capabilities" variants={['contrast']} aria-labelledby="capabilities-heading">
		<Container variants={['section']}
			><P variants={['eyebrow']}>Capabilities</P><H2
				id="capabilities-heading"
				variants={['section']}>Your details. Our craft.</H2
			><P variants={['description']}
				>Tell us what your tag or label needs to do. Let's explore the options for your project.</P
			><A
				href="mailto:sales@abtl.com?subject=Custom%20project%20inquiry"
				variants={['button.base', 'button.variant.cta']}
				>Let's talk about your project {@render arrow()}</A
			></Container
		>
	</Section>
	<Section id="resources" variants={['surface']} aria-labelledby="resources-heading">
		<Container variants={['section']}>
			<P variants={['eyebrow']}>Resources</P><H2 id="resources-heading" variants={['section']}
				>A little guidance goes a long way.</H2
			><P variants={['description']}
				>Questions about choosing a product or preparing artwork? Talk with our team about your next
				step.</P
			><A href="mailto:sales@abtl.com" variants={['button.base', 'button.variant.cta']}
				>Contact our team {@render arrow()}</A
			>
		</Container>
	</Section>
</Main>
