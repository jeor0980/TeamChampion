'use strict';

sortingApp.controller('createSurveyController', function ($scope, $window, surveyQuestions) {
    $scope.submitted = false;
    $scope.mySurveyQuestions = surveyQuestions;
    $scope.desiredSkills = surveyQuestions.getDesiredSkills();
    $scope.projects = surveyQuestions.getProjects();

    console.log($scope.desiredSkills);

    $scope.createSurvey = function (form) {
        console.log('creating dat survey do');

        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }

        surveyQuestions.setSurveyName($scope.surveyName);
        surveyQuestions.setSurveyDescription($scope.surveyDescription);

        $window.location.href = '#dashboard';
    }
});