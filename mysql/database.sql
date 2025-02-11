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


CREATE TABLE producto_imagen (
	id int AUTO_INCREMENT PRIMARY KEY,
	uuid VARCHAR(38) UNIQUE not null,
	producto_id int not null,
	activo BOOLEAN DEFAULT FALSE,
	CONSTRAINT FOREIGN KEY(producto_id) REFERENCES producto(id)
);

CREATE VIEW view_ticket_detalle AS 
SELECT 
	td.id as td_id
	, td.ticket_id as td_ticket_id
	, td.producto_id as td_producto_id
    , pp.sku as pp_sku
    , pp.nombre as pp_nombre
	, td.cantidad as td_cantidad
	, td.total as td_total
	, t.id as t_id
	, td.precio as td_precio
	, t.fecha as t_fecha
	, t.folio as t_folio
	, t.total as t_total
FROM ticket_detalle td 
INNER JOIN producto pp ON
	pp.id = td.producto_id
INNER JOIN ticket t ON
	t.id = td.ticket_id

