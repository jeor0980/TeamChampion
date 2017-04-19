'use strict'; //interpreted as script mode

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