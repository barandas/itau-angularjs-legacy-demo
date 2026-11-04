import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './App';

describe('rotas React', () => {
  it('atualiza o título ao navegar entre rotas', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/cartoes']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.title).toBe('Cartões de crédito | Itaú (demo)');
    });
    await user.click(screen.getByRole('button', { name: 'Menu de navegação' }));
    await user.click(
      within(screen.getByRole('navigation', { name: 'Menu principal' })).getByRole(
        'link',
        { name: 'Encontre agências' }
      )
    );

    await waitFor(() => {
      expect(document.title).toBe('Encontre agências | Itaú (demo)');
    });
  });

  it('redireciona caminhos desconhecidos para a página inicial', async () => {
    render(
      <MemoryRouter initialEntries={['/rota-desconhecida']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Abra sua conta no Banco Itaú' })).toBeVisible();
    await waitFor(() => {
      expect(document.title).toBe('Abra sua conta no Banco Itaú | Itaú (demo)');
    });
  });
});
