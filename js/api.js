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

function normaliseProduct(product) {
  return {
    id: product.id,
    title: product.title,
    price: Number(product.price),
    category: product.category,
    image: product.image,
  };
}

export async function getProducts() {
  try {
    const remoteProducts = await fetchRemoteProducts();
    return remoteProducts.map(normaliseProduct);
  } catch (err) {
    const localProducts = await fetchLocalProducts();
    return localProducts.map(normaliseProduct);
  }
}
