# LuggageClaimTag

Shared six-label luggage ticket and master claim stub based on the owner-supplied variable-data artwork. The native viewBox is 180 x 648. Header ends at y=88; labels start at 88, 160, 232, 304, 376, and 448; the stub starts at y=504. These are artwork coordinates, not physical dimensions.

`stock.svg` contains only the original stock outline and reinforcement paths. The default paper is white with reinforcement. Supply a `background` snippet to retain an existing printed template, as VariableDataTag does; its template, records, and generated barcode assets stay owned by that route.

Supply `header`, `label(index, y)`, and `stub` snippets in native coordinates. Each instance has unique clip IDs and renders each dynamic label once. Stationary stock remains under the peelable first label. `isLabelSeparated` slides that label out; `isSeparated` detaches the bottom claim stub independently. CSS handles motion and disables transitions for reduced motion. Set `viewBox` and `class` to provide illustration room without altering the paper or printed geometry.

The variable-data route retains its six per-bag Data Matrix codes, master code, blend mode, encoded values, and accessible record description. Hospitality uses matching live text references and luggage glyphs; it does not show invented or mismatched barcodes for arbitrary input. Its taller fixed viewport accommodates the original long ticket and both separation actions.
