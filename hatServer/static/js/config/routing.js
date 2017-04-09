'use strict'; //interpreted as script mode 

//Think of app.js being here if it wasn't in a different file


// configure our routes
sortingApp.config(function($routeProvider) {

    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'static/partials/home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'static/partials/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'static/partials/contact.html',
            controller  : 'contactController'
        })

        // route for the login page
        .when('/login', {
            templateUrl : 'static/partials/login.html',
            controller  : 'loginController'
        })

        // route for creating a new survey
        .when('/createSurvey', {
            templateUrl : 'static/partials/createSurvey.html',
            controller : 'createSurveyController'
        });

});

// Controllers are found in the main.js 