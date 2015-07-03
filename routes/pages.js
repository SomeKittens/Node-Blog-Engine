var express = require('express')
  , router = express.Router();

// Just renders pages

router.get('/edit', function (req, res) {
  return res.render('articles');
});

router.get('/edit/:id', function(req, res) {
  res.render('edit');
});

module.exports = router;
