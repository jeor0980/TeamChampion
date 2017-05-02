//spec.js
describe('Sorting Hat Landing Page', function() {
	it('should have a title', function() {
		browser.get('http://localhost:5000/#/');

		expect(browser.getTitle()).toEqual('Sorting Hat');
	});
});