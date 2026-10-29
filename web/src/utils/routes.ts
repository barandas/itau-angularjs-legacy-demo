/**
 * Converte links no formato hashbang do app legado ("#!/cartoes") em caminhos do React Router
 * ("/cartoes"). Outros valores são retornados sem alteração.
 */
export function legacyHrefToPath(href: string): string {
  if (!href.startsWith('#!')) {
    return href;
  }
  const caminho = href.slice(2);
  return caminho.startsWith('/') ? caminho : `/${caminho}`;
}
