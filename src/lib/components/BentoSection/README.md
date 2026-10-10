# Bento topics and routes

Each entry in `topics.ts` has a standalone `/tags/[topic]` page. `BentoTopicContent`
provides the shared content; `BentoPreview` provides its tile and detail preview.
The standalone page uses an H1, normal section/Container spacing, and no surrounding
Card. Color-page marquees span the viewport, with text and detail content in Containers.
The dialog uses an H2,
close controls, and the existing animated Card/backdrop.

The homepage passes `topicId` and `onNavigate` to BentoSection. Normal tile clicks
use SvelteKit 3 shallow `goto` navigation with non-persistent history state, keeping
the homepage mounted and updating the visible URL. Closing navigates back; browser
Back/Forward updates the controlled topic. Reloading or opening a URL directly
loads the actual standalone route. Modified clicks follow the tile's real link.
Without JavaScript, the links also navigate to server-rendered standalone pages.

BentoSection may also be used without routing props for a local dialog. Avoid
mixing controlled `topicId` with a callback that does not update it.

Add topics to the shared registry and their content to BentoTopicContent. Unknown
topic routes return a 404. Placeholder topics remain labeled as content previews.
