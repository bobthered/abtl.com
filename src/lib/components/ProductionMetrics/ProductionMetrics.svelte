<script lang="ts">
	// Imports
	import { Button, Container, Div, H2, MetricCanvas, P, Section, Span } from '#lib/components';
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
			label: 'Over 90 million tags produced last year. Select animation one.',
			suffix: 'M+',
			value: 90
		},
		{
			description: 'states served, plus international shipping',
			label: 'All 50 states served, plus international shipping. Select animation two.',
			suffix: '',
			value: 50
		},
		{
			description: 'stock colors to make your message stand out',
			label: `${stockColors.length} stock colors. Select animation three.`,
			suffix: '',
			value: stockColors.length
		},
		{
			description: 'printing colors for full color on both sides',
			label: 'Up to 8 printing colors for full color on both sides. Select animation four.',
			prefix: 'Up to',
			suffix: '',
			value: 8
		}
	];

	// $state
	let activeIndex = $state(0);
	let selectedIndex = $state(0);
	let selectionRevision = $state(0);
</script>

<Section
	variants={['surfaceAlternate']}
	aria-labelledby="production-metrics-heading"
	data-production-metrics
>
	<Container variants={['section']} class="space-y-0 pb-0 lg:pb-0">
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
			{#each metrics as metric, index (metric.label)}
				<Button
					type="button"
					aria-controls="metric-animation-panel"
					aria-pressed={selectedIndex === index}
					variants={['ghost', 'metric']}
					aria-label={metric.label}
					data-metric-index={index}
					data-active={activeIndex === index}
					onclick={() => {
						selectedIndex = index;
						selectionRevision += 1;
						activeIndex = index;
					}}
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
				</Button>
			{/each}
		</Div>
	</Container>
	<MetricCanvas scene={selectedIndex} selection={selectionRevision} />
</Section>
