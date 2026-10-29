'use strict';

itauApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider
    .when('/', {
      templateUrl: 'app/views/home.html',
      controller: 'HomeController',
      title: 'Abra sua conta no Banco Itaú'
    })
    .when('/cartoes', {
      templateUrl: 'app/views/cartoes.html',
      controller: 'CartoesController',
      title: 'Cartões de crédito'
    })
    .when('/emprestimos', {
      templateUrl: 'app/views/emprestimos.html',
      controller: 'EmprestimosController',
      title: 'Empréstimos e Financiamentos'
    })
    .when('/agencias', {
      templateUrl: 'app/views/agencias.html',
      controller: 'AgenciasController',
      title: 'Encontre agências'
    })
    .when('/abra-sua-conta', {
      templateUrl: 'app/views/abra-conta.html',
      controller: 'AbraContaController',
      title: 'Abra sua conta'
    })
    .otherwise({ redirectTo: '/' });
}]);
