/* eslint-disable no-console */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// Import routes for "catalog" area of site
const catalogRouter = require('./routes/catalog');

const app = express();

// Set up mongoose connection

// const dev_db_url =
const mongoDB = process.env.MongoDB_URI;
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

// const appReducer = (flavorsArr = [], actionToDo) => {
//   if (actionToDo.type === 'deleteFlavor') {
//     return flavorsArr.filter(
//       (iceCream) => iceCream.flavor !== actionToDo.flavor,
//     );
//   }
//   return flavorsArr;
// };
// const iceCreams = [
//   { flavor: 'Chocolate', count: 36 },
//   { flavor: 'Vanilla', count: 210 },
// ];
// const action = { type: 'deleteFlavor', flavor: 'Chocolate' };
// const result = appReducer(iceCreams, action);

// console.log(appReducer(iceCreams, action).length); // 2
// console.log(result.length); // 2
// console.log(result); // [{ flavor: 'Vanilla', count: 210 }];

module.exports = app;
