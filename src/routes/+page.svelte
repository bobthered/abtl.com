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
	<Svg
		aria-hidden="true"
		viewBox="0 0 24 24"
		fill="none"
		class="size-6 shrink-0 transition-transform duration-[180ms] group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
	>
		<Path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.6" />
	</Svg>
{/snippet}

<Main id="main-content" tabindex={-1}>
	<Section aria-labelledby="hero-heading">
		<Container
			class="grid min-h-[740px] grid-cols-[1.15fr_1fr] items-center gap-0 pt-[72px] pb-28 max-[1100px]:min-h-[620px] max-[800px]:min-h-0 max-[800px]:grid-cols-1 max-[800px]:gap-6 max-[800px]:pt-[58px] max-[800px]:pb-12"
		>
			<Div class="relative z-1">
				<P
					class="mt-0 mb-7 text-xs leading-normal font-bold tracking-[2.8px] text-[#62697c] uppercase max-[800px]:mb-[22px] max-[800px]:text-[10px] max-[800px]:tracking-[2px]"
					>Allen-Bailey Tag & Label</P
				>
				<H1
					id="hero-heading"
					class="m-0 text-[clamp(42px,5.1vw,74px)] leading-[1.09] font-[750] tracking-[-3.7px] text-[#08080a] max-[1100px]:tracking-[-2.5px] max-[800px]:text-[clamp(36px,7.4vw,58px)] max-[800px]:tracking-[-2px] max-[380px]:text-[32px] max-[380px]:tracking-[-1.5px] min-[1600px]:text-[74px]"
					><Span class="block whitespace-nowrap">Small details.</Span><Span
						class="block whitespace-nowrap">Lasting impressions.</Span
					></H1
				>
				<P
					class="mt-[30px] mb-0 max-w-[580px] text-[clamp(20px,1.9vw,27px)] leading-[1.4] tracking-[-0.6px] text-[#62697c] max-[800px]:mt-6 max-[800px]:max-w-[450px] max-[800px]:text-[21px]"
					>Stock and custom tags and labels for the way your business works.</P
				>
				<Div
					class="mt-10 flex items-center gap-[38px] max-[1100px]:gap-6 max-[800px]:mt-[30px] max-[800px]:flex-wrap max-[800px]:gap-[22px]"
				>
					<A
						href="#products"
						class="inline-flex items-center justify-center gap-[22px] rounded-full bg-[#5300ff] px-[30px] py-[18px] text-[17px] leading-[1.4] font-medium whitespace-nowrap text-white no-underline transition-[background-color,transform] duration-[180ms] hover:-translate-y-0.5 hover:bg-[#4000d4] motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-[1100px]:gap-3.5 max-[1100px]:px-6 max-[1100px]:py-4 max-[1100px]:text-[15px]"
						>Explore Products {@render arrow()}</A
					>
					<A
						href="mailto:sales@abtl.com?subject=Custom%20tag%20and%20label%20quote"
						class="group inline-flex items-center justify-center gap-[22px] text-[17px] leading-[1.4] font-medium text-[#5300ff] no-underline transition-[background-color,transform] duration-[180ms] motion-reduce:transition-none max-[1100px]:gap-3.5 max-[1100px]:text-[15px]"
						>Request a Quote {@render arrow()}</A
					>
				</Div>
			</Div>
			<Div class="-mr-[8%] -ml-[10%] max-[800px]:mx-auto max-[800px]:max-w-[540px]"
				><Img
					src="/images/tag-label-hero.webp"
					alt="An ivory Allen-Bailey hang tag with natural twine beside a roll of barcode labels"
					width="1536"
					height="1024"
					fetchpriority="high"
					class="block h-auto w-full [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent),linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [mask-composite:intersect] mix-blend-multiply"
				/></Div
			>
		</Container>
	</Section>
	<Section
		id="industries"
		class="rounded-t-[36px] bg-white max-[800px]:rounded-t-3xl"
		aria-labelledby="industries-heading"
	>
		<Container class="pt-16 pb-20 max-[800px]:pt-12 max-[800px]:pb-14 [&>p:first-child]:mb-3.5">
			<P
				class="mt-0 mb-7 text-xs leading-normal font-bold tracking-[2.8px] text-[#62697c] uppercase max-[800px]:mb-[22px] max-[800px]:text-[10px] max-[800px]:tracking-[2px]"
				>Industries</P
			>
			<H2
				id="industries-heading"
				class="m-0 text-[clamp(32px,3.3vw,48px)] leading-[1.15] font-bold tracking-[-1.9px] text-[#0a0a0c]"
				>Made for the way you work.</H2
			>
			<Div
				class="mt-12 grid grid-cols-4 gap-8 max-[800px]:grid-cols-2 max-[800px]:gap-x-6 max-[380px]:grid-cols-1"
			>
				{#each industries as industry (industry.name)}
					<Article class="border-t border-[#dddfe7] pt-6"
						><Span class="text-xs tracking-[1px] text-[#5300ff]">{industry.number}</Span><H3
							class="mt-6 mb-3 text-2xl font-semibold tracking-[-0.7px] text-[#121219]"
							>{industry.name}</H3
						><P class="m-0 text-[17px] leading-[1.65] text-[#62697c]">{industry.description}</P
						></Article
					>
				{/each}
			</Div>
		</Container>
	</Section>
	<Section id="products" aria-labelledby="products-heading">
		<Container class="pt-16 pb-20 max-[800px]:pt-12 max-[800px]:pb-14 [&>p:first-child]:mb-3.5">
			<P
				class="mt-0 mb-7 text-xs leading-normal font-bold tracking-[2.8px] text-[#62697c] uppercase max-[800px]:mb-[22px] max-[800px]:text-[10px] max-[800px]:tracking-[2px]"
				>Products</P
			><H2
				id="products-heading"
				class="m-0 text-[clamp(32px,3.3vw,48px)] leading-[1.15] font-bold tracking-[-1.9px] text-[#0a0a0c]"
				>Find your next essential.</H2
			>
			<Div class="mt-10 grid grid-cols-3 gap-7 max-[800px]:grid-cols-1 max-[800px]:gap-4">
				{#each products as product (product)}
					<Article
						class="rounded-2xl border border-[#e0e0e8] bg-white p-7 [&>a]:mt-5 [&>a]:justify-between [&>a]:text-[15px] [&>h3]:mt-0"
						><H3 class="mt-6 mb-3 text-2xl font-semibold tracking-[-0.7px] text-[#121219]"
							>{product}</H3
						><A
							href={`mailto:sales@abtl.com?subject=${encodeURIComponent(product + ' inquiry')}`}
							class="group inline-flex items-center justify-center gap-[22px] text-[17px] leading-[1.4] font-medium text-[#5300ff] no-underline transition-[background-color,transform] duration-[180ms] motion-reduce:transition-none max-[1100px]:gap-3.5 max-[1100px]:text-[15px]"
							>Explore {product.toLowerCase()} {@render arrow()}</A
						></Article
					>
				{/each}
			</Div>
		</Container>
	</Section>
	<Section
		id="capabilities"
		class="bg-[#141321] [&>div>h2]:text-white [&>div>p:first-child]:text-[#b8aedc] [&>div>p:nth-of-type(2)]:text-[#c2c0d0]"
		aria-labelledby="capabilities-heading"
	>
		<Container class="pt-16 pb-20 max-[800px]:pt-12 max-[800px]:pb-14 [&>p:first-child]:mb-3.5"
			><P
				class="mt-0 mb-7 text-xs leading-normal font-bold tracking-[2.8px] text-[#62697c] uppercase max-[800px]:mb-[22px] max-[800px]:text-[10px] max-[800px]:tracking-[2px]"
				>Capabilities</P
			><H2
				id="capabilities-heading"
				class="m-0 text-[clamp(32px,3.3vw,48px)] leading-[1.15] font-bold tracking-[-1.9px] text-[#0a0a0c]"
				>Your details. Our craft.</H2
			><P class="mt-6 mb-8 max-w-[610px] text-[17px] leading-[1.65] text-[#62697c]"
				>Tell us what your tag or label needs to do. Let's explore the options for your project.</P
			><A
				href="mailto:sales@abtl.com?subject=Custom%20project%20inquiry"
				class="inline-flex items-center justify-center gap-[22px] rounded-full bg-[#5300ff] px-[30px] py-[18px] text-[17px] leading-[1.4] font-medium whitespace-nowrap text-white no-underline transition-[background-color,transform] duration-[180ms] hover:-translate-y-0.5 hover:bg-[#4000d4] motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-[1100px]:gap-3.5 max-[1100px]:px-6 max-[1100px]:py-4 max-[1100px]:text-[15px]"
				>Let's talk about your project {@render arrow()}</A
			></Container
		>
	</Section>
	<Section id="resources" aria-labelledby="resources-heading">
		<Container class="pt-16 pb-20 max-[800px]:pt-12 max-[800px]:pb-14 [&>p:first-child]:mb-3.5">
			<P
				class="mt-0 mb-7 text-xs leading-normal font-bold tracking-[2.8px] text-[#62697c] uppercase max-[800px]:mb-[22px] max-[800px]:text-[10px] max-[800px]:tracking-[2px]"
				>Resources</P
			><H2
				id="resources-heading"
				class="m-0 text-[clamp(32px,3.3vw,48px)] leading-[1.15] font-bold tracking-[-1.9px] text-[#0a0a0c]"
				>A little guidance goes a long way.</H2
			><P class="mt-6 mb-8 max-w-[610px] text-[17px] leading-[1.65] text-[#62697c]"
				>Questions about choosing a product or preparing artwork? Talk with our team about your next
				step.</P
			><A
				href="mailto:sales@abtl.com"
				class="group inline-flex items-center justify-center gap-[22px] text-[17px] leading-[1.4] font-medium text-[#5300ff] no-underline transition-[background-color,transform] duration-[180ms] motion-reduce:transition-none max-[1100px]:gap-3.5 max-[1100px]:text-[15px]"
				>Contact our team {@render arrow()}</A
			>
		</Container>
	</Section>
</Main>
