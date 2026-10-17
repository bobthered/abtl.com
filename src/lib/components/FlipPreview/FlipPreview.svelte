<script lang="ts">
	// Imports
	import { Button, Div } from '#lib/components';
	import { FlipHorizontal2 } from '#lib/icons';
	import { floatIllustration } from '#lib/attachments';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// $props()
	let {
		artwork,
		buttonAttributes = {},
		class: className = '',
		isBack = $bindable(false),
		viewportClass = ''
	}: {
		artwork: Snippet<[boolean]>;
		buttonAttributes?: Record<string, string>;
		class?: string;
		isBack?: boolean;
		viewportClass?: string;
	} = $props();
</script>

<Div
	class={twMerge('flex h-full min-h-0 w-full flex-col gap-4', className)}
	data-flip-preview
	data-flip-side={isBack ? 'back' : 'front'}
>
	<Div
		class={twMerge('relative min-h-0 flex-1 perspective-distant', viewportClass)}
		data-flip-viewport
	>
		<Div {@attach floatIllustration} class="absolute inset-0">
			<Div
				class={twMerge(
					'relative size-full transition-transform duration-700 ease-out transform-3d motion-reduce:transition-none',
					isBack ? 'rotate-y-180' : 'rotate-y-0'
				)}
				data-flip-rotor
			>
				<Div
					class="absolute inset-0 backface-hidden"
					inert={isBack}
					aria-hidden={isBack}
					data-flip-face="front"
				>
					{@render artwork(false)}
				</Div>
				<Div
					class="absolute inset-0 rotate-y-180 backface-hidden"
					inert={!isBack}
					aria-hidden={!isBack}
					data-flip-face="back"
				>
					{@render artwork(true)}
				</Div>
			</Div>
		</Div>
	</Div>
	<Div class="flex shrink-0 justify-center">
		<Button
			{...buttonAttributes}
			variants={['neutral-outline']}
			onclick={() => (isBack = !isBack)}
			aria-pressed={isBack}
			data-flip-button
		>
			<FlipHorizontal2 class="size-5 rotate-90" aria-hidden="true" />{isBack
				? 'View the face'
				: 'Turn it over'}
		</Button>
	</Div>
</Div>
