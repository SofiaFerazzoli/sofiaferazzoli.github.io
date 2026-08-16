(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const languageButtons = [...document.querySelectorAll("[data-language]")];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const translations = {
    en: {
      pageTitle: "Sofia Ferazzoli — Astrophysics & Cosmology",
      navLabel: "Primary navigation",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      copied: "IBAN copied",
      copyFailed: "Select and copy the IBAN above"
    },
    it: {
      pageTitle: "Sofia Ferazzoli — Astrofisica e Cosmologia",
      navLabel: "Navigazione principale",
      menuOpen: "Apri il menu",
      menuClose: "Chiudi il menu",
      copied: "IBAN copiato",
      copyFailed: "Seleziona e copia l’IBAN qui sopra"
    }
  };

  const setLanguage = (language, persist = true) => {
    const nextLanguage = language === "it" ? "it" : "en";
    root.lang = nextLanguage;
    document.title = translations[nextLanguage].pageTitle;
    navigation?.setAttribute("aria-label", translations[nextLanguage].navLabel);

    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === nextLanguage));
    });

    if (menuButton) {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute(
        "aria-label",
        isOpen ? translations[nextLanguage].menuClose : translations[nextLanguage].menuOpen
      );
    }

    if (persist) {
      try {
        localStorage.setItem("sofia-site-language", nextLanguage);
      } catch (_) {
        // The language still works when browser storage is unavailable.
      }
    }
  };

  let savedLanguage = null;
  try {
    savedLanguage = localStorage.getItem("sofia-site-language");
  } catch (_) {
    savedLanguage = null;
  }

  const browserLanguage = navigator.language?.toLowerCase().startsWith("it") ? "it" : "en";
  setLanguage(savedLanguage || browserLanguage, false);

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", translations[root.lang].menuOpen);
    navigation.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute(
      "aria-label",
      willOpen ? translations[root.lang].menuClose : translations[root.lang].menuOpen
    );
    navigation?.classList.toggle("is-open", willOpen);
    body.classList.toggle("menu-open", willOpen);
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton?.focus();
    }
  });

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const copyIbanButton = document.querySelector("[data-copy-iban]");
  const copyFeedback = document.querySelector("[data-copy-feedback]");
  let copyFeedbackTimer = null;

  const copyText = async (value) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const temporaryField = document.createElement("textarea");
    temporaryField.value = value;
    temporaryField.setAttribute("readonly", "");
    temporaryField.style.position = "fixed";
    temporaryField.style.opacity = "0";
    document.body.append(temporaryField);
    temporaryField.select();

    try {
      return document.execCommand("copy");
    } finally {
      temporaryField.remove();
    }
  };

  copyIbanButton?.addEventListener("click", async () => {
    let didCopy = false;

    try {
      didCopy = await copyText(copyIbanButton.dataset.copyIban);
    } catch (_) {
      didCopy = false;
    }

    if (!copyFeedback) return;
    copyFeedback.textContent = translations[root.lang][didCopy ? "copied" : "copyFailed"];
    window.clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = window.setTimeout(() => {
      copyFeedback.textContent = "";
    }, 3200);
  });

  const revealItems = [...document.querySelectorAll(".reveal")];
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    root.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("is-active", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-18% 0px -65%", threshold: [0, 0.1, 0.4] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) closeMenu();
  });
})();
