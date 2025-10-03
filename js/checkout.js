import { $, formatUSD } from "./utils.js";
import { entries, total } from "./storage.js";
import { state } from "./storage.js";

function summary() {
  const arr = entries();
  const wrap = $("#summary");
  if (!arr.length) {
    wrap.innerHTML = '<div class="empty">Cart is empty.</div>';
    return;
  }
  wrap.innerHTML = `<table><thead><tr><th>Item</th><th>Qty</th><th>Subtotal</th></tr></thead>
    <tbody>${arr
      .map(
        ({ product: p, qty }) =>
          `<tr><td>${p.title}</td><td>${qty}</td><td>${formatUSD(
            p.price * qty
          )}</td></tr>`
      )
      .join("")}</tbody></table>
    <p><strong>Total: ${formatUSD(total())}</strong></p>`;
}

function badges() {
  $("#favCount").textContent = Object.keys(state.fav).length || "";
  const n = Object.values(state.cart).reduce((s, x) => s + (x.qty || 0), 0);
  $("#cartCount").textContent = n || "";
}
badges();

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const name = (fd.get("name") || "").trim();
  const email = (fd.get("email") || "").trim();
  const address = (fd.get("address") || "").trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !ok || address.length < 6) {
    alert("Please enter a valid name, email, and address.");
    return;
  }
  alert("Order placed!");
  localStorage.setItem("eshop_cart", "{}");
  location.href = "index.html";
});
