<script lang="ts">
	// Imports
	import { abstractScene } from '#lib/attachments';
	import { Button, Canvas, Container, Div, P, Span } from '#lib/components';
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
			action: 'Twist the current',
			description: 'Move to part the points. Click or press Space to twist the current.',
			name: 'Helical current'
		},
		{
			action: 'Turn the knot',
			description: 'Drag to turn the knot. Click or press Space to shift its shape.',
			name: 'Torus knot'
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
		<Div
			class="pointer-events-none absolute inset-0 overflow-hidden"
			aria-hidden="true"
			data-scene-background
		>
			<Div
				class="absolute inset-0 bg-radial from-primary-500/10 via-primary-500/5 to-transparent mask-r-from-0% mask-r-to-100% dark:from-primary-400/10 dark:via-primary-400/5"
			/>
			<Div
				class="absolute inset-0 bg-radial from-secondary-500/10 via-secondary-500/5 to-transparent mask-l-from-0% mask-l-to-100% dark:from-secondary-400/10 dark:via-secondary-400/5"
			/>
		</Div>
		<Container class="h-full">
			<Span class="hidden text-primary-500 dark:text-primary-400" data-scene-color="primary" />
			<Span
				class="hidden text-secondary-500 dark:text-secondary-400"
				data-scene-color="secondary"
			/>
			<Canvas
				{@attach abstractScene}
				bind:element={canvas}
				class="relative h-full w-full cursor-crosshair touch-pan-y rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-300"
				tabindex={0}
				role="img"
				aria-label={`${current.name}. Interactive abstract artwork. Arrow keys move the interaction point; Space sends an effect.`}
				aria-describedby="metric-animation-instructions"
				data-abstract-canvas
			>
				{current.name}: interactive artwork. Use the controls below to explore.
			</Canvas>
		</Container>
	</Div>
	<Container
		class="flex flex-col items-center justify-between gap-6 pt-6 pb-20 text-center sm:flex-row sm:text-left lg:pb-28"
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
	</Container>
</Div>
