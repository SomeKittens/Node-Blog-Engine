'use strict';

angular.module('nbe', [
  'commonality',
  'hc.marked'
])
.config(['$httpProvider', function($httpProvider) {
  // Oddly, not the default, and is needed to tell express it's XHR
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}])
.controller('Editor', function($scope, $http, $window, commonalityCalc) {
  $scope.article = $window.article;

  $scope.$watch('article.content', function(n) {
    if (!n) { return; }
    commonalityCalc.sourceText = $scope.article.content;
    var temp = n.split(' ').filter(Boolean);
    $scope.article.wordCount = temp.length;
  });

  $scope.save = function() {
    $http({
      method: 'patch',
      url: '/posts/' + article.id,
      data: $scope.article
    }).success(function() {
      // TODO indicate successful save
    });
  };
});