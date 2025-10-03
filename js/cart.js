import { $, formatUSD } from "./utils.js";
import { state, setQty, getFavoriteCount, getCartItemCount } from "./storage.js";

function updateBadgeCounts() {
  const favBadge = $("#favCount");
  const cartBadge = $("#cartCount");

  if (favBadge) favBadge.textContent = getFavoriteCount() || "";
  if (cartBadge) cartBadge.textContent = getCartItemCount() || "";
}

function buildRow(item) {
  const { product, qty } = item;
  const imageSrc = product.image || "assets/logo.png";
  const subtotal = product.price * qty;

  return `
    <tr>
      <td style="display:flex;gap:8px;align-items:center">
        <img src="${imageSrc}" alt="" style="width:42px;height:42px;object-fit:contain;border:1px solid var(--border);border-radius:8px;background:#0b1220;padding:4px" />
        <div>
          <div class="title">${product.title}</div>
          <div class="small">${product.category}</div>
        </div>
      </td>
      <td>${formatUSD(product.price)}</td>
      <td>
        <input type="number" min="0" value="${qty}" data-qty="${product.id}" style="width:70px" />
      </td>
      <td>${formatUSD(subtotal)}</td>
    </tr>
  `;
}

function renderCart() {
  const container = $("#cartWrap");
  const items = Object.values(state.cart);

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<div class="empty">Your cart is empty.</div>';
    updateBadgeCounts();
    return;
  }

  let rowsHtml = "";
  let orderTotal = 0;

  for (const item of items) {
    rowsHtml += buildRow(item);
    orderTotal += item.product.price * item.qty;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <p><strong>Total: ${formatUSD(orderTotal)}</strong></p>
  `;

  container.querySelectorAll("[data-qty]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const id = Number(event.currentTarget.dataset.qty);
      const value = Number(event.currentTarget.value);
      const safeValue = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
      setQty(id, safeValue);
      renderCart();
    });
  });

  updateBadgeCounts();
}

renderCart();
