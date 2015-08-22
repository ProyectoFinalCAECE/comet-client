(function() {
    'use strict';

    angular
        .module('cometApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['autenticacionService'];

    function HomeController (autenticacionService) {

        var vm = this;

        vm.estaLogueado = autenticacionService.estaLogueado;
        vm.usuarioActual = autenticacionService.usuarioActual;
        vm.logout = autenticacionService.logout;

        console.log(autenticacionService.usuarioActual());
    }
})();