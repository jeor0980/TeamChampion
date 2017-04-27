'use strict';

sortingApp.service('surveyQuestions', function () {
    var surveyName = "";
    var surveyDescription = 'HELLO JESSICA YOU DA BEST';
    var maxSkills = 10;
    var desiredSkills = ['Java', 'Python', 'PHP', 'C/C++', 'Mobile App Development (Android/iOS)', 'Web Applications', 'Embedded Systems', 'Database (MySQL, SQL, etc.)', 'User Interface/Experience', 'Statistics', 'Networking',
        'Robotics', 'Computer Vision', 'Algorithms', 'Machine Learning'];
    var studentCount = null;
    var groupSizes = {
        min: 4,
        max: 6,
        opt: 5
    };
    var firstName = {
        included: true,
        required: true
    };
    var lastName = {
        included: true,
        required: true
    };
    var preferredName = {
        included: true,
        required: false
    };
    var overallGPA = {
        included: true,
        required: true
    };
    var csGPA = {
        included: true,
        required: true
    };
    var skillCategories = {
        expert: true,
        good: true,
        basic: true,
        none: true
    };
    var overallProgramming = {
        included: true,
        required: true
    };
    var databaseDevelopment = {
        included: true,
        required: true
    };
    var embeddedSystems = {
        included: true,
        required: true
    };
    var webApplications = {
        included: true,
        required: true
    };
    var mobileApplications = {
        included: true,
        required: true
    };
    var userInterface = {
        included: true,
        required: true
    };
    var statistics = {
        included: true,
        required: true
    };
    var networking = {
        included: true,
        required: true
    };
    var security = {
        included: true,
        required: true
    };
    var robotics = {
        included: true,
        required: true
    };
    var computerVision = {
        included: true,
        required: true
    };
    var algorithms = {
        included: true,
        required: true
    };
    var machineLearning = {
        included: true,
        required: true
    };
    var firstChoice = {
        included: true,
        required: true
    };
    var firstComment = {
        included: true,
        required: false
    };
    var secondChoice = {
        included: true,
        required: true
    };
    var secondComment = {
        included: true,
        required: false
    };
    var thirdChoice = {
        included: true,
        required: true
    };
    var thirdComment = {
        included: true,
        required: false
    };
    var fourthChoice = {
        included: true,
        required: true
    };
    var fourthComment = {
        included: true,
        required: false
    };
    var fifthChoice = {
        included: true,
        required: true
    };
    var fifthComment = {
        included: true,
        required: false
    };
    var ipPreference = {
        included: true,
        required: true
    };
    var ipOptions = {
        retain: 'Prefer to retain IP rights to my work',
        retainIncluded: true,
        depends: 'Depends on the project',
        dependsIncluded: true,
        noPref: 'I don\'t have a preference to retain IP rights to my work',
        noPrefIncluded: true
    };
    var leadership = {
        included: true,
        required: true,
        important: true
    };
    var leadershipOptions = {
        strongFollow: 'Strongly prefer to be a follower rather than a leader',
        strongFollowIncluded: true,
        preferFollow: 'Prefer to be a follower, but will lead when necessary',
        preferFollowIncluded: true,
        equalLead: 'Enjoy leading and following equally',
        equalLeadIncluded: true,
        preferLead: 'Prefer to be a leader, but will follow when necessary',
        preferLeadIncluded: true,
        strongLead: 'Strongly prefer to be the leader; do not enjoy being a follower',
        strongLeadIncluded: true
    };
    var preferredPartners = {
        included: true,
        required: false
    };
    var bannedPartners = {
        included: true,
        required: false
    };
    var maxScore = 3.5;
    var changeRatings = true;
    var weights = {
        known: 1,
        learn: 2,
        group: 5,
        ip: 0.5,
        extraCredit: 1
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

        getStudentCount: function () {
            return studentCount;
        },
        setStudentCount: function (value) {
            studentCount = value;
        },

        getGroupSizes: function () {
            return groupSizes;
        },
        setGroupSizes: function (value) {
            groupSizes = value;
        },

        getMaxSkills: function () {
            return maxSkills;
        },
        setMaxSkills: function (value) {
            maxSkills = value;
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
        setFirstName: function (value) {
            firstName = value;
        },

        getLastName: function () {
            return lastName;
        },
        setLastName: function (value) {
            lastName = value;
        },

        getPreferredName: function () {
            return preferredName;
        },
        setPreferredName: function (value) {
            preferredName = preferredName;
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
        setCsGPA: function (value) {
            csGPA = value;
        },

        getSkillCategories: function () {
            return skillCategories;
        },
        setSkillCategories: function (value) {
            skillCategories = value;
        },

        getOverallProgramming: function () {
            return overallProgramming;
        },
        setOverallProgramming: function (value) {
            overallProgramming = value;
        },

        getDatabaseDevelopment: function () {
            return databaseDevelopment;
        },
        setDatabaseDevelopment: function (value) {
            databaseDevelopment = value;
        },

        getEmbeddedSystems: function () {
            return embeddedSystems;
        },
        setEmbeddedSystems: function (value) {
            embeddedSystems = value;
        },

        getWebApplications: function () {
            return webApplications;
        },
        setWebApplications: function (value) {
            webApplications = value;
        },

        getMobileApplications: function () {
            return mobileApplications;
        },
        setMobileApplications: function (value) {
            mobileApplications = value;
        },

        getUserInterface: function () {
            return userInterface;
        },
        setUserInterface: function (value) {
            userInterface = value;
        },

        getStatistics: function () {
            return statistics;
        },
        setStatistics: function (value) {
            statistics = value;
        },

        getNetworking: function() {
            return networking;
        },
        setNetworking: function(value) {
            networking = value;
        },

        getSecurity: function() {
            return security;
        },
        setSecurity: function (value) {
            security = value;
        },

        getRobotics: function () {
            return robotics;
        },
        setRobotics: function (value) {
            robotics = value;
        },

        getComputerVision: function () {
            return computerVision;
        },
        setComputerVision: function (value) {
            computerVision = value;
        },

        getAlgorithms: function () {
            return algorithms;
        },
        setAlgorithms: function (value) {
            algorithms = value;
        },

        getMachineLearning: function () {
            return machineLearning;
        },
        setMachineLearning: function (value) {
            machineLearning = value;
        },

        getFirstChoice: function () {
            return firstChoice;
        },
        setFirstChoice: function (value) {
            firstChoice = value;
        },

        getFirstComment: function () {
            return firstComment;
        },
        setFirstComment: function (value) {
            firstComment = value;
        },

        getSecondChoice: function () {
            return secondChoice;
        },
        setSecondChoice: function (value) {
            secondChoice = value;
        },

        getSecondComment: function () {
            return secondComment;
        },
        setSecondComment: function (value) {
            secondComment = value;
        },

        getThirdChoice: function () {
            return thirdChoice;
        },
        setThirdChoice: function (value) {
            thirdChoice = value;
        },

        getThirdComment: function () {
            return thirdComment;
        },
        setThirdComment: function (value) {
            thirdComment = value;
        },

        getFourthChoice: function () {
            return fourthChoice;
        },
        setFourthChoice: function (value) {
            fourthChoice = value;
        },

        getFourthComment: function () {
            return fourthComment;
        },
        setFourthComment: function (value) {
            fourthComment = value;
        },

        getFifthChoice: function () {
            return fifthChoice;
        },
        setFifthChoice: function (value) {
            fifthChoice = value;
        },

        getFifthComment: function () {
            return fifthComment;
        },
        setFifthComment: function (value) {
            fifthComment = value;
        },

        getIpPreference: function () {
            return ipPreference;
        },
        setIpPreference: function (value) {
            ipPreference = value;
        },

        getIpOptions: function () {
            return ipOptions;
        },
        setIpOptions: function (value) {
            ipOptions = value;
        },

        getLeadership: function () {
            return leadership;
        },
        setLeadership: function (value) {
            leadership = value;
        },

        getLeadershipOptions: function () {
            return leadershipOptions;
        },
        setLeadershipOptions: function (value) {
            leadershipOptions = value;
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

        getMaxScore: function () {
            return maxScore;
        }, 
        setMaxScore: function (value) {
            maxScore = value;
        },

        getChangeRatings: function () {
            return changeRatings;
        },
        setChangeRatings: function (value) {
            changeRatings = value;
        },

        getWeights: function () {
            return weights;
        },
        setWeights: function (value) {
            weights = value;
        }
    }
})