<script lang="ts">
	// Imports
	import { Circle, Div, G, Path, Svg, Text } from '#lib/components';
	import { floatIllustration } from '#lib/attachments';
	import patchSvg from '#lib/assets/tag-patch.svg?raw';
	import shapeSvg from '#lib/assets/tag-shape.svg?raw';
	import { twMerge } from 'tailwind-merge';

	// consts
	const finishes = [
		{
			id: 'patch',
			label: 'PATCH',
			color: 'fill-tag-buff',
			motion:
				'-translate-x-14 -rotate-16 motion-safe:group-hover:-translate-x-24 motion-safe:group-hover:-rotate-24 motion-safe:group-focus-visible:-translate-x-24 motion-safe:group-focus-visible:-rotate-24'
		},
		{
			id: 'wire',
			label: 'WIRE',
			color: 'fill-tag-blue-light',
			motion:
				'-translate-x-7 -rotate-8 motion-safe:group-hover:-translate-x-12 motion-safe:group-hover:-rotate-12 motion-safe:group-focus-visible:-translate-x-12 motion-safe:group-focus-visible:-rotate-12'
		},
		{
			id: 'elastic',
			label: 'ELASTIC',
			color: 'fill-tag-lilac',
			motion:
				'translate-x-14 rotate-16 motion-safe:group-hover:translate-x-24 motion-safe:group-hover:rotate-24 motion-safe:group-focus-visible:translate-x-24 motion-safe:group-focus-visible:rotate-24'
		},
		{
			id: 'string',
			label: 'STRING',
			color: 'fill-tag-green-light',
			motion:
				'translate-x-7 rotate-8 motion-safe:group-hover:translate-x-12 motion-safe:group-hover:rotate-12 motion-safe:group-focus-visible:translate-x-12 motion-safe:group-focus-visible:rotate-12'
		},
		{
			id: 'eyelets',
			label: 'EYELETS',
			color: 'fill-white',
			motion:
				'motion-safe:group-hover:-translate-y-4 motion-safe:group-focus-visible:-translate-y-4'
		}
	];
	const patchPath = patchSvg.match(/\sd="([^"]+)"/)![1];
	const shapePath = shapeSvg.match(/\sd="([^"]+)"/)![1];
</script>

<Div class="relative h-full w-full @min-xl/bento:pl-[40%]" data-attachments-preview>
	<Div class="relative flex h-full w-full items-center justify-center" {@attach floatIllustration}>
		{#each finishes as finish (finish.id)}
			<Div
				class={twMerge(
					'absolute h-64 w-32 origin-[50%_85%] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out sm:h-72 sm:w-36',
					finish.motion
				)}
				data-attachment-fan={finish.id}
			>
				<Svg
					viewBox="0 0 180 360"
					class="size-full overflow-visible drop-shadow-lg"
					aria-hidden="true"
					focusable="false"
				>
					<G transform="translate(25.24 95.425) scale(0.55)">
						<Path
							d={shapePath}
							fill-rule="evenodd"
							class={twMerge('stroke-gray-950/15 stroke-1', finish.color)}
							data-attachment-tag-shape
						/>
						{#if finish.id === 'patch'}
							<Path
								d={patchPath}
								transform="translate(94.1475 0.057)"
								fill-rule="evenodd"
								class="fill-tag-brown"
							/>
						{/if}
					</G>
					{#if finish.id === 'eyelets'}
						<Circle cx={90} cy={115} r={19} class="fill-amber-300 stroke-amber-700 stroke-2" />
						<Circle
							cx={90}
							cy={115}
							r={12}
							class="fill-gray-50 stroke-amber-100 stroke-2 dark:fill-gray-900"
						/>
						<Circle cx={90} cy={115} r={16} class="fill-none stroke-white/70 stroke-1" />
					{:else if finish.id === 'wire'}
						<Path
							d="M88 116C37 91 45 26 86 25C133 23 143 86 94 114L104 96M93 114L108 106"
							class="fill-none stroke-gray-500 stroke-3"
							stroke-linecap="round"
						/>
						<Path
							d="M86 110C47 85 51 33 87 32C123 31 133 84 96 108"
							class="fill-none stroke-gray-200 stroke-1"
						/>
					{:else if finish.id === 'string'}
						<Path
							d="M90 115C35 89 34 20 83 18C140 15 146 84 90 115M90 115C65 91 68 139 90 115C115 90 118 139 90 115M90 115L75 145M90 115L108 144"
							class="fill-none stroke-gray-400 stroke-5"
							stroke-linecap="round"
						/>
						<Path
							d="M90 115C35 89 34 20 83 18C140 15 146 84 90 115"
							class="fill-none stroke-white stroke-3"
						/>
					{:else if finish.id === 'elastic'}
						<Path
							d="M90 115C29 74 44 13 90 13C136 13 151 74 90 115Z"
							class="fill-none stroke-gray-900 stroke-8"
						/>
						<Path
							d="M90 110C40 73 51 22 90 22C129 22 140 73 90 110"
							class="fill-none stroke-gray-500 stroke-2"
						/>
					{/if}
					<G class="fill-gray-950">
						<Text
							x={90}
							y={194}
							text-anchor="middle"
							class="fill-gray-950 font-sans text-sm font-semibold tracking-widest"
						>
							{finish.label}
						</Text>
						<Path
							d="M35 216H145V219H35Z M35 232H120V234H35Z M35 245H135V247H35Z"
							class="fill-gray-950 opacity-25"
						/>
						<Path d="M35 280H145V312H35Z" class="fill-gray-950 opacity-10" />
						<Path
							d="M45 288V304M52 288V304M63 288V304M68 288V304M80 288V304M91 288V304M98 288V304M112 288V304M122 288V304M132 288V304"
							class="fill-none stroke-gray-950 stroke-3"
						/>
					</G>
				</Svg>
			</Div>
		{/each}
	</Div>
</Div>
