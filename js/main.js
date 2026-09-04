// Tries a base image path (given WITHOUT an extension, e.g. "images/nhs-logo")
// against a few common formats in turn — .webp, then .jpg, .jpeg, .png, .jfif
// — and calls onFound with whichever one actually loads. Calls nothing if
// none of them exist.
var THUMB_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'jfif'];

function loadFirstAvailableImage(basePath, onFound) {
  var i = 0;
  function tryNextExtension() {
    if (i >= THUMB_EXTENSIONS.length) return; // none found
    var src = basePath + '.' + THUMB_EXTENSIONS[i];
    var img = new Image();
    img.onload = function () { onFound(src); };
    img.onerror = function () { i++; tryNextExtension(); };
    img.src = src;
  }
  tryNextExtension();
}

// Grid tiles (homepage): swap the placeholder colour tile for the real
// thumbnail once it's found. Safe to include on every page — on pages
// with no .tile elements (like project pages) this simply does nothing.
document.querySelectorAll('.tile').forEach(function (tile) {
  var base = tile.getAttribute('data-thumb');
  if (!base) return;
  loadFirstAvailableImage(base, function (src) {
    var el = document.createElement('img');
    el.src = src;
    el.alt = '';
    tile.insertBefore(el, tile.firstChild);
    // Hide the placeholder now a real image has loaded — without this it
    // would keep rendering on top of the image, since it comes later in
    // the DOM and both are absolutely positioned.
    var placeholder = tile.querySelector('.placeholder');
    if (placeholder) placeholder.style.display = 'none';
  });
});

// Any other single image that should accept multiple formats (e.g. the
// About page photo) — add data-flex-img="images/some-name" (no extension)
// to an <img> tag and this fills in its src once a matching file is found.
document.querySelectorAll('[data-flex-img]').forEach(function (el) {
  var base = el.getAttribute('data-flex-img');
  if (!base) return;
  loadFirstAvailableImage(base, function (src) { el.src = src; });
});
