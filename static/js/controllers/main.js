// create the controller and inject Angular's $scope
sortingApp.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

sortingApp.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

sortingApp.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

sortingApp.controller('loginController', function($scope) {
    $scope.message = 'A login screen will go here!';
});

sortingApp.controller('createSurveyController', function($scope, $http) {

    $scope.message = 'Here instructors can create surveys!';
    $scope.projectListOptions = {
    	'one' : 'Project One',
    	'two' : 'Project Two',
    	'three' : 'Project Three',
    	'four' : 'Project Four',
    	'five' : 'Project Five'
    };

    $scope.firstProj = ['Proj 1', 'Proj 2', 'Proj 3'];
    $scope.food = "taco";

    $scope.sendSurvey = function() {
    	console.log("Getting results");

    	var data = {
    		'firstName' : $scope.firstName,
    		'lastName' : $scope.lastName,
    		'email' : $scope.email,
    		'comments' : $scope.comments
    	};

    	// Fire the API request
    	$http.post('/createSurvey', data).success(function(results) {
    		console.log('RESULTS');
    	}).error(function(err) {
    		console.log(err);
    	})
    }
})