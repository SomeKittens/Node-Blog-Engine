var express = require('express');
var router = express.Router();

// Ensure user is logged in
router.get('*', function(req, res, next) {
  if (req.user) {
    res.send(403);
  } else {
    next();
  }
});

router.get('/edit', function(req, res) {
  res.render('edit');
});

module.exports = router;
