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
      lengthMenu: "Mostrar _MENU_ médicos por página",
      zeroRecords: "Ningún médico encontrado",
      info: "Mostrando _START_ a _END_ médicos de _TOTAL_ ",
      infoEmpty: "Ningún médico encontrado",
      infoFiltered: "(filtrados desde _MAX_ médicos totales)",
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
  let dataTable = $("#dataTable");
  const bodyTable = document.querySelector("#bodyTable");
  const putId = document.querySelector("#putId");
  const deleteId = document.querySelector("#deleteId");
  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/doctor/list/", {
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

  async function tableDownload() {
    try {
      // Esperar a que los datos estén disponibles antes de continuar
      const data = await getData();
      bodyTable.innerHTML = "";
      const campos = [
        "identificacion",
        "nombres",
        "apellidos",
        "correo",
        "telefono",
        "id_especialidad",
        "estado",
      ];
      for (i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        let column;
        for (j = 0; j < campos.length; j++) {
          column = document.createElement("td");
          column.textContent = data[i][campos[j]];
          const info = column.textContent;
          if (j == 5) {
            column.textContent =
              info == 0
                ? "Cardiología"
                : info == 1
                ? "Dermatología"
                : info == 2
                ? "Endrocrinología"
                : info == 3
                ? "Gastroenterología"
                : info == 4
                ? "Hematología"
                : info == 5
                ? "Neurología"
                : info == 6
                ? "Oncología"
                : info == 7
                ? "Oftalmología"
                : info == 8
                ? "Ortopedia"
                : info == 9
                ? "Otorrinolaringología"
                : info == 10
                ? "Pediatría"
                : info == 11
                ? "Psiquiatría"
                : info == 12
                ? "Neumología"
                : info == 13
                ? "Radiología"
                : "Urología";
          }
          if (j == 6) {
            column.textContent = info == 1 ? "Activo" : "Inactivo";
          }
          row.appendChild(column);
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

  async function loadTable() {
    if (await tableDownload()) {
      dataTable = $("#dataTable").DataTable(dataTableOptions);
    }
  }

  loadTable();

  async function fillData(id, condition) {
    try {
      const response = await fetch("http://localhost:3000/doctor/find/" + id, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const datos = await response.json();
      const deleteFullName = document.querySelector("#deleteFullName");
      if (datos.length > 0) {
        rolOriginal = datos[0].id_rol;
        if (condition == 0) {
          document.querySelector("#putNames").value = datos[0].nombres;
          document.querySelector("#putLastName").value = datos[0].apellidos;
          document.querySelector("#putEmail").value = datos[0].correo;
          document.querySelector("#putPhone").value = datos[0].telefono;
          document.querySelector("#putSpecialty").selectedIndex =
            datos[0].id_especialidad;
        } else if (condition == 1) {
          deleteFullName.innerHTML =
            "¿Estás seguro que deseas cambiar el estado de " +
            datos[0].nombres +
            " " +
            datos[0].apellidos +
            "?";
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
    if (putId.value) {
      fillData(putId.value, 0);
    }
  });

  document.querySelector("#btnSearchDelete").addEventListener("click", () => {
    if (deleteId.value) {
      fillData(deleteId.value, 1);
    }
  });

  const postMethod = document.querySelector("#btnAdd");
  const editMethod = document.querySelector("#btnEdit");
  const deleteMethod = document.querySelector("#btnDelete");

  postMethod.addEventListener("click", () => {
    const id = document.querySelector("#postId");
    const names = document.querySelector("#postNames");
    const lastname = document.querySelector("#postLastName");
    const email = document.querySelector("#postEmail");
    const phone = document.querySelector("#postPhone");
    const specialty = document.querySelector("#postSpecialty");

    if (
      !id.value ||
      !names.value ||
      !lastname.value ||
      !phone.value ||
      !email.value
    ) {
      alert("Verifica si hay campos vacíos");
      return;
    }

    // Validación del ID
    if (id.value <= 0 || !Number.isInteger(Number(id.value))) {
      alert("Identificación no válida");
      return;
    }

    // Validación de nombres y apellidos
    const nameRegex =
      /^[a-zA-ZáéíóúÁÉÍÓÚüÜ]{1,20}(?:[ ][a-zA-ZáéíóúÁÉÍÓÚüÜ]{1,20})?$/;
    if (!nameRegex.test(names.value) || !nameRegex.test(lastname.value)) {
      alert(
        "Los nombres y apellidos solo pueden contener letras, mínimo 2 y máximo 20 caracteres."
      );
      return;
    }

    // Validación del teléfono
    if (phone.value <= 0 || !Number.isInteger(Number(phone.value))) {
      alert("Teléfono no válido");
      return;
    }

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      alert("El correo electrónico ingresado no es válido.");
      return;
    }

    fetch("http://localhost:3000/doctor/find/" + id.value, {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          if (res[0].identificacion) {
            normalAlert("error", "Identificación ya existe", 1500, "");
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
                  } else if (res[0].id_rol != 0 && res[0].id_rol != 1) {
                    normalAlert(
                      "error",
                      "Necesitas ser administrador para realizar esta acción",
                      1500,
                      ""
                    );
                  } else {
                    // Envío de la solicitud fetch si todas las validaciones pasaron
                    fetch("http://localhost:3000/doctor/create/", {
                      method: "POST",
                      headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        identificacion: id.value,
                        nombres: names.value,
                        apellidos: lastname.value,
                        correo: email.value,
                        telefono: phone.value,
                        id_especialidad: specialty.value,
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
                            "Doctor agregado correctamente",
                            1500,
                            "reload"
                          );
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
    const names = document.querySelector("#putNames");
    const lastname = document.querySelector("#putLastName");
    const email = document.querySelector("#putEmail");
    const phone = document.querySelector("#putPhone");
    const specialty = document.querySelector("#putSpecialty");

    if (
      !id.value ||
      !names.value ||
      !lastname.value ||
      !phone.value ||
      !email.value
    ) {
      alert("Verifica si hay campos vacíos");
      return;
    }

    // Validación del ID
    if (id.value <= 0 || !Number.isInteger(Number(id.value))) {
      alert("Identificación no válida");
      return;
    }

    // Validación de nombres y apellidos
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]{2,20}$/;
    if (!nameRegex.test(names.value) || !nameRegex.test(lastname.value)) {
      alert(
        "Los nombres y apellidos solo pueden contener letras, mínimo 2 y máximo 20 caracteres."
      );
      return;
    }

    // Validación del teléfono y móvil
    if (phone.value <= 0 || !Number.isInteger(Number(phone.value))) {
      alert("Teléfono no válido");
      return;
    }

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      alert("El correo electrónico ingresado no es válido.");
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
            } else if (res[0].id_rol != 0 && res[0].id_rol != 1) {
              normalAlert(
                "error",
                "Necesitas ser administrador para realizar esta acción",
                1500,
                ""
              );
            } else {
              // Envío de la solicitud fetch si todas las validaciones pasaron
              fetch("http://localhost:3000/doctor/update/" + id.value, {
                method: "PUT",
                headers: {
                  Authorization: localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  nombres: names.value,
                  apellidos: lastname.value,
                  correo: email.value,
                  telefono: phone.value,
                  id_especialidad: specialty.value,
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
                      "Doctor editado correctamente",
                      1500,
                      "reload"
                    );
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
            } else if (res[0].id_rol != 0 && res[0].id_rol != 1) {
              normalAlert(
                "error",
                "Necesitas ser administrador para realizar esta acción",
                1500,
                ""
              );
            } else {
              fetch(
                "http://localhost:3000/doctor/status/" +
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
                      "reload"
                    );
                  }
                });
            }
          });
      });
  });
})();
