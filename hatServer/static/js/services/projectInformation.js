'use strict';

sortingApp.service('projectInformation', function () {
    var projectOne = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "One"
    };
    var projectTwo = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Two"
    };
    var projectThree = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Three"
    };
    var projectFour = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Four"
    };
    var projectFive = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Five"
    };
    var projectSix = {
        skills: [],
        ipPref: "",
        name: "",
        paid: true,
        number: "Six"
    };
    var projectSeven = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Seven"
    };
    var projectEight = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Eight"
    };
    var projectNine = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Nine"
    };
    var projectTen = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Ten"
    };
    var projectEleven = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Eleven"
    };
    var projectTwelve = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Twelve"
    };
    var projectThirteen = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Thirteen"
    };
    var projectFourteen = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Fourteen"
    };
    var projectFifteen = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Fifteen"
    };
    var projectSixteen = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Sixteen"
    };
    var projectSeventeen = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Seventeen"
    };
    var projectEighteen = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Eighteen"
    };
    var projectNineteen = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Nineteen"
    };
    var projectTwenty = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "Twenty"
    };
    var projectTwentyOne = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "TwentyOne"
    };
    var projectTwentyTwo = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "TwentyTwo"
    };
    var projectTwentyThree = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "TwentyThree"
    };
    var projectTwentyFour = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "TwentyFour"
    };
    var projectTwentyFive = {
        skills: {},
        ipPref: "",
        name: "",
        paid: true,
        number: "TwentyFive"
    };
    var projects = [projectOne, projectTwo, projectThree, projectFour, projectFive, projectSix, projectSeven, projectEight, projectNine, projectTen, projectEleven, projectTwelve, projectThirteen, projectFourteen, projectFifteen, projectSixteen, projectSeventeen, projectEighteen, projectNineteen, projectTwenty, projectTwentyOne, projectTwentyTwo, projectTwentyThree, projectTwentyFour, projectTwentyFive];

    return {
        getProjects: function () {
            return projects;
        },
        addProjects: function (value) {
            projects.push(value);
        },
        setProjects: function (value) {
            projects = value;
        },

        getProjectOne: function () {
            return projectOne;
        },
        setProjectOne: function (value) {
            projectOne = value;
        },

        getProjectTwo: function () {
            return projectTwo;
        },
        setProjectTwo: function (value) {
            projectTwo = value;
        },

        getProjectThree: function () {
            return projectThree;
        },
        setProjectThree: function (value) {
            projectThree = value;
        },

        getProjectFour: function () {
            return projectFour;
        },
        setProjectFour: function (value) {
            projectFour = value;
        },

        getProjectFive: function () {
            return projectFive;
        },
        setProjectFive: function (value) {
            projectFive = value;
        },

        getProjectSix: function () {
            return projectSix;
        },
        setProjectSix: function (value) {
            projectSix = value;
        },

        getProjectSeven: function () {
            return projectSeven;
        },
        setProjectSeven: function (value) {
            projectSeven = value;
        },

        getProjectEight: function () {
            return projectOne;
        },
        setProjectEight: function (value) {
            projectEight = value;
        },

        getProjectNine: function () {
            return projectNine;
        },
        setProjectNine: function (value) {
            projectNine = value;
        },

        getProjectTen: function () {
            return projectTen;
        },
        setProjectTen: function (value) {
            projectTen = value;
        },

        getProjectEleven: function () {
            return projectEleven;
        },
        setProjectEleven: function (value) {
            projectEleven = value;
        },

        getProjectTwelve: function () {
            return projectTwelve;
        },
        setProjectTwelve: function (value) {
            projectTwelve = value;
        },

        getProjectThirteen: function () {
            return projectThirteen;
        },
        setProjectThirteen: function (value) {
            projectThirteen = value;
        },

        getProjectFourteen: function () {
            return projectFourteen;
        },
        setProjectFourteen: function (value) {
            projectFourteen = value;
        },

        getProjectFifteen: function () {
            return projectFifteen;
        },
        setProjectFifteen: function (value) {
            projectFifteen = value;
        },

        getProjectSixteen: function () {
            return projectSixteen;
        },
        setProjectSixteen: function (value) {
            projectSixteen = value;
        },

        getProjectSeventeen: function () {
            return projectSeventeen;
        },
        setProjectSeventeen: function (value) {
            projectSeventeen = value;
        },

        getProjectEighteen: function () {
            return projectEighteen;
        },
        setProjectEighteen: function (value) {
            projectEighteen = value;
        },

        getProjectNineteen: function () {
            return projectNineteen;
        },
        setProjectNineteen: function (value) {
            projectNineteen = value;
        },

        getProjectTwenty: function () {
            return projectTwenty;
        },
        setProjectTwenty: function (value) {
            projectTwenty = value;
        },

        getProjectTwentyOne: function () {
            return projectTwentyOne;
        },
        setProjectTwentyOne: function (value) {
            projectTwentyOne = value;
        },

        getProjectTwentyTwo: function () {
            return projectTwentyTwo;
        },
        setProjectTwentyTwo: function (value) {
            projectTwentyTwo = value;
        },

        getProjectTwentyThree: function () {
            return projectTwentyThree;
        },
        setProjectTwentyThree: function (value) {
            projectTwentyThree = value;
        },

        getProjectTwentyFour: function () {
            return projectTwentyFour;
        },
        setProjectTwentyFour: function (value) {
            projectTwentyFour = value;
        },

        getProjectTwentyFive: function () {
            return projectTwentyFive;
        },
        setProjectTwentyFive: function (value) {
            projectTwentyFive = value;
        }
    }
});