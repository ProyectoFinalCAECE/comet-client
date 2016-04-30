/**
 * HomeController Unit Tests
 */
(function() {
    'use strict';

    describe('Testing HomeController', function () {

      var homeController;

      beforeEach(function () {
        module('cometApp');
      });

      beforeEach(inject(function($controller) {
        homeController = $controller('HomeController');
      }));

      it ('should have a isLoggedIn prop', function () {
        console.log('homeController', homeController);
        expect(homeController.isLoggedIn).toBeDefined();
      });
    });

})();
