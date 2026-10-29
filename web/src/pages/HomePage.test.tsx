import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { carregarConteudoHome, type ConteudoHome } from '../api/home';
import { HomePage } from './HomePage';

vi.mock('../api/home', () => ({ carregarConteudoHome: vi.fn() }));

const carregar = vi.mocked(carregarConteudoHome);

const CONTEUDO: ConteudoHome = {
  banners: [
    {
      id: 1,
      titulo: 'Renegocie',
      subtitulo: 'sub',
      cta: 'Saiba mais',
      link: '#!/emprestimos',
      tema: 'tema-sala',
    },
  ],
  atalhos: [
    { icone: 'glyphicon-barcode', titulo: 'Boleto', descricao: 'Emita 2ª via', link: '#!/' },
    {
      icone: 'glyphicon-credit-card',
      titulo: 'Desbloqueio de cartão',
      descricao: 'Saiba como fazer',
      link: '#!/cartoes',
    },
  ],
  produtos: [
    {
      id: 'a',
      categoria: 'Solução',
      icone: 'glyphicon-refresh',
      titulo: 'Produto A',
      descricao: 'd',
      cta: 'Quero',
      link: '#!/emprestimos',
      cor: '#f5d0a9',
    },
    {
      id: 'b',
      categoria: 'Empréstimo',
      icone: 'glyphicon-usd',
      titulo: 'Produto B',
      descricao: 'd',
      cta: 'Confira',
      link: '#!/emprestimos',
      cor: '#c9dcf5',
    },
    {
      id: 'c',
      categoria: 'Cartões',
      icone: 'glyphicon-credit-card',
      titulo: 'Produto C',
      descricao: 'd',
      cta: 'Peça',
      link: '#!/cartoes',
      cor: '#ffe0c2',
    },
  ],
  destaques: [{ titulo: 'Semana de cultura', descricao: 'd', cta: 'Escolher', cor: '#7b3fa0' }],
  cartoesMaisPedidos: [
    {
      id: 'x',
      nome: 'Cartão X',
      bandeira: 'Visa',
      categoria: 'Infinite',
      destaque: 'dx',
      anuidade: 1,
      rendaMinima: 1,
      pontosPorDolar: 1,
      programa: 'viagem',
      estilo: 'card-prata',
      maisPedido: true,
    },
    {
      id: 'y',
      nome: 'Cartão Y',
      bandeira: 'Visa',
      categoria: 'Gold',
      destaque: 'dy',
      anuidade: 0,
      rendaMinima: 1,
      pontosPorDolar: 1,
      programa: 'todos',
      estilo: 'card-azul',
      maisPedido: true,
    },
  ],
};

function LocalAtual() {
  const { pathname, search } = useLocation();
  return <p data-testid="local">{pathname + search}</p>;
}

function renderizar() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <HomePage /> },
      { path: '*', element: <LocalAtual /> },
    ],
    { initialEntries: ['/'] },
  );
  return render(<RouterProvider router={router} />);
}

describe('HomePage', () => {
  beforeEach(() => {
    carregar.mockReset();
  });

  it('mostra "Carregando..." e depois o conteúdo de todas as seções', async () => {
    carregar.mockResolvedValue(CONTEUDO);
    renderizar();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
    expect(await screen.findByRole('heading', { name: 'Renegocie' })).toBeInTheDocument();
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Boleto Emita 2ª via' })).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', { name: 'Desbloqueio de cartão Saiba como fazer' }),
    ).toHaveAttribute('href', '/cartoes');

    const produtoA = screen.getByRole('heading', { name: 'Produto A' }).closest('.produto-card');
    const produtoC = screen.getByRole('heading', { name: 'Produto C' }).closest('.produto-card');
    expect(produtoA).toHaveClass('produto-card-grande');
    expect(produtoC).not.toHaveClass('produto-card-grande');

    const cartoes = screen.getByRole('region', { name: 'Cartões mais pedidos' });
    expect(within(cartoes).getByRole('link', { name: /Peça o seu/ })).toHaveAttribute(
      'href',
      '/cartoes',
    );
    expect(within(cartoes).getByRole('link', { name: /Escolha o seu/ })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Semana de cultura' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'logo Itaú Personnalité' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Abra sua conta/ })).toHaveAttribute(
      'href',
      '/abra-sua-conta',
    );
  });

  it('mostra a mensagem de erro do legado se o carregamento falhar', async () => {
    carregar.mockRejectedValue(new Error('falhou'));
    renderizar();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar o conteúdo. Tente novamente.',
    );
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Resolva as questões do dia a dia' }),
    ).toBeInTheDocument();
  });

  it('busca agência navegando para /agencias?q=termo', async () => {
    carregar.mockResolvedValue(CONTEUDO);
    const user = userEvent.setup();
    renderizar();

    await user.type(
      screen.getByLabelText('Busque por endereço, agência, CEP'),
      'Av. Paulista 1000',
    );
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByTestId('local')).toHaveTextContent('/agencias?q=Av.+Paulista+1000');
  });

  it('busca sem termo navega para /agencias sem query string', async () => {
    carregar.mockResolvedValue(CONTEUDO);
    const user = userEvent.setup();
    renderizar();

    await user.type(screen.getByLabelText('Busque por endereço, agência, CEP'), '   ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByTestId('local').textContent).toBe('/agencias');
  });
});
