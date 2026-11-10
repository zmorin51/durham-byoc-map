# Bring Your Own Cup in Durham: interactive map

An interactive map of Durham, NH coffee shops that accept reusable cups. It is
built to be embedded on the Town of Durham's CivicPlus website.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The map page (layout only). |
| `shops.js` | **The shop list.** This is the only file you edit to add or change shops. |
| `styles.css` | Colors, fonts and layout. Town colors are set at the top. |
| `app.js` | Map behavior: search, the Yes-only switch, zooming, pop-up cards. |

There's no build step and no framework: it's plain HTML, CSS and JavaScript.
The map library is [Leaflet](https://leafletjs.com) 1.9.4, with
Leaflet.markercluster 1.5.3 for grouping nearby pins. Both are loaded from the
jsDelivr CDN and pinned to exact versions with integrity checks.

## Preview it

Double-click `index.html` to open it
in your browser.

When the map is opened from a file on your computer, it uses Esri's street map.
That's because OpenStreetMap's free tile servers refuse pages that don't have a
web address. Once it's hosted (GitHub Pages or a town server), it switches to
OpenStreetMap automatically, which shows building outlines and shop names
downtown.

## Update the shop list

Open `shops.js` in any text editor (Notepad works). Each shop is one block:

```js
{
  name: "The Freedom Café",
  reusableCups: "yes",          // "yes" or "no"
  type: "Non-profit café",
  serves: "Coffee, lattes and ...",
  address: "37 Main St, Durham, NH 03824",
  where: "",                    // optional, e.g. "Inside Dimond Library"
  lat: 43.133521, lng: -70.924935,
  googlePlaceId: "ChIJvRiRmJeT4okR2sEMAQt_Xsg",
  website: "https://thefreedomcafe.org",
  logo: "https://..."           // or "" to show the shop's initials
},
```

- **Change a shop from No to Yes:** change `reusableCups: "no"` to `reusableCups: "yes"`.
  The counts, pin color and list order update on their own.
- **Add a shop:** copy a whole block, from `{` to `},`, paste it below, and edit it.
  Keep the comma after every `}` except the last one.
- **Find lat/lng:** in Google Maps, right-click the spot and click the two numbers
  at the top of the menu to copy them. The first is `lat`, the second is `lng`.
- **Remove a shop:** delete its block.

Save the file and refresh the page to see the change. If the map goes blank, a
comma or quote mark is usually missing. Press F12 and look at the Console tab
for the line number.

## Logos

Most logos are currently linked from each shop's website or Wikimedia Commons,
which is fine for a mockup. Before the map goes public:

1. Get each shop's OK to use its logo (most will happily send one).
2. Save the files in a new `logos/` folder.
3. Point each shop's `logo` at its file, e.g. `logo: "logos/freedom-cafe.png"`.

Shops without a logo show their initials. This also happens if a linked logo
stops loading.

## Colors and fonts

All colors are listed once at the top of `styles.css` (`--navy`, `--olive`,
`--yes`, `--no` and so on). The font is Montserrat, the same as durhamnh.gov.

## The street map

OpenStreetMap's tiles are free with attribution and suit a town website's
traffic. Their usage policy is at https://operations.osmfoundation.org/policies/tiles/.
To switch providers, change `tiles.url` and `tiles.attribution` in the
`SETTINGS` block at the top of `app.js`. For example, the town's ArcGIS
Online account covers Esri basemaps.

## Embed code for CivicPlus

After the `map` folder is hosted, paste this into a **Custom HTML** widget and
replace the address with the hosted one:

```html
<iframe src="https://YOUR-HOSTED-ADDRESS/"
        title="Map of Durham coffee shops that accept reusable cups"
        style="display:block;width:100%;height:680px;border:0;border-radius:8px;"
        loading="lazy" allow="geolocation"></iframe>
```

`allow="geolocation"` lets the "Show my location" button work inside the town
page. The step-by-step hosting and CivicPlus guide is a separate document.

## Linking to one shop

Add `#` and the shop's name in lowercase with hyphens to the map's address to
open that shop's card directly, e.g. `.../#the-freedom-cafe` or
`.../#zekes-cafe`.

## Privacy and accessibility

- No cookies, analytics or tracking. "Show my location" runs only in the
  visitor's browser and is never sent anywhere.
- Everything on the map is also in the list, which works with a keyboard and
  screen readers. Pins can be reached with Tab, and Escape closes a card.
- When embedded, scrolling over the map scrolls the town page. Visitors hold
  Ctrl (Cmd on a Mac) to zoom, or use two fingers on a phone, the same as
  Google's embedded maps.

## Sources

Shop details came from the team's interview tracker, each shop's website or
menu, and its Google Maps listing. Pin positions came from OpenStreetMap and
were checked against the street map in October 2026.
