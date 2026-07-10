document.addEventListener("DOMContentLoaded", () => {
  setupMobileNavigation();
  setupFutureLinks();
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
 * Prevents placeholder links from moving the user to the top of the page.
 * These links will become real routes during later phases.
 */
function setupFutureLinks() {
  const futureLinks = document.querySelectorAll(
    '.future-link[aria-disabled="true"]'
  );

  futureLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
}

/**
 * Provides live client-side searching and filtering on the Amiibo page.
 */
function setupAmiiboFilters() {
  const grid = document.querySelector("#amiibo-grid");
  const cards = Array.from(
    document.querySelectorAll(".amiibo-card")
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
    const searchText = searchInput?.value.trim().toLowerCase() || "";
    const selectedSeries = seriesFilter?.value.toLowerCase() || "";
    const selectedType = typeFilter?.value.toLowerCase() || "";

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
        matchesSearch && matchesSeries && matchesType;

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
  noResultsClearButton?.addEventListener("click", clearFilters);

  applyFilters();
}

/**
 * Gives wishlist and collection buttons their filled and empty states.
 *
 * During Phase 1, selections are stored in localStorage. In a later phase,
 * these actions will be saved to PostgreSQL for the logged-in user.
 */
function setupAmiiboSelections() {
  const cards = document.querySelectorAll(".amiibo-card");

  if (cards.length === 0) {
    return;
  }

  const savedWishlist = readStoredSelections(
    "amiiboVaultWishlist"
  );

  const savedCollection = readStoredSelections(
    "amiiboVaultCollection"
  );

  cards.forEach((card) => {
    const head = card.dataset.head;
    const tail = card.dataset.tail;

    if (!head || !tail) {
      return;
    }

    const amiiboId = `${head}-${tail}`;

    const wishlistButton = card.querySelector(
      ".wishlist-button"
    );

    const collectionButton = card.querySelector(
      ".collection-button"
    );

    if (wishlistButton) {
      setWishlistButtonState(
        wishlistButton,
        savedWishlist.includes(amiiboId)
      );

      wishlistButton.addEventListener("click", () => {
        const isSelected =
          wishlistButton.dataset.selected === "true";

        updateStoredSelection(
          "amiiboVaultWishlist",
          amiiboId,
          !isSelected
        );

        setWishlistButtonState(
          wishlistButton,
          !isSelected
        );

        animateIcon(wishlistButton);
      });
    }

    if (collectionButton) {
      setCollectionButtonState(
        collectionButton,
        savedCollection.includes(amiiboId)
      );

      collectionButton.addEventListener("click", () => {
        const isSelected =
          collectionButton.dataset.selected === "true";

        updateStoredSelection(
          "amiiboVaultCollection",
          amiiboId,
          !isSelected
        );

        setCollectionButtonState(
          collectionButton,
          !isSelected
        );

        animateIcon(collectionButton);
      });
    }
  });
}

/**
 * Reads an array of Amiibo identifiers from localStorage.
 */
function readStoredSelections(storageKey) {
  try {
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error(
      `Unable to read ${storageKey} from localStorage:`,
      error
    );

    return [];
  }
}

/**
 * Adds or removes an Amiibo identifier from localStorage.
 */
function updateStoredSelection(
  storageKey,
  amiiboId,
  shouldInclude
) {
  const selections = readStoredSelections(storageKey);
  const selectionSet = new Set(selections);

  if (shouldInclude) {
    selectionSet.add(amiiboId);
  } else {
    selectionSet.delete(amiiboId);
  }

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(Array.from(selectionSet))
    );
  } catch (error) {
    console.error(
      `Unable to save ${storageKey} in localStorage:`,
      error
    );
  }
}

/**
 * Updates the appearance and accessibility text of a wishlist button.
 */
function setWishlistButtonState(button, isSelected) {
  const icon = button.querySelector("i");

  button.dataset.selected = String(isSelected);
  button.classList.toggle("selected", isSelected);

  if (icon) {
    icon.classList.toggle("fa-regular", !isSelected);
    icon.classList.toggle("fa-solid", isSelected);
  }

  button.title = isSelected
    ? "Remove from wishlist"
    : "Add to wishlist";

  button.setAttribute(
    "aria-label",
    isSelected
      ? "Remove this amiibo from the wishlist"
      : "Add this amiibo to the wishlist"
  );
}

/**
 * Updates the appearance and accessibility text of a collection button.
 */
function setCollectionButtonState(button, isSelected) {
  const icon = button.querySelector("i");

  button.dataset.selected = String(isSelected);
  button.classList.toggle("selected", isSelected);

  if (icon) {
    icon.classList.toggle("fa-regular", !isSelected);
    icon.classList.toggle("fa-solid", isSelected);
  }

  button.title = isSelected
    ? "Remove from collection"
    : "Add to collection";

  button.setAttribute(
    "aria-label",
    isSelected
      ? "Remove this amiibo from the collection"
      : "Add this amiibo to the collection"
  );
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