const express = require("express");
const historiaClinicaRouter = express.Router();
const cnx = require("./bdata");

// Ruta para obtener la lista de historias clínicas
historiaClinicaRouter.get("/historiaclinica/list", (req, res) => {
  // Consulta SQL para obtener todas las historias clínicas
  const query = "SELECT * FROM historiasclinicas";

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
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
historiaClinicaRouter.get("/historiaclinica/find/:id", (req, res) => {
  // Obtener el ID de la historia clínica de los parámetros de la solicitud
  const id = req.params.id;

  // Consulta SQL para buscar una historia clínica por su ID
  const query = "SELECT * FROM historiasclinicas WHERE id = ?";

  // Ejecutar la consulta
  cnx.query(query, id, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de la historia clínica encontrada
      res.status(200).send(data);
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
historiaClinicaRouter.post("/historiaclinica/create", (req, res) => {
  // Obtener los datos de la historia clínica de la solicitud
  const formData = req.body;

  // Consulta SQL para insertar una nueva historia clínica
  const query = "INSERT INTO historiasclinicas SET ?";

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
historiaClinicaRouter.put("/historiaclinica/update/:id", (req, res) => {
  // Obtener los datos actualizados de la historia clínica de la solicitud
  const formData = req.body;
  const id = req.params.id;

  // Consulta SQL para actualizar una historia clínica existente por su ID
  const query = "UPDATE historiasclinicas SET ? WHERE id = ?";

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

// Exportar el enrutador para su uso en otros archivos
module.exports = historiaClinicaRouter;
