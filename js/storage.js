
const read = (k, f) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : f;
  } catch {
    return f;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const state = {
  fav: read("eshop_fav", {}),
  cart: read("eshop_cart", {}),
};

export function toggleFav(id) {
  if (state.fav[id]) delete state.fav[id];
  else state.fav[id] = true;
  write("eshop_fav", state.fav);
}
export function addOnce(product) {
  if (!state.cart[product.id]) {
    state.cart[product.id] = { product, qty: 1 };
    write("eshop_cart", state.cart);
  }
}
export function setQty(id, qty) {
  if (qty <= 0) delete state.cart[id];
  else state.cart[id].qty = qty;
  write("eshop_cart", state.cart);
}
export const entries = () => Object.values(state.cart);
export const total = () =>
  entries().reduce((s, { product, qty }) => s + product.price * qty, 0);

export function inCart(id) {
  return !!state.cart[id];
}

export function removeFromCart(id) {
  if (state.cart[id]) {
    delete state.cart[id];
    localStorage.setItem("eshop_cart", JSON.stringify(state.cart));
  }
}
