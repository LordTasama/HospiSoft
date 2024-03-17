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
      lengthMenu: "Mostrar _MENU_ pacientes por página",
      zeroRecords: "Ningún paciente encontrado",
      info: "Mostrando _START_ a _END_ pacientes de _TOTAL_ ",
      infoEmpty: "Ningún paciente encontrado",
      infoFiltered: "(filtrados desde _MAX_ pacientes totales)",
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

  async function fillSelects(selectOne, selectTwo) {
    try {
      const response = await fetch("http://localhost:3000/eps/list/", {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const datos = await response.json();

      datos.forEach((element) => {
        selectOne.innerHTML += `<option value="${element.nit}">${element.entidad}</option> `;
        selectTwo.innerHTML += `<option value="${element.nit}">${element.entidad}</option> `;
      });
    } catch (error) {
      console.error("Hubo un error al obtener los datos:", error);
      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }

  let dataTable = $("#dataTable");
  const bodyTable = document.querySelector("#bodyTable");
  const postEps = document.querySelector("#postEps");
  const putEps = document.querySelector("#putEps");
  const putId = document.querySelector("#putId");
  const deleteId = document.querySelector("#deleteId");
  fillSelects(postEps, putEps);
  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/patient/list/", {
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
        "movil",
        "fecha_nacimiento",
        "nit_eps",
        "entidad",
        "estado",
      ];
      for (i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        let column;
        for (j = 0; j < campos.length; j++) {
          column = document.createElement("td");
          column.textContent = data[i][campos[j]];
          const info = column.textContent;
          if (j == 9) {
            column.textContent = info == 1 ? "Activo" : "Inactivo";
          }
          if (j == 6) {
            column.textContent = info.substring(0, 10);
          }
          if (j != 7) {
            row.appendChild(column);
          }
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
      const response = await fetch("http://localhost:3000/patient/find/" + id, {
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
        if (condition == 0) {
          document.querySelector("#putNames").value = datos[0].nombres;
          document.querySelector("#putLastName").value = datos[0].apellidos;
          document.querySelector("#putEmail").value = datos[0].correo;
          document.querySelector("#putCellphone").value = datos[0].telefono;
          document.querySelector("#putPhone").value = datos[0].movil;
          document.querySelector("#putBirthdate").value =
            datos[0].fecha_nacimiento.substring(0, 10);

          for (let i = 0; i < putEps.options.length; i++) {
            if (putEps.options[i].innerHTML.trim() == datos[0].entidad.trim()) {
              document.querySelector("#putEps").selectedIndex = i;
            }
          }
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
    const cellPhone = document.querySelector("#postCellphone");
    const phone = document.querySelector("#postPhone");
    const birthDate = document.querySelector("#postBirthdate");

    if (
      !id.value ||
      !names.value ||
      !lastname.value ||
      !cellPhone.value ||
      !email.value ||
      !birthDate.value
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

    // Validación del teléfono y móvil
    if (cellPhone.value <= 0 || !Number.isInteger(Number(cellPhone.value))) {
      alert("Teléfono no válido");
      return;
    }

    if (
      phone.value &&
      (phone.value <= 0 || !Number.isInteger(Number(phone.value)))
    ) {
      alert("Móvil no válido");
      return;
    }
    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      alert("El correo electrónico ingresado no es válido.");
      return;
    }

    fetch("http://localhost:3000/patient/find/" + id.value, {
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
                    fetch("http://localhost:3000/patient/create/", {
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
                        telefono: cellPhone.value,
                        movil: phone.value,
                        fecha_nacimiento: birthDate.value,
                        nit_eps: postEps.value,
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
                            "Paciente agregado correctamente",
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
    const cellPhone = document.querySelector("#putCellphone");
    const phone = document.querySelector("#putPhone");
    const birthDate = document.querySelector("#putBirthdate");

    if (
      !id.value ||
      !names.value ||
      !lastname.value ||
      !cellPhone.value ||
      !email.value ||
      !birthDate.value
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
    if (cellPhone.value <= 0 || !Number.isInteger(Number(cellPhone.value))) {
      alert("Teléfono no válido");
      return;
    }

    if (
      phone.value &&
      (phone.value <= 0 || !Number.isInteger(Number(phone.value)))
    ) {
      alert("Móvil no válido");
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
              fetch("http://localhost:3000/patient/update/" + id.value, {
                method: "PUT",
                headers: {
                  Authorization: localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  nombres: names.value,
                  apellidos: lastname.value,
                  correo: email.value,
                  telefono: cellPhone.value,
                  movil: phone.value,
                  fecha_nacimiento: birthDate.value,
                  nit_eps: putEps.value,
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
                      "Paciente editado correctamente",
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
                "http://localhost:3000/patient/status/" +
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
