<script lang="ts">
	// Imports
	import {
		A,
		Br,
		Circle,
		Defs,
		Div,
		G,
		Mask,
		Path,
		Rect,
		Svg,
		SvgImage,
		Text
	} from '#lib/components';
	import { floatIllustration } from '#lib/attachments';

	// consts
	const maskId = $props.id();
</script>

<Div variants={['illustration']} class="relative overflow-hidden py-6 sm:py-8">
	<Div {@attach floatIllustration}>
		<Svg
			viewBox="0 0 720 520"
			class="h-auto w-full"
			role="img"
			aria-label="Three-dimensional land globe centered on Caledonia and zoomed to New York State"
		>
			<Defs>
				<Mask
					id={`${maskId}-world`}
					x="0"
					y="0"
					width="720"
					height="520"
					maskUnits="userSpaceOnUse"
				>
					<SvgImage href="/images/about/terrain-world.svg" width="720" height="520" />
				</Mask>
				<Mask
					id={`${maskId}-new-york`}
					x="0"
					y="0"
					width="720"
					height="520"
					maskUnits="userSpaceOnUse"
				>
					<SvgImage href="/images/about/terrain-new-york.svg" width="720" height="520" />
				</Mask>
			</Defs>
			<Rect
				width="720"
				height="520"
				mask={`url(#${maskId}-world)`}
				class="fill-secondary-600 dark:fill-secondary-400"
				data-terrain-region="world"
			/>
			<Rect
				width="720"
				height="520"
				mask={`url(#${maskId}-new-york)`}
				class="fill-primary-600 dark:fill-primary-400"
				data-terrain-region="new-york"
			/>
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
	</Div>
</Div>
