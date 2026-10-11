<script lang="ts">
	// Imports
	import { abstractScene } from '#lib/attachments';
	import { Button, Canvas, Div, P, Span } from '#lib/components';
	import { Pause, Play } from '#lib/icons';

	// consts
	const scenes = [
		{
			action: 'Send a pulse',
			description: 'Move to bend the current. Click or press Space to send a pulse.',
			name: 'Flow field'
		},
		{
			action: 'Turn the orbits',
			description: 'Drag to turn the ribbons. Click or press Space to shift their orbit.',
			name: 'Orbital ribbons'
		},
		{
			action: 'Ripple the mesh',
			description: 'Move to stretch the mesh. Click or press Space to release a ripple.',
			name: 'Elastic mesh'
		},
		{
			action: 'Fold the field',
			description: 'Move to change the perspective. Click or press Space to fold the prisms.',
			name: 'Prism field'
		}
	];

	// helpers
	const act = () => canvas?.dispatchEvent(new Event('scene-action'));
	const togglePause = () => {
		isPaused = !isPaused;
		canvas?.dispatchEvent(new CustomEvent('scene-pause', { detail: isPaused }));
	};

	// $props()
	let { scene = 0, selection = 0 }: { scene?: number; selection?: number } = $props();

	// $state
	let canvas = $state<HTMLCanvasElement | null>(null);
	let isPaused = $state(false);

	// $derived
	const current = $derived(scenes[scene]);

	// $effects
	$effect(() => {
		if (!canvas) return;
		canvas.dispatchEvent(new CustomEvent('scene-pause', { detail: isPaused }));
	});
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
		<Span class="hidden text-primary-500 dark:text-primary-400" data-scene-color="primary" />
		<Span class="hidden text-secondary-500 dark:text-secondary-400" data-scene-color="secondary" />
		<Span class="hidden text-tertiary-500 dark:text-tertiary-400" data-scene-color="tertiary" />
		<Canvas
			{@attach abstractScene}
			bind:element={canvas}
			class="h-full w-full cursor-crosshair touch-pan-y rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-300"
			tabindex={0}
			role="img"
			aria-label={`${current.name}. Interactive abstract artwork. Arrow keys move the interaction point; Space sends an effect.`}
			aria-describedby="metric-animation-instructions"
			data-abstract-canvas
		>
			{current.name}: interactive artwork. Use the controls below to explore.
		</Canvas>
	</Div>
	<Div
		class="flex flex-col items-center justify-between gap-6 pt-6 text-center sm:flex-row sm:text-left"
	>
		<Div>
			<P class="font-medium" aria-live="polite">{current.name}</P>
			<P id="metric-animation-instructions" class="mt-1 text-sm text-gray-600 dark:text-gray-300"
				>{current.description}</P
			>
		</Div>
		<Div class="flex shrink-0 items-center gap-3">
			<Button variants={['neutral-outline']} onclick={act}>{current.action}</Button>
			<Button
				variants={['ghost', 'icon']}
				onclick={togglePause}
				aria-label={isPaused ? 'Play animation' : 'Pause animation'}
				aria-pressed={isPaused}
			>
				{#if isPaused}<Play class="size-4" aria-hidden="true" />{:else}<Pause
						class="size-4"
						aria-hidden="true"
					/>{/if}
			</Button>
		</Div>
	</Div>
</Div>
