// Importar Express
const express = require("express");

// Inicializar un enrutador de Express
const patient = express.Router();

// Importar el módulo de conexión a la base de datos
const cnx = require("./bdata");

// Ruta para obtener la lista de pacientes
patient.get("/patient/list", (req, res) => {
  // Consulta SQL para obtener todos los pacientes
  const query =
    "select paciente.*,entidad from paciente INNER JOIN eps on eps.nit = nit_eps";

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de los pacientes
      res.status(200).send(data);
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      });
    }
  });
});

// Ruta para buscar un paciente por su ID
patient.get("/patient/find/:id", (req, res) => {
  // Obtener el ID del paciente de los parámetros de la solicitud
  const id = req.params.id;

  // Consulta SQL para buscar un paciente por su ID
  const query =
    "select paciente.*,entidad from paciente INNER JOIN eps on eps.nit = nit_eps where identificacion = " +
    id;

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos del paciente encontrado
      res.status(200).send(data);
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      });
    }
  });
});

// Ruta para crear un nuevo paciente
patient.post("/patient/create", (req, res) => {
  // Obtener los datos del paciente de la solicitud
  let frmdata = req.body;

  // Consulta SQL para insertar un nuevo paciente
  const query = "insert into paciente set ?";

  // Ejecutar la consulta de inserción
  cnx.query(query, frmdata, (error, data) => {
    // Manejar el resultado de la inserción
    let errorCode = 0;
    if (error) {
      errorCode = error.code.length;
    }
    if (errorCode == 12) {
      // Si el código de error es 12, significa que la identificación ya existe
      res.status(404).send({
        status: "error",
        message: "Identificación ya existe",
        error: "",
      });
    } else if (errorCode == 0) {
      // Si no hay error de código, devolver un mensaje de éxito
      res.status(200).send({
        status: "ok",
        message: "Paciente insertado exitosamente",
        error: "",
      });
    } else {
      // Si hay otro tipo de error, devolver un mensaje de error
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      });
    }
  });
});

// Ruta para actualizar un paciente existente
patient.put("/patient/update/:id", (req, res) => {
  // Obtener los datos actualizados del paciente de la solicitud
  let frmdata = req.body;

  // Consulta SQL para actualizar un paciente existente por su ID
  const query = "update paciente set ? where identificacion=?";

  // Ejecutar la consulta de actualización
  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    // Manejar el resultado de la actualización
    if (!error) {
      // Si no hay error, devolver un mensaje de éxito
      if (data.affectedRows > 0) {
        res.status(200).send({
          status: "ok",
          message: "Paciente actualizado exitosamente",
          error: "",
        });
      } else {
        res.status(200).send({
          status: "non-existent",
          message: "La identificación no existe en la base de datos",
          error: "",
        });
      }
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      });
    }
  });
});

// Ruta para cambiar el estado de un paciente
patient.delete("/patient/status/:id", (req, res) => {
  // Obtener el ID del paciente de los parámetros de la solicitud
  const id = req.params.id; // Obtención del ID del paciente desde la URL
  let estado = 0;
  const query = "select estado from paciente where identificacion = " + id;

  cnx.query(query, (error, data) => {
    if (data.length > 0) {
      if (data[0].estado == 0) {
        estado = 1;
      }
    }

    // Consulta SQL para cambiar el estado de un paciente
    const query =
      "update paciente set estado = " +
      estado +
      " where identificacion = " +
      id;

    // Ejecutar la consulta de actualización de estado
    cnx.query(query, (error, data) => {
      // Manejar el resultado de la actualización de estado
      if (!error) {
        // Verificar si se actualizó correctamente el estado del paciente
        if (data.affectedRows == 0) {
          // Si el paciente no existe en la base de datos, devolver un mensaje de error
          res.status(200).send({
            status: "non-existent",
            message: "El paciente no existe en la base de datos",
            error: "",
          });
        } else {
          // Si se actualiza correctamente el estado, devolver un mensaje de éxito
          res.status(200).send({
            status: "ok",
            message: "El estado ha sido cambiado exitosamente",
            error: "",
          });
        }
      } else {
        // Si hay un error, devolver un mensaje de error
        res.status(200).send({
          status: "error",
          message: "Algo ocurrió al tratar de hacer esta operación...",
          error: error.message,
        });
      }
    });
  });
});

// Exportar el enrutador para su uso en otros archivos
module.exports = patient;
