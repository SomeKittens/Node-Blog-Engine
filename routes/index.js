var express = require('express');
var router = express.Router();

var db = require('nbe-' + require('../config').db.type);

/* GET home page. */
router.get('/', function(req, res) {
  db.getFrontpage().then(function(articles) {
    return res.render('index', {
      articles: articles
    });
  });
});

router.get('/articles/:id', function(req, res) {
  db.getArticle(req.params.id).then(function(article) {
    return res.render('article', {
      article: article
    });
  });
});

module.exports = router;
