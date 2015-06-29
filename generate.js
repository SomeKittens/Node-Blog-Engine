'use strict';

var bluebird = require('bluebird');
var config = require('./config');
var fs = bluebird.promisifyAll(require('fs-extra'));
var rimraf = bluebird.promisify(require('rimraf'));
var slug = require('slug');

// Establish DB connection
var db = require('./db');

db.init(config.db.connString).catch(function(err) {
  console.log(err);
  console.error('Database not installed or improperly initalized');
  process.exit(1);
});

// Generate stuff
//  - Jade
//  - SASS
var sass = require('node-sass');
var jade = bluebird.promisifyAll(require('jade'));

rimraf('./results').then(function() {
  return fs.mkdirAsync('./results');
}).then(function() {
  return bluebird.all([
    fs.mkdirAsync('./results/css'),
    fs.mkdirAsync('./results/articles'),
    fs.mkdirAsync('./results/images')
  ]);
}).then(function() {

  var sassPromise = new bluebird(function(resolve, reject) {
    sass.render({
      file: './sass/main.sass',
      success: function(results) {
        fs.writeFileAsync('./results/css/main.css', results.css)
        .then(resolve);
      },
      error: reject
    });
  });
  return bluebird.all([
    sassPromise,
    db.getAllArticles().then(function(articles) {
      if (articles) {
        bluebird.map(articles, function(article) {
          article.slug = slug(article.title);
          return jade.renderFileAsync('./views/article.jade', {
            author: config.author,
            blogName: config.blogName,
            article: article
          }).then(function(html) {
            return fs.writeFileAsync('./results/articles/' + article.slug + '.html', html);
          });
        });
      }
    }),
    db.getFrontpage().then(function(frontpageArticles) {
      frontpageArticles = frontpageArticles.map(function(article) {
        article.slug = slug(article.title);
        return article;
      });
      return jade.renderFileAsync('./views/index.jade', {
        author: config.author,
        blogName: config.blogName,
        articles: frontpageArticles
      }).then(function(html) {
        return fs.writeFileAsync('./results/index.html', html);
      });
    }),
    jade.renderFileAsync('./views/contact.jade', {
      author: config.author,
      blogName: config.blogName
    }).then(function(html) {
      return fs.writeFileAsync('./results/contact.html', html);
    }),
    fs.copyAsync('./public/images', './results/images')
  ]);
}).tap(process.exit);