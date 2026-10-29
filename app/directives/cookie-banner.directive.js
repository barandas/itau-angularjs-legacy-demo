'use strict';

itauApp.directive('cookieBanner', ['CookieConsentService', function (CookieConsentService) {
  return {
    restrict: 'E',
    templateUrl: 'app/partials/cookie-banner.html',
    link: function (scope) {
      scope.cookies = {
        visivel: !CookieConsentService.jaRespondeu(),
        gerenciando: false
      };

      scope.aceitarCookies = function () {
        CookieConsentService.aceitarTodos();
        scope.cookies.visivel = false;
      };

      scope.rejeitarCookies = function () {
        CookieConsentService.rejeitarNaoEssenciais();
        scope.cookies.visivel = false;
      };

      scope.gerenciarCookies = function () {
        scope.cookies.gerenciando = !scope.cookies.gerenciando;
      };

      scope.reabrirCookies = function () {
        scope.cookies.visivel = true;
      };
    }
  };
}]);
