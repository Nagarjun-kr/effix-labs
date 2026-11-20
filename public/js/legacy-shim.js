/* Compatibility shim for the original static-site scripts running inside Next.js.
   1. Scripts now run after the page has loaded, so late DOMContentLoaded / load
      listeners are invoked immediately instead of never firing.
   2. Inline handlers (onclick="..." / onsubmit="...") were converted to
      data-onclick / data-onsubmit attributes; they are dispatched here. */
(function () {
  if (window.__effixLegacyShim) return;
  window.__effixLegacyShim = true;

  var dAdd = document.addEventListener.bind(document);
  var wAdd = window.addEventListener.bind(window);
  function late(type, target, fn) {
    setTimeout(function () {
      var ev = new Event(type);
      typeof fn === "function" ? fn.call(target, ev) : fn.handleEvent(ev);
    }, 0);
  }
  document.addEventListener = function (type, fn, opts) {
    if (type === "DOMContentLoaded" && document.readyState !== "loading") return late(type, document, fn);
    return dAdd(type, fn, opts);
  };
  window.addEventListener = function (type, fn, opts) {
    if (type === "load" && document.readyState === "complete") return late(type, window, fn);
    if (type === "DOMContentLoaded" && document.readyState !== "loading") return late(type, window, fn);
    return wAdd(type, fn, opts);
  };

  function run(el, attr, e) {
    try {
      var r = new Function("event", el.getAttribute(attr)).call(el, e);
      if (r === false) e.preventDefault();
    } catch (err) {
      console.error("[legacy handler]", err);
    }
  }
  dAdd("click", function (e) {
    for (var el = e.target; el && el !== document; el = el.parentNode) {
      if (el.hasAttribute && el.hasAttribute("data-onclick")) run(el, "data-onclick", e);
    }
  });
  dAdd("submit", function (e) {
    var f = e.target;
    if (f && f.hasAttribute && f.hasAttribute("data-onsubmit")) run(f, "data-onsubmit", e);
  });
})();
