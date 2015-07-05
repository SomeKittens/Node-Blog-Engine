'use strict';

angular.module('nbe', [
  'commonality',
  'hc.marked',
  'ui.router'
])
.config(function($httpProvider) {
  // Oddly, not the default, and is needed to tell express it's XHR
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
})
.config(function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });
  // TODO resolves
  $stateProvider
  .state('articleList', {
    url: '/edit',
    templateUrl: '/templates/articleList',
    controller: 'ArticlesController',
    controllerAs: 'AC',
    resolve: {
      articles: function (articleManager) {
        return articleManager.getAllArticles();
      }
    }
  })
  .state('edit', {
    url: '/edit/{id:int}',
    templateUrl: '/templates/edit',
    controller: 'Editor',
    controllerAs: 'EC',
    resolve: {
      article: function (articleManager, $stateParams) {
        return articleManager.getArticle($stateParams.id);
      }
    }
  });
})
.controller('Editor', function($scope, $window, article, articleManager, commonalityCalc) {
  var EC = this;

  EC.article = article;

  $scope.$watch('EC.article.body', function(n) {
    if (!n) { return; }
    commonalityCalc.sourceText = EC.article.body;
    EC.wordCount = n.split(' ').filter(Boolean).length;
  });

  EC.save = function() {
    articleManager.save(EC.article)
    .success(function() {
      // TODO indicate successful save
    });
  };

  EC.togglePublish = function () {
    articleManager.publish(EC.article.id, EC.article.published);
  };
})
.controller('ArticlesController', function (articles) {
  var AC = this;
  AC.articles = articles;
})
.factory('articleManager', function ($http) {
  var d = function (data) { return data.data };
  var actions = {
    getAllArticles: function () {
      return $http.get('/posts')
      .then(d);
    },
    getArticle: function (id) {
      return $http.get('/posts/' + id)
      .then(d);
    },
    publish: function (id, publishState) {
      return $http({
        method: 'patch',
        url: '/posts/' + id,
        data: {
          publishState: publishState
        }
      });
    },
    save: function (article) {
      return $http({
        method: 'patch',
        url: '/posts/' + article.id,
        data: article
      });
    }
  };
  return actions;
});