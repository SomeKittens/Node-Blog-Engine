/**
 * Displays the most commonly used words in a given textarea
 * @license MIT
 * @Copyright 2014 Randall Koutnik
 */

'use strict';

angular.module('commonality', [])
  .service('commonalityCalc', function($rootScope) {
    var common = {
      sourceText: '',
      results: []
    };

    $rootScope.$watch(function() {
        return common.sourceText;
      }, function(n) {
      if (!n) { return; }

      var words = n.toLowerCase().split(/\s/).filter(function(a) {return a.length > 2;})
      , wordMap = {}
      , i, l;

      for (i = 0, l = words.length; i < l; i++) {
        var currentWord = words[i];
        if (wordMap[currentWord]) {
          wordMap[currentWord]++;
        } else {
          wordMap[currentWord] = 1;
        }
      }

      var wordArray = [];

      Object.keys(wordMap).forEach(function(key) {
        wordArray.push([key, wordMap[key]]);
      });

      wordArray.sort(function(a, b) {
        return b[1] - a[1];
      });

      common.results = wordArray.slice(0, 5);
    });

    return common;
  })
  .directive('commonalitySource', function(commonalityCalc) {
    return {
      template: '<textarea ng-model="common.sourceText" class="form-control"></textarea>',
      replace: true,
      link: function(scope) {
        scope.common = commonalityCalc;
      }
    };
  })
  .directive('commonalityResults', function(commonalityCalc) {
    return {
      template: '<tr ng-repeat="word in common.results">' +
                  '<td>{{ word[0] }}</td>' +
                  '<td>{{ word[1] }}</td>' +
                '</tr>',
      transclude: true,
      link: function(scope) {
        scope.common = commonalityCalc;
      }
    };
  });
