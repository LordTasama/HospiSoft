// Importar Express
const express = require('express');

// Inicializar un enrutador de Express
const appointment = express.Router();

// Importar el módulo de conexión a la base de datos
const cnx = require('./bdata');

// Ruta para obtener la lista de citas
appointment.get('/appointment/list', (req, res) => {
  // Consulta SQL para obtener todas las citas
  const query =
    "select cita.*,CONCAT(medico.nombres, ' ', medico.apellidos) As nombre_medico, CONCAT(paciente.nombres, ' ', paciente.apellidos) As nombre_paciente from cita INNER JOIN medico ON medico.identificacion = cita.id_medico INNER JOIN paciente ON paciente.identificacion = cita.id_paciente";

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de la cita
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

// Ruta para buscar una cita por su ID
appointment.get('/appointment/find/:id', (req, res) => {
  // Obtener el ID de la cita de los parámetros de la solicitud
  const id = req.params.id;

  // Consulta SQL para buscar una cita por su ID
  const query =
    "select cita.*,CONCAT(medico.nombres, ' ', medico.apellidos) As nombre_medico, CONCAT(paciente.nombres, ' ', paciente.apellidos) As nombre_paciente from cita INNER JOIN medico ON medico.identificacion = cita.id_medico INNER JOIN paciente ON paciente.identificacion = cita.id_paciente where id = " +
    id;

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Manejar el resultado de la consulta
    if (!error) {
      // Si no hay error, devolver los datos de la cita encontrada
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

// Ruta para crear una nueva cita
appointment.post('/appointment/create', (req, res) => {
  // Consulta SQL para verificar si ya hay una cita programada para el paciente
  const query =
    'select * from cita where id_paciente = ' +
    req.body.id_paciente +
    ' and estado = 1';

  // Ejecutar la consulta
  cnx.query(query, (error, data) => {
    // Verificar si hay una cita programada para el paciente
    if (data.length == 0) {
      // Si no hay cita programada, se procede a insertar una nueva cita
      let frmdata = req.body;
      const query = 'insert into cita set ?';

      // Ejecutar la consulta de inserción
      cnx.query(query, frmdata, (error, data) => {
        // Manejar el resultado de la inserción
        if (!error) {
          // Si no hay error, devolver un mensaje de éxito
          res.status(200).send({
            status: 'ok',
            message: 'Cita insertada exitosamente',
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
    } else {
      // Si ya hay una cita programada para el paciente, devolver un mensaje de error
      res.status(200).send({
        status: 'error',
        message: 'Ya hay una cita programada para este paciente.',
        error: '',
      });
    }
  });
});

// Ruta para actualizar una cita existente
appointment.put('/appointment/update/:id', (req, res) => {
  // Obtener los datos actualizados de la cita de la solicitud
  let frmdata = req.body;

  // Consulta SQL para actualizar una cita existente por su ID
  const query = 'update cita set ? where id=?';

  // Ejecutar la consulta de actualización
  cnx.query(query, [frmdata, req.params.id], (error, data) => {
    // Manejar el resultado de la actualización
    if (!error) {
      // Si no hay error, devolver un mensaje de éxito
      res.status(200).send({
        status: 'ok',
        message: 'Cita actualizada exitosamente',
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

// Ruta para cambiar el estado de una cita
appointment.delete('/appointment/status/:id', (req, res) => {
  // Obtener el ID de la cita de los parámetros de la solicitud
  const id = req.params.id; // Obtención del ID de la cita desde la URL
  let estado = 0;
  const query = 'select estado from cita where id = ' + id;
  cnx.query(query, (error, data) => {
    if (data[0].estado == 0) {
      estado = 1;
    }
    // Consulta SQL para cambiar el estado de un cita
    const query = 'update cita set estado = ' + estado + ' where id = ' + id;

    // Ejecutar la consulta de actualización de estado
    cnx.query(query, (error, data) => {
      // Manejar el resultado de la actualización de estado
      if (!error) {
        // Verificar si se actualizó correctamente el estado de la cita
        if (data.affectedRows == 0) {
          // Si no se encuentra la cita en la base de datos, devolver un mensaje de error
          res.status(200).send({
            status: 'error',
            message: 'La cita no existe en la base de datos',
            error: '',
          });
        } else {
          // Si se actualiza el estado correctamente, devolver un mensaje de éxito
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

appointment.get('/appointment/doctor/find/:search', (req, res) => {
  const search = req.params.search;
  let query = 'select * from  medico where identificacion=-1';
  // Consulta SQL para buscar un ítem por su ID o descripción
  if (search && Number.isInteger(Number(search))) {
    query =
      'select identificacion, CONCAT(nombres ," ",apellidos) As nombre_medico from medico where identificacion=' +
      search;
  } else if (search && !Number.isInteger(Number(search))) {
    query = `select identificacion, CONCAT(nombres ," ",apellidos) As nombre_medico from medico where (nombres like '%${search}%') or (apellidos like '%${search}%')`;
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

appointment.get('/appointment/patient/find/:search', (req, res) => {
  const search = req.params.search;
  let query = 'select * from  paciente where identificacion=-1';
  // Consulta SQL para buscar un ítem por su ID o descripción
  if (search && Number.isInteger(Number(search))) {
    query =
      'select identificacion, CONCAT(nombres ," ",apellidos) As nombre_paciente from paciente where identificacion=' +
      search;
  } else if (search && !Number.isInteger(Number(search))) {
    query = `select identificacion, CONCAT(nombres ," ",apellidos) As nombre_paciente from paciente where (nombres like '%${search}%') or (apellidos like '%${search}%')`;
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

// Exportar el enrutador para su uso en otros archivos
module.exports = appointment;
