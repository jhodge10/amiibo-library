document.addEventListener("DOMContentLoaded", () => {
  setupMobileNavigation();
  setupAmiiboFilters();
  setupAmiiboSelections();
});

/**
 * Opens and closes the navigation menu on smaller screens.
 */
function setupMobileNavigation() {
  const toggleButton = document.querySelector("#nav-toggle");
  const navLinks = document.querySelector("#nav-links");
  const accountLinks = document.querySelector(".account-links");

  if (!toggleButton || !navLinks) {
    return;
  }

  toggleButton.addEventListener("click", () => {
    const menuIsOpen = navLinks.classList.toggle("open");

    if (accountLinks) {
      accountLinks.classList.toggle("open", menuIsOpen);
    }

    toggleButton.setAttribute(
      "aria-expanded",
      menuIsOpen ? "true" : "false"
    );

    const icon = toggleButton.querySelector("i");

    if (icon) {
      icon.classList.toggle("fa-bars", !menuIsOpen);
      icon.classList.toggle("fa-xmark", menuIsOpen);
    }
  });
}

/**
 * Provides live client-side searching and filtering.
 */
function setupAmiiboFilters() {
  const grid = document.querySelector("#amiibo-grid");

  const cards = Array.from(
    document.querySelectorAll(".amiibo-card[data-name]")
  );

  const searchInput = document.querySelector("#amiibo-search");
  const seriesFilter = document.querySelector("#series-filter");
  const typeFilter = document.querySelector("#type-filter");
  const visibleCount = document.querySelector("#visible-count");
  const noResults = document.querySelector("#no-results");
  const clearButton = document.querySelector("#clear-filters");

  const noResultsClearButton = document.querySelector(
    "#no-results-clear"
  );

  if (!grid || cards.length === 0) {
    return;
  }

  function applyFilters() {
    const searchText =
      searchInput?.value.trim().toLowerCase() || "";

    const selectedSeries =
      seriesFilter?.value.toLowerCase() || "";

    const selectedType =
      typeFilter?.value.toLowerCase() || "";

    let numberVisible = 0;

    cards.forEach((card) => {
      const name = card.dataset.name || "";
      const character = card.dataset.character || "";
      const series = card.dataset.series || "";
      const type = card.dataset.type || "";

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        character.includes(searchText);

      const matchesSeries =
        !selectedSeries || series === selectedSeries;

      const matchesType =
        !selectedType || type === selectedType;

      const shouldShow =
        matchesSearch &&
        matchesSeries &&
        matchesType;

      card.hidden = !shouldShow;

      if (shouldShow) {
        numberVisible += 1;
      }
    });

    if (visibleCount) {
      visibleCount.textContent = String(numberVisible);
    }

    if (noResults) {
      noResults.hidden = numberVisible !== 0;
    }

    grid.hidden = numberVisible === 0;
  }

  function clearFilters() {
    if (searchInput) {
      searchInput.value = "";
    }

    if (seriesFilter) {
      seriesFilter.value = "";
    }

    if (typeFilter) {
      typeFilter.value = "";
    }

    applyFilters();

    searchInput?.focus();
  }

  searchInput?.addEventListener("input", applyFilters);
  seriesFilter?.addEventListener("change", applyFilters);
  typeFilter?.addEventListener("change", applyFilters);
  clearButton?.addEventListener("click", clearFilters);

  noResultsClearButton?.addEventListener(
    "click",
    clearFilters
  );

  applyFilters();
}

/**
 * Saves wishlist and collection selections to PostgreSQL.
 */
function setupAmiiboSelections() {
  const grid = document.querySelector("#amiibo-grid");

  if (!grid) {
    return;
  }

  const isAuthenticated =
    grid.dataset.authenticated === "true";

  const wishlistButtons = document.querySelectorAll(
    ".wishlist-button"
  );

  const collectionButtons = document.querySelectorAll(
    ".collection-button"
  );

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!isAuthenticated) {
        window.location.href = "/login";
        return;
      }

      await updateSelection({
        button,
        endpoint: "/amiibos/wishlist",
        iconClass: "fa-star",
        selectedTitle: "Remove from wishlist",
        unselectedTitle: "Add to wishlist",
        selectedLabel:
          "Remove this amiibo from the wishlist",
        unselectedLabel:
          "Add this amiibo to the wishlist"
      });
    });
  });

  collectionButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!isAuthenticated) {
        window.location.href = "/login";
        return;
      }

      await updateSelection({
        button,
        endpoint: "/amiibos/collection",
        iconClass: "fa-heart",
        selectedTitle: "Remove from collection",
        unselectedTitle: "Add to collection",
        selectedLabel:
          "Remove this amiibo from the collection",
        unselectedLabel:
          "Add this amiibo to the collection"
      });
    });
  });
}

/**
 * Sends one star or heart update to the server.
 */
async function updateSelection({
  button,
  endpoint,
  iconClass,
  selectedTitle,
  unselectedTitle,
  selectedLabel,
  unselectedLabel
}) {
  const card = button.closest(".amiibo-card");

  if (!card) {
    return;
  }

  const head = card.dataset.head;
  const tail = card.dataset.tail;

  if (!head || !tail) {
    return;
  }

  const isSelected =
    button.dataset.selected === "true";

  const nextSelected = !isSelected;

  button.disabled = true;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        head,
        tail,
        selected: nextSelected
      })
    });

    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "The selection could not be saved."
      );
    }

    setButtonState({
      button,
      selected: nextSelected,
      iconClass,
      selectedTitle,
      unselectedTitle,
      selectedLabel,
      unselectedLabel
    });

    animateIcon(button);
  } catch (error) {
    console.error(error);

    window.alert(
      "The selection could not be saved. Please try again."
    );
  } finally {
    button.disabled = false;
  }
}

/**
 * Updates the filled or outlined icon state.
 */
function setButtonState({
  button,
  selected,
  iconClass,
  selectedTitle,
  unselectedTitle,
  selectedLabel,
  unselectedLabel
}) {
  const icon = button.querySelector("i");

  button.dataset.selected = String(selected);
  button.classList.toggle("selected", selected);

  button.title = selected
    ? selectedTitle
    : unselectedTitle;

  button.setAttribute(
    "aria-label",
    selected
      ? selectedLabel
      : unselectedLabel
  );

  if (icon) {
    icon.className = selected
      ? `fa-solid ${iconClass}`
      : `fa-regular ${iconClass}`;
  }
}

/**
 * Briefly animates a selected star or heart.
 */
function animateIcon(button) {
  button.classList.remove("icon-pop");

  void button.offsetWidth;

  button.classList.add("icon-pop");

  window.setTimeout(() => {
    button.classList.remove("icon-pop");
  }, 300);
}