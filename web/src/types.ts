export interface Banner {
  id: number;
  titulo: string;
  subtitulo: string;
  cta: string;
  link: string;
  tema: string;
}

export interface Atalho {
  icone: string;
  titulo: string;
  descricao: string;
  link: string;
}

export interface Produto {
  id: string;
  categoria: string;
  icone: string;
  titulo: string;
  descricao: string;
  cta: string;
  link: string;
  cor: string;
}

export interface Cartao {
  id: string;
  nome: string;
  bandeira: string;
  categoria: string;
  destaque: string;
  anuidade: number | null;
  rendaMinima: number;
  pontosPorDolar: number;
  programa: string;
  estilo: string;
  maisPedido: boolean;
}

export interface Destaque {
  titulo: string;
  descricao: string;
  cta: string;
  cor: string;
}

export interface Agencia {
  numero: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  horario: string;
  acessivel: boolean;
}

export interface TaxaEmprestimo {
  nome: string;
  taxaMensal: number;
  prazoMin: number;
  prazoMax: number;
  valorMin: number;
  valorMax: number;
}

export interface Taxas {
  pessoal: TaxaEmprestimo;
  consignado: TaxaEmprestimo;
  renegociacao: TaxaEmprestimo;
}
