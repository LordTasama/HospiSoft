// ESTE ELEMENTO DEBE SER ELIMINADO O COMENTADO UNA VEZ LA APLICACIÓN ESTÉ EN MARCHA
// LA RAZÓN: BRECHA DE SEGURIDAD GRANDE, PUEDEN ACCEDER A LA APLICACIÓN GENERANDO UN TOKEN SIN NECESIDAD DE LOGEARSE.
// PROBLEMA RESUELTO DESDE EL MÓDULO LOGIN, COMENTAR O ELIMINAR UNA VEZ LA APP MARCHE.

// Importar el paquete jsonwebtoken y Express
const jwt = require("jsonwebtoken");
const express = require("express");

// Inicializar un enrutador de Express
const generarToken = express.Router();

// Ruta para generar un token
generarToken.post("/token", (req, res) => {
  try {
    // Generar el token con los datos proporcionados en la solicitud
    const token = jwt.sign(
      {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        rol: req.body.rol,
      },
      "taSa13tOb03", // Clave secreta para firmar el token
      {
        expiresIn: 60 * 60, // El token expira en 1 hora (60 minutos * 60 segundos)
      }
    );

    // Devolver el token generado
    res.status(200).send({
      token: token,
    });
  } catch (error) {
    // Manejar errores en caso de fallo al generar el token
    res.send({ status: "error", message: "Error al generar el token" });
  }
});

// Exportar el enrutador para su uso en otros archivos
module.exports = generarToken;
