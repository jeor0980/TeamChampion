// create the controller and inject Angular's $scope
sortingApp.controller('mainController', function($scope, userInformation) {
    // create a message to display in our view
    $scope.message = 'I AM YOUR FATHER!';

    $scope.printt = function() {
      console.log('Tacos are the best!');
  }

    $scope.signOut = function signOut() {
      var auth2 = userInformation.getAuthInstance();
      auth2.signOut();
      console.log('User signed out.');
  }

});

sortingApp.controller('profileController', function($scope, userInformation) {
    $scope.message = 'Look! I am an about page.';
    
    $scope.fullName = userInformation.getFullName();
    $scope.givenName = userInformation.getGivenName();
    $scope.familyName = userInformation.getFamilyName();
    $scope.email = userInformation.getEmail();
    $scope.imageUrl = userInformation.getImageUrl();

});

sortingApp.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

sortingApp.controller('loginController', function($scope) {

});

sortingApp.controller('takeSurveyController', function($scope, $http, $timeout, $window, surveyResults) {
    $scope.message1 = 'Survey to gather student preferences and abilities in support of forming teams for CU Boulder Senior Projects.';
    $scope.message2 = 'The following are some questions about your skillset and experiences that will help us diversify team talents.';
    $scope.message3 = 'And now the moment you have been waiting for. Please rank your top five project choices, and indicate your primary motivation for wanting to work on each project you rank. (Note that while the survey allows you to choose the same project for all five ranks, actually doing so will only make things more difficult for yourself and for us if we are not able to honor your top choice.';
    $scope.title = '2017 Senior Projects Group Formation Survey';
    $scope.firstChoiceComments = "";
    $scope.secondChoiceComments = "";
    $scope.thirdChoiceComments = "";
    $scope.comments = "";
    $scope.requestedPartners = [];
    $scope.bannedPartners = [];
    $scope.skills = {
        overallProgramming : '',
        databaseDevelopment : '',
        embeddedSystems : '',
        webApp : '',
        mobileApp : '',
        uiux : '',
        stats : '',
        socNetworking : '',
        security : '',
        robotics : '',
        compVision : '',
        algorithms : '',
        machineLearning : ''
    };
    $scope.desired = {
        java : false,
        python : false,
        php : false,
        ccpp : false,
        mobilAppDev : false,
        webApplications : false,
        embeddedSys : false,
        database : false,
        userIE : false,
        statistics : false,
        networking : false,
        robots : false,
        compVis : false,
        algos : false,
        ml : false
    }

    // TODO: change this from hard-coding to getting data from instructor form
    $scope.projects = ['Proj 1', 'Proj 2', 'Proj 3', 'Proj 4', 'Proj 5', 'Proj 6', 'Proj 7',
        'Proj 8', 'Proj 9', 'Proj 10'];

    $scope.sendSurveyPage1 = function (form) {
        console.log('boutta redirect this bitch');

        $scope.submitted = true;

        if (form.$invalid) {
            return;
        } else {
            $scope.submitted = false;
            $scope.message2 = 'The following are some questions about your skillset and experiences that will help us diversify team talents.';
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
            console.log('Going to page 3');
            $scope.submitted = false;
            $scope.message3 = 'And now the moment you have been waiting for. Please rank your top five project choices, and indicate your primary motivation for wanting to work on each project you rank. (Note that while the survey allows you to choose the same project for all five ranks, actually doing so will only make things more difficult for yourself and for us if we are not able to honor your top choice.';
            $window.location.href = '#/takeSurvey3';
        }
    }

    $scope.sendSurvey = function(form) {
        console.log("Getting results");
        console.log($scope.firstName);

        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }

        // turn data into a service so it persists across webpages
    	var data = {
    		'firstName' : $scope.firstName,
    		'lastName' : $scope.lastName,
            'preferredName' : $scope.preferredName,
            'identikey' : $scope.identikey,
            'gpa' : $scope.gpa,
            'csgpa' : $scope.csgpa,
    		//'email' : $scope.email,
            'firstChoice' : $scope.firstChoice,
            'secondChoice' : $scope.secondChoice,
            'thirdChoice' : $scope.thirdChoice,
            'firstChoiceComments' : $scope.firstChoiceComments,
            'secondChoiceComments' : $scope.secondChoiceComments,
            'thirdChoiceComments' : $scope.thirdChoiceComments,
            'requestedPartners' : $scope.requestedPartners,
            'bannedPartners' : $scope.bannedPartners,
            'skills' : $scope.skills,
            'desired' : $scope.desired,
            'ipPref' : $scope.ipPref,
            'lead' : $scope.lead,
    		'comments' : $scope.comments
    	};

    	// Fire the API request
    	$http.post('/takeSurvey3', data).success(function(results) {
            $scope.submitted = false;

    		console.log('RESULTS');
    	}).error(function(err) {
    		console.log(err);
    	});

        $window.location.href = "#/surveySuccess";
    };
});

sortingApp.controller('surveySuccessController', function($scope) {
    $scope.message = 'Congratulations! Your results have been submitted!';
});

sortingApp.controller('logOut', function($scope) {

});

sortingApp.controller('GoogleCtrl', function($scope, userInformation) {

  function onSignIn(googleUser) {
    
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);

    var authentication = gapi.auth2.getAuthInstance();

    $scope.test = "This is from the google controller";
    userInformation.setId(profile.getId()); // Don't send this directly to your server!
    userInformation.setFullName(profile.getName());
    userInformation.setGivenName(profile.getGivenName());
    userInformation.setFamilyName(profile.getFamilyName());
    userInformation.setImageUrl(profile.getImageUrl());
    userInformation.setEmail(profile.getEmail());
    userInformation.setIdToken(id_token);
    userInformation.setAuthInstance(authentication);

    console.log("ID: " + userInformation.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + userInformation.getFullName());
    console.log('Given Name: ' + userInformation.getGivenName());
    console.log('Family Name: ' + userInformation.getFamilyName());
    console.log("Image URL: " + userInformation.getImageUrl());
    console.log("Email: " + userInformation.getEmail()); 
    console.log("Auth: " + userInformation.getAuthInstance());    

    // $scope.both = userInformation.getFullName() + " " + $scope.test;

    // console.log($scope.both);

  }
  window.onSignIn = onSignIn;

});

sortingApp.controller('dashboardController', function($scope, userInformation) {
    $scope.message = 'This is the dashboard!';
    console.log($scope.message); 
    console.log("ID: " + userInformation.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + userInformation.getFullName());
    console.log('Given Name: ' + userInformation.getGivenName());
    console.log('Family Name: ' + userInformation.getFamilyName());
    console.log("Image URL: " + userInformation.getImageUrl());
    console.log("Email: " + userInformation.getEmail());   

});