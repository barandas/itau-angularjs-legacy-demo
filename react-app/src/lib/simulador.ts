const IOF_DIARIO = 0.000082;
const IOF_ADICIONAL = 0.0038;

export interface ResultadoSimulacao {
  valorSolicitado: number;
  parcela: number;
  meses: number;
  taxaMensal: number;
  taxaAnual: number;
  totalPago: number;
  juros: number;
  iof: number;
  cet: number;
}

export interface LinhaCronograma {
  numero: number;
  parcela: number;
  juros: number;
  amortizacao: number;
  saldo: number;
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export function calcularParcela(valor: number, taxaMensal: number, meses: number): number {
  if (!valor || !meses) {
    return 0;
  }
  if (!taxaMensal) {
    return arredondar(valor / meses);
  }
  const fator = Math.pow(1 + taxaMensal, meses);
  return arredondar((valor * (taxaMensal * fator)) / (fator - 1));
}

export function calcularIof(valor: number, meses: number): number {
  const dias = Math.min(meses * 30, 365);
  return arredondar(valor * IOF_ADICIONAL + valor * IOF_DIARIO * dias);
}

export function simular(
  valor: number,
  taxaMensal: number,
  meses: number
): ResultadoSimulacao {
  const parcela = calcularParcela(valor, taxaMensal, meses);
  const total = arredondar(parcela * meses);
  const iof = calcularIof(valor, meses);
  return {
    valorSolicitado: valor,
    parcela,
    meses,
    taxaMensal,
    taxaAnual: arredondar((Math.pow(1 + taxaMensal, 12) - 1) * 100) / 100,
    totalPago: total,
    juros: arredondar(total - valor),
    iof,
    cet: arredondar(total + iof)
  };
}

export function gerarCronograma(
  valor: number,
  taxaMensal: number,
  meses: number
): LinhaCronograma[] {
  const parcela = calcularParcela(valor, taxaMensal, meses);
  let saldo = valor;
  const linhas: LinhaCronograma[] = [];
  for (let i = 1; i <= meses; i += 1) {
    const juros = arredondar(saldo * taxaMensal);
    const amortizacao = arredondar(parcela - juros);
    saldo = arredondar(saldo - amortizacao);
    if (i === meses) {
      saldo = 0;
    }
    linhas.push({
      numero: i,
      parcela,
      juros,
      amortizacao,
      saldo: saldo < 0 ? 0 : saldo
    });
  }
  return linhas;
}
