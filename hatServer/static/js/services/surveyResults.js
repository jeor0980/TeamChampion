'use strict';

sortingApp.service('surveyResults', function () {
    var firstName = '';
    var lastName = '';
    var identikey = '';
    var overallGPA = null;
    var csGPA = null;
    var skills = {
        overallProgramming: null,
        databaseDevelopment: null,
        embeddedSystems: null,
        webApplications: null,
        mobileApplications: null,
        userInterfaceExperience: null,
        statistics: null,
        socialProfessionalNetworking: null,
        security: null,
        robotics: null,
        computerVision: null,
        algorithms: null,
        machineLearning: null
    };
    var firstChoice = null;
    var secondChoice = null;
    var thirdChoice = null;
    var ipPreference = null;
    var leadershipRole = null;

    // non-required fields
    var preferredName = null;
    var desired = {};
    var firstChoiceComment = null;
    var secondChoiceComment = null;
    var ThirdChoiceComment = null;
    var preferredPartners = [];
    var bannedPartners = [];

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

        getIdentikey: function () {
            return identikey;
        },
        setIdentikey: function (value) {
            identikey = value;
        },

        getOverallGPA: function () {
            return overallGPA;
        },
        setOverallGPA: function (value) {
            overallGPA = value;
        },

        getCsGPA: function () {
            return csGPA;
        },
        setCsGPA: function () {
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
        setDesired: function (value, field) {
            desired[field] = value;
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
        }
    };
});