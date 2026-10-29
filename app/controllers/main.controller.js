'use strict';

itauApp.controller('MainController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
  $rootScope.menuAberto = false;
  $scope.anoAtual = new Date().getFullYear();

  $scope.estaAtivo = function (rota) {
    return $location.path() === rota;
  };

  $scope.alternarMenu = function () {
    $rootScope.menuAberto = !$rootScope.menuAberto;
  };
}]);
