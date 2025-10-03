import { $, formatUSD } from "./utils.js";
import { state, setQty } from "./storage.js";

function badges() {
  $("#favCount").textContent = Object.keys(state.fav).length || "";
  const n = Object.values(state.cart).reduce((s, x) => s + (x.qty || 0), 0);
  $("#cartCount").textContent = n || "";
}
badges();

function render() {
  const wrap = $("#cartWrap");
  const items = Object.values(state.cart);
  if (!items.length) {
    wrap.innerHTML = '<div class="empty">Your cart is empty.</div>';
    return;
  }
  let total = 0;
  const rows = items
    .map(({ product: p, qty }) => {
      const sub = p.price * qty;
      total += sub;
      return `
    <tr>
      <td style="display:flex;gap:8px;align-items:center">
        <img src="${
          p.image || "assets/logo.png"
        }" alt="" style="width:42px;height:42px;object-fit:contain;border:1px solid var(--border);border-radius:8px;background:#0b1220;padding:4px"/>
        <div><div class="title">${p.title}</div><div class="small">${
        p.category
      }</div></div>
      </td>
      <td>${formatUSD(p.price)}</td>
      <td><input type="number" min="0" value="${qty}" data-qty="${
        p.id
      }" style="width:70px"></td>
      <td>${formatUSD(sub)}</td>
    </tr>`;
    })
    .join("");
  wrap.innerHTML = `<table><thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead><tbody>${rows}</tbody></table>
  <p><strong>Total: ${formatUSD(total)}</strong></p>`;
  wrap.querySelectorAll("[data-qty]").forEach((inp) =>
    inp.addEventListener("input", (e) => {
      const id = +e.target.getAttribute("data-qty");
      const v = Math.max(0, Math.floor(+e.target.value || 0));
      setQty(id, v);
      render();
    })
  );
}
render();
