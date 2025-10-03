
async function remote() {
  const r = await fetch("https://fakestoreapi.com/products");
  if (!r.ok) throw new Error("net");
  return r.json();
}
export async function getProducts() {
  try {
    const data = await remote();
    return data.map((p) => ({
      id: p.id,
      title: p.title,
      price: +p.price,
      category: p.category,
      image: p.image,
    }));
  } catch (e) {
    const r = await fetch("./assets/products.json");
    const data = await r.json();
    return data.map((p) => ({
      id: p.id,
      title: p.title,
      price: +p.price,
      category: p.category,
      image: p.image,
    }));
  }
}
