/*
 * ============================================================================
 *  BRING YOUR OWN CUP IN DURHAM — map behavior
 * ============================================================================
 *  Reads the shop list from shops.js (window.SHOPS) and builds:
 *    - the map with one pin per shop (pins group together when zoomed out)
 *    - the list of shops, the search box and the "Yes only" switch
 *    - the pop-up card for each shop
 *    - the "show my location" and "show all shops" buttons
 *
 *  You don't need to edit this file to add or change shops; use shops.js.
 *  The SETTINGS block below holds the few things you might want to tweak.
 * ============================================================================
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // SETTINGS
  // ---------------------------------------------------------------------------
  var SETTINGS = {
    // Downtown Durham. On load the map frames every shop within
    // startRadiusKm of this point (shops farther out, like Emery Farm,
    // are one click away with "Show all shops").
    townCenter: [43.1345, -70.9270],
    startRadiusKm: 1.5,

    // How far to zoom in when someone picks a shop (19 is the closest).
    focusZoom: 18,
    maxZoom: 19,

    // The street map drawn under the pins: OpenStreetMap, free and with no
    // account needed. OpenStreetMap only serves pages that have a web address,
    // so when this file is opened straight from a computer (a file:// path,
    // e.g. for a quick preview) Esri's street map is used instead.
    tiles: {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    },
    localPreviewTiles: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, HERE, Garmin, USGS, NGA, EPA, USDA, NPS"
    },

    // Must match the @media (max-width: ...) value in styles.css.
    phoneWidth: 760
  };

  var POLICY_NOTE = "Policies can change, so let staff know you've brought your own cup.";

  // The pin drawn for each shop: a teardrop with a coffee cup inside.
  var PIN_SVG =
    '<svg viewBox="0 0 32 42" aria-hidden="true">' +
      '<path class="pin-body" d="M16 1C7.7 1 1 7.6 1 15.8 1 27 16 41 16 41s15-14 15-25.2C31 7.6 24.3 1 16 1z"/>' +
      '<circle class="pin-face" cx="16" cy="15.5" r="10"/>' +
      '<path class="pin-cup" d="M9.6 13.2h9v4.4a3.6 3.6 0 0 1-3.6 3.6h-1.8a3.6 3.6 0 0 1-3.6-3.6z"/>' +
      '<path class="pin-line" d="M18.6 14.3h1.1a1.9 1.9 0 0 1 0 3.8h-1.2"/>' +
      '<path class="pin-line" d="M12.6 8.7c-.7.8.7 1.6 0 2.4M15.6 8.7c-.7.8.7 1.6 0 2.4"/>' +
    "</svg>";

  var ICONS = {
    map: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s-4.5-4.2-4.5-7.8a4.5 4.5 0 0 1 9 0c0 3.6-4.5 7.8-4.5 7.8z"/><circle cx="8" cy="6.7" r="1.6"/></svg>',
    link: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2.5h4v4M13.5 2.5 7.5 8.5M12 9.5v3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3"/></svg>'
  };

  // Is the map shown inside another page (the town website)? If so, the
  // mouse wheel scrolls the page unless Ctrl is held, like Google's embeds.
  var EMBEDDED = window.self !== window.top;
  var IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || "");

  // ---------------------------------------------------------------------------
  // SHOP DATA
  // ---------------------------------------------------------------------------
  var shops = (window.SHOPS || []).map(function (shop) {
    shop.id = slugify(shop.name);
    shop.isYes = String(shop.reusableCups || "").trim().toLowerCase() === "yes";
    shop.latlng = L.latLng(shop.lat, shop.lng);
    return shop;
  });

  // Default order: shops that take reusable cups first, then A to Z.
  shops.sort(function (a, b) {
    if (a.isYes !== b.isYes) return a.isYes ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  // ---------------------------------------------------------------------------
  // PAGE ELEMENTS
  // ---------------------------------------------------------------------------
  var el = {
    yesCount:    document.getElementById("yes-count"),
    search:      document.getElementById("search"),
    onlyYes:     document.getElementById("only-yes"),
    list:        document.getElementById("shop-list"),
    count:       document.getElementById("result-count"),
    empty:       document.getElementById("empty"),
    clearSearch: document.getElementById("clear-search"),
    panelBody:   document.getElementById("panel-body"),
    listToggle:  document.getElementById("list-toggle"),
    sheetClose:  document.getElementById("sheet-close"),
    locate:      document.getElementById("locate"),
    showAll:     document.getElementById("show-all"),
    hint:        document.getElementById("map-hint")
  };

  el.yesCount.textContent = shops.filter(function (s) { return s.isYes; }).length;

  // ---------------------------------------------------------------------------
  // MAP
  // ---------------------------------------------------------------------------
  var map = L.map("map", {
    zoomControl: false,
    maxZoom: SETTINGS.maxZoom
  });

  // A page may supply its own street map (window.drawBasemap); otherwise
  // the map uses the tile service chosen in SETTINGS.
  if (typeof window.drawBasemap === "function") {
    window.drawBasemap(map);
  } else {
    var tiles = location.protocol === "file:" ? SETTINGS.localPreviewTiles : SETTINGS.tiles;
    L.tileLayer(tiles.url, {
      attribution: tiles.attribution,
      maxZoom: SETTINGS.maxZoom
    }).addTo(map);
  }

  // Zoom buttons, then our two extra buttons stacked above them.
  L.control.zoom({ position: "bottomright" }).addTo(map);

  var ToolsControl = L.Control.extend({
    options: { position: "bottomright" },
    onAdd: function () {
      var box = document.querySelector(".map-tools");
      box.classList.add("leaflet-control");
      L.DomEvent.disableClickPropagation(box);
      L.DomEvent.disableScrollPropagation(box);
      return box;
    }
  });
  new ToolsControl().addTo(map);

  // Start by framing the shops near downtown.
  var nearDowntown = shops.filter(function (s) {
    return s.latlng.distanceTo(SETTINGS.townCenter) <= SETTINGS.startRadiusKm * 1000;
  });
  map.fitBounds(boundsOf(nearDowntown.length ? nearDowntown : shops), framePadding());

  // Pins close together are grouped into a numbered circle until you zoom in.
  var cluster = L.markerClusterGroup({
    maxClusterRadius: 45,
    disableClusteringAtZoom: SETTINGS.focusZoom,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: false,
    iconCreateFunction: function (group) {
      var n = group.getChildCount();
      return L.divIcon({
        className: "cluster-icon",
        html: '<span class="cluster" title="' + n + ' shops here. Click to zoom in.">' + n + "</span>",
        iconSize: [40, 40]
      });
    }
  });
  map.addLayer(cluster);

  // One pop-up card, reused for whichever shop is selected.
  var popup = L.popup({
    offset: [0, -48],   // sits just above the (enlarged) selected pin
    maxWidth: 300,
    minWidth: 240,
    autoPanPadding: [16, 16]
  });

  // Make a pin for every shop.
  shops.forEach(function (shop) {
    shop.marker = L.marker(shop.latlng, {
      icon: pinIcon(shop, false),
      title: shop.name,
      alt: shop.name + (shop.isYes ? " (takes reusable cups)" : " (does not take reusable cups)"),
      riseOnHover: true,
      zIndexOffset: shop.isYes ? 500 : 0
    });
    shop.marker.on("click", function () { selectShop(shop, "map"); });
  });

  // ---------------------------------------------------------------------------
  // SELECTING A SHOP (from the map, the list, or a #link)
  // ---------------------------------------------------------------------------
  var selected = null;

  function selectShop(shop, source) {
    map.closePopup();
    markSelected(shop);
    closeSheet();

    // Zoom in on the shop, leaving room above the pin for the pop-up card.
    var zoom = Math.max(map.getZoom(), SETTINGS.focusZoom);
    var lift = Math.max(0, Math.min(map.getSize().y / 2 - 60, 170));
    var center = map.unproject(map.project(shop.latlng, zoom).subtract([0, lift]), zoom);

    var alreadyThere = map.getZoom() === zoom &&
      map.latLngToContainerPoint(center).distanceTo(map.getSize().divideBy(2)) < 4;

    if (alreadyThere) {
      openCard(shop);
    } else {
      map.once("moveend", function () { if (selected === shop) openCard(shop); });
      if (prefersReducedMotion()) map.setView(center, zoom, { animate: false });
      else map.flyTo(center, zoom, { duration: 0.8 });
    }

    if (source === "map") scrollListTo(shop);
  }

  function openCard(shop) {
    popup.setLatLng(shop.latlng).setContent(popupContent(shop)).openOn(map);
    setHash(shop.id);
  }

  // Highlights one shop's pin and list entry (or none, when shop is null).
  function markSelected(shop) {
    if (selected && selected !== shop) {
      selected.marker.setIcon(pinIcon(selected, false));
      selected.marker.setZIndexOffset(selected.isYes ? 500 : 0);
    }
    selected = shop;
    if (shop) {
      shop.marker.setIcon(pinIcon(shop, true));
      shop.marker.setZIndexOffset(1000);
    }
    Array.prototype.forEach.call(el.list.querySelectorAll(".shop-button"), function (btn) {
      btn.classList.toggle("is-selected", !!shop && btn.dataset.id === shop.id);
    });
  }

  map.on("popupclose", function () {
    markSelected(null);
    setHash("");
  });
  popup.on("add remove", syncListToggle);

  // ---------------------------------------------------------------------------
  // LIST, SEARCH AND FILTER
  // ---------------------------------------------------------------------------
  var userLatLng = null;

  function render() {
    var query = el.search.value.trim().toLowerCase();
    var onlyYes = el.onlyYes.checked;

    var visible = shops.filter(function (shop) {
      if (onlyYes && !shop.isYes) return false;
      if (!query) return true;
      var haystack = [shop.name, shop.type, shop.serves, shop.address, shop.where].join(" ").toLowerCase();
      return haystack.indexOf(query) !== -1;
    });

    // Once we know where the visitor is, list the closest shops first.
    if (userLatLng) {
      visible = visible.slice().sort(function (a, b) {
        return userLatLng.distanceTo(a.latlng) - userLatLng.distanceTo(b.latlng);
      });
    }

    // Pins
    cluster.clearLayers();
    cluster.addLayers(visible.map(function (s) { return s.marker; }));
    if (selected && visible.indexOf(selected) === -1) map.closePopup();

    // List
    el.list.innerHTML = "";
    visible.forEach(function (shop) { el.list.appendChild(listItem(shop)); });
    markSelected(selected);

    // Counts and empty state
    var total = onlyYes ? shops.filter(function (s) { return s.isYes; }).length : shops.length;
    el.count.textContent = visible.length === total
      ? total + (onlyYes ? " shops take reusable cups" : " coffee shops")
      : "Showing " + visible.length + " of " + total;
    el.empty.hidden = visible.length > 0;
    el.listToggle.textContent = "Show list (" + visible.length + ")";

    return visible;
  }

  function listItem(shop) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shop-button";
    btn.dataset.id = shop.id;

    var distance = userLatLng ? '<span class="distance">' + formatMiles(userLatLng.distanceTo(shop.latlng)) + "</span>" : "";
    var text = document.createElement("span");
    text.className = "shop-text";
    text.innerHTML =
      '<span class="shop-name">' + esc(shop.name) + "</span>" +
      '<span class="shop-meta">' +
        '<span class="status ' + statusClass(shop) + '">' + (shop.isYes ? "Yes" : "No") + "</span>" +
        "<span>" + esc(shortAddress(shop)) + "</span>" +
        distance +
      "</span>";

    btn.appendChild(logoTile(shop));
    btn.appendChild(text);
    btn.addEventListener("click", function () { selectShop(shop, "list"); });
    li.appendChild(btn);
    return li;
  }

  function scrollListTo(shop) {
    var btn = el.list.querySelector('[data-id="' + shop.id + '"]');
    if (btn) btn.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  el.search.addEventListener("input", function () {
    render();
    if (isPhone() && el.search.value) openSheet();
  });

  el.onlyYes.addEventListener("change", function () {
    render();
  });

  el.clearSearch.addEventListener("click", function () {
    el.search.value = "";
    render();
    el.search.focus();
  });

  // ---------------------------------------------------------------------------
  // POP-UP CARD
  // ---------------------------------------------------------------------------
  function popupContent(shop) {
    var card = document.createElement("div");
    card.className = "popup";

    var where = esc(shop.address) + (shop.where ? '<br><span class="popup-where">' + esc(shop.where) + "</span>" : "");
    var website = shop.website
      ? '<a class="btn" href="' + esc(shop.website) + '" target="_blank" rel="noopener">' + ICONS.link + linkLabel(shop.website) + "</a>"
      : "";

    card.innerHTML =
      '<div class="popup-logo"></div>' +
      '<div class="popup-body">' +
        '<div class="popup-title">' +
          '<h2 class="popup-name">' + esc(shop.name) + "</h2>" +
          '<p class="popup-type">' + esc(shop.type || "") + "</p>" +
          '<span class="pill ' + statusClass(shop) + '">' +
            (shop.isYes ? "Yes: reusable cups welcome" : "No: not at this time") +
          "</span>" +
        "</div>" +
        '<div class="popup-section"><h3>What they serve</h3><p>' + esc(shop.serves || "") + "</p></div>" +
        '<div class="popup-section"><h3>Where</h3><p>' + where + "</p></div>" +
        '<div class="popup-actions">' +
          '<a class="btn btn-primary" href="' + esc(googleMapsUrl(shop)) + '" target="_blank" rel="noopener">' + ICONS.map + "Open in Google Maps</a>" +
          website +
        "</div>" +
        (shop.isYes ? '<p class="popup-note">' + POLICY_NOTE + "</p>" : "") +
      "</div>";

    var plate = card.querySelector(".popup-logo");
    if (shop.logoBackground) plate.style.background = shop.logoBackground;
    if (shop.logo) {
      var img = logoImage(shop);
      img.addEventListener("error", function () {
        plate.style.background = "";
        plate.replaceChildren(monogram(shop));
      });
      plate.appendChild(img);
    } else {
      plate.appendChild(monogram(shop));
    }
    return card;
  }

  // Link straight to the shop's Google Maps listing (photos, hours, reviews).
  function googleMapsUrl(shop) {
    var url = "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(shop.name + ", " + shop.address);
    if (shop.googlePlaceId) url += "&query_place_id=" + encodeURIComponent(shop.googlePlaceId);
    return url;
  }

  function linkLabel(url) {
    if (/instagram\.com/i.test(url)) return "Instagram";
    if (/facebook\.com/i.test(url)) return "Facebook";
    if (/toasttab\.com|toast\.app/i.test(url)) return "Menu";
    return "Website";
  }

  // ---------------------------------------------------------------------------
  // LOGOS (falls back to the shop's initials if there's no logo or it fails)
  // ---------------------------------------------------------------------------
  function logoTile(shop) {
    if (!shop.logo) return monogram(shop);
    var tile = document.createElement("span");
    tile.className = "logo-tile";
    if (shop.logoBackground) tile.style.background = shop.logoBackground;
    var img = logoImage(shop);
    img.addEventListener("error", function () { tile.replaceWith(monogram(shop)); });
    tile.appendChild(img);
    return tile;
  }

  function logoImage(shop) {
    var img = document.createElement("img");
    img.src = shop.logo;
    img.alt = "";                     // decorative: the shop name sits right beside it
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    return img;
  }

  function monogram(shop) {
    var tile = document.createElement("span");
    tile.className = "logo-tile monogram " + statusClass(shop);
    tile.setAttribute("aria-hidden", "true");
    tile.textContent = initials(shop.name);
    return tile;
  }

  function initials(name) {
    var skip = { the: 1, at: 1, of: 1, and: 1, a: 1 };
    return name
      .replace(/\(.*?\)/g, " ")
      .split(/[\s&+\-]+/)
      .filter(function (w) { return w && !skip[w.toLowerCase()]; })
      .slice(0, 3)
      .map(function (w) { return w.charAt(0).toUpperCase(); })
      .join("");
  }

  // ---------------------------------------------------------------------------
  // MAP BUTTONS: show my location, show all shops
  // ---------------------------------------------------------------------------
  var userMarker = null;

  el.locate.addEventListener("click", function () {
    if (!navigator.geolocation) {
      showHint("This browser can't share its location.", 4000);
      return;
    }
    el.locate.classList.add("is-busy");
    navigator.geolocation.getCurrentPosition(function (pos) {
      el.locate.classList.remove("is-busy");
      userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);

      if (!userMarker) {
        userMarker = L.circleMarker(userLatLng, {
          radius: 8, weight: 3, color: "#FFFFFF", fillColor: "#3E7CC0", fillOpacity: 1
        }).bindTooltip("You are here").addTo(map);
      } else {
        userMarker.setLatLng(userLatLng);
      }

      var visible = render();          // re-sorts the list by distance
      var nearest = visible.filter(function (s) { return s.isYes; })[0];

      if (nearest && userLatLng.distanceTo(nearest.latlng) < 25000) {
        map.flyToBounds(L.latLngBounds([userLatLng, nearest.latlng]), { padding: [70, 70], maxZoom: 17 });
        showHint("Closest shop that takes reusable cups: " + nearest.name + " (" +
          formatMiles(userLatLng.distanceTo(nearest.latlng)) + ")", 5000);
      } else {
        map.flyTo(userLatLng, 15);
      }
    }, function (err) {
      el.locate.classList.remove("is-busy");
      showHint(err.code === 1
        ? "Location is blocked. Allow location access in your browser to see shops near you."
        : "Couldn't find your location. Try again in a moment.", 5000);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  });

  el.showAll.addEventListener("click", function () {
    map.closePopup();
    var visible = cluster.getLayers().map(function (m) { return m.getLatLng(); });
    if (visible.length) map.flyToBounds(L.latLngBounds(visible), L.extend(framePadding(), { maxZoom: 17 }));
  });

  // Room to leave around the edges when framing several shops, so pins
  // don't hide behind the zoom buttons (or the phone "Show list" button).
  function framePadding() {
    return isPhone()
      ? { paddingTopLeft: [30, 30], paddingBottomRight: [60, 80] }
      : { paddingTopLeft: [40, 40], paddingBottomRight: [80, 40] };
  }

  // ---------------------------------------------------------------------------
  // PHONE LAYOUT: the list slides up as a sheet over the map
  // ---------------------------------------------------------------------------
  function isPhone() {
    return window.matchMedia("(max-width: " + SETTINGS.phoneWidth + "px)").matches;
  }

  function openSheet() {
    el.panelBody.classList.add("is-open");
    el.listToggle.setAttribute("aria-expanded", "true");
    syncListToggle();
  }

  function closeSheet() {
    el.panelBody.classList.remove("is-open");
    el.listToggle.setAttribute("aria-expanded", "false");
    syncListToggle();
  }

  // The "Show list" button hides while the list is open or a shop card is
  // showing, so it never covers the selected pin.
  function syncListToggle() {
    el.listToggle.hidden = el.panelBody.classList.contains("is-open") || map.hasLayer(popup);
  }

  el.listToggle.addEventListener("click", openSheet);
  el.sheetClose.addEventListener("click", closeSheet);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (el.panelBody.classList.contains("is-open")) closeSheet();
    else map.closePopup();
  });

  // ---------------------------------------------------------------------------
  // WHEN EMBEDDED IN THE TOWN WEBSITE
  // Scrolling over the map scrolls the page; hold Ctrl (or Cmd) to zoom.
  // On phones, one finger scrolls the page and two fingers move the map.
  // ---------------------------------------------------------------------------
  if (EMBEDDED) {
    map.scrollWheelZoom.disable();
    map.getContainer().addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        map.scrollWheelZoom.enable();
        hideHint();
      } else {
        map.scrollWheelZoom.disable();
        showHint(IS_MAC ? "Hold ⌘ Cmd and scroll to zoom the map" : "Hold Ctrl and scroll to zoom the map", 1500);
      }
    }, { capture: true, passive: false });

    if (L.Browser.mobile) {
      map.dragging.disable();
      map.getContainer().addEventListener("touchmove", function (e) {
        if (e.touches.length === 1) showHint("Use two fingers to move the map", 1500);
      }, { passive: true });
    }
  }

  // ---------------------------------------------------------------------------
  // SMALL HELPERS
  // ---------------------------------------------------------------------------
  var hintTimer = null;

  function showHint(text, ms) {
    el.hint.textContent = text;
    el.hint.hidden = false;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(hideHint, ms || 2000);
  }

  function hideHint() {
    el.hint.hidden = true;
  }

  function pinIcon(shop, isSelected) {
    var cls = "pin " + statusClass(shop) + (isSelected ? " is-selected" : "");
    return L.divIcon({
      className: "pin-icon",
      html: '<span class="' + cls + '">' + PIN_SVG + "</span>",
      iconSize: [32, 42],
      iconAnchor: [16, 42]
    });
  }

  function statusClass(shop) {
    return shop.isYes ? "is-yes" : "is-no";
  }

  function shortAddress(shop) {
    return String(shop.address || "").split(",")[0];
  }

  function boundsOf(list) {
    return L.latLngBounds(list.map(function (s) { return s.latlng; }));
  }

  function formatMiles(meters) {
    var miles = meters / 1609.344;
    return (miles < 10 ? miles.toFixed(1) : Math.round(miles)) + " mi";
  }

  function slugify(text) {
    return String(text).toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setHash(id) {
    try { history.replaceState(null, "", id ? "#" + id : location.pathname + location.search); } catch (e) { /* ignore */ }
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // ---------------------------------------------------------------------------
  // START
  // ---------------------------------------------------------------------------
  render();

  // A link ending in #shop-name (e.g. map.html#the-freedom-cafe) opens that shop.
  var linked = shops.filter(function (s) { return "#" + s.id === location.hash; })[0];
  if (linked) setTimeout(function () { selectShop(linked, "link"); }, 300);
})();
