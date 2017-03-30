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

sortingApp.controller('createSurveyController', function($scope) {
    $scope.message = 'Here instructors can create surveys!';
});
