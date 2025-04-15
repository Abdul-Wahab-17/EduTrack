var createError = require('http-errors');
var express = require('express');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var db = require('./db');
var cors = require('cors');

const MySQLStore = require('express-mysql-session')(session);

var { router: authRouter } = require('./routes/auth');

var app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mySecretKey',
  resave: false ,
  saveUninitialized: false,
  store: new MySQLStore({} , db)
}));
app.use(passport.authenticate('session'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true 
}));

app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user || null;
  next();
})

app.use('/auth', authRouter);

app.use(function(req, res, next) {
  next(createError(404, 'Page Not Found')); 
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json( {message: err.message});
});

module.exports = app;
