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
      lengthMenu: "Mostrar _MENU_ historias clínicas por página",
      zeroRecords: "Ninguna historia clínica encontrada",
      info: "Mostrando _START_ a _END_ historias clínicas de _TOTAL_ ",
      infoEmpty: "Ninguna historia clínica encontrada",
      emptyTable: "Sin datos para mostrar",
      infoFiltered: "(filtrados desde _MAX_ historias clínicas totales)",
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
      const campos = [
        "id",
        "id_paciente",
        "id_medico",
        "fecha_creacion",
        "motivo_consulta",
        "enfermedades_previas",
        "alergias",
        "medicamentos_previos",
        "examen_fisico",
        "diagnostico",
        "tratamiento",
        "observaciones",
        "estado",
      ];

      for (i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        let column;
        for (j = 0; j < campos.length; j++) {
          column = document.createElement("td");
          column.textContent = data[i][campos[j]];
          if (j == 12) {
            column.textContent =
              data[i][campos[j]] == 1 ? "Activo" : "Inactivo";
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
      $("#dataTable").DataTable(dataTableOptions);
    }
  }

  loadTable();

  const changeTable = () => {
    document.querySelector("#containerTable").innerHTML = ` <table
    class="table table-bordered"
    id="dataTable"
    width="100%"
    cellspacing="0"
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>ID Paciente</th>
        <th>ID Médico</th>
        <th>Fecha de Creación</th>
        <th>Motivo de Consulta</th>
        <th>Enfermedades Previas</th>
        <th>Alergias</th>
        <th>Medicamentos Previos</th>
        <th>Examen Físico</th>
        <th>Diagnóstico</th>
        <th>Tratamiento</th>
        <th>Observaciones</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody id="bodyTable"></tbody>
  </table>`;

    loadTable();
  };

  async function fillData(id, condition) {
    try {
      const response = await fetch("http://localhost:3000/history/find/" + id, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      const deleteFullName = document.querySelector("#deleteFullName");
      if (condition == 0 && condition != 1) {
        if (data.id_paciente) {
          document.querySelector("#putIdPatient").value = data.id_paciente;
          document.querySelector("#putIdDoctor").value = data.id_medico;
          document.querySelector("#putReason").value = data.motivo_consulta;
          document.querySelector("#putPrevIllnesses").value =
            data.enfermedades_previas;
          document.querySelector("#putAllergies").value = data.alergias;
          document.querySelector("#putPrevMeds").value =
            data.medicamentos_previos;
          document.querySelector("#putPhysicalExam").value = data.examen_fisico;
          document.querySelector("#putDiagnosis").value = data.diagnostico;
          document.querySelector("#putTreatment").value = data.tratamiento;
          document.querySelector("#putObservations").value = data.observaciones;
        } else {
          deleteFullName.innerHTML = "";
          normalAlert("info", "Ningún dato encontrado", 500, "");
        }
        return;
      }

      if (data.id_paciente) {
        deleteFullName.innerHTML = `¿Estás seguro que deseas cambiar el estado de esta historia clínica?`;
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
    const patientId = document.querySelector("#postIdPatient");
    const doctorId = document.querySelector("#postIdDoctor");
    const reason = document.querySelector("#postReason");
    const prevIllnesses = document.querySelector("#postPrevIllnesses");
    const allergies = document.querySelector("#postAllergies");
    const prevMedications = document.querySelector("#postPrevMeds");
    const physicalExam = document.querySelector("#postPhysicalExam");
    const diagnosis = document.querySelector("#postDiagnosis");
    const treatment = document.querySelector("#postTreatment");
    const observations = document.querySelector("#postObservations");

    if (
      !patientId.value ||
      !doctorId.value ||
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

    // Validación de los ID
    if (patientId.value <= 0 || !Number.isInteger(Number(patientId.value))) {
      normalAlert("warning", "Id del paciente no válida.", 1500, "");
      return;
    }
    if (doctorId.value <= 0 || !Number.isInteger(Number(doctorId.value))) {
      normalAlert("warning", "Id del médico no válida.", 1500, "");
      return;
    }

    // Envío de la solicitud fetch si todas las validaciones pasaron
    fetch("http://localhost:3000/history/create/", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_paciente: patientId.value,
        id_medico: doctorId.value,
        fecha_creacion: "",
        motivo_consulta: reason.value,
        enfermedades_previas: prevIllnesses.value,
        alergias: allergies.value,
        medicamentos_previos: prevMedications.value,
        examen_fisico: physicalExam.value,
        diagnostico: diagnosis.value,
        tratamiento: treatment.value,
        observaciones: observations.value,
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
  });

  editMethod.addEventListener("click", () => {
    const putId = document.querySelector("#putId");
    const patientId = document.querySelector("#putIdPatient");
    const doctorId = document.querySelector("#putIdDoctor");
    const reason = document.querySelector("#putReason");
    const prevIllnesses = document.querySelector("#putPrevIllnesses");
    const allergies = document.querySelector("#putAllergies");
    const prevMedications = document.querySelector("#putPrevMeds");
    const physicalExam = document.querySelector("#putPhysicalExam");
    const diagnosis = document.querySelector("#putDiagnosis");
    const treatment = document.querySelector("#putTreatment");
    const observations = document.querySelector("#putObservations");

    if (
      !putId.value ||
      !patientId.value ||
      !doctorId.value ||
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

    // Validación de los ID
    if (patientId.value <= 0 || !Number.isInteger(Number(patientId.value))) {
      normalAlert("warning", "Id del paciente no válida.", 1500, "");
      return;
    }
    if (doctorId.value <= 0 || !Number.isInteger(Number(doctorId.value))) {
      normalAlert("warning", "Id del médico no válida.", 1500, "");
      return;
    }

    // Envío de la solicitud fetch si todas las validaciones pasaron
    fetch("http://localhost:3000/history/update/" + putId.value, {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_paciente: patientId.value,
        id_medico: doctorId.value,
        motivo_consulta: reason.value,
        enfermedades_previas: prevIllnesses.value,
        alergias: allergies.value,
        medicamentos_previos: prevMedications.value,
        examen_fisico: physicalExam.value,
        diagnostico: diagnosis.value,
        tratamiento: treatment.value,
        observaciones: observations.value,
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
            "Historia clínica editada correctamente",
            1500,
            ""
          );
          changeTable();
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
                "http://localhost:3000/history/status/" +
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
                      "El estado de la historia clínica ha sido cambiado correctamente",
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
