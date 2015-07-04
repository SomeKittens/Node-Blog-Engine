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
  if (req.body.publishState !== undefined) {
    try {
      db.publish(req.params.id, req.body.publishState);
    } catch (e) {
      return res.send(400, e.message);
    }
    return res.send(204);
  }
  db.saveArticle(req.body);
  return res.send(204);
});

module.exports = router;
