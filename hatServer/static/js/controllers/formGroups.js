'use strict';

sortingApp.controller('formGroupsController', function ($scope, $http, $window, Upload) {
    $scope.uploadGroup = function (file) {
        console.log(file)
        Upload.upload({
            url: 'upload/group',
            headers: {
                'Content-Type': file.type
            },
            file: file
        }).then(function (resp) {
            console.log('Success ' + resp.config.file.name + ' uploaded. Response: ' + resp.config.file);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('Progress: ' + progressPercentage + '% ' + evt.config.file.name);
        });
    }

    $scope.uploadStudent = function (file) {
        console.log(file)
        Upload.upload({
            url: 'upload/student',
            headers: {
                'Content-Type': file.type
            },
            file: file
        }).then(function (resp) {
            console.log('Success ' + resp.config.file.name + ' uploaded. Response: ' + resp.config.file);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('Progress: ' + progressPercentage + '% ' + evt.config.file.name);
        });
    }

    $scope.createGroups = function () {
        Materialize.toast('Forming groups! Please wait...', 270000);
        var data = {};

        // Fire the API request
        $http.post('/sort', data).success(function (results) {
            $window.location.href = "#algorithmResults";
        }).error(function (err) {
            console.log(err);
        });
    }
});