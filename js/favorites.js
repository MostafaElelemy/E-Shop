import { $, formatUSD } from "./utils.js";
import { state, toggleFav, addOnce } from "./storage.js";

const proceedBtn = $("#favProceed");
let productCache = new Map();

const favIds = () => Object.keys(state.fav).map(Number);
const favProducts = () =>
  favIds()
    .map((id) => productCache.get(id))
    .filter(Boolean);

function updateProceedState(count) {
  if (!proceedBtn) return;
  if (count > 0) {
    proceedBtn.disabled = false;
    proceedBtn.textContent =
      count === 1
        ? "Move 1 favorite to cart"
        : `Move ${count} favorites to cart`;
  } else {
    proceedBtn.disabled = true;
    proceedBtn.textContent = "Move favorites to cart";
  }
}

function render(items) {
  const grid = $("#grid");
  grid.innerHTML = "";
  updateProceedState(favIds().length);
  if (!items.length) {
    grid.innerHTML = '<div class="empty">No favorites yet.</div>';
    return;
  }
  for (const p of items) {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <div class="img"><img src="${p.image || "assets/logo.png"}" alt=""></div>
      <div class="meta">
        <div class="badge">${p.category}</div>
        <div class="title">${p.title}</div>
        <div class="price">${formatUSD(p.price)}</div>
        <div class="actions">
          <button class="btn" data-remove>Remove</button>

        </div>
      </div>`;
    el.querySelector("[data-remove]").addEventListener("click", () => {
      toggleFav(p.id);
      render(favProducts());
    });
    grid.appendChild(el);
  }
}

function badges() {
  $("#favCount").textContent = Object.keys(state.fav).length || "";
  const n = Object.values(state.cart).reduce((s, x) => s + (x.qty || 0), 0);
  $("#cartCount").textContent = n || "";
}
badges();

proceedBtn?.addEventListener("click", () => {
  const items = favProducts();
  if (!items.length) return;
  items.forEach(addOnce);
  window.location.href = "cart.html";
});

async function boot() {
  if (!productCache.size) {
    try {
      const r = await fetch("https://fakestoreapi.com/products");
      const data = await r.json();
      productCache = new Map(
        data.map((p) => [
          p.id,
          {
            id: p.id,
            title: p.title,
            price: +p.price,
            category: p.category,
            image: p.image,
          },
        ])
      );
    } catch {
      const r = await fetch("./assets/products.json");
      const data = await r.json();
      productCache = new Map(data.map((p) => [p.id, p]));
    }
  }
  render(favProducts());
}
boot();
