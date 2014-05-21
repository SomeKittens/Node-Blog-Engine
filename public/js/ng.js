'use strict';

angular.module('nbe', [
  'commonality',
  'hc.marked'
])
.config(['$httpProvider', function($httpProvider) {
  // Oddly, not the default, and is needed to tell express it's XHR
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}])
.controller('Editor', function($scope, commonalityCalc) {
  $scope.article = {
    content: '',
    wordCount: 0
  };
  
  $scope.$watch('article.content', function(n) {
    commonalityCalc.sourceText = $scope.article.content;
    var temp = n.split(' ').filter(Boolean);
    $scope.article.wordCount = temp.length;
  });

  console.log(commonalityCalc);
});