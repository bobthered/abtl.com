<script lang="ts">
	// Imports
	import { A, ActionLabel, Container, H1, Main, P, Section } from '#lib/components';
	import { ShoppingCart } from '#lib/icons';
</script>

<svelte:head>
	<title>Your Cart | Allen-Bailey</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		<Container class="py-12 sm:py-16">
			<P variants={['eyebrow']}>Your shop / Cart</P><H1 variants={['h2.variant.section']}>
				Your cart
			</H1>
			<ShoppingCart class="mt-12 size-10 text-primary-500" aria-hidden="true" />
			<P class="mt-6 text-2xl">Your cart is empty.</P><P
				class="mt-4 max-w-xl text-gray-600 dark:text-gray-300"
			>
				Find a previous product to review your next order. Demo reorder reviews do not add items to
				a cart yet.
			</P>
			<A href="/shop" variants={['button.base']} class="mt-8">
				<ActionLabel>Find products to reorder</ActionLabel>
			</A>
		</Container>
	</Section>
</Main>
