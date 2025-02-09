const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventario'
});

try{
  connection.connect(function(err){
        if (err){
            console.log("Error de conexion a la base de datos");
        }
        else{
            console.log("Conexion establecida");
        }
    });
}
catch{connection.end();}

module.exports = connection;