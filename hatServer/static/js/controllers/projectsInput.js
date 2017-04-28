'use strict';

sortingApp.controller('projectsInputController', function ($scope, projectInformation, surveyQuestions) {
    $scope.desiredSkills = surveyQuestions.getDesiredSkills();
    $scope.projects = projectInformation.getProjects();

    var projectCount = surveyQuestions.getProjectCount();
    $scope.projects.splice(projectCount, $scope.projects.length - projectCount);

    $scope.updateProjects = function () {
        projectInformation.setProjects($scope.projects);

        console.log('projects are bitching now');
        //here we want to fire off the old json request/write to that file
    }
})