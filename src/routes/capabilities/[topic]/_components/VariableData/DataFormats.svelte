<script lang="ts">
	// Imports
	import { Button, Circle, Div, H3, Img, Logo, P, Path, Section, Span, Svg } from '#lib/components';
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
				class="relative isolate overflow-hidden rounded-sm bg-stone-50 text-gray-950 shadow-lg inset-ring-1 inset-ring-gray-950/10"
				aria-live="polite"
				aria-atomic="true"
				data-variable-format={format.id}
				data-variable-designed-label
			>
				<Div class="relative overflow-hidden bg-abtl-blue-700 px-6 py-5 text-white">
					<Svg
						viewBox="0 0 240 120"
						class="pointer-events-none absolute inset-y-0 right-0 h-full w-3/4 text-primary-200/30"
						aria-hidden="true"
					>
						<Circle cx={150} cy={60} r={44} fill="none" stroke="currentColor" stroke-width={1} />
						<Circle cx={190} cy={60} r={44} fill="none" stroke="currentColor" stroke-width={1} />
						<Circle cx={230} cy={60} r={44} fill="none" stroke="currentColor" stroke-width={1} />
						<Path
							d="M0 105L105 0M45 120L165 0"
							fill="none"
							stroke="currentColor"
							stroke-width={1}
						/>
					</Svg>
					<Div class="relative flex items-center justify-between gap-4">
						<Logo class="w-16" blueColor="#ffffff" redColor="#ffffff" aria-hidden="true" />
						<Div class="text-right">
							<P class="text-xs font-semibold tracking-widest text-white uppercase dark:text-white">
								Variable data
							</P><Span class="mt-1 block text-xs text-white/70">Printed for a purpose.</Span>
						</Div>
					</Div>
				</Div>
				<Div
					class="h-2 bg-linear-to-r from-primary-300 via-secondary-200 to-primary-100"
					aria-hidden="true"
				/>
				<Div
					class="relative flex h-88 flex-none flex-col items-center justify-center gap-5 px-6 py-8 text-center"
				>
					<Svg
						viewBox="0 0 360 260"
						class="pointer-events-none absolute inset-0 size-full text-abtl-blue-700/5"
						aria-hidden="true"
					>
						<Circle
							cx={0}
							cy={260}
							r={140}
							fill="none"
							stroke="currentColor"
							stroke-width={1}
						/><Circle
							cx={0}
							cy={260}
							r={170}
							fill="none"
							stroke="currentColor"
							stroke-width={1}
						/><Circle cx={0} cy={260} r={200} fill="none" stroke="currentColor" stroke-width={1} />
					</Svg>
					<P
						class="relative text-xs font-semibold tracking-widest text-abtl-blue-700 uppercase dark:text-abtl-blue-700"
					>
						One reference. {format.label}.
					</P>
					{#if format.id === 'text'}
						<P
							class="relative font-mono text-3xl font-semibold break-all text-gray-950 sm:text-4xl dark:text-gray-950"
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
								? 'relative h-24 w-full max-w-80 object-contain mix-blend-multiply'
								: 'relative size-44 object-contain mix-blend-multiply'}
							data-variable-format-code
						/>
						<P class="relative font-mono text-lg text-gray-950 dark:text-gray-950">{payload}</P>
					{/if}
				</Div>
				<Div
					class="flex items-end justify-between gap-4 border-t border-abtl-blue-700/15 px-6 py-4 text-abtl-blue-700"
				>
					<Div class="min-w-0">
						<Span class="block text-xs font-semibold tracking-widest uppercase">
							Prepared for
						</Span><P class="mt-1 text-sm text-abtl-blue-700 dark:text-abtl-blue-700">
							{record.name}
						</P>
					</Div>
					<Div class="text-right">
						<Span class="block text-xs font-semibold tracking-widest uppercase">Pieces</Span><P
							class="mt-1 font-mono text-sm text-abtl-blue-700 dark:text-abtl-blue-700"
						>
							{record.pieces}
						</P>
					</Div>
				</Div>
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
