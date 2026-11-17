'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Calendar, ChevronRight, MapPin } from 'lucide-react';
import { eventsAnimation as cfg } from './eventsAnimationConfig';

// ==========================================
// ENTRADA EN CASCADA DE TARJETAS (scroll)
// Los valores se ajustan en ./eventsAnimationConfig.ts
// - Runway nativo + marco sticky de 100svh.
// - PC: la fila entra desde la derecha, cada tarjeta con su propio desfase, y después
//   baja en escalera. Celular: las tarjetas se apilan, entran desde la derecha y terminan
//   en escalera hacia la derecha (escalan un poco si no caben en la pantalla).
// - Solo transform. Sin opacidad, sin 3D, sin librerías.
// - prefers-reduced-motion: sin runway ni movimiento.
// ==========================================

export type EventCard = { date: string; title: string; location: string; status: string };

type Props = {
  events: EventCard[];
  whatsappNumber: string;
  skipHref: string;
  skipLabel: string;
  /** Encabezado de la sección (título y texto), se queda fijo dentro del marco */
  children: ReactNode;
};

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const sine = (t: number) => (1 - Math.cos(clamp01(t) * Math.PI)) / 2;
const SMALL = '(max-width: 639px)'; // mismo corte que `sm` de Tailwind (640 px)

const css = `
.ev-runway{height:calc(var(--ev-runway-d) * 1vh);height:calc(var(--ev-runway-d) * 1svh)}
.ev-frame{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;overflow:clip}
.ev-head{position:absolute;top:5.5rem;left:0;right:0;padding:0 1.5rem}
.ev-fit{display:contents}
.ev-row{position:absolute;left:5%;top:var(--ev-top);width:90%;margin:0;padding:0;list-style:none;display:grid;
  grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:var(--ev-gap-d);transform:translate3d(0,-50%,0)}
.ev-card{will-change:transform}
@media (max-width:639px){
  .ev-runway{height:calc(var(--ev-runway-m) * 1vh);height:calc(var(--ev-runway-m) * 1svh)}
  .ev-frame{display:flex;flex-direction:column;padding-top:5rem}
  .ev-head{position:static;padding:0 1.25rem;margin-bottom:.75rem}
  .ev-fit{display:block;flex:none;width:100%;transform-origin:50% 0}
  .ev-row{position:static;width:calc(var(--ev-row-w) * 1%);margin:0 0 0 5%;display:flex;flex-direction:column;
    gap:var(--ev-gap-m);transform:none}
}
@media (prefers-reduced-motion:reduce) and (min-width:640px){
  .ev-runway{height:100vh;height:100svh}
  .ev-row{transform:translate3d(0,-50%,0)!important}
  .ev-card{transform:none!important}
}
@media (prefers-reduced-motion:reduce) and (max-width:639px){
  .ev-runway{height:auto}
  .ev-frame{position:relative;height:auto;overflow:visible;padding-bottom:3rem}
  .ev-fit{transform:none!important}
  .ev-row{transform:none!important}
  .ev-card{transform:none!important}
}
`;

export default function EventsCascade({ events, whatsappNumber, skipHref, skipLabel, children }: Props) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const runway = runwayRef.current;
    const frame = frameRef.current;
    const fit = fitRef.current;
    const row = rowRef.current;
    const cards = cardRefs.current.slice(0, events.length).filter((c): c is HTMLLIElement => !!c);
    if (!runway || !frame || !fit || !row || cards.length === 0) return;

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallQuery = window.matchMedia(SMALL);

    let raf = 0;
    let disposed = false;
    // Medidas con offsetWidth/offsetHeight (no cuentan transformaciones)
    let frameW = 0;
    let frameH = 0;
    let runwayH = 0;
    let fitScale = 1;
    let cardW: number[] = [];
    let cardH: number[] = [];

    const measure = () => {
      frameW = frame.clientWidth;
      frameH = frame.clientHeight;
      runwayH = runway.offsetHeight;
      cardW = cards.map((c) => c.offsetWidth);
      cardH = cards.map((c) => c.offsetHeight);
      // Celular: si las tarjetas apiladas no caben en la pantalla, se escalan para que quepan
      if (smallQuery.matches && !reduceQuery.matches) {
        const avail = frameH - fit.offsetTop - 16;
        const natural = row.offsetHeight;
        fitScale = natural > 0 ? Math.max(0.7, Math.min(1, avail / natural)) : 1;
      } else {
        fitScale = 1;
      }
    };

    const clear = () => {
      fit.style.transform = '';
      row.style.transform = '';
      cards.forEach((c) => (c.style.transform = ''));
    };

    const update = () => {
      raf = 0;
      if (disposed) return;
      if (reduceQuery.matches) {
        clear();
        return;
      }
      const mobile = smallQuery.matches;
      const k = mobile ? cfg.mobile : cfg.desktop;

      const range = runwayH - frameH;
      const p = range > 0 ? clamp01(-runway.getBoundingClientRect().top / range) : 1;

      // Posición de la fila completa
      const rowEnter = sine(p / Math.max(k.rowEnterUntil, 0.0001));
      const rowX = frameW * k.rowStartX * (1 - rowEnter);

      // Escalera
      const step = sine((p - k.stairStart) / Math.max(1 - k.stairStart, 0.0001));

      if (mobile) {
        fit.style.transform = fitScale < 1 ? `scale(${fitScale})` : '';
        row.style.transform = `translate3d(${rowX / fitScale}px,0,0)`;
      } else {
        fit.style.transform = '';
        row.style.transform = `translate3d(${rowX}px,-50%,0)`;
      }

      cards.forEach((card, i) => {
        const settle = sine((p - i * k.cardStagger) / Math.max(k.cardSettleSpan, 0.0001));
        let cardX = cardW[i] * k.cardStartX * (i + 1) * (1 - settle);
        let cardY = 0;
        if (mobile) cardX += cardW[i] * k.stairStep * i * step; // escalera hacia la derecha
        else cardY = cardH[i] * k.stairStep * (i + 1) * step; // escalera hacia abajo
        card.style.transform = `translate3d(${cardX}px,${cardY}px,0)`;
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    update();

    window.addEventListener('scroll', schedule, { passive: true });
    const ro = new ResizeObserver(remeasure);
    ro.observe(frame);
    cards.forEach((c) => ro.observe(c));
    reduceQuery.addEventListener('change', remeasure);
    smallQuery.addEventListener('change', remeasure);
    document.fonts?.ready.then(() => {
      if (!disposed) remeasure();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      ro.disconnect();
      reduceQuery.removeEventListener('change', remeasure);
      smallQuery.removeEventListener('change', remeasure);
      clear();
    };
  }, [events.length]);

  const vars = {
    '--n': events.length,
    '--ev-runway-d': cfg.desktop.runwaySvh,
    '--ev-runway-m': cfg.mobile.runwaySvh,
    '--ev-top': `${cfg.desktop.rowTopPercent}%`,
    '--ev-gap-d': `${cfg.desktop.gapVw}vw`,
    '--ev-gap-m': `${cfg.mobile.gapPx}px`,
    '--ev-row-w': cfg.mobile.rowWidthPercent,
  } as CSSProperties;

  return (
    <>
      <style>{css}</style>
      <div ref={runwayRef} className="ev-runway" style={vars}>
        <div ref={frameRef} className="ev-frame">
          <a
            href={skipHref}
            className="sr-only focus:not-sr-only focus:absolute focus:top-24 focus:left-4 focus:z-60 focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-xs focus:font-bold focus:tracking-wider focus:text-black focus:uppercase"
          >
            {skipLabel}
          </a>

          <div className="ev-head">{children}</div>

          <div ref={fitRef} className="ev-fit">
            <ul ref={rowRef} role="list" className="ev-row">
              {events.map((event, index) => (
                <li
                  key={index}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="ev-card"
                >
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-[#616161]/30 bg-[#181818] p-4 transition-colors hover:border-white/50 sm:p-8">
                    <div>
                      <div className="mb-2 flex items-center justify-between sm:mb-4">
                        <span className="rounded-full bg-[#333] px-3 py-1 text-[11px] font-bold text-[#DBDBDB] sm:text-xs">{event.status}</span>
                        <Calendar size={18} className="hidden text-[#8A8A8A] sm:block" />
                        {/* En celular la fecha va junto al estado para ahorrar altura */}
                        <p className="text-[11px] font-medium text-[#B3B3B3] sm:hidden">{event.date}</p>
                      </div>
                      <p className="mb-1 hidden text-xs font-medium text-[#B3B3B3] sm:block">{event.date}</p>
                      <h3 className="mb-1 text-base leading-snug font-bold text-white sm:mb-3 sm:text-xl">{event.title}</h3>
                      <p className="mb-3 flex items-center gap-2 text-xs text-[#8A8A8A] sm:mb-6 sm:text-sm">
                        <MapPin size={16} className="shrink-0" /> {event.location}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa apartar mi lugar para el evento: ${event.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#333] py-2.5 text-center text-xs font-bold tracking-wider text-white uppercase transition-all hover:bg-white hover:text-black sm:py-3"
                    >
                      Apartar Lugar <ChevronRight size={16} />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
