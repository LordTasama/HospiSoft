// Importar Express
const express = require("express");

// Inicializar un enrutador de Express
const prescription = express.Router();

// Importar el módulo de conexión a la base de datos
const cnx = require("./bdata");

// Ruta para obtener la lista de fórmulas
prescription.get("/prescription/list", (req, res) => {
  // Consulta SQL para obtener todas las fórmulas
  const query = "select * from formula";

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de las fórmulas
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

// Ruta para buscar una fórmula por su ID
prescription.get("/prescription/find/:id", (req, res) => {
  // Obtener el ID de la fórmula de los parámetros de la solicitud
  const id = req.params.id;

  // Consulta SQL para buscar una fórmula por su ID
  const query = "select * from formula where id = " + id;

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de la fórmula encontrada
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

// Ruta para crear una nueva fórmula
prescription.post("/prescription/create", (req, res) => {
  // Consulta SQL para verificar si hay una cita programada para el paciente
  const query =
    "select * from cita where id_paciente = " +
    req.body.formula.id_paciente +
    " and estado = 1";

  // Ejecutar la consulta para verificar la cita programada
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (data.length > 0) {
      // Si hay una cita programada, proceder con la creación de la fórmula
      let formula = req.body.formula;
      let detalle_formula = req.body.detalle_formula;
      const query = "insert into formula set ?";

      // Ejecutar la inserción de la fórmula
      cnx.query(query, formula, (error, data) => {
        if (!error) {
          // Obtener el ID de la fórmula recién creada
          const query = "select id from formula order by id DESC LIMIT 1";
          cnx.query(query, (error, data) => {
            let query = "insert into detalle_formula set ?";
            let query2 =
              "update item set existencia = existencia - ? where id = ?";

            // Iterar sobre los detalles de la fórmula y realizar las inserciones correspondientes
            for (let i = 0; i < detalle_formula.length; i++) {
              detalle_formula[i].id_formula = data[0].id;
              cnx.query(query, detalle_formula[i], (error, data) => {});
              cnx.query(
                query2,
                [detalle_formula[i].cantidad, detalle_formula[i].id_item],
                (error, data) => {}
              );
            }

            // Actualizar el estado de la cita a "no programada"
            query =
              "update cita set estado = 0, id_formula = " +
              data[0].id +
              " where id_paciente = " +
              req.body.formula.id_paciente +
              " and estado = 1";
            cnx.query(query, (error, data) => {});

            // Devolver un mensaje de éxito
            res.status(200).send({
              status: "ok",
              message: "Fórmula insertada exitosamente",
              error: "",
            });
          });
        } else {
          // Si hay un error en la inserción de la fórmula, devolver un mensaje de error
          res.status(404).send({
            status: "error",
            message: "Algo ocurrió al tratar de hacer esta operación...",
            error: error.message,
          });
        }
      });
    } else {
      // Si no hay una cita programada, devolver un mensaje de error
      res.status(200).send({
        status: "error",
        message: "No hay ninguna cita programada para generar la fórmula",
        error: "",
      });
    }
  });
});

// Ruta para cambiar el estado de una fórmula
prescription.delete("/prescription/status/:id", (req, res) => {
  // Obtener el ID de la fórmula de los parámetros de la solicitud
  const id = req.params.id;

  // Consulta SQL para cambiar el estado de una fórmula a inactivo
  const query = "update formula set estado = 0  where id = " + id;

  // Ejecutar la consulta de actualización de estado de la fórmula
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la actualización de estado
    if (!error) {
      // Verificar si se actualizó correctamente el estado de la fórmula
      if (data.affectedRows == 0) {
        // Si la fórmula no existe en la base de datos, devolver un mensaje de error
        res.status(200).send({
          status: "error",
          message: "La fórmula no existe en la base de datos",
          error: "",
        });
      } else {
        // Si se actualiza correctamente el estado, realizar las operaciones correspondientes
        let query =
          "update detalle_formula set estado = 0 where id_formula = " + id;
        cnx.query(query, (error, data) => {});
        query = "select * from detalle_formula where id_formula = " + id;
        cnx.query(query, (error, data) => {
          const query =
            "update item set existencia = existencia + ? where id = ?";

          // Iterar sobre los detalles de la fórmula y actualizar la existencia de los items correspondientes
          data.forEach((element) => {
            cnx.query(
              query,
              [element.cantidad, element.id_item],
              (error, data) => {}
            );
          });
        });

        // Devolver un mensaje de éxito
        res.status(200).send({
          status: "ok",
          message: "El estado ha sido cambiado exitosamente",
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

// Exportar el enrutador para su uso en otros archivos
module.exports = prescription;
