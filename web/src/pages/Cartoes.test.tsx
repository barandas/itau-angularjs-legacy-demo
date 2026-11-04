import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { limparCache } from '../lib/api';
import type { Cartao } from '../types';
import { Cartoes } from './Cartoes';

const cartoesMock: Cartao[] = [
  {
    id: 'azul-infinite',
    nome: 'Cartão Azul Infinite',
    bandeira: 'Visa',
    categoria: 'Infinite',
    destaque: 'Acompanhante grátis em viagens',
    anuidade: 1188,
    rendaMinima: 15000,
    pontosPorDolar: 3.5,
    programa: 'viagem',
    estilo: 'card-prata',
    maisPedido: true
  },
  {
    id: 'uniclass',
    nome: 'Uniclass Mastercard Black',
    bandeira: 'Mastercard',
    categoria: 'Black',
    destaque: 'Pontos e salas VIP',
    anuidade: 500,
    rendaMinima: 5000,
    pontosPorDolar: 2.4,
    programa: 'pontos',
    estilo: 'card-grafite',
    maisPedido: false
  },
  {
    id: 'click',
    nome: 'Itaú Click Platinum',
    bandeira: 'Visa',
    categoria: 'Platinum',
    destaque: 'Anuidade grátis para sempre',
    anuidade: 0,
    rendaMinima: 800,
    pontosPorDolar: 0,
    programa: 'sem-anuidade',
    estilo: 'card-laranja',
    maisPedido: false
  },
  {
    id: 'pao-de-acucar',
    nome: 'Pão de Açúcar Mastercard',
    bandeira: 'Mastercard',
    categoria: 'Gold',
    destaque: 'Descontos no supermercado',
    anuidade: 240,
    rendaMinima: 1500,
    pontosPorDolar: 1,
    programa: 'cashback',
    estilo: 'card-verde',
    maisPedido: false
  },
  {
    id: 'escolha',
    nome: 'Cartões Itaú',
    bandeira: 'Diversas',
    categoria: 'Todos',
    destaque: 'Escolha o cartão que dá match com você.',
    anuidade: null,
    rendaMinima: 0,
    pontosPorDolar: 0,
    programa: 'todos',
    estilo: 'card-laranja',
    maisPedido: true
  }
];

function renderCartoes() {
  return render(
    <MemoryRouter initialEntries={['/cartoes']}>
      <Routes>
        <Route path="/cartoes" element={<Cartoes />} />
        <Route path="/abra-sua-conta" element={<h1>Abrir conta</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  limparCache();
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        ({
          ok: true,
          status: 200,
          json: async () => cartoesMock
        }) as Response
    )
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  limparCache();
});

describe('Cartões', () => {
  it('renderiza todos os cartões disponíveis para contratação', async () => {
    renderCartoes();

    expect(await screen.findByText('4 cartão(ões) encontrado(s)')).toBeVisible();
    expect(screen.getAllByRole('button', { name: 'Peça o seu' })).toHaveLength(4);
    expect(screen.getByRole('heading', { name: 'Cartão Azul Infinite' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Itaú Click Platinum' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Cartões Itaú' })).not.toBeInTheDocument();
  });

  it('filtra pela renda mensal informada', async () => {
    const user = userEvent.setup();
    renderCartoes();

    await screen.findByText('4 cartão(ões) encontrado(s)');
    await user.type(screen.getByLabelText('Sua renda mensal (R$)'), '5000');

    expect(await screen.findByText('3 cartão(ões) encontrado(s)')).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Cartão Azul Infinite' })).not.toBeInTheDocument();
  });

  it('filtra pelo benefício selecionado', async () => {
    const user = userEvent.setup();
    renderCartoes();

    await screen.findByText('4 cartão(ões) encontrado(s)');
    await user.selectOptions(screen.getByLabelText('Benefício preferido'), 'pontos');

    expect(await screen.findByText('1 cartão(ões) encontrado(s)')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Uniclass Mastercard Black' })).toBeVisible();
  });

  it('filtra para mostrar somente cartões sem anuidade', async () => {
    const user = userEvent.setup();
    renderCartoes();

    await screen.findByText('4 cartão(ões) encontrado(s)');
    await user.click(screen.getByRole('checkbox', { name: 'Somente sem anuidade' }));

    expect(await screen.findByText('1 cartão(ões) encontrado(s)')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Itaú Click Platinum' })).toBeVisible();
  });

  it('altera a primeira opção conforme a ordenação', async () => {
    const user = userEvent.setup();
    renderCartoes();

    await screen.findByText('4 cartão(ões) encontrado(s)');
    expect(screen.getAllByRole('heading', { level: 3 })[0]).toHaveTextContent(
      'Itaú Click Platinum'
    );
    await user.selectOptions(screen.getByLabelText('Ordenar por'), '-pontosPorDolar');

    expect(screen.getAllByRole('heading', { level: 3 })[0]).toHaveTextContent(
      'Cartão Azul Infinite'
    );
  });

  it('limpa os filtros e restaura todos os cartões', async () => {
    const user = userEvent.setup();
    renderCartoes();

    await screen.findByText('4 cartão(ões) encontrado(s)');
    await user.type(screen.getByLabelText('Sua renda mensal (R$)'), '500');
    await user.selectOptions(screen.getByLabelText('Benefício preferido'), 'cashback');
    await user.click(screen.getByRole('checkbox', { name: 'Somente sem anuidade' }));
    expect(await screen.findByText('0 cartão(ões) encontrado(s)')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));

    expect(await screen.findByText('4 cartão(ões) encontrado(s)')).toBeVisible();
    expect(screen.getByLabelText('Sua renda mensal (R$)')).toHaveValue(null);
    expect(screen.getByLabelText('Benefício preferido')).toHaveValue('qualquer');
    expect(screen.getByRole('checkbox', { name: 'Somente sem anuidade' })).not.toBeChecked();
  });

  it('abre o modal, fecha com Escape e devolve o foco ao cartão', async () => {
    const user = userEvent.setup();
    renderCartoes();

    await screen.findByText('4 cartão(ões) encontrado(s)');
    const cartao = screen
      .getByRole('heading', { name: 'Itaú Click Platinum' })
      .closest('article') as HTMLElement;
    const trigger = within(cartao).getByRole('button', { name: 'Peça o seu' });
    await user.click(trigger);

    const modal = await screen.findByRole('dialog', { name: 'Itaú Click Platinum' });
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveTextContent('Anuidade: Grátis');
    expect(modal).toHaveTextContent('Anuidade grátis para sempre');
    expect(modal).toHaveTextContent('Ambiente de demonstração: nenhum pedido é realizado.');
    expect(document.body).toHaveClass('modal-open');

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveClass('modal-open');
  });

  it('fecha pelo botão e pelo backdrop', async () => {
    const user = userEvent.setup();
    renderCartoes();
    await screen.findByText('4 cartão(ões) encontrado(s)');

    await user.click(screen.getAllByRole('button', { name: 'Peça o seu' })[0]);
    const modal = await screen.findByRole('dialog');
    await user.click(within(modal).getAllByRole('button', { name: 'Fechar' })[0]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Peça o seu' })[0]);
    await screen.findByRole('dialog');
    await user.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('leva ao fluxo de abertura de conta sem enviar um pedido', async () => {
    const user = userEvent.setup();
    renderCartoes();

    await screen.findByText('4 cartão(ões) encontrado(s)');
    await user.click(screen.getAllByRole('button', { name: 'Peça o seu' })[0]);
    const link = await screen.findByRole('link', { name: 'Abrir conta e pedir' });
    expect(link).toHaveAttribute('href', '/abra-sua-conta');

    await user.click(link);

    expect(await screen.findByRole('heading', { name: 'Abrir conta' })).toBeVisible();
  });
});
