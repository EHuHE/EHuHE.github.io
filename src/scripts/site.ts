const themeToggleSelector = "[data-theme-toggle]";
const languageToggleSelector = "[data-language-toggle]";
const menuToggleSelector = "[data-menu-toggle]";
const mobileNavSelector = "[data-mobile-nav]";
const tagFilterSelector = "[data-tag-filter]";
const postRowSelector = "[data-testid='post-row']";
const postSearchSelector = "[data-post-search]";

function setTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem("theme-v2", theme);
  } catch {
    // Theme still applies for the current page when persistent storage is blocked.
  }

  document.querySelectorAll<HTMLButtonElement>(themeToggleSelector).forEach((button) => {
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  });
}

function setupThemeToggle() {
  document.querySelectorAll<HTMLButtonElement>(themeToggleSelector).forEach((button) => {
    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  });

  setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
}

function setLanguage(language: "en" | "zh") {
  document.documentElement.dataset.lang = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

  try {
    localStorage.setItem("language", language);
  } catch {
    // Language still applies for the current page when persistent storage is blocked.
  }

  document.querySelectorAll<HTMLButtonElement>(languageToggleSelector).forEach((button) => {
    button.setAttribute(
      "aria-label",
      language === "zh" ? "Switch to English" : "Switch to Chinese",
    );
  });
}

function setupLanguageToggle() {
  document.querySelectorAll<HTMLButtonElement>(languageToggleSelector).forEach((button) => {
    button.addEventListener("click", () => {
      const currentLanguage = document.documentElement.dataset.lang === "zh" ? "zh" : "en";
      setLanguage(currentLanguage === "zh" ? "en" : "zh");
    });
  });

  setLanguage(document.documentElement.dataset.lang === "zh" ? "zh" : "en");
}

function setupMobileMenu() {
  const menuToggle = document.querySelector<HTMLButtonElement>(menuToggleSelector);
  const mobileNav = document.querySelector<HTMLElement>(mobileNavSelector);

  if (!menuToggle || !mobileNav) {
    return;
  }

  const openIcon = menuToggle.querySelector<HTMLElement>("[data-menu-open-icon]");
  const closeIcon = menuToggle.querySelector<HTMLElement>("[data-menu-close-icon]");

  function setMenuExpanded(isExpanded: boolean) {
    menuToggle!.setAttribute("aria-expanded", String(isExpanded));
    menuToggle!.setAttribute("aria-label", isExpanded ? "Close navigation menu" : "Open navigation menu");
    mobileNav!.hidden = !isExpanded;

    if (openIcon && closeIcon) {
      openIcon.hidden = isExpanded;
      closeIcon.hidden = !isExpanded;
    }
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuExpanded(!isExpanded);
  });

  const desktopBreakpoint = window.matchMedia("(min-width: 961px)");
  desktopBreakpoint.addEventListener("change", () => {
    setMenuExpanded(false);
  });

  if (desktopBreakpoint.matches) {
    setMenuExpanded(false);
  }
}

function normalizeTag(tag: string) {
  return tag.trim().toLocaleLowerCase();
}

function setupPostFilters() {
  const filterButtons = [...document.querySelectorAll<HTMLButtonElement>(tagFilterSelector)];
  const postRows = [...document.querySelectorAll<HTMLElement>(postRowSelector)];
  const searchInput = document.querySelector<HTMLInputElement>(postSearchSelector);
  const emptyState = document.querySelector<HTMLElement>("[data-post-empty-state]");
  const countOutput = document.querySelector<HTMLElement>("[data-post-count]");

  if (filterButtons.length === 0 || postRows.length === 0) {
    return;
  }

  let selectedTag = "all";

  function applyFilters() {
    const query = normalizeTag(searchInput?.value ?? "");
    let visibleCount = 0;

    postRows.forEach((row) => {
      const rowTags = (row.dataset.tags ?? "").split("|").map(normalizeTag);
      const rowSearch = normalizeTag(row.dataset.search ?? row.textContent ?? "");
      const matchesTag = selectedTag === "全部" || selectedTag === "all" || rowTags.includes(selectedTag);
      const matchesQuery = query.length === 0 || rowSearch.includes(query);
      const isVisible = matchesTag && matchesQuery;

      row.hidden = !isVisible;
      row.style.display = isVisible ? "" : "none";
      visibleCount += isVisible ? 1 : 0;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }

    if (countOutput) {
      countOutput.textContent = `${visibleCount} post${visibleCount === 1 ? "" : "s"}`;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedTag = normalizeTag(button.dataset.tagFilter ?? "all");

      filterButtons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
  applyFilters();
}

function setupCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>("[data-copy-value]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copyValue;
      if (!value) {
        return;
      }

      try {
        await navigator.clipboard.writeText(value);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy failed";
      }
    });
  });
}

setupThemeToggle();
setupLanguageToggle();
setupMobileMenu();
setupPostFilters();
setupCopyButtons();
