import type { Agencia } from '../types';

export function normalizar(texto: unknown): string {
  return String(texto || '')
    .toLowerCase()
    .replace(/[áàâã]/g, 'a')
    .replace(/[éê]/g, 'e')
    .replace(/[í]/g, 'i')
    .replace(/[óôõ]/g, 'o')
    .replace(/[ú]/g, 'u')
    .replace(/[ç]/g, 'c');
}

export function buscarAgencias(agencias: Agencia[], termo: unknown): Agencia[] {
  const texto = normalizar(termo).trim();
  if (!texto) {
    return agencias;
  }

  const digitos = texto.replace(/\D/g, '');
  return agencias.filter((agencia) => {
    const alvo = normalizar([
      agencia.nome,
      agencia.endereco,
      agencia.bairro,
      agencia.cidade,
      agencia.uf
    ].join(' '));
    if (alvo.indexOf(texto) !== -1) {
      return true;
    }
    if (digitos.length >= 3) {
      return (
        agencia.numero.indexOf(digitos) !== -1 ||
        agencia.cep.replace(/\D/g, '').indexOf(digitos) === 0
      );
    }
    return false;
  });
}
