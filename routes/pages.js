var express = require('express')
  , router = express.Router();

// Just renders pages

router.get('/edit', function (req, res) {
  return res.render('ui-view', {
    isLocal: true
  });
});

router.get('/edit/:id', function(req, res) {
  res.render('ui-view', {
    isLocal: true
  });
});

router.get('/templates/articleList', function (req, res) {
  res.render('templates/articles-tpl');
});
router.get('/templates/edit', function (req, res) {
  res.render('templates/edit-tpl');
});

module.exports = router;
