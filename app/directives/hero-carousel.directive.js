'use strict';

/**
 * Carrossel de banners da home. Usa $interval + manipulação de classe via jQuery (legado).
 */
itauApp.directive('heroCarousel', ['$interval', 'APP_CONFIG', function ($interval, APP_CONFIG) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      banners: '='
    },
    templateUrl: 'app/partials/hero-carousel.html',
    link: function (scope, element) {
      var timer = null;
      scope.indice = 0;
      scope.pausado = false;

      function iniciar() {
        parar();
        timer = $interval(function () {
          scope.proximo();
        }, APP_CONFIG.carouselInterval);
      }

      function parar() {
        if (timer) {
          $interval.cancel(timer);
          timer = null;
        }
      }

      scope.irPara = function (i) {
        if (!scope.banners || !scope.banners.length) { return; }
        scope.indice = (i + scope.banners.length) % scope.banners.length;
        $(element).find('.hero-slide').removeClass('ativo').eq(scope.indice).addClass('ativo');
      };

      scope.proximo = function () { scope.irPara(scope.indice + 1); };
      scope.anterior = function () { scope.irPara(scope.indice - 1); };

      scope.alternarPausa = function () {
        scope.pausado = !scope.pausado;
        if (scope.pausado) { parar(); } else { iniciar(); }
      };

      scope.$watch('banners', function (novo) {
        if (novo && novo.length) {
          scope.indice = 0;
          if (!scope.pausado) { iniciar(); }
        }
      });

      scope.$on('$destroy', parar);
    }
  };
}]);
