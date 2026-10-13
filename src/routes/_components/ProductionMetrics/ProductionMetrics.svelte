<script lang="ts">
	// Imports
	import { Button, Container, Div, H2, P, Section, Span } from '#lib/components';
	import MetricCanvas from './MetricCanvas.svelte';
	import { stockColors } from '#lib/data/stockColors.js';

	// consts
	const indicatorPositions = [
		'left-0 top-0 lg:left-0',
		'left-1/2 top-0 lg:left-1/4',
		'left-0 top-1/2 lg:left-1/2 lg:top-0',
		'left-1/2 top-1/2 lg:left-3/4 lg:top-0'
	];
	const metricRuleClass =
		'absolute inset-x-0 h-px bg-linear-to-r from-primary-500 via-secondary-500 to-primary-500 mask-x-from-70% mask-x-to-100% dark:from-primary-400 dark:via-secondary-400 dark:to-primary-400';
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
		<Div
			class="relative isolate grid grid-cols-2 border-y border-gray-200 lg:grid-cols-4 dark:border-gray-800"
			data-metric-grid
		>
			<Div
				class={[
					'pointer-events-none absolute -z-10 h-1/2 w-1/2 transition-all duration-500 ease-out motion-reduce:transition-none lg:h-full lg:w-1/4',
					indicatorPositions[activeIndex]
				].join(' ')}
				aria-hidden="true"
				data-scroll-reveal="off"
				data-metric-highlight
			>
				<Span class={[metricRuleClass, 'top-0'].join(' ')} />
				<Span class={[metricRuleClass, 'bottom-0'].join(' ')} />
			</Div>
			{#each metrics as metric, index (metric.label)}
				<Button
					type="button"
					aria-controls="metric-animation-panel"
					aria-pressed={selectedIndex === index}
					variants={['ghost']}
					class="relative flex min-w-0 flex-col items-center justify-start gap-4 rounded-sm bg-transparent px-4 py-10 text-center font-normal text-gray-600 no-underline transition-colors duration-500 hover:bg-transparent hover:text-gray-950 focus:bg-transparent focus:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 data-[active=true]:text-gray-950 motion-reduce:transition-none sm:px-6 lg:py-12 dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-gray-50 dark:focus:bg-transparent dark:focus:text-gray-50 dark:focus-visible:outline-primary-300 dark:data-[active=true]:text-gray-50"
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
					<Span
						class="block text-5xl leading-none font-light tracking-tight whitespace-nowrap tabular-nums sm:text-6xl"
					>
						{#if metric.prefix}
							<Span class="mr-2 text-sm font-medium tracking-normal sm:text-base">
								{metric.prefix}
							</Span>
						{/if}
						<Span data-count-up={metric.value}>{metric.value}</Span>{metric.suffix}
					</Span>
					<Span class="block max-w-56 text-sm leading-relaxed sm:text-base">
						{metric.description}
					</Span>
				</Button>
			{/each}
		</Div>
	</Container>
	<MetricCanvas scene={selectedIndex} selection={selectionRevision} />
</Section>
