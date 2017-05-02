'use strict';

sortingApp.controller('createSurveyController', function ($scope, $window, $http, surveyQuestions) {
    $http.get('../static/js/config/variables.json').success(function (data) {
        // Update the service with information from the json file before we begin
        surveyQuestions.setWeight('learn', data['LEARN_WEIGHT']);
        surveyQuestions.setWeight('known', data['KNOWN_WEIGHT']);
        surveyQuestions.setWeight('group', data['GROUP_WEIGHT']);
        surveyQuestions.setWeight('ip', data['IP_WEIGHT']);
        surveyQuestions.setWeight('extraCredit', data['EXTRA_CREDIT']);
        surveyQuestions.setMaxSkills(data['MAX_SKILL_LEN']);
        surveyQuestions.setGroupSize('min', data['MIN_SIZE']);
        surveyQuestions.setGroupSize('max', data['MAX_SIZE']);
        surveyQuestions.setGroupSize('opt', data['OPT_SIZE']);
        surveyQuestions.setLeadershipValue('important', data['LEADERSHIP_MATTERS']);
        surveyQuestions.setStudentCount(data['STUDENT_COUNT']);
        surveyQuestions.setChangeRatings(data['SUBVERT_FOR_PAY']);
        surveyQuestions.setMaxScore(data['MIN_PAID_AVG_PREF_SCORE']);
        surveyQuestions.setWeight('enemy', data['ENEMY_WEIGHT']);
        surveyQuestions.setAttemptReplace(data['ATTEMPT_REPLACE']);
    });
    // we'll need a way to validate that the survey is filled before instructors may submit
    $scope.submitted = false;

    // get values from our service to begin two-way data binding in Angular
    $scope.projectPreferences = surveyQuestions.getProjectPreferences();
    $scope.rankedCategories = surveyQuestions.getRankedCategories();
    $scope.maxSkills = surveyQuestions.getMaxSkills();
    $scope.desiredSkills = surveyQuestions.getDesiredSkills();
    $scope.surveyName = surveyQuestions.getSurveyName();
    $scope.surveyDescription = surveyQuestions.getSurveyDescription();
    $scope.studentCount = surveyQuestions.getStudentCount();
    $scope.projectCount = surveyQuestions.getProjectCount();
    $scope.groupSizes = surveyQuestions.getGroupSizes();
    $scope.firstName = surveyQuestions.getFirstName();
    $scope.lastName = surveyQuestions.getLastName();
    $scope.preferredName = surveyQuestions.getPreferredName();
    $scope.overallGPA = surveyQuestions.getOverallGPA();
    $scope.csGPA = surveyQuestions.getCsGPA();
    $scope.ipPreference = surveyQuestions.getIpPreference();
    $scope.ipOptions = surveyQuestions.getIpOptions();
    $scope.leadership = surveyQuestions.getLeadership();
    $scope.leadershipOptions = surveyQuestions.getLeadershipOptions();
    $scope.preferredPartners = surveyQuestions.getPreferredPartners();
    $scope.bannedPartners = surveyQuestions.getBannedPartners();
    $scope.maxScore = surveyQuestions.getMaxScore();
    $scope.changeRatings = surveyQuestions.getChangeRatings();
    $scope.attemptReplace = surveyQuestions.getAttemptReplace();
    $scope.weights = surveyQuestions.getWeights();

    // Called when the instructor has finished selecting survey options, required and otherwise
    // It validates the form and sends an object to the backend to create a json file read in by the algorithm
    $scope.createSurvey = function (form) {
        // validate survey was completed correctly
        $scope.submitted = true;
        if (form.$invalid) {
            return;
        }

        // set service values with the updated values from the instructors
        surveyQuestions.setProjectPreferences($scope.projectPreferences);
        surveyQuestions.setRankedCategories($scope.rankedCategories);
        surveyQuestions.setSurveyName($scope.surveyName);
        surveyQuestions.setSurveyDescription($scope.surveyDescription);
        surveyQuestions.setStudentCount($scope.studentCount);
        surveyQuestions.setProjectCount($scope.projectCount);
        surveyQuestions.setGroupSizes($scope.groupSizes);
        surveyQuestions.setFirstName($scope.firstName);
        surveyQuestions.setLastName($scope.lastName);
        surveyQuestions.setPreferredName($scope.preferredName);
        surveyQuestions.setOverallGPA($scope.overallGPA);
        surveyQuestions.setCsGPA($scope.csGPA);
        surveyQuestions.setMaxSkills($scope.maxSkills);
        surveyQuestions.setDesiredSkills($scope.desiredSkills);
        surveyQuestions.setIpPreference($scope.ipPreference);
        surveyQuestions.setIpOptions($scope.ipOptions);
        surveyQuestions.setLeadership($scope.leadership);
        surveyQuestions.setLeadershipOptions($scope.leadershipOptions);
        surveyQuestions.setPreferredPartners($scope.preferredPartners);
        surveyQuestions.setBannedPartners($scope.bannedPartners);
        surveyQuestions.setMaxScore($scope.maxScore);
        surveyQuestions.setChangeRatings($scope.changeRatings);
        surveyQuestions.setWeights($scope.weights);

        // json object to be recorded for the algorithm to use
        var data = {
            'MAX_SKILL_LEN': surveyQuestions.getMaxSkills(),
            'LEARN_WEIGHT': surveyQuestions.getWeights()['learn'],
            'KNOWN_WEIGHT': surveyQuestions.getWeights()['known'],
            'GROUP_WEIGHT': surveyQuestions.getWeights()['group'],
            'IP_WEIGHT': surveyQuestions.getWeights()['ip'],
            'MIN_SIZE': surveyQuestions.getGroupSizes()['min'],
            'MAX_SIZE': surveyQuestions.getGroupSizes()['max'],
            'OPT_SIZE': surveyQuestions.getGroupSizes()['opt'],
            'LEADERSHIP_MATTERS': surveyQuestions.getLeadership()['important'],
            'STUDENT_COUNT': surveyQuestions.getStudentCount(),
            'SUBVERT_FOR_PAY': surveyQuestions.getChangeRatings(),
            'MIN_PAID_AVG_PREF_SCORE': surveyQuestions.getMaxScore(),
            'EXTRA_CREDIT': surveyQuestions.getWeights()['extraCredit'],
            'ENEMY_WEIGHT': surveyQuestions.getWeights()['enemy'],
            'ATTEMPT_REPLACE': surveyQuestions.getAttemptReplace()
        };
        
        // Fire the API request to send data to backend for further use
        $http.post('/createSurvey', data).success(function (data) {
            $scope.submitted = false;

            // redirect to where the instructors can input project information
            $window.location.href = '#projectsInput';
        }).error(function (err) {
            console.log(err);
        });
    }
});