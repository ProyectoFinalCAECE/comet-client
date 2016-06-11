/**
 * @name ProjectAdminController
 * @desc Controller for the project-admin view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectAdminController', ProjectAdminController);

        ProjectAdminController.$inject = ['$log',
                                          '$rootScope',
                                          '$state',
                                          'ngToast',
                                          'constraints',
                                          'dialogService',
                                          'projectService',
                                          'user',
                                          'project',
                                          'tab'];

        function ProjectAdminController ( $log,
                                          $rootScope,
                                          $state,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          projectService,
                                          user,
                                          project,
                                          tab) {

          var vm = this;
          vm.project = project;
          vm.validationErrors = null;
          vm.invites = [];
          vm.invitesLimitReached = false;
          vm.membersPerProjectPerStep = constraints.membersPerProjectPerStep;

          // tabs
          vm.tabsState = {};
          vm.onTabSelected = onTabSelected;

          // update info
          vm.update = update;

          // invite / delete members
          vm.deleteMember = deleteMember;
          vm.isCurrentUser = isCurrentUser;
          vm.addInvite = addInvite;
          vm.removeInvite = removeInvite;
          vm.inviteMembers = inviteMembers;
          vm.sortType = 'fullName';
          vm.sortReverse = false;

          //close project
          vm.imSure = false;
          vm.closeProject = closeProject;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            if (!angular.isUndefined(tab)) {
              //vm.defaultTab = tab;
              vm.tabsState['tab' + tab] = true;
            }
          }

          /**
           * @name update
           * @desc project update logic
          */
          function update () {
            projectService.update(vm.project).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null) {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                var msg = 'El proyecto "' + vm.project.name +
                          '" ha sido editado exitosamente.';
                var dlg = dialogService.showModalAlert('Administrar proyecto', msg);
                dlg.result.then(function () {
                  $state.go('dashboard.project-list');
                });
            });
          }

          /**
           * @name deleteMember
           * @desc deletes selected members from project
          */
          function deleteMember (member) {
            var msg = '¿Esta seguro que desea eliminar el participante?',
                dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            
            dlg.result.then(function () {    
              projectService
                .deleteMember(vm.project.id, member).error(function(data) {
                  vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                  if (vm.validationErrors === null) {
                    ngToast.danger('Ocurrió un error al consultar al servidor.');
                  }
                })
                .then(function () {
                  var index = vm.project.members.indexOf(member);
                  vm.project.members.splice(index, 1);
                  ngToast.success('El participante ha sido eliminado.');     
                });
            });
          }

          /**
           * @name isCurrentUser
           * @desc returns if the member is the current logged in user
          */
          function isCurrentUser(member) {
            return member.email === user.email;
          }

          /**
           * @name addInvite
           * @desc adds an invite to the list of invites
          */
          function addInvite() {
            var indice = vm.invites.length + 1;
            if (indice <= constraints.membersPerProjectPerStep) {
              vm.invites.push({
                address: '',
                name: 'address_' + indice.toString()
              });
            } else {
               vm.invitesLimitReached = true;
            }
          }

          /**
           * @name removeInvite
           * @desc removes an invite to the list of invites
          */
          function removeInvite(invite) {
            vm.invitesLimitReached = false;
            vm.invites = $.grep(vm.invites, function(value) {
              return value !== invite;
            });
          }

          /**
           * @name inviteMembers
           * @desc calls the endpoint to invite people to the project
          */
          function inviteMembers() {
            $log.log(vm.invites);
            projectService.addInvitations(vm.project.id, vm.invites).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                var msg = 'Las invitaciones se enviaron exitosamente.';
                var dlg = dialogService.showModalAlert('Administrar proyecto', msg);
                dlg.result.finally(function () {
                  $state.go('dashboard.project.project-explore', { id: vm.project.id });
                });
            });
          }

          /**
           * @name closeProject
           * @desc calls the endpoint to close the project
          */
          function closeProject() {
            $log.log('close', vm.project.id);
            projectService.close(vm.project.id).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                var msg = 'El proyecto se cerró exitosamente.';
                var dlg = dialogService.showModalAlert('Administrar proyecto', msg);
                dlg.result.finally(function () {
                  $state.go('dashboard.project-list');
                });
            });
          }

          /**
           * @name onTabSelected
           * @desc event fired when a tab is selected
           */
          function onTabSelected (tab) {
            vm.validationErrors = null;
            if (tab === 2) {
              // members tab
              if (vm.invites.length === 0) {
                vm.addInvite();
              }
            }
          }
        }
})();
