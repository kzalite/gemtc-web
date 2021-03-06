'use strict';
define(['angular', 'lodash', 'd3', 'nvd3'], function(angular, _,  d3, nv) {
  var dependencies = [];
  var clearListener;
  var RankPlotDirective = function() {
    return {
      restrict: 'E',
      scope: {
        stacked: '@',
        value: '='
      },
      link: function(scope, element, attrs) {
        var svg = d3.select(element[0]).append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .style('font-size', '12px');

        function parsePx(str) {
          return parseInt(str.replace(/px/gi, ''));
        }

        var getParentDimension = function(element) {
          var width = parsePx(element.parent().css('width'));
          var height = parsePx(element.parent().css('height'));

          return {
            width: width,
            height: height
          };
        };

        var dim = getParentDimension(element);

        var rankGraphData = function(data) {
          var result = [];
          _.forEach(_.toPairs(data), function(el) {
            var key = el[0];
            var values = el[1];
            for (var i = 0; i < values.length; i++) {
              var obj = result[i] || {
                key: "Rank " + (i + 1),
                values: []
              };
              obj.values.push({
                x: key,
                y: values[i]
              });
              result[i] = obj;
            }
          });
          return result;
        };

        scope.$watch('value', function(newVal) {
          if (!newVal) {
            return;
          }
          var node = d3.select(element[0]);

          node.selectAll("svg > *").remove();

          nv.addGraph(function() {
            if (clearListener) {
              clearListener.clear();
            }
            svg.append("rect")
              .attr("width", "100%")
              .attr("height", "100%")
              .attr("fill", "white");

            var chart = nv.models.multiBarChart().height(dim.height).width(dim.width);
            var data = rankGraphData(newVal);


            chart.yAxis.tickFormat(d3.format(',.3f'));
            chart.xAxis.tickFormat(function(d) {
              return d;
            });
            chart.stacked(attrs.stacked);
            chart.reduceXTicks(false);
            chart.staggerLabels(true);
            chart.tooltip.hidden(true);

            svg.datum(data)
              .transition().duration(100).call(chart);

            clearListener = nv.utils.windowResize(chart.update);
          });
        }, true);
      }
    };
  };
  return dependencies.concat(RankPlotDirective);
});
