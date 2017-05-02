// conf.js
exports.config = {
  //we will be using Jasmine for the test framework
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  //tells protractor where your test files are:
  specs: ['spec.js']
}