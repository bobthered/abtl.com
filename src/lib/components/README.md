# Component ownership

Import shared UI from `#lib/components`. This directory contains reusable components:
Logo, BentoItem, BentoMedia, ImageLightbox, LightboxImage, Marquee, StockTag, the retained site-wide FloatingTags
effect and settings, and topic artwork that can appear in both gallery previews and
topic pages (BentoPreview, StockTagColumns, ShippingGlobe, ProcessArtwork,
VariableDataPreview, WarehouseScene, WeatherTag).

Homepage sections belong to `src/routes/_components`: SiteHero, its TagRain
animation/viewer, ProductionMetrics, BentoSection, and NewsHighlights. The preserved TagMachine
experiment also stays with the homepage.

Topic page content belongs to `src/routes/capabilities/[topic]/_components`, grouped by topic.
BentoTopicContent selects that content for the standalone route and the homepage
dialog. Its content, sample picker, example marquees, and private data are not
shared UI exports. Shared stock colors and the topic registry live in `src/lib/data`.

Move private helpers and tests with their component. Reusable components should
not import route components. The StockTagColumns integration test imports the
homepage gallery solely to verify the illustration in its real tile layout.

Product illustration panels share the Div `illustration` theme variant for the stock-color studio gradient and radius. Apply `floatIllustration` from `#lib/attachments` to an inner artwork wrapper, keeping controls/captions stationary and existing rotation or canvas interactions on its children. The shared motion pauses during interaction, offscreen, in hidden tabs, and for reduced motion.
