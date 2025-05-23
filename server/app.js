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
var messageRouter = require(`./routes/messages`);
var courseRouter = require(`./routes/courses`);
var contentRouter = require(`./routes/content`);
var quizRouter = require(`./routes/quizzes`);
var assignmentRouter = require(`./routes/assignments`);
var analyticsRouter = require(`./routes/analytics`);

var app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mySecretKey',
  resave: false ,
  saveUninitialized: false,
  store: new MySQLStore({} , db)
}));
app.use(passport.authenticate('session'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));


app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user || null;
  next();
})
app.options('*', cors({ origin: 'http://localhost:3000', credentials: true }));


app.use('/auth', authRouter);
app.use(`/data` , dataRouter);
app.use('/api', messageRouter);
app.use(`/courses` , courseRouter);
app.use(`/content` , contentRouter);
app.use(`/quizzes` , quizRouter);
app.use(`/assignments` , assignmentRouter);
app.use(`/analytics` , analyticsRouter);

app.use(function(req, res, next) {
  next(createError(404, 'Page Not Found'));
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json( {message: err.message});
});

module.exports = app;
