<script lang="ts">
	// Imports
	import {
		Div,
		ProcessArtwork,
		ShippingGlobe,
		Skeleton,
		Span,
		StockTag,
		StockTagColumns,
		VariableDataPreview,
		WarehouseScene,
		WeatherTag
	} from '#lib/components';
	import { stockColors } from '#lib/data/stockColors.js';
	import type { Topic } from '#lib/data/topics.js';
	import { twMerge } from 'tailwind-merge';

	// consts
	const artworkOrbClass =
		'absolute aspect-5/4 w-3/4 rounded-full bg-radial to-transparent blur-2xl';
	const bentoLayerClass =
		'absolute h-32 w-48 animate-none sm:h-40 sm:w-60 rounded-sm bg-gray-200 inset-ring-1 inset-ring-gray-300 dark:bg-gray-700 dark:inset-ring-gray-600 motion-safe:transition-transform motion-safe:duration-500';
	const bentoTagClass =
		'absolute h-48 w-24 animate-none sm:h-56 sm:w-28 rounded-sm bg-gray-200 inset-ring-1 inset-ring-gray-300 dark:bg-gray-700 dark:inset-ring-gray-600 motion-safe:transition-transform motion-safe:duration-500';

	// $props()
	let { isDialogPreview = false, kind }: { isDialogPreview?: boolean; kind: Topic['preview'] } =
		$props();
</script>

<Div
	class={isDialogPreview
		? 'relative flex h-56 w-full items-center justify-center overflow-visible sm:h-72 lg:h-80'
		: 'relative flex h-72 w-full items-center justify-center overflow-clip [clip-path:inset(0_round_0_0_var(--radius-sm)_var(--radius-sm))] [overflow-clip-margin:var(--spacing)] motion-safe:transition-[clip-path] motion-safe:duration-300 motion-safe:group-hover:[clip-path:inset(0_calc(-1*var(--spacing))_calc(-1*var(--spacing))_round_0_0_var(--radius-sm)_var(--radius-sm))] motion-safe:group-focus-visible:[clip-path:inset(0_calc(-1*var(--spacing))_calc(-1*var(--spacing))_round_0_0_var(--radius-sm)_var(--radius-sm))] sm:h-80 lg:h-96'}
	aria-hidden="true"
>
	{#if ['globe', 'weather', 'process'].includes(kind)}
		<Div
			class="pointer-events-none absolute inset-0 overflow-hidden mask-t-from-50% mask-t-to-95%"
			data-artwork-glow
		>
			<Div
				class={twMerge(
					artworkOrbClass,
					'from-primary-400/20 dark:from-primary-500/15',
					kind === 'weather'
						? 'top-2/3 right-0 -translate-y-1/2'
						: 'top-2/3 left-0 -translate-y-1/2'
				)}
			/>
			<Div
				class={twMerge(
					artworkOrbClass,
					'from-secondary-400/20 dark:from-secondary-500/15',
					kind === 'weather'
						? 'top-1/3 left-0 -translate-y-1/2'
						: 'top-1/3 right-0 -translate-y-1/2'
				)}
			/>
			{#if kind === 'process'}
				<Div
					class={twMerge(
						artworkOrbClass,
						'from-gray-400/15 dark:from-gray-200/20',
						'top-1/2 left-1/2 -translate-1/2'
					)}
				/>
			{/if}
		</Div>
	{/if}
	{#if kind === 'globe'}
		<Div class="relative h-full w-full">
			<ShippingGlobe class="absolute inset-0 aspect-auto h-full w-full" />
			<!--
			<Span
				class="absolute right-4 bottom-4 text-xs text-gray-500 dark:text-gray-400"
			>
				Actual destinations
			</Span>
			-->
		</Div>
	{:else if kind === 'columns'}
		<StockTagColumns />
	{:else if kind === 'fan'}
		<!-- Retained as an alternate preview for future use. -->
		<Div class="relative flex h-full w-full items-end justify-center" data-stock-fan>
			{#each stockColors as color (color.id)}
				<Div
					class={twMerge(
						'absolute top-1/2 -mt-3 w-24 origin-bottom -translate-y-1/2 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:-mt-6 motion-safe:group-focus-visible:-mt-6 sm:w-32 lg:w-36',
						color.fanClass
					)}
					data-stock-color={color.id}
				>
					<StockTag class={color.className} />
				</Div>
			{/each}
		</Div>
	{:else if kind === 'data'}
		<VariableDataPreview />
	{:else if kind === 'warehouse'}
		<WarehouseScene
			isPreview
			class="motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105"
		/>
	{:else if kind === 'weather'}
		<WeatherTag isPreview />
	{:else if kind === 'process'}
		<Div class="relative h-full w-full">
			<ProcessArtwork isPreview />
			<Div
				class="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-300"
			>
				<Span>C</Span><Span>M</Span><Span>Y</Span><Span>K</Span>
			</Div>
		</Div>
	{:else if kind === 'print'}
		<Skeleton class={bentoTagClass}>
			<Div
				class="absolute inset-x-4 top-16 space-y-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1"
			>
				<Skeleton variants={['bento']} class="h-3 w-full bg-gray-400 dark:bg-gray-500" />
				<Skeleton variants={['bento']} class="h-3 w-3/4 bg-gray-400 dark:bg-gray-500" />
				<Skeleton variants={['bento']} class="h-12 w-full bg-gray-400 dark:bg-gray-500" />
			</Div>
		</Skeleton>
	{:else if kind === 'layers'}
		<Skeleton
			class={twMerge(
				bentoLayerClass,
				'translate-y-6 rotate-12 bg-gray-300 motion-safe:group-hover:translate-y-8 motion-safe:group-hover:rotate-16 motion-safe:group-focus-visible:translate-y-8 motion-safe:group-focus-visible:rotate-16 dark:bg-gray-600'
			)}
		/>
		<Skeleton
			class={twMerge(
				bentoLayerClass,
				'translate-y-3 -rotate-6 bg-gray-100 motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:-rotate-9 motion-safe:group-focus-visible:-translate-y-1.5 motion-safe:group-focus-visible:-rotate-9 dark:bg-gray-800'
			)}
		/>
		<Skeleton class={bentoLayerClass} />
	{:else if kind === 'shape'}
		<Div class="rounded-sm p-6 inset-ring-1 inset-ring-gray-300 dark:inset-ring-gray-600">
			<Skeleton
				class={twMerge(
					bentoTagClass,
					'relative motion-safe:group-hover:rotate-3 motion-safe:group-focus-visible:rotate-3'
				)}
			/>
		</Div>
	{:else if kind === 'feed'}
		<Div
			class="flex gap-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-4 motion-safe:group-focus-visible:translate-x-4"
		>
			{#each [0, 1, 2, 3] as tag (tag)}
				<Skeleton class={twMerge(bentoTagClass, 'relative shrink-0')} />
			{/each}
		</Div>
	{:else}
		<Div
			class="flex flex-col gap-3 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-2 motion-safe:group-focus-visible:-translate-y-2"
		>
			{#each ['001', '002', '003'] as number (number)}
				<Skeleton variants={['bento']} class="flex h-16 w-56 items-center justify-between px-6">
					<Skeleton variants={['bento']} class="h-2 w-12 bg-gray-400 dark:bg-gray-500" />
					<Span class="font-mono text-xs text-gray-600 dark:text-gray-300">{number}</Span>
				</Skeleton>
			{/each}
		</Div>
	{/if}
</Div>
