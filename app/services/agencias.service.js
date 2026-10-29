'use strict';

itauApp.service('AgenciasService', ['ApiService', function (ApiService) {
  var self = this;

  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .replace(/[áàâã]/g, 'a')
      .replace(/[éê]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[óôõ]/g, 'o')
      .replace(/[ú]/g, 'u')
      .replace(/[ç]/g, 'c');
  }

  self.listar = function () {
    return ApiService.get('agencias');
  };

  /**
   * Busca agências por endereço, bairro, cidade, número da agência ou CEP.
   */
  self.buscar = function (termo) {
    return self.listar().then(function (agencias) {
      var t = normalizar(termo).trim();
      if (!t) { return agencias; }
      var tDigitos = t.replace(/\D/g, '');
      return agencias.filter(function (a) {
        var alvo = normalizar([a.nome, a.endereco, a.bairro, a.cidade, a.uf].join(' '));
        if (alvo.indexOf(t) !== -1) { return true; }
        if (tDigitos.length >= 3) {
          return a.numero.indexOf(tDigitos) !== -1 || a.cep.replace(/\D/g, '').indexOf(tDigitos) === 0;
        }
        return false;
      });
    });
  };
}]);
