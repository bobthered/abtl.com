<script lang="ts">
	// Imports
	import { Br, Card, Div, H3, H4, Img, P, Section, Span, StockTag } from '#lib/components';
	import type { TicketExample } from './ticketExamples';

	// consts
	const applications = [
		{
			id: 'identify',
			eyebrow: 'Identification',
			title: 'Keep the item and its record together.',
			text: 'Give equipment, inventory, or individual pieces a reference that can be read at a glance and matched to your records.',
			detail: 'Item IDs / Batch references / Inspection records'
		},
		{
			id: 'personalize',
			eyebrow: 'Personalization',
			title: 'Make the handoff feel personal.',
			text: 'Change a name, destination, or message while keeping the look consistent across the printed pieces.',
			detail: 'Names / Locations / Individual messages'
		},
		{
			id: 'connect',
			eyebrow: 'Scannable information',
			title: 'Give the next step a starting point.',
			text: 'Use a printed code to carry an identifier or a destination you supply. Plan the information around what the person scanning needs next.',
			detail: 'Reference numbers / Product details / Instructions'
		}
	];

	// $props()
	let { record }: { record: TicketExample } = $props();
</script>

<Section
	variants={['dialogSection']}
	data-variable-section="applications"
	aria-labelledby="variable-applications-heading"
>
	<P variants={['eyebrow']}>Built around the application</P>
	<H3 id="variable-applications-heading" class="max-w-3xl text-4xl sm:text-5xl">
		Give each piece a purpose.
	</H3>
	<P variants={['dialogBody']} class="mt-6">
		The changing information can do more than distinguish one piece from another. It can help
		identify an item, address a person, or guide the next step.
	</P>
	<Div class="mt-10 grid gap-4 lg:grid-cols-3">
		{#each applications as application (application.id)}
			<Card
				class="flex min-w-0 flex-col p-0 shadow-none inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-800"
			>
				<Div
					class="flex h-64 items-center justify-center overflow-hidden rounded-t-sm bg-linear-to-br from-primary-100 via-gray-100 to-secondary-100 p-6 dark:from-primary-950 dark:via-gray-800 dark:to-secondary-950"
					aria-hidden="true"
				>
					{#if application.id === 'identify'}
						<Div class="w-full max-w-64 -rotate-3 rounded-sm bg-white p-5 text-gray-950 shadow-lg">
							<P
								class="text-xs font-semibold tracking-widest text-gray-950 uppercase dark:text-gray-950"
							>
								Equipment record
							</P>
							<P class="mt-4 font-mono text-xl text-gray-950 dark:text-gray-950">
								{record.number}/{record.reference}
							</P>
							<Img
								src={record.barcode}
								alt=""
								width={320}
								height={100}
								class="mt-4 h-12 w-full object-contain"
							/>
						</Div>
					{:else if application.id === 'personalize'}
						<Div class="relative w-28 rotate-6">
							<StockTag class="w-full text-secondary-200 drop-shadow-lg" />
							<Div class="absolute inset-x-3 top-1/3 text-center text-gray-950">
								<P class="text-xs font-semibold text-gray-950 dark:text-gray-950">Made for</P>
								<P
									class="mt-3 text-lg leading-tight font-semibold text-gray-950 dark:text-gray-950"
								>
									{record.name}
								</P>
								<Span class="mt-5 block text-xs tracking-widest uppercase">Thank you</Span>
							</Div>
						</Div>
					{:else}
						<Div
							class="flex w-full max-w-60 rotate-3 items-center gap-4 rounded-sm bg-white p-5 text-gray-950 shadow-lg"
						>
							<Img src={record.qr} alt="" width={88} height={88} class="size-22 shrink-0" />
							<Div>
								<P class="text-sm font-semibold text-gray-950 dark:text-gray-950">
									Scan.<Br />Find the reference.
								</P><Span class="mt-3 block font-mono text-xs">{record.reference}</Span>
							</Div>
						</Div>
					{/if}
				</Div>
				<Div class="flex flex-1 flex-col p-6">
					<P class="text-sm font-semibold text-primary-600 dark:text-primary-300">
						{application.eyebrow}
					</P>
					<H4 class="mt-3 text-2xl leading-tight">{application.title}</H4>
					<P class="mt-4 text-gray-600 dark:text-gray-300">{application.text}</P>
					<P class="mt-auto pt-6 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
						{application.detail}
					</P>
				</Div>
			</Card>
		{/each}
	</Div>
	<P class="mt-4 text-xs text-gray-500 dark:text-gray-400">
		Illustrative printed pieces. The sample codes contain a reference, rather than a live website
		destination.
	</P>
</Section>
