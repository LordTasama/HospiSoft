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

  const deleteId = document.querySelector("#deleteId");

  async function getData() {
    try {
      const response = await fetch("http://localhost:3000/history/list", {
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
      const campos = ["id", "patient_name", "date", "condition"];

      for (i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        let column;
        for (j = 0; j < campos.length; j++) {
          column = document.createElement("td");
          column.textContent = data[i][campos[j]];
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
      $("#dataTable").DataTable(dataTableOptions);
    }
  }

  loadTable();

  const changeTable = () => {
    document.querySelector("#containerTable").innerHTML = "";
    document.querySelector("#containerTable").innerHTML = `<table
        class="table table-bordered"
        id="dataTable"
        width="100%"
        cellspacing="0"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Paciente</th>
            <th>Fecha</th>
            <th>Condición</th>
          </tr>
        </thead>
        <tbody id="bodyTable"></tbody>
      </table>`;

    loadTable();
  };

  async function fillData(id) {
    try {
      const response = await fetch(
        "http://localhost:3000/history/find/id" + id,
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
      const data = await response.json();
      const deleteFullName = document.querySelector("#deleteFullName");
      if (data) {
        deleteFullName.innerHTML = `¿Estás seguro que deseas cambiar el estado de ${data.patient_name}?`;
      } else {
        deleteFullName.innerHTML = "";
        normalAlert("info", "Ningún dato encontrado", 500, "");
      }
    } catch (error) {
      console.error("Hubo un error al obtener los datos:", error);
      throw error; // Propagar el error para manejarlo en un nivel superior si es necesario
    }
  }
})();

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
  const patientId = document.querySelector("#postPatientId");
  const doctorId = document.querySelector("#postDoctorId");
  const creationDate = document.querySelector("#postCreationDate");
  const reason = document.querySelector("#postReason");
  const prevIllnesses = document.querySelector("#postPrevIllnesses");
  const allergies = document.querySelector("#postAllergies");
  const prevMedications = document.querySelector("#postPrevMedications");
  const physicalExam = document.querySelector("#postPhysicalExam");
  const diagnosis = document.querySelector("#postDiagnosis");
  const treatment = document.querySelector("#postTreatment");
  const observations = document.querySelector("#postObservations");

  if (
    !id.value ||
    !patientId.value ||
    !doctorId.value ||
    !creationDate.value ||
    !reason.value ||
    !prevIllnesses.value ||
    !allergies.value ||
    !prevMedications.value ||
    !physicalExam.value ||
    !diagnosis.value ||
    !treatment.value ||
    !observations.value
  ) {
    normalAlert("warning", "Verifica si hay campos vacíos.", 1500, "");
    return;
  }

  // Validación del ID
  if (id.value <= 0 || !Number.isInteger(Number(id.value))) {
    normalAlert("warning", "Identificación no válida.", 1500, "");
    return;
  }

  fetch("http://localhost:3000/history/find/" + id.value, {
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.length > 0) {
        if (res[0].id) {
          normalAlert("error", "La historia clínica ya existe", 1500, "");
        }
      } else {
        // Envío de la solicitud fetch si todas las validaciones pasaron
        fetch("http://localhost:3000/history/create/", {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id.value,
            patientId: patientId.value,
            doctorId: doctorId.value,
            creationDate: creationDate.value,
            reason: reason.value,
            prevIllnesses: prevIllnesses.value,
            allergies: allergies.value,
            prevMedications: prevMedications.value,
            physicalExam: physicalExam.value,
            diagnosis: diagnosis.value,
            treatment: treatment.value,
            observations: observations.value,
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
                "Historia clínica agregada correctamente",
                1500,
                ""
              );
              changeTable();
            }
          });
      }
    });
});

editMethod.addEventListener("click", () => {
  const id = document.querySelector("#putId");
  const patientId = document.querySelector("#putPatientId");
  const doctorId = document.querySelector("#putDoctorId");
  const creationDate = document.querySelector("#putCreationDate");
  const reason = document.querySelector("#putReason");
  const prevIllnesses = document.querySelector("#putPrevIllnesses");
  const allergies = document.querySelector("#putAllergies");
  const prevMedications = document.querySelector("#putPrevMedications");
  const physicalExam = document.querySelector("#putPhysicalExam");
  const diagnosis = document.querySelector("#putDiagnosis");
  const treatment = document.querySelector("#putTreatment");
  const observations = document.querySelector("#putObservations");

  if (
    !id.value ||
    !patientId.value ||
    !doctorId.value ||
    !creationDate.value ||
    !reason.value ||
    !prevIllnesses.value ||
    !allergies.value ||
    !prevMedications.value ||
    !physicalExam.value ||
    !diagnosis.value ||
    !treatment.value ||
    !observations.value
  ) {
    normalAlert("warning", "Verifica si hay campos vacíos.", 1500, "");
    return;
  }

  // Validación del ID
  if (id.value <= 0 || !Number.isInteger(Number(id.value))) {
    normalAlert("warning", "Identificación no válida.", 1500, "");
    return;
  }

  fetch("http://localhost:3000/history/find/" + id.value, {
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.length > 0) {
        // Envío de la solicitud fetch si todas las validaciones pasaron
        fetch("http://localhost:3000/history/update/" + id.value, {
          method: "PUT",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: patientId.value,
            doctorId: doctorId.value,
            creationDate: creationDate.value,
            reason: reason.value,
            prevIllnesses: prevIllnesses.value,
            allergies: allergies.value,
            prevMedications: prevMedications.value,
            physicalExam: physicalExam.value,
            diagnosis: diagnosis.value,
            treatment: treatment.value,
            observations: observations.value,
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
            } else if (res.status == "non-existent") {
              normalAlert("info", res.message, 1500, "");
            } else {
              normalAlert(
                "success",
                "Historia clínica editada correctamente",
                1500,
                ""
              );
              changeTable();
            }
          });
      } else {
        normalAlert("info", "Ninguna historia clínica encontrada", 1500, "");
      }
    });
});

deleteMethod.addEventListener("click", () => {
  const id = document.querySelector("#deleteId");

  if (!id.value) {
    normalAlert("warning", "Llena el campo identificación", 1500, "");
    return;
  }

  fetch("http://localhost:3000/history/delete/" + id.value, {
    method: "DELETE",
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
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
      } else if (res.status == "non-existent") {
        normalAlert("info", res.message, 1500, "");
      } else {
        normalAlert(
          "success",
          "La historia clínica ha sido eliminada correctamente",
          1500,
          ""
        );
        changeTable();
      }
    });
});

editMethod.addEventListener("click", () => {
  const id = document.querySelector("#putId");
  const pacienteId = document.querySelector("#putPacienteId");
  const medicoId = document.querySelector("#putMedicoId");
  const fecha = document.querySelector("#putFecha");
  const motivoConsulta = document.querySelector("#putMotivoConsulta");
  const enfermedadesPrevias = document.querySelector("#putEnfermedadesPrevias");
  const alergias = document.querySelector("#putAlergias");
  const medicamentosPrevios = document.querySelector("#putMedicamentosPrevios");
  const examenFisico = document.querySelector("#putExamenFisico");
  const diagnostico = document.querySelector("#putDiagnostico");
  const tratamiento = document.querySelector("#putTratamiento");
  const observaciones = document.querySelector("#putObservaciones");
  const estado = document.querySelector("#putEstado");

  // Validación de campos vacíos
  if (
    !id.value ||
    !pacienteId.value ||
    !medicoId.value ||
    !fecha.value ||
    !motivoConsulta.value ||
    !enfermedadesPrevias.value ||
    !alergias.value ||
    !medicamentosPrevios.value ||
    !examenFisico.value ||
    !diagnostico.value ||
    !tratamiento.value ||
    !observaciones.value ||
    !estado.value
  ) {
    normalAlert("warning", "Verifica si hay campos vacíos.", 1500, "");
    return;
  }

  // Validación de ID
  if (id.value <= 0 || !Number.isInteger(Number(id.value))) {
    normalAlert("warning", "ID no válido.", 1500, "");
    return;
  }

  // Validación de fecha (puedes agregar tu propia validación aquí)

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
            fetch("http://localhost:3000/history/update/" + id.value, {
              method: "PUT",
              headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_paciente: pacienteId.value,
                id_medico: medicoId.value,
                fecha_creacion: fecha.value,
                motivo_consulta: motivoConsulta.value,
                enfermedades_previas: enfermedadesPrevias.value,
                alergias: alergias.value,
                medicamentos_previos: medicamentosPrevios.value,
                examen_fisico: examenFisico.value,
                diagnostico: diagnostico.value,
                tratamiento: tratamiento.value,
                observaciones: observaciones.value,
                estado: estado.value,
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
                    "Historia clínica editada correctamente",
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
              normalAlert("warning", "Llena el campo identificación", 1500, "");
              return;
            }
            fetch(
              "http://localhost:3000/history/delete/" +
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
                    "La historia clínica ha sido eliminada correctamente",
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
