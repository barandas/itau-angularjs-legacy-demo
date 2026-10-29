'use strict';

itauApp.controller('EmprestimosController', ['$scope', 'SimuladorService', function ($scope, SimuladorService) {
  $scope.form = { tipo: 'pessoal', valor: 10000, meses: 24 };
  $scope.resultado = null;
  $scope.cronograma = [];
  $scope.mostrarCronograma = false;

  SimuladorService.getTaxas().then(function (taxas) {
    $scope.taxas = taxas;
    $scope.simular();
  });

  $scope.produtoAtual = function () {
    return $scope.taxas ? $scope.taxas[$scope.form.tipo] : null;
  };

  $scope.simular = function () {
    var p = $scope.produtoAtual();
    if (!p) { return; }
    var valor = parseFloat($scope.form.valor) || 0;
    var meses = parseInt($scope.form.meses, 10) || 0;
    $scope.erroSimulacao = null;

    if (valor < p.valorMin || valor > p.valorMax) {
      $scope.erroSimulacao = 'O valor deve estar entre R$ ' + p.valorMin + ' e R$ ' + p.valorMax + '.';
      $scope.resultado = null;
      return;
    }
    if (meses < p.prazoMin || meses > p.prazoMax) {
      $scope.erroSimulacao = 'O prazo deve estar entre ' + p.prazoMin + ' e ' + p.prazoMax + ' meses.';
      $scope.resultado = null;
      return;
    }

    $scope.resultado = SimuladorService.simular(valor, p.taxaMensal, meses);
    $scope.cronograma = SimuladorService.gerarCronograma(valor, p.taxaMensal, meses);
  };

  $scope.$watchGroup(['form.tipo', 'form.valor', 'form.meses'], function () {
    $scope.simular();
  });
}]);
