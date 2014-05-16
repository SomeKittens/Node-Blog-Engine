'use strict';

angular.module('nbe', [])
.config(['$httpProvider', function($httpProvider) {
  // Oddly, not the default, and is needed to tell express it's XHR
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}])
.controller('Editor', function($scope, commonalityCalc) {
  console.log(commonalityCalc);
});