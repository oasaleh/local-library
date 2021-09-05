const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// Import routes for "catalog" area of site
const catalogRouter = require('./routes/catalog');

const compression = require('compression');
const helmet = require('helmet');

const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');

const mongoDB =
  'mongodb://omarsaleh92:UlEdKHrrJlDVsL9C@cluster0-shard-00-00.wggui.mongodb.net:27017,cluster0-shard-00-01.wggui.mongodb.net:27017,cluster0-shard-00-02.wggui.mongodb.net:27017/local_library?ssl=true&replicaSet=atlas-igbpl6-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression()); // Compress all routes

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
// Add catalog routes to middleware chain.
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
