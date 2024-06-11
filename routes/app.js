var express = require('express');
var router = express.Router();
var mysql = require('../mysql/dbconection');


/* GET home page. */
router.get('/', function(req, res, next) {
    // mysql.connect(function(err){
    //     if (err){
    //         console.log("Error de conexion a la base de datos");
    //     }
    //     else{
    //         console.log("Conexion establecida");
    //     }
    // });

    // mysql.query('SELECT * FROM refaccion;', (err, rows, fields) => {
    //     console.log(rows);
    // })
    // mysql.end();
    res.render('app');
});

module.exports = router;
  