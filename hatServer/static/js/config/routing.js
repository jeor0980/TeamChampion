'use strict'; //interpreted as script mode 

//Think of app.js being here if it wasn't in a different file
// Controllers are found in the main.js 


// Configure our routes
sortingApp.config(function($routeProvider) {

    $routeProvider

        // route for the home page
        .when('/', {
            title: 'Home',
            templateUrl: 'static/partials/home.html'
            // controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            title: 'About',
            templateUrl: 'static/partials/about.html'
            // controller  : ''
        })

        // route for the contact page
        .when('/dashboard', {
            title: 'Dashboard',
            templateUrl: 'static/partials/dashboard.html',
            controller: 'dashboardController'
        })

        // route for the contact page
        .when('/instructorDashboard', {
            title: 'Instructor Dashboard',
            templateUrl: 'static/partials/instructorDashboard.html',
            controller: 'dashboardController'
        })

        // route for the profile page
        .when('/myprofile', {
            title: 'My Profile',
            templateUrl: 'static/partials/myprofile.html',
            controller: 'profileController'
        })

        // route for the login page
        .when('/login', {
            title: 'Login',
<<<<<<< HEAD
            templateUrl : 'static/partials/login.html',
=======
            templateUrl: 'static/partials/login.html',
>>>>>>> 3a9513255fe820ccb5575c8827602d40e089efa4
        })

        // route for taking a new survey
        .when('/takeSurvey', {
            title: 'Take Survey',
            templateUrl: 'static/partials/takeSurvey.html',
            controller: 'takeSurveyController'
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

        // route for when instructor is either uploading survey data or running the algorithm
        .when('/formGroups', {
            title: 'Form Groups',
            templateUrl: 'static/partials/formGroups.html',
            controller: 'formGroupsController'
        })

        // route for when instructor is manually inputting project data
        .when('/projectsInput', {
            title: 'Projects',
            templateUrl: 'static/partials/projectsInput.html',
            controller: 'projectsInputController'
        })

        // route for when algorithm has finished running and is displaying grouping information
        .when('/algorithmResults', {
            title: 'Algorithm Results',
            templateUrl: 'static/partials/algorithmResults.html',
            controller: 'displayResultsController'
        });
});

sortingApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title + ' | Sorting Hat';
    });
}]);
