'use strict';

itauApp.controller('HomeController', ['$scope', '$location', '$q', 'ProdutosService', 'CartoesService',
  function ($scope, $location, $q, ProdutosService, CartoesService) {
    $scope.carregando = true;
    $scope.erro = null;
    $scope.buscaAgencia = { termo: '' };

    $scope.apps = [
      { nome: 'Itaú', classe: 'app-itau' },
      { nome: 'Itaú Personnalité', classe: 'app-personnalite' },
      { nome: 'Itaú Empresas', classe: 'app-empresas' }
    ];

    $q.all({
      banners: ProdutosService.getBanners(),
      atalhos: ProdutosService.getAtalhos(),
      produtos: ProdutosService.getProdutos(),
      destaques: ProdutosService.getDestaques(),
      cartoes: CartoesService.maisPedidos()
    }).then(function (r) {
      $scope.banners = r.banners;
      $scope.atalhos = r.atalhos;
      $scope.produtos = r.produtos;
      $scope.destaques = r.destaques;
      $scope.cartoesMaisPedidos = r.cartoes;
    }, function () {
      $scope.erro = 'Não foi possível carregar o conteúdo. Tente novamente.';
    })['finally'](function () {
      $scope.carregando = false;
    });

    $scope.buscarAgencia = function () {
      $location.path('/agencias').search({ q: $scope.buscaAgencia.termo || null });
    };
  }]);
