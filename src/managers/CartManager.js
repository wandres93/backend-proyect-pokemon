import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  createCart = async () => {
    const carts = await this.getCarts();
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

    const newCart = {
      id: newId,
      products: [],
    };

    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return newCart;
  };

  getCartById = async (id) => {
    const carts = await this.getCarts();
    return carts.find((c) => c.id === id) || null;
  };

  addProductToCart = async (cartId, productId) => {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];

    // Verificar si el producto ya existe en el carrito
    const productIndex = cart.products.findIndex(
      (p) => p.product === productId,
    );

    if (productIndex !== -1) {
      // Si existe, sumar cantidad
      cart.products[productIndex].quantity++;
    } else {
      // Si no existe, agregar con quantity 1
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[cartIndex] = cart;
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return cart;
  };
}
