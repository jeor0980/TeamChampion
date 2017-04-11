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

sortingApp.controller('createSurveyController', function($scope, $http, $timeout) {

    $scope.message = 'Here instructors can create surveys!';
    $scope.comments = "";

    $scope.firstProj = ['Proj 1', 'Proj 2', 'Proj 3'];

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
            $scope.validateSurvey();
    	}).error(function(err) {
    		console.log(err);
    	})
    };

    $scope.validateSurvey = function() {
        console.log('VALIDATING DAT SURVEY DO');
        var timeout = "";

        var poller = function() {
            $http.get('/#/surveySuccess').success(function(data, status, headers, config) {
                if (status === 202) {
                    console.log(status);
                } else if (status === 200) {
                    console.log("yassssss");
                    $timeout.cancel(timeout);
                    return false;
                }

                timeout = $timeout(poller, 2000);
            }).error(function(err) {
                console.log(err);
            });
        };
        poller();
    }
});

sortingApp.controller('surveySuccessController', function($scope) {
    $scope.message = 'Congratulations! Your results have been submitted!';
});