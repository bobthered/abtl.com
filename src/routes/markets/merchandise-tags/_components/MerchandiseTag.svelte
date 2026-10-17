<script lang="ts">
	// Imports
	import { AttachmentFastening, G, Path, Svg } from '#lib/components';
	import { twMerge } from 'tailwind-merge';

	// consts
	// Original scalloped shoulder and open string hole. Coordinates are illustration units.
	const silhouette =
		'M12 300Q0 300 0 288V83Q0 73 8 64L48 15Q55 6 66 9Q76 1 87 6Q98 0 109 7Q121 4 130 15L172 64Q180 73 180 83V288Q180 300 168 300ZM97 32A7 7 0 1 0 83 32A7 7 0 1 0 97 32Z';

	// $props()
	let {
		colorClass,
		colorId,
		scale = 1
	}: { colorClass: string; colorId: string; scale?: number } = $props();
</script>

<Svg
	viewBox="0 0 480 520"
	class="size-full overflow-visible"
	aria-hidden="true"
	focusable="false"
	data-merchandise-color={colorId}
>
	<G
		transform={`translate(240 320) scale(${scale}) translate(-90 -130)`}
		data-merchandise-scale={scale}
	>
		<Path
			d={silhouette}
			fill-rule="evenodd"
			class={twMerge(
				'fill-current stroke-gray-950/15 drop-shadow-xl transition-colors duration-300 motion-reduce:transition-none',
				colorClass
			)}
			data-merchandise-outline
		/>
		<G transform="translate(0 -93)"><AttachmentFastening kind="knotted" variant="#5 white" /></G>
	</G>
</Svg>
