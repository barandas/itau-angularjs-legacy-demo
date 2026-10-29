'use strict';

itauApp.controller('HeaderController', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
  $scope.maisAcessosAberto = false;
  $scope.scrolled = false;

  $scope.menu = [
    { titulo: 'Para você', itens: [
      { nome: 'Conta corrente', link: '#!/abra-sua-conta' },
      { nome: 'Cartões de crédito', link: '#!/cartoes' },
      { nome: 'Empréstimos e Financiamentos', link: '#!/emprestimos' },
      { nome: 'Encontre agências', link: '#!/agencias' }
    ] },
    { titulo: 'Segmentos', itens: [
      { nome: 'Uniclass', link: '#!/' },
      { nome: 'Personnalité', link: '#!/' },
      { nome: 'Private Bank', link: '#!/' }
    ] },
    { titulo: 'Empresas', itens: [
      { nome: 'Conta PJ', link: '#!/' },
      { nome: 'Maquininha', link: '#!/' }
    ] }
  ];

  $scope.alternarMaisAcessos = function () {
    $scope.maisAcessosAberto = !$scope.maisAcessosAberto;
  };

  // Listener global via jQuery (padrão legado)
  $($window).on('scroll.header', function () {
    var rolou = $($window).scrollTop() > 10;
    if (rolou !== $scope.scrolled) {
      $scope.$apply(function () { $scope.scrolled = rolou; });
    }
  });

  $scope.$on('$destroy', function () {
    $($window).off('scroll.header');
  });
}]);
