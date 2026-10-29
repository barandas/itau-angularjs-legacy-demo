/**
 * Utilitários de formatação portados de app/filters/brl.filter.js e app/filters/cpf.filter.js.
 * Mantêm a mesma saída dos filtros AngularJS (inclusive espaço comum após "R$").
 */

const moedaBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'negative',
});

const decimalBR = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'negative',
});

/** Espaços especiais (NBSP/NNBSP) que o Intl insere entre o símbolo e o número. */
const ESPACOS_INTL = /[\u00a0\u202f]/g;

/**
 * Formata número como moeda brasileira: 1234.5 -> "R$ 1.234,50"; -10 -> "-R$ 10,00".
 * Valores nulos, vazios ou não numéricos retornam "" (como o filtro `brl`).
 */
export function formatBRL(valor: number | string | null | undefined, semSimbolo = false): string {
  if (valor === null || valor === undefined || (typeof valor === 'string' && valor.trim() === '')) {
    return '';
  }
  const numero = typeof valor === 'number' ? valor : Number(valor);
  if (!Number.isFinite(numero)) {
    return '';
  }
  const formatador = semSimbolo ? decimalBR : moedaBRL;
  return formatador.format(numero).replace(ESPACOS_INTL, ' ');
}

/**
 * Formata CPF progressivamente (útil durante a digitação): "12345678909" -> "123.456.789-09".
 * Caracteres não numéricos são descartados e o resultado é limitado a 11 dígitos.
 */
export function formatCPF(valor: string | number | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') {
    return '';
  }
  const digitos = String(valor).replace(/\D/g, '').slice(0, 11);
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
