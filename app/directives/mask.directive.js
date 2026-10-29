'use strict';

/**
 * Máscara de input simples (legado, sem lib): <input ui-mascara="999.999.999-99">
 * O model guarda somente os dígitos.
 */
itauApp.directive('uiMascara', function () {
  function aplicar(digitos, mascara) {
    var saida = '';
    var j = 0;
    for (var i = 0; i < mascara.length && j < digitos.length; i++) {
      if (mascara.charAt(i) === '9') {
        saida += digitos.charAt(j++);
      } else {
        saida += mascara.charAt(i);
      }
    }
    return saida;
  }

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      var mascara = attrs.uiMascara;
      var maxDigitos = (mascara.match(/9/g) || []).length;

      ngModel.$parsers.push(function (valor) {
        var digitos = String(valor || '').replace(/\D/g, '').substr(0, maxDigitos);
        var formatado = aplicar(digitos, mascara);
        if (formatado !== valor) {
          ngModel.$setViewValue(formatado);
          ngModel.$render();
        }
        return digitos;
      });

      ngModel.$formatters.push(function (valor) {
        return aplicar(String(valor || '').replace(/\D/g, ''), mascara);
      });
    }
  };
});
