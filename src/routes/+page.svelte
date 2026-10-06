<script lang="ts">
	// Imports
	import {
		A,
		Article,
		Div,
		H1,
		H2,
		H3,
		Img,
		Main,
		P,
		Path,
		Section,
		Span,
		Svg
	} from 'sveltewind/components';

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
	<Svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="arrow-icon">
		<Path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.6" />
	</Svg>
{/snippet}

<Main id="main-content" tabindex={-1}>
	<Section class="hero page-width" aria-labelledby="hero-heading">
		<Div class="hero-copy">
			<P class="eyebrow">Allen-Bailey Tag & Label</P>
			<H1 id="hero-heading" class="hero-heading"
				><Span class="headline-line">Small details.</Span><Span class="headline-line"
					>Lasting impressions.</Span
				></H1
			>
			<P class="hero-description"
				>Stock and custom tags and labels for the way your business works.</P
			>
			<Div class="hero-actions">
				<A href="#products" class="primary-action">Explore Products {@render arrow()}</A>
				<A
					href="mailto:sales@abtl.com?subject=Custom%20tag%20and%20label%20quote"
					class="text-action">Request a Quote {@render arrow()}</A
				>
			</Div>
		</Div>
		<Div class="hero-art"
			><Img
				src="/images/tag-label-hero.webp"
				alt="An ivory Allen-Bailey hang tag with natural twine beside a roll of barcode labels"
				width="1536"
				height="1024"
				fetchpriority="high"
				class="hero-image"
			/></Div
		>
	</Section>
	<Section id="industries" class="industries-section" aria-labelledby="industries-heading">
		<Div class="page-width section-content">
			<P class="eyebrow">Industries</P>
			<H2 id="industries-heading" class="section-heading">Made for the way you work.</H2>
			<Div class="industry-grid">
				{#each industries as industry (industry.name)}
					<Article class="industry-item"
						><Span class="item-number">{industry.number}</Span><H3 class="item-heading"
							>{industry.name}</H3
						><P class="item-description">{industry.description}</P></Article
					>
				{/each}
			</Div>
		</Div>
	</Section>
	<Section id="products" class="page-width section-content" aria-labelledby="products-heading">
		<P class="eyebrow">Products</P><H2 id="products-heading" class="section-heading"
			>Find your next essential.</H2
		>
		<Div class="product-grid">
			{#each products as product (product)}
				<Article class="product-item"
					><H3 class="item-heading">{product}</H3><A
						href={`mailto:sales@abtl.com?subject=${encodeURIComponent(product + ' inquiry')}`}
						class="text-action">Explore {product.toLowerCase()} {@render arrow()}</A
					></Article
				>
			{/each}
		</Div>
	</Section>
	<Section id="capabilities" class="capabilities-section" aria-labelledby="capabilities-heading">
		<Div class="page-width section-content"
			><P class="eyebrow">Capabilities</P><H2 id="capabilities-heading" class="section-heading"
				>Your details. Our craft.</H2
			><P class="section-description"
				>Tell us what your tag or label needs to do. Let's explore the options for your project.</P
			><A href="mailto:sales@abtl.com?subject=Custom%20project%20inquiry" class="primary-action"
				>Let's talk about your project {@render arrow()}</A
			></Div
		>
	</Section>
	<Section id="resources" class="page-width section-content" aria-labelledby="resources-heading">
		<P class="eyebrow">Resources</P><H2 id="resources-heading" class="section-heading"
			>A little guidance goes a long way.</H2
		><P class="section-description"
			>Questions about choosing a product or preparing artwork? Talk with our team about your next
			step.</P
		><A href="mailto:sales@abtl.com" class="text-action">Contact our team {@render arrow()}</A>
	</Section>
</Main>
