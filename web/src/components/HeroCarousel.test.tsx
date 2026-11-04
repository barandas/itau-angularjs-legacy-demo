import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HeroCarousel } from './HeroCarousel';

const banners = [
  {
    id: 1,
    titulo: 'Banner um',
    subtitulo: 'Texto um',
    cta: 'Saiba mais',
    link: '#!/',
    tema: 'tema-sala'
  },
  {
    id: 2,
    titulo: 'Banner dois',
    subtitulo: 'Texto dois',
    cta: 'Saiba mais',
    link: '#!/cartoes',
    tema: 'tema-black'
  },
  {
    id: 3,
    titulo: 'Banner três',
    subtitulo: 'Texto três',
    cta: 'Saiba mais',
    link: '#!/agencias',
    tema: 'tema-azul'
  }
];

function renderCarousel() {
  return render(
    <MemoryRouter>
      <HeroCarousel banners={banners} />
    </MemoryRouter>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('HeroCarousel', () => {
  it('avança automaticamente após seis segundos', () => {
    vi.useFakeTimers();
    renderCarousel();

    expect(screen.getByRole('heading', { name: 'Banner um' })).toBeVisible();
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByRole('heading', { name: 'Banner dois' })).toBeVisible();
  });

  it('pausa o avanço e alterna o texto do controle', () => {
    vi.useFakeTimers();
    renderCarousel();
    const pause = screen.getByRole('button', { name: 'pausar o banner rotativo' });

    act(() => {
      fireEvent.click(pause);
    });
    expect(pause).toHaveTextContent('continuar');
    act(() => {
      vi.advanceTimersByTime(12000);
    });
    expect(screen.getByRole('heading', { name: 'Banner um' })).toBeVisible();

    act(() => {
      fireEvent.click(pause);
    });
    expect(pause).toHaveTextContent('pausar');
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByRole('heading', { name: 'Banner dois' })).toBeVisible();
  });

  it('wraps around with next and previous controls', async () => {
    const user = userEvent.setup();
    renderCarousel();

    await user.click(screen.getByRole('button', { name: 'Item anterior' }));
    expect(screen.getByRole('heading', { name: 'Banner três' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Próximo item' }));
    expect(screen.getByRole('heading', { name: 'Banner um' })).toBeVisible();
  });

  it('selects a slide from its labeled dot', async () => {
    const user = userEvent.setup();
    renderCarousel();

    await user.click(screen.getByRole('button', { name: 'Página 2 - Banner dois' }));

    expect(screen.getByRole('heading', { name: 'Banner dois' })).toBeVisible();
  });
});
