'use strict';

/**
 * article schema:
 *   id: int
 *   title: string
 *   body: string
 *   published: bool
 */

var data = require('./data.json');

var fs = require('fs');

var save = function () {
  fs.writeFile(__dirname + '/data.json', JSON.stringify(data), function(err) {
    if (err) {
      console.log(err);
    }
  });
};

var isPub = function (article) {
  return article.published;
};

module.exports = {
  getArticle: function (id) {
    return data.articles[id];
  },
  getAllArticles: function () {
    return data.articles.filter(isPub);
  },
  getFrontpage: function () {
    return data.articles.filter(isPub).slice(-10);
  },
  saveArticle: function(patch) {
    data.articles[patch.id].title = patch.title;
    data.articles[patch.id].body = patch.body;
    save();
  },
  createArticle: function () {
    var id = data.articles.push({}) - 1;
    // Dumbest line in the whole project
    data.articles[id].id = id;
    save();
    return id;
  }
};