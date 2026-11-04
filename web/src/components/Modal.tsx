import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  titulo: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ isOpen, titulo, onClose, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const tituloId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const elementoAnterior = document.activeElement;
    const elementoComFoco = elementoAnterior instanceof HTMLElement ? elementoAnterior : null;
    const overflowAnterior = document.body.style.overflow;
    const jaTinhaModalAberto = document.body.classList.contains('modal-open');

    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    const focaveis = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
    (focaveis?.[0] ?? dialogRef.current)?.focus();

    const tratarTeclado = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const elementos = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
      );
      const primeiro = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (!primeiro || !ultimo) {
        event.preventDefault();
        dialogRef.current?.focus();
      } else if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? ultimo : primeiro).focus();
      } else if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener('keydown', tratarTeclado);

    return () => {
      document.removeEventListener('keydown', tratarTeclado);
      document.body.style.overflow = overflowAnterior;
      if (!jaTinhaModalAberto) {
        document.body.classList.remove('modal-open');
      }
      elementoComFoco?.focus();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const fecharAoClicarNoFundo = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.backdrop}
      data-testid="modal-backdrop"
      onMouseDown={fecharAoClicarNoFundo}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={tituloId}>{titulo}</h2>
          <button type="button" className={styles.close} aria-label="Fechar" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}
