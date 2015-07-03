var express = require('express')
  , db = require('../db')
  , router = express.Router();

// API for interacting with posts

router.route('/')
.get(function(req, res) {
  return res.json(db.getAllArticles());
})
.post(function(req, res) {
  var id = db.createArticle();
  return res.redirect('/edit/' + id);
});

router.route('/:id')
.get(function (req, res) {
  return res.json(db.getArticle(req.params.id));
})
.patch(function (req, res) {
  db.saveArticle(req.body);
  return res.send(204);
});

module.exports = router;
