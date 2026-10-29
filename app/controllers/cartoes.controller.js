'use strict';

itauApp.controller('CartoesController', ['$scope', 'CartoesService', function ($scope, CartoesService) {
  $scope.todos = [];
  $scope.cartoes = [];
  $scope.criterios = { renda: null, programa: 'qualquer', semAnuidade: false };
  $scope.ordenacao = 'anuidade';
  $scope.selecionado = null;

  $scope.programas = [
    { valor: 'qualquer', nome: 'Todos os benefícios' },
    { valor: 'viagem', nome: 'Milhas e viagens' },
    { valor: 'pontos', nome: 'Pontos' },
    { valor: 'cashback', nome: 'Cashback e descontos' },
    { valor: 'sem-anuidade', nome: 'Sem anuidade' }
  ];

  CartoesService.listar().then(function (lista) {
    $scope.todos = lista;
    $scope.aplicarFiltros();
  });

  $scope.aplicarFiltros = function () {
    $scope.cartoes = CartoesService.filtrar($scope.todos, $scope.criterios);
  };

  $scope.$watch('criterios', function (novo, antigo) {
    if (novo !== antigo) { $scope.aplicarFiltros(); }
  }, true);

  $scope.limpar = function () {
    $scope.criterios = { renda: null, programa: 'qualquer', semAnuidade: false };
  };

  $scope.pedir = function (cartao) {
    $scope.selecionado = cartao;
    $('#modalPedido').modal('show');
  };
}]);
