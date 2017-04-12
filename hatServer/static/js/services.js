'use strict';

// service to store profile information for a user
sortingApp.service('userInformation', function () {
    
    var id = '';
    var fullName = 'placeholderfullname';
    var givenName = '';
    var familyName = '';
    var email = '';
    var idToken = '';
    var imageUrl = '';
    var authenticationInstance = '';

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
  };
});

sortingApp.service('surveyResults', function() {

});