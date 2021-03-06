var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const flash = require('connect-flash');

const isDev = process.env.NODE_ENV !== 'production'

console.log('========>isDev: ', isDev);

// chạy trên môi trường dev - sưer dụng mongo local
if (isDev) {
  const connectDB = require('./tasks/db_local')
  const mongoose = require('mongoose')

  connectDB('tictoe').then(async uri => {
    console.log('======>uri: ', uri);

    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('=====>connectDB');
  })
} else {
  require('./tasks/connectDB')
}

require('./tasks/db_local')

var passportConfig = require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tablesRouter = require('./routes/tables');

var app = express();
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tables', tablesRouter);

passportConfig(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.stack);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
