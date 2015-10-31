var express = require('express')
  , db = require('../db')
  , router = express.Router()
  , generate = require('../generate');

// API for interacting with posts

router.route('/')
.get(function(req, res) {
  return res.json(db.getAllArticles());
})
.post(function(req, res, next) {
  var id = db.createArticle();
  generate()
  .then(function () {
    return res.redirect('/edit/' + id);
  })
  .catch(function (err) {
    next(err);
  });
});

router.route('/:id')
.get(function (req, res) {
  return res.json(db.getArticle(req.params.id));
})
.patch(function (req, res, next) {
  if (req.body.publishState !== undefined) {
    try {
      db.publish(req.params.id, req.body.publishState);
    } catch (e) {
      return res.send(400, e.message);
    }
    return res.send(204);
  }
  db.saveArticle(req.body);
  generate()
  .then(function () {
    return res.send(204);
  })
  .catch(function (err) {
    next(err);
  });
});

module.exports = router;
