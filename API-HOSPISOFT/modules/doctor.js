const express = require("express");
const doctor = express.Router();
const jssha256 = require("js-sha256");
const cnx = require("./bdata");

// Ruta para obtener la lista de doctores
doctor.get("/doctor/list", (req, res) => {
  // Consulta SQL para obtener todos los doctores
  const query = "select * from medico";

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de los doctores
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

// Ruta para buscar un doctor por su ID
doctor.get("/doctor/find/:id", (req, res) => {
  // Obtener el ID del doctor de los parámetros de la solicitud
  const id = req.params.id;

  // Consulta SQL para buscar un doctor por su identificación
  const query = "select * from medico where identificacion = " + id;

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos del doctor encontrado
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

// Ruta para crear un nuevo doctor
doctor.post("/doctor/create", (req, res) => {
  // Obtener los datos del doctor de la solicitud
  let frmdata = req.body;

  // Consulta SQL para insertar un nuevo doctor
  const query = "insert into medico set ?";

  // Ejecutar la consulta de inserción
  cnx.query(query, frmdata, (error, data) => {
    let errorCode = 0;
    if (error) {
      errorCode = error.code.length;
    }
    if (errorCode == 12) {
      // Si la identificación ya existe, devolver un mensaje de error
      res.status(404).send({
        status: "error",
        message: "Identificación ya existe",
        error: "",
      });
    } else if (errorCode == 0) {
      // Si no hay error, devolver un mensaje de éxito
      res.status(200).send({
        status: "ok",
        message: "Doctor insertado exitosamente",
        error: "",
      });
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

// Ruta para actualizar un doctor existente
doctor.put("/doctor/update/:id", (req, res) => {
  // Obtener los datos actualizados del doctor de la solicitud
  let frmdata = req.body;

  // Consulta SQL para actualizar un doctor existente por su identificación
  const query = "update medico set ? where identificacion=?";

  // Ejecutar la consulta de actualización
  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    if (!error) {
      // Si no hay error, devolver un mensaje de éxito
      if (data.affectedRows > 0) {
        res.status(200).send({
          status: "ok",
          message: "Médico actualizado exitosamente",
          error: "",
        });
      } else {
        res.status(200).send({
          status: "non-existen",
          message: "La identificación no existe en la base de datos",
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

// Ruta para cambiar el estado de un doctor
doctor.delete("/doctor/status/:id", (req, res) => {
  // Obtener el ID del doctor de los parámetros de la solicitud
  const id = req.params.id; // Obtención del ID del doctor desde la URL
  let estado = 0;
  const query = "select estado from medico where identificacion = " + id;
  cnx.query(query, (error, data) => {
    if (data.length > 0) {
      if (data[0].estado == 0) {
        estado = 1;
      }
    }

    // Consulta SQL para cambiar el estado de un doctor
    const query =
      "update medico set estado = " + estado + " where identificacion = " + id;

    // Ejecutar la consulta de actualización de estado
    cnx.query(query, (error, data) => {
      if (!error) {
        if (data.affectedRows == 0) {
          // Si el doctor no existe en la base de datos, devolver un mensaje de error
          res.status(200).send({
            status: "non-existent",
            message: "El médico no existe en la base de datos",
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
module.exports = doctor;
