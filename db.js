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
    return data.articles;
  },
  getPublishedArticles: function () {
    return data.articles.filter(isPub);
  },
  getRecent: function (numArticles) {
    return data.articles.filter(isPub).slice(-1 * (numArticles || 10)).reverse();
  },
  publish: function (id, publishState) {
    var article = data.articles[parseInt(id, 10)];
    if (!publishState) {
      return article.published = false;
    }
    // Special-case to check title/body
    if (!article.title) {
      throw new Error('Cannot publish article without title');
    }
    if (!article.body) {
      throw new Error('Cannot publish article without content');
    }
    article.published = true;
  },
  saveArticle: function(patch) {
    data.articles[patch.id].title = patch.title;
    data.articles[patch.id].body = patch.body;

    module.exports.publish(patch.id, patch.published);

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