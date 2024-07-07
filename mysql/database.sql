CREATE DATABASE inventario;
USE inventario;

CREATE TABLE producto (
	id int AUTO_INCREMENT PRIMARY KEY,
	sku VARCHAR(30) NOT NULL,
	nombre varchar(100) not null,
	descripcion varchar(200),
	precio DECIMAL(16,2) NOT NULL,
	cantidad INT NOT NULL
);

CREATE TABLE ticket (
	id int AUTO_INCREMENT PRIMARY KEY,
	fecha DATETIME not null,
	folio varchar(30) not null,
	total DECIMAL(16,3) NOT NULL
);

CREATE TABLE ticket_detalle (
	id int AUTO_INCREMENT PRIMARY KEY,
	ticket_id int not null,
	producto_id int not null,
	precio DECIMAL(16,2) not null,
	cantidad int NOT NULL,
	total DECIMAL(16,2) not null,
	CONSTRAINT FOREIGN KEY(producto_id) REFERENCES producto(id),
	CONSTRAINT FOREIGN KEY(ticket_id) REFERENCES ticket(id)
);



