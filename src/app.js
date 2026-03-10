import express from "express";
import { Server } from "socket.io"; // Se importo Socket.io
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"; // Se importo el router de vistas
import ProductManager from "./managers/ProductManager.js";

// Inicismos Express
const app = express();
const PORT = 8080;

// Se confuguran los Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public")); // Carpeta pública para JS y CSS

// Referencia al ProductManager
const productManager = new ProductManager("./src/data/products.json");

// Rutas de API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de Vistas (Handlebars)
app.use("/", viewsRouter);

// Iniciar el servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Configuración del lado del servidor de Socket.io
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // 1. Enviar la lista de productos al conectarse
  productManager.getProducts().then((products) => {
    socket.emit("updateProducts", products);
  });

  // 2. Escuchar cuando el cliente agrega un producto
  socket.on("addProduct", async (newProductData) => {
    await productManager.addProduct(newProductData);
    // Actualizamos la lista a TODOS los clientes
    const updatedList = await productManager.getProducts();
    io.emit("updateProducts", updatedList);
  });

  // 3. Escuchar cuando el cliente elimina un producto
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    // Actualizamos la lista a TODOS los clientes
    const updatedList = await productManager.getProducts();
    io.emit("updateProducts", updatedList);
  });
});
