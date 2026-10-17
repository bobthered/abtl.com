# Fire Suppression

The first rebuilt market page uses `ContentLayout`, matching capabilities title spacing, alternating body surfaces, and the centered closing invitation. Market navigation now contains this page only; retired placeholder market paths return 404. The `/markets` server redirect preserves query strings. About application links point to the new market or appropriate existing product/capability pages.

`_components/products.ts` records the 14 owner-supplied product types: five tags, eight labels, and collars. Content and illustration code stay with this route. The product explorer uses native RadioChoice and Select controls with per-instance group names. All product names remain in server-rendered content; live previews require JavaScript.

`ProductArtwork` is original SVG concept artwork, not an approved production template or dimensional drawing. Tag silhouettes and patches reuse the supplied geometry. Label previews illustrate different information hierarchies without providing hazard ratings, certifications, test results, or mandated wording. Collars illustrate flat and fitted views; opening sizes and final artwork come from the customer. Do not infer specifications, certifications, or required service intervals from the illustrations.

Shared scroll entrances and reduced-motion-aware floating illustrations handle animation. Preview viewports stay fixed while options change. Browser coverage checks all selections, reverse views, collar views, light/dark responsive layouts, retired routes, and the server redirect without JavaScript.
