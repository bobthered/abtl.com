<script lang="ts">
	// Imports
	import { Button, Details, Div, Label, P, Range, Span, Summary } from '#lib/components';
	import { defaultSettings } from './scene.js';
	import { SlidersHorizontal } from '#lib/icons';
	import type { TagSettings } from './scene.js';
	import { theme } from 'sveltewind/theme';

	// Types
	type Props = { settings: TagSettings };

	// $props()
	let { settings = $bindable() }: Props = $props();
</script>

<Details open class={theme.resolve('tagSettings')}>
	<Summary class="flex cursor-pointer items-center justify-between gap-4 font-semibold">
		Tag settings <SlidersHorizontal aria-hidden="true" class="size-4" />
	</Summary>
	<Div class="mt-5 space-y-5">
		<Div class="space-y-2">
			<Label for="tag-max-distance" class="flex justify-between gap-4"
				>Max distance <Span>{settings.maxDistance}px</Span></Label
			>
			<Range
				id="tag-max-distance"
				min={Math.max(0, settings.closestDistance)}
				max={1600}
				step={20}
				bind:value={settings.maxDistance}
				isLabelVisible={false}
			/>
		</Div>
		<Div class="space-y-2">
			<Label for="tag-closest-distance" class="flex justify-between gap-4"
				>Closest distance <Span>{settings.closestDistance}px</Span></Label
			>
			<Range
				id="tag-closest-distance"
				min={-300}
				max={Math.min(500, settings.maxDistance)}
				step={20}
				bind:value={settings.closestDistance}
				isLabelVisible={false}
			/>
			<P class="text-xs">Negative distances bring tags toward you.</P>
		</Div>
		<Div class="space-y-2">
			<Label for="tag-blur-scale" class="flex justify-between gap-4"
				>Blur scale <Span>{settings.blurScale.toFixed(1)}×</Span></Label
			>
			<Range
				id="tag-blur-scale"
				min={0}
				max={4}
				step={0.1}
				bind:value={settings.blurScale}
				isLabelVisible={false}
			/>
		</Div>
		<Div class="space-y-2">
			<Label for="tag-count" class="flex justify-between gap-4"
				>Tag count <Span>{settings.tagCount}</Span></Label
			>
			<Range
				id="tag-count"
				min={0}
				max={36}
				step={1}
				bind:value={settings.tagCount}
				isLabelVisible={false}
			/>
		</Div>
		<Div class="space-y-2">
			<Label for="tag-parallax-speed" class="flex justify-between gap-4"
				>Parallax speed <Span>{settings.parallaxSpeed.toFixed(1)}×</Span></Label
			>
			<Range
				id="tag-parallax-speed"
				min={0}
				max={3}
				step={0.1}
				bind:value={settings.parallaxSpeed}
				isLabelVisible={false}
			/>
		</Div>
		<Button
			variants={['ghost']}
			onclick={() => {
				settings = { ...defaultSettings };
			}}>Reset defaults</Button
		>
	</Div>
</Details>
