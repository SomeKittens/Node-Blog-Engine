'use strict';

angular.module('nbe', [
  'commonality',
  'hc.marked'
])
.config(['$httpProvider', function($httpProvider) {
  // Oddly, not the default, and is needed to tell express it's XHR
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}])
.controller('Editor', function($scope, $window, articles, commonalityCalc) {
  var EC = this;

  // TODO: ui-router
  articles.getArticle($window.location.pathname.split('/')[2])
  .then(function (data) {
    EC.article = data.data;
  });

  $scope.$watch('EC.article.body', function(n) {
    if (!n) { return; }
    commonalityCalc.sourceText = EC.article.body;
    EC.wordCount = n.split(' ').filter(Boolean).length;
  });

  EC.save = function() {
    articles.save(EC.article)
    .success(function() {
      // TODO indicate successful save
    });
  };

  EC.togglePublish = function () {
    articles.publish(EC.article.id, EC.article.published);
  };
})
.controller('ArticlesController', function (articles) {
  var AC = this;

  articles.getAllArticles()
  .then(function (data) {
    AC.articles = data.data;
  });

})
.factory('articles', function ($http) {
  var actions = {
    getAllArticles: function () {
      return $http.get('/posts');
    },
    getArticle: function (id) {
      return $http.get('/posts/' + id);
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