// Importar Express
const express = require("express");
const jssha256 = require("js-sha256");
const jwt = require("jsonwebtoken");
// Inicializar un enrutador de Express
const login = express.Router();

// Importar el módulo de conexión a la base de datos
const cnx = require("./bdata");

// Ruta para realizar el inicio de sesión de un usuario
login.post("/user/login", (req, res) => {
  let hash = jssha256.hmac.create("AdSo2671333"); // Creación de un hash para la contraseña

  hash.update(req.body.password); // Actualización del hash con la contraseña del usuario
  hash.hex();

  // Consulta SQL para buscar un usuario por su correo electrónico, contraseña y rol
  const query = `select * from usuario where correo = '${req.body.correo}' and password = '${hash}' and id_rol = ${req.body.rol}`;

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    try {
      // Manejar el resultado de la consulta
      if (data.length == 0) {
        res.status(200).send(data); // Envío de la respuesta con los datos de los usuarios
      } else {
        // Generar el token con los datos proporcionados en la solicitud
        const token = jwt.sign(
          {
            identificacion: data[0].identificacion,
          },
          "taSa13tOb03", // Clave secreta para firmar el token
          {
            expiresIn: 60 * 60, // El token expira en 1 hora (60 minutos * 60 segundos)
          }
        );

        // Devolver el token generado
        res.status(200).send({
          estado: data[0].estado,
          token: token,
        });
      }
    } catch (error) {
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
module.exports = login;
