const express = require("express");
const history = express.Router();
const cnx = require("./bdata");

// Ruta para obtener la lista de historias clínicas
history.get("/history/list", (req, res) => {
  // Consulta SQL para obtener todas las historias clínicas
  const query = "SELECT * FROM historia_clinica";

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const date = new Date(data[i]["fecha_creacion"]);
          // Obtener el año, mes, día, hora y minutos
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Añadir un cero a la izquierda para meses de un dígito
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0"); // Ajustar la hora a la zona horaria local
          const minutes = String(date.getMinutes()).padStart(2, "0");
          data[i][
            "fecha_creacion"
          ] = `${year}-${month}-${day} ${hours}:${minutes}`;
        }
      }
      // Si no hay error, devolver los datos de las historias clínicas
      res.status(200).send(data);
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(500).send({
        status: "error",
        message: "Error al obtener las historias clínicas",
        error: error.message,
      });
    }
  });
});

// Ruta para obtener una historia clínica por su ID
history.get("/history/find/:id", (req, res) => {
  // Obtener el ID de la historia clínica de los parámetros de la solicitud
  const id = req.params.id;

  // Consulta SQL para buscar una historia clínica por su ID
  const query = "SELECT * FROM historia_clinica WHERE id = ?";

  // Ejecutar la consulta
  cnx.query(query, id, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de la historia clínica encontrada
      if (data.length > 0) {
        console.log(data[0]);
        res.status(200).send(data[0]);
      } else {
        res.status(200).send(data);
      }
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(500).send({
        status: "error",
        message: "Error al buscar la historia clínica",
        error: error.message,
      });
    }
  });
});

// Ruta para crear una nueva historia clínica
history.post("/history/create", (req, res) => {
  // Obtener los datos de la historia clínica de la solicitud
  const today = new Date();
  const fullDate =
    today.getFullYear() +
    ":" +
    String(today.getMonth()).padStart(2, "0") +
    ":" +
    String(today.getDate()).padStart(2, "0") +
    " " +
    String(today.getHours()).padStart(2, "0") +
    ":" +
    String(today.getMinutes()).padStart(2, "0") +
    ":" +
    String(today.getSeconds()).padStart(2, "0");
  const formData = req.body;

  if (Object.keys(formData).length != 0) {
    formData.fecha_creacion = fullDate;
  }
  // Consulta SQL para insertar una nueva historia clínica
  const query = "INSERT INTO historia_clinica SET ?";

  // Ejecutar la consulta de inserción
  cnx.query(query, formData, (error, data) => {
    if (!error) {
      // Si no hay error, devolver un mensaje de éxito
      res.status(200).send({
        status: "success",
        message: "Historia clínica creada exitosamente",
        insertedId: data.insertId,
      });
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(500).send({
        status: "error",
        message: "Error al crear la historia clínica",
        error: error.message,
      });
    }
  });
});

// Ruta para actualizar una historia clínica existente
history.put("/history/update/:id", (req, res) => {
  // Obtener los datos actualizados de la historia clínica de la solicitud
  const formData = req.body;
  const id = req.params.id;

  // Consulta SQL para actualizar una historia clínica existente por su ID
  const query = "UPDATE historia_clinica SET ? WHERE id = ?";

  // Ejecutar la consulta de actualización
  cnx.query(query, [formData, id], (error, data) => {
    if (!error) {
      if (data.affectedRows > 0) {
        // Si se actualiza correctamente, devolver un mensaje de éxito
        res.status(200).send({
          status: "success",
          message: "Historia clínica actualizada exitosamente",
        });
      } else {
        // Si la historia clínica no existe, devolver un mensaje de error
        res.status(404).send({
          status: "error",
          message: "La historia clínica no existe",
        });
      }
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(500).send({
        status: "error",
        message: "Error al actualizar la historia clínica",
        error: error.message,
      });
    }
  });
});
// Ruta para cambiar el estado de un paciente
history.delete("/history/status/:id", (req, res) => {
  // Obtener el ID del paciente de los parámetros de la solicitud
  const id = req.params.id; // Obtención del ID del paciente desde la URL
  let estado = 0;
  const query = "select estado from historia_clinica where id = " + id;

  cnx.query(query, (error, data) => {
    if (data.length > 0) {
      if (data[0].estado == 0) {
        estado = 1;
      }
    }

    // Consulta SQL para cambiar el estado de un paciente
    const query =
      "update historia_clinica set estado = " + estado + " where id = " + id;

    // Ejecutar la consulta de actualización de estado
    cnx.query(query, (error, data) => {
      // Manejar el resultado de la actualización de estado
      if (!error) {
        // Verificar si se actualizó correctamente el estado del paciente
        if (data.affectedRows == 0) {
          // Si el paciente no existe en la base de datos, devolver un mensaje de error
          res.status(200).send({
            status: "non-existent",
            message: "La historia clínica no existe en la base de datos",
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
module.exports = history;
