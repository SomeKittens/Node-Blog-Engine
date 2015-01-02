var express = require('express')
  , router = express.Router();

var db = require('../db');

/* GET home page. */
router.get('/', function(req, res) {
  db.getFrontpage().then(function(articles) {
    return res.render('index', {
      articles: articles || {}
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

router.get('/contact', function(req, res) {
  return res.render('contact');
});

module.exports = router;
