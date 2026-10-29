import { describe, expect, it } from 'vitest';
import { formatBRL, formatCPF } from './format';

describe('formatBRL (porta do filtro brl)', () => {
  it('formata valores como moeda brasileira', () => {
    expect(formatBRL(1234.5)).toBe('R$ 1.234,50');
    expect(formatBRL(0)).toBe('R$ 0,00');
    expect(formatBRL(-10)).toBe('-R$ 10,00');
    expect(formatBRL(1000000)).toBe('R$ 1.000.000,00');
  });

  it('omite o símbolo quando solicitado', () => {
    expect(formatBRL(1234.5, true)).toBe('1.234,50');
    expect(formatBRL(-1234.5, true)).toBe('-1.234,50');
  });

  it('retorna string vazia para entrada nula, vazia ou não numérica', () => {
    expect(formatBRL(null)).toBe('');
    expect(formatBRL(undefined)).toBe('');
    expect(formatBRL('')).toBe('');
    expect(formatBRL('   ')).toBe('');
    expect(formatBRL('abc')).toBe('');
    expect(formatBRL(Number.NaN)).toBe('');
    expect(formatBRL(Number.POSITIVE_INFINITY)).toBe('');
  });

  it('aceita strings numéricas, como o filtro legado', () => {
    expect(formatBRL('1234.5')).toBe('R$ 1.234,50');
  });

  it('arredonda para duas casas decimais', () => {
    expect(formatBRL(10.456)).toBe('R$ 10,46');
    expect(formatBRL(999.999)).toBe('R$ 1.000,00');
  });

  it('usa espaço comum entre o símbolo e o valor (mesma saída do filtro legado)', () => {
    expect(formatBRL(1)).not.toMatch(/[\u00a0\u202f]/);
  });

  it('não exibe "-0" para valores negativos que arredondam para zero', () => {
    expect(formatBRL(-0.001)).toBe('R$ 0,00');
  });
});

describe('formatCPF (porta do filtro cpf)', () => {
  it('formata um CPF completo', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  it('formata entrada parcial durante a digitação', () => {
    expect(formatCPF('1234')).toBe('123.4');
    expect(formatCPF('1234567')).toBe('123.456.7');
    expect(formatCPF('1234567890')).toBe('123.456.789-0');
  });

  it('retorna string vazia para entrada vazia', () => {
    expect(formatCPF('')).toBe('');
    expect(formatCPF(null)).toBe('');
    expect(formatCPF(undefined)).toBe('');
  });

  it('remove caracteres não numéricos e limita a 11 dígitos', () => {
    expect(formatCPF('123.456.789-09')).toBe('123.456.789-09');
    expect(formatCPF('123456789091234')).toBe('123.456.789-09');
    expect(formatCPF(12345678909)).toBe('123.456.789-09');
  });
});
