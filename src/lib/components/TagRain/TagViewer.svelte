<script lang="ts">
	// Imports
	import { Button, Canvas, Dialog, Div, H2, P, Span } from '#lib/components';
	import { Rotate3D, X } from '#lib/icons';
	import type { TagSelection } from './physics';
	import type { createTagViewer } from './viewer';

	// helpers
	const initializeViewer = async (target: HTMLCanvasElement, isCurrent: () => boolean) => {
		const { createTagViewer } = await import('./viewer');
		if (!isCurrent() || !isVisible || canvas !== target) return;
		preview = createTagViewer(target, selection);
	};

	// $props()
	let { onclose, selection }: { onclose: () => void; selection: TagSelection } = $props();

	// $state
	let canvas = $state<HTMLCanvasElement | null>(null);
	let isBack = $state(false);
	let isVisible = $state(true);
	let preview = $state.raw<ReturnType<typeof createTagViewer> | null>(null);

	// $effects
	$effect(() => {
		if (!canvas) return;
		let isDisposed = false;
		void initializeViewer(canvas, () => !isDisposed);
		return () => {
			isDisposed = true;
			preview?.destroy();
		};
	});
	$effect(() => {
		preview?.setSide(isBack);
	});
	$effect(() => {
		if (!isVisible) onclose();
	});
</script>

<Dialog
	data-scroll-reveal="off"
	bind:isVisible
	variants={['tagViewer']}
	aria-labelledby="tag-viewer-title"
	data-tag-viewer
>
	<Div class="flex items-start justify-between gap-4">
		<Div>
			<H2 id="tag-viewer-title" class="mb-1 text-xl font-medium capitalize">{selection.name}</H2>
			<P class="m-0 text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
				{isBack ? 'Back' : 'Front'}
				<Span aria-hidden="true">·</Span> 2.625″ × 5.25″
			</P>
		</Div>
		<Button
			variants={['ghost', 'icon']}
			aria-label="Dismiss tag viewer"
			onclick={() => {
				isVisible = false;
			}}
			autofocus
		>
			<X class="size-5" aria-hidden="true" />
		</Button>
	</Div>
	<Canvas
		bind:element={canvas}
		variants={['tagViewer']}
		role="img"
		aria-label={`${selection.name}, ${isBack ? 'back' : 'front'}`}
		data-tag-preview
	/>
	<Div class="flex items-center justify-center gap-4">
		<Button
			onclick={() => {
				isBack = !isBack;
			}}
		>
			<Rotate3D class="size-4" aria-hidden="true" /> Show {isBack ? 'front' : 'back'}
		</Button>
		<Button
			variants={['ghost']}
			onclick={() => {
				isVisible = false;
			}}>Dismiss</Button
		>
	</Div>
</Dialog>
