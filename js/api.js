async function fetchRemoteProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error("Network error");
  }
  return response.json();
}

async function fetchLocalProducts() {
  const response = await fetch("./assets/products.json");
  return response.json();
}

export async function getProducts() {
  try {
    const remoteProducts = await fetchRemoteProducts();
    return remoteProducts;
  } catch (err) {
    const localProducts = await fetchLocalProducts();
    return localProducts;
  }
}