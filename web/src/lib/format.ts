export function formatBRL(valor: unknown, semSimbolo?: boolean): string {
  if (valor === null || valor === undefined || valor === '' || isNaN(valor as number)) {
    return '';
  }

  const numero = parseFloat(String(valor));
  const negativo = numero < 0;
  const partes = Math.abs(numero).toFixed(2).split('.');
  const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  let resultado = `${inteiro},${partes[1]}`;
  if (!semSimbolo) {
    resultado = `R$ ${resultado}`;
  }
  return `${negativo ? '-' : ''}${resultado}`;
}

export function formatCPF(valor: unknown): string {
  if (!valor) {
    return '';
  }

  const digitos = String(valor).replace(/\D/g, '').slice(0, 11);
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
