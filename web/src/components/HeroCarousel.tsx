import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../config';
import type { Banner } from '../types';
import styles from './HeroCarousel.module.css';

interface HeroCarouselProps {
  banners: Banner[];
}

function converterRota(link: string): string {
  return link.startsWith('#!') ? link.slice(2) : link;
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado || banners.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndice((atual) => (atual + 1) % banners.length);
    }, APP_CONFIG.carouselInterval);

    return () => window.clearInterval(timer);
  }, [banners.length, pausado]);

  useEffect(() => {
    setIndice((atual) => (atual >= banners.length ? 0 : atual));
  }, [banners.length]);

  const irPara = (novoIndice: number) => {
    if (banners.length > 0) {
      setIndice((novoIndice + banners.length) % banners.length);
    }
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className={styles.hero} aria-label={`Carrossel com ${banners.length} itens`}>
      {banners.map((banner, index) => {
        const ativo = index === indice;
        const tema = styles[banner.tema] ?? '';

        return (
          <div
            className={`${styles.slide} ${tema} ${ativo ? styles.active : ''}`}
            key={banner.id}
            aria-hidden={!ativo}
          >
            <div className={styles.ilustracao} />
            <div className={styles.arte} aria-hidden="true">
              <div className={styles.celular}>
                <div className={styles.tela}>
                  <span className={styles.logoCelular}>itaú</span>
                  <span className={styles.saldo}>R$ ••••••</span>
                  <span className={styles.linha} />
                  <span className={`${styles.linha} ${styles.linhaCurta}`} />
                  <span className={styles.botoes}>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
              <div className={styles.cartaoFlutuante}>
                <span>itaú</span>
              </div>
            </div>
            <div className={`container ${styles.content}`}>
              <button
                type="button"
                className={styles.pause}
                onClick={() => setPausado((valor) => !valor)}
                aria-label="pausar o banner rotativo"
              >
                <span aria-hidden="true">{pausado ? '▶' : 'Ⅱ'}</span>
                {pausado ? 'continuar' : 'pausar'}
              </button>
              <div className={styles.text}>
                <h2>{banner.titulo}</h2>
                <p>{banner.subtitulo}</p>
                <Link
                  to={converterRota(banner.link)}
                  className={`btn btn-outline-white ${styles.cta}`}
                >
                  {banner.cta}
                </Link>
              </div>
              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.arrow}
                  onClick={() => irPara(indice - 1)}
                  aria-label="Item anterior"
                >
                  &lsaquo;
                </button>
                {banners.map((item, pagina) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`${styles.dot} ${pagina === indice ? styles.dotActive : ''}`}
                    onClick={() => irPara(pagina)}
                    aria-label={`Página ${pagina + 1} - ${item.titulo}`}
                    aria-current={pagina === indice ? 'true' : undefined}
                  />
                ))}
                <button
                  type="button"
                  className={styles.arrow}
                  onClick={() => irPara(indice + 1)}
                  aria-label="Próximo item"
                >
                  &rsaquo;
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
