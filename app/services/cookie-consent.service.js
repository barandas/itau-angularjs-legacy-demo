'use strict';

itauApp.factory('CookieConsentService', ['$window', '$rootScope', function ($window, $rootScope) {
  var CHAVE = 'itau-demo-cookie-consent';

  function obter() {
    try {
      return $window.localStorage.getItem(CHAVE);
    } catch (e) {
      return null;
    }
  }

  function salvar(valor) {
    try {
      $window.localStorage.setItem(CHAVE, valor);
    } catch (e) { /* modo privado */ }
    $rootScope.$broadcast('cookies:atualizado', valor);
  }

  return {
    jaRespondeu: function () { return !!obter(); },
    preferencia: obter,
    aceitarTodos: function () { salvar('todos'); },
    rejeitarNaoEssenciais: function () { salvar('essenciais'); },
    limpar: function () {
      try { $window.localStorage.removeItem(CHAVE); } catch (e) { /* noop */ }
      $rootScope.$broadcast('cookies:atualizado', null);
    }
  };
}]);
