'use strict';

describe('CartoesService', function () {
  var CartoesService;
  var $httpBackend;
  var $rootScope;
  var cartoes = [
    { id: 'azul-infinite', nome: 'Cartão Azul Infinite', bandeira: 'Visa', categoria: 'Infinite', destaque: 'Acompanhante grátis em 2 viagens e upgrade de cabine', anuidade: 1188, rendaMinima: 15000, pontosPorDolar: 3.5, programa: 'viagem', estilo: 'card-prata', maisPedido: true },
    { id: 'latam-black', nome: 'Cartão LATAM Pass Black', bandeira: 'Mastercard', categoria: 'Black', destaque: 'Ganhe 8 trechos de cortesia para Upgrade de Cabine', anuidade: 1320, rendaMinima: 20000, pontosPorDolar: 3, programa: 'viagem', estilo: 'card-black', maisPedido: true },
    { id: 'click', nome: 'Itaú Click Platinum', bandeira: 'Visa', categoria: 'Platinum', destaque: 'Anuidade grátis para sempre', anuidade: 0, rendaMinima: 800, pontosPorDolar: 0, programa: 'sem-anuidade', estilo: 'card-laranja', maisPedido: false },
    { id: 'escolha', nome: 'Cartões Itaú', bandeira: 'Diversas', categoria: 'Todos', destaque: 'Escolha o cartão que dá match com você.', anuidade: null, rendaMinima: 0, pontosPorDolar: 0, programa: 'todos', estilo: 'card-laranja', maisPedido: true }
  ];

  beforeEach(module('itauApp'));

  beforeEach(inject(function (_CartoesService_, _$httpBackend_, _$rootScope_) {
    CartoesService = _CartoesService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('excludes the all-cards option and filters by income', function () {
    var resultado = CartoesService.filtrar(cartoes, { renda: 1000 });

    expect(resultado.map(function (cartao) { return cartao.id; })).toEqual(['click']);
  });

  it('filters by benefits program and no annual fee', function () {
    var porPrograma = CartoesService.filtrar(cartoes, { programa: 'viagem' });
    var semAnuidade = CartoesService.filtrar(cartoes, { semAnuidade: true });

    expect(porPrograma.map(function (cartao) { return cartao.id; })).toEqual(['azul-infinite', 'latam-black']);
    expect(semAnuidade.map(function (cartao) { return cartao.id; })).toEqual(['click']);
  });

  it('loads and returns the most-ordered cards from the JSON endpoint', function () {
    var resultado;
    $httpBackend.expectGET('data/cartoes.json').respond(200, cartoes);

    CartoesService.maisPedidos().then(function (itens) {
      resultado = itens;
    });
    $httpBackend.flush();

    expect(resultado.map(function (cartao) { return cartao.id; })).toEqual([
      'azul-infinite',
      'latam-black',
      'escolha'
    ]);
  });
});
