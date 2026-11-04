import { describe, expect, it } from 'vitest';
import cartoesJson from '../../../data/cartoes.json';
import type { Cartao } from '../types';
import { filtrarCartoes, maisPedidos } from './cartoes';

const cartoes = cartoesJson as Cartao[];

describe('cartoes', () => {
  it('exclui a opção todos e filtra pela renda', () => {
    const resultado = filtrarCartoes(cartoes, { renda: 1000 });

    expect(resultado.map((cartao) => cartao.id)).toEqual(['click']);
  });

  it('filtra por programa de benefícios e ausência de anuidade', () => {
    const porPrograma = filtrarCartoes(cartoes, { programa: 'viagem' });
    const semAnuidade = filtrarCartoes(cartoes, { semAnuidade: true });

    expect(porPrograma.map((cartao) => cartao.id)).toEqual([
      'azul-infinite',
      'latam-black',
      'azul-platinum'
    ]);
    expect(semAnuidade.map((cartao) => cartao.id)).toEqual(['click']);
  });

  it('seleciona cartões marcados como mais pedidos', () => {
    const resultado = maisPedidos(cartoes);

    expect(resultado.map((cartao) => cartao.id)).toEqual([
      'azul-infinite',
      'latam-black',
      'azul-platinum',
      'escolha'
    ]);
  });
});
