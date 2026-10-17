<script lang="ts">
	// Imports
	import {
		Circle,
		ClipPath,
		Defs,
		Ellipse,
		G,
		LinearGradient,
		Path,
		Rect,
		Stop,
		Svg,
		Text
	} from '#lib/components';
	import { twMerge } from 'tailwind-merge';

	// consts
	const controlId = $props.id();

	// $props()
	let {
		concept,
		isFlat = false,
		title
	}: { concept: string; isFlat?: boolean; title: string } = $props();

	// $derived
	const inkClass = $derived(concept === 'citrus' ? 'fill-orange-950' : 'fill-white');
</script>

{#snippet label()}
	<Rect
		width="200"
		height="244"
		class={concept === 'coast'
			? 'fill-cyan-950'
			: concept === 'citrus'
				? 'fill-orange-100'
				: 'fill-indigo-950'}
	/>
	{#if concept === 'coast'}
		<Circle cx="146" cy="80" r="38" class="fill-amber-200" />
		<Path d="M0 105Q50 77 100 105T200 105V244H0Z" class="fill-cyan-700" />
		<Path d="M0 134Q50 106 100 134T200 134V244H0Z" class="fill-cyan-500" />
		<Path d="M0 164Q50 136 100 164T200 164V244H0Z" class="fill-cyan-200" />
		<Path d="M0 193Q50 165 100 193T200 193V244H0Z" class="fill-cyan-950" />
	{:else if concept === 'citrus'}
		<Circle cx="38" cy="117" r="62" class="fill-orange-500" /><Circle
			cx="38"
			cy="117"
			r="49"
			class="fill-amber-300 stroke-orange-100"
			stroke-width="3"
		/>
		<Path
			d="M38 68V166M-11 117H87M3 82L73 152M3 152L73 82"
			class="stroke-orange-100"
			stroke-width="3"
		/>
		<Path d="M108 146Q125 76 192 67Q183 136 108 146" class="fill-green-800" />
		<Circle cx="161" cy="218" r="67" class="fill-orange-400" />
	{:else}
		<Circle cx="145" cy="100" r="42" class="fill-violet-200" /><Circle
			cx="161"
			cy="86"
			r="37"
			class="fill-indigo-950"
		/>
		{#each [[25, 70], [72, 98], [109, 56], [181, 47], [38, 134], [164, 161], [83, 157]] as point, index (index)}<Circle
				cx={point[0]}
				cy={point[1]}
				r="1.5"
				class="fill-violet-200"
			/>{/each}
		<Path d="M0 207L54 166L102 210L153 174L200 200V244H0Z" class="fill-violet-800" />
	{/if}
	<G class={concept === 'citrus' ? 'fill-orange-950' : 'fill-white'}>
		<Text x="18" y="28" class={twMerge('font-sans text-[7px] tracking-widest', inkClass)}>
			YOUR BREWERY / DESIGN CONCEPT
		</Text>
		<Text
			x="18"
			y="54"
			class={twMerge('font-sans text-[19px] font-bold tracking-tight', inkClass)}
			data-beer-title
		>
			{title}
		</Text>
		<Text x="18" y="226" class={twMerge('font-sans text-[8px] tracking-widest', inkClass)}>
			CRAFT BEER LABEL CONCEPT
		</Text>
	</G>
{/snippet}

<Svg
	viewBox="0 0 480 520"
	class="size-full"
	aria-hidden="true"
	focusable="false"
	data-beer-artwork={concept}
	data-beer-view={isFlat ? 'flat' : 'can'}
>
	<Defs>
		<LinearGradient id={`${controlId}-metal`}>
			<Stop offset="0" stop-color="#9ca3af" /><Stop offset="0.22" stop-color="#f9fafb" /><Stop
				offset="0.65"
				stop-color="#e5e7eb"
			/><Stop offset="1" stop-color="#9ca3af" />
		</LinearGradient>
		<LinearGradient id={`${controlId}-shade`}>
			<Stop offset="0" stop-color="#000" stop-opacity="0.22" /><Stop
				offset="0.25"
				stop-color="#fff"
				stop-opacity="0.08"
			/><Stop offset="0.65" stop-color="#fff" stop-opacity="0" /><Stop
				offset="1"
				stop-color="#000"
				stop-opacity="0.24"
			/>
		</LinearGradient>
		<ClipPath id={`${controlId}-label`}><Rect width="200" height="244" /></ClipPath>
	</Defs>
	<Ellipse cx="240" cy="474" rx={isFlat ? 145 : 114} ry="12" class="fill-gray-950/10" />
	{#if isFlat}
		<G transform="translate(90 77) scale(1.5)" class="drop-shadow-xl">
			<G clip-path={`url(#${controlId}-label)`}>{@render label()}</G>
		</G>
	{:else}
		<G class="drop-shadow-xl">
			<Path
				d="M158 69Q151 91 140 112V428Q140 453 158 462H322Q340 453 340 428V112Q329 91 322 69Z"
				fill={`url(#${controlId}-metal)`}
			/>
			<Ellipse
				cx="240"
				cy="69"
				rx="82"
				ry="13"
				fill={`url(#${controlId}-metal)`}
				class="stroke-gray-400"
			/>
			<Ellipse cx="240" cy="69" rx="69" ry="8" class="fill-gray-300 stroke-gray-400" />
			<Ellipse cx="240" cy="69" rx="22" ry="5" class="fill-gray-400 stroke-gray-500" />
			<G transform="translate(140 141)">
				<G clip-path={`url(#${controlId}-label)`}>{@render label()}</G><Rect
					width="200"
					height="244"
					fill={`url(#${controlId}-shade)`}
				/>
			</G>
			<Path d="M155 436Q240 447 325 436" class="fill-none stroke-white/70" stroke-width="3" />
		</G>
	{/if}
</Svg>
