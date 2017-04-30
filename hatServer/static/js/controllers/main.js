// create the controller and inject Angular's $scope
sortingApp.controller('mainController', function ($scope, userInformation, Upload) {
    $scope.upload = function (file) {
        console.log(file)
        Upload.upload({
            url: 'upload/url',
            headers: {
                'Content-Type': file.type
            },
            file: file
        }).then(function (resp) {
            console.log('Success ' + resp.config.file.name + ' uploaded. Response: ' + resp.config.file);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('Progress: ' + progressPercentage + '% ' + evt.config.file.name);
        });
    }
});

sortingApp.controller('buildController', function ($scope, $http) {
    data = {};

    $scope.buildBitches = function () {
        // Fire the API request
        $http.post('/build', data).success(function (results) {
            console.log('BUILDING THEM BITCHES');
        }).error(function (err) {
            console.log(err);
        });
    }
});

sortingApp.controller('sortController', function ($scope, $http) {
    data = {};

    $scope.sortBitches = function () {
        // Fire the API request
        $http.post('/sort', data).success(function (results) {
            console.log('SORTING THEM BITHCES');
        }).error(function (err) {
            console.log(err);
        });
    }
});

sortingApp.controller('profileController', function($scope, $window, userInformation) {
    //TODO: Destroy function

    //Check if user is authenticated
    if (userInformation.getIsLoggedIn() == false){
      window.alert("You must be logged in to view this page.");
      $window.location.href = '/';
    }
    
    // Grab user information to display on page from the userInformation service 
    $scope.role = userInformation.getRole();
    $scope.fullName = userInformation.getFullName();
    $scope.givenName = userInformation.getGivenName();
    $scope.familyName = userInformation.getFamilyName();
    $scope.email = userInformation.getEmail();
    $scope.imageUrl = userInformation.getImageUrl();


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

    $scope.sendSurvey = function(form) {
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
    		'firstName' : surveyResults.getFirstName(),
    		'lastName' : surveyResults.getLastName(),
            'preferredName' : surveyResults.getPreferredName(),
            'identikey' : surveyResults.getIdentikey(),
            'gpa' : surveyResults.getOverallGPA(),
            'csgpa' : surveyResults.getCsGPA(),
    		//'email' : $scope.email,
            'firstChoice' : surveyResults.getFirstChoice(),
            'secondChoice' : surveyResults.getSecondChoice(),
            'thirdChoice': surveyResults.getThirdChoice(),
            'fourthChoice': surveyResults.getFourthChoice(),
            'fifthChoice' : surveyResults.getFifthChoice(),
            'firstChoiceComments' : surveyResults.getFirstChoiceComment(),
            'secondChoiceComments' : surveyResults.getSecondChoiceComment(),
            'thirdChoiceComments': surveyResults.getThirdChoiceComment(),
            'fourthChoiceComments': surveyResults.getFourthChoiceComment(),
            'fifthChoiceComments' : surveyResults.getFifthChoiceComment(),
            'requestedPartners' : surveyResults.getPreferredPartners(),
            'bannedPartners': surveyResults.getBannedPartners(),
            'skills': surveyResults.getFinalSkills(),
            //'skills' : surveyResults.getSkills(),
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


sortingApp.controller('GoogleCtrl', function($route, $scope, $window, $http, userInformation) {

  function onSignIn(googleUser) {
    
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

    //This variable is passed to userService to for Google Authentication
    var authentication = gapi.auth2.getAuthInstance();
    userInformation.setId(profile.getId()); // Don't send this directly to your server!
    userInformation.setIdToken(id_token);
    userInformation.setAuthInstance(authentication);

    //Grab first 8 characters from email, which in theory should be the indentikey (aaaaxxxx)@colorado.edu
    userInformation.setIdentikey(profile.getEmail().substring(0, 8));

    // Check if user is allowed to be in this site
    $http.get('../static/js/config/users.json').success (function(data){
      $scope.userData = data;

      // Case 1: Identikey is found in users.json file
      if ($scope.userData.hasOwnProperty(userInformation.getIdentikey())) {
        
        //Get data from google and set information in the userInformation controls        
        userInformation.setFullName(profile.getName());
        userInformation.setGivenName(profile.getGivenName());
        userInformation.setFamilyName(profile.getFamilyName());
        userInformation.setImageUrl(profile.getImageUrl());
        userInformation.setEmail(profile.getEmail());
        userInformation.setIsLoggedIn(true);
        userInformation.setRole($scope.userData[userInformation.getIdentikey()].role);

        //Role Stuff
        // console.log("what is your role?");
        // console.log("My role is " + userInformation.getRole());
        // console.log(userInformation.getIdentikey() + " The identikey in JSON File!");
        // console.log("User Authenticated Successfully!");

        //Confirm login to user
        Materialize.toast('Logged In Successfully!', 5000) // 5000 is the duration of the toast

        //Redirect to appropriate dashboard after login
        // Case 1: Student Dashboard
        if (userInformation.getRole() == 'student') {
          $window.location.href = '/#/dashboard';
        }

        //Case 2: Instructore Dashboard
        else if (userInformation.getRole() == 'instructor') {
          $window.location.href = '/#/instructorDashboard';
        }

        //Case 3 (unlikely, mostly for debugging purposes)
        //If identikey is in user.json but has no role or an invalid role
        else {
          console.log('You are neither a student or instructor, what is your role?')
        }
      }

      else {
        //Case 2: If identikey is not found in users.json file
        console.log(userInformation.getEmail() + " Not in JSON File!")
        var auth2 = userInformation.getAuthInstance();
        auth2.signOut();
        userInformation.setIsLoggedIn(false);
        userInformation.destroy();
        Materialize.toast('Please log in with a Colorado.edu account!', 5000); // 5000 is the duration of the toast
        console.log("Setting Logged in to False");
        console.log('User signed out.');
      }
    });

  }

  window.onSignIn = onSignIn;

});

sortingApp.controller('dashboardController', function($scope, $window, userInformation) {

    //Check if user is authenticated
    $scope.givenName = userInformation.getGivenName();

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

    } else if (userInformation.getIsLoggedIn() == true && userInformation.getRole() == "student"){
      // console.log("The Navbar should be log out!" + userInformation.getIsLoggedIn())
      return $scope.myText = '<li><a href="#about"><i class="material-icons left">info_outline</i>About</a></li><li><a href="#dashboard"><i class="material-icons left">dashboard</i>Dashboard</a></li><li><a href="#myprofile"><i class="material-icons left">person</i>My Profile</a></li><li></li><li><a href="" ng-click="signOut()"><i class="material-icons left">exit_to_app</i>Log Out</a>';
    
    } else if (userInformation.getIsLoggedIn() == true && userInformation.getRole() == "instructor"){
      // console.log("The Navbar should be log out!" + userInformation.getIsLoggedIn())
      return $scope.myText = '<li><a href="#about"><i class="material-icons left">info_outline</i>About</a></li><li><a href="#instructorDashboard"><i class="material-icons left">dashboard</i>Instructor Dashboard</a></li><li><a href="#myprofile"><i class="material-icons left">person</i>My Profile</a></li><li></li><li><a href="" ng-click="signOut()"><i class="material-icons left">exit_to_app</i>Log Out</a>';
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