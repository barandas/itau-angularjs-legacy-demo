'use strict';

describe('SimuladorService', function () {
  var SimuladorService;

  beforeEach(module('itauApp'));

  beforeEach(inject(function (_SimuladorService_) {
    SimuladorService = _SimuladorService_;
  }));

  it('calculates Price installments', function () {
    var valor = 10000;
    var taxa = 0.0399;
    var meses = 24;
    var fator = Math.pow(1 + taxa, meses);
    var esperada = valor * (taxa * fator) / (fator - 1);

    expect(SimuladorService.calcularParcela(valor, taxa, meses)).toBeCloseTo(esperada, 2);
  });

  it('divides the principal evenly when the rate is zero', function () {
    expect(SimuladorService.calcularParcela(1200, 0, 12)).toBe(100);
  });

  it('generates one schedule row per month and amortizes the principal', function () {
    var cronograma = SimuladorService.gerarCronograma(10000, 0.0399, 24);
    var amortizacaoTotal = cronograma.reduce(function (total, linha) {
      return total + linha.amortizacao;
    }, 0);

    expect(cronograma.length).toBe(24);
    expect(cronograma[cronograma.length - 1].saldo).toBe(0);
    expect(amortizacaoTotal).toBeCloseTo(10000, 0);
    expect(Math.abs(amortizacaoTotal - 10000)).toBeLessThan(0.5);
  });

  it('includes the IOF in the CET', function () {
    var simulacao = SimuladorService.simular(10000, 0.0399, 24);

    expect(simulacao.cet).toBeCloseTo(simulacao.totalPago + simulacao.iof, 2);
  });
});
