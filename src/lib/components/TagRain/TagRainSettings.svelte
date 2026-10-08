<script lang="ts">
	// Imports
	import { Button, Details, Div, Input, Label, P, Range, Span, Summary } from '#lib/components';
	import { defaultRainSettings, settingControls } from './settings';
	import { portal } from 'sveltewind/attachments';
	import { SlidersHorizontal } from '#lib/icons';
	import type { TagRainSettings } from './settings';
	import { theme } from 'sveltewind/theme';

	// $props()
	let {
		isPaused = $bindable(false),
		onclear,
		settings = $bindable()
	}: {
		isPaused?: boolean;
		onclear: () => void;
		settings: TagRainSettings;
	} = $props();
</script>

<Details {@attach portal()} open class={theme.resolve('tagSettings')} data-tag-rain-settings>
	<Summary class="flex cursor-pointer items-center justify-between gap-4 font-semibold">
		Tag rain settings (Dev) <SlidersHorizontal aria-hidden="true" class="size-4" />
	</Summary>
	<Div class="mt-5 space-y-4">
		{#each settingControls as control (control.key)}
			<Div class="space-y-2">
				<Label for={`rain-${control.key}`} class="flex justify-between gap-4">
					{control.label}<Span class="tabular-nums"
						>{Number(settings[control.key]).toFixed(control.decimals)}{control.unit}</Span
					>
				</Label>
				<Div class="flex items-center gap-3">
					<Range
						id={`rain-${control.key}`}
						min={control.min}
						max={control.max}
						step={control.step}
						bind:value={settings[control.key]}
						isLabelVisible={false}
						class="min-w-0 flex-1"
					/>
					<Input
						type="number"
						aria-label={`${control.label} value`}
						min={control.min}
						max={control.max}
						step={control.step}
						bind:value={settings[control.key]}
						class="w-24 shrink-0"
					/>
				</Div>
			</Div>
		{/each}
		<P class="text-xs text-gray-500 dark:text-gray-400">
			X spread widens the drop area left to right; Y spread widens it front to back while keeping
			launch height consistent. Both default to 1x; 0 centers that axis. Spread is limited by the
			scene boundaries. Changes affect new drops without restarting the pile. Higher bending
			stiffness makes moving tags resist bending. Settled tags keep their shape. Thickness changes
			restart the pile. Settings are saved only in this browser during development. The floor
			release interval counts seconds with the floor present; set to 0 to disable. The removal
			period controls how long it stays absent. Tags keep dropping throughout. The production
			counter stays unchanged.
		</P>
		<Div class="flex flex-wrap gap-2">
			<Button
				variants={['ghost']}
				aria-pressed={isPaused}
				onclick={() => {
					isPaused = !isPaused;
				}}
			>
				{isPaused ? 'Resume' : 'Pause'}
			</Button>
			<Button variants={['ghost']} onclick={onclear}>Clear pile</Button>
			<Button
				variants={['ghost']}
				onclick={() => {
					settings = { ...defaultRainSettings };
				}}>Reset defaults</Button
			>
		</Div>
	</Div>
</Details>
