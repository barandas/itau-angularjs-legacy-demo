/** Formatos dos JSON em ../data consumidos pela Home (verificados nos arquivos atuais). */

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

export interface Destaque {
  titulo: string;
  descricao: string;
  cta: string;
  cor: string;
}

export interface Cartao {
  id: string;
  nome: string;
  bandeira: string;
  categoria: string;
  destaque: string;
  anuidade: number;
  rendaMinima: number;
  pontosPorDolar: number;
  programa: string;
  estilo: string;
  maisPedido: boolean;
}
