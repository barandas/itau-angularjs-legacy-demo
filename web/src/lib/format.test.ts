import { describe, expect, it } from 'vitest';
import { formatBRL, formatCPF } from './format';

describe('formatBRL', () => {
  it('formata moeda brasileira, incluindo valores negativos e grandes', () => {
    expect(formatBRL(1234.5)).toBe('R$ 1.234,50');
    expect(formatBRL(0)).toBe('R$ 0,00');
    expect(formatBRL(-10)).toBe('-R$ 10,00');
    expect(formatBRL(1000000)).toBe('R$ 1.000.000,00');
  });

  it('omite o símbolo quando solicitado', () => {
    expect(formatBRL(1234.5, true)).toBe('1.234,50');
  });

  it('retorna string vazia para null e entrada vazia', () => {
    expect(formatBRL(null)).toBe('');
    expect(formatBRL('')).toBe('');
  });
});

describe('formatCPF', () => {
  it('formata CPF completo', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  it('formata a entrada parcial enquanto a pessoa digita', () => {
    expect(formatCPF('1234')).toBe('123.4');
    expect(formatCPF('1234567')).toBe('123.456.7');
    expect(formatCPF('1234567890')).toBe('123.456.789-0');
  });

  it('retorna string vazia para entrada vazia', () => {
    expect(formatCPF('')).toBe('');
  });
});
