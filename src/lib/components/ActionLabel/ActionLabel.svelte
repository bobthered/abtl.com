<script lang="ts">
	// Imports
	import { ChevronRight, Minus } from '#lib/icons';
	import type { Snippet } from 'svelte';
	import { Span } from '#lib/components';
	import { twMerge } from 'tailwind-merge';

	// Types
	type Props = {
		children: Snippet;
		class?: string;
	};

	// $props()
	let { children, class: className = '' }: Props = $props();
</script>

<Span class={twMerge('inline-flex items-center justify-center gap-2', className)}>
	{@render children()}
	<Span class="relative inline-flex h-4 w-6 shrink-0" aria-hidden="true">
		<!-- Map Lucide's x=5..19 shaft to 10..18px: it grows 8px rightward from the chevron's initial tip. -->
		<Minus
			viewBox="-12.5 0 42 24"
			preserveAspectRatio="none"
			class="absolute h-4 w-6 origin-[41.666667%_50%] scale-x-0 transition-transform duration-200 in-[:is(a,button):is(:hover,:focus-visible):not(:disabled)]:scale-x-100 motion-reduce:transition-none"
		/>
		<ChevronRight
			class="size-4 transition-transform duration-200 in-[:is(a,button):is(:hover,:focus-visible):not(:disabled)]:translate-x-2 motion-reduce:transition-none"
		/>
	</Span>
</Span>
