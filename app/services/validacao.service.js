'use strict';

itauApp.factory('ValidacaoService', function () {
  function cpfValido(cpf) {
    var d = String(cpf || '').replace(/\D/g, '');
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) { return false; }
    var soma, resto, i;
    soma = 0;
    for (i = 0; i < 9; i++) { soma += parseInt(d.charAt(i), 10) * (10 - i); }
    resto = (soma * 10) % 11;
    if (resto === 10) { resto = 0; }
    if (resto !== parseInt(d.charAt(9), 10)) { return false; }
    soma = 0;
    for (i = 0; i < 10; i++) { soma += parseInt(d.charAt(i), 10) * (11 - i); }
    resto = (soma * 10) % 11;
    if (resto === 10) { resto = 0; }
    return resto === parseInt(d.charAt(10), 10);
  }

  function celularValido(cel) {
    var d = String(cel || '').replace(/\D/g, '');
    return d.length === 11 && d.charAt(2) === '9';
  }

  function idadeMinima(dataNascimento, minimo) {
    if (!dataNascimento) { return false; }
    var nasc = new Date(dataNascimento);
    if (isNaN(nasc.getTime())) { return false; }
    var hoje = new Date();
    var idade = hoje.getFullYear() - nasc.getFullYear();
    var m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) { idade--; }
    return idade >= (minimo || 18);
  }

  return {
    cpfValido: cpfValido,
    celularValido: celularValido,
    idadeMinima: idadeMinima
  };
});
