import { $, debounce, formatUSD } from "./utils.js";
import {
  state,
  toggleFav,
  addOnce,
  inCart,
  removeFromCart,
  getFavoriteCount,
  getCartItemCount,
} from "./storage.js";
import { getProducts } from "./api.js";

let allProducts = [];
let filteredProducts = [];

function updateBadgeCounts() {
  const favBadge = $("#favCount");
  const cartBadge = $("#cartCount");

  if (favBadge) favBadge.textContent = getFavoriteCount() || "";
  if (cartBadge) cartBadge.textContent = getCartItemCount() || "";
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "card";
  const isInCart = inCart(product.id);

  card.innerHTML = `
    <div class="img"><img src="${
      product.image || "assets/logo.png"
    }" alt=""></div>
    <div class="meta">
      <div class="badge">${product.category}</div>
      <div class="title">${product.title}</div>
      <div class="price">${formatUSD(product.price)}</div>
      <div class="actions">
        <button class="btn" data-fav>${
          state.fav[product.id] ? "★ Remove" : "☆ Favorite"
        }</button>
        <button class="btn primary" data-add>${
          isInCart ? "Added" : "Add to cart"
        }</button>
      </div>
    </div>`;

  const favButton = card.querySelector("[data-fav]");
  favButton.addEventListener("click", () => {
    toggleFav(product.id);
    favButton.textContent = state.fav[product.id] ? "★ Remove" : "☆ Favorite";
    updateBadgeCounts();
  });

  const addButton = card.querySelector("[data-add]");
  addButton.addEventListener("click", () => {
    if (inCart(product.id)) {
      removeFromCart(product.id);
      addButton.textContent = "Add to cart";
    } else {
      addOnce(product);
      addButton.textContent = "Added";
    }
    updateBadgeCounts();
  });

  return card;
}

function renderProducts() {
  const grid = $("#grid");
  if (!grid) return;

  grid.innerHTML = "";
  for (const product of filteredProducts) {
    grid.appendChild(createProductCard(product));
  }

  const count = $("#count");
  if (count) {
    count.textContent = filteredProducts.length
      ? `${filteredProducts.length} items`
      : "No results";
  }

  updateBadgeCounts();
}

function applyFiltersSearchs() {
  const searchValue = $("#search")?.value.trim().toLowerCase() || "";
  const selectedCategory = $("#category")?.value || "All";

  const result = [];
  for (const product of allProducts) {
    const matchesSearch =
      !searchValue || product.title.toLowerCase().includes(searchValue);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    if (matchesSearch && matchesCategory) {
      result.push(product);
    }
  }

  filteredProducts = result;
  renderProducts();
}

function populateCategories(products) {
  const select = $("#category");
  if (!select) return;

  const categories = new Set(["All"]);
  for (const product of products) {
    categories.add(product.category);
  }

  // select.innerHTML = "";
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  }
}

async function initialisePage() {
  try {
    allProducts = await getProducts();
    filteredProducts = allProducts.slice();
    populateCategories(allProducts);
    renderProducts();
  } catch (error) {
    const grid = $("#grid");
    if (grid) {
      grid.innerHTML = '<div class="empty">Could not load products.</div>';
    }
  }

  updateBadgeCounts();
}

const searchInput = $("#search");
if (searchInput) {
  searchInput.addEventListener("input", debounce(applyFiltersSearchs, 300));
}

const categorySelect = $("#category");
if (categorySelect) {
  categorySelect.addEventListener("change", applyFiltersSearchs);
}

initialisePage();
