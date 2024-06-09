CREATE DATABASE inventario;
USE inventario;

CREATE TABLE producto (
	id int AUTO_INCREMENT PRIMARY KEY,
	nombre varchar(100) not null,
	descripcion varchar(200),
	precio DOUBLE NOT NULL,
	cantidad INT NOT NULL
);

CREATE TABLE ticket (
	id int AUTO_INCREMENT PRIMARY KEY,
	fecha DATETIME not null,
	folio varchar(30),
	total DOUBLE NOT NULL
);

CREATE TABLE ticket_detalle (
	id int AUTO_INCREMENT PRIMARY KEY,
	ticket_id int not null,
	producto_id int not null,
	precio DOUBBLE not null,
	cantidad int NOT NULL,
	CONSTRAINT FOREIGN KEY(producto_id) REFERENCES producto(id),
	CONSTRAINT FOREIGN KEY(ticket_id) REFERENCES producto(id)
);



