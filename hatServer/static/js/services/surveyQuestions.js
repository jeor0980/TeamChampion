'use strict';

sortingApp.service('surveyQuestions', function () {
    var surveyName = "";
    var surveyDescription = 'HELLO JESSICA YOU DA BEST';
    var desiredSkills = ['Java', 'Python', 'PHP', 'C/C++', 'Mobile App Development (Android/iOS)', 'Web Applications', 'Embedded Systems', 'Database (MySQL, SQL, etc.)', 'User Interface/Experience', 'Statistics', 'Networking',
        'Robotics', 'Computer Vision', 'Algorithms', 'Machine Learning'];
    var projects = [];
    var firstName = {
        included: true,
        required: true
    };

    return {
        getSurveyName: function () {
            return surveyName;
        },
        setSurveyName: function (value) {
            surveyName = value;
        },

        getSurveyDescription: function () {
            return surveyDescription;
        },
        setSurveyDescription: function (value) {
            surveyDescription = value;
        },

        getDesiredSkills: function () {
            return desiredSkills;
        },
        setDesiredSkills: function (value) {
            desiredSkills = value;
        },

        getProjects: function () {
            return projects;
        },
        setProjects: function (value) {
            projects = value;
        },

        getFirstName: function () {
            return firstName;
        },
        setFirstName: function (field, value) {
            console.log('Set some stuff!');
            firstName[field] = value;
        }
    }
})