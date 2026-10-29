'use strict';

/**
 * Formata CPF: "12345678909" -> "123.456.789-09"
 */
itauApp.filter('cpf', function () {
  return function (valor) {
    if (!valor) { return ''; }
    var digitos = String(valor).replace(/\D/g, '').substr(0, 11);
    return digitos
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };
});
