const themeToggleSelector = "[data-theme-toggle]";
const menuToggleSelector = "[data-menu-toggle]";
const mobileNavSelector = "[data-mobile-nav]";
const tagFilterSelector = "[data-tag-filter]";
const postRowSelector = "[data-testid='post-row']";
const postSearchSelector = "[data-post-search]";

function setTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem("theme", theme);
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

function setupMobileMenu() {
  const menuToggle = document.querySelector<HTMLButtonElement>(menuToggleSelector);
  const mobileNav = document.querySelector<HTMLElement>(mobileNavSelector);

  if (!menuToggle || !mobileNav) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !isExpanded;

    menuToggle.setAttribute("aria-expanded", String(nextExpanded));
    menuToggle.setAttribute("aria-label", nextExpanded ? "Close navigation menu" : "Open navigation menu");
    mobileNav.hidden = !nextExpanded;

    const openIcon = menuToggle.querySelector<HTMLElement>("[data-menu-open-icon]");
    const closeIcon = menuToggle.querySelector<HTMLElement>("[data-menu-close-icon]");
    if (openIcon && closeIcon) {
      openIcon.hidden = nextExpanded;
      closeIcon.hidden = !nextExpanded;
    }
  });
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
setupMobileMenu();
setupPostFilters();
setupCopyButtons();
