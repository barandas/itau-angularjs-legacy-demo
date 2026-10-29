'use strict';

describe('AgenciasService', function () {
  var AgenciasService;
  var $httpBackend;
  var $rootScope;
  var agencias = [
    { numero: '0001', nome: 'Agência Praça Alfredo Egydio', endereco: 'Praça Alfredo Egydio', bairro: 'Parque Jabaquara', cidade: 'São Paulo', uf: 'SP', cep: '04344-902' },
    { numero: '0350', nome: 'Agência Paulista', endereco: 'Av. Paulista, 1000', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP', cep: '01310-100' },
    { numero: '1520', nome: 'Agência Copacabana', endereco: 'Av. Nossa Sra. de Copacabana, 540', bairro: 'Copacabana', cidade: 'Rio de Janeiro', uf: 'RJ', cep: '22020-001' }
  ];

  beforeEach(module('itauApp'));

  beforeEach(inject(function (_AgenciasService_, _$httpBackend_, _$rootScope_) {
    AgenciasService = _AgenciasService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  function buscar(termo) {
    var resultado;
    $httpBackend.expectGET('data/agencias.json').respond(200, agencias);
    AgenciasService.buscar(termo).then(function (itens) {
      resultado = itens;
    });
    $httpBackend.flush();
    $rootScope.$digest();
    return resultado;
  }

  it('matches city names without accents', function () {
    expect(buscar('sao paulo').length).toBe(2);
  });

  it('searches by agency number', function () {
    expect(buscar('0350')[0].numero).toBe('0350');
  });

  it('searches by CEP prefix', function () {
    expect(buscar('01310')[0].cep).toBe('01310-100');
  });

  it('returns every agency for an empty term', function () {
    expect(buscar('').length).toBe(agencias.length);
  });
});
