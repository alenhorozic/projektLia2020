/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP DATABASE IF EXISTS `bank`;
CREATE DATABASE IF NOT EXISTS `bank` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `bank`;

DROP TABLE IF EXISTS `accaunt`;
CREATE TABLE IF NOT EXISTS `accaunt` (
  `accaunt_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `crated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `accaunt_number` int(10) unsigned NOT NULL,
  `is_activ` tinyint(1) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `accaunt_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT 'AccauntName',
  PRIMARY KEY (`accaunt_id`),
  UNIQUE KEY `uq_accaunt_number_accaunt` (`accaunt_number`) USING BTREE,
  KEY `fk_accaunt_usr_id` (`user_id`),
  CONSTRAINT `fk_accaunt_usr_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DELETE FROM `accaunt`;
/*!40000 ALTER TABLE `accaunt` DISABLE KEYS */;
INSERT INTO `accaunt` (`accaunt_id`, `crated_at`, `accaunt_number`, `is_activ`, `user_id`, `accaunt_name`) VALUES
	(1, '2020-05-25 18:39:16', 111111111, 1, 1, 'transaktion Accaunt'),
	(5, '2020-06-07 23:12:34', 222222222, 1, 9, 'AccauntName'),
	(6, '2020-06-07 23:18:02', 123456789, 1, 8, 'Transaktion Accaunt'),
	(8, '2020-06-08 00:53:12', 555555555, 1, 8, 'Seawing Accaunt');
/*!40000 ALTER TABLE `accaunt` ENABLE KEYS */;

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `email`) VALUES
	(10, 'admin', 'C7AD44CBAD762A5DA0A452F9E854FDC1E0E7A52A38015F23F3EAB1D80B931DD472634DFAC71CD34EBC35D16AB7FB8A90C81F975113D6C7538DC69DD8DE9077EC', 'adminc@hotmail.com'),
	(11, 'testadmin', 'A48826003E3E161B92538C432A7B33433FAC2D0FE262C9FDDAB42B1A71451747E45167AA0D08012407B9A6842D47A074FACC1BA56E8954ED245951C39F07302A', 'testadmin@hotmail.com');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

DROP TABLE IF EXISTS `comming_transaktion`;
CREATE TABLE IF NOT EXISTS `comming_transaktion` (
  `comming_transaktion_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `accaunt_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `amount` int(10) unsigned NOT NULL DEFAULT 0,
  `transaktion_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `transaktion_to_accaunt_number` int(10) unsigned NOT NULL,
  `status` enum('weiting','peyd','error') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'weiting',
  PRIMARY KEY (`comming_transaktion_id`),
  KEY `fk_comming_transaktion_accaunt_id` (`accaunt_id`),
  CONSTRAINT `fk_comming_transaktion_accaunt_id` FOREIGN KEY (`accaunt_id`) REFERENCES `accaunt` (`accaunt_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DELETE FROM `comming_transaktion`;
/*!40000 ALTER TABLE `comming_transaktion` DISABLE KEYS */;
INSERT INTO `comming_transaktion` (`comming_transaktion_id`, `accaunt_id`, `created_at`, `amount`, `transaktion_at`, `transaktion_to_accaunt_number`, `status`) VALUES
	(1, 1, '2020-05-26 22:02:27', 100, '2020-10-15 15:15:15', 222222111, 'weiting');
/*!40000 ALTER TABLE `comming_transaktion` ENABLE KEYS */;

DROP PROCEDURE IF EXISTS `deposit`;
DELIMITER //
CREATE PROCEDURE `deposit`(
	IN `accaunt_number` VARCHAR(10),
	IN `amount` DECIMAL(10,2),
	OUT `error` TINYINT(1)
)
BEGIN
  DECLARE accaunt_id INT(10);
	IF amount > 0 THEN
	 SET accaunt_id = get_active_accaunt_id(accaunt_number);
	 -- same as    get_active_acaunt_id(SELECT accaunt.accaunt_id FROM accaunt WHERE accaunt.accaunt_number = accaunt_number AND accaunt.is_activ = 1);
		IF accaunt_id IS NOT NULL THEN
       INSERT INTO transaktion (transaktion_type_id, accaunt_id, amount) VALUES (1, accaunt_id, amount);
		    SET error = 0;
		ELSE
		    SET error = 2;
		END IF;	
	ELSE
    SET error = 1;
	END IF;
END//
DELIMITER ;

DROP FUNCTION IF EXISTS `get_active_accaunt_id`;
DELIMITER //
CREATE FUNCTION `get_active_accaunt_id`(accaunt_number INT(10)) RETURNS int(10)
BEGIN
RETURN (SELECT accaunt.accaunt_id FROM accaunt WHERE accaunt.accaunt_number = accaunt_number AND accaunt.is_activ = 1);
END//
DELIMITER ;

DROP FUNCTION IF EXISTS `get_transaktion_sum`;
DELIMITER //
CREATE FUNCTION `get_transaktion_sum`(transaktion_type_id INT(10), accaunt_id INT(10)) RETURNS decimal(10,2)
BEGIN 
  RETURN (
	 SELECT SUM(transaktion.amount)
	 FROM transaktion
	 WHERE transaktion.transaktion_type_id = transaktion_type_id
	 AND transaktion.accaunt_id = accaunt_id
	 );
	 END//
DELIMITER ;

DROP FUNCTION IF EXISTS `saldo`;
DELIMITER //
CREATE FUNCTION `saldo`(accaunt_number INT(10)) RETURNS decimal(10,2)
BEGIN
 DECLARE accaunt_id INT(10);
 DECLARE sum_deposit DECIMAL(10,2);
 DECLARE sum_withdraw DECIMAL(10,2);
 
 SET accaunt_id = get_active_accaunt_id(accaunt_number);
 
 IF accaunt_id IS NOT NULL THEN
    SET sum_deposit = get_transaktion_sum(1, accaunt_id);
		   IF sum_deposit IS NULL THEN
		   RETURN 0;
		   END IF;
		SET sum_withdraw = get_transaktion_sum(2, accaunt_id);
 
  IF sum_withdraw IS NOT NULL THEN
     RETURN sum_deposit - sum_withdraw;
	ELSE
		RETURN sum_deposit;
	END IF;
 
 ELSE 
 RETURN NULL;
 END IF;

END//
DELIMITER ;

DROP TABLE IF EXISTS `transaktion`;
CREATE TABLE IF NOT EXISTS `transaktion` (
  `transaktion_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `transaktion_type_id` int(10) unsigned NOT NULL,
  `accaunt_id` int(10) unsigned NOT NULL,
  `amount` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`transaktion_id`),
  KEY `fk_transaktion_transaktion_transaktion_type_id` (`transaktion_type_id`),
  KEY `fk_transaktion_accaunt_id` (`accaunt_id`),
  CONSTRAINT `fk_transaktion_accaunt_id` FOREIGN KEY (`accaunt_id`) REFERENCES `accaunt` (`accaunt_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_transaktion_transaktion_transaktion_type_id` FOREIGN KEY (`transaktion_type_id`) REFERENCES `transaktion_type` (`transaktion_type_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DELETE FROM `transaktion`;
/*!40000 ALTER TABLE `transaktion` DISABLE KEYS */;
INSERT INTO `transaktion` (`transaktion_id`, `created_at`, `transaktion_type_id`, `accaunt_id`, `amount`) VALUES
	(1, '2020-05-25 19:04:04', 1, 1, 150.00),
	(2, '2020-05-27 16:41:10', 1, 1, 200.00),
	(3, '2020-05-27 16:41:13', 1, 1, 200.00),
	(4, '2020-05-27 16:47:12', 1, 1, 20.50),
	(5, '2020-05-27 19:19:18', 1, 1, 10.50),
	(6, '2020-05-31 17:15:58', 1, 1, 15.50),
	(18, '2020-06-02 11:11:40', 1, 1, 25.50),
	(19, '2020-06-03 12:05:33', 1, 1, 3000.00);
/*!40000 ALTER TABLE `transaktion` ENABLE KEYS */;

DROP TABLE IF EXISTS `transaktion_type`;
CREATE TABLE IF NOT EXISTS `transaktion_type` (
  `transaktion_type_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`transaktion_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DELETE FROM `transaktion_type`;
/*!40000 ALTER TABLE `transaktion_type` DISABLE KEYS */;
INSERT INTO `transaktion_type` (`transaktion_type_id`, `name`) VALUES
	(1, 'Deposit'),
	(2, 'Withdraw');
/*!40000 ALTER TABLE `transaktion_type` ENABLE KEYS */;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `forname` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `surname` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `phone_number` varchar(24) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `email`, `password_hash`, `forname`, `surname`, `phone_number`) VALUES
	(1, 'Testuser@gmail.com', '598E979235EC376FE41396C105A3C30A97250BA08F44F8B1B361C7A7441A99D1D953FD4994283CA11028DAFE77D66758477299D20814EDC43381DCD1A59FF494', 'test', 'test', '070777777777'),
	(8, 'test@gmail.com', 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D4940E0DB27AC185F8A0E1D5F84F88BC887FD67B143732C304CC5FA9AD8E6F57F50028A8FF', 'test', 'test', '010111111'),
	(9, 'nyusertest@hotmail.com', '3FCC1843582175FBC2FC6051D4976A2E7D995FBD38F2A1B33B0F6218CA3760FFD7560C2BF7E0B825F80C1CF19FF33A88BFC4053E2594328D0360E7AE95195B70', 'nyusertest', 'nyusertest', '080888888');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

DROP PROCEDURE IF EXISTS `withdraw`;
DELIMITER //
CREATE PROCEDURE `withdraw`(IN accaunt_number VARCHAR(10), IN amount DECIMAL(10,2), OUT error TINYINT(1))
BEGIN
DECLARE accaunt_id INT(10);

 IF amount > 0 AND saldo(accaunt_number) > amount OR saldo(accaunt_number) = amount THEN
   SET accaunt_id = get_active_accaunt_id(accaunt_number);
  IF accaunt_id IS NOT NULL THEN
      INSERT INTO transaktion (transaktion_type_id, accaunt_id, amount) VALUES (2, accaunt_id, amount);
			SET error = 0;
  ELSE
	   SET error = 2; 
	END IF;	 
ELSE
  SET error = 1;
END IF;
END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
