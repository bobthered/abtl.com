<script lang="ts">
	// Imports
	import { BentoItem, Figcaption, Figure, Marquee, StockTag } from '#lib/components';
	import { stockColorGroups } from './stockColors';

	// consts
	const colors = stockColorGroups.flatMap((group) => group.colors);
</script>

<Marquee ariaLabel="Stock tag colors" items={colors}>
	{#snippet renderItem(color)}
		<BentoItem
			isInteractive={false}
			isExpandVisible={false}
			surface="neutral"
			class="w-48 shrink-0 p-6 sm:w-56"
			data-stock-marquee-color={color.id}
		>
			<Figure class="flex flex-col items-center gap-6 text-center">
				<StockTag class={`${color.className} w-24 sm:w-32`} />
				<Figcaption class="min-h-10 text-sm font-medium">{color.name}</Figcaption>
			</Figure>
		</BentoItem>
	{/snippet}
</Marquee>
