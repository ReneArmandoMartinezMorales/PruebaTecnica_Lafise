const apiUrl = "https://localhost:7027"; // Reemplaza con la URL de tu API

document.addEventListener("DOMContentLoaded", () => {
  loadCategorias();
});

function loadCategorias() {
  IdInput.value = "";
  fetch(`${apiUrl}/Categoria`)
    .then((response) => response.json())
    .then((categorias) => {
      const categoriaTableBody = document.getElementById("categoriaTableBody");
      categoriaTableBody.innerHTML = ""; // Limpiar el contenido actual

      categorias.forEach((categoria) => {
        const row = `<tr>
                                <td>${categoria.id}</td>
                                <td>${categoria.descripcion}</td>
                                <td>${
                                  categoria.estado ? "Activo" : "Inactivo"
                                }</td>
                                <td>
                                    <button class="btn btn-warning btn-sm" onclick="openEditCategoriaModal(${
                                      categoria.id
                                    })">Editar</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteCategoria(${
                                      categoria.id
                                    })">Eliminar</button>
                                </td>
                             </tr>`;
        categoriaTableBody.innerHTML += row;
      });
    })
    .catch((error) => console.error("Error al cargar categorías:", error));
}

function openAddCategoriaModal() {
  document.getElementById("categoriaModalLabel").textContent =
    "Agregar Categoría";
  document.getElementById("categoriaForm").reset();
  $("#categoriaModal").modal("show");
}

function openEditCategoriaModal(categoriaId) {
  getCategoriaById(categoriaId)
    .then((categorias) => {
      const categoria = Array.isArray(categorias) ? categorias[0] : categorias;
      if (categoria) {
        IdInput.value = categoriaId;
        document.getElementById("categoriaModalLabel").textContent =
          "Editar Categoría";
        document.getElementById("descripcionInput").value =
          categoria.descripcion;
        document.getElementById("estadoInput").checked = categoria.estado;
        $("#categoriaModal").modal("show");
      } else {
        console.error(
          "Error: No se encontró la categoría con el ID proporcionado."
        );
      }
    })
    .catch((error) =>
      console.error("Error al obtener datos de categoría:", error)
    );
}

function getCategoriaById(categoriaId) {
  return fetch(`${apiUrl}/Categoria/${categoriaId}`).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Error al obtener datos de categoría. Código: ${response.status}`
      );
    }
    return response.json();
  });
}

function saveCategoria() {
  const descripcionInput = document.getElementById("descripcionInput").value;
  const estadoInput = document.getElementById("estadoInput").checked;
  const categoriaId = IdInput.value;

  const categoriaData = {
    id: categoriaId,
    descripcion: descripcionInput,
    estado: estadoInput,
  };
  if (categoriaId == "") {
    delete categoriaData.id;
  }

  // Determinar si estamos agregando o editando
  const isEditing =
    document.getElementById("categoriaModalLabel").textContent ===
    "Editar Categoría";
  const method = isEditing ? "PUT" : "POST";
  const url = isEditing
    ? `${apiUrl}/Categoria/${categoriaId}`
    : `${apiUrl}/Categoria`;

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoriaData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error al guardar la categoría. Código: ${response.status}`
        );
      }
      $("#categoriaModal").modal("hide");
      loadCategorias(); // Volver a cargar la lista después de agregar/editar
    })
    .catch((error) => console.error("Error al guardar la categoría:", error));
}

function deleteCategoria(categoriaId) {
  const confirmDelete = window.confirm(
    "¿Estás seguro de que quieres eliminar esta categoría?"
  );

  if (confirmDelete) {
    fetch(`${apiUrl}/Categoria/${categoriaId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al eliminar la categoría. Código: ${response.status}`
          );
        }
        console.log("Categoría eliminada exitosamente.");
        loadCategorias(); // Volver a cargar la lista después de la eliminación
      })
      .catch((error) =>
        console.error("Error al eliminar la categoría:", error)
      );
  }
}
