// create the controller and inject Angular's $scope
sortingApp.controller('mainController', function($scope, userInformation) {
    // create a message to display in our view
    $scope.message = 'I AM YOUR FATHER!';

    // if (userInformation.getIsLoggedIn() == false) {
    //   console.log(userInformation.getIsLoggedIn())
    //   return $scope.myText = '<a href="#login"><i class="material-icons left">lock</i>Login</a>';
    // } else {
    //   return $scope.myText = '<a href="#/" ng-click="signOut();"><i class="material-icons left">exit_to_app</i>Log Out</a>';
    // }

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

});

sortingApp.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

sortingApp.controller('loginController', function($scope) {


});


sortingApp.controller('GoogleCtrl', function($route, $scope, userInformation) {

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
    // console.log(userInformation.getIsLoggedIn());


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

sortingApp.controller('headerController', function($scope, userInformation, $sce) {

  $scope.isLoggedIn = function() {
    //Check for undefined or true
    console.log("headerController accessed!")
    if (userInformation.getIsLoggedIn() == false) {
      console.log("The navbar should be log in!" + userInformation.getIsLoggedIn())
      return $scope.myText = '<a href="#login"><i class="material-icons left">lock</i>Login</a>';
    } else{
      console.log("The Navbar should be log out!" + userInformation.getIsLoggedIn())
      return $scope.myText = '<a href="" ng-click="signOut()"><i class="material-icons left">exit_to_app</i>Log Out</a>';
    }
  }

  $scope.signOut = function signOut() {
    var auth2 = userInformation.getAuthInstance();
    auth2.signOut();
    userInformation.setIsLoggedIn(false);
    console.log("Setting Logged in to False")
    console.log('User signed out.');
  }

 
  // console.log(userInformation.isLoggedIn);
  // $scope.isActive = function (viewLocation) { 
  //     return viewLocation === $location.path();
  // };

});