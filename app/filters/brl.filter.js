'use strict';

/**
 * Formata número como moeda brasileira: 1234.5 -> "R$ 1.234,50"
 */
itauApp.filter('brl', function () {
  return function (valor, semSimbolo) {
    if (valor === null || valor === undefined || valor === '' || isNaN(valor)) {
      return '';
    }
    var numero = parseFloat(valor);
    var negativo = numero < 0;
    var partes = Math.abs(numero).toFixed(2).split('.');
    var inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    var resultado = inteiro + ',' + partes[1];
    if (!semSimbolo) {
      resultado = 'R$ ' + resultado;
    }
    return (negativo ? '-' : '') + resultado;
  };
});
