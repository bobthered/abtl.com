<script lang="ts">
	// Imports
	import { Div, H3, P, Section, Span, Table, Tbody, Td, Th, Thead, Tr } from '#lib/components';
	import { Check, FileSpreadsheet } from '#lib/icons';
	import { ticketExamples } from './ticketExamples';

	// consts
	const steps = [
		{
			number: '01',
			title: 'Mark what stays and what changes.',
			text: 'Separate the fixed artwork from changing fields such as names, references, or codes. Show where each field belongs.'
		},
		{
			number: '02',
			title: 'Keep each record together.',
			text: 'Use clear column names and one record per row. Preserve leading zeros and include the exact text each code should contain.'
		},
		{
			number: '03',
			title: 'Check the pieces that differ.',
			text: 'Include a representative sample of the data with your artwork. Review long values, numbering, and the intended scan result when discussing a proof.'
		}
	];
</script>

<Section
	variants={['dialogSection']}
	data-variable-section="planning"
	aria-labelledby="variable-planning-heading"
>
	<Div class="grid items-center gap-4 lg:grid-cols-2">
		<Div>
			<P variants={['eyebrow']}>From data to the printed piece</P>
			<H3 id="variable-planning-heading" class="text-4xl sm:text-5xl">
				Good print starts with clear data.
			</H3>
			<P variants={['dialogBody']} class="mt-6">
				Bring the design and a sample of the changing information together. A little clarity at the
				start makes the printing conversation more useful.
			</P>
			<Div class="mt-8 space-y-6">
				{#each steps as step (step.number)}
					<Div class="flex gap-4">
						<Span
							class="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary-100 font-mono text-sm text-primary-700 dark:bg-primary-950 dark:text-primary-300"
						>
							{step.number}
						</Span><Div>
							<P class="font-semibold">{step.title}</P><P
								class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
							>
								{step.text}
							</P>
						</Div>
					</Div>
				{/each}
			</Div>
		</Div>
		<Div
			class="min-w-0 rounded-sm bg-linear-to-br from-primary-100 via-gray-100 to-secondary-100 p-6 sm:p-10 dark:from-primary-950 dark:via-gray-900 dark:to-secondary-950"
		>
			<Div class="rounded-sm bg-white p-5 shadow-sm dark:bg-gray-900">
				<P class="flex items-center gap-2 font-semibold">
					<FileSpreadsheet class="size-5 text-primary-500" aria-hidden="true" />A clear starting
					point
				</P>
				<Div
					class="mt-5 overflow-x-auto rounded-sm inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-700"
				>
					<Table class="w-full text-left text-xs" aria-label="Illustrative variable-data rows">
						<Thead>
							<Tr>
								<Th scope="col" class="p-3">Number</Th><Th scope="col" class="p-3">Reference</Th><Th
									scope="col"
									class="p-3"
								>
									Name
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{#each ticketExamples.slice(0, 3) as row (row.reference)}<Tr>
									<Td class="p-3 font-mono">{row.number}</Td><Td class="p-3 font-mono">
										{row.reference}
									</Td><Td class="p-3 whitespace-nowrap">{row.name}</Td>
								</Tr>{/each}
						</Tbody>
					</Table>
				</Div>
				<Div class="mt-6 space-y-3 text-sm">
					{#each ['Fixed artwork identified', 'Changing fields named', 'Code contents supplied'] as item (item)}<P
							class="flex items-start gap-2 text-sm"
						>
							<Check class="mt-0.5 size-4 shrink-0 text-primary-500" aria-hidden="true" />{item}
						</P>{/each}
				</Div>
				<P class="mt-6 text-xs text-gray-500 dark:text-gray-400">
					Illustrative data only. Share a small, relevant sample to start the discussion.
				</P>
			</Div>
		</Div>
	</Div>
</Section>
