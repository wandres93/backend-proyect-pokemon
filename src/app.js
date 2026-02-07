import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// Crear carpeta data si no existe (opcional pero recomendado)
import fs from "fs";
if (!fs.existsSync("./src/data")) {
  fs.mkdirSync("./src/data", { recursive: true });
}

const app = express();
const PORT = 8080;

// Middleware para entender JSON y datos por URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
