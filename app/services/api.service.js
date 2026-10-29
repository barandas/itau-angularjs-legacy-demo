'use strict';

/**
 * Wrapper legado sobre $http com cache manual em memória.
 */
itauApp.factory('ApiService', ['$http', '$q', 'APP_CONFIG', function ($http, $q, APP_CONFIG) {
  var cache = {};

  function get(recurso) {
    if (cache[recurso]) {
      return $q.when(cache[recurso]);
    }
    return $http.get(APP_CONFIG.apiBase + recurso + '.json').then(function (resposta) {
      cache[recurso] = resposta.data;
      return resposta.data;
    }, function (erro) {
      console.error('[ApiService] Falha ao carregar ' + recurso, erro);
      return $q.reject(erro);
    });
  }

  function limparCache() {
    cache = {};
  }

  return {
    get: get,
    limparCache: limparCache
  };
}]);
