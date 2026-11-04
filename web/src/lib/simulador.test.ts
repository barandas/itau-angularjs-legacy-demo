import { describe, expect, it } from 'vitest';
import { calcularParcela, gerarCronograma, simular } from './simulador';

describe('simulador', () => {
  it('calcula parcelas pela Tabela Price', () => {
    const valor = 10000;
    const taxa = 0.0399;
    const meses = 24;
    const fator = Math.pow(1 + taxa, meses);
    const esperada = (valor * (taxa * fator)) / (fator - 1);

    expect(calcularParcela(valor, taxa, meses)).toBeCloseTo(esperada, 2);
  });

  it('divide o valor igualmente quando a taxa é zero', () => {
    expect(calcularParcela(1200, 0, 12)).toBe(100);
  });

  it('gera cronograma com amortização total do principal', () => {
    const cronograma = gerarCronograma(10000, 0.0399, 24);
    const amortizacaoTotal = cronograma.reduce((total, linha) => total + linha.amortizacao, 0);

    expect(cronograma).toHaveLength(24);
    expect(cronograma[cronograma.length - 1].saldo).toBe(0);
    expect(amortizacaoTotal).toBeCloseTo(10000, 0);
    expect(Math.abs(amortizacaoTotal - 10000)).toBeLessThan(0.5);
  });

  it('inclui o IOF no CET', () => {
    const resultado = simular(10000, 0.0399, 24);

    expect(resultado.cet).toBeCloseTo(resultado.totalPago + resultado.iof, 2);
  });
});
