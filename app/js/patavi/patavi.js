'use strict';
define(['./pataviTaskIdResource', 'angular', 'angular-resource'], function(
  PataviTaskIdResource,
  angular
) {
  var dependencies = ['ngResource'];
  return angular.module('gemtc.patavi', dependencies)
    // resources
    .factory('PataviTaskIdResource', PataviTaskIdResource)
    ;
});