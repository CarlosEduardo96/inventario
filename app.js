var createError = require('http-errors');
var express = require('express');
//const bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const moment = require("moment");


//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var appRouter = require('./routes/app');
var productoRouter = require('./routes/producto');
var ticketRouter = require('./routes/ticket');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Configuracion servicio http
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//bootstrap setup
app.use("/css",express.static("./node_modules/bootstrap/dist/css"));
app.use("/js",express.static("./node_modules/bootstrap/dist/js"));
app.use("/",express.static("./node_modules/bootstrap/dist/"));

// moment
app.use((req, res, next)=>{
  res.locals.moment = moment;
  next(); 
});

// scripts setup
app.use("/static/js", express.static("./public/javascripts"));
app.use("/imagen", express.static("./temp"));


//app start
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

//routes
//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/', appRouter);
app.use('/', productoRouter);
app.use('/', ticketRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
