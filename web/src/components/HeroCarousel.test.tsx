import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Banner } from '../api/types';
import { HeroCarousel } from './HeroCarousel';

const BANNERS: Banner[] = [
  {
    id: 1,
    titulo: 'Primeiro',
    subtitulo: 's1',
    cta: 'Saiba mais',
    link: '#!/emprestimos',
    tema: 'tema-sala',
  },
  {
    id: 2,
    titulo: 'Segundo',
    subtitulo: 's2',
    cta: 'Saiba mais',
    link: '#!/cartoes',
    tema: 'tema-black',
  },
  { id: 3, titulo: 'Terceiro', subtitulo: 's3', cta: 'Saiba mais', link: '#!/', tema: 'tema-azul' },
];

function renderizar(intervalo = 6000) {
  return render(
    <MemoryRouter>
      <HeroCarousel banners={BANNERS} intervalo={intervalo} />
    </MemoryRouter>,
  );
}

function slideAtivo() {
  return screen.getByRole('group', { hidden: false });
}

describe('HeroCarousel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('exibe o primeiro banner e converte o link legado', () => {
    renderizar();
    expect(screen.getByRole('region', { name: 'Carrossel com 3 itens' })).toBeInTheDocument();
    expect(slideAtivo()).toHaveTextContent('Primeiro');
    expect(slideAtivo().querySelector('a')).toHaveAttribute('href', '/emprestimos');
  });

  it('navega com anterior/próximo (circular) e pelos indicadores', async () => {
    const user = userEvent.setup();
    renderizar();

    await user.click(screen.getByRole('button', { name: 'Próximo item' }));
    expect(slideAtivo()).toHaveTextContent('Segundo');

    await user.click(screen.getByRole('button', { name: 'Item anterior' }));
    await user.click(screen.getByRole('button', { name: 'Item anterior' }));
    expect(slideAtivo()).toHaveTextContent('Terceiro');

    await user.click(screen.getByRole('button', { name: 'Página 2 - Segundo' }));
    expect(slideAtivo()).toHaveTextContent('Segundo');
    expect(screen.getByRole('button', { name: 'Página 2 - Segundo' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('avança automaticamente e para quando pausado', () => {
    vi.useFakeTimers();
    renderizar(1000);

    act(() => vi.advanceTimersByTime(1000));
    expect(slideAtivo()).toHaveTextContent('Segundo');

    act(() => screen.getByRole('button', { name: 'pausar o banner rotativo' }).click());
    expect(screen.getByRole('button', { name: 'continuar o banner rotativo' })).toHaveTextContent(
      'continuar',
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(slideAtivo()).toHaveTextContent('Segundo');

    act(() => screen.getByRole('button', { name: 'continuar o banner rotativo' }).click());
    act(() => vi.advanceTimersByTime(1000));
    expect(slideAtivo()).toHaveTextContent('Terceiro');
  });

  it('não renderiza nada sem banners', () => {
    const { container } = render(
      <MemoryRouter>
        <HeroCarousel banners={[]} />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
