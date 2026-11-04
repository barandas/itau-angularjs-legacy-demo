import { describe, expect, it } from 'vitest';
import { celularValido, cpfValido, idadeMinima } from './validacao';

describe('validacao', () => {
  it('valida CPFs formatados e sem formatação', () => {
    expect(cpfValido('529.982.247-25')).toBe(true);
    expect(cpfValido('52998224725')).toBe(true);
  });

  it('rejeita CPFs inválidos e incompletos', () => {
    expect(cpfValido('11111111111')).toBe(false);
    expect(cpfValido('12345678900')).toBe(false);
    expect(cpfValido('123456')).toBe(false);
  });

  it('valida números de celular brasileiros', () => {
    expect(celularValido('11987654321')).toBe(true);
    expect(celularValido('1187654321')).toBe(false);
    expect(celularValido('11887654321')).toBe(false);
  });

  it('calcula idade mínima em relação à data atual', () => {
    const hoje = new Date();
    const aniversario18 = new Date(
      hoje.getFullYear() - 18,
      hoje.getMonth(),
      hoje.getDate()
    );
    const aniversario17 = new Date(
      hoje.getFullYear() - 18,
      hoje.getMonth(),
      hoje.getDate() + 1
    );

    expect(idadeMinima(aniversario18, 18)).toBe(true);
    expect(idadeMinima(aniversario17, 18)).toBe(false);
  });
});
