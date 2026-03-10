import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// Vista estática
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", {
    title: "Lista de Pokémon (Estática)",
    products,
  });
});

// Vista con WebSockets
router.get("/realtimeproducts", (req, res) => {
  // No pasamos productos aquí porque se cargarán vía Socket.io
  res.render("realTimeProducts", {
    title: "Pokémon en Tiempo Real ⚡",
  });
});

export default router;
