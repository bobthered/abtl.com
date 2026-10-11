<script lang="ts">
	// Imports
	import { A, Container, Div, H2, P, Section, Span } from '#lib/components';
	import { stockColors } from '#lib/components/BentoSection/stockColors.js';

	// consts
	const indicatorPositions = [
		'left-0 top-0 lg:left-0',
		'left-1/2 top-0 lg:left-1/4',
		'left-0 top-1/2 lg:left-1/2 lg:top-0',
		'left-1/2 top-1/2 lg:left-3/4 lg:top-0'
	];
	const metrics = [
		{
			description: 'tags produced last year',
			href: 'mailto:sales@abtl.com?subject=Tag%20project%20quote',
			label: 'Over 90 million tags produced last year. Discuss your project.',
			suffix: 'M+',
			value: 90
		},
		{
			description: 'states served, plus international shipping',
			href: '/tags/shipping',
			label: 'All 50 states served, plus international shipping. Explore shipping.',
			suffix: '',
			value: 50
		},
		{
			description: 'stock colors to make your message stand out',
			href: '/tags/stock-colors',
			label: `${stockColors.length} stock colors. Explore stock color options.`,
			suffix: '',
			value: stockColors.length
		},
		{
			description: 'printing colors for full color on both sides',
			href: '/tags/full-color-printing',
			label: 'Up to 8 printing colors for full color on both sides. Explore printing.',
			prefix: 'Up to',
			suffix: '',
			value: 8
		}
	];

	// $state
	let activeIndex = $state(0);
</script>

<Section
	variants={['surfaceAlternate']}
	aria-labelledby="production-metrics-heading"
	data-production-metrics
>
	<Container variants={['section']} class="space-y-0">
		<Div class="mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20">
			<H2 id="production-metrics-heading" variants={['section']}>The scale behind every detail.</H2>
			<P class="mt-6 text-lg text-gray-600 dark:text-gray-300">
				From the first impression to the final shipment. Tags and labels made to move your business
				forward.
			</P>
		</Div>
		<Div variants={['metricGrid']} data-metric-grid>
			<Div
				variants={['metricHighlight']}
				class={indicatorPositions[activeIndex]}
				aria-hidden="true"
				data-scroll-reveal="off"
				data-metric-highlight
			>
				<Span variants={['metricRule']} class="top-0" />
				<Span variants={['metricRule']} class="bottom-0" />
			</Div>
			{#each metrics as metric, index (metric.href)}
				<A
					href={metric.href}
					variants={['metric']}
					aria-label={metric.label}
					data-metric-index={index}
					data-active={activeIndex === index}
					onpointerenter={() => {
						activeIndex = index;
					}}
					onfocus={() => {
						activeIndex = index;
					}}
				>
					<Span variants={['metricValue']}>
						{#if metric.prefix}<Span class="mr-2 text-sm font-medium tracking-normal sm:text-base"
								>{metric.prefix}</Span
							>{/if}<Span data-count-up={metric.value}>{metric.value}</Span>{metric.suffix}
					</Span>
					<Span variants={['metricDescription']}>{metric.description}</Span>
				</A>
			{/each}
		</Div>
	</Container>
</Section>
