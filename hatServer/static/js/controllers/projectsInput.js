'use strict';

sortingApp.controller('projectsInputController', function ($scope, $http, $window, projectInformation, surveyQuestions) {
    // get desired skills to be displayed and get projects for the instructor to update with information
    $scope.desiredSkills = surveyQuestions.getDesiredSkills();
    $scope.projects = projectInformation.getProjects();
    var projectCount = surveyQuestions.getProjectCount();
    $scope.projects.splice(projectCount, $scope.projects.length - projectCount);

    // function to be called once all information has been input about all projects
    $scope.updateProjects = function () {
        // update the project service with appropriate information
        projectInformation.setProjects($scope.projects);

        // create json object with all information for algorithm and for student survey
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

        // send this object to be written to a json file
        $http.post('/projectsInput', data).success(function (data) {
            // redirect to a survey created confirmation page
            $window.location.href = "#surveyCreated";
        }).error(function (err) {
            console.log(err);
        });
    }
})