-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-03-2024 a las 20:12:50
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hospisoft`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_formula` int(11) DEFAULT NULL,
  `id_medico` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `estado` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_formula`
--

CREATE TABLE `detalle_formula` (
  `id` bigint(20) NOT NULL,
  `id_formula` int(11) NOT NULL,
  `id_item` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `posologia` varchar(150) NOT NULL,
  `estado` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eps`
--

CREATE TABLE `eps` (
  `nit` int(9) NOT NULL,
  `entidad` varchar(100) NOT NULL,
  `codigo` varchar(25) NOT NULL,
  `codigo_movilidad` varchar(25) NOT NULL,
  `regimen` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eps`
--

INSERT INTO `eps` (`nit`, `entidad`, `codigo`, `codigo_movilidad`, `regimen`) VALUES
(800088702, 'EPS SURA', 'EPS010', 'EPSS10', 'CONTRIBUTIVO'),
(800112806, 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'EAS027', 'N/A', 'CONTRIBUTIVO'),
(800130907, 'SALUD TOTAL EPS S.A.', 'EPS002', 'EPSS02', 'CONTRIBUTIVO'),
(800251440, 'EPS SANITAS', 'EPS005', 'EPSS05', 'CONTRIBUTIVO'),
(805001157, 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'EPS018', 'EPSS18', 'CONTRIBUTIVO'),
(806008394, 'MUTUAL SER', 'ESS207 - EPS048', 'ESSC07 - EPSS48', 'AMBOS REGÍMENES'),
(809008362, 'PIJAOS SALUD EPSI', 'EPSI06', 'EPSIC6', 'SUBSIDIADO'),
(817001773, 'ASOCIACION INDIGENA DEL CAUCA EPSI', 'EPSI03', 'EPSIC3', 'SUBSIDIADO'),
(824001398, 'DUSAKAWI EPSI', 'EPSI01', 'EPSIC1', 'SUBSIDIADO'),
(830003564, 'FAMISANAR', 'EPS017', 'EPSS17', 'CONTRIBUTIVO'),
(830113831, 'ALIANSALUD EPS', 'EPS001', 'EPSS01', 'CONTRIBUTIVO'),
(837000084, 'MALLAMAS EPSI', 'EPSI05', 'EPSIC5', 'SUBSIDIADO'),
(839000495, 'ANAS WAYUU EPSI', 'EPSI04', 'EPSIC4', 'SUBSIDIADO'),
(860066942, 'COMPENSAR EPS', 'EPS008', 'EPSS08', 'CONTRIBUTIVO'),
(890102044, 'CAJACOPI ATLANTICO', 'CCF055', 'CCFC55', 'SUBSIDIADO'),
(890303093, 'COMFENALCO VALLE', 'EPS012', 'EPSS12', 'CONTRIBUTIVO'),
(890500675, 'COMFAORIENTE', 'CCF050', 'CCFC50', 'SUBSIDIADO'),
(890904996, 'EPM - EMPRESAS PUBLICAS DE MEDELLIN', 'EAS016', 'N/A', 'CONTRIBUTIVO'),
(891600091, 'COMFACHOCO', 'CCF102', 'CCFC20', 'SUBSIDIADO'),
(891856000, 'CAPRESOCA', 'EPS025', 'EPSC25', 'SUBSIDIADO'),
(900156264, 'NUEVA EPS', 'EPS037 - EPSS41', 'EPSS37 - EPS041', 'AMBOS REGÍMENES'),
(900226715, 'COOSALUD EPS-S', 'ESS024 - EPS042', 'ESSC24 - EPSS42', 'AMBOS REGÍMENES'),
(900298372, 'CAPITAL SALUD EPS-S', 'EPSS34', 'EPSC34', 'SUBSIDIADO'),
(900604350, 'SAVIA SALUD EPS', 'EPSS40', 'EPS040', 'SUBSIDIADO'),
(900914254, 'SALUD MIA', 'EPS046', 'EPSS46', 'CONTRIBUTIVO'),
(900935126, 'ASMET SALUD', 'ESS062', 'ESSC62', 'SUBSIDIADO'),
(901021565, 'EMSSANAR E.S.S.', 'ESS118', 'ESSC18', 'SUBSIDIADO'),
(901438242, 'SALUD BÓLIVAR EPS SAS', 'EPS047', 'EPSS47', 'CONTRIBUTIVO'),
(901543761, 'EPS FAMILIAR DE COLOMBIA', 'CCF033', 'CCFC33', 'SUBSIDIADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidad`
--

CREATE TABLE `especialidad` (
  `id` int(2) NOT NULL,
  `descripcion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidad`
--

INSERT INTO `especialidad` (`id`, `descripcion`) VALUES
(0, 'Cardiología'),
(1, 'Dermatología'),
(2, 'Endocrinología'),
(3, 'Gastroenterología'),
(4, 'Hematología'),
(12, 'Neumología'),
(5, 'Neurología'),
(7, 'Oftalmología'),
(6, 'Oncología'),
(8, 'Ortopedia'),
(9, 'Otorrinolaringología'),
(10, 'Pediatría'),
(11, 'Psiquiatría'),
(13, 'Radiología'),
(14, 'Urología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formula`
--

CREATE TABLE `formula` (
  `id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `estado` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historia_clinica`
--

CREATE TABLE `historia_clinica` (
  `id` bigint(20) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `motivo_consulta` varchar(200) NOT NULL,
  `enfermedades_previas` varchar(500) DEFAULT NULL,
  `alergias` varchar(500) DEFAULT NULL,
  `medicamentos_previos` varchar(500) DEFAULT NULL,
  `examen_fisico` varchar(500) DEFAULT NULL,
  `diagnostico` varchar(200) DEFAULT NULL,
  `tratamiento` varchar(500) DEFAULT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `estado` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `existencia` int(11) NOT NULL,
  `tipo` int(1) NOT NULL,
  `estado` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `identificacion` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo` varchar(250) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `id_especialidad` int(2) NOT NULL,
  `estado` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `identificacion` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo` varchar(250) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `movil` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `nit_eps` int(9) NOT NULL,
  `estado` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(1) NOT NULL,
  `nombre` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombre`) VALUES
(0, 'Owner'),
(1, 'Administrador'),
(2, 'Médico'),
(3, 'Secretaria'),
(4, 'Dispensario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `identificacion` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `username` varchar(16) NOT NULL,
  `correo` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `id_rol` int(1) NOT NULL,
  `estado` int(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`identificacion`, `nombres`, `apellidos`, `username`, `correo`, `password`, `id_rol`, `estado`) VALUES
(1, 'María Elena', 'Restrepo', 'Elenita', 'mariaelena@hotmail.com', 'b37b04d1088ce04b1330a78a4f399397ddbfcdea17f9e5692075ba640bf1e98a', 0, 1);


--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formula` (`id_formula`),
  ADD KEY `id_medico` (`id_medico`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `detalle_formula`
--
ALTER TABLE `detalle_formula`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_formula` (`id_formula`),
  ADD KEY `id_item` (`id_item`);

--
-- Indices de la tabla `eps`
--
ALTER TABLE `eps`
  ADD PRIMARY KEY (`nit`);

--
-- Indices de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `descripcion` (`descripcion`);

--
-- Indices de la tabla `formula`
--
ALTER TABLE `formula`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_medico` (`id_medico`);

--
-- Indices de la tabla `historia_clinica`
--
ALTER TABLE `historia_clinica`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_medico` (`id_medico`);

--
-- Indices de la tabla `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`identificacion`),
  ADD KEY `id_especialidad` (`id_especialidad`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`identificacion`),
  ADD KEY `nit_eps` (`nit_eps`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`identificacion`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_formula`
--
ALTER TABLE `detalle_formula`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formula`
--
ALTER TABLE `formula`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historia_clinica`
--
ALTER TABLE `historia_clinica`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
  ADD CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`id_formula`) REFERENCES `formula` (`id`),
  ADD CONSTRAINT `cita_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`identificacion`),
  ADD CONSTRAINT `cita_ibfk_3` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`identificacion`);

--
-- Filtros para la tabla `detalle_formula`
--
ALTER TABLE `detalle_formula`
  ADD CONSTRAINT `detalle_formula_ibfk_1` FOREIGN KEY (`id_formula`) REFERENCES `formula` (`id`),
  ADD CONSTRAINT `detalle_formula_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `item` (`id`);

--
-- Filtros para la tabla `formula`
--
ALTER TABLE `formula`
  ADD CONSTRAINT `formula_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`identificacion`),
  ADD CONSTRAINT `formula_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`identificacion`);

--
-- Filtros para la tabla `historia_clinica`
--
ALTER TABLE `historia_clinica`
  ADD CONSTRAINT `historia_clinica_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`identificacion`),
  ADD CONSTRAINT `historia_clinica_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`identificacion`);

--
-- Filtros para la tabla `medico`
--
ALTER TABLE `medico`
  ADD CONSTRAINT `medico_ibfk_1` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidad` (`id`);

--
-- Filtros para la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD CONSTRAINT `paciente_ibfk_1` FOREIGN KEY (`nit_eps`) REFERENCES `eps` (`nit`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
