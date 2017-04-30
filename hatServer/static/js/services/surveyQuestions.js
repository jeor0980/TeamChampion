'use strict';

sortingApp.service('surveyQuestions', function () {
    var surveyName = "";
    var surveyDescription = 'HELLO JESSICA YOU DA BEST';
    var maxSkills = null; // max number of skills a student can request to learn
    // skills a student may want to learn
    var desiredSkills = ['Java', 'Python', 'PHP', 'C/C++', 'Mobile App Development (Android/iOS)', 'Web Applications', 'Embedded Systems', 'Database (MySQL, SQL, etc.)', 'User Interface/Experience', 'Statistics', 'Networking',
        'Robotics', 'Computer Vision', 'Algorithms', 'Machine Learning'];
    var studentCount = null; // student count for the algorithm
    var projectCount = 25; // project count to dynamically load only the projects that are needed
    // algorithm requests knowing the instructor's minimum, maximum, and optimum group sizes
    var groupSizes = {
        min: null,
        max: null,
        opt: null
    };
    // variables for creating the student surveys: 
    // included denotes whether a field will be displayed, required denotes whether a student must provide information
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
    // students will be asked to rank themselves in certain skills, of these categories
    var skillCategories = {
        expert: true,
        good: true,
        basic: true,
        none: true
    };
    // Categories a student will be asked to rank themselves in terms of competency
    var rankedCategories = {
        overallProgramming: {
            included: true,
            required: true,
            name: 'overallProgramming',
            label: 'Overall Programming'
        },
        databaseDevelopment: {
            included: true,
            required: true,
            name: 'databaseDevelopment',
            label: 'Database Development'
        },
        embeddedSystems: {
            included: true,
            required: true,
            name: 'embeddedSystems',
            label: 'Embedded Systems'
        },
        webApplications: {
            included: true,
            required: true,
            name: 'webApplications',
            label: 'Web Applications'
        },
        mobileApplications: {
            included: true,
            required: true,
            name: 'mobileApplications',
            label: 'Mobile Applications'
        },
        userInterface: {
            included: true,
            required: true,
            name: 'userInterface',
            label: 'User Interface/Experience'
        },
        statistics: {
            included: true,
            required: true,
            name: 'statistics',
            label: 'Statistics'
        },
        networking: {
            included: true,
            required: true,
            name: 'networking',
            label: '(Social/Professional) Networking'
        },
        security: {
            included: true,
            required: true,
            name: 'security',
            label: 'Security'
        },
        robotics: {
            included: true,
            required: true,
            name: 'robotics',
            label: 'Robotics'
        },
        computerVision: {
            included: true,
            required: true,
            name: 'computerVision',
            label: 'Computer Vision'
        },
        algorithms: {
            included: true,
            required: true,
            name: 'algorithms',
            label: 'Algorithms'
        },
        machineLearning: {
            included: true,
            required: true,
            name: 'machineLearning',
            label: 'Machine Learning'
        }
    };
    // Holds data about what elements of project preferences students will be required to input
    var projectPreferences = {
        firstChoice: {
            included: true,
            required: true,
            label: 'First Choice',
            name: 'firstChoice'
        },
        firstComment: {
            included: true,
            required: false,
            label: 'First Choice Comment',
            name: 'firstComment'
        },
        secondChoice: {
            included: true,
            required: true,
            label: 'Second Choice',
            name: 'secondChoice'
        },
        secondComment: {
            included: true,
            required: false,
            label: 'Second Choice Comment',
            name: 'secondComment'
        },
        thirdChoice: {
            included: true,
            required: true,
            label: 'Third Choice',
            name: 'thirdChoice'
        },
        thirdComment: {
            included: true,
            required: false,
            label: 'Third Choice Comment',
            name: 'thirdComment'
        },
        fourthChoice: {
            included: true,
            required: true,
            label: 'Fourth Choice',
            name: 'fourthChoice'
        },
        fourthComment: {
            included: true,
            required: false,
            label: 'Fourth Choice Comment',
            name: 'fourthComment'
        },
        fifthChoice: {
            included: true,
            required: true,
            label: 'Fifth Choice',
            name: 'fifthChoice'
        },
        fifthComment: {
            included: true,
            required: false,
            label: 'Fifth Choice Comment',
            name: 'fifthComment'
        }
    };
    // Whether a student will be asked and required to answer questions about their ip preferences
    var ipPreference = {
        included: true,
        required: true
    };
    // the different options a student may answer for their ip preferences
    var ipOptions = {
        retain: 'Prefer to retain IP rights to my work',
        retainIncluded: true,
        depends: 'Depends on the project',
        dependsIncluded: true,
        noPref: 'I don\'t have a preference to retain IP rights to my work',
        noPrefIncluded: true
    };
    // whether a student will be asked and required to answer questions about their leadership preferences
    // important is for the algorithm: whether leadership should play a factor in group formation
    var leadership = {
        included: true,
        required: true,
        important: true
    };
    // The options a student may select for their leadership preferences
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
    // whether a student will be asked and required to input who they'd like to work with
    var preferredPartners = {
        included: true,
        required: false
    };
    // whether a student will be asked and required to input who they won't work with
    var bannedPartners = {
        included: true,
        required: false
    };
    // highest (in magnitude) preference score allowed for any paid project
    var maxScore = null;
    // flag whether the preference rankings of paid projects may be altered
    var changeRatings = false;
    // The algorithm will use these weights to sort accounting for the relative importance of each of these
    var weights = {
        known: null,
        learn: null,
        group: null,
        ip: null,
        extraCredit: null
    };

    // getter and setter methods for all of the above fields
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

        getProjectCount: function () {
            return projectCount;
        },
        setProjectCount: function (value) {
            projectCount = value;
        },

        getGroupSizes: function () {
            return groupSizes;
        },
        setGroupSizes: function (value) {
            groupSizes = value;
        },
        // set the group size of an individual field in the dictionary
        setGroupSize: function (field, value) {
            groupSizes[field] = value;
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

        getFirstName: function () {
            return firstName;
        },
        setFirstName: function (value) {
            firstName = value;
            // ensure that if a field is not included, the survey won't think it's a required field
            if (!firstName.included) firstName.required = false;
        },

        getLastName: function () {
            return lastName;
        },
        setLastName: function (value) {
            lastName = value;
            if (!lastName.included) lastName.required = false;
        },

        getPreferredName: function () {
            return preferredName;
        },
        setPreferredName: function (value) {
            preferredName = preferredName;
            if (!preferredName.included) preferredName.required = false;
        },

        getOverallGPA: function () {
            return overallGPA;
        },
        setOverallGPA: function (value) {
            overallGPA = value;
            if (!overallGPA.included) overallGPA.required = false;
        },

        getCsGPA: function () {
            return csGPA;
        },
        setCsGPA: function (value) {
            csGPA = value;
            if (!csGPA.included) csGPA.required = false;
        },

        getSkillCategories: function () {
            return skillCategories;
        },
        setSkillCategories: function (value) {
            skillCategories = value;
        },

        getRankedCategories: function () {
            return rankedCategories;
        },
        setRankedCategories: function (value) {
            rankedCategories = value;
            // loop through all categories students are asked to rank and make sure they're only required
            // if they're included
            for (var category in rankedCategories) {
                if (!rankedCategories[category]['included']) rankedCategories[category]['required'] = false;
            }
        },

        getProjectPreferences: function () {
            return projectPreferences;
        },
        setProjectPreferences: function (value) {
            projectPreferences = value;
            for (var question in projectPreferences) {
                if (!projectPreferences[question]['included']) projectPreferences[question]['required'] = false;
            }
        },

        getIpPreference: function () {
            return ipPreference;
        },
        setIpPreference: function (value) {
            ipPreference = value;
            if (!ipPreference.included) ipPreference.required = false;
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
            if (!leadership.included) leadership.required = false;
        },
        setLeadershipValue: function (field, value) {
            leadership[field] = value;
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
            if (!preferredPartners.included) preferredPartners.required = false;
        },

        getBannedPartners: function () {
            return bannedPartners;
        },
        setBannedPartners: function (value) {
            bannedPartners = value;
            if (!bannedPartners.included) bannedPartners.required = false;
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
        },
        // method to set a single weight out of the dictionary of weights
        setWeight: function (field, value) {
            weights[field] = value;
        }
    }
})