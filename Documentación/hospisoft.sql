CREATE DATABASE HospiSoft;
USE HospiSoft;

-- Tabla Rol

CREATE TABLE `rol` (
  `id` INT(1) NOT NULL,
  `nombre` VARCHAR(13) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserciones a la tabla Rol

INSERT INTO `rol` VALUES(0,"Owner"),(1,"Administrador"),(2,"Médico"),(3,"Secretaria"),(4,"Dispensario");


-- Tabla Especialidad

CREATE TABLE `especialidad` (
    `id` INT(2) PRIMARY KEY,
    `descripcion` VARCHAR(20) UNIQUE NOT NULL
);


-- Inserciones a la tabla Especialidad

INSERT INTO `especialidad` 
VALUES
(0, 'Cardiología'),
(1, 'Dermatología'),
(2, 'Endocrinología'),
(3, 'Gastroenterología'),
(4, 'Hematología'),
(5, 'Neurología'),
(6, 'Oncología'),
(7, 'Oftalmología'),
(8, 'Ortopedia'),
(9, 'Otorrinolaringología'),
(10, 'Pediatría'),
(11, 'Psiquiatría'),
(12, 'Neumología'),
(13, 'Radiología'),
(14, 'Urología');

-- Tabla eps

CREATE TABLE EPS (
    nit INT(9) PRIMARY KEY,
    entidad VARCHAR(100) NOT NULL,
    codigo VARCHAR(25) NOT NULL,
    codigo_movilidad VARCHAR(25) NOT NULL,
    regimen VARCHAR(20) NOT NULL
);

-- Inserciones a la tabla eps
INSERT INTO `eps` 
VALUES
(900226715, 'COOSALUD EPS-S', 'ESS024 - EPS042', 'ESSC24 - EPSS42', 'AMBOS REGÍMENES'),
(900156264, 'NUEVA EPS', 'EPS037 - EPSS41', 'EPSS37 - EPS041', 'AMBOS REGÍMENES'),
(806008394, 'MUTUAL SER', 'ESS207 - EPS048', 'ESSC07 - EPSS48', 'AMBOS REGÍMENES'),
(830113831, 'ALIANSALUD EPS', 'EPS001', 'EPSS01', 'CONTRIBUTIVO'),
(800130907, 'SALUD TOTAL EPS S.A.', 'EPS002', 'EPSS02', 'CONTRIBUTIVO'),
(800251440, 'EPS SANITAS', 'EPS005', 'EPSS05', 'CONTRIBUTIVO'),
(800088702, 'EPS SURA', 'EPS010', 'EPSS10', 'CONTRIBUTIVO'),
(830003564, 'FAMISANAR', 'EPS017', 'EPSS17', 'CONTRIBUTIVO'),
(805001157, 'SERVICIO OCCIDENTAL DE SALUD EPS SOS', 'EPS018', 'EPSS18', 'CONTRIBUTIVO'),
(900914254, 'SALUD MIA', 'EPS046', 'EPSS46', 'CONTRIBUTIVO'),
(890303093, 'COMFENALCO VALLE', 'EPS012', 'EPSS12', 'CONTRIBUTIVO'),
(860066942, 'COMPENSAR EPS', 'EPS008', 'EPSS08', 'CONTRIBUTIVO'),
(890904996, 'EPM - EMPRESAS PUBLICAS DE MEDELLIN', 'EAS016', 'N/A', 'CONTRIBUTIVO'),
(800112806, 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA', 'EAS027', 'N/A', 'CONTRIBUTIVO'),
(890102044, 'CAJACOPI ATLANTICO', 'CCF055', 'CCFC55', 'SUBSIDIADO'),
(891856000, 'CAPRESOCA', 'EPS025', 'EPSC25', 'SUBSIDIADO'),
(891600091, 'COMFACHOCO', 'CCF102', 'CCFC20', 'SUBSIDIADO'),
(890500675, 'COMFAORIENTE', 'CCF050', 'CCFC50', 'SUBSIDIADO'),
(901543761, 'EPS FAMILIAR DE COLOMBIA', 'CCF033', 'CCFC33', 'SUBSIDIADO'),
(900935126, 'ASMET SALUD', 'ESS062', 'ESSC62', 'SUBSIDIADO'),
(901021565, 'EMSSANAR E.S.S.', 'ESS118', 'ESSC18', 'SUBSIDIADO'),
(900298372, 'CAPITAL SALUD EPS-S', 'EPSS34', 'EPSC34', 'SUBSIDIADO'),
(900604350, 'SAVIA SALUD EPS', 'EPSS40', 'EPS040', 'SUBSIDIADO'),
(824001398, 'DUSAKAWI EPSI', 'EPSI01', 'EPSIC1', 'SUBSIDIADO'),
(817001773, 'ASOCIACION INDIGENA DEL CAUCA EPSI', 'EPSI03', 'EPSIC3', 'SUBSIDIADO'),
(839000495, 'ANAS WAYUU EPSI', 'EPSI04', 'EPSIC4', 'SUBSIDIADO'),
(837000084, 'MALLAMAS EPSI', 'EPSI05', 'EPSIC5', 'SUBSIDIADO'),
(809008362, 'PIJAOS SALUD EPSI', 'EPSI06', 'EPSIC6', 'SUBSIDIADO'),
(901438242, 'SALUD BÓLIVAR EPS SAS', 'EPS047', 'EPSS47', 'CONTRIBUTIVO');





-- Tabla Usuario

CREATE TABLE `usuario` (
  `identificacion` INT NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `username` VARCHAR(16) NOT NULL,
  `correo` VARCHAR(250) NOT NULL,
  `password` VARCHAR(250) NOT NULL,
  `id_rol` INT(1) not null,
  `estado` INT(1) DEFAULT 1,
  CONSTRAINT FOREIGN KEY (`id_rol`) REFERENCES rol(`id`),
  PRIMARY KEY (`identificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserción del usuario inicial (ACCESO TOTAL AL SISTEMA)

INSERT INTO `usuario` VALUES(1,"María Elena","Restrepo","Elenita","mariaelena@hotmail.com","b37b04d1088ce04b1330a78a4f399397ddbfcdea17f9e5692075ba640bf1e98a",0,DEFAULT);

-- Contraseña: "elenaMaria123@"


-- Tabla Paciente

CREATE TABLE `paciente` (
  `identificacion` INT NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(250) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `movil` VARCHAR(20),
  `fecha_nacimiento` DATE NOT NULL,
  `nit_eps` INT(9) NOT NULL,
  `estado` INT(1) DEFAULT 1,
  PRIMARY KEY (`identificacion`),
  CONSTRAINT FOREIGN KEY (`nit_eps`) REFERENCES eps(`nit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Tabla Medico

CREATE TABLE `medico` (
  `identificacion` INT NOT NULL,
  `nombres` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(250) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `id_especialidad` INT(2) NOT NULL,
  `estado` INT(1) DEFAULT 1,
  PRIMARY KEY (`identificacion`),
  CONSTRAINT FOREIGN KEY (`id_especialidad`) REFERENCES especialidad(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Tabla Item

CREATE TABLE `item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(200) NOT NULL,
  `existencia` INT NOT NULL,
  `tipo` INT(1) NOT NULL,	
  `estado` INT(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Tabla Fórmula

CREATE TABLE `formula` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `id_paciente` INT NOT NULL,
  `id_medico` INT NOT NULL,
  `estado` INT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`identificacion`),
  CONSTRAINT FOREIGN KEY (`id_medico`) REFERENCES `medico` (`identificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Tabla Detalle_Formula

CREATE TABLE `detalle_formula` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_formula` INT NOT NULL,
  `id_item` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `posologia` VARCHAR(150) NOT NULL,
  `estado` INT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`id_formula`) REFERENCES `formula` (`id`),
  CONSTRAINT FOREIGN KEY (`id_item`) REFERENCES `item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Cita

CREATE TABLE `cita` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `id_formula` INT,
  `id_medico` INT NOT NULL,
  `id_paciente` INT NOT NULL,
  `estado` INT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`id_formula`) REFERENCES `formula` (`id`),
  CONSTRAINT FOREIGN KEY (`id_medico`) REFERENCES `medico` (`identificacion`),
  CONSTRAINT FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`identificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
