'use strict';

describe('AbraContaController', function () {
  var $controller;
  var $rootScope;
  var $scope;
  var $timeout;

  beforeEach(module('itauApp'));

  beforeEach(inject(function (_$controller_, _$rootScope_, _$timeout_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    $scope = $rootScope.$new();
    $controller('AbraContaController', { $scope: $scope });
  }));

  it('does not advance when the form is invalid', function () {
    var form = { $invalid: true, $setSubmitted: jasmine.createSpy('$setSubmitted') };

    $scope.avancar(form);

    expect(form.$setSubmitted).toHaveBeenCalled();
    expect($scope.etapa).toBe(1);
  });

  it('advances when the form is valid', function () {
    var form = { $invalid: false, $setSubmitted: jasmine.createSpy('$setSubmitted') };

    $scope.avancar(form);

    expect($scope.etapa).toBe(2);
  });

  it('submits asynchronously and creates a demo protocol', function () {
    var form = { $invalid: false, $setSubmitted: jasmine.createSpy('$setSubmitted') };

    $scope.enviar(form);
    expect($scope.enviando).toBe(true);

    $timeout.flush();

    expect($scope.etapa).toBe(3);
    expect($scope.protocolo).toMatch(/^DEMO-/);
    expect($scope.enviando).toBe(false);
  });
});
