<script lang="ts">
	// Imports
	import { Div, Skeleton, Span, StockTag, StockTagColumns } from '#lib/components';
	import { stockColors } from './stockColors';
	import type { Topic } from './topics';

	// $props()
	let { isDialogPreview = false, kind }: { isDialogPreview?: boolean; kind: Topic['preview'] } =
		$props();
</script>

<Div variants={[isDialogPreview ? 'bentoDialogPreview' : 'bentoPreview']} aria-hidden="true">
	{#if kind === 'columns'}
		<StockTagColumns />
	{:else if kind === 'fan'}
		<!-- Retained as an alternate preview for future use. -->
		<Div variants={['stockFan']} data-stock-fan>
			{#each stockColors as color (color.id)}
				<Div variants={['stockFanTag']} class={color.fanClass} data-stock-color={color.id}>
					<StockTag class={color.className} />
				</Div>
			{/each}
		</Div>
	{:else if kind === 'print'}
		<Skeleton variants={['bentoTag']}>
			<Div
				class="absolute inset-x-4 top-16 space-y-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1"
			>
				<Skeleton variants={['bento']} class="h-3 w-full bg-gray-400 dark:bg-gray-500" />
				<Skeleton variants={['bento']} class="h-3 w-3/4 bg-gray-400 dark:bg-gray-500" />
				<Skeleton variants={['bento']} class="h-12 w-full bg-gray-400 dark:bg-gray-500" />
			</Div>
		</Skeleton>
	{:else if kind === 'layers'}
		<Skeleton variants={['bentoLayer', 'layerBack']} />
		<Skeleton variants={['bentoLayer', 'layerMiddle']} />
		<Skeleton variants={['bentoLayer']} />
	{:else if kind === 'shape'}
		<Div class="rounded-sm p-6 inset-ring-1 inset-ring-gray-300 dark:inset-ring-gray-600">
			<Skeleton
				variants={['bentoTag']}
				class="relative motion-safe:group-hover:rotate-3 motion-safe:group-focus-visible:rotate-3"
			/>
		</Div>
	{:else if kind === 'feed'}
		<Div
			class="flex gap-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-4 motion-safe:group-focus-visible:translate-x-4"
		>
			{#each [0, 1, 2, 3] as tag (tag)}
				<Skeleton variants={['bentoTag']} class="relative shrink-0" />
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
