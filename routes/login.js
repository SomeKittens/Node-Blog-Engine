var express = require('express')
  , router = express.Router()
  , passport = require('passport');

require('../passportConfig');

router.get('/', function(req, res) {
  return res.render('login');
});

var authConfig = {
  successRedirect: '/posts',
  failureRedirect: '/login',
  failureFlash: true
};

router.post('/', passport.authenticate('local-login', authConfig));

// Removing account creation for now
// router.post('/create', passport.authenticate('local-create', authConfig));

module.exports = router;
