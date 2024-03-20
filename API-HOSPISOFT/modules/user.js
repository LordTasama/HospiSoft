// Importación de los módulos necesarios
const jwt = require("jsonwebtoken"); // Módulo para trabajar con tokens JWT
const express = require("express"); // Framework web para Node.js
const user = express.Router(); // Creación de un enrutador de Express
const cnx = require("./bdata"); // Conexión a la base de datos
const jssha256 = require("js-sha256"); // Módulo para realizar hashing

// Función para obtener el rol del usuario a partir del token JWT
const returnRol = (auth) => {
  const verify = jwt.verify(auth, "taSa13tOb03"); // Verifica y decodifica el token JWT

  return {
    nombres: verify.nombres,
    apellidos: verify.apellidos,
    identificacion: verify.identificacion,
    rol: verify.rol,
  }; // Retorna el rol del usuario desde el token decodificado
};

// Ruta para la autenticación de usuario (obtiene el rol del usuario a partir del token)
user.get("/user/login/status", (req, res) => {
  res.status(200).send({ respuesta: returnRol(req.headers.authorization) });
});

// Ruta para obtener la lista de usuarios
user.get("/user/list", (req, res) => {
  // Consulta SQL para obtener los datos de todos los usuarios
  const query =
    "select identificacion,nombres,apellidos,username,correo,id_rol,estado from usuario where identificacion <> 1 order by id_rol asc";
  // Ejecución de la consulta
  cnx.query(query, (error, data) => {
    if (!error) {
      res.status(200).send(data); // Envío de la respuesta con los datos de los usuarios
    } else {
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      }); // Envío de un mensaje de error en caso de fallo
    }
  });
});

// Ruta para buscar un usuario por su identificación
user.get("/user/find/:id/:email", (req, res) => {
  // Obtención del parámetro de identificación desde la URL
  const id = req.params.id;
  const email = req.params.email;
  let query = "";
  // Consulta SQL para buscar un usuario por su identificación
  if (id != "---" && email == "---") {
    query = "select * from usuario where identificacion = " + id;
  } else if (email != "---" && id == "---") {
    query = "select * from usuario where correo = '" + email + "'";
  } else {
    query =
      "select * from usuario where correo = '" +
      email +
      "'" +
      " and identificacion <>" +
      id;
  }

  // Ejecución de la consulta
  cnx.query(query, (error, data) => {
    if (!error) {
      res.status(200).send(data); // Envío de la respuesta con los datos del usuario encontrado
    } else {
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      }); // Envío de un mensaje de error en caso de fallo
    }
  });
});

// Ruta para crear un nuevo usuario
user.post("/user/create", (req, res) => {
  let condition = true;
  cnx.query(
    "select * FROM usuario where correo = '" + req.body.correo + "'",
    (error, data) => {
      if (data.length > 0) {
        res.status(200).send({
          status: "error",
          message: "Correo electrónico ya existe",
          error: "",
        });
        let condition = false;
      }
    }
  );
  if (!condition) {
    return;
  }
  let frmdata = req.body; // Obtención de los datos del usuario desde la solicitud
  let hash = jssha256.hmac.create("AdSo2671333"); // Creación de un hash para la contraseña
  hash.update(frmdata.password); // Actualización del hash con la contraseña del usuario
  hash.hex(); // Conversión del hash a hexadecimal
  frmdata.password = hash; // Asignación del hash como la nueva contraseña
  const query = "insert into usuario set ?"; // Consulta SQL para insertar un nuevo usuario

  // Ejecución de la consulta
  cnx.query(query, frmdata, (error, data) => {
    let errorCode = 0; // Inicialización del código de error
    if (error) {
      errorCode = error.code.length; // Obtención del código de error
    }
    if (errorCode == 12) {
      res.status(404).send({
        status: "error",
        message: "Identificación ya existe",
        error: "",
      }); // Envío de un mensaje de error si la identificación ya existe
    } else if (errorCode == 0) {
      res.status(200).send({
        status: "ok",
        message: "Usuario insertado exitosamente",
        error: "",
      }); // Envío de un mensaje de éxito si el usuario se insertó correctamente
    } else {
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      }); // Envío de un mensaje de error en caso de fallo
    }
  });
});

// Ruta para actualizar los datos de un usuario existente
user.put("/user/update/:id", (req, res) => {
  let frmdata = req.body; // Obtención de los nuevos datos del usuario desde la solicitud
  if (frmdata.password != "") {
    let hash = jssha256.hmac.create("AdSo2671333"); // Creación de un hash para la nueva contraseña
    hash.update(frmdata.password); // Actualización del hash con la nueva contraseña
    hash.hex(); // Conversión del hash a hexadecimal
    frmdata.password = hash; // Asignación del hash como la nueva contraseña
  } else {
    delete frmdata.password;
  }
  const query =
    "update usuario set ? where identificacion=? and identificacion <> 1"; // Consulta SQL para actualizar los datos del usuario

  // Ejecución de la consulta
  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    if (!error) {
      if (data.affectedRows > 0) {
        res.status(200).send({
          status: "ok",
          Mensaje: "Usuario actualizado exitosamente",
          error: "",
        }); // Envío de un mensaje de éxito si el usuario se actualizó correctamente
      } else {
        res.status(200).send({
          status: "non-existent",
          message: "La identificación no existe en la base de datos",
          error: "",
        }); // Envío de un mensaje de error en caso de fallo
      }
    } else {
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      }); // Envío de un mensaje de error en caso de fallo
    }
  });
});

// Ruta para cambiar el estado de un usuario (eliminarlo)
user.delete("/user/status/:id", (req, res) => {
  const id = req.params.id; // Obtención del ID del usuario desde la URL
  let estado = 0;
  const query = "select estado from usuario where identificacion = " + id;
  cnx.query(query, (error, data) => {
    if (data.length > 0) {
      if (data[0].estado == 0) {
        estado = 1;
      }
    }

    const query =
      "update usuario set estado = " + estado + " where identificacion = " + id; // Consulta SQL para cambiar el estado del usuario

    // Ejecución de la consulta
    cnx.query(query, (error, data) => {
      if (!error) {
        if (data.affectedRows == 0) {
          res.status(200).send({
            status: "non-existent",
            message: "El usuario no existe en la base de datos",
            error: "",
          }); // Envío de un mensaje de error si el usuario no existe
        } else {
          res.status(200).send({
            status: "ok",
            message: "El estado ha sido cambiado exitosamente",
            error: "",
          }); // Envío de un mensaje de éxito si el estado del usuario se cambió correctamente
        }
      } else {
        res.status(404).send({
          status: "error",
          message: "Algo ocurrió al tratar de hacer esta operación...",
          error: error.message,
        }); // Envío de un mensaje de error en caso de fallo
      }
    });
  });
});

// Ruta para obtener las eps

user.get("/eps/list", (req, res) => {
  // Consulta SQL para obtener los datos de todos los usuarios
  const query = "select nit,entidad from eps order by entidad ASC";
  // Ejecución de la consulta
  cnx.query(query, (error, data) => {
    if (!error) {
      res.status(200).send(data); // Envío de la respuesta con los datos de los usuarios
    } else {
      res.status(404).send({
        status: "error",
        message: "Algo ocurrió al tratar de hacer esta operación...",
        error: error.message,
      }); // Envío de un mensaje de error en caso de fallo
    }
  });
});

// Exportación del enrutador de usuario
module.exports = user;
