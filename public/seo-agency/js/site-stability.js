(function () {
  "use strict";

  var capturedStylesheets = [];
  var observerStarted = false;
  var errorBannerVisible = false;
  var originalWrite = document.write ? document.write.bind(document) : null;
  var originalWriteln = document.writeln ? document.writeln.bind(document) : null;
  var previousOnError = window.onerror;
  var previousOnUnhandledRejection = window.onunhandledrejection;

  function isLocalStylesheet(href) {
    return !!href && !/^(https?:)?\/\//i.test(href) && /\.css(?:$|[?#])/i.test(href);
  }

  function captureStylesheets() {
    var links = document.querySelectorAll('link[rel~="stylesheet"]');
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!isLocalStylesheet(href)) return;
      if (capturedStylesheets.some(function (item) { return item.href === href; })) return;

      capturedStylesheets.push({
        href: href,
        media: link.getAttribute("media") || "",
        integrity: link.getAttribute("integrity") || "",
        crossorigin: link.getAttribute("crossorigin") || "",
        referrerpolicy: link.getAttribute("referrerpolicy") || ""
      });
    });
  }

  function restoreStylesheets() {
    var head = document.head || document.getElementsByTagName("head")[0];
    if (!head) return;

    capturedStylesheets.forEach(function (item) {
      var existing = Array.prototype.find.call(
        document.querySelectorAll('link[rel~="stylesheet"]'),
        function (link) { return link.getAttribute("href") === item.href; }
      );

      if (existing) {
        existing.disabled = false;
        return;
      }

      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = item.href;
      if (item.media) link.media = item.media;
      if (item.integrity) link.integrity = item.integrity;
      if (item.crossorigin) link.crossOrigin = item.crossorigin;
      if (item.referrerpolicy) link.referrerPolicy = item.referrerpolicy;
      head.appendChild(link);
    });
  }

  function showSafeError(message) {
    if (errorBannerVisible) return;

    function render() {
      if (!document.body || document.getElementById("effix-safe-error")) return;

      var banner = document.createElement("div");
      banner.id = "effix-safe-error";
      banner.setAttribute("role", "status");
      banner.style.cssText = [
        "position:fixed",
        "right:16px",
        "bottom:16px",
        "z-index:6000",
        "max-width:min(360px,calc(100vw - 32px))",
        "padding:14px 16px",
        "border:1px solid rgba(17,24,39,0.12)",
        "border-radius:16px",
        "background:rgba(255,255,255,0.94)",
        "color:#111827",
        "box-shadow:0 20px 60px rgba(15,23,42,0.16)",
        "backdrop-filter:blur(18px)",
        "-webkit-backdrop-filter:blur(18px)",
        "font:600 13px/1.45 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
      ].join(";");
      banner.textContent = message || "Something did not render correctly. The page shell has been preserved.";
      document.body.appendChild(banner);
      errorBannerVisible = true;

      window.setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
        errorBannerVisible = false;
      }, 7000);
    }

    if (document.body) {
      render();
    } else {
      document.addEventListener("DOMContentLoaded", render, { once: true });
    }
  }

  function preventLateDocumentWrite(methodName, originalMethod, chunks) {
    if (!originalMethod) return;
    if (document.readyState === "loading") {
      originalMethod.apply(document, chunks);
      return;
    }

    restoreStylesheets();
    showSafeError("A late render action was blocked so the Effix interface stays intact.");
    if (window.console && console.warn) {
      console.warn("Effix blocked late document." + methodName + " to avoid replacing the page.");
    }
  }

  if (originalWrite) {
    document.write = function () {
      preventLateDocumentWrite("write", originalWrite, arguments);
    };
  }

  if (originalWriteln) {
    document.writeln = function () {
      preventLateDocumentWrite("writeln", originalWriteln, arguments);
    };
  }

  function createIsolatedRenderContainer(id) {
    var container = document.createElement("div");
    container.id = id || "effix-isolated-render";
    container.setAttribute("data-effix-render-root", "true");
    container.style.cssText = [
      "position:absolute",
      "left:-10000px",
      "top:0",
      "width:1200px",
      "min-height:1px",
      "overflow:hidden",
      "background:#fff"
    ].join(";");
    document.body.appendChild(container);
    return container;
  }

  function startHeadObserver() {
    var head = document.head || document.getElementsByTagName("head")[0];
    if (!head || observerStarted || !window.MutationObserver) return;

    var observer = new MutationObserver(function () {
      restoreStylesheets();
    });
    observer.observe(head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href", "rel", "disabled"]
    });
    observerStarted = true;
  }

  function init() {
    captureStylesheets();
    restoreStylesheets();
    startHeadObserver();
  }

  captureStylesheets();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.onerror = function () {
    restoreStylesheets();
    showSafeError("A script issue was handled. You can keep using the Effix website.");
    if (typeof previousOnError === "function") {
      return previousOnError.apply(window, arguments) || false;
    }
    return false;
  };

  window.onunhandledrejection = function () {
    restoreStylesheets();
    showSafeError("A loading issue was handled. The page layout has been preserved.");
    if (typeof previousOnUnhandledRejection === "function") {
      return previousOnUnhandledRejection.apply(window, arguments) || false;
    }
    return false;
  };

  window.addEventListener("error", function () {
    restoreStylesheets();
  });

  window.addEventListener("unhandledrejection", function () {
    restoreStylesheets();
  });

  window.addEventListener("beforeprint", restoreStylesheets);
  window.addEventListener("afterprint", restoreStylesheets);

  window.EffixSiteStability = {
    restoreStylesheets: restoreStylesheets,
    createIsolatedRenderContainer: createIsolatedRenderContainer,
    showSafeError: showSafeError
  };
})();
