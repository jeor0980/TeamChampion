'use strict';

sortingApp.controller('projectsInputController', function ($scope, projectInformation, surveyQuestions) {
    $scope.desiredSkills = surveyQuestions.getDesiredSkills();
    $scope.projects = projectInformation.getProjects();

    $scope.updateProjects = function () {
        projectInformation.setProjects($scope.projects);

        console.log('projects are bitching now');
        //here we want to fire off the old json request/write to that file
    }
})