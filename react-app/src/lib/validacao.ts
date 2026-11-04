export function cpfValido(cpf: unknown): boolean {
  const digitos = String(cpf || '').replace(/\D/g, '');
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) {
    return false;
  }

  let soma = 0;
  let resto: number;
  for (let i = 0; i < 9; i += 1) {
    soma += parseInt(digitos.charAt(i), 10) * (10 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) {
    resto = 0;
  }
  if (resto !== parseInt(digitos.charAt(9), 10)) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i += 1) {
    soma += parseInt(digitos.charAt(i), 10) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) {
    resto = 0;
  }
  return resto === parseInt(digitos.charAt(10), 10);
}

export function celularValido(celular: unknown): boolean {
  const digitos = String(celular || '').replace(/\D/g, '');
  return digitos.length === 11 && digitos.charAt(2) === '9';
}

export function idadeMinima(
  dataNascimento: string | number | Date | null | undefined,
  minimo?: number
): boolean {
  if (!dataNascimento) {
    return false;
  }

  const nasc = new Date(
    dataNascimento instanceof Date ? dataNascimento.getTime() : dataNascimento
  );
  if (isNaN(nasc.getTime())) {
    return false;
  }

  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const diferencaMes = hoje.getMonth() - nasc.getMonth();
  if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < nasc.getDate())) {
    idade -= 1;
  }
  return idade >= (minimo || 18);
}
