'use strict';

sortingApp.controller('projectsInputController', function ($scope, $http, $window, projectInformation, surveyQuestions) {
    $scope.desiredSkills = surveyQuestions.getDesiredSkills();
    $scope.projects = projectInformation.getProjects();

    var projectCount = surveyQuestions.getProjectCount();
    $scope.projects.splice(projectCount, $scope.projects.length - projectCount);

    $scope.updateProjects = function () {
        projectInformation.setProjects($scope.projects);

        console.log('projects are bitching now');
        //here we want to fire off the old json request/write to that file
        var data = {
            'title': surveyQuestions.getSurveyName(),
            'description': surveyQuestions.getSurveyDescription(),
            'desiredSkills': surveyQuestions.getDesiredSkills(),
            'firstName': surveyQuestions.getFirstName(),
            'lastName': surveyQuestions.getLastName(),
            'preferredName': surveyQuestions.getPreferredName(),
            'gpa': surveyQuestions.getOverallGPA(),
            'csgpa': surveyQuestions.getCsGPA(),
            'skillCategories': surveyQuestions.getSkillCategories(),
            'rankedCategories': surveyQuestions.getRankedCategories(),
            'projects': projectInformation.getProjects(),
            'projectPreferences': surveyQuestions.getProjectPreferences(),
            'ipPreference': surveyQuestions.getIpPreference(),
            'ipOptions': surveyQuestions.getIpOptions(),
            'leadership': surveyQuestions.getLeadership(),
            'leadershipOptions': surveyQuestions.getLeadershipOptions(),
            'preferredPartners': surveyQuestions.getPreferredPartners(),
            'bannedPartners': surveyQuestions.getBannedPartners()
        };

        $http.post('/projectsInput', data).success(function (data) {
            console.log('yo we got those projects do');

            $window.location.href = "#surveyCreated";
        }).error(function (err) {
            console.log(err);
        });
    }
})