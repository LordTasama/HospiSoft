// Importar Express
const express = require('express');

// Inicializar un enrutador de Express
const item = express.Router();

// Importar el módulo de conexión a la base de datos
const cnx = require('./bdata');

// Ruta para obtener la lista de ítems
item.get('/item/list/:tipo', (req, res) => {
  // Consulta SQL para obtener todos los ítems
  let tipo = req.params.tipo;

  if (tipo != 0 || tipo != 1) {
    tipo = 0;
  }
  const query =
    'select * from item where tipo =' +
    req.params.tipo +
    ' order by estado desc';

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de los ítems
      res.status(200).send(data);
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(404).send({
        status: 'error',
        message: 'Algo ocurrió al tratar de hacer esta operación...',
        error: error.message,
      });
    }
  });
});

// Ruta para buscar un ítem por su ID
item.get('/item/find/:search', (req, res) => {
  // Obtener el ID del ítem de los parámetros de la solicitud
  const search = req.params.search;
  let query = 'select * from  item where id=-1';
  // Consulta SQL para buscar un ítem por su ID o descripción
  if (search && Number.isInteger(Number(search))) {
    query = 'select * from item where id=' + search;
  } else if (search && !Number.isInteger(Number(search))) {
    query = "select * from  item where descripcion like '%" + search + "%'";
  }

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos del ítem encontrado

      if (data.length >= 1) {
        res.status(200).send(data[0]);
      } else if (data.length == 1) {
        res.status(200).send(data[0]);
      } else {
        res.status(200).send({
          status: 'no-data',
        });
      }
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(404).send({
        status: 'error',
        message: 'Algo ocurrió al tratar de hacer esta operación...',
        error: error.message,
      });
    }
  });
});

// Ruta para crear un nuevo ítem
item.post('/item/create', (req, res) => {
  // Obtener los datos del ítem de la solicitud
  let frmdata = req.body;

  // Consulta SQL para insertar un nuevo ítem
  const query = 'insert into item set ?';

  // Ejecutar la consulta de inserción
  cnx.query(query, frmdata, (error, data) => {
    // Manejar el resultado de la inserción
    if (!error) {
      // Si no hay error, devolver un mensaje de éxito
      res.status(200).send({
        status: 'ok',
        message: 'Item insertado exitosamente',
        error: '',
      });
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(404).send({
        status: 'error',
        message: 'Algo ocurrió al tratar de hacer esta operación...',
        error: error.message,
      });
    }
  });
});

// Ruta para actualizar un ítem existente
item.put('/item/update/:id', (req, res) => {
  // Obtener los datos actualizados del ítem de la solicitud
  let frmdata = req.body;

  // Consulta SQL para actualizar un ítem existente por su ID
  const query = 'update item set ? where id=?';

  // Ejecutar la consulta de actualización
  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    // Manejar el resultado de la actualización
    if (!error) {
      // Si no hay error, devolver un mensaje de éxito
      res.status(200).send({
        status: 'ok',
        message: 'Item actualizado exitosamente',
        error: '',
      });
    } else {
      // Si hay un error, devolver un mensaje de error
      res.status(404).send({
        status: 'error',
        message: 'Algo ocurrió al tratar de hacer esta operación...',
        error: error.message,
      });
    }
  });
});

// Ruta para cambiar el estado de un ítem
item.delete('/item/status/:id', (req, res) => {
  // Obtener el ID del item de los parámetros de la solicitud
  const id = req.params.id; // Obtención del ID del usuario desde la URL
  let estado = 0;
  const query = 'select estado from item where id = ' + id;
  cnx.query(query, (error, data) => {
    if (data[0].estado == 0) {
      estado = 1;
    }
    // Consulta SQL para cambiar el estado de un item
    const query = 'update item set estado = ' + estado + ' where id = ' + id;

    // Ejecutar la consulta de actualización de estado
    cnx.query(query, (error, data) => {
      // Manejar el resultado de la actualización de estado
      if (!error) {
        // Verificar si se actualizó correctamente el estado del ítem
        if (data.affectedRows == 0) {
          // Si el ítem no existe en la base de datos, devolver un mensaje de error
          res.status(200).send({
            status: 'error',
            message: 'El item no existe en la base de datos',
            error: '',
          });
        } else {
          // Si se actualiza correctamente el estado, devolver un mensaje de éxito
          res.status(200).send({
            status: 'ok',
            message: 'El estado ha sido cambiado exitosamente',
            error: '',
          });
        }
      } else {
        // Si hay un error, devolver un mensaje de error
        res.status(404).send({
          status: 'error',
          message: 'Algo ocurrió al tratar de hacer esta operación...',
          error: error.message,
        });
      }
    });
  });
});

// Exportar el enrutador para su uso en otros archivos
module.exports = item;
