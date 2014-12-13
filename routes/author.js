var express = require('express')
  , router = express.Router();

var reqIs = require('req-is');

// Ensure user is logged in
router.get('*', reqIs.user);

router.get('/edit', function(req, res) {
  res.render('edit');
});

module.exports = router;
