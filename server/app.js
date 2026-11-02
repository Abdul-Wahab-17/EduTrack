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

var authRouter = require('./routes/auth');
var dataRouter = require(`./routes/data`);
var analyticsRouter = require('./routes/analytics');
var courseRouter = require(`./routes/courses`);
var contentRouter = require(`./routes/content`);

var app = express();


app.use(express.static(path.join(__dirname, 'public')));
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET must be set in production');
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
  resave: false ,
  saveUninitialized: false,
  store: new MySQLStore({}, db)
}));
app.use(passport.authenticate('session'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));


app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user || null;
  next();
})
app.options('*', cors({ origin: CLIENT_ORIGIN, credentials: true }));


app.use('/auth', authRouter);
app.use(`/data` , dataRouter);
app.use('/analytics', analyticsRouter);
app.use(`/courses` , courseRouter);
app.use(`/content` , contentRouter);

app.use(function(req, res, next) {
  next(createError(404, 'Page Not Found'));
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json( {message: err.message});
});

module.exports = app;
