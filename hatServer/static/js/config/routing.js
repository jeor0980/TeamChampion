'use strict'; //interpreted as script mode 

//Think of app.js being here if it wasn't in a different file
// Controllers are found in the main.js 


// Configure our routes
sortingApp.config(function($routeProvider) {

    $routeProvider

        // route for the home page
        .when('/', {
        		title: 'Home',
            templateUrl : 'static/partials/home.html',
            // controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
        		title: 'About',
            templateUrl : 'static/partials/about.html',
            // controller  : 'aboutController'
        })

        // route for the contact page
        .when('/dashboard', {
        		title: 'Dashboard',
            templateUrl : 'static/partials/dashboard.html',
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
            // controller  : 'loginController'
        })

        // route for creating a new survey
        .when('/takeSurvey', {
        		title: 'Take Survey',
            templateUrl : 'static/partials/takeSurvey.html',
            controller : 'takeSurveyController'
        })

        // route for when survey is submitted
        .when('/surveySuccess', {
            templateUrl : 'static/partials/surveySuccess.html',
            controller : 'surveySuccessController'
        });

});

sortingApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title + ' | Sorting Hat';
    });
}]);
