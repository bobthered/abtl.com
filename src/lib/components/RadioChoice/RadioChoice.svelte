<script lang="ts" generics="Value extends string | number | boolean">
	// Imports
	import { Check } from '#lib/icons';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { Input, Label, Radio, Span } from '#lib/components';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// Types
	type Props = Omit<HTMLLabelAttributes, 'children' | 'class'> & {
		children: Snippet;
		class?: string;
		contentClass?: string;
		isIndicatorVisible?: boolean;
		group: Value;
		name: string;
		value: Value;
	};

	// $props()
	let {
		'aria-controls': ariaControls,
		'aria-label': ariaLabel,
		children,
		class: className = '',
		contentClass = '',
		group = $bindable(),
		isIndicatorVisible = true,
		name,
		value,
		...restProps
	}: Props = $props();
</script>

{#snippet handle()}
	<!-- Radio's handle replaces its default input; retain the native control here. -->
	<Input
		bind:group
		{name}
		{value}
		type="radio"
		variants={['unstyled']}
		aria-label={ariaLabel}
		aria-controls={ariaControls}
		class="absolute inset-0 z-10 m-0 h-full w-full cursor-pointer rounded-sm opacity-0"
	/>
	{#if isIndicatorVisible && group === value}
		<Check
			class="pointer-events-none absolute top-3 right-3 size-4 text-primary-600 dark:text-primary-300"
			aria-hidden="true"
			data-radio-check
		/>
	{/if}
{/snippet}

<Label
	{...restProps}
	aria-label={ariaLabel}
	class={twMerge(
		'relative isolate flex min-h-11 cursor-pointer items-center gap-3 rounded-sm bg-gray-100 px-4 py-3 pr-10 text-sm font-medium text-gray-950 inset-ring-1 inset-ring-gray-200 hover:bg-gray-200 has-checked:inset-ring-2 has-checked:inset-ring-primary-500 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-primary-600 dark:bg-gray-800 dark:text-gray-50 dark:inset-ring-gray-700 dark:hover:bg-gray-700 dark:has-checked:inset-ring-primary-400 dark:has-focus-visible:outline-primary-300',
		className
	)}
>
	<Radio {handle} />
	<Span
		class={twMerge(
			'pointer-events-none flex w-full min-w-0 flex-wrap items-center gap-3',
			contentClass
		)}
	>
		{@render children()}
	</Span>
</Label>
