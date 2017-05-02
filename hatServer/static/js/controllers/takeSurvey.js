'use strict';

sortingApp.controller('takeSurveyController', function ($scope, $http, $window, surveyResults, userInformation) {
    $http.get('../static/js/config/survey.json').success(function (data) {
        // Pull information to be displayed in the first survey page
        // projects is an array of dictionaries with data about each project :) 
        $scope.projects = data['projects'];
        $scope.title = data['title'];
        $scope.description = data['description'];
        $scope.surveyFirstName = data['firstName'];
        $scope.surveyLastName = data['lastName'];
        $scope.surveyPreferredName = data['preferredName'];
        $scope.surveyGpa = data['gpa'];
        $scope.surveyCsgpa = data['csgpa'];

        // pull information to be displayed in the second survey page
        $scope.rankedSkills = data['rankedCategories'];
        $scope.desiredSkills = data['desiredSkills'];

        // pull information to be displayed in the third survey page
        $scope.projectPreferences = data['projectPreferences'];
        $scope.ipPreference = data['ipPreference'];
        $scope.ipOptions = data['ipOptions'];
        $scope.leadership = data['leadership'];
        $scope.leadershipOptions = data['leadershipOptions'];
        $scope.preferred = data['preferredPartners'];
        $scope.banned = data['bannedPartners'];
    });

    $scope.firstName = surveyResults.getFirstName();
    $scope.lastName = surveyResults.getLastName();
    $scope.preferredName = surveyResults.getPreferredName();
    $scope.gpa = surveyResults.getOverallGPA();
    $scope.csgpa = surveyResults.getCsGPA();
    $scope.skills = surveyResults.getSkills();
    $scope.firstChoiceComment = surveyResults.getFirstChoiceComment();
    $scope.secondChoiceComment = surveyResults.getSecondChoiceComment();
    $scope.thirdChoiceComment = surveyResults.getThirdChoiceComment();
    $scope.fourthChoiceComment = surveyResults.getFourthChoiceComment();
    $scope.fifthChoiceComment = surveyResults.getFifthChoiceComment();
    $scope.requestedPartners = surveyResults.getPreferredPartners();
    $scope.bannedPartners = surveyResults.getBannedPartners();
    $scope.ipPref = surveyResults.getIpPreference();
    $scope.lead = surveyResults.getLeadershipRole();

    // function called after completion of the first survey page
    // validates form and redirects to the second page, after updating service variables
    $scope.sendSurveyPage1 = function (form) {
        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }

        // update service variables with input information
        surveyResults.setFirstName($scope.firstName);
        surveyResults.setLastName($scope.lastName);
        surveyResults.setPreferredName($scope.preferredName);
        surveyResults.setOverallGPA($scope.gpa);
        surveyResults.setCsGPA($scope.csgpa);

        $scope.submitted = false;

        // redirect to the second page of the survey
        $window.location.href = '#/takeSurvey2';
    }

    // function called after completion of the second page of the survey
    // validates the form, updates the service, redirects to the third page
    $scope.sendSurveyPage2 = function (form) {
        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }
        for (var field in $scope.rankedSkills) {
            surveyResults.setSkills($scope.skills[field.name], field.name);
            // set that a student has a skill if they answered 'expert' or 'good'
            if ($scope.skills[field] === 'expert' || $scope.skills[field] === 'good') {
                surveyResults.setFinalSkills(field);
            }
        }
        // add each skill that the student wants to learn to the service
        for (field in $scope.desired) {
            surveyResults.setDesired(field);
        }

        $scope.submitted = false;

        // redirect to the third page of the survey
        $window.location.href = '#/takeSurvey3';
    }

    // final method to send completed survey results to be written to database
    // validates all survey results and sends object to database
    $scope.sendSurvey = function (form) {
        // validate the form is completely submitted
        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }

        // set the values of the service according to the student's survey response
        surveyResults.setFirstChoice($scope.firstChoice);
        surveyResults.setFirstChoiceComment($scope.firstChoiceComment);
        surveyResults.setSecondChoice($scope.secondChoice);
        surveyResults.setSecondChoiceComment($scope.secondChoiceComment);
        surveyResults.setThirdChoice($scope.thirdChoice);
        surveyResults.setThirdChoiceComment($scope.thirdChoiceComment);
        surveyResults.setFourthChoice($scope.fourthChoice);
        surveyResults.setFourthChoiceComment($scope.fourthChoiceComment);
        surveyResults.setFifthChoice($scope.fifthChoice);
        surveyResults.setFifthChoiceComment($scope.fifthChoiceComment);
        surveyResults.setPreferredPartners($scope.requestedPartners);
        surveyResults.setBannedPartners($scope.bannedPartners);
        surveyResults.setIpPreference($scope.ipPref);
        surveyResults.setLeadershipRole($scope.lead);

        // create a json object of survey responses to eventually be written to database
        var data = {
            'firstName': surveyResults.getFirstName(),
            'lastName': surveyResults.getLastName(),
            'preferredName': surveyResults.getPreferredName(),
            'identikey': userInformation.getIdentikey(),
            'gpa': surveyResults.getOverallGPA(),
            'csgpa': surveyResults.getCsGPA(),
            //'email' : $scope.email,
            'firstChoice': surveyResults.getFirstChoice(),
            'secondChoice': surveyResults.getSecondChoice(),
            'thirdChoice': surveyResults.getThirdChoice(),
            'fourthChoice': surveyResults.getFourthChoice(),
            'fifthChoice': surveyResults.getFifthChoice(),
            'firstChoiceComments': surveyResults.getFirstChoiceComment(),
            'secondChoiceComments': surveyResults.getSecondChoiceComment(),
            'thirdChoiceComments': surveyResults.getThirdChoiceComment(),
            'fourthChoiceComments': surveyResults.getFourthChoiceComment(),
            'fifthChoiceComments': surveyResults.getFifthChoiceComment(),
            'requestedPartners': surveyResults.getPreferredPartners(),
            'bannedPartners': surveyResults.getBannedPartners(),
            'skills': surveyResults.getFinalSkills(),
            'desired': surveyResults.getDesired(),
            'ipPref': surveyResults.getIpPreference(),
            'lead': surveyResults.getLeadershipRole(),
            'comments': $scope.comments
        };

        // Fire the API request and send completed survey form to database
        $http.post('/takeSurvey3', data).success(function (results) {
            $scope.submitted = false;
        }).error(function (err) {
            console.log(err);
        });

        // redirect to completed survey confirmation page
        $window.location.href = "#/surveySuccess";
    };
});