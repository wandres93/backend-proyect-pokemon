const socket = io(); // Conectar al servidor de sockets

const form = document.getElementById("productForm");
const productsList = document.getElementById("productsList");

// Escuchar el evento 'updateProducts' que envía el servidor
socket.on("updateProducts", (products) => {
  productsList.innerHTML = ""; // Limpiar la lista actual

  products.forEach((prod) => {
    const div = document.createElement("div");
    div.classList.add("col-md-4", "mb-3");
    div.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${prod.title}</h5>
                    <p class="card-text">${prod.description}</p>
                    <p class="fw-bold">Precio: $${prod.price}</p>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${prod.id})">Eliminar</button>
                </div>
            </div>
        `;
    productsList.appendChild(div);
  });
});

// Enviar nuevo producto al servidor
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;

  const newProduct = {
    title,
    description,
    price,
    code,
    stock,
    category,
  };

  socket.emit("addProduct", newProduct); // Enviamos al servidor
  form.reset();
});

// Función para eliminar producto
const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};
