// create the controller and inject Angular's $scope
sortingApp.controller('mainController', function ($scope, userInformation, Upload) {
});


sortingApp.controller('sortController', function ($scope, $http, userInformation) {

    //Check if user is authenticated
    $scope.givenName = userInformation.getGivenName();

    if (userInformation.getIsLoggedIn() == false) {
        window.alert("You must be logged in to view this page.");
        $window.location.href = '/';
    }
    //Check if user is authenticated
    $scope.givenName = userInformation.getGivenName();

    if (userInformation.getIsLoggedIn() == false) {
        window.alert("You must be logged in to view this page.");
        $window.location.href = '/';
    }

    data = {};

    $scope.sortStudents = function () {
        // Fire the API request
        $http.post('/sort', data).success(function (results) {
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

sortingApp.controller('surveySuccessController', function($scope, userInformation) {

    //Check if user is authenticated
    $scope.givenName = userInformation.getGivenName();

    if (userInformation.getIsLoggedIn() == false){
      window.alert("You must be logged in to view this page.");
      $window.location.href = '/';
    }   

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