'use strict'; //interpreted as script mode 

//Think of app.js being here if it wasn't in a different file
// Controllers are found in the main.js 


// Configure our routes
sortingApp.config(function($routeProvider) {

    $routeProvider

        // route for the home page
        .when('/', {
            title: 'Home',
            templateUrl : 'static/partials/home.html'
            // controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            title: 'About',
            templateUrl : 'static/partials/about.html'
            // controller  : ''
        })

        // route for the contact page
        .when('/dashboard', {
            title: 'Dashboard',
            templateUrl : 'static/partials/dashboard.html',
            controller  : 'dashboardController'
        })

        // route for the contact page
        .when('/instructorDashboard', {
            title: 'Instructor Dashboard',
            templateUrl : 'static/partials/instructorDashboard.html',
            controller  : 'dashboardController'
        })

        // route for the profile page
        .when('/myprofile', {
            title: 'My Profile',
            templateUrl : 'static/partials/myprofile.html',
            controller  : 'profileController'
        })

        // route for the login page
        .when('/login', {
            title: 'Login',
            templateUrl : 'static/partials/login.html',
        })

        // route for the login page
        .when('/login', {
            templateUrl: 'static/partials/login.html'
            // controller  : 'loginController'
        })

        // route for taking a new survey
        .when('/takeSurvey', {
            title: 'Take Survey',
            templateUrl : 'static/partials/takeSurvey.html',
            controller : 'takeSurveyController'
        })

        // route for the second page of the survey
        .when('/takeSurvey2', {
            tite: 'Take Survey',
            templateUrl: 'static/partials/takeSurvey2.html',
            controller: 'takeSurveyController'
        })

        // route for the third page of the survey 
        // there should be a way to generically do this
        .when('/takeSurvey3', {
            title: 'Take Survey',
            templateUrl: 'static/partials/takeSurvey3.html',
            controller: 'takeSurveyController'
        })

        // route for creating survey
        .when('/createSurvey', {
            title: 'Create Survey',
            templateUrl: 'static/partials/createSurvey.html',
            controller: 'createSurveyController'
        })

        // route for when survey is submitted
        .when('/surveySuccess', {
            title: 'Submitted Survey',
            templateUrl: 'static/partials/surveySuccess.html',
        })

        .when('/sort', {
            templateUrl: 'static/partials/sort.html',
            controller: 'sortController'
        })

        .when('/formGroups', {
            title: 'Form Groups',
            templateUrl: 'static/partials/formGroups.html',
            controller: 'formGroupsController'
        })

        .when('/projectsInput', {
            title: 'Projects',
            templateUrl: 'static/partials/projectsInput.html',
            controller: 'projectsInputController'
        })

        .when('/algorithmResults', {
            title: 'Algorithm Results',
            templateUrl: 'static/partials/algorithmResults.html',
        })

        .when('/build', {
            templateUrl: 'static/partials/build.html',
            controller: 'buildController'
        });

});

sortingApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title + ' | Sorting Hat';
    });
}]);
