<script lang="ts">
	// Imports
	import { Card, Div, H3, H4, LightboxImage, P, Section } from '#lib/components';
	import identification from './artwork/applications/identification.webp';
	import personalization from './artwork/applications/personalization.webp';
	import scannable from './artwork/applications/scannable.webp';

	// consts
	const applications = [
		{
			id: 'identify',
			image: identification,
			alt: 'Kraft pouches with original indigo inventory labels and barcodes',
			caption: 'Identification - illustrative inventory labels on kraft packaging.',
			eyebrow: 'Identification',
			title: 'Keep the item and its record together.',
			text: 'Give equipment, inventory, or individual pieces a reference that can be read at a glance and matched to your records.',
			detail: 'Item IDs / Batch references / Inspection records'
		},
		{
			id: 'personalize',
			image: personalization,
			alt: 'A personalized ivory hang tag on an oatmeal knit garment',
			caption:
				'Personalization - an illustrative garment tag with a name and individual reference.',
			eyebrow: 'Personalization',
			title: 'Make the handoff feel personal.',
			text: 'Change a name, destination, or message while keeping the look consistent across the printed pieces.',
			detail: 'Names / Locations / Individual messages'
		},
		{
			id: 'connect',
			image: scannable,
			alt: 'An equipment tag with an original QR label attached to a coiled cable',
			caption: 'Scannable information - an illustrative equipment identification label.',
			eyebrow: 'Scannable information',
			title: 'Give the next step a starting point.',
			text: 'Use a printed code to carry an identifier or a destination you supply. Plan the information around what the person scanning needs next.',
			detail: 'Reference numbers / Product details / Instructions'
		}
	];
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
				<LightboxImage
					src={application.image}
					alt={application.alt}
					caption={application.caption}
					width={1200}
					height={900}
					class="h-auto"
					imageClass="aspect-4/3 h-auto min-h-0 flex-none"
					data-variable-application-image={application.id}
				/>

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
		Illustrative product scenes. Explore live sample codes in the format comparison below.
	</P>
</Section>
