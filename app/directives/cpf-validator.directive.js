'use strict';

itauApp.directive('cpfValido', ['ValidacaoService', function (ValidacaoService) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$validators.cpf = function (modelValue) {
        if (!modelValue) { return true; }
        return ValidacaoService.cpfValido(modelValue);
      };
    }
  };
}]);

itauApp.directive('celularValido', ['ValidacaoService', function (ValidacaoService) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$validators.celular = function (modelValue) {
        if (!modelValue) { return true; }
        return ValidacaoService.celularValido(modelValue);
      };
    }
  };
}]);

itauApp.directive('maiorIdade', ['ValidacaoService', function (ValidacaoService) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$validators.maiorIdade = function (modelValue) {
        if (!modelValue) { return true; }
        return ValidacaoService.idadeMinima(modelValue, 18);
      };
    }
  };
}]);
