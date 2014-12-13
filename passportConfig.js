var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , bluebird = require('bluebird')
  , bcrypt = bluebird.promisifyAll(require('bcrypt'));

var config = require('./config')
  , db = require('nbe-' + config.db.type);

passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
    db.getUserByName(username).then(function (user) {
      if (!user) {
        throw new Error('Incorrect username');
      }
      this.user = user;
      console.log(password, user.passwordhash);
      return bcrypt.compareAsync(password, user.passwordhash);
    })
    .then(function(correctPassword) {
      if (correctPassword) {
        return done(null, {
          username: username,
          id: this.user.id
        });
      }
      throw new Error('Incorrect password');
    })
    .catch(function(err) {
      done(null, false, { message: err.message });
    });
  }
));

passport.use('local-create', new LocalStrategy(
  function(username, password, done) {
  db.getUserByName(username)
  .then(function(result) {
    if (result) {
      throw new Error('User already exists');
    }
    // Automatically salted
    return bcrypt.hashAsync(password, 10);
  })
  .then(function(hash) {
    return db.createLocalUser(username, hash);
  })
  .then(function(id) {
    return done(null, {
      username: username,
      id: id
    });
  })
  .catch(function(err) {
    done(null, false, { message: err.message });
  });
}));

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.getUserById(id).then(function (user) {
    done(null, user);
  }, function(err) {
    done(err);
  });
});