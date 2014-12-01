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

module.exports = router;
