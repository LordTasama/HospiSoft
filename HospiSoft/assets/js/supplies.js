(() => {
  const dataTableOptions = {
    lengthMenu: [5, 10, 15, 50, 100, 250, 500],
    pageLength: 5,
    responsive: {
      details: {
        type: "column",
        target: "tr",
        renderer: function (api, rowIdx, columns) {
          var data = $.map(columns, function (col, i) {
            return (
              '<tr data-dt-row="' +
              col.rowIndex +
              '" data-dt-column="' +
              col.columnIndex +
              '">' +
              '<td class="text-bold">' +
              col.title +
              ":" +
              "</td> " +
              "<td>" +
              col.data +
              "</td>" +
              "</tr>"
            );
          }).join("");

          return $("<table/>").append(data) ? data : false;
        },
      },
    },

    columnDefs: [
      {
        responsivePriority: 1,
        targets: 1,
      },
      {
        responsivePriority: 2,
        targets: 2,
      },
      {
        responsivePriority: 3,
        targets: 0,
      },
    ],
    order: [],
    language: {
      lengthMenu: "Mostrar _MENU_ suministros por página",
      zeroRecords: "Ningún suministro encontrado",
      info: "Mostrando _START_ a _END_ suministros de _TOTAL_ ",
      infoEmpty: "Ningún suministro encontrado",
      emptyTable: "Sin datos para mostrar",
      infoFiltered: "(filtrados desde _MAX_ suministros totales)",
      search: "Buscar:",
      loadingRecords: "Cargando...",
      paginate: {
        first: "<<",
        last: ">>",
        next: ">",
        previous: "<",
      },
    },
  };

  const dataDisplay = document.querySelector("#dataDisplay");
  const putSearch = document.querySelector("#putSearch");
  const deleteSearch = document.querySelector("#deleteSearch");
  async function getData(type) {
    try {
      const response = await fetch("http://localhost:3000/item/list/" + type, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const datos = await response.json();
      return datos;
    } catch (error) {
      console.error("Hubo un error al obtener los datos:", error);
      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }

  async function tableDownload(type) {
    const bodyTable = document.querySelector("#bodyTable");
    try {
      // Esperar a que los datos estén disponibles antes de continuar
      const data = await getData(type);

      const campos = ["id", "descripcion", "existencia", "tipo", "estado"];
      for (i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        let column;
        for (j = 0; j < campos.length; j++) {
          column = document.createElement("td");
          column.textContent = data[i][campos[j]];
          const info = column.textContent;
          if (j == 3) {
            column.textContent = info == 0 ? "Medicamento" : "Elemento";
          } else if (j == 4) {
            column.textContent = info == 1 ? "Activo" : "Inactivo";
          }
          row.append(column);
        }

        bodyTable.appendChild(row);
      }
      return true;
    } catch (error) {
      // Manejar errores
      console.error("Ocurrió un error:", error);
      return false;
    }
  }

  async function loadTable(type) {
    if (await tableDownload(type)) {
      $("#dataTable").DataTable(dataTableOptions);
    }
  }

  loadTable(0);

  async function fillData(search, condition) {
    try {
      const response = await fetch(
        "http://localhost:3000/item/find/" + search,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const datos = await response.json();
      const deleteFullName = document.querySelector("#deleteFullName");
      if (!datos.status) {
        if (condition == 0) {
          document.querySelector("#putId").value = datos.id;
          document.querySelector("#putDescription").value = datos.descripcion;
          document.querySelector("#putStock").value = datos.existencia;
          document.querySelector("#putType").selectedIndex = datos.tipo;
        } else if (condition == 1) {
          deleteFullName.innerHTML =
            "¿Estás seguro que deseas cambiar el estado del suministro '" +
            datos.descripcion +
            "'?";
          document.querySelector("#deleteId").value = datos.id;
        }
      } else {
        deleteFullName.innerHTML = "";
        normalAlert("info", "Ningún dato encontrado", 500, "");
      }
    } catch (error) {
      console.error("Hubo un error al obtener los datos:", error);
      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }

  document.querySelector("#btnSearchPut").addEventListener("click", () => {
    if (putSearch.value) {
      fillData(putSearch.value, 0);
    }
  });

  document.querySelector("#btnSearchDelete").addEventListener("click", () => {
    if (deleteSearch.value) {
      fillData(deleteSearch.value, 1);
    }
  });

  const changeTable = () => {
    document.querySelector("#containerTable").innerHTML = "";
    document.querySelector("#containerTable").innerHTML = ` <table
        class="table table-bordered"
        id="dataTable"
        width="100%"
        cellspacing="0"
      >
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Existencias</th>
            <th>Tipo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody id="bodyTable"></tbody>
      </table>`;

    loadTable(dataDisplay.value);
  };

  dataDisplay.addEventListener("change", () => {
    changeTable();
  });

  const postMethod = document.querySelector("#btnAdd");
  const editMethod = document.querySelector("#btnEdit");
  const deleteMethod = document.querySelector("#btnDelete");

  postMethod.addEventListener("click", () => {
    const description = document.querySelector("#postDescription");
    const stock = document.querySelector("#postStock");
    const type = document.querySelector("#postType");

    if (!description.value || !stock.value) {
      normalAlert("warning", "Verifica si hay campos vacíos", 1500, "");

      return;
    }

    // Validación de descripción
    if (description.length > 0 && description.length <= 50) {
      normalAlert(
        "warning",
        "El campo descripción debe tener mínimo 1 caracter y máximo 50",
        1500,
        ""
      );

      return;
    }

    // Validación de las existencias
    if (stock.value < 0 || !Number.isInteger(Number(stock.value))) {
      normalAlert(
        "warning",
        "El campo existencias debe tener mínimo 0 como valor",
        1500,
        ""
      );
    }

    fetch("http://localhost:3000/item/find/" + description.value, {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.status) {
          if (res.id) {
            normalAlert(
              "error",
              "El nombre del suministro ya existe",
              1500,
              ""
            );
          }
        } else {
          fetch("http://localhost:3000/user/login/status", {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((res) => {
              fetch(
                "http://localhost:3000/user/find/" +
                  res.respuesta.identificacion +
                  "/---",
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  if (res[0].estado == 0) {
                    normalAlert(
                      "error",
                      "No puedes hacer eso ya que su estado actual es inactivo",
                      1500,
                      "./"
                    );

                    localStorage.setItem("token", "");
                  } else if (res[0].id_rol != 0 && res[0].id_rol != 4) {
                    normalAlert(
                      "error",
                      "Necesitas ser dispensario para realizar esta acción",
                      1500,
                      ""
                    );
                  } else {
                    // Envío de la solicitud fetch si todas las validaciones pasaron
                    fetch("http://localhost:3000/item/create/", {
                      method: "POST",
                      headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        descripcion: description.value,
                        existencia: stock.value,
                        tipo: type.value,
                      }),
                    })
                      .then((res) => res.json())
                      .then((res) => {
                        if (res.status == "error") {
                          normalAlert(
                            "error",
                            "La sesión expiró o algo ocurrió... Intenta iniciar sesión de nuevo",
                            1500,
                            "./"
                          );
                        } else {
                          normalAlert(
                            "success",
                            "Suministro agregado correctamente",
                            1500,
                            ""
                          );
                          changeTable();
                        }
                      });
                  }
                });
            });
        }
      });
  });

  editMethod.addEventListener("click", () => {
    const id = document.querySelector("#putId");
    const description = document.querySelector("#putDescription");
    const stock = document.querySelector("#putStock");
    const type = document.querySelector("#putType");

    if (!id.value) {
      normalAlert("warning", "Debe buscar primero un suministro", 1500, "");
      return;
    }
    // Validación del Id
    if (id.value < 0 || !Number.isInteger(Number(id.value))) {
      normalAlert("warning", "Id no válida", 1500, "");
      return;
    }
    if (!description.value || !stock.value) {
      normalAlert("warning", "Verifica si hay campos vacíos", 1500, "");

      return;
    }

    // Validación de descripción
    if (description.length > 0 && description.length <= 50) {
      normalAlert(
        "warning",
        "El campo descripción debe tener mínimo 1 caracter y máximo 50",
        1500,
        ""
      );

      return;
    }

    // Validación de las existencias
    if (stock.value < 0 || !Number.isInteger(Number(stock.value))) {
      normalAlert(
        "warning",
        "El campo existencias debe tener mínimo 0 como valor",
        1500,
        ""
      );
      return;
    }

    fetch("http://localhost:3000/user/login/status", {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        fetch(
          "http://localhost:3000/user/find/" +
            res.respuesta.identificacion +
            "/---",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res[0].estado == 0) {
              normalAlert(
                "error",
                "No puedes hacer eso ya que su estado actual es inactivo",
                1500,
                "./"
              );

              localStorage.setItem("token", "");
            } else if (res[0].id_rol != 0 && res[0].id_rol != 4) {
              normalAlert(
                "error",
                "Necesitas ser dispensario para realizar esta acción",
                1500,
                ""
              );
            } else {
              // Envío de la solicitud fetch si todas las validaciones pasaron
              fetch("http://localhost:3000/item/update/" + id.value, {
                method: "PUT",
                headers: {
                  Authorization: localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  descripcion: description.value,
                  existencia: stock.value,
                  tipo: type.value,
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.status == "error") {
                    normalAlert(
                      "error",
                      "La sesión espiró o algo ocurrió... Intenta iniciar sesión de nuevo",
                      1500,
                      "./"
                    );
                  } else if (res.status == "non-existent") {
                    normalAlert("info", res.message, 1500, "");
                  } else {
                    normalAlert(
                      "success",
                      "Suministro editado correctamente",
                      1500,
                      ""
                    );
                    changeTable();
                  }
                });
            }
          });
      });
  });
  deleteMethod.addEventListener("click", () => {
    fetch("http://localhost:3000/user/login/status", {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        fetch(
          "http://localhost:3000/user/find/" +
            res.respuesta.identificacion +
            "/---",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res[0].estado == 0) {
              normalAlert(
                "error",
                "No puedes hacer eso ya que su estado actual es inactivo",
                1500,
                "./"
              );
              localStorage.setItem("token", "");
            } else if (res[0].id_rol != 0 && res[0].id_rol != 4) {
              normalAlert(
                "error",
                "Necesitas ser dispensario para realizar esta acción",
                1500,
                ""
              );
            } else {
              if (!document.querySelector("#deleteId").value) {
                normalAlert(
                  "warning",
                  "Debe buscar primero un suministro",
                  1500,
                  ""
                );
                return;
              }
              fetch(
                "http://localhost:3000/item/status/" +
                  document.querySelector("#deleteId").value,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  if (res.status == "error") {
                    normalAlert(
                      "error",
                      "La sesión expiró o algo ocurrió... Intenta iniciar sesión de nuevo",
                      1500,
                      "./"
                    );
                  } else if (res.status == "non-existent") {
                    normalAlert("info", res.message, 1500, "");
                  } else {
                    normalAlert(
                      "success",
                      "El estado ha sido cambiado correctamente",
                      1500,
                      ""
                    );
                    changeTable();
                  }
                });
            }
          });
      });
  });
})();
