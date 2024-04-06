const jwt = require('jsonwebtoken');

// Exportar la función de middleware de autenticación
module.exports = autentificar = (req, res, next) => {
  try {
    // Verificar el token de autorización en el encabezado de la solicitud
    const verify = jwt.verify(req.headers.authorization, 'taSa13tOb03');

    // Si la verificación es exitosa, continuar con el siguiente middleware o controlador
    next();
  } catch (error) {
    // Manejar los errores de verificación del token
    if (res.status(200)) {
      // Si el servidor encuentra un error interno (500), devolver un mensaje de error genérico
      res.send({
        status: 'error',
        message:
          'Error de parte del servidor, ¿El token ya expiró? ¿No se pudo obtener el token? Intenta iniciar sesión nuevamente.',
        error: error.name + ' - ' + error.message,
      });
    } else if (res.status(400)) {
      // Si el cliente envía una solicitud incorrecta (400), devolver un mensaje de error genérico
      res.status(400).send({
        status: 'error',
        message:
          'Error de parte del cliente, algo está bloqueando el ingreso, comprueba tu conexión...',
        error: error.name + ' - ' + error.message,
      });
    }
  }
};
