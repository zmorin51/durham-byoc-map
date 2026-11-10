/*
 * ============================================================================
 *  BRING YOUR OWN CUP IN DURHAM — SHOP LIST
 * ============================================================================
 *
 *  This is the only file you need to edit to add, remove, or update a shop.
 *  Each shop is one block between { and }. Copy an existing block to add a
 *  new one, and keep the comma after the closing } of every block.
 *
 *  FIELDS
 *  ------
 *  name           Shop name as it should appear on the map.
 *  reusableCups   "yes" if the shop accepts reusable cups, otherwise "no".
 *  type           Short label shown under the name (e.g. "Independent café").
 *  serves         One or two sentences on what they serve.
 *  address        Street address. Also used to build the Google Maps link.
 *  where          Optional extra directions ("Inside Dimond Library").
 *                 Leave as "" if not needed.
 *  lat, lng       Map position. To find them: right-click the spot in
 *                 Google Maps and click the numbers at the top of the menu
 *                 to copy them. The first number is lat, the second is lng.
 *  googlePlaceId  Optional. Makes "Open in Google Maps" go straight to the
 *                 shop's Google listing (photos, hours, reviews). Find it at
 *                 https://developers.google.com/maps/documentation/places/web-service/place-id
 *                 Leave as "" and the button will search by name + address.
 *  website        Optional link to the shop's website, menu, or social page.
 *  logo           Optional image address for the shop's logo. Leave as ""
 *                 to show the shop's initials instead.
 *  logoBackground Optional background color behind the logo, for logos
 *                 that are white or very light (e.g. "#2f4a2b").
 *
 *  NOTE ON LOGOS: the logos below are linked from each shop's own website
 *  or Wikimedia Commons. Before this goes live, get each shop's permission,
 *  save the logo files into a "logos" folder next to this file, and change
 *  the logo field to the local file name, e.g.  logo: "logos/works.png"
 * ============================================================================
 */

window.SHOPS = [

  // ---------------------------------------------------------------- YES ---

  {
    name: "Breaking New Grounds",
    reusableCups: "yes",
    type: "Independent café",
    serves: "Coffee roasted in-house, espresso drinks and teas, plus bagels and baked goods made fresh daily. Whole beans sold by the bag.",
    address: "50 Main St, Durham, NH 03824",
    where: "",
    lat: 43.134356, lng: -70.926314,
    googlePlaceId: "ChIJU8rC6JaT4okRicErDuqX-3I",
    website: "https://www.instagram.com/bng.durham/",
    logo: ""
  },

  {
    name: "The Grind",
    reusableCups: "yes",
    type: "Independent café",
    serves: "Signature lattes, cold brew and Wildcat Rush energy drinks, with breakfast egg sandwiches, lunch toasties and overnight oats.",
    address: "8 Jenkins Ct, Durham, NH 03824",
    where: "On Jenkins Court, just off Main Street",
    lat: 43.134843, lng: -70.926264,
    googlePlaceId: "ChIJkXGRRACT4okRvu7XmvHTJnA",
    website: "",
    logo: ""
  },

  {
    name: "The Freedom Café",
    reusableCups: "yes",
    type: "Non-profit café",
    serves: "Coffee, lattes and about two dozen teas, with sweet and savory crêpes, omelettes, breakfast sandwiches and muffins. Proceeds support work to end human trafficking.",
    address: "37 Main St, Durham, NH 03824",
    where: "",
    lat: 43.133521, lng: -70.924935,
    googlePlaceId: "ChIJvRiRmJeT4okR2sEMAQt_Xsg",
    website: "https://thefreedomcafe.org",
    logo: "https://images.squarespace-cdn.com/content/v1/557bfa97e4b04706860a78fa/1550422474512-YLPJLI6HRMZWR9Z6S660/FC+logo.png?format=300w"
  },

  {
    name: "rise + grind",
    reusableCups: "yes",
    type: "Independent café",
    serves: "Espresso drinks and nitro cold brew on draft, bagels with house-made cream cheese, breakfast sandwiches and lunch.",
    address: "17 Madbury Rd, Suite 100, Durham, NH 03824",
    where: "Next door to Hop + Grind",
    lat: 43.135615, lng: -70.925706,
    googlePlaceId: "ChIJUxtIifWT4okRCbN5LHcDdz0",
    website: "https://www.toasttab.com/local/order/rise+grind/r-ad093658-4bbe-4744-a8b9-19e8bbbf36a7",
    logo: ""
  },

  {
    name: "The Works Café",
    reusableCups: "yes",
    type: "Bakery café",
    serves: "Coffee and espresso, fresh-baked bagels, all-day breakfast, burritos, power bowls, sandwiches and smoothies.",
    address: "5A Mill Rd, Durham, NH 03824",
    where: "Mill Road Plaza",
    lat: 43.133662, lng: -70.926369,
    googlePlaceId: "ChIJt47g35aT4okR1wL6K-yxeo8",
    website: "https://workscafe.com/locations/durham/",
    logo: "https://workscafe.com/wp-content/uploads/2022/03/works-cafe-logo-2020-dark-2.png"
  },

  {
    name: "Coffee Craving",
    reusableCups: "yes",
    type: "Coffee trailer",
    serves: "Specialty lattes, flavored iced coffees, made-to-order donuts and breakfast sandwiches. Weekdays during the school year.",
    address: "20 Academic Way, Durham, NH 03824",
    where: "Beside Horton Social Science Center, UNH",
    lat: 43.133691, lng: -70.932654,
    googlePlaceId: "ChIJJUNwry2N4okRYOADQlpyQ-I",
    website: "",
    logo: ""
  },

  {
    name: "Aroma Joe's",
    reusableCups: "yes",
    type: "Coffee chain",
    serves: "Espresso drinks, brewed coffee, AJ's Rush energy drinks, smoothies and breakfast sandwiches.",
    address: "72 Main St, Durham, NH 03824",
    where: "",
    lat: 43.135192, lng: -70.928128,
    googlePlaceId: "ChIJ0eLjYJaT4okRQ28OwVgk53g",
    website: "https://aromajoes.com",
    logo: "https://aromajoes.com/wp-content/uploads/2021/03/cropped-aj-favicon-192x192.png"
  },

  {
    name: "Circle K",
    reusableCups: "yes",
    type: "Convenience store",
    serves: "Self-serve coffee and fountain drinks, open 24 hours, plus snacks and grab-and-go food.",
    address: "4A Dover Rd, Durham, NH 03824",
    where: "Gas station at Dover Road and Main Street",
    lat: 43.133120, lng: -70.919995,
    googlePlaceId: "ChIJDzQQxJGT4okRz8VUOIA9rbU",
    website: "https://www.circlek.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Circle_K_logo.svg/250px-Circle_K_logo.svg.png"
  },

  {
    name: "Zeke's Café",
    reusableCups: "yes",
    type: "UNH Dining",
    serves: "Coffee, baked goods, sandwiches and grab-and-go snacks for a study break.",
    address: "18 Library Way, Durham, NH 03824",
    where: "Inside Dimond Library, one flight up from the main entrance",
    lat: 43.135615, lng: -70.932964,
    googlePlaceId: "ChIJcc65PbyT4okRUvKkQhai7ak",
    website: "https://www.unh.edu/dining/facility/zekes-cafe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/University_of_New_Hampshire_logo.svg/250px-University_of_New_Hampshire_logo.svg.png"
  },

  {
    name: "CornerStone 1926",
    reusableCups: "yes",
    type: "UNH Dining",
    serves: "Starbucks coffee and specialty drinks, made-to-order sandwiches and grab-and-go options.",
    address: "10 Garrison Ave, Durham, NH 03824",
    where: "Inside Peter T. Paul College of Business and Economics",
    lat: 43.136691, lng: -70.928888,
    googlePlaceId: "ChIJnzDK3ZWT4okRZP4KJcSoAkE",
    website: "https://www.unh.edu/dining/locations",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/University_of_New_Hampshire_logo.svg/250px-University_of_New_Hampshire_logo.svg.png"
  },

  {
    name: "Albert's",
    reusableCups: "yes",
    type: "UNH Dining",
    serves: "Grab-and-go coffee, snacks and quick meals between classes.",
    address: "33 Academic Way, Durham, NH 03824",
    where: "Northwest lobby of Kingsbury Hall",
    lat: 43.134412, lng: -70.934900,
    googlePlaceId: "ChIJDzMT6byT4okRsSyWTPU_nzk",
    website: "https://www.unh.edu/dining/locations",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/University_of_New_Hampshire_logo.svg/250px-University_of_New_Hampshire_logo.svg.png"
  },

  {
    name: "Sweetened Memories Bakery",
    reusableCups: "yes",
    type: "Bakery",
    serves: "Cupcakes, cookies, pastries and custom cakes, with gluten-free options.",
    address: "13 Jenkins Ct, Suite 120, Durham, NH 03824",
    where: "On Jenkins Court, just off Main Street",
    lat: 43.135117, lng: -70.926363,
    googlePlaceId: "ChIJi6LtDoGT4okRulOeDugnQKs",
    website: "https://sweetenedmemories.com",
    logo: "https://sweetenedmemories.com/wp-content/uploads/2024/08/sweetened-memories-inline.png"
  },

  {
    name: "Three Chimneys Inn & ffrost Sawyer Tavern",
    reusableCups: "yes",
    type: "Inn & tavern",
    serves: "Historic inn serving seasonal New England fare, desserts, coffee and cocktails in the tavern and dining rooms.",
    address: "17 Newmarket Rd, Durham, NH 03824",
    where: "",
    lat: 43.132236, lng: -70.918710,
    googlePlaceId: "ChIJyXtyMpCT4okRvAtMxWRRrYg",
    website: "https://www.threechimneysinn.com/dining",
    logo: "https://images.squarespace-cdn.com/content/v1/68baeb1a4a84c31a357cf5f9/0b67f9fc-5b3b-4545-b2ba-24be4cae589d/favicon.ico"
  },

  {
    name: "Durham Public Library Café",
    reusableCups: "yes",
    type: "Library café",
    serves: "Coffee, tea and cookies in the café and bookstore attached to the library.",
    address: "49 Madbury Rd, Durham, NH 03824",
    where: "Inside the Durham Public Library",
    lat: 43.139937, lng: -70.927083,
    googlePlaceId: "ChIJ31s1LQWT4okRpbeK05dzEek",
    website: "https://durhampubliclibrary.org",
    logo: "https://durhampubliclibrary.org/wp-content/themes/durham-public-library/images/logo.png"
  },

  // ----------------------------------------------------------------- NO ---

  {
    name: "Dunkin' (Dover Road)",
    reusableCups: "no",
    type: "Coffee chain",
    serves: "Coffee, iced drinks, donuts, bagels and breakfast sandwiches.",
    address: "2 Dover Rd, Durham, NH 03824",
    where: "Next to the Circle K at Dover Road and Main Street",
    lat: 43.133191, lng: -70.919576,
    googlePlaceId: "ChIJm7sJHo6T4okRxuvb3kE9B9U",
    website: "https://www.dunkindonuts.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Dunkin%27_logo.svg/250px-Dunkin%27_logo.svg.png"
  },

  {
    name: "Dunkin' (Memorial Union)",
    reusableCups: "no",
    type: "Coffee chain",
    serves: "Coffee, iced drinks, donuts, bagels and breakfast sandwiches.",
    address: "83 Main St, Durham, NH 03824",
    where: "Inside the Memorial Union Building (MUB), UNH",
    lat: 43.134691, lng: -70.929597,
    googlePlaceId: "ChIJYxllLZaT4okRIlxo9kIpuC0",
    website: "https://www.dunkindonuts.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Dunkin%27_logo.svg/250px-Dunkin%27_logo.svg.png"
  },

  {
    name: "Market & Café at Emery Farm",
    reusableCups: "no",
    type: "Farm market café",
    serves: "Coffee and seasonal lattes, breakfast sandwiches, smoothies, cider donuts and baked goods, plus the farm's own produce.",
    address: "147 Piscataqua Rd, Durham, NH 03824",
    where: "On Route 4, east of downtown",
    lat: 43.132272, lng: -70.875918,
    googlePlaceId: "ChIJYbmnwvST4okRn-HZ2KhN7c4",
    website: "https://emeryfarm.com",
    logo: "https://img1.wsimg.com/isteam/ip/ed81d990-3d37-4b2c-b8e6-d01b2f45b96b/logo/a61dc497-9d71-4f96-b971-475c48c7aa03.png/:/rs=w:180,h:180,m",
    logoBackground: "#2f4a2b"
  },

  {
    name: "Franz's Food",
    reusableCups: "no",
    type: "Sandwich shop",
    serves: "Made-to-order breakfast wraps, sandwiches, fries and iced coffee.",
    address: "46 Main St, Durham, NH 03824",
    where: "",
    lat: 43.134270, lng: -70.926083,
    googlePlaceId: "ChIJl8Ho6JaT4okR4fEeU7QzCLo",
    website: "",
    logo: ""
  },

  {
    name: "New café at Union Court",
    reusableCups: "no",
    type: "UNH Dining · Opening soon",
    serves: "A new coffee shop coming to Union Court. Not open yet.",
    address: "83 Main St, Durham, NH 03824",
    where: "Union Court, Memorial Union Building (MUB), UNH",
    lat: 43.134329, lng: -70.929994,
    googlePlaceId: "ChIJL-Pyjk2T4okRLV2zmF7M3gI",
    website: "https://www.unh.edu/dining/locations",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/University_of_New_Hampshire_logo.svg/250px-University_of_New_Hampshire_logo.svg.png"
  }

];
