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

router.get('/form/ticket', function(req, res, next){
    var query ="SELECT * FROM producto;";
    mysql.query(query, (err, rows, fields) => {
        res.render('form_tickets',{lst_productos: rows});      
    });
});

router.get('/form/ticket/:id', function(req, res, next){
    var ticket_query =`SELECT * FROM ticket where id=${req.params.id}`;
    var ticket_detalle_query =`SELECT * FROM ticket_detalle where ticket_id =${req.params.id}`;
    
    var ticket=null;
    var ticket_detalle=null;
    mysql.query(ticket_query, async function (err, rows, fields) {
        ticket = await rows;
    });

    mysql.query(ticket_detalle_query, async function (err, rows, fields) {
        ticket_detalle = await rows;      
    });

    res.render('view_ticket',{ticket: ticket, ticket_detalle: ticket_detalle});
});

router.post('/form/ticket', function(req, res, next){
    mysql.beginTransaction(async function(err){
        if (err) {
            return await mysql.rollback(function() {
              throw err;
            });
        }

        var ticket_detalle = JSON.parse(req.body.ticket_detalle);
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
        });       
    });


    mysql.query('SELECT * FROM ticket;', (err, rows, fields) => {
        res.render('lista_ticket',{lst_tickets: rows});      
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
            }else{
                lista.push(detalle);
            }
            
            var total = 0;
            var cantidad=0;
            lista.forEach(function(element){
                total += element.total * element.cantidad;
                cantidad += element.cantidad;
            });

        }
        return res.send(200,{code: code, mensaje: mensaje, lista: lista, total: total, cantidad: cantidad}); 
    });
});

module.exports = router;