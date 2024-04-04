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
      lengthMenu: "Mostrar _MENU_ usuarios por página",
      zeroRecords: "Ningún usuario encontrado",
      info: "Mostrando _START_ a _END_ usuarios de _TOTAL_ ",
      infoEmpty: "Ningún usuario encontrado",
      emptyTable: "Sin datos para mostrar",
      infoFiltered: "(filtrados desde _MAX_ usuarios totales)",
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

  const putId = document.querySelector("#putId");
  const deleteId = document.querySelector("#deleteId");
  let rolOriginal;
  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/user/list/", {
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
      const bodyTable = document.querySelector("#bodyTable");
      const campos = [
        "identificacion",
        "nombres",
        "apellidos",
        "username",
        "correo",
        "id_rol",
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
                ? "Owner"
                : info == 1
                ? "Administrador"
                : info == 2
                ? "Médico"
                : info == 3
                ? "Secretaria"
                : "Dispensario";
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
        <th>Identificación</th>
        <th>Nombres</th>
        <th>Apellidos</th>
        <th>Usuario</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody id="bodyTable"></tbody>
  </table>`;

    loadTable();
  };

  async function fillData(id, condition) {
    try {
      const response = await fetch(
        "http://localhost:3000/user/find/" + id + "/---",
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
      if (datos.length > 0) {
        rolOriginal = datos[0].id_rol;
        if (condition == 0) {
          document.querySelector("#putNames").value = datos[0].nombres;
          document.querySelector("#putLastName").value = datos[0].apellidos;
          document.querySelector("#putUsername").value = datos[0].username;
          document.querySelector("#putEmail").value = datos[0].correo;
          document.querySelector("#putRol").selectedIndex = datos[0].id_rol - 1;
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
    const username = document.querySelector("#postUsername");
    const email = document.querySelector("#postEmail");
    const password = document.querySelector("#postPassword");
    const rol = document.querySelector("#postRol");

    if (
      !id.value ||
      !names.value ||
      !lastname.value ||
      !username.value ||
      !email.value ||
      !password.value
    ) {
      normalAlert("warning", "Verifica si hay campos vacíos.", 1500, "");
      return;
    }

    // Validación del ID
    if (id.value <= 0 || !Number.isInteger(Number(id.value))) {
      normalAlert("warning", "Identificación no válida.", 1500, "");
      return;
    }

    // Validación de nombres y apellidos
    const nameRegex =
      /^[a-zA-ZáéíóúÁÉÍÓÚüÜ]{1,20}(?:[ ][a-zA-ZáéíóúÁÉÍÓÚüÜ]{1,20})?$/;
    if (!nameRegex.test(names.value) || !nameRegex.test(lastname.value)) {
      normalAlert(
        "warning",
        "Los nombres y apellidos solo pueden contener letras, mínimo 2 y máximo 20 caracteres.",
        1500,
        ""
      );
      return;
    }

    // Validación de nombre de usuario
    const usernameRegex = /^[a-zA-Z]+$/;
    if (!usernameRegex.test(username.value)) {
      normalAlert(
        "warning",
        "El nombre de usuario solo puede contener letras y no debe contener espacios.",
        1500,
        ""
      );
      return;
    }

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      normalAlert(
        "warning",
        "El correo electrónico ingresado no es válido.",
        1500,
        ""
      );
      return;
    }

    // Validación de contraseña
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password.value)) {
      normalAlert(
        "warning",
        "La contraseña debe tener al menos 8 caracteres e incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.",
        2500,
        ""
      );
      return;
    }

    fetch("http://localhost:3000/user/find/" + id.value + "/---", {
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
          fetch("http://localhost:3000/user/find/---/" + email.value, {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.length > 0) {
                if (res[0].identificacion) {
                  normalAlert("error", "Correo ya existe", 1500, "");
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
                        } else if (rol.value == 1 && res[0].id_rol == 1) {
                          normalAlert(
                            "error",
                            "Solo el 'Owner' puede asignar administradores",
                            1500,
                            ""
                          );
                        } else if (res[0].id_rol != 0 && res[0].id_rol != 1) {
                          normalAlert(
                            "error",
                            "Necesitas ser administrador para realizar esta acción",
                            1500,
                            ""
                          );
                        } else {
                          // Envío de la solicitud fetch si todas las validaciones pasaron
                          fetch("http://localhost:3000/user/create/", {
                            method: "POST",
                            headers: {
                              Authorization: localStorage.getItem("token"),
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              identificacion: id.value,
                              nombres: names.value,
                              apellidos: lastname.value,
                              username: username.value,
                              correo: email.value,
                              password: password.value,
                              id_rol: rol.value,
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
                                  "Usuario agregado correctamente",
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
        }
      });
  });

  editMethod.addEventListener("click", () => {
    const id = document.querySelector("#putId");
    const names = document.querySelector("#putNames");
    const lastname = document.querySelector("#putLastName");
    const username = document.querySelector("#putUsername");
    const email = document.querySelector("#putEmail");
    const password = document.querySelector("#putPassword");
    const rol = document.querySelector("#putRol");

    if (
      !id.value ||
      !names.value ||
      !lastname.value ||
      !username.value ||
      !email.value
    ) {
      normalAlert(
        "warning",
        "Verifica si hay campos vacíos (excepto contraseña).",
        1500,
        ""
      );
      return;
    }

    // Validación del ID
    if (id.value <= 0 || !Number.isInteger(Number(id.value))) {
      normalAlert("warning", "Identificación no válida.", 1500, "");
      return;
    }

    // Validación de nombres y apellidos
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]{2,20}$/;
    if (!nameRegex.test(names.value) || !nameRegex.test(lastname.value)) {
      normalAlert(
        "warning",
        "Los nombres y apellidos solo pueden contener letras, mínimo 2 y máximo 20 caracteres.",
        1500,
        ""
      );
      return;
    }

    // Validación de nombre de usuario
    const usernameRegex = /^[a-zA-Z]+$/;
    if (!usernameRegex.test(username.value)) {
      normalAlert(
        "warning",
        "El nombre de usuario solo puede contener letras y no debe contener espacios.",
        1500,
        ""
      );
      return;
    }

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      normalAlert(
        "warning",
        "El correo electrónico ingresado no es válido.",
        1500,
        ""
      );
      return;
    }

    // Validación de contraseña
    if (password.value) {
      console.log(password.value);
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(password.value)) {
        normalAlert(
          "warning",
          "La contraseña debe tener al menos 8 caracteres e incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.",
          2500,
          ""
        );
        return;
      }
    }

    fetch("http://localhost:3000/user/find/" + id.value + "/" + email.value, {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          if (res[0].identificacion) {
            normalAlert("error", "Correo ya existe", 1500, "");
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
                  } else if (
                    rolOriginal == 1 &&
                    res[0].id_rol > 0 &&
                    id.value != res[0].identificacion
                  ) {
                    normalAlert(
                      "error",
                      "No puedes modificar a otro administrador",
                      1500,
                      ""
                    );
                  } else if (
                    rol.value == 1 &&
                    res[0].id_rol > 0 &&
                    id.value != res[0].identificacion
                  ) {
                    normalAlert(
                      "error",
                      "Solo el 'Owner' puede asignar administradores",
                      1500,
                      ""
                    );
                  } else if (res[0].id_rol != 0 && res[0].id_rol != 1) {
                    normalAlert(
                      "error",
                      "Necesitas ser administrador para realizar esta acción",
                      1500,
                      ""
                    );
                  } else {
                    if (
                      rolOriginal == 1 &&
                      rol.value != 1 &&
                      res[0].id_rol > 0
                    ) {
                      Swal.fire({
                        customClass: {
                          confirmButton: "btn btn-success",
                          cancelButton: "btn btn-danger mr-3",
                        },
                        buttonsStyling: false,
                        title:
                          "¿Seguro que deseas cambiar el rol de Administrador?",
                        text: "Esta acción te quitará acceso a funciones importanes",
                        icon: "warning",
                        cancelButtonText: "Cancelar",
                        confirmButtonText: "Confirmar",
                        showCancelButton: true,
                        showCloseButton: true,
                        reverseButtons: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // Envío de la solicitud fetch si todas las validaciones pasaron
                          fetch(
                            "http://localhost:3000/user/update/" + id.value,
                            {
                              method: "PUT",
                              headers: {
                                Authorization: localStorage.getItem("token"),
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                nombres: names.value,
                                apellidos: lastname.value,
                                username: username.value,
                                correo: email.value,
                                password: password.value,
                                id_rol: rol.value,
                              }),
                            }
                          )
                            .then((res) => res.json())
                            .then((res) => {
                              if (res.status == "error") {
                                normalAlert(
                                  "error",
                                  "La sesión espiró o algo ocurrió... Intenta iniciar sesión de nuevo",
                                  1500,
                                  "./"
                                );
                              } else {
                                normalAlert(
                                  "success",
                                  "Usuario editado correctamente",
                                  1500,
                                  ""
                                );
                                changeTable();
                              }
                            });
                        }
                      });
                    } else {
                      // Envío de la solicitud fetch si todas las validaciones pasaron
                      fetch("http://localhost:3000/user/update/" + id.value, {
                        method: "PUT",
                        headers: {
                          Authorization: localStorage.getItem("token"),
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          nombres: names.value,
                          apellidos: lastname.value,
                          username: username.value,
                          correo: email.value,
                          password: password.value,
                          id_rol: rol.value,
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
                              "Usuario editado correctamente",
                              1500,
                              ""
                            );
                            changeTable();
                          }
                        });
                    }
                  }
                });
            });
        }
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
        if (
          res.respuesta.identificacion ==
          document.querySelector("#deleteId").value
        ) {
          normalAlert("error", "No puedes cambiar tu propio estado", 1500, "");
        } else {
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
              } else if (rolOriginal == "Administrador") {
                normalAlert(
                  "error",
                  "No puedes cambiar el estado de otro Administrador",
                  1500,
                  ""
                );
              } else if (res[0].id_rol != 0 && res[0].id_rol != 1) {
                normalAlert(
                  "error",
                  "Necesitas ser administrador para realizar esta acción",
                  1500,
                  ""
                );
              } else {
                if (!document.querySelector("#deleteId").value) {
                  normalAlert(
                    "warning",
                    "Llena el campo identificación",
                    1500,
                    ""
                  );
                  return;
                }
                fetch(
                  "http://localhost:3000/user/status/" +
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
        }
      });
  });
})();
