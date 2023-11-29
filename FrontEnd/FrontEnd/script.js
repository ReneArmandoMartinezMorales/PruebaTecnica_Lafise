// Lógica JavaScript para consumir la API y manejar las interacciones del usuario

const apiUrl = "https://localhost:7027";
const categoriaSelect = document.getElementById("categoriaSelect");

// Función para abrir el modal de agregar/editar producto
function openAddModal() {
  // Configura el modal para agregar un nuevo producto
  configureModal("Agregar Producto", {}, "POST");
}

function loadCategorias() {
  fetch(`${apiUrl}/Categoria`)
    .then((response) => response.json())
    .then((categorias) => {
      // Limpiar las opciones actuales
      categoriaSelect.innerHTML = "";

      // Agregar una opción por cada categoría
      categorias.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.id;
        option.textContent = categoria.descripcion;
        categoriaSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar categorías:", error));
}

// Función para cargar productos en la tabla
function loadProducts() {
  const productTableBody = document.getElementById("productTableBody");
  productTableBody.innerHTML = ""; // Limpiar la tabla antes de cargar los nuevos datos

  // Realiza una solicitud GET a la API para obtener la lista de productos
  fetch(`${apiUrl}/Producto`)
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => {
        // Crea una fila en la tabla para cada producto
        const row = `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.marca || "-"}</td>
                        <td>${product.descripcion}</td>
                        <td>${product.estado ? "Activo" : "Inactivo"}</td>
                        <td>
                            <button class="btn btn-primary" onclick="openEditModal(${
                              product.id
                            })">Editar</button>
                            <button class="btn btn-danger" onclick="deleteProduct(${
                              product.id
                            })">Eliminar</button>
                        </td>
                    </tr>
                `;
        productTableBody.innerHTML += row;
      });
    })
    .catch((error) => console.error("Error al obtener productos:", error));
}

// Función para guardar un nuevo producto o actualizar uno existente
function saveProduct() {
  const modalTitle = document.getElementById("productModalLabel");
  const categoriaId = categoriaSelect.value; // Obtén el ID de la categoría seleccionada

  const productData = {
    id: productIdInput.value,
    marca: marcaInput.value,
    descripcion: descripcionInput.value,
    estado: estadoInput.checked,
    idCategoria: categoriaId, // Incluye la categoría seleccionada en los datos del producto
  };

  if (productData.id == "") delete productData.id;

  const method = modalTitle.textContent.includes("Agregar") ? "POST" : "PUT";
  const productId = modalTitle.textContent.includes("Editar")
    ? productIdInput.value
    : "";

  // Realiza una solicitud POST o PUT a la API para guardar el producto
  fetch(`${apiUrl}/Producto${productId ? `/${productId}` : ""}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
    .then((response) => response.json())
    .then((savedProduct) => {
      console.log("Producto guardado exitosamente:", savedProduct);
      $("#productModal").modal("hide");
      loadProducts();
    })
    .catch((error) => console.error("Error al guardar el producto:", error));
}

// Función para abrir el modal de editar producto
function openEditModal(productId) {
  // Realiza una solicitud GET a la API para obtener los datos del producto a editar
  fetch(`${apiUrl}/Producto${productId ? `/${productId}` : ""}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error al obtener datos del producto. Código: ${response.status}`
        );
      }
      return response.json();
    })
    .then((data) => {
      // Si la respuesta es una lista, toma el primer elemento
      const product = Array.isArray(data) ? data[0] : data;

      // Configura el modal para editar el producto
      configureModal("Editar Producto", product, "PUT");
    })
    .catch((error) =>
      console.error("Error al obtener datos del producto:", error)
    );
}
// Función para eliminar un producto
function deleteProduct(productId) {
  // Confirmar la eliminación con el usuario
  const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este producto?');

  if (confirmDelete) {
      // Realizar la solicitud DELETE solo si el usuario confirma
      fetch(`${apiUrl}/Producto/${productId}`, {
          method: 'DELETE'
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Error al eliminar el producto. Código: ${response.status}`);
              }
              console.log('Producto eliminado exitosamente.');
              loadProducts(); // Volver a cargar la lista después de la eliminación
          })
          .catch(error => console.error('Error al eliminar el producto:', error));
  }
}

// Función para configurar el modal antes de abrirlo
function configureModal(title, product, method) {
  const modalTitle = document.getElementById("productModalLabel");
  const marcaInput = document.getElementById("marcaInput");
  const productIdInput = document.getElementById("productIdInput");
  const descripcionInput = document.getElementById("descripcionInput");
  const estadoInput = document.getElementById("estadoInput");
  const saveProductButton = document.getElementById("saveProductButton");

  // Se asume que el elemento con el ID 'productIdInput' no es necesario

  modalTitle.textContent = title;

  productIdInput.value = product.id || null;

  // Solo establece valores si los elementos existen
  if (marcaInput) {
    marcaInput.value = product.marca || "";
  }

  if (descripcionInput) {
    descripcionInput.value = product.descripcion || "";
  }

  if (estadoInput) {
    estadoInput.checked = product.estado || false;
  }

  // Cargar las categorías al abrir el modal
  loadCategorias();

  saveProductButton.onclick = saveProduct;

  $("#productModal").modal("show");
}

// Llama a loadProducts al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
});
