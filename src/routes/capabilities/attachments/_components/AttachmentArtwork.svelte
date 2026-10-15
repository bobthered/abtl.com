<script lang="ts">
	// Imports
	import type { AttachmentKind } from './options';
	import { Circle, G, Path, Svg } from '#lib/components';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import shapeSvg from '#lib/assets/tag-shape.svg?raw';

	// consts
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];
	const shapePath = shapeSvg.match(/\sd="([^"]+)"/)![1];

	// $props()
	let { kind }: { kind: AttachmentKind } = $props();
</script>

<Svg
	viewBox="0 0 400 440"
	class="h-full w-full overflow-visible"
	aria-hidden="true"
	focusable="false"
>
	<Circle cx="200" cy="220" r="158" class="fill-primary-500/5" />
	<Circle cx="200" cy="220" r="116" class="fill-none stroke-primary-500/15 stroke-1" />
	<G transform="translate(124 108) scale(0.64)" class="drop-shadow-lg">
		<Path d={shapePath} fill-rule="evenodd" class="fill-white stroke-gray-400/40 stroke-1" />
		{#if kind === 'eyelets'}
			<Circle cx="117.745" cy="35.5908" r="18" class="fill-gray-300 stroke-gray-500 stroke-2" />
			<Circle cx="117.745" cy="35.5908" r="12" class="fill-gray-50 stroke-white stroke-2" />
		{:else}
			<Path
				d={patchPath}
				transform="translate(94.1475 0.057)"
				fill-rule="evenodd"
				class="fill-tag-brown stroke-gray-950/15 stroke-1"
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
	{#if kind === 'wire'}
		<Path
			d="M199 132C145 111 140 46 183 40C246 30 272 94 212 131 M199 132L211 109 M199 132L215 119"
			class="fill-none stroke-gray-500 stroke-2"
			stroke-linecap="round"
		/>
		<Path
			d="M197 129C150 105 149 52 184 46C236 36 262 92 210 127"
			class="fill-none stroke-gray-300 stroke-1"
		/>
	{:else if kind === 'string'}
		<Path
			d="M199 132C141 107 131 30 183 27C242 23 264 92 203 132 M198 131C180 112 179 153 201 134C225 111 229 147 205 134 M201 134L185 160 M204 134L220 159"
			class="fill-none stroke-tag-brown stroke-4"
			stroke-linecap="round"
		/>
		<Path
			d="M199 130C147 102 139 37 184 33C234 29 255 92 204 130"
			class="fill-none stroke-tag-buff stroke-1"
		/>
	{:else if kind === 'elastic'}
		<Path
			d="M201 132C145 92 152 21 201 21C250 21 257 92 201 132Z"
			class="fill-none stroke-gray-500 stroke-8"
			stroke-linecap="round"
		/>
		<Path
			d="M201 132C145 92 152 21 201 21C250 21 257 92 201 132Z"
			class="fill-none stroke-white stroke-6"
			stroke-linecap="round"
		/>
		<Path
			d="M201 127C156 89 161 29 201 29C241 29 246 89 201 127"
			class="fill-none stroke-gray-200 stroke-2"
		/>
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
