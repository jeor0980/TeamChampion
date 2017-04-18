'use strict'; //interpreted as script mode

// create the module and name it sortingApp
// also include ngRoute for all our routing needs
var sortingApp = angular.module('sortingApp', ['ngRoute', 'ngSanitize']);


sortingApp.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}])


sortingApp.service('userInformation', function () {
    var isLoggedIn = false;
    var id = null;
    var fullName = null;
    var givenName = null;
    var familyName = null;
    var email = null;
    var idToken = null;
    var imageUrl = null;
    var authenticationInstance = null;


  return {

      getId: function () {
          return id;
      },
      setId: function(value) {
          id = value;
      },      

      getFullName: function () {
          return fullName;
      },
      setFullName: function(value) {
          fullName = value;
      },

      getGivenName: function () {
          return givenName;
      },
      setGivenName: function(value) {
          givenName = value;
      },
      getFamilyName: function () {
          return familyName;
      },
      setFamilyName: function(value) {
          familyName = value;
      },

      getEmail: function () {
          return email;
      },
      setEmail: function(value) {
          email = value;
      },

      getIdToken: function () {
          return idToken;
      },
      setIdToken: function(value) {
          idToken = value;
      },
      getImageUrl: function () {
          return imageUrl;
      },
      setImageUrl: function(value) {
          imageUrl = value;
      },

      getAuthInstance: function () {
          return authenticationInstance;
      },
      setAuthInstance: function(value) {
          authenticationInstance = value;
      },
      getIsLoggedIn: function () {
          return isLoggedIn;
      },
      setIsLoggedIn: function(value) {
          isLoggedIn = value;
      },

      destroy: function() {
      var isLoggedIn = false;
      var id = null;
      var fullName = null;
      var givenName = null;
      var familyName = null;
      var email = null;
      var idToken = null;
      var imageUrl = null;
      var authenticationInstance = null;
      console.log("Session was destroyed");
      },
  };
});