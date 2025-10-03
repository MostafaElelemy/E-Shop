function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const state = {
  fav: read("eshop_fav", {}),
  cart: read("eshop_cart", {}),
};

export function toggleFav(id) {
  if (state.fav[id]) {
    delete state.fav[id];
  } else {
    state.fav[id] = true;
  }
  write("eshop_fav", state.fav);
}

export function addOnce(product) {
  if (!state.cart[product.id]) {
    state.cart[product.id] = { product, qty: 1 };
    write("eshop_cart", state.cart);
  }
}

export function setQty(id, qty) {
  if (qty <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id].qty = qty;
  }
  write("eshop_cart", state.cart);
}

export function entries() {
  return Object.values(state.cart);
}

export function total() {
  let sum = 0;
  for (const { product, qty } of entries()) {
    sum += product.price * qty;
  }
  return sum;
}

export function inCart(id) {
  return Boolean(state.cart[id]);
}

export function removeFromCart(id) {
  if (state.cart[id]) {
    delete state.cart[id];
    write("eshop_cart", state.cart);
  }
}

export function clearCart() {
  state.cart = {};
  write("eshop_cart", state.cart);
}

export function getFavoriteCount() {
  return Object.keys(state.fav).length;
}

export function getCartItemCount() {
  let count = 0;
  for (const item of Object.values(state.cart)) {
    count += item.qty || 0;
  }
  return count;
}
