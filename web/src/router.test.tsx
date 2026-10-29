import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { routes } from './router';

vi.mock('./api/home', () => ({
  carregarConteudoHome: vi.fn(() => new Promise(() => {})),
}));

function renderizar(caminho: string) {
  const router = createMemoryRouter(routes, { initialEntries: [caminho] });
  render(<RouterProvider router={router} />);
  return router;
}

describe('router', () => {
  it('renderiza a Home em "/" com o título da rota legada', () => {
    renderizar('/');
    expect(
      screen.getByRole('heading', { name: 'Resolva as questões do dia a dia' }),
    ).toBeInTheDocument();
    expect(document.title).toBe('Abra sua conta no Banco Itaú | Itaú (demo)');
    expect(screen.getByText('Você está aqui: Abra sua conta no Banco Itaú')).toBeInTheDocument();
  });

  it('redireciona rotas desconhecidas para a Home (equivalente ao otherwise)', () => {
    const router = renderizar('/nao-existe');
    expect(router.state.location.pathname).toBe('/');
  });

  it('mantém rotas ainda não migradas com link para o app AngularJS', () => {
    renderizar('/agencias?q=paulista');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Encontre agências' }),
    ).toBeInTheDocument();
    expect(document.title).toBe('Encontre agências | Itaú (demo)');
    expect(screen.getByRole('link', { name: 'Abrir na versão AngularJS' })).toHaveAttribute(
      'href',
      'http://localhost:8080/#!/agencias?q=paulista',
    );
  });
});
