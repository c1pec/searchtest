var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');

var authRouter = require('./routes/auth');
var mainRouter = require('./routes/main');
var displayRouter = require('./routes/display');
var manageRouter = require('./routes/manage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '5ecre7',
  resave: false,
  saveUninitialized: true
 }));

app.use('/', authRouter);
app.use('/auth', authRouter);
app.use('/main', mainRouter);
app.use('/display', displayRouter);
app.use('/manage', manageRouter);

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
