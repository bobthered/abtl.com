import { theme } from 'sveltewind/theme';
import { classic } from 'sveltewind/themes';

/** Initialize shared styles only; keep customer-specific data out of the global theme. */
export function initializeTheme() {
	theme.set.theme(structuredClone(classic));
	theme.set.base('container', 'relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-16');
	theme.set.base(
		'floatingTags',
		'pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35 dark:opacity-25'
	);
	theme.set.base('floatingTag', 'absolute pointer-events-none');
	theme.set.variant('floatingTag', 'far', 'w-10 sm:w-14');
	theme.set.variant('floatingTag', 'middle', 'w-16 sm:w-24');
	theme.set.variant('floatingTag', 'near', 'w-28 sm:w-40');
	theme.set.base(
		'tagSettings',
		'fixed inset-x-4 bottom-4 z-30 max-h-3/4 overflow-auto rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-950 shadow-xl sm:inset-x-auto sm:right-4 sm:w-80 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50'
	);
	theme.set.base('tag', 'block aspect-1/2 h-auto w-full');
	theme.set.variant('path', 'tagPatch', 'fill-tag-buff stroke-tag-brown stroke-1');
	theme.set.base('logo', 'inline-block h-auto w-32');
	theme.set.variant('logo', 'onSurface', 'dark:[&_path]:fill-white');
	theme.set.variant('logo', 'site', 'w-20 sm:w-24');
	theme.update.base(
		'button',
		'inline-flex items-center justify-center gap-3 font-medium motion-reduce:transition-none text-white dark:text-white'
	);
	theme.update.base('p', 'dark:text-gray-50');
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
	theme.set.variant('article', 'product', 'space-y-5 rounded-2xl bg-white dark:bg-gray-950');
	theme.set.variant('button', 'cta', 'max-w-full gap-6 rounded-full px-8 py-4 whitespace-normal');
	theme.set.variant('container', 'section', 'space-y-4 py-12 lg:py-16');
	theme.set.variant(
		'footer',
		'site',
		'relative z-10 border-0 bg-primary-500 pt-0 text-white dark:bg-primary-500 [&_a]:text-white [&_a:hover]:text-white [&_p]:text-white dark:[&_a]:text-white dark:[&_a:hover]:text-white dark:[&_p]:text-white'
	);
	theme.set.variant(
		'h1',
		'hero',
		'text-4xl leading-tight tracking-tighter text-gray-950 sm:text-5xl xl:text-6xl 2xl:text-7xl dark:text-gray-50'
	);
	theme.set.variant(
		'h2',
		'section',
		'text-3xl leading-tight tracking-tight text-gray-950 lg:text-5xl dark:text-gray-50'
	);
	theme.set.variant(
		'h3',
		'item',
		'mt-6 mb-3 text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50'
	);
	theme.set.variant(
		'header',
		'site',
		'sticky top-0 z-20 border-0 border-b border-gray-200 bg-white backdrop-blur-none dark:border-gray-800 dark:bg-gray-950'
	);
	theme.set.variant(
		'img',
		'hero',
		'block h-auto w-full rounded-3xl mix-blend-multiply dark:mix-blend-normal'
	);
	theme.set.variant('p', 'body', 'text-base leading-relaxed');
	theme.set.variant('p', 'description', 'my-6 max-w-xl text-lg leading-relaxed');
	theme.set.variant('p', 'eyebrow', 'mb-4 text-xs font-bold tracking-widest uppercase');
	theme.set.variant('p', 'footer', 'text-sm leading-relaxed text-gray-600 dark:text-gray-300');
	theme.set.variant('p', 'lead', 'mt-8 max-w-xl text-xl leading-relaxed lg:text-2xl');
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
		'size-6 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none'
	);
}
