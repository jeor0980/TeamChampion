'use strict';

sortingApp.service('surveyResults', function () {
    // store generic information the student inputs
    var firstName = 'Jessica';
    var lastName = 'Petty';
    var identikey = '';
    var overallGPA = 4.0;
    var csGPA = 4.0;
    // dictionary to store how the students ranked themselves in each skill
    var skills = {
        overallProgramming: 'expert',
        databaseDevelopment: 'basic',
        embeddedSystems: 'none',
        webApplications: 'good',
        mobileApplications: 'basic',
        userInterface: 'good',
        statistics: 'expert',
        networking: 'basic',
        security: 'none',
        robotics: 'none',
        computerVision: 'none',
        algorithms: 'good',
        machineLearning: 'basic'
    };
    // store information about the student's project, IP, and leadership preferences
    var firstChoice = null;
    var secondChoice = null;
    var thirdChoice = null;
    var fourthChoice = null;
    var fifthChoice = null;
    var ipPreference = "NO_PREF";
    var leadershipRole = "STRONG_FOLLOW";
    // array of skills student ranked as 'expert' or 'good'
    var finalSkills = [];

    // default non-required fields
    var preferredName = "Jess";
    var desired = [];
    var firstChoiceComment = "This project seemed interesting!";
    var secondChoiceComment = "I'd love the chance to work on user interface problems!";
    var thirdChoiceComment = "I think the sponsor seemed nice";
    var fourthChoiceComment = "My friend Jesus also put this one down";
    var fifthChoiceComment = "This one seemed like a challenge";
    var preferredPartners = ["Jesus Ortiz", "Nika Shafranov", "Hayden Reich", "Jordan Peters"];
    var bannedPartners = [];

    // getter and setter functions for each field a student is to complete
    // TODO: check for null values and set to default values
    return {
        getFirstName: function () {
            return firstName;
        },
        setFirstName: function (value) {
            firstName = value;
        },

        getLastName: function () {
            return lastName;
        },
        setLastName: function (value) {
            lastName = value;
        },

       /* getIdentikey: function () {
            return identikey;
        },
        setIdentikey: function (value) {
            identikey = value;
        },*/

        getOverallGPA: function () {
            return overallGPA;
        },
        setOverallGPA: function (value) {
            overallGPA = value;
        },

        getCsGPA: function () {
            return csGPA;
        },
        setCsGPA: function (value) {
            csGPA = value;
        },

        getSkills: function () {
            return skills;
        },
        setSkills: function (value, field) {
            skills[field] = value;
        },

        getFirstChoice: function () {
            return firstChoice
        },
        setFirstChoice: function (value) {
            firstChoice = value;
        },

        getSecondChoice: function () {
            return secondChoice;
        },
        setSecondChoice: function (value) {
            secondChoice = value;
        },

        getThirdChoice: function () {
            return thirdChoice;
        },
        setThirdChoice: function (value) {
            thirdChoice = value;
        },

        getFourthChoice: function () {
            return fourthChoice;
        },
        setFourthChoice: function (value) {
            fourthChoice = value;
        },

        getFifthChoice: function () {
            return fifthChoice;
        },
        setFifthChoice: function (value) {
            fifthChoice = value;
        },

        getIpPreference: function () {
            return ipPreference;
        },
        setIpPreference: function (value) {
            ipPreference = value;
        },

        getLeadershipRole: function () {
            return leadershipRole;
        },
        setLeadershipRole: function (value) {
            leadershipRole = value;
        },

        getPreferredName: function () {
            return preferredName;
        },
        setPreferredName: function (value) {
            preferredName = value;
        },

        getDesired: function () {
            return desired;
        },
        setDesired: function (value) {
            desired.push(value);
        },

        getFirstChoiceComment: function () {
            return firstChoiceComment;
        },
        setFirstChoiceComment: function (value) {
            firstChoiceComment = value;
        },

        getSecondChoiceComment: function () {
            return secondChoiceComment;
        },
        setSecondChoiceComment: function (value) {
            secondChoiceComment = value;
        },

        getThirdChoiceComment: function () {
            return thirdChoiceComment;
        },
        setThirdChoiceComment: function (value) {
            thirdChoiceComment = value;
        },

        getFourthChoiceComment: function () {
            return fourthChoiceComment;
        },
        setFourthChoiceComment: function (value) {
            fourthChoiceComment = value;
        },

        getFifthChoiceComment: function () {
            return fifthChoiceComment;
        },
        setFifthChoiceComment: function (value) {
            fifthChoiceComment = value;
        },

        getPreferredPartners: function () {
            return preferredPartners;
        },
        setPreferredPartners: function (value) {
            preferredPartners = value;
        },

        getBannedPartners: function () {
            return bannedPartners;
        },
        setBannedPartners: function (value) {
            bannedPartners = value;
        },

        getFinalSkills: function () {
            return finalSkills;
        },
        setFinalSkills: function (value) {
            // push individual skills ranked 'expert' or 'good' to skills array
            finalSkills.push(value);
        }
    };
});