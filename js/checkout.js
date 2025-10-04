import { $, formatUSD } from "./utils.js";
import {
  entries,
  total,
  clearCart,
  getFavoriteCount,
  getCartItemCount,
} from "./storage.js";

function updateBadgeCounts() {
  const favBadge = $("#favCount");
  const cartBadge = $("#cartCount");

  if (favBadge) favBadge.textContent = getFavoriteCount() || "";
  if (cartBadge) cartBadge.textContent = getCartItemCount() || "";
}

function renderSummary() {
  const wrapper = $("#summary");
  const items = entries();

  if (!wrapper) return;

  if (items.length === 0) {
    wrapper.innerHTML = '<div class="empty">Cart is empty.</div>';
    return;
  }

  let rowsHtml = "";
  for (const { product, qty } of items) {
    const subtotal = formatUSD(product.price * qty);
    rowsHtml += `<tr><td>${product.title}</td><td>${qty}</td><td>${subtotal}</td></tr>`;
  }

  wrapper.innerHTML = `
    <table>
      <thead>
        <tr><th>Item</th><th>Qty</th><th>Subtotal</th></tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <p><strong>Total: ${formatUSD(total())}</strong></p>
  `;
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  const name = (formData.get("name") || "").trim();
  const email = (formData.get("email") || "").trim();
  const address = (formData.get("address") || "").trim();

  const nameIsValid = /^[A-Za-z ]+$/.test(name);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const addressIsValid = address.length >= 6;

  if (!nameIsValid || !emailIsValid || !addressIsValid) {
    alert("Please enter a valid name, email, and address.");
    return;
  }

  alert("Order placed!");
  clearCart();
  updateBadgeCounts();
  renderSummary();
  window.location.href = "index.html";
}

updateBadgeCounts();
renderSummary();

const checkoutForm = $("#checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", handleSubmit);
}
