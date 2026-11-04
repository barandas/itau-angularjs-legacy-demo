import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import agencias from '../../public/data/agencias.json';
import atalhos from '../../public/data/atalhos.json';
import banners from '../../public/data/banners.json';
import cartoes from '../../public/data/cartoes.json';
import destaques from '../../public/data/destaques.json';
import produtos from '../../public/data/produtos.json';
import { limparCache } from '../lib/api';
import { Home } from './Home';

const dados: Record<string, unknown> = {
  agencias,
  atalhos,
  banners,
  cartoes,
  destaques,
  produtos
};

function Localizacao() {
  const location = useLocation();
  return <output aria-label="localização atual">{`${location.pathname}${location.search}`}</output>;
}

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/agencias"
          element={<><Localizacao /><Home /></>}
        />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  limparCache();
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const recurso = String(input).split('/').pop()?.replace('.json', '') ?? '';
      return {
        ok: recurso in dados,
        status: recurso in dados ? 200 : 404,
        json: async () => dados[recurso]
      } as Response;
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  limparCache();
});

describe('Home', () => {
  it('renderiza as seções e os dados reais dos arquivos JSON', async () => {
    renderHome();

    expect(await screen.findByText('Boleto')).toBeVisible();
    expect(await screen.findByText('Semana de cultura em São Paulo')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Resolva as questões do dia a dia' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Contrate nossos produtos online' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Confira nossos cartões de crédito mais pedidos da semana' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Resolva tudo pelos apps' })).toBeVisible();
    expect(screen.getByText('Renegociação Itaú')).toBeVisible();
    expect(screen.getByText('Cartão Azul Infinite')).toBeVisible();
  });

  it('navega para agências com o termo no parâmetro q', async () => {
    const user = userEvent.setup();
    renderHome();

    const campo = await screen.findByRole('textbox', { name: 'Busque por endereço, agência, CEP' });
    await user.type(campo, 'Av. Paulista, 0350');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => {
      expect(screen.getByLabelText('localização atual')).toHaveTextContent(
        '/agencias?q=Av.+Paulista%2C+0350'
      );
    });
  });
});
