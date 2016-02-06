'use strict';

var bluebird = require('bluebird');
var config = require('./config');
var fs = bluebird.promisifyAll(require('fs-extra'));
var rimraf = bluebird.promisify(require('rimraf'));
var slug = require('slug');
var marked = require('marked');

// Establish DB connection
var db = require('./db');

// Generate stuff
//  - Jade
//  - SASS (weird syntax, can't be promisified automagically)
var sass = bluebird.promisifyAll(require('node-sass'));
var jade = bluebird.promisifyAll(require('jade'));

var sidebarArticles = db.getRecent(4);

function generate() {
  return rimraf('./results').then(function() {
    return fs.mkdirAsync('./results');
  }).then(function() {
    return bluebird.all([
      fs.mkdirAsync('./results/css'),
      fs.mkdirAsync('./results/articles'),
      fs.mkdirAsync('./results/images'),
      fs.mkdirAsync('./results/talks')
    ]);
  }).then(function() {
    let publishedArticles = db.getPublishedArticles();

    return bluebird.all([
      sass.renderAsync({
        file: './sass/main.sass'
      }).then(function (results) {
        return fs.writeFileAsync('./results/css/main.css', results.css)
      }),
      bluebird.map(publishedArticles, function(article, idx) {
        article.slug = slug(article.title);
        article.html = marked(article.body);
        return jade.renderFileAsync('./views/article.jade', {
          author: config.author,
          blogName: config.blogName,
          article: article,
          recentArticles: sidebarArticles,
          next: publishedArticles[idx + 1],
          past: publishedArticles[idx - 1],
          pretty: true
        }).then(function(html) {
          console.log('rendered', article.title);
          return fs.writeFileAsync('./results/articles/' + article.slug + '.html', html);
        });
      }),
      jade.renderFileAsync('./views/index.jade', {
        author: config.author,
        blogName: config.blogName,
        articles: db.getRecent().map(function(article) {
          article.slug = slug(article.title);
          article.html = marked(article.body);
          return article;
        }),
        recentArticles: sidebarArticles,
        pretty: true
      }).then(function(html) {
        return fs.writeFileAsync('./results/index.html', html);
      }),
      jade.renderFileAsync('./views/contact.jade', {
        author: config.author,
        blogName: config.blogName,
        recentArticles: sidebarArticles,
        pretty: true
      }).then(function(html) {
        return fs.writeFileAsync('./results/contact.html', html);
      }),
      jade.renderFileAsync('./views/talks.jade', {
        author: config.author,
        blogName: config.blogName,
        recentArticles: sidebarArticles,
        pretty: true
      }).then(function(html) {
        return fs.writeFileAsync('./results/talks/index.html', html);
      }),
      fs.copyAsync('./public/images', './results/images'),
      fs.copyAsync('./public/talks', './results/talks')
    ]);
  })
  .tap(function () {
    console.log('Site generation completed');
  });
}

if(require.main === module) {
  // Called from the command line
  generate()
  .catch(function (err) {
    console.log('Error during generation:', err);
  });
} else {
  // Required from elsewhere
  module.exports = generate;
}
