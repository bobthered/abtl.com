<script lang="ts">
	// Imports
	import type { AttachmentKind } from './options';
	import { AttachmentFastening, Circle, Defs, G, Mask, Path, Rect, Svg } from '#lib/components';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import shapeSvg from '#lib/assets/tag-shape.svg?raw';
	import { twMerge } from 'tailwind-merge';

	// consts
	const maskId = $props.id();
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];
	const shapePath = shapeSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let {
		kind,
		patchClass = 'text-tag-brown',
		stringFinish = 'looped',
		variant = ''
	}: {
		kind: AttachmentKind;
		patchClass?: string;
		stringFinish?: 'looped' | 'knotted';
		variant?: string;
	} = $props();

	// $derived
	const isBrass = $derived(variant.includes('brass'));
	const ringRadius = $derived(variant.startsWith('3/8') ? 26 : variant.startsWith('1/4') ? 21 : 18);
</script>

<Svg
	viewBox="0 0 400 440"
	class="h-full w-full overflow-visible"
	aria-hidden="true"
	focusable="false"
>
	<Defs>
		<Mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="237" height="474">
			<Rect width="237" height="474" class="fill-white" />
			<Circle
				cx="117.745"
				cy="35.5908"
				r={kind === 'eyelets' ? ringRadius - 6 : 11.275}
				class="fill-black"
			/>
		</Mask>
	</Defs>
	<Circle cx="200" cy="220" r="158" class="fill-primary-500/5" />
	<Circle cx="200" cy="220" r="116" class="fill-none stroke-primary-500/15 stroke-1" />
	<G transform="translate(124 108) scale(0.64)" class="drop-shadow-lg" data-attachment-tag>
		<G mask={`url(#${maskId})`}>
			<Path d={shapePath} fill-rule="evenodd" class="fill-white stroke-gray-400/40 stroke-1" />
			<Path
				d={patchPath}
				transform="translate(94.1475 0.057)"
				fill-rule="evenodd"
				class={twMerge('fill-current stroke-gray-950/15 stroke-1', patchClass)}
				data-attachment-patch
			/>
			{#if kind === 'eyelets'}
				<Circle
					cx="117.745"
					cy="35.5908"
					r={ringRadius}
					class={isBrass
						? 'fill-amber-300 stroke-amber-700 stroke-2'
						: 'fill-gray-300 stroke-gray-500 stroke-2'}
				/>
				<Circle
					cx="117.745"
					cy="35.5908"
					r={ringRadius - 6}
					class="fill-none stroke-white/60 stroke-1"
				/>
			{/if}
			<Path d="M28 114H209 M28 126H159" class="fill-none stroke-primary-500 stroke-4" />
			<Path
				d="M28 182H183 M28 208H209 M28 234H174 M28 260H195"
				class="fill-none stroke-gray-300 stroke-2"
			/>
			<Path d="M28 340H209V408H28Z" class="fill-primary-500/5" />
			<Path
				d="M44 356V393 M52 356V393 M67 356V393 M75 356V393 M88 356V393 M99 356V393 M106 356V393 M123 356V393 M136 356V393 M143 356V393 M156 356V393 M172 356V393 M188 356V393"
				class="fill-none stroke-primary-700 stroke-4"
			/>
		</G>
	</G>
	{#if kind === 'wire' || kind === 'string' || kind === 'elastic'}
		<G transform="translate(109.36 5.78)">
			<AttachmentFastening
				kind={kind === 'wire' ? 'wired' : kind === 'string' ? stringFinish : 'knotted'}
				{variant}
			/>
		</G>
	{:else}
		<Circle
			cx="199.36"
			cy="130.78"
			r="33"
			class="fill-none stroke-secondary-500/50 stroke-1"
			stroke-dasharray="4 5"
		/>
		<Path d="M227 113L279 77H329" class="fill-none stroke-secondary-500 stroke-1" />
		<Circle cx="329" cy="77" r="3" class="fill-secondary-500" />
	{/if}
</Svg>
