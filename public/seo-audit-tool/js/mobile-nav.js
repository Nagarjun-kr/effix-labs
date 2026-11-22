(function () {
  const navItems = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Services", href: "index.html#services" },
    { label: "Case Studies", href: "index.html#case-studies" },
    { label: "Blog", href: "https://effixlabs.in/blog/" },
    { label: "Contact Us", href: "index.html#work-with-me" }
  ];

  function currentPage() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    return path === "" ? "index.html" : path;
  }

  function isActive(href) {
    const target = href.split("#")[0] || "index.html";
    return target === currentPage();
  }

  function iconMarkup() {
    return [
      '<svg aria-hidden="true" focusable="false" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
      '<rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)"></rect>',
      '<rect x="9.5" y="9.5" width="5" height="5" transform="rotate(45 12 12)"></rect>',
      '</svg>'
    ].join("");
  }

  function createToggle() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "effix-mobile-toggle";
    button.setAttribute("aria-label", "Open menu");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = "<span></span><span></span><span></span>";
    return button;
  }

  function createMobileBrand() {
    const brand = document.createElement("a");
    brand.href = "index.html";
    brand.className = "effix-mobile-header-brand";
    brand.setAttribute("aria-label", "Effix Audit home");
    brand.innerHTML = `${iconMarkup()}<span>EFFIX AUDIT</span>`;
    return brand;
  }

  function createMenu() {
    const menu = document.createElement("aside");
    menu.className = "effix-mobile-menu";
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("aria-label", "Mobile navigation");

    const links = navItems.map((item) => {
      const active = isActive(item.href) ? " is-active" : "";
      return `<li><a class="${active}" href="${item.href}">${item.label}</a></li>`;
    }).join("");

    menu.innerHTML = `
      <div class="effix-mobile-menu-inner">
        <div class="effix-mobile-menu-top">
          <a href="index.html" class="effix-mobile-brand" aria-label="Effix home">
            ${iconMarkup()}
            <span>EFFIX AUDIT</span>
          </a>
          <button type="button" class="effix-mobile-close" aria-label="Close menu">
            <span></span><span></span>
          </button>
        </div>
        <ul class="effix-mobile-menu-links">${links}</ul>
        <div class="effix-mobile-menu-actions">
          <a href="index.html#audit" class="effix-mobile-action secondary">Instant Audit</a>
          <a href="manual-audit.html" class="effix-mobile-action secondary">Request Manual Audit</a>
        </div>
      </div>
    `;

    return menu;
  }

  function findHeader() {
    return document.querySelector(".top-header .container") ||
      document.querySelector(".top-nav") ||
      document.querySelector(".page-nav") ||
      document.querySelector("body > nav");
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
    const responsivePlaceholders = [
      {
        selector: "#audit-url",
        mobile: "Enter your website URL",
        desktop: "Enter your website URL (e.g., yourwebsite.com)"
      }
    ];

    function tuneMobileCopy() {
      responsivePlaceholders.forEach((item) => {
        const input = document.querySelector(item.selector);
        if (!input) return;
        input.setAttribute("placeholder", window.matchMedia("(max-width: 767px)").matches ? item.mobile : item.desktop);
      });
    }

    function preserveHtml(element) {
      if (!element || element.dataset.mobileOriginalHtml) return;
      element.dataset.mobileOriginalHtml = element.innerHTML;
    }

    function restoreHtml(element) {
      if (!element || !element.dataset.mobileOriginalHtml) return;
      element.innerHTML = element.dataset.mobileOriginalHtml;
    }

    function tuneMobileHeadings() {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const caseHeading = document.querySelector("#case-studies h2");
      const resultsHeading = document.querySelector(".testimonials-heading");
      const aboutHeading = document.querySelector("#about-heading");
      const faqHeading = document.querySelector("#faqs h2");

      [caseHeading, resultsHeading, aboutHeading, faqHeading].forEach(preserveHtml);

      if (isMobile) {
        if (caseHeading) {
          caseHeading.innerHTML = '<span class="mobile-case-heading">Case <em>Studies</em> <span>(4)</span></span>';
        }
        if (resultsHeading) {
          resultsHeading.innerHTML = '<div class="mobile-results-heading">Apparently I get <em>results</em></div>';
        }
        if (aboutHeading) {
          aboutHeading.innerHTML = '<span class="mobile-about-heading">Human SEO <em>AI</em> Insights</span>';
        }
        if (faqHeading) {
          faqHeading.textContent = "Frequently Asked Questions";
        }
      } else {
        [caseHeading, resultsHeading, aboutHeading, faqHeading].forEach(restoreHtml);
      }
    }

    tuneMobileCopy();
    tuneMobileHeadings();
    window.addEventListener("resize", tuneMobileCopy);
    window.addEventListener("resize", tuneMobileHeadings);

    const header = findHeader();
    if (!header || document.querySelector(".effix-mobile-toggle")) return;

    const mobileBrand = createMobileBrand();
    const toggle = createToggle();
    const menu = createMenu();
    const closeButton = menu.querySelector(".effix-mobile-close");
    const menuLinks = menu.querySelectorAll("a");

    header.insertBefore(mobileBrand, header.firstChild);
    header.appendChild(toggle);
    document.body.appendChild(menu);

    function openMenu() {
      document.body.classList.add("mobile-menu-open");
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }

    function closeMenu() {
      document.body.classList.remove("mobile-menu-open");
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    toggle.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeButton) closeButton.addEventListener("click", closeMenu);

    menu.addEventListener("click", function (event) {
      if (event.target === menu || event.target.classList.contains("effix-mobile-menu-inner")) closeMenu();
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
        toggle.focus({ preventScroll: true });
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 767 && menu.classList.contains("is-open")) {
        closeMenu();
      }
    });
    } catch (error) {
      if (window.EffixSiteStability) {
        window.EffixSiteStability.restoreStylesheets();
        window.EffixSiteStability.showSafeError("Mobile navigation recovered from a rendering issue.");
      }
      if (window.console && console.error) console.error(error);
    }
  });
})();
