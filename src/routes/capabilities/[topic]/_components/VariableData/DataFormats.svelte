<script lang="ts">
	// Imports
	import { Button, Div, H3, Img, P, Section } from '#lib/components';
	import { Barcode, QrCode, ScanLine, Type } from '#lib/icons';
	import type { TicketExample } from './ticketExamples';

	// consts
	const formats = [
		{
			id: 'text',
			label: 'Printed text',
			icon: Type,
			heading: 'Ready to read at a glance.',
			text: 'Keep names, numbers, and references visible to the person handling the piece. Pair readable text with a code when both people and scanners need the same information.'
		},
		{
			id: 'barcode',
			label: 'Code 128',
			icon: Barcode,
			heading: 'A familiar format for a scanning workflow.',
			text: 'Use a linear barcode to carry a reference for your existing system. Tell us the barcode format and the scanner or application that needs to read it.'
		},
		{
			id: 'qr',
			label: 'QR code',
			icon: QrCode,
			heading: 'A small square with a next step.',
			text: 'A QR code can carry an identifier, text, or a web address you provide. Decide what should change from piece to piece and what the scan should return.'
		},
		{
			id: 'matrix',
			label: 'Data Matrix',
			icon: ScanLine,
			heading: 'A compact code for the reference that matters.',
			text: 'Data Matrix can pair a printed reference with a compact two-dimensional code, as in the tag above. Choose the code around the information and the system reading it.'
		}
	];

	// $props()
	let { record }: { record: TicketExample } = $props();

	// $state
	let selectedFormatId = $state('barcode');

	// $derived
	const format = $derived(formats.find((item) => item.id === selectedFormatId)!);
	const payload = $derived(`${record.number}/${record.reference}`);
</script>

<Section
	variants={['dialogSection']}
	data-variable-section="formats"
	aria-labelledby="variable-formats-heading"
>
	<Div class="grid items-center gap-4 lg:grid-cols-2">
		<Div
			class="order-2 rounded-sm bg-linear-to-br from-primary-100 via-gray-100 to-secondary-100 p-6 sm:p-10 lg:order-1 dark:from-primary-950 dark:via-gray-900 dark:to-secondary-950"
		>
			<Div
				class="flex min-h-80 flex-col items-center justify-center gap-6 rounded-sm bg-white p-6 text-center text-gray-950 shadow-sm"
				aria-live="polite"
				aria-atomic="true"
				data-variable-format={format.id}
			>
				<P class="text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-500">
					One reference. {format.label}.
				</P>
				{#if format.id === 'text'}
					<P
						class="font-mono text-3xl font-semibold break-all text-gray-950 sm:text-4xl dark:text-gray-950"
					>
						{payload}
					</P>
				{:else}
					<Img
						src={format.id === 'barcode'
							? record.barcode
							: format.id === 'qr'
								? record.qr
								: record.masterCode}
						alt={`${format.label} encoding ${payload}`}
						width={format.id === 'barcode' ? 320 : 176}
						height={format.id === 'barcode' ? 100 : 176}
						class={format.id === 'barcode'
							? 'h-24 w-full max-w-80 object-contain'
							: 'size-44 object-contain'}
						data-variable-format-code
					/>
					<P class="font-mono text-lg text-gray-950 dark:text-gray-950">{payload}</P>
				{/if}
			</Div>
			<P class="mt-4 text-center text-xs text-gray-600 dark:text-gray-300">
				All four examples carry the same sample reference. Change the tag selection above to compare
				another.
			</P>
		</Div>
		<Div class="order-1 lg:order-2">
			<P variants={['eyebrow']}>Human-readable. Machine-readable.</P>
			<H3 id="variable-formats-heading" class="text-4xl sm:text-5xl">
				Choose how your data is read.
			</H3>
			<P variants={['dialogBody']} class="mt-6">
				The information comes first. The format should suit the person, scanner, or system using it.
			</P>
			<Div class="mt-8 flex flex-wrap gap-4" role="group" aria-label="Compare data formats">
				{#each formats as option (option.id)}
					<Button
						variants={['neutral-outline', ...(option.id === selectedFormatId ? ['selected'] : [])]}
						aria-pressed={option.id === selectedFormatId}
						onclick={() => (selectedFormatId = option.id)}
					>
						<option.icon class="size-5" aria-hidden="true" />{option.label}
					</Button>
				{/each}
			</Div>
			<Div class="mt-8" aria-live="polite">
				<P class="text-lg font-semibold">{format.heading}</P><P
					class="mt-3 text-gray-600 dark:text-gray-300"
				>
					{format.text}
				</P>
			</Div>
			<P class="mt-6 text-sm text-gray-500 dark:text-gray-400">
				Share the exact values, code type, and intended scanning use when planning your project.
			</P>
		</Div>
	</Div>
</Section>
