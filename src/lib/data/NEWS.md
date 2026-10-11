# News content

`news.ts` is the current shared post registry for `/news`, `/news/[slug]`, and homepage news highlights. A future CMS can supply the same fields; no CMS integration is configured yet.

Add a unique, stable URL-safe `id`, image, alt text, category, title, description, and paragraph `body`. Publish with `isPublished: true`, `isPreview: false`, and a valid ISO `publishedAt` date. Published posts sort newest first; the homepage automatically uses the newest six. Keep public assets here, never confidential drafts.

Until the first post is published, explicitly labeled `isPreview` design entries are shown. Unpublished entries without `isPreview` are excluded. After a published post exists, preview entries disappear from the public list, article routes, and homepage.
