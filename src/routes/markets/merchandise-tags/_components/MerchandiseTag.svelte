<script lang="ts">
	// Imports
	import { AttachmentFastening, G, Path, Svg } from '#lib/components';
	import { merchandiseSizes, type MerchandiseSize } from './sizes';
	import shapeSvg from './merchandise-tag.svg?raw';
	import { twMerge } from 'tailwind-merge';

	// consts
	const silhouette = shapeSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let {
		colorClass,
		colorId,
		isSizeComparison = false,
		size = merchandiseSizes[3]
	}: {
		colorClass: string;
		colorId: string;
		isSizeComparison?: boolean;
		size?: MerchandiseSize;
	} = $props();

	// $derived
	const artworkHeight = $derived(isSizeComparison ? size.length * 104 : 300);
	const artworkWidth = $derived((artworkHeight * size.width) / size.length);
	// Source coordinates come directly from the supplied 80 x 128 SVG and its hole center.
	const holePosition = $derived({
		x: 240 - artworkWidth / 2 + (39.8788 * artworkWidth) / 80,
		y: 496 - artworkHeight + (17.6982 * artworkHeight) / 128
	});
</script>

<Svg
	viewBox="0 0 480 520"
	class="size-full overflow-visible"
	aria-hidden="true"
	focusable="false"
	data-merchandise-color={colorId}
	data-merchandise-size={size.number}
>
	<G
		transform={`translate(${240 - artworkWidth / 2} ${496 - artworkHeight}) scale(${artworkWidth / 80} ${artworkHeight / 128})`}
	>
		<Path
			d={silhouette}
			fill-rule="evenodd"
			clip-rule="evenodd"
			class={twMerge(
				'fill-current stroke-gray-950/15 drop-shadow-xl transition-colors duration-300 motion-reduce:transition-none',
				colorClass
			)}
			data-merchandise-outline
		/>
	</G>
	<!-- Align the shared string's attachment point (90.5, 124.5) with the actual hole. -->
	<G
		transform={`translate(${holePosition.x - 90.5 * 0.85} ${holePosition.y - 124.5 * 0.85}) scale(0.85)`}
	>
		<AttachmentFastening kind="knotted" variant="#5 white" />
	</G>
</Svg>
