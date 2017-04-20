'use strict'; //interpreted as script mode 

//Think of app.js being here if it wasn't in a different file
// Controllers are found in the main.js 


// Configure our routes
sortingApp.config(function($routeProvider) {

    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'static/partials/home.html',
            // controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'static/partials/about.html',
            // controller  : 'aboutController'
        })

        // route for the contact page
        .when('/dashboard', {
            templateUrl : 'static/partials/dashboard.html',
            controller  : 'dashboardController'
        })

        // route for the profile page
        .when('/myprofile', {
            templateUrl : 'static/partials/myprofile.html',
            controller  : 'profileController'
        })        

        // route for the login page
        .when('/login', {
            templateUrl : 'static/partials/login.html',
            // controller  : 'loginController'
        })

        // route for creating a new survey
        .when('/takeSurvey', {
            templateUrl : 'static/partials/takeSurvey.html',
            controller : 'takeSurveyController'
        })

        // route for when survey is submitted
        .when('/surveySuccess', {
            templateUrl : 'static/partials/surveySuccess.html',
            controller : 'surveySuccessController'
        });

});

