'use strict';
define(['angular'], function(angular) {
  var dependencies = ['$q', '$stateParams', '$injector', '$window', 'NetworkPlotService', 'AnalysisResource',
    'NetworkMetaAnalysisService'
  ];
  var NetworkPlotDirective = function($q, $stateParams, $injector, $window, NetworkPlotService, AnalysisResource,
    NetworkMetaAnalysisService) {
    return {
      scope: {
        analysisId: '=',
        network: '=',
        sizingElementId: '='
      },
      restrict: 'E',
      template: '<div class="network-graph"><svg></svg></div>',
      link: function(scope, element) {

        /**
         * Directive can be supplied with a id pointing to a element on the page that determines the graphs with and height.
         * If no id is supplied, the directives parent element is used for sizing
         **/
        var sizingElement;
        if (scope.sizingElementId) {
          sizingElement = $('#' + scope.sizingElementId);
        } else {
          sizingElement = element.parent();
        }

        var width = sizingElement.width();
        var height = sizingElement.height();


        if (scope.analysisId !== undefined) {
          var analysis = AnalysisResource.get({
            projectId: $stateParams.projectId,
            analysisId: scope.analysisId
          });
          var InterventionResource = $injector.get('InterventionResource');
          var interventions = InterventionResource.query($stateParams);
          $q.all([analysis.$promise, interventions.$promise])
            .then(function() {
              var EvidenceTableResource = $injector.get('EvidenceTableResource');
              EvidenceTableResource.query({
                  projectId: $stateParams.projectId,
                  analysisId: analysis.id
                })
                .$promise
                .then(function(trialverseData) {
                  interventions = NetworkMetaAnalysisService.addInclusionsToInterventions(interventions, analysis.interventionInclusions);
                  var includedInterventions = NetworkMetaAnalysisService.getIncludedInterventions(interventions);
                  var momentSelections = NetworkMetaAnalysisService.buildMomentSelections(trialverseData, analysis);
                  var network = NetworkMetaAnalysisService.transformTrialDataToNetwork(trialverseData, includedInterventions, analysis, momentSelections);
                  NetworkPlotService.drawNetwork(network, element, width, height);
                });
            });
        }
        scope.$watch('network', function(newValue, oldValue) {
          if (oldValue !== newValue) {
            NetworkPlotService.drawNetwork(newValue, element, width, height);
          }
        });

        angular.element($window).bind('resize', function() {
          NetworkPlotService.drawNetwork(scope.network, element, sizingElement.width(), sizingElement.height());
        });

      }
    };
  };
  return dependencies.concat(NetworkPlotDirective);
});
