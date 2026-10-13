<script lang="ts">
	// Imports
	import { Button, Circle, Div, G, Path, Polygon, Svg, Text } from '#lib/components';
	import { RotateCcw, RotateCw } from '#lib/icons';
	import { floatIllustration } from '#lib/attachments';

	// consts
	const contours = Array.from({ length: 17 }, (_, level) =>
		Array.from({ length: 97 }, (_, index) => {
			const angle = (index / 96) * Math.PI * 2;
			const radius = 204 - level * 9;
			return {
				x: Math.cos(angle) * radius * (1 + 0.07 * Math.sin(angle * 5 + level * 0.13)),
				y: Math.sin(angle) * radius * 0.83 * (1 + 0.1 * Math.cos(angle * 3)),
				z: level * 3
			};
		})
	);

	// helpers
	const project = (x: number, y: number, z = 0) => {
		const angle = (rotation * Math.PI) / 180;
		const u = x * Math.cos(angle) - y * Math.sin(angle);
		const v = x * Math.sin(angle) + y * Math.cos(angle);
		return `${360 + u},${270 + v * 0.48 - z}`;
	};
	const rotate = (amount: number) => {
		rotation += amount;
	};

	// $state
	let rotation = $state(-25);

	// $derived
	const base = $derived(
		[
			[-245, -210],
			[245, -210],
			[245, 210],
			[-245, 210]
		]
			.map(([x, y]) => project(x, y))
			.join(' ')
	);
	const layers = $derived(
		contours.map(
			(points) => `M${points.map((point) => project(point.x, point.y, point.z)).join(' L')} Z`
		)
	);
</script>

<Div variants={['illustration']} class="relative overflow-hidden px-2 py-8 sm:p-8">
	<Div {@attach floatIllustration}>
		<Svg
			viewBox="0 0 720 480"
			class="h-auto w-full overflow-visible"
			role="img"
			aria-label="Illustrative isometric landscape representing our rural Caledonia roots, not a surveyed map"
		>
			<Polygon
				points={base}
				class="fill-primary-100/70 stroke-primary-300 dark:fill-primary-950 dark:stroke-primary-700"
				stroke-width="1"
			/>
			{#each layers as path, index (index)}
				<Path
					d={path}
					class="fill-primary-200/10 stroke-primary-500/50 dark:fill-primary-400/5 dark:stroke-primary-400/60"
					stroke-width="1"
				/>
			{/each}
			<Path
				d={`M${project(-230, 55, 28)} L${project(230, 55, 28)} M${project(25, -190, 28)} L${project(25, 195, 28)}`}
				class="fill-none stroke-secondary-500/70 dark:stroke-secondary-300/70"
				stroke-width="3"
				stroke-dasharray="5 6"
			/>
			<G transform={`translate(${project(25, 55, 30).replace(',', ' ')})`}>
				<Circle r="18" class="fill-primary-500/15 stroke-primary-500 dark:stroke-primary-300" />
				<Circle r="5" class="fill-primary-600 dark:fill-primary-200" />
				<Path d="M0 -8 V-78" class="stroke-primary-600 dark:stroke-primary-200" stroke-width="2" />
				<Circle cy="-83" r="5" class="fill-secondary-500 dark:fill-secondary-300" />
				<Text x="14" y="-83" class="fill-gray-950 text-sm font-semibold dark:fill-gray-50">
					Caledonia, NY
				</Text>
				<Text x="14" y="-62" class="fill-gray-600 text-xs dark:fill-gray-300">
					Our home. Your starting point.
				</Text>
			</G>
		</Svg>
	</Div>
	<Div class="relative flex items-center justify-between gap-4 px-4">
		<Div class="text-xs text-gray-600 dark:text-gray-300">Illustrative terrain / not to scale</Div>
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
