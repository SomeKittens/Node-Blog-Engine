var express = require('express')
  , marked = require('marked')
  , router = express.Router();

var reqIs = require('req-is');

var db = require('../db');

// Save user from themselves
marked.setOptions({
  sanitize: true
});

router.all('*', reqIs.user);

router.route('/')
.get(function(req, res) {
  db.getAllArticles().then(function(articles) {
    return res.render('articles', {
      articles: articles
    });
  });
})
.post(function(req, res) {
  db.createArticle().then(function(id) {
    return res.redirect('/posts/edit/' + id);
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

router.patch('/:id', function(req, res) {
  req.body.content = marked(req.body.content);
  db.saveArticle(req.body).then(function() {
    return res.send(204);
  });
});

module.exports = router;
