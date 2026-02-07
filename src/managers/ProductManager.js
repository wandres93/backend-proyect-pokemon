import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Leer productos del archivo
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Error al leer productos:", error);
      return [];
    }
  };

  // Agregar producto
  addProduct = async (product) => {
    try {
      const products = await this.getProducts();

      // Validaciones
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.code ||
        !product.stock ||
        !product.category
      ) {
        return "Todos los campos son obligatorios";
      }
      if (products.some((p) => p.code === product.code)) {
        return "El código del producto ya existe";
      }

      // Generar ID
      const newId =
        products.length > 0 ? products[products.length - 1].id + 1 : 1;

      const newProduct = {
        id: newId,
        status: true,
        thumbnails: product.thumbnails || [],
        ...product,
      };

      products.push(newProduct);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t"),
      );
      return newProduct;
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // Obtener producto por ID
  getProductById = async (id) => {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);
    return product || null;
  };

  // Actualizar producto
  updateProduct = async (id, updates) => {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index !== -1) {
      // Evitamos que se actualice el ID
      const { id: _, ...rest } = updates;
      products[index] = { ...products[index], ...rest };
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t"),
      );
      return products[index];
    }
    return null;
  };

  // Eliminar producto
  deleteProduct = async (id) => {
    const products = await this.getProducts();
    const newProducts = products.filter((p) => p.id !== id);

    if (products.length !== newProducts.length) {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newProducts, null, "\t"),
      );
      return true;
    }
    return false;
  };
}
