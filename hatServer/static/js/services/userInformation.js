'use strict'; //interpreted as script mode

sortingApp.service('userInformation', function () {
    var isLoggedIn = false;
    var role = null;
    var id = null;
    var identikey = null;
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
      getIdentikey: function () {
          return identikey;
      },
      setIdentikey: function(value) {
          identikey = value;
      },
      getRole: function () {
          return role;
      },
      setRole: function(value) {
          role = value;
      },

      destroy: function() {
        role = null;
        isLoggedIn = false;
        id = null;
        fullName = null;
        givenName = null;
        familyName = null;
        email = null;
        idToken = null;
        imageUrl = null;
        authenticationInstance = null;
        console.log("User data was destroyed");
      },
  };
});