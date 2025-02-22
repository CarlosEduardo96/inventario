var express = require('express');
var fileUpload = require('express-fileupload');
var mysql = require('../mysql/dbconection');
var router = express.Router();
const contorller="/product";

router.use(fileUpload({
    // Configure file uploads with maximum file size 10MB
    limits: { fileSize: 10 * 1024 * 1024 },

    // Temporarily store uploaded files to disk, rather than buffering in memory
    useTempFiles : true,
    tempFileDir : '/temp/'
}));

router.get('/product', function(req, res, next){
    mysql.query('SELECT * FROM producto;', (err, rows, fields) => {
        res.render('lista',{lst_productos: rows});      
    });
});

router.post(contorller, function(req, res, next){
    var query ="SELECT * FROM producto;";
    if(req.body.search){
        query= `SELECT * FROM producto WHERE (sku LIKE '%${req.body.search}%' OR nombre LIKE '%${req.body.search}%')`;
    }
    //console.log(query);
    mysql.query(query, (err, rows, fields) => {
        //console.log(rows);
        res.render('lista',{lst_productos: rows});      
    });
});

router.get(contorller+'/form/:id?',function(req, res, next){
    var producto= {
        id: 0
        , nombre:''
        , descripcion: ''
        , precio: 0
        , cantidad: 0
        , image_active: ''
        , list_productos: []
    }
    if (req.params.id){
        //console.log('ID:', req.params.id);
        
        mysql.query(`SELECT * FROM producto WHERE id = ${req.params.id}`, (err, rows, fields) => {
                //console.log(rows);
            producto.id = rows[0].id;
            producto.sku = rows[0].sku;
            producto.nombre = rows[0].nombre;
            producto.descripcion = rows[0].descripcion;
            producto.precio = rows[0].precio;
            producto.cantidad = rows[0].cantidad;
            
            mysql.query(`SELECT * FROM producto_imagen WHERE producto_id = ${req.params.id}`, (err, rows, fields) => {
                producto.list_productos = rows;
                if(producto.list_productos.length>0){
                    for(const imagen of producto.list_productos){
                        
                        if(imagen.activo){
                            producto.image_active = imagen;
                            break;
                        }
                    }
                    producto.image_active = (producto && producto.image_active.uuid? producto.image_active.uuid : '');
                    res.render('form_product',{product: producto});
                }else{
                    res.render('form_product',{product: producto});
                }
            });
            
        });

    }else{
        res.render('form_product', {product: producto});
    }
});
router.put(contorller+'/form/save', function(req, res, next){
    // console.log('ID:', req.params.id);
    console.log(req);
    var query = "";
    if(req.body.id>0){
        query = `UPDATE producto SET 
        sku= '${req.body.sku}'
        , nombre='${req.body.nombre}'
        , descripcion='${req.body.descripcion}'
        , precio =${req.body.precio}
        , cantidad = ${req.body.cantidad}
        WHERE id = ${req.body.id}`;

        mysql.query(query);
        mysql.query(query, (err, rows, fields)=>{
            res.json({code:200,msg:"success",action:'update',data: req.body});
        });
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
        mysql.query(query, (err, rows, fields)=>{
            req.body.id = rows.insertId;
            res.json({code:200,msg:"success", action:'create', data: req.body});
        });
    }
});

router.post(contorller+'/delete', function(req, res, next){
    console.log(req.body.id);
    mysql.query(`DELETE FROM producto WHERE id = ${req.body.id}`);
    res.json({code:200,msg:"success",action:'delete',data: req.body.id});
});

router.post(contorller+'/form/imagen', function(req, res, next){    
    var imagen = req.files.image;
    if (!imagen || !imagen) {
        return res.json({code:422,msg:"No files were uploaded", action:'create', data: false});
    }
    if(!req.body.uuid || !req.body.product_id ){
        return res.json({code:422,msg:"Faltan parametros", action:'create', data: false});
    }

    var imagen_producto={
        id: 0
        , uuid: req.body.uuid
        , producto_id: req.body.product_id
        , activo: false
    };

    var sql_insert = `
        INSERT INTO producto_imagen(uuid, producto_id)
        VALUES('${req.body.uuid}', ${req.body.product_id})
    `;

    var sql_exists=`SELECT * FROM producto_imagen WHERE uuid='${req.body.uuid}'`;
    console.log(sql_exists);
    mysql.query(sql_exists, function(err_r, rows_r, fields_r){
        if (rows_r && rows_r.length > 0){
            res.json({code:200,msg:"la imagen ya existe",action:'send-image',data: false});
        }else{
            mysql.query(sql_insert, function(err, rows, fields){
                if(err) return res.json({code:200,msg:"Error al guardar la imagen",action:'send-image',data: err});
                imagen_producto.id = rows.insertId;
                imagen.mv("./temp/"+req.body.uuid+'.jpg', function(error){
                    if(error) return res.status(500).send({ message : error })
                });
                return res.json({code:200,msg:"success",action:'send-image',data: imagen_producto}); 
            });
        }
    });    
});

router.post(contorller+'/form/imagen/active', function(req, res, next){
    if(!req.body || !req.body.id || !req.body.producto_id || req.body.id <1 ||req.body.producto_id<1 ){
        return res.json({code:422,msg:"Faltan parametros", action:'active_imagen', data: false});
    }

    mysql.query(`UPDATE producto_imagen SET activo = false WHERE producto_id =  ${req.body.producto_id} `);
    mysql.query(`UPDATE producto_imagen SET activo = true WHERE id =  ${req.body.id} `);
    mysql.query(`select * from producto_imagen where id=${req.body.id}`, function(err, rows, fields){
        return res.json({code:200,msg:"success",action:'send-image',data: rows}); 
    });
});

router.post(contorller+'/form/imagen/delete', function(req, res, next){
    console.log("ENTRE QUI");
    if(!req.body || !req.body.id || req.body.id < 1 ){
        return res.json({code:422,msg:"Faltan parametros", action:'active_imagen', data: false});
    }
    
    mysql.query(`DELETE FROM producto_imagen WHERE id = ${req.body.id}`);
    return res.json({code:200,msg:"success",action:'delete-image',data: req.body.id });
});

module.exports = router;