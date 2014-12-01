var express = require('express');
var router = express.Router();

var db = require('nbe-' + require('../config').db.type);

router.get('/', function(req, res) {
  db.getAllArticles().then(function(articles) {
    return res.render('articles', {
      articles: articles
    });
  });
});

router.get('/edit/:id', function(req, res) {
  db.getArticle(req.params.id).then(function(article) {
    if (article) {
      return res.render('edit', {
        article: article
      });
    }
    return next();
  });
});

router.post('/', function(req, res) {
  db.createArticle().then(function(id) {
    return res.redirect('/posts/edit/' + id);
  });
});

router.patch('/:id', function(req, res) {
  db.saveArticle(req.body).then(function() {
    return res.send(204);
  });
});

module.exports = router;
