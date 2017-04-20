// create the controller and inject Angular's $scope
sortingApp.controller('mainController', function($scope, userInformation) {
    // create a message to display in our view
    $scope.message = 'I AM YOUR FATHER!';

    $scope.printt = function() {
      console.log('Tacos are the best!');
  }
});

sortingApp.controller('profileController', function($scope, userInformation) {
    $scope.message = 'Look! I am an about page.';
    
    // $scope.fullName = userInformation.getFullName();
    $scope.givenName = userInformation.getGivenName();
    $scope.familyName = userInformation.getFamilyName();
    $scope.email = userInformation.getEmail();
    $scope.imageUrl = userInformation.getImageUrl();

    console.log($scope.givenName);
    console.log($scope.familyName);
    console.log($scope.email);
    console.log($scope.imageUrl);
});

sortingApp.controller('takeSurveyController', function($scope, $http, $timeout) {
    $scope.message = 'Here students can take surveys!';
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

    $scope.sendSurvey = function(form) {
    	console.log("Getting results");

        $scope.submitted = true;

        if (form.$invalid) {
            return;
        }

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
    	$http.post('/takeSurvey', data).success(function(results) {
            $scope.submitted = false;

    		console.log('RESULTS');
            $scope.validateSurvey();
    	}).error(function(err) {
    		console.log(err);
    	})
    };

// I don't know if this function is really necessary anymore....
    $scope.validateSurvey = function() {
        console.log('VALIDATING DAT SURVEY DO');
        var timeout = "";

        var poller = function() {
            $http.get('/#/surveySuccess').success(function(data, status, headers, config) {
                if (status === 202) {
                    console.log(status);
                } else if (status === 200) {
                    console.log("yassssss");
                    $timeout.cancel(timeout);
                    return false;
                }

                timeout = $timeout(poller, 2000);
            }).error(function(err) {
                console.log(err);
            });
        };
        poller();
    }
});

sortingApp.controller('surveySuccessController', function($scope) {
    $scope.message = 'Congratulations! Your results have been submitted!';
});

sortingApp.controller('GoogleCtrl', function($route, $scope, $window, userInformation) {

  function onSignIn(googleUser) {
    
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

    //This variable is passed to userService to for Google Authentication
    var authentication = gapi.auth2.getAuthInstance();
    userInformation.setIsLoggedIn(true);
    userInformation.setId(profile.getId()); // Don't send this directly to your server!
    userInformation.setFullName(profile.getName());
    userInformation.setGivenName(profile.getGivenName());
    userInformation.setFamilyName(profile.getFamilyName());
    userInformation.setImageUrl(profile.getImageUrl());
    userInformation.setEmail(profile.getEmail());
    userInformation.setIdToken(id_token);
    userInformation.setAuthInstance(authentication);
    // console.log(userInformation.getIsLoggedIn());

    console.log("User Authenticated Successfully!");
    Materialize.toast('Logged In Successfully!', 5000) // 5000 is the duration of the toast
    $window.location.href = '/#/dashboard';

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

sortingApp.controller('headerController', function($scope, userInformation, $window) {

  $scope.isLoggedIn = function() {
    //Check for undefined or true
    // console.log("headerController accessed!")
    if (userInformation.getIsLoggedIn() == false) {
      // console.log("The navbar should be log in!" + userInformation.getIsLoggedIn())
      return $scope.myText = '<li><a href="#about"><i class="material-icons left">info_outline</i>About</a></li><li><a href="#login"><i class="material-icons left">lock</i>Login</a></li>';

    } else{
      // console.log("The Navbar should be log out!" + userInformation.getIsLoggedIn())
      return $scope.myText = '<li><a href="#about"><i class="material-icons left">info_outline</i>About</a></li><li><a href="#dashboard"><i class="material-icons left">dashboard</i>Dashboard</a></li><li><a href="#myprofile"><i class="material-icons left">person</i>My Profile</a></li><li></li><li><a href="" ng-click="signOut()"><i class="material-icons left">exit_to_app</i>Log Out</a>';
    }
  }

  $scope.signOut = function signOut() {
    var auth2 = userInformation.getAuthInstance();
    auth2.signOut();
    userInformation.setIsLoggedIn(false);
    console.log("Setting Logged in to False")
    console.log('User signed out.');
    userInformation.destroy();
    Materialize.toast('Logged Out Successfully!', 5000) // 5000 is the duration of the toast
    $window.location.href = '/#/';

  }
});