<script lang="ts">
	// Imports
	import {
		A,
		Article,
		Container,
		Div,
		H1,
		H2,
		H3,
		Img,
		Logo,
		Main,
		P,
		Section,
		Span
	} from '#lib/components';
	import { ArrowRight } from '#lib/icons';
	import { theme } from 'sveltewind/theme';

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
</script>

{#snippet arrow()}
	<ArrowRight aria-hidden="true" strokeWidth={1.6} class={theme.resolve('svg', ['arrow'])} />
{/snippet}

<Main id="main-content" tabindex={-1}>
	<Section aria-labelledby="hero-heading">
		<Container
			class="grid items-center gap-6 pt-14 pb-12 lg:min-h-160 lg:grid-cols-2 lg:gap-0 lg:pt-18 lg:pb-28"
		>
			<Div class="relative z-1">
				<Logo variants={['onSurface']} class="mb-6" />
				<H1 id="hero-heading" variants={['hero']}
					><Span class="block">Small details.</Span><Span class="block">Lasting impressions.</Span
					></H1
				>
				<P variants={['lead']}>Stock and custom tags and labels for the way your business works.</P>
				<Div class="mt-8 flex flex-wrap items-center gap-6 lg:mt-10 lg:gap-8">
					<A href="#products" variants={['button.base', 'button.variant.cta']}
						>Explore Products {@render arrow()}</A
					>
					<A
						href="mailto:sales@abtl.com?subject=Custom%20tag%20and%20label%20quote"
						variants={['button.base', 'button.variant.outline', 'button.variant.cta']}
						>Request a Quote {@render arrow()}</A
					>
				</Div>
			</Div>
			<Div class="mx-auto max-w-xl lg:-mr-12 lg:-ml-8"
				><Img
					src="/images/tag-label-hero.webp"
					alt="An ivory Allen-Bailey hang tag with natural twine beside a roll of barcode labels"
					width="1536"
					height="1024"
					fetchpriority="high"
					variants={['hero']}
				/></Div
			>
		</Container>
	</Section>
	<Section id="industries" variants={['surface']} aria-labelledby="industries-heading">
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
	<Section id="products" aria-labelledby="products-heading">
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
	<Section id="resources" aria-labelledby="resources-heading">
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
