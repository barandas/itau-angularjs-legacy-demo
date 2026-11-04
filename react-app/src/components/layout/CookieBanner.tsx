import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cookieConsent } from '../../lib/cookieConsent';
import styles from './CookieBanner.module.css';

export function CookieBanner() {
  const [visivel, setVisivel] = useState(() => !cookieConsent.jaRespondeu());
  const [gerenciando, setGerenciando] = useState(false);
  const [analiticos, setAnaliticos] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(
    () => cookieConsent.subscribe((preferencia) => setVisivel(!preferencia)),
    []
  );

  if (!visivel) {
    return (
      <button
        type="button"
        className={styles.reopen}
        onClick={() => setVisivel(true)}
        aria-label="Gerenciar cookies"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m19.4 13 .1-1-.1-1 2-1.5-2-3.4-2.3.9a7 7 0 0 0-1.7-1L15 3h-4l-.4 2.9a7 7 0 0 0-1.7 1l-2.3-.9-2 3.4 2 1.5-.1 1 .1 1-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 1.7 1L11 21h4l.4-2.9a7 7 0 0 0 1.7-1l2.3.9 2-3.4-2-1.6ZM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
        </svg>
      </button>
    );
  }

  return (
    <section
      className={styles.banner}
      role="dialog"
      aria-label="Consentimento de cookies"
    >
      <p className={styles.text}>
        Utilizamos cookies para melhorar a experiência de navegação e identificar
        suas preferências. Você pode aceitar todos os cookies, rejeitar os não
        essenciais ou gerenciar os que serão usados. Leia mais em nossa{' '}
        <Link to="/">Política de Privacidade e cookies</Link>.
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.manage}
          onClick={() => setGerenciando((aberto) => !aberto)}
        >
          Gerenciar cookies
        </button>
        {gerenciando && (
          <div className={styles.options}>
            <label>
              <input type="checkbox" checked disabled /> Essenciais
            </label>
            <label>
              <input
                type="checkbox"
                checked={analiticos}
                onChange={(event) => setAnaliticos(event.target.checked)}
              />{' '}
              Analíticos
            </label>
            <label>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
              />{' '}
              Marketing
            </label>
          </div>
        )}
        <button
          type="button"
          className="btn btn-outline-navy btn-block"
          onClick={() => cookieConsent.rejeitarNaoEssenciais()}
        >
          Rejeitar não essenciais
        </button>
        <button
          type="button"
          className="btn btn-itau btn-block"
          onClick={() => cookieConsent.aceitarTodos()}
        >
          Aceitar todos
        </button>
      </div>
    </section>
  );
}
