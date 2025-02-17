var express = require('express');
var router = express.Router();
var mysql = require('../mysql/dbconection');

router.get('/tickets', function(req, res, next){
    mysql.query('SELECT * FROM ticket;', (err, rows, fields) => {
        res.render('lista_ticket',{lst_tickets: rows});      
    });
});

router.post('/ticket/search', function(req, res, next){
    var query ='SELECT * FROM ticket';
    if(req.body.search){
        query = `SELECT * FROM ticket WHERE folio LIKE '%${req.body.search}%';`
    }
    mysql.query(query, (err, rows, fields) => {
        res.render('lista_ticket',{lst_tickets: rows});      
    });
});

router.post('/ticket/product/search', function(req, res, next){
    var query ="SELECT * FROM producto;";
    if(req.body.search){
        query= `SELECT * FROM producto WHERE (sku LIKE '%${req.body.search}%' OR nombre LIKE '%${req.body.search}%')`;
    }

    var code=200;
    var mensaje='success';
    console.log(query);
    mysql.query(query, (err, rows, fields) => {
        //console.log(rows);
        res.send(200,{code: code,mensaje:mensaje,lst_productos: rows});      
    });    
});

router.get('/form/ticket', function(req, res, next){
    var query = `
    WITH imagen AS (
        SELECT 
            uuid
            , producto_id
            , activo
        FROM producto_imagen 
    )
    SELECT 
        *
        , (
            SELECT uuid FROM imagen i WHERE i.producto_id = p.id LIMIT 1
        ) as imagen_activa
    FROM producto p;`;
    mysql.query(query, (err, rows, fields) => {
        res.render('form_tickets',{lst_productos: rows, ticket: null});      
    });
});

router.get('/form/ticket/:id', function (req, res, next){
    var vew_ticket_detalle_query =`SELECT * FROM view_ticket_detalle where t_id = ${req.params.id}`;

    mysql.query(vew_ticket_detalle_query,(err, rows, fields) => {
        if(err) throw err;
        res.render('view_ticket',{ticket_detalle: rows, ticket: rows[0]});
    });
});

router.post('/form/ticket', function(req, res, next){
    
    var data = req.body;
    var ticket_detalle = JSON.parse(req.body.ticket_detalle);

    if (!ticket_detalle || ticket_detalle.length<1){
        var query = "SELECT * FROM producto;";
        return mysql.query(query, (err, rows, fields) => {
            res.render('form_tickets',{lst_productos: rows, ticket: null});   
        });
    }
    mysql.beginTransaction(async function(err){
        if (err) {
            return await mysql.rollback(function() {
                throw err;
            });
        }
        var insert_ticket=`INSERT INTO ticket(fecha, folio, total) VALUES (NOW(), 'TICKET'+DATE_FORMAT(NOW(), '%Y%m%d%s'), ${req.body.total})`;
        
        var insert_ticket_detalle = "INSERT INTO ticket_detalle(ticket_id,producto_id,precio,cantidad,total) VALUES ";

        mysql.query(insert_ticket, function(err, rows, fields){            
            if(ticket_detalle && !err){
                for(const item of ticket_detalle){
                    mysql.query(insert_ticket_detalle +`(${rows.insertId}, ${item.producto_id}, ${item.precio}, ${item.cantidad}, ${item.total})`);
                }           
            }
            else{
                mysql.rollback();
                throw "Error al guardar los datos"
            }

            mysql.commit();
            mysql.query('SELECT * FROM ticket;', (err, rows, fields) => {
                res.render('lista_ticket',{lst_tickets: rows});      
            });
        });       
    });
});

router.post('/form/ticket/add-car', function (req, res, next){
    var lista = [];
    if(req.body.ticket_detalle){
        for( const element of JSON.parse(req.body.ticket_detalle)){
            lista.push(element);
        }
    }
    var mensaje="Success";
    var code=200;
    var query =`SELECT * FROM producto where id = ${req.body.id}`;
    mysql.query(query, (err, rows, fields) => {
        if(err) throw err;
         
        for(const element of rows){
            var detalle={
                id: 0
                , ticket_id:0
                , producto_id: element.id
                , descripcion:  element.nombre
                , precio: element.precio
                , cantidad: 1
                , total: element.precio
            }
            let index = lista.findIndex(function(item){
                return item.producto_id === detalle.producto_id;
            });

            if(index >=0){                
                lista[index].cantidad += detalle.cantidad;
                lista[index].total = lista[index].precio * lista[index].cantidad;
            }else{
                lista.push(detalle);
            }
            
            var total = 0;
            var cantidad=0;
            lista.forEach(function(element){
                total += element.total;
                cantidad += element.cantidad;
            });
            if(total>0){
                total = total.toFixed(2);
            }

        }
        return res.send(200,{code: code, mensaje: mensaje, lista: lista, total: total, cantidad: cantidad}); 
    });
});

module.exports = router;