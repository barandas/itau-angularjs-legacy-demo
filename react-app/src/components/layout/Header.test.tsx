import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('abre e fecha o menu e atualiza aria-expanded', async () => {
    const user = userEvent.setup();
    function HeaderComEstado() {
      const [menuAberto, setMenuAberto] = useState(false);

      return (
        <MemoryRouter>
          <Header
            menuAberto={menuAberto}
            onAlternarMenu={() => setMenuAberto((aberto) => !aberto)}
          />
        </MemoryRouter>
      );
    }

    render(
      <HeaderComEstado />
    );

    const menu = screen.getByRole('button', { name: 'Menu de navegação' });
    expect(menu).toHaveAttribute('aria-expanded', 'false');

    await user.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(menu).toHaveAttribute('aria-expanded', 'false');
  });
});
