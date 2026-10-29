/* global angular */
'use strict';

/**
 * Módulo principal da aplicação (AngularJS 1.x).
 * Padrões legados intencionais: $scope, $rootScope events, jQuery em diretivas,
 * script tags manuais no index.html, sem bundler.
 */
var itauApp = angular.module('itauApp', ['ngRoute', 'ngSanitize']);

itauApp.constant('APP_CONFIG', {
  apiBase: 'data/',
  carouselInterval: 6000,
  whatsappNumber: '0000000000000'
});

itauApp.run(['$rootScope', '$window', function ($rootScope, $window) {
  $rootScope.pageTitle = 'Abra sua conta no Banco Itaú';

  $rootScope.$on('$routeChangeSuccess', function (event, current) {
    if (current && current.$$route && current.$$route.title) {
      $rootScope.pageTitle = current.$$route.title;
    }
    $rootScope.menuAberto = false;
    $window.scrollTo(0, 0);
  });
}]);
