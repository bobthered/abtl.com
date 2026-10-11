<script lang="ts">
	// Imports
	import { Canvas, Div, Path, Span, Svg } from '#lib/components';
	import qrModules from '#lib/assets/variable-data/qr-modules.json';
	import { qrScan } from '#lib/attachments';
</script>

<Div
	{@attach qrScan}
	class="relative flex h-full w-full items-center justify-center"
	data-variable-preview
>
	<Canvas
		class="pointer-events-none absolute inset-0 h-full w-full text-primary-400 dark:text-primary-500"
		data-qr-artwork
		aria-hidden="true"
	/>
	<Span
		class="hidden text-secondary-400 dark:text-secondary-500"
		data-qr-accent
		aria-hidden="true"
	/>
	<Div class="relative mx-6 aspect-square w-full max-w-56 sm:max-w-64 xl:max-w-72">
		<Svg
			viewBox={qrModules.viewBox}
			class="size-full text-gray-950 dark:text-gray-50"
			aria-hidden="true"
			data-qr-code
		>
			<Path d={qrModules.path} fill="currentColor" stroke="none" fill-rule="evenodd" />
		</Svg>
		<Canvas
			class="pointer-events-none absolute inset-0 h-full w-full text-primary-500 dark:text-primary-400"
			data-qr-scan
			aria-hidden="true"
		/>
	</Div>
</Div>
