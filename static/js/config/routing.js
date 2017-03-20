'use strict'; //interpreted as script mode 

//Think of app.js being here if it wasn't in a different file


// configure our routes
sortingApp.config(function($routeProvider) {

    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : './templates/home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : './templates/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : './templates/contact.html',
            controller  : 'contactController'
        })

        // route for the login page
        .when('/login', {
            templateUrl : './templates/login.html',
            controller  : 'loginController'
        })

        // route for creating a new survey
        .when('/createSurvey', {
            templateUrl : './templates/createSurvey.html',
            controller : 'createSurveyController'
        });

});

// Controllers are found in the main.js 