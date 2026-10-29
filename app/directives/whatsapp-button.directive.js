'use strict';

itauApp.directive('whatsappButton', function () {
  return {
    restrict: 'E',
    template:
      '<div class="whatsapp-float">' +
      '  <div class="whatsapp-balao" ng-show="aberto">' +
      '    <strong>Olá! 👋</strong><br>Este é um canal de demonstração. Nenhuma mensagem é enviada.' +
      '  </div>' +
      '  <button type="button" class="whatsapp-btn" aria-label="Enviar uma mensagem" ng-click="aberto = !aberto">' +
      '    <img src="assets/img/whatsapp.svg" alt="" width="30" height="30">' +
      '  </button>' +
      '</div>',
    link: function (scope) {
      scope.aberto = false;
    }
  };
});
