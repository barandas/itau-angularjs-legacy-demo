import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cookieConsent } from './cookieConsent';

describe('cookieConsent', () => {
  beforeEach(() => {
    cookieConsent.limpar();
    vi.restoreAllMocks();
  });

  it('persiste o consentimento de todos os cookies', () => {
    cookieConsent.aceitarTodos();

    expect(localStorage.getItem('itau-demo-cookie-consent')).toBe('todos');
    expect(cookieConsent.jaRespondeu()).toBe(true);
  });

  it('persiste a rejeição dos cookies não essenciais', () => {
    cookieConsent.rejeitarNaoEssenciais();

    expect(cookieConsent.preferencia()).toBe('essenciais');
  });

  it('notifica assinantes quando a preferência é alterada e removida', () => {
    const listener = vi.fn();
    const unsubscribe = cookieConsent.subscribe(listener);

    cookieConsent.aceitarTodos();
    cookieConsent.limpar();
    unsubscribe();

    expect(listener).toHaveBeenNthCalledWith(1, 'todos');
    expect(listener).toHaveBeenNthCalledWith(2, null);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
