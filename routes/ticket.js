var express = require('express');
var router = express.Router();
var mysql = require('../mysql/dbconection');

router.get('/tickets', function(req, res, next){
    mysql.query('SELECT * FROM ticket;', (err, rows, fields) => {
        res.render('lista_ticket',{lst_tickets: rows});      
    });
});

module.exports = router;