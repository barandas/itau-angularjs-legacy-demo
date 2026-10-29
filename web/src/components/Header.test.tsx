import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

function renderizar() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('alterna o painel "Mais acessos"', async () => {
    const user = userEvent.setup();
    renderizar();
    const botao = screen.getByRole('button', { name: 'Mais acessos' });

    expect(botao).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/Ambiente de demonstração/)).not.toBeInTheDocument();

    await user.click(botao);
    expect(botao).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Ambiente de demonstração/)).toBeInTheDocument();
  });

  it('abre e fecha o menu lateral (botão fechar e clique em item)', async () => {
    const user = userEvent.setup();
    renderizar();
    const hamburger = screen.getByRole('button', { name: 'Menu de navegação' });

    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toHaveClass('aberto');

    await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');

    await user.click(hamburger);
    await user.click(screen.getByRole('link', { name: 'Cartões de crédito' }));
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('aplica sombra ao rolar a página', () => {
    const { container } = renderizar();
    const header = container.querySelector('header');
    expect(header).not.toHaveClass('header-scrolled');

    act(() => {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 50 });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(header).toHaveClass('header-scrolled');

    act(() => {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(header).not.toHaveClass('header-scrolled');
  });
});
