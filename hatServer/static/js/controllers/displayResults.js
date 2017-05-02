'use strict';

sortingApp.controller('displayResultsController', function ($scope, $http) {
    $http.get('../static/js/config/results_DEMO.json').success(function (data) {
        $scope.groups = data['Groups'];
        $scope.distribution = data['distribution'];
        $scope.overall = data['overall_pref_avg'];
    })
});