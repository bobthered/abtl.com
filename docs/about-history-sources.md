# About history: supplied company archive

Read on 2026-10-14 from the owner-provided `IMG_2260.jpg` and `IMG_2261.jpg`. The photographs show two consecutive pages headed "100 Years of Tags & Labels." These are the source for the new historical copy; the wording on the website is paraphrased. The booklet's publication metadata and exact photograph dates are not supplied. The centennial year 2011 follows from the stated 1911 founding; it is not proof of a photographed anniversary event.

## Facts used on the page

| Period                              | History stated in supplied pages                                                                                                                                                                                                            | Source   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1911                                | Samuel Allen and James Bailey founded the business in Dansville, NY; a machine made wooden nursery stakes for Kelly Bros. Nurseries, marked with wax crayon and attached with hand-twisted galvanized wire.                                 | IMG_2260 |
| 1913                                | The business moved to Caledonia for proximity to four major railroad lines.                                                                                                                                                                 | IMG_2260 |
| Mid-to-late 1920s                   | More durable paper and rope stocks replaced wooden sticks.                                                                                                                                                                                  | IMG_2260 |
| Following difficulties in the 1930s | Elmer Floback acquired the company, developed a single-pass roll-to-finished-product press and installed seven presses in Caledonia. The exact acquisition and installation years are not stated.                                           | IMG_2260 |
| Approximately 1964                  | Allen-Bailey began label production on a flexographic press.                                                                                                                                                                                | IMG_2261 |
| 1967                                | The company changed its name to Allen-Bailey Tag & Label, Inc.                                                                                                                                                                              | IMG_2261 |
| 1991                                | The company acquired Avery Dennison's Industrial Tag Division in Framingham and opened a manufacturing/office facility in Hopkinton, MA, producing manifold bond-and-carbon tags. This is historical, not a claim about current facilities. | IMG_2261 |
| First hundred years                 | The history recognizes employees from families represented across generations. The page attributes this to the centennial account rather than asserting current employee demographics.                                                      | IMG_2261 |

The 2018 Ennis acquisition remains based on the existing Ennis annual-report citation in `src/routes/about/_data/about.ts`, not these older pages. Current production capabilities and nationwide/international reach remain grounded in owner instructions and existing project sources.

## Photo provenance and limits

The four original crops listed below are retained. The page now uses corresponding `-wide.webp` derivatives with AI-generated surroundings, explicitly identified as AI-extended in alt text. They are visual adaptations, not untouched archive evidence. Visible timeline captions were removed at the owner's request. The generated 1991 workbench and 2011 cake/album still life are illustrative scenes, not photographs of actual company events. See [artwork notes](about-artwork.md) and [exact image prompts](about-image-prompts.json).

- `archive-wooden-nursery-tag.webp`: wooden stake and wire example from IMG_2260; object date unknown.
- `archive-horse-drawn-tag-wagon.webp`: horse and wagon with company markings and a Tree Labels sign, from IMG_2260; date unknown, not asserted to depict the 1913 move.
- `archive-industry-handshake.webp`: two men before a Tag Manufacturers Institute banner, from IMG_2260. No identities, award, or event date are asserted in the page copy.
- `archive-company-gathering.webp`: group raising glasses around a table, from IMG_2261; occasion and date unknown, not asserted to be the 1967 name change or 2011 centenary.

The partial photographs at the outside edges are not extracted: the supplied images omit too much of them. Ask for the adjoining pages if those pictures are needed. Originals remain unmodified at the repository root. The reproducible extraction coordinates and perspective correction are in `scripts/extract-about-archive.mjs`.

The 1991 milestone now uses a restored, colorized and AI-extended hand-finishing photograph from the separately supplied `IMG_2263.jpg`, replacing the fictional workbench scene. Its original date is unverified; placement beside 1991 is not evidence that it depicts the acquisition. The original page is retained unchanged. See [restoration prompt](about-hand-finishing-restoration.json).

The 2011 milestone now uses a restored and AI-extended color photograph of a press operator from the separately supplied `IMG_2265.jpg`, replacing the fictional cake and album. Its original date is unverified, and it is not identified as a centennial-event photograph. The original page is retained unchanged. See [restoration prompt](about-press-operator-restoration.json).

The 2018 milestone now uses the owner-provided safety-celebration group photograph `IMG_6387.jpg`, cleaned and extended with AI. Its date is unverified; it is not described as an acquisition-event photograph. The unchanged original is retained. See [restoration prompt](about-safety-celebration-restoration.json).

The Today milestone uses an editorially enhanced and AI-extended detail of a cord reel and strung tags from `IMG_2266.jpg`. Its source is a photographed printed page, not a verified photograph of a current installation. The edit applies professional lighting and composition at the owner's request. See [editorial image prompt](about-cord-reel-editorial.json).

## Deliberate exclusions

The booklet describes customer counts, employee counts, machinery still operating, and then-current management. Those are period statements, not verified current facts, and were not copied into current-day marketing. Historical customer names are not presented as current customers or endorsements. General adhesive-industry history and sensitive family/medical details were omitted because they do not strengthen the public company story.
