'use strict';

itauApp.service('ProdutosService', ['ApiService', function (ApiService) {
  var self = this;

  self.getBanners = function () {
    return ApiService.get('banners');
  };

  self.getAtalhos = function () {
    return ApiService.get('atalhos');
  };

  self.getProdutos = function () {
    return ApiService.get('produtos');
  };

  self.getDestaques = function () {
    return ApiService.get('destaques');
  };
}]);
