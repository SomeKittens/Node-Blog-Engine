'use strict';

require('dotenv').load();

var express = require('express')
  , path = require('path')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)
  , flash = require('express-flash');

var routes = require('./routes/index')
  , author = require('./routes/author')
  , posts = require('./routes/posts')
  , login = require('./routes/login');

var config = require('./config');

var app = express();

var db = require('./db');

db.init(config.db.connString).catch(function() {
  console.log(arguments);
  console.error('Database not installed or improperly initalized');
  process.exit(1);
});

var passport = require('passport');

// view engine setup
app.locals.author = config.author;
app.locals.blogName = config.blogName;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  store: new RedisStore(process.env.REDIS_URL),
  secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);
app.use('/author', author);
app.use('/posts', posts);
app.use('/login', login);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
