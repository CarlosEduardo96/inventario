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

router.get('/lista', function(req, res, next){
    mysql.query('SELECT * FROM producto;', (err, rows, fields) => {
        console.log(rows);
        res.render('lista',{lst_productos: rows});      
    });
});

router.get('/form/product/:id?',function(req, res, next){
    var producto= {
        id: 0
        , nombre:''
        , descripcion: ''
        , precio: 0
        , cantidad: 0
    }
    if (req.params.id){
        console.log('ID:', req.params.id);
        mysql.query(`SELECT * FROM producto WHERE id = ${req.params.id}`, (err, rows, fields) => {
            console.log(rows);
            producto.id = rows[0].id;
            producto.sku = rows[0].sku;
            producto.nombre = rows[0].nombre;
            producto.descripcion = rows[0].descripcion;
            producto.precio = rows[0].precio;
            producto.cantidad = rows[0].cantidad;
            res.render('form_product',{product: producto});      
        });

    }else{
        res.render('form_product', {product: producto});
    }
}).post('/form/product/:id?', function(req, res, next){
    console.log('ID:', req.params.id);
    console.log(req.body);
    var query = "";
    if(req.params.id){
        query = `UPDATE producto SET 
        sku= '${req.body.sku}'
        , nombre='${req.body.nombre}'
        , descripcion='${req.body.descripcion}'
        , precio =${req.body.precio}
        , cantidad = ${req.body.cantidad}
        WHERE id = ${req.body.id}`;
    }
    else{
        query = `INSERT INTO 
            producto(sku,nombre, descripcion, precio, cantidad)
            VALUES(
                '${req.body.sku}'
                , '${req.body.nombre}'
                , '${req.body.descripcion}'
                , ${req.body.precio}
                , ${req.body.cantidad}
            )
        `
    }
    mysql.query(query);

    mysql.query('SELECT * FROM producto;', (err, rows, fields) => {
        console.log(rows);
        res.render('lista',{lst_productos: rows});      
    });
});

  
module.exports = router;
  