'use strict';

sortingApp.controller('createSurveyController', function ($scope, $window, surveyQuestions) {
    $scope.submitted = false;

    $scope.maxSkills = surveyQuestions.getMaxSkills();
    $scope.desiredSkills = surveyQuestions.getDesiredSkills();
    $scope.surveyName = surveyQuestions.getSurveyName();
    $scope.surveyDescription = surveyQuestions.getSurveyDescription();
    $scope.studentCount = surveyQuestions.getStudentCount();
    $scope.groupSizes = surveyQuestions.getGroupSizes();
    $scope.firstName = surveyQuestions.getFirstName();
    $scope.lastName = surveyQuestions.getLastName();
    $scope.preferredName = surveyQuestions.getPreferredName();
    $scope.overallGPA = surveyQuestions.getOverallGPA();
    $scope.csGPA = surveyQuestions.getCsGPA();
    $scope.skillCategories = surveyQuestions.getSkillCategories();
    // ALL OF THIS IS GOING TO BE BETTER DON'T WORRY IT WON'T ALWAYS BE THIS DISGUSTING
    $scope.overallProgramming = surveyQuestions.getOverallProgramming();
    $scope.databaseDevelopment = surveyQuestions.getDatabaseDevelopment();
    $scope.embeddedSystems = surveyQuestions.getEmbeddedSystems();
    $scope.webApplications = surveyQuestions.getWebApplications();
    $scope.mobileApplications = surveyQuestions.getMobileApplications();
    $scope.userInterface = surveyQuestions.getUserInterface();
    $scope.statistics = surveyQuestions.getStatistics();
    $scope.networking = surveyQuestions.getNetworking();
    $scope.security = surveyQuestions.getSecurity();
    $scope.robotics = surveyQuestions.getRobotics();
    $scope.computerVision = surveyQuestions.getComputerVision();
    $scope.algorithms = surveyQuestions.getAlgorithms();
    $scope.machineLearning = surveyQuestions.getMachineLearning();
    $scope.firstChoice = surveyQuestions.getFirstChoice();
    $scope.firstComment = surveyQuestions.getFirstComment();
    $scope.secondChoice = surveyQuestions.getSecondChoice();
    $scope.secondComment = surveyQuestions.getSecondComment();
    $scope.thirdChoice = surveyQuestions.getThirdChoice();
    $scope.thirdComment = surveyQuestions.getThirdComment();
    $scope.fourthChoice = surveyQuestions.getFourthChoice();
    $scope.fourthComment = surveyQuestions.getFourthComment();
    $scope.fifthChoice = surveyQuestions.getFifthChoice();
    $scope.fifthComment = surveyQuestions.getFifthComment();
    $scope.ipPreference = surveyQuestions.getIpPreference();
    $scope.ipOptions = surveyQuestions.getIpOptions();
    $scope.leadership = surveyQuestions.getLeadership();
    $scope.leadershipOptions = surveyQuestions.getLeadershipOptions();
    $scope.preferredPartners = surveyQuestions.getPreferredPartners();
    $scope.bannedPartners = surveyQuestions.getBannedPartners();
    $scope.maxScore = surveyQuestions.getMaxScore();
    $scope.changeRatings = surveyQuestions.getChangeRatings();
    $scope.weights = surveyQuestions.getWeights();

    $scope.createSurvey = function (form) {
        console.log('creating dat survey do');

        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }

        surveyQuestions.setSurveyName($scope.surveyName);
        surveyQuestions.setSurveyDescription($scope.surveyDescription);
        surveyQuestions.setStudentCount($scope.studentCount);
        surveyQuestions.setGroupSizes($scope.groupSizes);
        surveyQuestions.setFirstName($scope.firstName);
        surveyQuestions.setLastName($scope.lastName);
        surveyQuestions.setPreferredName($scope.preferredName);
        surveyQuestions.setOverallGPA($scope.overallGPA);
        surveyQuestions.setCsGPA($scope.csGPA);
        surveyQuestions.setSkillCategories($scope.skillCategories);
        surveyQuestions.setOverallProgramming($scope.overallProgramming);
        surveyQuestions.setDatabaseDevelopment($scope.databaseDevelopment);
        surveyQuestions.setEmbeddedSystems($scope.embeddedSystems);
        surveyQuestions.setWebApplications($scope.webApplications);
        surveyQuestions.setMobileApplications($scope.mobileApplications);
        surveyQuestions.setUserInterface($scope.userInterface);
        surveyQuestions.setStatistics($scope.statistics);
        surveyQuestions.setNetworking($scope.networking);
        surveyQuestions.setSecurity($scope.security);
        surveyQuestions.setRobotics($scope.robotics);
        surveyQuestions.setComputerVision($scope.computerVision);
        surveyQuestions.setAlgorithms($scope.algorithms);
        surveyQuestions.setMachineLearning($scope.machineLearning);
        surveyQuestions.setMaxSkills($scope.maxSkills);
        surveyQuestions.setDesiredSkills($scope.desiredSkills);
        surveyQuestions.setFirstChoice($scope.firstChoice);
        surveyQuestions.setFirstComment($scope.firstComment);
        surveyQuestions.setSecondChoice($scope.secondChoice);
        surveyQuestions.setSecondComment($scope.secondComment);
        surveyQuestions.setThirdChoice($scope.thirdChoice);
        surveyQuestions.setThirdComment($scope.thirdComment);
        surveyQuestions.setFourthChoice($scope.fourthChoice);
        surveyQuestions.setFourthComment($scope.fourthComment);
        surveyQuestions.setFifthChoice($scope.fifthChoice);
        surveyQuestions.setFifthComment($scope.fifthComment);
        surveyQuestions.setIpPreference($scope.ipPreference);
        surveyQuestions.setIpOptions($scope.ipOptions);
        surveyQuestions.setLeadership($scope.leadership);
        surveyQuestions.setLeadershipOptions($scope.leadershipOptions);
        surveyQuestions.setPreferredPartners($scope.preferredPartners);
        surveyQuestions.setBannedPartners($scope.bannedPartners);
        surveyQuestions.setMaxScore($scope.maxScore);
        surveyQuestions.setChangeRatings($scope.changeRatings);
        surveyQuestions.setWeights($scope.weights);

        data = {
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
            'MIN_PAID_AVG_PREF_SCORE': surveyQuestions.getMaxScore()
        };

        // TODO: send http request to write all this data to Hayden's json file

        $window.location.href = '#projectsInput';
    }
});