import { describe, expect, it } from 'vitest';
import { legacyHrefToPath } from './routes';

describe('legacyHrefToPath', () => {
  it('converte links hashbang em caminhos', () => {
    expect(legacyHrefToPath('#!/')).toBe('/');
    expect(legacyHrefToPath('#!/cartoes')).toBe('/cartoes');
    expect(legacyHrefToPath('#!agencias')).toBe('/agencias');
  });

  it('mantém outros valores', () => {
    expect(legacyHrefToPath('/emprestimos')).toBe('/emprestimos');
    expect(legacyHrefToPath('https://exemplo.com')).toBe('https://exemplo.com');
  });
});
