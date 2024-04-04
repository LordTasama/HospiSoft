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

    layout: {
      topCenter: {
        buttons: [
          {
            extend: "excel",

            className: "btn-excel",
          },
          {
            extend: "print",
            text: '<span">Imprimir</span>',
            className: "btn-print",
          },
        ],
      },
      dom:
        "<'row'<'col-sm-6'B><'col-sm-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'l><'col-sm-7'p>>",
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
      lengthMenu: "Mostrar _MENU_ citas por página",
      zeroRecords: "Ninguna cita encontrada",
      info: "Mostrando _START_ a _END_ citas de _TOTAL_ ",
      infoEmpty: "Ninguna cita encontrada",
      emptyTable: "Sin datos para mostrar",
      infoFiltered: "(filtrados desde _MAX_ citas totales)",
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
  5;

  const putSearchId = document.querySelector("#putSearchId");
  const postSearchDoctor = document.querySelector("#postSearchDoctor");
  const postSearchPatient = document.querySelector("#postSearchPatient");
  const putSearchDoctor = document.querySelector("#putSearchDoctor");
  const putSearchPatient = document.querySelector("#putSearchPatient");

  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/appointment/list/", {
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
        "id",
        "fecha",
        "id_formula",
        "id_medico",
        "nombre_medico",
        "id_paciente",
        "nombre_paciente",
        "estado",
      ];
      for (i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        let column;
        for (j = 0; j < campos.length; j++) {
          column = document.createElement("td");
          column.textContent = data[i][campos[j]];

          const info = column.textContent;
          if (j == 7) {
            column.textContent = info == 1 ? "Activo" : "Inactivo";
          }
          if (j == 1) {
            const date = new Date(data[i][campos[j]]);
            // Obtener el año, mes, día, hora y minutos
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Añadir un cero a la izquierda para meses de un dígito
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0"); // Ajustar la hora a la zona horaria local
            const minutes = String(date.getMinutes()).padStart(2, "0");
            column.textContent = `${year}-${month}-${day} ${hours}:${minutes}`;
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
      table = $("#dataTable").DataTable(dataTableOptions);
    }
  }

  loadTable();

  const changeTable = () => {
    document.querySelector("#containerTable").innerHTML = `  <table
    class="table table-bordered"
    id="dataTable"
    width="100%"
    cellspacing="0"
  >
    <thead>
      <tr>
        <th>Id</th>
        <th>Fecha</th>
        <th>Id fórmula</th>
        <th>Id médico</th>
        <th>Médico</th>
        <th>Id paciente</th>
        <th>Paciente</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody id="bodyTable"></tbody>
  </table>`;

    loadTable();
  };

  async function fillData(search, condition, target) {
    const putIdDoctor = document.querySelector("#putIdDoctor");
    const putNameDoctor = document.querySelector("#putNameDoctor");
    const putDate = document.querySelector("#putDate");
    const putIdPatient = document.querySelector("#putIdPatient");
    const putNamePatient = document.querySelector("#putNamePatient");
    const postIdDoctor = document.querySelector("#postIdDoctor");
    const postNameDoctor = document.querySelector("#postNameDoctor");
    const postIdPatient = document.querySelector("#postIdPatient");
    const postNamePatient = document.querySelector("#postNamePatient");
    try {
      let loadData = 0;
      let response;
      if (search && (condition == 0 || condition == 1) && target == "doctor") {
        response = await fetch(
          "http://localhost:3000/appointment/doctor/find/" + search,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        loadData = condition == 0 ? 1 : 2;
      } else if (
        search &&
        (condition == 0 || condition == 1) &&
        target == "patient"
      ) {
        response = await fetch(
          "http://localhost:3000/appointment/patient/find/" + search,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        loadData = condition == 0 ? 3 : 4;
      } else if (search && condition == 3 && target == "appointment") {
        response = await fetch(
          "http://localhost:3000/appointment/find/" + search,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        loadData = 5;
      }
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const datos = await response.json();
      if (datos.identificacion || datos.length > 0) {
        if (loadData == 1) {
          postIdDoctor.value = datos.identificacion;
          postNameDoctor.value = datos.nombre_medico;
        } else if (loadData == 2) {
          putIdDoctor.value = datos.identificacion;
          putNameDoctor.value = datos.nombre_medico;
        } else if (loadData == 3) {
          postIdPatient.value = datos.identificacion;
          postNamePatient.value = datos.nombre_paciente;
        } else if (loadData == 4) {
          putIdPatient.value = datos.identificacion;
          putNamePatient.value = datos.nombre_paciente;
        } else if (loadData == 5) {
          // Convertir la fecha a un objeto Date
          const date = new Date(datos[0].fecha);
          // Obtener el año, mes, día, hora y minutos
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Añadir un cero a la izquierda para meses de un dígito
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0"); // Ajustar la hora a la zona horaria local
          const minutes = String(date.getMinutes()).padStart(2, "0");
          putDate.value = `${year}-${month}-${day} ${hours}:${minutes}`;
          putIdDoctor.value = datos[0].id_medico;
          putNameDoctor.value = datos[0].nombre_medico;
          putIdPatient.value = datos[0].id_paciente;
          putNamePatient.value = datos[0].nombre_paciente;
        }
      } else {
        normalAlert("info", "Ningún dato encontrado", 500, "");
      }
    } catch (error) {
      console.error("Hubo un error al obtener los datos:", error);
      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }

  document.querySelector("#btnSearchId").addEventListener("click", () => {
    if (putSearchId.value) {
      fillData(putSearchId.value, 3, "appointment");
    }
  });

  document
    .querySelector("#btnSearchPostDoctor")
    .addEventListener("click", () => {
      if (postSearchDoctor.value) {
        fillData(postSearchDoctor.value, 0, "doctor");
      }
    });
  document
    .querySelector("#btnSearchPutDoctor")
    .addEventListener("click", () => {
      if (putSearchDoctor.value) {
        fillData(putSearchDoctor.value, 1, "doctor");
      }
    });
  document
    .querySelector("#btnSearchPostPatient")
    .addEventListener("click", () => {
      if (postSearchPatient.value) {
        fillData(postSearchPatient.value, 0, "patient");
      }
    });
  document
    .querySelector("#btnSearchPutPatient")
    .addEventListener("click", () => {
      if (putSearchPatient.value) {
        fillData(putSearchPatient.value, 1, "patient");
      }
    });

  const postMethod = document.querySelector("#btnAdd");
  const editMethod = document.querySelector("#btnEdit");
  const deleteMethod = document.querySelector("#btnDelete");

  postMethod.addEventListener("click", () => {
    const date = document.querySelector("#postDate");
    const idDoctor = document.querySelector("#postIdDoctor");
    const idPatient = document.querySelector("#postIdPatient");

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
            } else if (!date.value) {
              normalAlert("warning", "Selecciona una fecha", 1500, "");
              return;
            } else if (!postSearchDoctor.value) {
              normalAlert("warning", "Busca un médico", 1500, "");
              return;
            } else if (!postSearchPatient.value) {
              normalAlert("warning", "Busca un paciente", 1500, "");
              return;
            } else {
              // Envío de la solicitud fetch si todas las validaciones pasaron
              fetch("http://localhost:3000/appointment/create/", {
                method: "POST",
                headers: {
                  Authorization: localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  fecha: date.value,
                  id_medico: idDoctor.value,
                  id_paciente: idPatient.value,
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
                      "Cita agendada correctamente",
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

  editMethod.addEventListener("click", () => {
    const date = document.querySelector("#putDate");
    const idDoctor = document.querySelector("#putIdDoctor");
    const idPatient = document.querySelector("#putIdPatient");

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
            } else if (!putSearchId.value) {
              normalAlert(
                "warning",
                "El Id de la cita no puede estar vacío",
                1500,
                ""
              );
              return;
            } else if (!date.value) {
              normalAlert("warning", "Selecciona una fecha", 1500, "");
              return;
            } else if (!idDoctor.value) {
              normalAlert("warning", "Busca un médico", 1500, "");
              return;
            } else if (!idPatient.value) {
              normalAlert("warning", "Busca un paciente", 1500, "");
              return;
            } else {
              // Envío de la solicitud fetch si todas las validaciones pasaron
              fetch(
                "http://localhost:3000/appointment/update/" + putSearchId.value,
                {
                  method: "PUT",
                  headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    fecha: date.value,
                    id_medico: idDoctor.value,
                    id_paciente: idPatient.value,
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
                  } else if (res.status == "non-existent") {
                    normalAlert("info", res.message, 1500, "");
                  } else {
                    normalAlert(
                      "success",
                      "Cita editada correctamente",
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
            } else if (res[0].id_rol != 0 && res[0].id_rol != 1) {
              normalAlert(
                "error",
                "Necesitas ser administrador para realizar esta acción",
                1500,
                ""
              );
            } else {
              if (!document.querySelector("#deleteId").value) {
                normalAlert("warning", "Llena el campo Id", 1500, "");
                return;
              }
              fetch(
                "http://localhost:3000/appointment/status/" +
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
