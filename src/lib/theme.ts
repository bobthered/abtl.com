import { theme } from 'sveltewind/theme';
import { classic } from 'sveltewind/themes';

/** Initialize shared styles only; keep customer-specific data out of the global theme. */
export const initializeTheme = () => {
	theme.set.theme(structuredClone(classic));
	// Stripe-inspired geometry and type hierarchy; ABTL's palette stays unchanged.
	for (const heading of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
		theme.update.base(heading, 'font-light leading-tight tracking-tight text-balance');
	}
	theme.set.variant(
		'p',
		'heroMetric',
		'mb-8 flex items-baseline gap-2 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300'
	);
	theme.update.base('card', 'rounded-lg p-8 shadow-sm');
	theme.set.base(
		'tagRain',
		'pointer-events-none relative mt-12 h-64 w-full overflow-hidden motion-reduce:hidden lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-full lg:w-2/5'
	);
	theme.set.variant('canvas', 'tagRain', 'block h-full w-full opacity-80 dark:opacity-60');
	theme.update.base('dialog', 'rounded-lg p-8 shadow-xl');
	theme.update.base('input', 'rounded-sm px-4 py-3 text-base leading-5');
	theme.update.base('popover', 'rounded-lg p-6');
	theme.set.variant('button', 'icon', 'flex size-11 items-center justify-center rounded-full p-0');
	theme.set.base('container', 'relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-16');
	theme.set.variant(
		'section',
		'hero',
		'relative isolate overflow-hidden bg-gray-50 dark:bg-gray-950'
	);
	theme.set.variant(
		'container',
		'hero',
		'pt-20 pb-16 sm:pt-24 sm:pb-20 lg:min-h-160 lg:pt-28 lg:pb-24'
	);
	theme.set.base(
		'heroBrand',
		'relative flex items-center gap-6 border-t border-gray-200/80 py-8 dark:border-gray-800'
	);
	theme.set.variant(
		'p',
		'heroDetail',
		'mb-8 flex flex-wrap items-center gap-3 text-sm font-medium tracking-normal text-gray-600 dark:text-gray-300'
	);
	theme.set.variant(
		'p',
		'heroLead',
		'mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'
	);
	theme.set.variant(
		'p',
		'heroFootnote',
		'mt-6 text-xs leading-relaxed text-gray-500 sm:text-sm dark:text-gray-400'
	);
	theme.set.variant(
		'button',
		'heroPrimary',
		'bg-abtl-blue-700 text-white hover:bg-abtl-blue-600 dark:bg-primary-400 dark:text-gray-950 dark:hover:bg-primary-300'
	);
	theme.set.variant(
		'button',
		'heroSecondary',
		'border border-gray-300 bg-white/70 text-gray-950 hover:bg-white dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-50 dark:hover:bg-gray-800'
	);
	theme.set.base('tagMachine', 'w-full min-w-0 py-6 lg:-mr-8 lg:w-auto');
	theme.set.variant('svg', 'machine', 'block h-auto w-full overflow-visible');
	theme.set.variant('path', 'machineAccent', 'fill-abtl-red-600 stroke-abtl-red-700 stroke-1');
	theme.set.variant('path', 'machineBelt', 'fill-abtl-red-400');
	theme.set.variant(
		'path',
		'machineFront',
		'fill-gray-200 stroke-gray-300 stroke-1 dark:fill-gray-700 dark:stroke-gray-600'
	);
	theme.set.variant('path', 'machineInk', 'fill-abtl-blue-700');
	theme.set.variant('path', 'machinePaper', 'fill-tag-manila stroke-tag-brown stroke-1');
	theme.set.variant('path', 'machinePatch', 'fill-tag-buff stroke-tag-brown stroke-1');
	theme.set.variant('path', 'machineRoll', 'fill-tag-buff stroke-tag-brown stroke-1');
	theme.set.variant('path', 'machineRollFace', 'fill-tag-manila stroke-tag-brown stroke-1');
	theme.set.variant('path', 'machineShadow', 'fill-gray-200/50 dark:fill-gray-800/50');
	theme.set.variant(
		'path',
		'machineSide',
		'fill-gray-300 stroke-gray-400 stroke-1 dark:fill-gray-800 dark:stroke-gray-600'
	);
	theme.set.variant('path', 'machineSpindle', 'fill-white');
	theme.set.variant(
		'path',
		'machineTop',
		'fill-white stroke-gray-300 stroke-1 dark:fill-gray-600 dark:stroke-gray-500'
	);
	theme.set.base(
		'floatingTags',
		'pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35 dark:opacity-12.5'
	);
	theme.set.base('floatingTag', 'absolute pointer-events-none');
	theme.set.variant('floatingTag', 'far', 'w-10 sm:w-14');
	theme.set.variant('floatingTag', 'middle', 'w-16 sm:w-24');
	theme.set.variant('floatingTag', 'near', 'w-28 sm:w-40');
	theme.set.base(
		'tagSettings',
		'fixed inset-x-4 bottom-4 z-30 max-h-3/4 overflow-auto rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-950 shadow-xl sm:inset-x-auto sm:right-4 sm:w-80 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50'
	);
	theme.set.base('tag', 'block aspect-1/2 h-auto w-full');
	theme.set.variant('path', 'tagPatch', 'fill-tag-buff stroke-tag-brown stroke-1');
	theme.set.base('logo', 'inline-block h-auto w-32');
	theme.set.variant('logo', 'onSurface', 'dark:[&_path]:fill-white');
	theme.set.variant('logo', 'site', 'w-20 sm:w-24');
	theme.update.base(
		'button',
		'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm leading-5 font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none text-white dark:text-white'
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
	theme.set.variant(
		'a',
		'skip',
		'fixed top-3 left-3 z-30 -translate-y-24 rounded-md bg-gray-50 px-5 py-3 text-primary-600 focus:translate-y-0 dark:bg-gray-950 dark:text-primary-300'
	);
	theme.set.variant('article', 'industry', 'border-t border-gray-200 pt-6 dark:border-gray-800');
	theme.set.variant('article', 'product', 'space-y-6 rounded-lg bg-white dark:bg-gray-950');
	theme.set.variant('button', 'cta', 'max-w-full gap-3 whitespace-normal');
	theme.set.variant('container', 'section', 'space-y-4 py-20 lg:py-28');
	theme.set.variant(
		'footer',
		'site',
		'relative z-10 border-0 bg-primary-500 pt-0 text-white dark:bg-primary-500 [&_a]:text-white [&_a:hover]:text-white [&_p]:text-white dark:[&_a]:text-white dark:[&_a:hover]:text-white dark:[&_p]:text-white'
	);
	theme.set.variant(
		'h1',
		'hero',
		'text-5xl font-light leading-tight tracking-tight text-gray-950 sm:text-6xl lg:text-7xl dark:text-gray-50'
	);
	theme.set.variant(
		'h2',
		'section',
		'text-3xl font-light leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl dark:text-gray-50'
	);
	theme.set.variant(
		'h3',
		'item',
		'mt-6 mb-3 text-2xl font-normal leading-tight tracking-tight text-gray-950 dark:text-gray-50'
	);
	theme.set.variant(
		'header',
		'site',
		'sticky top-0 z-20 border-0 border-b border-gray-200 bg-white backdrop-blur-none dark:border-gray-800 dark:bg-gray-950'
	);
	theme.set.variant(
		'img',
		'hero',
		'block h-auto w-full rounded-lg mix-blend-multiply dark:mix-blend-normal'
	);
	theme.set.variant(
		'span',
		'productionTotal',
		'font-semibold text-abtl-blue-700 tabular-nums dark:text-primary-300'
	);
	theme.set.variant('p', 'body', 'text-base leading-relaxed');
	theme.set.variant('p', 'description', 'my-6 max-w-xl text-lg leading-relaxed');
	theme.set.variant('p', 'eyebrow', 'mb-4 text-base font-semibold tracking-normal');
	theme.set.variant('p', 'footer', 'text-sm leading-relaxed text-gray-600 dark:text-gray-300');
	theme.set.variant('p', 'lead', 'mt-6 max-w-xl text-lg leading-relaxed lg:text-xl');
	// Important insets override Popover's anchor positioning for the viewport-sized menu.
	theme.set.variant(
		'popover',
		'navigation',
		'inset-0! m-0! h-dvh max-h-none w-full max-w-none rounded-none bg-white p-0 shadow-none inset-ring-0 dark:bg-gray-950 data-anchored:[position-anchor:auto] data-anchored:[position-area:none] lg:hidden'
	);
	theme.set.variant(
		'section',
		'contrast',
		'bg-gray-900 dark:bg-gray-50 [&_h2]:text-gray-50 [&_p]:text-gray-50 dark:[&_h2]:text-gray-950 dark:[&_p]:text-gray-950'
	);
	theme.set.variant('section', 'surface', 'bg-white dark:bg-gray-950');
	theme.set.variant('span', 'brandDetail', 'text-xs font-bold tracking-widest uppercase');
	theme.set.variant(
		'span',
		'brandName',
		'text-2xl leading-none font-bold tracking-tighter xl:text-3xl'
	);
	theme.set.variant(
		'span',
		'index',
		'text-xs tracking-wide text-primary-600 dark:text-primary-300'
	);
	theme.set.variant(
		'svg',
		'arrow',
		'size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none'
	);
};
