import { useState } from 'react';
import styles from './WhatsAppButton.module.css';

export function WhatsAppButton() {
  const [aberto, setAberto] = useState(false);

  return (
    <div className={styles.float}>
      {aberto && (
        <div className={styles.message}>
          <strong>Olá! 👋</strong>
          <br />
          Este é um canal de demonstração. Nenhuma mensagem é enviada.
        </div>
      )}
      <button
        type="button"
        className={styles.button}
        aria-label="Enviar uma mensagem"
        aria-expanded={aberto}
        onClick={() => setAberto((valor) => !valor)}
      >
        <img src="/assets/img/whatsapp.svg" alt="" width="30" height="30" />
      </button>
    </div>
  );
}
