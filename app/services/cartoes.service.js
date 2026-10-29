'use strict';

itauApp.service('CartoesService', ['ApiService', function (ApiService) {
  var self = this;

  self.listar = function () {
    return ApiService.get('cartoes');
  };

  self.maisPedidos = function () {
    return self.listar().then(function (cartoes) {
      var resultado = [];
      for (var i = 0; i < cartoes.length; i++) {
        if (cartoes[i].maisPedido) {
          resultado.push(cartoes[i]);
        }
      }
      return resultado;
    });
  };

  /**
   * Filtra cartões elegíveis pela renda e programa de benefícios.
   * @param {Array} cartoes
   * @param {Object} criterios { renda: Number, programa: String, semAnuidade: Boolean }
   */
  self.filtrar = function (cartoes, criterios) {
    criterios = criterios || {};
    var resultado = [];
    angular.forEach(cartoes, function (cartao) {
      if (cartao.programa === 'todos') { return; }
      if (criterios.renda && cartao.rendaMinima > criterios.renda) { return; }
      if (criterios.programa && criterios.programa !== 'qualquer' && cartao.programa !== criterios.programa) { return; }
      if (criterios.semAnuidade && cartao.anuidade > 0) { return; }
      resultado.push(cartao);
    });
    return resultado;
  };
}]);
