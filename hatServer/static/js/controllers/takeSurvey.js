'use strict';

sortingApp.controller('takeSurveyController', function ($scope, $http, $window, surveyResults) {
    $scope.message1 = 'Survey to gather student preferences and abilities in support of forming teams for CU Boulder Senior Projects.';
    $scope.message2 = 'The following are some questions about your skillset and experiences that will help us diversify team talents.';
    $scope.message3 = 'And now the moment you have been waiting for. Please rank your top five project choices, and indicate your primary motivation for wanting to work on each project you rank. (Note that while the survey allows you to choose the same project for all five ranks, actually doing so will only make things more difficult for yourself and for us if we are not able to honor your top choice.';
    $scope.title = '2017 Senior Projects Group Formation Survey';
    $scope.firstChoiceComment = "";
    $scope.secondChoiceComment = "";
    $scope.thirdChoiceComment = "";
    $scope.comments = "";

    // TODO: change this from hard-coding to getting data from instructor form
    $scope.projects = ['Proj 1', 'Proj 2', 'Proj 3', 'Proj 4', 'Proj 5', 'Proj 6', 'Proj 7',
        'Proj 8', 'Proj 9', 'Proj 10'];

    $scope.sendSurveyPage1 = function (form) {
        console.log('boutta redirect this bitch');

        $scope.submitted = true;

        if (form.$invalid) {
            return;
        } else {
            surveyResults.setFirstName($scope.firstName);
            surveyResults.setLastName($scope.lastName);
            surveyResults.setPreferredName($scope.preferredName);
            surveyResults.setIdentikey($scope.identikey);
            surveyResults.setOverallGPA($scope.gpa);
            surveyResults.setCsGPA($scope.csgpa);

            $scope.submitted = false;

            $window.location.href = '#/takeSurvey2';
        }
    }

    $scope.sendSurveyPage2 = function (form) {
        $scope.submitted = true;
        console.log('send survey page 2');

        if (form.$invalid) {
            console.log('else');
            return;
        } else {
            for (field in $scope.skills) {
                surveyResults.setSkills($scope.skills[field], field);
                if ($scope.skills[field] === 'expert' || $scope.skills[field] === 'good') {
                    console.log(field)
                    surveyResults.setFinalSkills(field);
                }
            }
            for (field in $scope.desired) {
                surveyResults.setDesired(field);
            }

            $scope.submitted = false;

            $window.location.href = '#/takeSurvey3';
        }
    }

    $scope.sendSurvey = function (form) {
        console.log("Getting results");
        console.log($scope.finalSkills);

        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }

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

        // turn data into a service so it persists across webpages
        var data = {
            'firstName': surveyResults.getFirstName(),
            'lastName': surveyResults.getLastName(),
            'preferredName': surveyResults.getPreferredName(),
            'identikey': surveyResults.getIdentikey(),
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
            //'skills' : surveyResults.getSkills(),
            'desired': surveyResults.getDesired(),
            'ipPref': surveyResults.getIpPreference(),
            'lead': surveyResults.getLeadershipRole(),
            'comments': $scope.comments
        };

        // Fire the API request
        $http.post('/takeSurvey3', data).success(function (results) {
            $scope.submitted = false;

            console.log('RESULTS');
        }).error(function (err) {
            console.log(err);
        });

        $window.location.href = "#/surveySuccess";
    };
});