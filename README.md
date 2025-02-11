# Refacciones
Invetario de refacciones.

### REQUERIDO
* INSTALAR [NODE JS](https://nodejs.org/en/download/package-manager) 

* INSTALAR [XAMPP](https://www.apachefriends.org/es/download.html)

# Instalacion de la APP
## PASO 1: 
* Ejecutar el archivo database.sql

## PASO 2 
* Executar el comando:
```shell
    npm update
```
Este ultimo ya se encarga de instalar todas las librerias necesarias para correr el proyecto.

## PASO 3
* Iniciar APP
```shell
    npm start
```
## Documentacion

## Creacion de proyecto en node.js
Pasos para crear un proyecto en node.js

1. Inicio del proyecto en node.
2. Instalacion de la paqueteria express.
3. Instalacion de express-generator.
4. Instalacion de paqueteria para leer cookies.
5. Instalacion de morgan.
6. Instalacion de bootstrap npm.
7. Instalacion de mysql.
8. Instalacion de libreria moment para el manejo de fechas



#### Instalacion del proyecto desde cero.

```shell
npm init
npm install express
npm install express-generator -g
npm install cookie-parser
npm install morgan
npm install bootstrap@5.3.3
npm install mysql
npm install moment
//Files
npm install express-fileupload
npm install node-fetch@^2.6.6
npm install form-data
```

La libreria express sirve para trabajar con plantillas html, css, etc. en nuestro proyecto.

#### Comando para generar la estructura del proyecto.
```shell
express --view=ejs
```

## Referencias
* [NODE.js](https://nodejs.org/en)
* [EXPRESS JS](https://expressjs.com/es/)
* [bootstrap](https://getbootstrap.com)
* [MySQl](https://www.mysql.com)
* [npm > mysql](https://www.npmjs.com/package/mysql)
* [uploadFiles](https://medium.com/@ionx/how-to-handle-file-uploads-with-node-js-and-express-a20c48d0b55d)
* [Save Files Node JS](https://ed.team/blog/como-subir-archivos-al-servidor-con-nodejs)