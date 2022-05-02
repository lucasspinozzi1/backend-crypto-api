CREATE DATABASE cryptoDb;
CREATE USER 'dbuser'@'%' IDENTIFIED WITH mysql_native_password BY 'dbpass';
GRANT ALL PRIVILEGES ON cryptoDb. * TO 'dbuser'@'%';
FLUSH PRIVILEGES;