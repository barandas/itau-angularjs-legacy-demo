'use strict';

describe('EmprestimosController', function () {
  var $controller;
  var $httpBackend;
  var $rootScope;
  var $scope;

  beforeEach(module('itauApp'));

  beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_) {
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    $httpBackend.expectGET('data/taxas.json').respond(200, {
      pessoal: { nome: 'Empréstimo pessoal', taxaMensal: 0.0399, prazoMin: 6, prazoMax: 48, valorMin: 500, valorMax: 50000 },
      consignado: { nome: 'Consignado CLT', taxaMensal: 0.0219, prazoMin: 12, prazoMax: 84, valorMin: 1000, valorMax: 150000 },
      renegociacao: { nome: 'Renegociação', taxaMensal: 0.0179, prazoMin: 12, prazoMax: 72, valorMin: 500, valorMax: 200000 }
    });
    $controller('EmprestimosController', { $scope: $scope });
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('sets an error when the requested amount is out of range', function () {
    $scope.form.valor = 100;
    $httpBackend.flush();

    expect($scope.erroSimulacao).toBe('O valor deve estar entre R$ 500 e R$ 50000.');
    expect($scope.resultado).toBeNull();
  });

  it('sets a simulation result for a valid request', function () {
    $httpBackend.flush();

    expect($scope.erroSimulacao).toBeNull();
    expect($scope.resultado.valorSolicitado).toBe(10000);
    expect($scope.resultado.meses).toBe(24);
  });
});
