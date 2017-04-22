// create the controller and inject Angular's $scope
sortingApp.controller('mainController', function($scope, userInformation) {
    // create a message to display in our view
    $scope.message = 'I AM YOUR FATHER!';

    $scope.printt = function() {
      console.log('Tacos are the best!');
  }
});

sortingApp.controller('profileController', function($scope, $window, userInformation) {
    // $scope.pageTitle = 'My Profile | Sorting Hat';
    $scope.message = 'Look! I am an about page.';

    //Check if user is authenticated
    if (userInformation.getIsLoggedIn() == false){
      window.alert("You must be logged in to view this page.");
      $window.location.href = '/';
    }
    
    // $scope.fullName = userInformation.getFullName();
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

sortingApp.controller('takeSurveyController', function($scope, $http, $window, surveyResults) {
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
            }
            for (field in $scope.desired) {
                surveyResults.setDesired(field);
            }

            $scope.submitted = false;

            $window.location.href = '#/takeSurvey3';
        }
    }

    $scope.sendSurvey = function(form) {
        console.log("Getting results");

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
        surveyResults.setPreferredPartners($scope.requestedPartners);
        surveyResults.setBannedPartners($scope.bannedPartners);
        surveyResults.setIpPreference($scope.ipPref);
        surveyResults.setLeadershipRole($scope.lead);

        // turn data into a service so it persists across webpages
    	var data = {
    		'firstName' : surveyResults.getFirstName(),
    		'lastName' : surveyResults.getLastName(),
            'preferredName' : surveyResults.getPreferredName(),
            'identikey' : surveyResults.getIdentikey(),
            'gpa' : surveyResults.getOverallGPA(),
            'csgpa' : surveyResults.getCsGPA(),
    		//'email' : $scope.email,
            'firstChoice' : surveyResults.getFirstChoice(),
            'secondChoice' : surveyResults.getSecondChoice(),
            'thirdChoice' : surveyResults.getThirdChoice(),
            'firstChoiceComments' : surveyResults.getFirstChoiceComment(),
            'secondChoiceComments' : surveyResults.getSecondChoiceComment(),
            'thirdChoiceComments' : surveyResults.getThirdChoiceComment(),
            'requestedPartners' : surveyResults.getPreferredPartners(),
            'bannedPartners' : surveyResults.getBannedPartners(),
            'skills' : surveyResults.getSkills(),
            'desired' : surveyResults.getDesired(),
            'ipPref' : surveyResults.getIpPreference(),
            'lead' : surveyResults.getLeadershipRole(),
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

sortingApp.controller('dashboardController', function($scope, $window, userInformation) {

    //Check if user is authenticated
    if (userInformation.getIsLoggedIn() == false){
      window.alert("You must be logged in to view this page.");
      $window.location.href = '/';
    }   

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