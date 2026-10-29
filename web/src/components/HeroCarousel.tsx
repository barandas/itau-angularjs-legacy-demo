import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Banner } from '../api/types';
import { APP_CONFIG } from '../config';
import { legacyHrefToPath } from '../utils/routes';
import { Icon } from './Icon';

interface HeroCarouselProps {
  banners: Banner[];
  intervalo?: number;
}

/**
 * Carrossel de banners da Home (equivalente à diretiva heroCarousel), sem jQuery/$interval:
 * avanço automático, pausar/continuar, anterior/próximo e navegação pelos indicadores.
 */
export function HeroCarousel({
  banners,
  intervalo = APP_CONFIG.carouselInterval,
}: HeroCarouselProps) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = banners.length;
  const atual = total > 0 ? indice % total : 0;

  useEffect(() => {
    if (pausado || total < 2) {
      return;
    }
    const timer = window.setInterval(() => setIndice((i) => (i + 1) % total), intervalo);
    return () => window.clearInterval(timer);
  }, [pausado, total, intervalo]);

  if (total === 0) {
    return null;
  }

  const irPara = (i: number) => setIndice((i + total) % total);

  return (
    <section
      className="hero"
      aria-roledescription="carrossel"
      aria-label={`Carrossel com ${total} itens`}
    >
      {banners.map((banner, i) => {
        const ativo = i === atual;
        return (
          <div
            key={banner.id}
            className={`hero-slide ${banner.tema}${ativo ? ' ativo' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={!ativo}
          >
            <div className="hero-ilustracao" />
            <div className="hero-arte" aria-hidden="true">
              <div className="hero-celular">
                <div className="hero-celular-tela">
                  <span className="hero-celular-logo">itaú</span>
                  <span className="hero-celular-saldo">R$ ••••••</span>
                  <span className="hero-celular-linha" />
                  <span className="hero-celular-linha curta" />
                  <span className="hero-celular-botoes">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
              <div className="hero-cartao-flutuante">
                <span>itaú</span>
              </div>
            </div>
            <div className="container hero-conteudo">
              <div className="hero-texto">
                <h2>{banner.titulo}</h2>
                <p>{banner.subtitulo}</p>
                <Link
                  to={legacyHrefToPath(banner.link)}
                  className="btn btn-outline-white btn-lg"
                  tabIndex={ativo ? undefined : -1}
                >
                  {banner.cta}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className="container hero-conteudo hero-sobreposicao">
        <button
          type="button"
          className="hero-pausar"
          onClick={() => setPausado((p) => !p)}
          aria-label={pausado ? 'continuar o banner rotativo' : 'pausar o banner rotativo'}
        >
          <Icon nome={pausado ? 'play' : 'pause'} /> {pausado ? 'continuar' : 'pausar'}
        </button>
        <div className="hero-controles">
          <button
            type="button"
            className="hero-seta"
            onClick={() => irPara(atual - 1)}
            aria-label="Item anterior"
          >
            &lsaquo;
          </button>
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              className={`hero-dot${i === atual ? ' ativo' : ''}`}
              onClick={() => irPara(i)}
              aria-label={`Página ${i + 1} - ${banner.titulo}`}
              aria-current={i === atual ? 'true' : undefined}
            />
          ))}
          <button
            type="button"
            className="hero-seta"
            onClick={() => irPara(atual + 1)}
            aria-label="Próximo item"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </section>
  );
}
