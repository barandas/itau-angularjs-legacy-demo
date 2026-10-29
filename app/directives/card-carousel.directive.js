'use strict';

/**
 * Carrossel horizontal genérico paginado (cartões, destaques).
 * Exemplo: <card-carousel itens="cartoes" por-pagina="3" template="app/partials/card-cartao.html"></card-carousel>
 */
itauApp.directive('cardCarousel', ['$window', function ($window) {
  return {
    restrict: 'E',
    scope: {
      itens: '=',
      porPagina: '@',
      template: '@'
    },
    templateUrl: 'app/partials/card-carousel.html',
    link: function (scope) {
      scope.pagina = 0;

      function itensPorPagina() {
        var base = parseInt(scope.porPagina, 10) || 3;
        if ($window.innerWidth < 768) { return 1; }
        if ($window.innerWidth < 992) { return Math.min(base, 2); }
        return base;
      }

      scope.totalPaginas = function () {
        if (!scope.itens) { return 0; }
        return Math.ceil(scope.itens.length / itensPorPagina());
      };

      scope.paginas = function () {
        var arr = [];
        for (var i = 0; i < scope.totalPaginas(); i++) { arr.push(i); }
        return arr;
      };

      scope.visiveis = function () {
        if (!scope.itens) { return []; }
        var n = itensPorPagina();
        return scope.itens.slice(scope.pagina * n, scope.pagina * n + n);
      };

      scope.irPara = function (p) {
        if (p < 0 || p >= scope.totalPaginas()) { return; }
        scope.pagina = p;
      };

      var onResize = function () {
        scope.$apply(function () {
          if (scope.pagina >= scope.totalPaginas()) { scope.pagina = 0; }
        });
      };
      angular.element($window).on('resize', onResize);
      scope.$on('$destroy', function () {
        angular.element($window).off('resize', onResize);
      });
    }
  };
}]);
