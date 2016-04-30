/**
 * ProjectExploreController Unit Tests
 */
(function() {
    'use strict';

    describe('Testing ProjectExploreController', function () {

      var scope, controller, mockProject;

      beforeEach(function () {
        module('cometApp');
      });

      beforeEach(inject(function($controller,
                 _$rootScope_,
                 _$state_,
                 _dialogService_,
                 _dashboardServiceModel_,
                 _projectService_) {

        mockProject = {
          state: 'C'
        };

        controller = $controller('ProjectExploreController', {
          $rootScope: _$rootScope_,
          $state: _$state_,
          dialogService:_dialogService_,
          dashboardServiceModel:_dashboardServiceModel_,
          projectService:_projectService_,
          project: mockProject
        });
      }));

      it ('should have a gotoEditProject function', function () {
        expect(controller.gotoEditProject).toBeDefined();
      });

      it ('should have a project property', function () {
        expect(controller.project).toBeDefined();
      });

      it ('should have a project property equals to the injected', function () {
        expect(controller.project).toEqual(mockProject);
      });

      it ('should have a project property', function () {
        expect(controller.isClosed).toBe(true);
      });
    });

})();
