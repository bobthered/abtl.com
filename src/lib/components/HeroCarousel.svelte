<script lang="ts">
	// Imports
	import {
		A,
		Carousel,
		Container,
		Div,
		G,
		H1,
		H2,
		P,
		Path,
		Span,
		Svg,
		TagMachine
	} from '#lib/components';
	import { ArrowRight, Factory, Flame, ShoppingBag, Wheat } from '#lib/icons';
	import { heroCarouselTheme } from '#lib/theme.js';
	import { theme } from 'sveltewind/theme';

	// consts
	const sectors = [
		{ color: 'text-tag-blue-dark', icon: Factory, label: 'Industrial', use: 'Identify & organize' },
		{
			color: 'text-tag-green-light',
			icon: Wheat,
			label: 'Agriculture',
			use: 'From field to market'
		},
		{ color: 'text-tag-salmon', icon: Flame, label: 'Fire safety', use: 'Record & communicate' },
		{ color: 'text-tag-lilac', icon: ShoppingBag, label: 'Retail', use: 'Make your mark' }
	];

	// $props()
	let { autoplayInterval = 8000 }: { autoplayInterval?: number } = $props();
</script>

{#snippet arrow()}
	<ArrowRight aria-hidden="true" class={theme.resolve('svg', ['arrow'])} />
{/snippet}

{#snippet actions(href: string, label: string)}
	<Div class="mt-8 flex flex-wrap items-center gap-4 lg:mt-10 lg:gap-6">
		<A {href} variants={['button.base', 'button.variant.cta']}>{label} {@render arrow()}</A>
		<A
			href="mailto:sales@abtl.com?subject=Custom%20tag%20and%20label%20quote"
			variants={['button.base', 'button.variant.outline', 'button.variant.cta']}
			>Request a Quote {@render arrow()}</A
		>
	</Div>
{/snippet}

{#snippet production()}
	<Container variants={['heroSlide']}>
		<Div>
			<P variants={['eyebrow']}>Made with purpose</P>
			<H1 variants={['hero']}
				><Span class="block">Small details.</Span><Span class="block">Lasting impressions.</Span
				></H1
			>
			<P variants={['lead']}>Stock and custom tags and labels for the way your business works.</P>
			{@render actions('#products', 'Explore Products')}
		</Div>
		<TagMachine />
	</Container>
{/snippet}

{#snippet custom()}
	<Container variants={['heroSlide']}>
		<Div>
			<P variants={['eyebrow']}>Your details. Your design.</P>
			<H2 variants={['hero']}
				><Span class="block">Make it yours.</Span><Span class="block">Down to the details.</Span
				></H2
			>
			<P variants={['lead']}
				>Start with an idea. Explore colors, artwork, and finishing details for a tag that feels
				like your brand.</P
			>
			{@render actions('#capabilities', 'Explore Custom Options')}
		</Div>
		<Div class="min-w-0">
			<Svg
				viewBox="0 0 600 360"
				role="img"
				aria-label="Illustrative custom tag designs in blue, ivory, and red, with reinforced holes and clipped top corners"
				class="h-auto w-full"
			>
				<Path d="M80 300Q300 260 520 300Q300 355 80 300Z" variants={['machineShadow']} />
				{#each [{ color: 'text-abtl-blue-500', rotation: -18, x: 125, y: 72 }, { color: 'text-tag-manila', rotation: 0, x: 250, y: 45 }, { color: 'text-abtl-red-500', rotation: 18, x: 375, y: 72 }] as design (design.x)}
					<G
						transform={`translate(${design.x} ${design.y}) rotate(${design.rotation} 50 100)`}
						class={design.color}
					>
						<Path
							d="M12 0H88L100 12V200H0V12Z M56 25a6 6 0 1 1-12 0a6 6 0 1 1 12 0Z"
							fill="currentColor"
							fill-rule="evenodd"
						/>
						<Path
							d="M66 25a16 16 0 1 1-32 0a16 16 0 1 1 32 0Z M56 25a6 6 0 1 1-12 0a6 6 0 1 1 12 0Z"
							fill-rule="evenodd"
							variants={['machinePatch']}
						/>
						<Path
							d="M20 100H80V106H20Z M20 116H66V120H20Z M20 150H80V152H20Z M20 162H72V164H20Z M20 174H60V176H20Z"
							class={design.x === 250 ? 'fill-abtl-blue-700' : 'fill-white'}
						/>
						<Path
							d="M20 64H28V82H20Z M33 64H41V82H33Z M46 64H54V82H46Z"
							class={design.x === 250 ? 'fill-abtl-red-600' : 'fill-white/60'}
						/>
					</G>
				{/each}
			</Svg>
			<P variants={['artworkCaption']}>Color. Print. Finish. A world of possibilities.</P>
		</Div>
	</Container>
{/snippet}

{#snippet industries()}
	<Container variants={['heroSlide']}>
		<Div>
			<P variants={['eyebrow']}>Built around your business</P>
			<H2 variants={['hero']}
				><Span class="block">Different industries.</Span><Span class="block"
					>One small essential.</Span
				></H2
			>
			<P variants={['lead']}
				>From identifying equipment to presenting your brand, find tags and labels for the work you
				do.</P
			>
			{@render actions('#industries', 'Find Your Industry')}
		</Div>
		<Div class="grid min-w-0 grid-cols-2 gap-4 sm:gap-6">
			{#each sectors as sector (sector.label)}
				<Div class={theme.resolve('heroIndustry')}>
					<Div class="flex items-center justify-between gap-4">
						<sector.icon
							aria-hidden="true"
							class="size-7 text-primary-500 dark:text-primary-300"
							strokeWidth={1.5}
						/>
						<Svg
							viewBox="0 0 50 100"
							aria-hidden="true"
							class={`h-20 w-10 -rotate-12 ${sector.color}`}
						>
							<Path
								d="M6 0H44L50 6V100H0V6Z M28 12a3 3 0 1 1-6 0a3 3 0 1 1 6 0Z"
								fill="currentColor"
								fill-rule="evenodd"
							/>
							<Path
								d="M33 12a8 8 0 1 1-16 0a8 8 0 1 1 16 0Z M28 12a3 3 0 1 1-6 0a3 3 0 1 1 6 0Z"
								fill-rule="evenodd"
								variants={['machinePatch']}
							/>
							<Path
								d="M10 40H40V43H10Z M10 50H30V52H10Z M10 65H40V67H10Z"
								variants={['machineInk']}
							/>
						</Svg>
					</Div>
					<P variants={['industryTitle']}>{sector.label}</P>
					<P variants={['industryUse']}>{sector.use}</P>
				</Div>
			{/each}
		</Div>
	</Container>
{/snippet}

<Carousel
	label="Allen-Bailey highlights"
	theme={heroCarouselTheme}
	isAutoplay
	isLooping
	{autoplayInterval}
	slides={[
		{ content: production, id: 'production', label: 'Made with purpose' },
		{ content: custom, id: 'custom', label: 'Custom tags and labels' },
		{ content: industries, id: 'industries', label: 'Tags for your industry' }
	]}
/>
