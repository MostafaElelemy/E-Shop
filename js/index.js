import { $, $$, debounce, formatUSD } from "./utils.js";
import {
  state,
  toggleFav,
  addOnce,
  inCart,
  removeFromCart,
} from "./storage.js";
import { getProducts } from "./api.js";

let all = [],
  view = [];

function badges() {
  $("#favCount").textContent = Object.keys(state.fav).length || "";
  const n = Object.values(state.cart).reduce((s, x) => s + (x.qty || 0), 0);
  $("#cartCount").textContent = n || "";
}

function card(p) {
  const el = document.createElement("article");
  el.className = "card";
  const inCartState = inCart(p.id);
  el.innerHTML = `
    <div class="img"><img src="${p.image || "assets/logo.png"}" alt=""></div>
    <div class="meta">
      <div class="badge">${p.category}</div>
      <div class="title">${p.title}</div>
      <div class="price">${formatUSD(p.price)}</div>
      <div class="actions">
        <button class="btn" data-fav>${
          state.fav[p.id] ? "★ Remove" : "☆ Favorite"
        }</button>
        <button class="btn primary" data-add>${
          inCartState ? "Added" : "Add to cart"
        }</button>
      </div>
    </div>`;
  el.querySelector("[data-fav]").addEventListener("click", () => {
    toggleFav(p.id);
    el.querySelector("[data-fav]").textContent = state.fav[p.id]
      ? "★ Remove"
      : "☆ Favorite";
    badges();
  });
  const addBtn = el.querySelector("[data-add]");
  addBtn.addEventListener("click", () => {
    if (inCart(p.id)) {
      removeFromCart(p.id);
      addBtn.textContent = "Add to cart";
    } else {
      addOnce(p);
      addBtn.textContent = "Added";
    }
    badges();
  });
  return el;
}

function render() {
  const grid = $("#grid");
  grid.innerHTML = "";
  view.forEach((p) => grid.appendChild(card(p)));
  $("#count").textContent = view.length ? `${view.length} items` : "No results";
  badges();
}

function apply() {
  const q = $("#search").value.trim().toLowerCase();
  const cat = $("#category").value || "All";
  view = all.filter(
    (p) =>
      (!q || p.title.toLowerCase().includes(q)) &&
      (cat === "All" || p.category === cat)
  );
  render();
}
console.log("here");
$("#search").addEventListener("input", debounce(apply, 200));
$("#category").addEventListener("change", apply);

(async function boot() {
  try {
    all = await getProducts();
    const cats = ["All", ...new Set(all.map((p) => p.category))];
    $("#category").innerHTML = cats
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
    apply();
  } catch (e) {
    $("#grid").innerHTML = '<div class="empty">Could not load products.</div>';
  }
  badges();
})();
