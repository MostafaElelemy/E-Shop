import { $, formatUSD } from "./utils.js";
import {
  state,
  toggleFav,
  addOnce,
  getFavoriteCount,
  getCartItemCount,
} from "./storage.js";

const proceedButton = $("#favProceed");
let productCache = new Map();

function getFavouriteIds() {
  return Object.keys(state.fav).map(Number);
}

function getFavouriteProducts() {
  const products = [];
  for (const id of getFavouriteIds()) {
    const product = productCache.get(id);
    if (product) {
      products.push(product);
    }
  }
  return products;
}

function updateProceedButton(count) {
  if (!proceedButton) return;

  if (count > 0) {
    proceedButton.disabled = false;
    proceedButton.textContent =
      count === 1 ? "Move 1 favorite to cart" : `Move ${count} favorites to cart`;
  } else {
    proceedButton.disabled = true;
    proceedButton.textContent = "Move favorites to cart";
  }
}

function updateBadgeCounts() {
  const favBadge = $("#favCount");
  const cartBadge = $("#cartCount");

  if (favBadge) favBadge.textContent = getFavoriteCount() || "";
  if (cartBadge) cartBadge.textContent = getCartItemCount() || "";
}

function renderFavourites(products) {
  const grid = $("#grid");
  if (!grid) return;

  grid.innerHTML = "";
  updateProceedButton(products.length);
  updateBadgeCounts();

  if (products.length === 0) {
    grid.innerHTML = '<div class="empty">No favorites yet.</div>';
    return;
  }

  for (const product of products) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="img"><img src="${product.image || "assets/logo.png"}" alt=""></div>
      <div class="meta">
        <div class="badge">${product.category}</div>
        <div class="title">${product.title}</div>
        <div class="price">${formatUSD(product.price)}</div>
        <div class="actions">
          <button class="btn" data-remove>Remove</button>
        </div>
      </div>`;

    card.querySelector("[data-remove]").addEventListener("click", () => {
      toggleFav(product.id);
      renderFavourites(getFavouriteProducts());
    });

    grid.appendChild(card);
  }
}

if (proceedButton) {
  proceedButton.addEventListener("click", () => {
    const products = getFavouriteProducts();
    if (!products.length) return;

    for (const product of products) {
      addOnce(product);
    }

    window.location.href = "cart.html";
  });
}

async function loadProducts() {
  if (productCache.size) {
    renderFavourites(getFavouriteProducts());
    return;
  }

  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    productCache = new Map(data.map((item) => [item.id, { ...item, price: Number(item.price) }]));
  } catch (error) {
    const response = await fetch("./assets/products.json");
    const data = await response.json();
    productCache = new Map(data.map((item) => [item.id, { ...item, price: Number(item.price) }]));
  }

  renderFavourites(getFavouriteProducts());
}

loadProducts();
