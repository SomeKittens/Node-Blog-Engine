var express = require('express');
var router = express.Router();

// Ensure user is logged in
router.get('*', function(req, res, next) {
  // FIXME this should be negated
  // Leaving it as-is for debugging until I add users
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
