# Single-choice controls

`RadioChoice` composes Sveltewind `Radio`, `Label`, and `Span`. The native radio fills the clickable label while a selected-only Lucide checkmark, selected ring, and focus outline communicate its state. The Radio `handle` snippet renders the checkmark only for the selected choice. Because that snippet replaces Radio's default rendering, it also retains a Sveltewind `Input` with `type="radio"` and the original group binding. Use `bind:group`, a typed `value`, and a shared `name` for each group. Generate the name from the owning component's `$props.id()` to keep standalone pages and dialogs independent. Group choices in a named `radiogroup`; native Tab, Space, and arrow-key behavior remains intact.

Use `class` for the label layout and `contentClass` for its contents. Stock-color swatches and metric cards hide the extra indicator with `isIndicatorVisible={false}` because they already show selection visually. Metric controls also set `isSurfaceVisible={false}` to keep their original shared top/bottom rules and moving gradient highlight without individual card rings or backgrounds. Native selection and focus remain available in this presentation. Keep names on the radio with `aria-label` where the visual text alone is insufficient. Labels remain the entrance-animation units, and dynamically added, unmarked radio groups inherit automatic staggering.

## Site audit

The audit covered rendered button actions, selection handlers, pressed/expanded states, existing form controls, navigation, carousels, and dialogs across the shared library and routes.

| Area                | Groups converted | Choices                                                 |
| ------------------- | ---------------: | ------------------------------------------------------- |
| Attachments         |                5 | Four material families and Looped/Knotted string finish |
| Stock colors        |                1 | Color preview                                           |
| Synthetic materials |                1 | Material preview                                        |
| Variable data       |                2 | Sample record and printed format                        |
| Shipping            |                1 | Destination preview                                     |
| Warehousing         |                2 | Release quantity and workflow comparison                |
| Homepage metrics    |                1 | Animation selection                                     |

Thirteen exclusive groups now use native radios. Action controls remain buttons: dialog triggers/closures, navigation menus, carousel arrows, releases/resets, and tag flipping. Stock sample requests allow several colors simultaneously; process ink channels can be enabled independently. Those multi-select controls and standalone pause/separation toggles are not radio groups. Existing ranges continue to control continuous quantities.
