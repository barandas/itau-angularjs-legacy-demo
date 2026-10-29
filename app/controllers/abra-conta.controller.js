'use strict';

itauApp.controller('AbraContaController', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.etapa = 1;
  $scope.enviando = false;
  $scope.dados = {
    nome: '',
    cpf: '',
    email: '',
    celular: '',
    nascimento: null,
    tipoConta: 'corrente',
    aceite: false
  };

  $scope.tiposConta = [
    { valor: 'corrente', nome: 'Conta corrente', descricao: 'Pix, cartão de crédito e investimentos em um só lugar.' },
    { valor: 'universitaria', nome: 'Conta universitária', descricao: 'Para estudantes de graduação, sem tarifa mensal.' },
    { valor: 'pj', nome: 'Conta PJ (MEI)', descricao: 'Para o seu negócio crescer.' }
  ];

  $scope.avancar = function (form) {
    form.$setSubmitted();
    if (form.$invalid) { return; }
    $scope.etapa++;
  };

  $scope.voltar = function () {
    if ($scope.etapa > 1) { $scope.etapa--; }
  };

  $scope.enviar = function (form) {
    form.$setSubmitted();
    if (form.$invalid) { return; }
    $scope.enviando = true;
    // Simula chamada ao backend (nenhum dado sai do navegador)
    $timeout(function () {
      $scope.enviando = false;
      $scope.protocolo = 'DEMO-' + Math.floor(100000 + Math.random() * 900000);
      $scope.etapa = 3;
    }, 1200);
  };
}]);
