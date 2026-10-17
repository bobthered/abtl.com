<script lang="ts">
	// Imports
	import { ClipPath, Defs, G, Path, Rect, Svg, SvgDesc, SvgTitle } from '#lib/components';
	import type { Snippet } from 'svelte';
	import stock from './stock.svg?raw';
	import type { SVGAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	// Types
	type Props = Omit<SVGAttributes<SVGSVGElement>, 'children' | 'class'> & {
		background?: Snippet;
		class?: string;
		description?: string;
		header: Snippet;
		isLabelSeparated?: boolean;
		isSeparated?: boolean;
		label: Snippet<[number, number]>;
		stub: Snippet;
		title?: string;
	};

	// consts
	const controlId = $props.id();
	const paths = [...stock.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1]);
	const rows = [88, 160, 232, 304, 376, 448];

	// $props()
	let {
		background,
		class: className = '',
		description,
		header,
		isLabelSeparated = false,
		isSeparated = false,
		label,
		stub,
		title,
		viewBox = '0 0 180 648',
		...restProps
	}: Props = $props();
</script>

{#snippet paper()}
	{#if background}{@render background()}{:else}<Path
			d={paths[0]}
			fill-rule="evenodd"
			class="fill-white"
		/><Path d={paths[1]} fill-rule="evenodd" class="fill-tag-brown" />{/if}
{/snippet}

<Svg
	{...restProps}
	{viewBox}
	width={180}
	height={648}
	class={twMerge('h-auto w-full overflow-visible drop-shadow-lg', className)}
	data-luggage-claim
	data-luggage-label-separated={isLabelSeparated}
	data-luggage-separated={isSeparated}
>
	{#if title}<SvgTitle>{title}</SvgTitle>{/if}{#if description}<SvgDesc>{description}</SvgDesc>{/if}
	<Defs>
		<ClipPath id={`${controlId}-header`}><Rect width="180" height="88" /></ClipPath>
		{#each rows as y, index (y)}<ClipPath id={`${controlId}-label-${index}`}>
				<Rect {y} width="180" height={Math.min(72, 504 - y)} />
			</ClipPath>{/each}
		<ClipPath id={`${controlId}-stub`}><Rect y="504" width="180" height="144" /></ClipPath>
	</Defs>
	<G clip-path={`url(#${controlId}-header)`}>{@render paper()}{@render header()}</G>
	{#each rows as y, index (y)}
		<!-- A stationary backing remains visible when the first label is peeled away. -->
		{#if index === 0 && isLabelSeparated}<G clip-path={`url(#${controlId}-label-${index})`}>
				{@render paper()}
			</G>{/if}
		<G
			class={twMerge(
				'origin-center transition-transform duration-500 ease-out motion-reduce:transition-none',
				index === 0 && isLabelSeparated
					? 'translate-x-28 -translate-y-1 rotate-6'
					: 'translate-x-0 translate-y-0 rotate-0'
			)}
			data-luggage-label={index + 1}
		>
			<G clip-path={`url(#${controlId}-label-${index})`}>
				{@render paper()}{@render label(index, y)}
			</G>
		</G>
	{/each}
	<G
		class={twMerge(
			'origin-center transition-transform duration-500 ease-out motion-reduce:transition-none',
			isSeparated ? 'translate-x-6 translate-y-10 rotate-6' : 'translate-x-0 translate-y-0 rotate-0'
		)}
		data-luggage-stub
	>
		<G clip-path={`url(#${controlId}-stub)`}>{@render paper()}{@render stub()}</G>
	</G>
</Svg>
