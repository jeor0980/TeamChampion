'use strict';

sortingApp.service('surveyQuestions', function () {
    var surveyName = null;
    var surveyDescription = 'HELLO JESSICA YOU DA BEST';
    var desiredSkills = ['Java', 'Python', 'PHP', 'C/C++', 'Mobile App Development (Android/iOS)', 'Web Applications', 'Embedded Systems', 'Database (MySQL, SQL, etc.)', 'User Interface/Experience', 'Statistics', 'Networking',
    'Robotics', 'Computer Vision', 'Algorithms', 'Machine Learning'];

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
        }
    }
})