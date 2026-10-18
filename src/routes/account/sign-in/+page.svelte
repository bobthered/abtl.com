<script lang="ts">
	// Imports
	import {
		A,
		Br,
		Button,
		Container,
		Div,
		Form,
		H1,
		H2,
		Input,
		Label,
		Main,
		P,
		Section
	} from '#lib/components';
	import { ArrowRight, Building2, Mail, ShieldCheck } from '#lib/icons';
	import type { PageProps } from './$types';

	// consts
	const steps = [
		{
			icon: Mail,
			title: 'Start with your invitation',
			description: 'Use the invitation sent to your work email to activate your account.'
		},
		{
			icon: Building2,
			title: 'Your company. Your catalog.',
			description:
				'Your invitation connects you with your company and the markets available to your team.'
		},
		{
			icon: ShieldCheck,
			title: 'A focused beta',
			description: "We're starting with fire suppression. Additional markets will follow."
		}
	];
	// $props()
	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Beta Shop Sign In | Allen-Bailey</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container class="py-12 sm:py-16 lg:py-28">
			<Div class="grid items-center gap-4 lg:grid-cols-2">
				<Div class="lg:pr-12">
					<P variants={['eyebrow']}>Allen-Bailey / Customer beta</P><H1
						variants={['h2.variant.section']}
					>
						Your next order.<Br />A simpler start.
					</H1><P class="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
						A dedicated shop for the products your team uses. Access is by invitation while we build
						the experience with our beta customers.
					</P><A
						href="/markets/fire-suppression"
						class="mt-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-300"
					>
						Explore fire suppression<ArrowRight class="size-4" aria-hidden="true" />
					</A>
				</Div>
				<Div
					class="rounded-sm bg-white p-8 shadow-sm inset-ring-1 inset-ring-gray-200 sm:p-12 dark:bg-gray-900 dark:inset-ring-gray-800"
				>
					<ShieldCheck class="mb-6 size-8 text-primary-500" aria-hidden="true" /><H2
						class="text-3xl"
					>
						Invited customers only.
					</H2>
					<P class="mt-4 text-gray-600 dark:text-gray-300">Sign in to your company's shop.</P>
					{#if form?.message}<P role="alert" class="mt-4 text-red-600 dark:text-red-300">
							{form.message}
						</P>{/if}
					<Form method="POST" aria-label="Shop sign in" class="mt-6 grid gap-4">
						<Div>
							<Label for="shop-email">Work email</Label><Input
								id="shop-email"
								name="email"
								type="email"
								autocomplete="username"
								required
								maxlength={254}
								class="mt-2 w-full"
							/>
						</Div>
						<Div>
							<Label for="shop-password">Password</Label><Input
								id="shop-password"
								name="password"
								type="password"
								autocomplete="current-password"
								required
								maxlength={128}
								class="mt-2 w-full"
							/>
						</Div>
						<Button type="submit" disabled={!data.isDemoEnabled}>Sign in</Button>
					</Form>
					{#if data.demoCredentials}
						<Div
							class="mt-6 rounded-sm bg-gray-50 p-4 inset-ring-1 inset-ring-gray-200 dark:bg-gray-950 dark:inset-ring-gray-800"
						>
							<P class="text-sm font-medium">Temporary demo access</P>
							<P class="mt-2 text-sm break-all">Email: {data.demoCredentials.email}</P>
							<P class="mt-1 text-sm">Password: {data.demoCredentials.password}</P>
							<P class="mt-2 text-sm text-gray-600 dark:text-gray-300">
								Development preview only. No real orders or customer information.
							</P>
						</Div>
					{:else}<P class="mt-4 text-sm">Customer sign-in is not available yet.</P>{/if}
					<A href="/contact" class="mt-6 inline-block">Need help accessing your account?</A>
					<P class="mt-4 text-sm text-gray-500 dark:text-gray-400">
						Already working with Allen-Bailey? Your existing ordering process is still available.
					</P>
				</Div>
			</Div>
		</Container>
	</Section>
	<Section variants={['surfaceAlternate']}>
		<Container class="grid gap-4 py-12 sm:py-16 md:grid-cols-3">
			{#each steps as step (step.title)}<Div class="py-4">
					<step.icon class="mb-4 size-6 text-primary-500" aria-hidden="true" /><H2 class="text-xl">
						{step.title}
					</H2><P class="mt-3 text-gray-600 dark:text-gray-300">{step.description}</P>
				</Div>{/each}
		</Container>
	</Section>
</Main>
