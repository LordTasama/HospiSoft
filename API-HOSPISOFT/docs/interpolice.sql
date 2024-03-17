-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-02-2024 a las 23:26:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `interpolice`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citizen`
--

CREATE TABLE `citizen` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `type` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citizen`
--

INSERT INTO `citizen` (`id`, `name`, `lastname`, `nickname`, `email`, `type`) VALUES
(2, 'Ronnica', 'Kinnear', 'rkinnear1', 'rkinnear1@umich.edu', 4),
(7, 'Ava', 'Cosgriff', 'acosgriff6', 'acosgriff6@i2i.jp', 3),
(11, 'Mikol', 'Fulun', 'mfuluna', 'mfuluna@cloudflare.com', 1),
(12, 'Aloysius', 'Long', 'alongb', 'alongb@ftc.gov', 2),
(13, 'Lorrayne', 'Pagel', 'lpagelc', 'lpagelc@dagondesign.com', 1),
(14, 'Victoir', 'Summersby', 'vsummersbyd', 'vsummersbyd@eepurl.com', 3),
(15, 'Anallise', 'Ward', 'awarde', 'awarde@usda.gov', 4),
(16, 'Grant', 'Acom', 'gacomf', 'gacomf@dmoz.org', 2),
(17, 'Pincus', 'Manzell', 'pmanzellg', 'pmanzellg@joomla.org', 2),
(18, 'Madel', 'Fitchell', 'mfitchellh', 'mfitchellh@imdb.com', 4),
(19, 'Andriana', 'Bente', 'abentei', 'abentei@4shared.com', 3),
(20, 'Jared', 'Gordge', 'jgordgej', 'jgordgej@ibm.com', 3),
(21, 'Saunder', 'Kershow', 'skershowk', 'skershowk@cnbc.com', 3),
(22, 'Hamilton', 'Bill', 'hbilll', 'hbilll@usatoday.com', 4),
(23, 'Tate', 'Simukov', 'tsimukovm', 'tsimukovm@cpanel.net', 2),
(24, 'Ailis', 'Dunphy', 'adunphyn', 'adunphyn@umn.edu', 4),
(25, 'Caria', 'Gauche', 'cgaucheo', 'cgaucheo@sbwire.com', 4),
(26, 'Nanny', 'Turney', 'nturneyp', 'nturneyp@behance.net', 1),
(27, 'Tina', 'Ewan', 'tewanq', 'tewanq@imgur.com', 1),
(28, 'Annadiana', 'Audibert', 'aaudibertr', 'aaudibertr@facebook.com', 2),
(29, 'Beret', 'Tomasino', 'btomasinos', 'btomasinos@vk.com', 2),
(30, 'Amandie', 'Camp', 'acampt', 'acampt@blogger.com', 3),
(31, 'Gertruda', 'Dermott', 'gdermottu', 'gdermottu@newsvine.com', 3),
(32, 'Lucia', 'Jendrach', 'ljendrachv', 'ljendrachv@t.co', 3),
(33, 'Evania', 'Botwood', 'ebotwoodw', 'ebotwoodw@psu.edu', 2),
(34, 'Cariotta', 'Willett', 'cwillettx', 'cwillettx@example.com', 1),
(35, 'Blakeley', 'Dowdell', 'bdowdelly', 'bdowdelly@latimes.com', 4),
(36, 'Claribel', 'McPake', 'cmcpakez', 'cmcpakez@smh.com.au', 2),
(37, 'Livia', 'Carlett', 'lcarlett10', 'lcarlett10@nymag.com', 4),
(38, 'Sile', 'Norgate', 'snorgate11', 'snorgate11@springer.com', 4),
(39, 'Tove', 'Gundrey', 'tgundrey12', 'tgundrey12@behance.net', 2),
(40, 'Sile', 'Wilkison', 'swilkison13', 'swilkison13@goo.gl', 4),
(41, 'Shelba', 'Draper', 'sdraper14', 'sdraper14@ucoz.ru', 2),
(42, 'Kira', 'Revill', 'krevill15', 'krevill15@github.io', 1),
(43, 'Donn', 'Simonard', 'dsimonard16', 'dsimonard16@youtu.be', 3),
(44, 'Lynnelle', 'Dufore', 'ldufore17', 'ldufore17@addtoany.com', 2),
(45, 'Cassondra', 'Wynes', 'cwynes18', 'cwynes18@engadget.com', 2),
(46, 'Bobina', 'Bosnell', 'bbosnell19', 'bbosnell19@newyorker.com', 2),
(47, 'Krispin', 'Hendrickson', 'khendrickson1a', 'khendrickson1a@examiner.com', 1),
(48, 'Cointon', 'Carnoghan', 'ccarnoghan1b', 'ccarnoghan1b@dailymail.co.uk', 2),
(49, 'Andris', 'Janiak', 'ajaniak1c', 'ajaniak1c@accuweather.com', 2),
(50, 'Gregor', 'Ascrofte', 'gascrofte1d', 'gascrofte1d@rediff.com', 2),
(51, 'Alexis', 'Strothers', 'astrothers1e', 'astrothers1e@t-online.de', 2),
(52, 'Filide', 'Derill', 'fderill1f', 'fderill1f@un.org', 4),
(53, 'Robin', 'Medcalfe', 'rmedcalfe1g', 'rmedcalfe1g@cmu.edu', 1),
(54, 'Paxon', 'Spragge', 'pspragge1h', 'pspragge1h@acquirethisname.com', 4),
(55, 'Row', 'Aldhouse', 'raldhouse1i', 'raldhouse1i@ask.com', 1),
(56, 'Arleta', 'Presho', 'apresho1j', 'apresho1j@ask.com', 3),
(57, 'Ruprecht', 'Robiou', 'rrobiou1k', 'rrobiou1k@wp.com', 1),
(58, 'Vincenz', 'Forge', 'vforge1l', 'vforge1l@godaddy.com', 1),
(59, 'Arabela', 'Fagg', 'afagg1m', 'afagg1m@symantec.com', 1),
(60, 'Jamison', 'Luesley', 'jluesley1n', 'jluesley1n@cmu.edu', 2),
(61, 'Mirabella', 'Gidley', 'mgidley1o', 'mgidley1o@1688.com', 3),
(62, 'Leanna', 'Luckham', 'lluckham1p', 'lluckham1p@baidu.com', 4),
(63, 'Derron', 'Stoddart', 'dstoddart1q', 'dstoddart1q@behance.net', 1),
(64, 'Joachim', 'Powell', 'jpowell1r', 'jpowell1r@people.com.cn', 4),
(65, 'Manfred', 'Krzyzowski', 'mkrzyzowski1s', 'mkrzyzowski1s@yellowpages.com', 1),
(66, 'Regina', 'Nobriga', 'rnobriga1t', 'rnobriga1t@acquirethisname.com', 1),
(67, 'Georgianna', 'Cowle', 'gcowle1u', 'gcowle1u@theglobeandmail.com', 4),
(68, 'Fremont', 'Savege', 'fsavege1v', 'fsavege1v@timesonline.co.uk', 1),
(69, 'Etan', 'Tidbury', 'etidbury1w', 'etidbury1w@abc.net.au', 3),
(70, 'Leoline', 'Stains', 'lstains1x', 'lstains1x@boston.com', 4),
(71, 'Charity', 'Dine-Hart', 'cdinehart1y', 'cdinehart1y@ftc.gov', 1),
(72, 'Maximilianus', 'Satyford', 'msatyford1z', 'msatyford1z@nasa.gov', 3),
(73, 'Tomlin', 'Heintze', 'theintze20', 'theintze20@bravesites.com', 1),
(74, 'Matilda', 'Keeney', 'mkeeney21', 'mkeeney21@ocn.ne.jp', 3),
(75, 'Kristel', 'Abramowitch', 'kabramowitch22', 'kabramowitch22@yandex.ru', 2),
(76, 'Evelyn', 'Veldens', 'eveldens23', 'eveldens23@opera.com', 1),
(77, 'Barty', 'O\'Doogan', 'bodoogan24', 'bodoogan24@mayoclinic.com', 1),
(78, 'Mitchel', 'O\'Rudden', 'morudden25', 'morudden25@networkadvertising.org', 1),
(79, 'Heath', 'Byrkmyr', 'hbyrkmyr26', 'hbyrkmyr26@dell.com', 1),
(80, 'Sigismundo', 'Bonifazio', 'sbonifazio27', 'sbonifazio27@nih.gov', 4),
(81, 'Hartley', 'Robak', 'hrobak28', 'hrobak28@uiuc.edu', 3),
(82, 'Antony', 'Richarson', 'aricharson29', 'aricharson29@51.la', 2),
(83, 'Gawen', 'Janse', 'gjanse2a', 'gjanse2a@nasa.gov', 4),
(84, 'Jesus', 'Pritchard', 'jpritchard2b', 'jpritchard2b@webeden.co.uk', 3),
(85, 'Roxana', 'Burnhill', 'rburnhill2c', 'rburnhill2c@msn.com', 3),
(86, 'Carmelina', 'Lamperd', 'clamperd2d', 'clamperd2d@biblegateway.com', 2),
(87, 'Rosene', 'Ffoulkes', 'rffoulkes2e', 'rffoulkes2e@marketwatch.com', 4),
(88, 'Benji', 'Dever', 'bdever2f', 'bdever2f@businessweek.com', 1),
(89, 'Bonny', 'Hambrick', 'bhambrick2g', 'bhambrick2g@printfriendly.com', 3),
(90, 'Blondell', 'Ishchenko', 'bishchenko2h', 'bishchenko2h@elegantthemes.com', 1),
(91, 'Philip', 'Greenstock', 'pgreenstock2i', 'pgreenstock2i@msu.edu', 4),
(92, 'Ludvig', 'Dulany', 'ldulany2j', 'ldulany2j@va.gov', 4),
(93, 'Torin', 'Mitchel', 'tmitchel2k', 'tmitchel2k@npr.org', 1),
(94, 'Merla', 'Hills', 'mhills2l', 'mhills2l@phpbb.com', 3),
(95, 'Dante', 'Lamke', 'dlamke2m', 'dlamke2m@google.co.jp', 1),
(96, 'Carolin', 'St Pierre', 'cstpierre2n', 'cstpierre2n@comcast.net', 2),
(97, 'Marge', 'Ruberry', 'mruberry2o', 'mruberry2o@addtoany.com', 3),
(98, 'Ivonne', 'Nairns', 'inairns2p', 'inairns2p@slate.com', 1),
(99, 'Anderson', 'Tasama', 'LordTasama', 'tasamaperez2005@gmail.com', 3),
(109, 'Héctor', 'Fabio', 'Enano', 'hector', 4),
(110, 'Héctor', 'Fabio', 'Enano', 'hector@gmail.com', 4),
(111, 'Alejo', 'Tobón', 'El Gei', 'alejo@gmail.com', 3),
(114, 'Ronnica', 'Mattosoff', '', 'rmattosoff0@blogs.com', 1),
(115, 'Ronnica Ronnica Ronnica Ronnica Ronnica Ronnica Ro', 'Ronnica Ronnica Ronnica Ronnica Ronnica Ronnica Ro', 'Ronnica', 'rmattosoff0@blogs.com', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `description` varchar(150) NOT NULL,
  `date` date NOT NULL,
  `note` varchar(500) NOT NULL,
  `id_citizen` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `history`
--

INSERT INTO `history` (`id`, `description`, `date`, `note`, `id_citizen`) VALUES
(2, 'Escándalo en vía pública', '2024-02-13', 'Según testigos, el sujeto perdió la cordura y atacó a varias personas.', 7),
(4, 'Insultar a un agente', '2024-02-13', 'N/A', 15),
(5, 'Fumar en lugar no permitido', '2024-01-28', 'N/A', 34),
(9, 'Alboroto', '2024-02-06', 'N/A', 75),
(10, 'Alboroto', '2024-02-05', 'N/A', 75),
(12, 'Fumar en lugar no permitido', '2024-02-06', 'N/A', 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `rank` int(1) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(200) NOT NULL,
  `photo` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `name`, `lastname`, `rank`, `email`, `password`, `photo`) VALUES
(6, 'Anderson', 'Tasama', 1, 'tasamaperez2005@gmail.com', '12345', ''),
(7, 'Jhon', 'Pérez', 1, 'tasama@gmail.com', '01cfcd4f6b8770febfb40cb906715822', ''),
(12, 'Alejo', 'Tobón', 5, 'alejo@gmail.com', '01cfcd4f6b8770febfb40cb906715822', ''),
(16, 'Narvaez', 'López', 4, 'narva@gmail.com', 'f0efb5f6cb4ce54821a9c5c6e1dff052', ''),
(17, 'Anderson', 'Tobón', 1, 'alejo@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citizen`
--
ALTER TABLE `citizen`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_citizen` (`id_citizen`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citizen`
--
ALTER TABLE `citizen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT de la tabla `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`id_citizen`) REFERENCES `citizen` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
