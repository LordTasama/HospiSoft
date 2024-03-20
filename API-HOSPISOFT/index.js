// Importa los módulos necesarios
const express = require("express");
const cors = require("cors");
const user = require("./modules/user");
const patient = require("./modules/patient");
const doctor = require("./modules/doctor");
const item = require("./modules/item");
const appointment = require("./modules/appointment");
const prescription = require("./modules/prescription");
const auth = require("./modules/auth");
const token = require("./modules/token");
const login = require("./modules/login");

// Crea una aplicación Express
const app = express();

// Utiliza el middleware para analizar solicitudes JSON
app.use(express.json());

// Utiliza el middleware CORS para permitir solicitudes entre dominios
app.use(cors());

// Define el puerto en el que se ejecutará el servidor
const port = 3000;

// Define las rutas para los middlewares de generación de token y inicio de sesión
app.use("/", token);
app.use("/", login);

// Define las rutas protegidas para los módulos de usuario, paciente, doctor, item, cita y prescripción
app.use("/", auth, user);
app.use("/", auth, patient);
app.use("/", auth, doctor);
app.use("/", auth, item);
app.use("/", auth, appointment);
app.use("/", auth, prescription);

// Escucha las solicitudes en el puerto definido
app.listen(port, () => {});
