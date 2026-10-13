<script lang="ts">
	// Imports
	import { A, Br, Button, Circle, Div, G, Path, Svg, Text } from '#lib/components';
	import { floatIllustration } from '#lib/attachments';
	import { RotateCcw, RotateCw } from '#lib/icons';
	import { terrainPaths } from './terrain.js';

	// helpers
	const rotate = (amount: number) => {
		rotation += amount;
	};

	// $state
	let rotation = $state(-18);

	// $derived
	const layers = $derived(terrainPaths(rotation));
</script>

<Div variants={['illustration']} class="relative overflow-hidden py-6 sm:py-8">
	<Div {@attach floatIllustration}>
		<Svg
			viewBox="0 0 720 520"
			class="h-auto w-full"
			role="img"
			aria-label="Three-dimensional land globe centered on Caledonia and zoomed to New York State"
			data-terrain-rotation={rotation}
		>
			{#each layers as path, index (index)}
				<Path
					d={path}
					class={index < 3
						? 'fill-secondary-600 dark:fill-secondary-400'
						: 'fill-primary-600 dark:fill-primary-400'}
					data-terrain-region={index < 3 ? 'world' : 'new-york'}
					opacity={index % 3 === 0 ? 0.45 : index % 3 === 1 ? 0.65 : 0.85}
					data-terrain-points
				/>
			{/each}
			<G transform="translate(360 260)">
				<Circle
					r="15"
					class="fill-primary-500/10 stroke-primary-600/60 dark:stroke-primary-300/70"
					stroke-width="1"
				/>
				<Circle
					r="6"
					class="fill-none stroke-secondary-600 dark:stroke-secondary-300"
					stroke-width="1.5"
				/>
				<Circle r="2" class="fill-primary-600 dark:fill-primary-200" />
				<Path
					d="M0 -16 V-64"
					class="stroke-primary-600/80 dark:stroke-primary-200/80"
					stroke-width="1"
				/>
				<Text
					x="0"
					y="-80"
					text-anchor="middle"
					class="fill-gray-950 text-sm font-semibold dark:fill-gray-50"
				>
					Caledonia, NY
				</Text>
			</G>
		</Svg>
	</Div>
	<Div class="relative flex flex-wrap items-center justify-between gap-4 px-6 sm:px-8">
		<Div class="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
			New York in primary / world in secondary<Br />
			<A href="https://registry.opendata.aws/terrain-tiles/" class="text-xs">
				Terrain: USGS via Mapzen
			</A>
			<A href="https://gis.ny.gov/civil-boundaries" class="ml-2 text-xs">Boundary: NYS GIS</A>
			<A href="https://www.geonames.org/5111073/caledonia.html" class="ml-2 text-xs">
				Location: GeoNames
			</A>
		</Div>
		<Div class="flex gap-2" role="group" aria-label="Rotate landscape">
			<Button
				variants={['neutral-outline']}
				onclick={() => rotate(-15)}
				aria-label="Rotate landscape left"
			>
				<RotateCcw class="size-4" aria-hidden="true" />
			</Button>
			<Button
				variants={['neutral-outline']}
				onclick={() => rotate(15)}
				aria-label="Rotate landscape right"
			>
				<RotateCw class="size-4" aria-hidden="true" />
			</Button>
		</Div>
	</Div>
</Div>
