// Módulo que gestiona la conexión con la base de datos

const mysql = require("mysql2");

const user = "root";
const pass = "";
const server = "localhost";
const dbInfo = "hospisoft";

const conexion = mysql.createConnection({
  host: server,
  user: user,
  password: pass,
  database: dbInfo,
});

conexion.connect((error) => {
  if (error) {
    console.log(error);
    throw "Error al conectar a la base de datos!";
  } else {
    console.log("Conexión exitosa!");
  }
});

module.exports = conexion;
