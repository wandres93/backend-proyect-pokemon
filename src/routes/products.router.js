import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
// Instanciamos el manager apuntando al archivo
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  const limit = req.query.limit;
  if (limit) {
    return res.json(products.slice(0, limit));
  }
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await productManager.getProductById(pid);
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

router.post("/", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  if (typeof newProduct === "string") {
    return res.status(400).json({ error: newProduct });
  }
  res.status(201).json({ message: "Producto creado", product: newProduct });
});

router.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const updatedProduct = await productManager.updateProduct(pid, req.body);
  if (!updatedProduct)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto actualizado", product: updatedProduct });
});

router.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const deleted = await productManager.deleteProduct(pid);
  if (!deleted)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto eliminado" });
});

export default router;
