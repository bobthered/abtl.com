<script lang="ts">
	// Imports
	import {
		A,
		ActionLabel,
		Address,
		Br,
		Container,
		Div,
		H1,
		H2,
		LightboxImage,
		Main,
		P,
		Section,
		Span
	} from '#lib/components';
	import { contactDetails } from '#lib/data/contact.js';
	import { ContentLayout } from '#lib/layouts';
	import InquiryForm from './_components/InquiryForm.svelte';
	import { Phone } from '#lib/icons';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	// $props()
	let { data, form }: PageProps = $props();

	// $state
	let isReady = $state(false);

	// $effects
	onMount(() => {
		isReady = true;
	});
</script>

<svelte:head>
	<title>Contact | Allen-Bailey Tag &amp; Label</title>
	<meta
		name="description"
		content="Start a tag or label project with Allen-Bailey. Send an inquiry, contact our sales team, or find our address at 3177 Lehigh St., Caledonia, New York."
	/>
</svelte:head>
{#snippet introduction()}
	<P variants={['eyebrow']}>Contact / Let's make a start</P>
	<H1 variants={['h2.variant.section']}>Bring us the details.<Br />Or just the idea.</H1>
	<P class="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
		A new tag, a different label, or a question about what comes next. Tell us what you're working
		on, and give our team a place to start.
	</P>
{/snippet}
{#snippet callToAction()}
	<P variants={['eyebrow']} class="text-gray-300 dark:text-gray-600">Prefer a conversation?</P>
	<H2 class="max-w-3xl text-4xl font-light tracking-tight sm:text-5xl">
		Talk it through.<Br />Find your next step.
	</H2>
	<P class="max-w-xl text-lg text-gray-300 dark:text-gray-600">
		A question, a sample, or an idea is enough to begin. Call our team to talk about what you have
		in mind.
	</P>
	<A
		href={contactDetails.phoneHref}
		variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
	>
		<ActionLabel>Call {contactDetails.phone}</ActionLabel>
	</A>
{/snippet}

<Main id="main-content" tabindex={-1} data-contact-ready={isReady}>
	<ContentLayout {callToAction} {introduction}>
		<Section
			id="contact-inquiry"
			variants={['surfaceAlternate']}
			aria-labelledby="contact-inquiry-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-start gap-4 lg:grid-cols-5">
					<Div class="py-6 lg:col-span-2 lg:pr-12">
						<H2 id="contact-inquiry-heading" class="text-4xl font-light sm:text-5xl">
							Tell us what you need.
						</H2><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Share the details and we'll handle the rest.
						</P>
					</Div>
					<Div class="lg:col-span-3">
						<InquiryForm {form} isDeliveryConfigured={data.isDeliveryConfigured} />
					</Div>
				</Div>
			</Container>
		</Section>

		<Section
			id="contact-location"
			variants={['surface']}
			aria-labelledby="contact-location-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<LightboxImage
						src="/images/about/golden-hour-industrial-complex-aerial.webp"
						alt="Golden-hour aerial view of industrial buildings surrounded by fields and trees"
						width={1200}
						height={533}
						class="h-112 sm:h-128"
					/>
					<Div class="py-6 lg:pl-12">
						<H2 id="contact-location-heading" class="text-4xl font-light sm:text-5xl">
							A real place.<Br />Real people behind the print.
						</H2><P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Our home is in Caledonia, New York. Whether you're starting a project or sending a
							sample, here's where to find our team.
						</P>
						<Address class="mt-8 not-italic">
							<P class="font-medium">{contactDetails.company}</P><P
								class="mt-2 text-gray-600 dark:text-gray-300"
							>
								{contactDetails.street}<Br />{contactDetails.locality}
							</P>
						</Address>
						<A
							href={contactDetails.mapsHref}
							target="_blank"
							rel="noopener noreferrer"
							variants={['button.base']}
							class="mt-6"
						>
							<ActionLabel>
								Open directions<Span class="sr-only">(opens a new tab)</Span>
							</ActionLabel>
						</A>
					</Div>
				</Div>
			</Container>
		</Section>
		<Section
			id="contact-phone"
			variants={['surfaceAlternate']}
			aria-labelledby="contact-phone-heading"
		>
			<Container class="py-12 sm:py-16">
				<Div class="grid items-center gap-4 lg:grid-cols-2">
					<Div class="py-6 lg:pr-12">
						<H2 id="contact-phone-heading" class="text-4xl font-light sm:text-5xl">
							Some details are easier<Br />to talk through.
						</H2>
						<P class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Have a question about a tag or label? Call our team to discuss your application,
							compare options, or talk through the next step for your project.
						</P>
					</Div>
					<Div
						class="rounded-sm bg-gray-50 p-8 inset-ring-1 inset-ring-gray-200 sm:p-12 dark:bg-gray-950 dark:inset-ring-gray-800"
					>
						<Phone class="mb-6 size-8 text-primary-500" aria-hidden="true" />
						<P class="text-sm text-gray-600 dark:text-gray-300">Allen-Bailey Tag &amp; Label</P>
						<A
							href={contactDetails.phoneHref}
							class="mt-3 inline-block text-3xl font-light tracking-tight text-primary-600 underline-offset-4 hover:underline sm:text-4xl dark:text-primary-300"
						>
							{contactDetails.phone}
						</A>
						<P class="mt-6 text-gray-600 dark:text-gray-300">
							If you're calling about an existing project, have your reference or order details
							handy.
						</P>
					</Div>
				</Div>
			</Container>
		</Section>
	</ContentLayout>
</Main>
