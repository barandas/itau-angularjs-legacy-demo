import { describe, expect, it } from 'vitest';
import agenciasJson from '../../../data/agencias.json';
import type { Agencia } from '../types';
import { buscarAgencias } from './agencias';

const agencias = agenciasJson as Agencia[];

describe('buscarAgencias', () => {
  it('localiza cidade ignorando acentos', () => {
    expect(buscarAgencias(agencias, 'sao paulo')).toHaveLength(4);
  });

  it('busca pelo número da agência', () => {
    expect(buscarAgencias(agencias, '0350')[0].numero).toBe('0350');
  });

  it('busca pelo prefixo do CEP', () => {
    expect(buscarAgencias(agencias, '01310')[0].cep).toBe('01310-100');
  });

  it('retorna todas as agências para termo vazio', () => {
    expect(buscarAgencias(agencias, '')).toHaveLength(agencias.length);
  });
});
