'use strict';

itauApp.controller('AgenciasController', ['$scope', '$routeParams', '$location', 'AgenciasService',
  function ($scope, $routeParams, $location, AgenciasService) {
    $scope.busca = { termo: $location.search().q || '', somenteAcessiveis: false };
    $scope.agencias = [];
    $scope.carregando = false;
    $scope.localizacaoMsg = null;

    $scope.buscar = function () {
      $scope.carregando = true;
      AgenciasService.buscar($scope.busca.termo).then(function (lista) {
        $scope.agencias = lista;
      })['finally'](function () {
        $scope.carregando = false;
      });
    };

    $scope.filtroAcessivel = function (agencia) {
      return !$scope.busca.somenteAcessiveis || agencia.acessivel;
    };

    $scope.usarLocalizacao = function () {
      $scope.localizacaoMsg = 'Demonstração: exibindo agências de São Paulo.';
      $scope.busca.termo = 'São Paulo';
      $scope.buscar();
    };

    $scope.buscar();
  }]);
