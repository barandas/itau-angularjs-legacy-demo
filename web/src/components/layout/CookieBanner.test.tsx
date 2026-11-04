import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CookieBanner } from './CookieBanner';

describe('CookieBanner', () => {
  it('mostra o diálogo quando não há consentimento salvo', () => {
    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    expect(screen.getByRole('dialog', { name: 'Consentimento de cookies' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Aceitar todos' })).toBeVisible();
  });

  it('aceita todos, salva a preferência e permite reabrir o diálogo', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Aceitar todos' }));

    expect(localStorage.getItem('itau-demo-cookie-consent')).toBe('todos');
    expect(
      screen.queryByRole('dialog', { name: 'Consentimento de cookies' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Gerenciar cookies' }));

    expect(screen.getByRole('dialog', { name: 'Consentimento de cookies' })).toBeVisible();
  });

  it('permite gerenciar as preferências e rejeitar os não essenciais', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Gerenciar cookies' }));
    expect(screen.getByLabelText('Analíticos')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Rejeitar não essenciais' }));

    expect(localStorage.getItem('itau-demo-cookie-consent')).toBe('essenciais');
    expect(screen.getByRole('button', { name: 'Gerenciar cookies' })).toBeVisible();
  });
});
