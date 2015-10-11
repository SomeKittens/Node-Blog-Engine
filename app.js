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

var pages = require('./routes/pages')
  , posts = require('./routes/posts');

var config = require('./config');

var app = express();

// view engine setup
app.locals.author = config.author;
app.locals.blogName = config.blogName;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Public contains the JS, etc for the edit panel
 * /lib/*.js
 */
app.use(express.static(path.join(__dirname, 'public')));
/**
 * Results is the compiled app
 * /
 * /articles/*.html
 */
app.use(express.static(path.join(__dirname, 'results')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// TODO: remove Redis dep
// https://www.npmjs.com/package/session-file-store
app.use(session({
  store: new RedisStore(process.env.REDIS_URL),
  secret: process.env.SESSION_SECRET
}));
app.use(flash());

app.use('/', pages);
app.use('/posts', posts);

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
