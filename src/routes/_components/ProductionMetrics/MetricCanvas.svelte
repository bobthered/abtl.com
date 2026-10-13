<script lang="ts">
	// Imports
	import { abstractScene } from '#lib/attachments';
	import { Canvas, Container, Div, Span } from '#lib/components';

	// consts
	const scenes = [
		{
			description: 'Move to bend the current. Click or press Space to send a pulse.',
			name: 'Flow field'
		},
		{
			description: 'Drag to turn the ribbons. Click or press Space to shift their orbit.',
			name: 'Orbital ribbons'
		},
		{
			description: 'Move to part the points. Click or press Space to twist the current.',
			name: 'Helical current'
		},
		{
			description: 'Drag to turn the knot. Click or press Space to shift its shape.',
			name: 'Torus knot'
		}
	];

	// $props()
	let { scene = 0, selection = 0 }: { scene?: number; selection?: number } = $props();

	// $state
	let canvas = $state<HTMLCanvasElement | null>(null);

	// $derived
	const current = $derived(scenes[scene]);

	// $effects
	$effect(() => {
		if (!canvas || selection < 0) return;
		canvas.dispatchEvent(new CustomEvent('scene-select', { detail: scene }));
	});
</script>

<Div
	id="metric-animation-panel"
	role="region"
	aria-label="Interactive abstract animations"
	data-metric-animation={scene}
>
	<Div class="relative h-80 sm:h-96 lg:h-120" data-scene-surface>
		<Container class="h-full">
			<Span class="hidden text-primary-600 dark:text-primary-400" data-scene-color="primary" />
			<Span
				class="hidden text-secondary-600 dark:text-secondary-400"
				data-scene-color="secondary"
			/>
			<Canvas
				{@attach abstractScene}
				bind:element={canvas}
				class="relative h-full w-full cursor-crosshair touch-pan-y rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-300"
				tabindex={0}
				role="img"
				aria-label={`${current.name}. ${current.description} Arrow keys move the interaction point.`}
				data-abstract-canvas
			>
				{current.name}: {current.description}
			</Canvas>
		</Container>
	</Div>
</Div>
