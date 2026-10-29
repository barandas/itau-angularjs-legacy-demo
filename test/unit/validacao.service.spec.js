'use strict';

describe('ValidacaoService', function () {
  var ValidacaoService;

  beforeEach(module('itauApp'));

  beforeEach(inject(function (_ValidacaoService_) {
    ValidacaoService = _ValidacaoService_;
  }));

  it('validates formatted and unformatted CPFs', function () {
    expect(ValidacaoService.cpfValido('529.982.247-25')).toBe(true);
    expect(ValidacaoService.cpfValido('52998224725')).toBe(true);
  });

  it('rejects invalid and incomplete CPFs', function () {
    expect(ValidacaoService.cpfValido('11111111111')).toBe(false);
    expect(ValidacaoService.cpfValido('12345678900')).toBe(false);
    expect(ValidacaoService.cpfValido('123456')).toBe(false);
  });

  it('validates Brazilian mobile numbers', function () {
    expect(ValidacaoService.celularValido('11987654321')).toBe(true);
    expect(ValidacaoService.celularValido('1187654321')).toBe(false);
    expect(ValidacaoService.celularValido('11887654321')).toBe(false);
  });

  it('checks age against the current date', function () {
    var hoje = new Date();
    var aniversario18 = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
    var aniversario17 = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate() + 1);

    expect(ValidacaoService.idadeMinima(aniversario18, 18)).toBe(true);
    expect(ValidacaoService.idadeMinima(aniversario17, 18)).toBe(false);
  });
});
