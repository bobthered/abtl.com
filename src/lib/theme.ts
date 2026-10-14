import { theme } from 'sveltewind/theme';
import { classic } from 'sveltewind/themes';

// Keep inherited rectangular surfaces consistent; preserve intentional circles and flush edges.
const normalizeCornerRadius = (classes: string) =>
	classes.replace(
		/\brounded(?:-([trblse]|[tb][rl]|[se][se]))?(?:-(?:xs|sm|md|lg|xl|[2-4]xl))?(?=\s|$)/g,
		(_, side: string | undefined) => (side ? `rounded-${side}-sm` : 'rounded-sm')
	);

/** Shared component defaults and variants reused across separate UI areas or routes. */
export const initializeTheme = () => {
	const siteTheme = structuredClone(classic);
	for (const component of Object.values(siteTheme)) {
		component.base = normalizeCornerRadius(component.base);
		for (const name of Object.keys(component.variants ?? {}))
			component.variants![name] = normalizeCornerRadius(component.variants![name]);
	}
	theme.set.theme(siteTheme);
	theme.set.variant(
		'button',
		'selected',
		'inset-ring-2 inset-ring-primary-500 dark:inset-ring-primary-400'
	);
	theme.set.variant('div', 'dialogClose', 'flex justify-end py-4');
	theme.set.variant(
		'div',
		'illustration',
		'group relative overflow-hidden rounded-sm bg-gradient-to-br from-primary-100 via-gray-100 to-secondary-100 dark:from-primary-950 dark:via-gray-800 dark:to-secondary-950'
	);
	theme.set.variant(
		'section',
		'dialogSection',
		'border-t border-gray-200 py-12 sm:py-16 dark:border-gray-800'
	);
	theme.set.variant('p', 'dialogBody', 'max-w-2xl text-gray-600 dark:text-gray-300');
	theme.set.variant(
		'button',
		'neutral-selectable',
		'aria-pressed:bg-primary-500 aria-pressed:text-white dark:aria-pressed:bg-primary-500 dark:aria-pressed:text-white'
	);
	theme.set.variant('card', 'neutral', 'bg-gray-100 dark:bg-gray-950');
	theme.set.variant('button', 'large', 'min-h-16 px-8 py-5 text-lg');
	theme.set.variant(
		'button',
		'neutral',
		'bg-gray-100 text-gray-950 hover:bg-gray-200 hover:text-gray-950 focus:bg-gray-200 focus:text-gray-950 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus:bg-gray-700 dark:focus:text-gray-50'
	);

	theme.set.variant('skeleton', 'bento', 'animate-none bg-gray-200 dark:bg-gray-700');
	theme.set.variant(
		'dialog',
		'bento',
		'fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-x-hidden overflow-y-auto overscroll-contain rounded-none border-0 bg-transparent p-0 text-gray-950 shadow-none inset-ring-0 backdrop:bg-gray-950/25 backdrop:backdrop-blur-md backdrop:opacity-100 open:backdrop:backdrop-blur-md starting:open:backdrop:opacity-100 starting:open:backdrop:backdrop-blur-md dark:bg-transparent dark:text-gray-50'
	);
	// Rings define full edges, outlines mark focus, and borders are reserved for side separators.
	theme.set.base(
		'fieldset',
		'min-w-0 rounded-sm p-6 inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-700'
	);
	theme.set.variant(
		'calendar',
		'bordered',
		'inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-700'
	);
	theme.set.base(
		'fileUploadDropzone',
		'flex flex-col items-center gap-3 rounded-sm bg-gray-50 p-6 text-center inset-ring-2 inset-ring-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-600 dark:bg-gray-900 dark:inset-ring-gray-700 dark:focus-within:outline-primary-300'
	);
	theme.set.variant(
		'fileUploadDropzone',
		'active',
		'bg-primary-500/5 inset-ring-primary-500 dark:bg-primary-500/5 dark:inset-ring-primary-400'
	);
	// Validation colors belong to the input's ring, not unused border colors.
	theme.set.variant('input', 'error', 'inset-ring-red-500 focus-visible:inset-ring-red-500');
	theme.set.variant('input', 'success', 'inset-ring-green-500 focus-visible:inset-ring-green-500');
	// Stripe-inspired geometry and type hierarchy; ABTL's palette stays unchanged.
	for (const heading of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
		theme.update.base(heading, 'font-light leading-tight tracking-tight text-balance');
	}
	theme.update.base('card', 'rounded-sm bg-white p-8 shadow-sm dark:bg-gray-900');
	theme.set.base(
		'tagRain',
		'absolute inset-0 z-0 hidden h-full w-full lg:block motion-reduce:hidden'
	);
	theme.update.base('dialog', 'rounded-sm p-8 shadow-xl');
	theme.update.base('input', 'rounded-sm px-4 py-3 text-base leading-5');
	theme.update.base('popover', 'rounded-sm p-6');
	theme.set.variant('button', 'icon', 'flex size-11 items-center justify-center rounded-sm p-0');
	theme.set.base('container', 'relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-16 xl:max-w-384');
	theme.set.base(
		'heroBrand',
		'relative flex items-center gap-6 border-t border-gray-200/80 py-8 dark:border-gray-800'
	);
	theme.set.variant(
		'button',
		'neutral-outline',
		'bg-transparent text-gray-950 inset-ring-1 inset-ring-gray-300 hover:bg-gray-950/10 hover:text-gray-950 focus:bg-gray-950/10 focus:text-gray-950 dark:bg-transparent dark:text-gray-50 dark:inset-ring-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-50 dark:focus:bg-white/5 dark:focus:text-gray-50'
	);
	theme.set.base('tagMachine', 'w-full min-w-0 py-6 lg:-mr-8 lg:w-auto');
	theme.set.base(
		'floatingTags',
		'pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35 dark:opacity-12.5'
	);
	theme.set.base('floatingTag', 'absolute pointer-events-none');
	theme.set.base(
		'tagSettings',
		'fixed inset-x-4 bottom-4 z-30 max-h-3/4 overflow-auto rounded-sm bg-white p-5 text-sm text-gray-950 shadow-xl inset-ring-1 inset-ring-gray-200 sm:inset-x-auto sm:right-4 sm:w-80 dark:bg-gray-950 dark:text-gray-50 dark:inset-ring-gray-800'
	);
	theme.set.base('tag', 'block aspect-1/2 h-auto w-full');
	theme.set.base('logo', 'inline-block h-auto w-32');
	theme.set.variant('logo', 'onSurface', 'dark:[&_path]:fill-white');
	theme.set.variant('logo', 'site', 'w-20 sm:w-24');
	theme.update.base(
		'button',
		'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm leading-5 font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:transition-none text-white dark:text-white dark:focus-visible:outline-primary-300'
	);
	theme.update.base('p', 'text-base leading-relaxed dark:text-gray-50');
	theme.set.variant(
		'a',
		'accent',
		'font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200'
	);
	theme.set.variant(
		'a',
		'brand',
		'flex shrink-0 flex-col items-center gap-1 text-gray-950 hover:text-gray-950 dark:text-gray-50 dark:hover:text-gray-50'
	);
	theme.set.variant(
		'a',
		'navigation',
		'py-3 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-300'
	);
	theme.set.variant('container', 'section', 'space-y-4 py-20 lg:py-28');
	theme.set.variant(
		'h2',
		'section',
		'text-3xl font-light leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl dark:text-gray-50'
	);
	theme.set.variant('p', 'description', 'my-6 max-w-xl text-lg leading-relaxed');
	theme.set.variant('p', 'eyebrow', 'mb-4 text-base font-semibold tracking-normal');
	theme.set.variant('section', 'surface', 'bg-gray-50 dark:bg-gray-950');
	theme.set.variant('section', 'surfaceAlternate', 'bg-white dark:bg-gray-900');

	theme.set.variant(
		'section',
		'sampleInvitation',
		'bg-gray-950 py-12 text-center text-gray-50 sm:py-16 dark:bg-gray-50 dark:text-gray-950'
	);
};
