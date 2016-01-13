'use strict';
define([], function() {
  var dependencies = ['$scope', '$stateParams', 'AnalysisService', 'EvidenceTableService'];
  var RelativeEffectTableController = function($scope, $stateParams, AnalysisService, EvidenceTableService) {

    $scope.analysis.$promise.then(function(analysis) {
      var studyMap = AnalysisService.problemToStudyMap($scope.analysis.problem);
      var studies = EvidenceTableService.studyMapToStudyArray(studyMap);
      $scope.outcomeType = EvidenceTableService.determineOutcomeType(studies);
      $scope.scale = analysis.problem.relativeEffectData.scale;
      $scope.tableRows = EvidenceTableService.studyListToEvidenceRows(studies, $scope.analysis.problem.studyLevelCovariates)
    });

  }
  return dependencies.concat(RelativeEffectTableController);
});
