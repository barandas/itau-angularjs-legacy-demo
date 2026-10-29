'use strict';

beforeEach(module(function ($provide) {
  $provide.decorator('$templateCache', function ($delegate) {
    [
      'app/views/home.html',
      'app/views/cartoes.html',
      'app/views/emprestimos.html',
      'app/views/agencias.html',
      'app/views/abra-conta.html'
    ].forEach(function (view) {
      $delegate.put(view, '');
    });
    return $delegate;
  });
}));
