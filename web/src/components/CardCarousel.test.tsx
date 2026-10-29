import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { CardCarousel } from './CardCarousel';

const ITENS = ['A', 'B', 'C', 'D', 'E'];
const larguraOriginal = window.innerWidth;

function definirLargura(largura: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: largura });
}

function renderizar() {
  return render(
    <CardCarousel
      itens={ITENS}
      porPagina={3}
      getKey={(item) => item}
      renderItem={(item) => <span>Item {item}</span>}
      rotulo="Teste"
    />,
  );
}

function visiveis() {
  return within(screen.getByRole('region', { name: 'Teste' }))
    .getAllByRole('listitem')
    .map((li) => li.textContent);
}

describe('CardCarousel', () => {
  afterEach(() => definirLargura(larguraOriginal));

  it('pagina os itens (3 por página no desktop) e controla os botões', async () => {
    definirLargura(1200);
    const user = userEvent.setup();
    renderizar();

    expect(visiveis()).toEqual(['Item A', 'Item B', 'Item C']);
    expect(screen.getByRole('button', { name: 'página anterior' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'próxima página' }));
    expect(visiveis()).toEqual(['Item D', 'Item E']);
    expect(screen.getByRole('button', { name: 'próxima página' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Página 1' }));
    expect(visiveis()).toEqual(['Item A', 'Item B', 'Item C']);
  });

  it('mostra 2 por página no tablet e 1 no celular', () => {
    definirLargura(800);
    renderizar();
    expect(visiveis()).toEqual(['Item A', 'Item B']);
    expect(screen.getAllByRole('button', { name: /^Página \d$/ })).toHaveLength(3);

    act(() => {
      definirLargura(500);
      window.dispatchEvent(new Event('resize'));
    });
    expect(visiveis()).toEqual(['Item A']);
    expect(screen.getAllByRole('button', { name: /^Página \d$/ })).toHaveLength(5);
  });

  it('volta para a primeira página quando o resize reduz o total de páginas', async () => {
    definirLargura(500);
    const user = userEvent.setup();
    renderizar();
    await user.click(screen.getByRole('button', { name: 'Página 5' }));
    expect(visiveis()).toEqual(['Item E']);

    act(() => {
      definirLargura(1200);
      window.dispatchEvent(new Event('resize'));
    });
    expect(visiveis()).toEqual(['Item A', 'Item B', 'Item C']);
  });

  it('esconde a paginação quando há só uma página', () => {
    definirLargura(1200);
    render(<CardCarousel itens={['A']} getKey={(i) => i} renderItem={(i) => i} rotulo="Teste" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
