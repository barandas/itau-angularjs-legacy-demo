import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { CardCarousel } from './CardCarousel';

function definirLargura(largura: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: largura
  });
}

describe('CardCarousel', () => {
  beforeEach(() => definirLargura(1200));

  it('pagina os itens e desabilita os controles nos limites', async () => {
    const user = userEvent.setup();
    render(
      <CardCarousel
        itens={['um', 'dois', 'três', 'quatro', 'cinco']}
        renderItem={(item) => <span>{item}</span>}
      />
    );

    const anterior = screen.getByRole('button', { name: 'página anterior' });
    const proxima = screen.getByRole('button', { name: 'próxima página' });
    expect(anterior).toBeDisabled();
    expect(proxima).toBeEnabled();
    expect(screen.getByText('um')).toBeVisible();
    expect(screen.getByText('três')).toBeVisible();
    expect(screen.queryByText('quatro')).not.toBeInTheDocument();

    await user.click(proxima);
    expect(anterior).toBeEnabled();
    expect(proxima).toBeDisabled();
    expect(screen.getByText('quatro')).toBeVisible();
    expect(screen.getByText('cinco')).toBeVisible();
  });

  it('atualiza os itens por página quando a largura da janela muda', () => {
    definirLargura(600);
    render(
      <CardCarousel
        itens={['um', 'dois', 'três', 'quatro']}
        renderItem={(item) => <span>{item}</span>}
      />
    );

    expect(screen.getByText('um')).toBeVisible();
    expect(screen.queryByText('dois')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Página/ })).toHaveLength(4);

    act(() => {
      definirLargura(1200);
      window.dispatchEvent(new Event('resize'));
    });

    const trilho = screen.getByText('um').parentElement?.parentElement;
    expect(trilho).toHaveStyle({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' });
    expect(within(trilho as HTMLElement).getByText('três')).toBeVisible();
  });
});
