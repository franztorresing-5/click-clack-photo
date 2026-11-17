'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// ==========================================
// GALERÍA "COLUMNAS CONTRARIAS" (Detour)
// - 3 columnas dentro de un escenario sticky de 100vh; el scroll nativo mueve la columna
//   central hacia arriba y las laterales hacia abajo a la misma velocidad.
// - Al elegir una foto (1400 ms, ease in-out expo) pasa al centro, el resto se vuelve
//   una fila de miniaturas, el encabezado baja y aparece el título.
// - Solo se animan transform y opacity.
// ==========================================

export type GalleryItem = { title: string; category: string; imagePath: string };

const DURATION = 1400; // ms del detalle
const STAGGER = 30; // ms entre miniaturas
const SMOOTHING = 0.13; // lerp por frame a 60 fps
const TITLE_START = 0.2; // el título entra al 20 % de la línea de tiempo

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeInOutExpo = (x: number) =>
  x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;

type Geo = { dx: number; dy: number; s: number; delay: number; dur: number; fade: boolean };
type Api = { open: (index: number) => void; close: () => void };

const css = `
.cg-stage{height:100vh;height:100svh}
.cg-clip,.cg-pic{transition:transform .6s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){
  .cg-btn:hover .cg-clip{transform:scale(.88,.95)}
  .cg-btn:hover .cg-pic{transform:scale(1.2045,1.1158)}
}
.cg-btn:focus-visible .cg-clip{transform:scale(.88,.95)}
.cg-btn:focus-visible .cg-pic{transform:scale(1.2045,1.1158)}
@media (prefers-reduced-motion:reduce){.cg-clip,.cg-pic{transition:none}}
`;

export default function CounterGallery({ items, heading }: { items: GalleryItem[]; heading: string }) {
  const [rows, setRows] = useState(6);
  const [openIdx, setOpenIdx] = useState(-1);

  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const apiRef = useRef<Api | null>(null);
  const lastSelected = useRef(-1);

  // Tres columnas; si hay pocas fotos se repiten (mismo orden) hasta llenar las columnas.
  const photos = useMemo(() => {
    if (items.length === 0) return [];
    const perCol = Math.max(rows, Math.ceil(items.length / 3));
    return Array.from({ length: perCol * 3 }, (_, k) => ({ key: k, col: k % 3, item: items[k % items.length] }));
  }, [items, rows]);

  // Filas por columna: suficientes para que haya recorrido de scroll también en celulares
  useEffect(() => {
    let lastW = 0;
    let lastH = 0;
    const compute = (force: boolean) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Evita recalcular por el vaivén de la barra del navegador móvil
      if (!force && vw === lastW && Math.abs(vh - lastH) < 150) return;
      lastW = vw;
      lastH = vh;
      const colW = vw < 640 ? vw * 0.29 : vw * 0.24;
      const unit = (colW * 4) / 3 + vw * 0.02;
      setRows(clamp(Math.ceil((2.2 * vh) / unit), 6, 12));
    };
    const id = requestAnimationFrame(() => compute(true));
    const onResize = () => compute(false);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Motor: scroll suavizado, columnas contrarias y línea de tiempo de detalle
  useEffect(() => {
    const stage = stageRef.current;
    const runway = runwayRef.current;
    const headingEl = headingRef.current;
    const titleEl = titleRef.current;
    const backEl = backRef.current;
    const cols = colRefs.current.slice(0, 3);
    const btns = photoRefs.current.slice(0, photos.length);
    if (!stage || !runway || !headingEl || !titleEl || !backEl || photos.length === 0) return;
    if (cols.some((c) => !c) || btns.some((b) => !b)) return;
    const columns = cols as HTMLDivElement[];
    const buttons = btns as HTMLButtonElement[];
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let last = 0;
    let smoothed = 0;
    let maxScroll = 0;
    let p = 0; // progreso 0..1 de la línea de tiempo
    let dir = 0; // 1 abriendo, -1 cerrando, 0 quieto
    let sel = -1;
    let geo: Geo[] = [];
    let savedScroll = 0;
    let locked = false;

    // Si una imagen no existe todavía, se queda el marcador gris de siempre
    buttons.forEach((b) =>
      b.querySelectorAll('img').forEach((img) => {
        if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
      }),
    );

    const measure = () => {
      const colH = Math.max(...columns.map((c) => c.offsetHeight));
      runway.style.minHeight = '0';
      runway.style.height = `${colH}px`; // el runway mide lo mismo que una columna
      maxScroll = Math.max(0, colH - stage.clientHeight);
    };
    const targetScroll = () => clamp(-runway.getBoundingClientRect().top, 0, maxScroll);
    const applyColumns = () => {
      columns[0].style.transform = `translate3d(0,${smoothed}px,0)`;
      columns[1].style.transform = `translate3d(0,${-smoothed}px,0)`;
      columns[2].style.transform = `translate3d(0,${smoothed}px,0)`;
    };

    const clearTimeline = () => {
      buttons.forEach((b) => {
        b.style.transform = '';
        b.style.opacity = '';
      });
      columns.forEach((c) => (c.style.zIndex = ''));
      headingEl.style.transform = '';
      titleEl.style.transform = '';
      titleEl.style.opacity = '0';
      backEl.style.opacity = '0';
    };

    const applyTimeline = () => {
      const t = p * DURATION;
      for (let k = 0; k < buttons.length; k++) {
        const g = geo[k];
        if (!g) continue;
        const e = easeInOutExpo(clamp((t - g.delay) / g.dur, 0, 1));
        buttons[k].style.transform = `translate3d(${g.dx * e}px,${g.dy * e}px,0) scale(${1 + (g.s - 1) * e})`;
        buttons[k].style.opacity = g.fade ? String(1 - e) : '1';
      }
      const eh = easeInOutExpo(clamp(t / DURATION, 0, 1));
      headingEl.style.transform = `translate3d(0,${eh * 300}%,0) scaleY(${1 + 3 * eh})`;
      const et = easeInOutExpo(clamp((t - TITLE_START * DURATION) / (DURATION * (1 - TITLE_START)), 0, 1));
      titleEl.style.transform = `translate3d(0,${-100 * (1 - et)}%,0) scaleY(${3 - 2 * et})`;
      titleEl.style.opacity = String(et);
      backEl.style.opacity = String(et);
    };

    // ---- bloqueo de scroll de la página mientras está abierto ----
    const prevent = (e: Event) => e.preventDefault();
    const onScrollLocked = () => {
      if (Math.abs(window.scrollY - savedScroll) > 0.5) window.scrollTo(0, savedScroll);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        backEl.focus({ preventScroll: true });
        return;
      }
      if (e.key === ' ' && e.target === backEl) return; // deja que Espacio active "Volver"
      if ([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
    };
    const lock = () => {
      if (locked) return;
      locked = true;
      window.addEventListener('wheel', prevent, { passive: false });
      window.addEventListener('touchmove', prevent, { passive: false });
      window.addEventListener('scroll', onScrollLocked, { passive: true });
      window.addEventListener('keydown', onKey);
    };
    const unlock = () => {
      if (!locked) return;
      locked = false;
      window.removeEventListener('wheel', prevent);
      window.removeEventListener('touchmove', prevent);
      window.removeEventListener('scroll', onScrollLocked);
      window.removeEventListener('keydown', onKey);
    };

    const ensureLoop = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const finishClose = () => {
      sel = -1;
      p = 0;
      dir = 0;
      clearTimeline();
      unlock();
      smoothed = targetScroll();
      applyColumns();
      setOpenIdx(-1);
    };

    function tick(now: number) {
      raf = 0;
      const dt = last ? Math.min(now - last, 50) : 1000 / 60;
      last = now;
      let again = false;
      if (dir !== 0) {
        p = clamp(p + (dir * dt) / DURATION, 0, 1);
        applyTimeline();
        if ((dir > 0 && p >= 1) || (dir < 0 && p <= 0)) {
          const closing = dir < 0;
          dir = 0;
          if (closing) finishClose();
        } else again = true;
      } else if (p === 0) {
        const tgt = targetScroll();
        smoothed = reduceQuery.matches ? tgt : smoothed + (tgt - smoothed) * (1 - Math.pow(1 - SMOOTHING, dt / (1000 / 60)));
        if (Math.abs(tgt - smoothed) < 0.05) smoothed = tgt;
        else again = true;
        applyColumns();
      }
      if (again) raf = requestAnimationFrame(tick);
      else last = 0;
    }

    function open(index: number) {
      if (p !== 0 || dir !== 0 || sel !== -1) return;
      const stageRect = stage!.getBoundingClientRect();
      const sw = stageRect.width;
      const sh = stageRect.height;
      const rects = buttons.map((b) => b.getBoundingClientRect());
      const cx = stageRect.left + sw / 2;
      const cy = stageRect.top + sh / 2;

      const visibleFraction = (r: DOMRect) => {
        const w = Math.max(0, Math.min(r.right, stageRect.right) - Math.max(r.left, stageRect.left));
        const h = Math.max(0, Math.min(r.bottom, stageRect.bottom) - Math.max(r.top, stageRect.top));
        return (w * h) / (r.width * r.height);
      };

      // Por defecto, las fotos fuera de pantalla se desvanecen
      geo = buttons.map(() => ({ dx: 0, dy: 0, s: 1, delay: 0, dur: DURATION, fade: true }));

      // Foto elegida: al centro, ajustada a 62 % del alto o 86 % del ancho (lo menor)
      const sr = rects[index];
      const scale = Math.min((0.62 * sh) / sr.height, (0.86 * sw) / sr.width);
      geo[index] = {
        dx: cx - (sr.left + sr.width / 2),
        dy: cy - (sr.top + sr.height / 2),
        s: scale,
        delay: 0,
        dur: DURATION,
        fade: false,
      };

      // Las demás que están en pantalla: una sola fila de miniaturas abajo
      const thumbs = buttons
        .map((_, k) => k)
        .filter((k) => k !== index && visibleFraction(rects[k]) >= 0.15)
        .sort((a, b) => (a % 3) - (b % 3) || rects[a].top - rects[b].top);
      const n = thumbs.length;
      if (n > 0) {
        const gap = clamp(sw * 0.008, 4, 10);
        const tw = Math.max(6, Math.min(clamp(sw * 0.045, 28, 72), (sw * 0.9 - (n - 1) * gap) / n));
        const th = (tw * 4) / 3;
        const rowW = n * tw + (n - 1) * gap;
        const x0 = stageRect.left + (sw - rowW) / 2;
        const rowCy = Math.min(stageRect.bottom, window.innerHeight) - 20 - th / 2;
        const maxDelay = (n - 1) * STAGGER;
        thumbs.forEach((k, j) => {
          const r = rects[k];
          geo[k] = {
            dx: x0 + j * (tw + gap) + tw / 2 - (r.left + r.width / 2),
            dy: rowCy - (r.top + r.height / 2),
            s: tw / r.width,
            delay: j * STAGGER,
            dur: DURATION - maxDelay,
            fade: false,
          };
        });
      }

      sel = index;
      lastSelected.current = index;
      savedScroll = window.scrollY;
      columns[index % 3].style.zIndex = '20'; // cada columna es un contexto de apilado
      lock();
      setOpenIdx(index);
      if (reduceQuery.matches) {
        p = 1;
        dir = 0;
        applyTimeline();
      } else {
        dir = 1;
        ensureLoop();
      }
    }

    function close() {
      if (sel === -1 || dir < 0) return;
      if (reduceQuery.matches) {
        finishClose();
        return;
      }
      dir = -1;
      ensureLoop();
    }

    const onScroll = () => {
      if (p === 0 && dir === 0) ensureLoop();
    };
    const onResize = () => {
      if (sel !== -1) finishClose(); // si cambia el tamaño estando abierto, se cierra de golpe
      measure();
      smoothed = clamp(smoothed, 0, maxScroll);
      ensureLoop();
    };

    apiRef.current = { open, close };
    clearTimeline();
    measure();
    smoothed = targetScroll();
    applyColumns();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      unlock();
      apiRef.current = null;
      clearTimeline();
    };
  }, [photos]);

  // Foco: "Volver" al abrir; la foto elegida al cerrar
  useEffect(() => {
    if (openIdx >= 0) backRef.current?.focus({ preventScroll: true });
    else if (lastSelected.current >= 0) {
      photoRefs.current[lastSelected.current]?.focus({ preventScroll: true });
      lastSelected.current = -1;
    }
  }, [openIdx]);

  if (photos.length === 0) return null;
  const isOpen = openIdx >= 0;

  return (
    <>
      <style>{css}</style>
      <div ref={runwayRef} className="relative" style={{ minHeight: '200vh' }}>
        <div ref={stageRef} className="cg-stage sticky top-0 overflow-hidden bg-[#616161]">
          {/* Columnas */}
          <div className="absolute inset-0 flex justify-center gap-[3vw] sm:gap-[4vw]" inert={isOpen}>
            {[0, 1, 2].map((c) => (
              <div
                key={c}
                ref={(el) => {
                  colRefs.current[c] = el;
                }}
                className={`flex w-[29vw] flex-none flex-col gap-[2vw] py-[2vw] will-change-transform sm:w-[24vw] ${
                  c === 1 ? 'self-start' : 'self-end'
                }`}
              >
                {photos
                  .filter((ph) => ph.col === c)
                  .map((ph) => (
                    <button
                      key={ph.key}
                      ref={(el) => {
                        photoRefs.current[ph.key] = el;
                      }}
                      type="button"
                      aria-label={ph.item.title}
                      onClick={() => apiRef.current?.open(ph.key)}
                      className="cg-btn relative block aspect-3/4 w-full flex-none cursor-pointer will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      <span className="cg-clip absolute inset-0 block overflow-hidden rounded-lg bg-[#1c1c1c] sm:rounded-2xl">
                        <span className="cg-pic absolute inset-0 block">
                          {/* Marcador mientras no exista la foto real en public/img/ */}
                          <span className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#333] to-[#111]">
                            <span className="px-2 text-center text-[clamp(7px,1.1vw,12px)] font-semibold uppercase tracking-widest text-[#8A8A8A]">
                              [ Foto: {ph.item.category} ]
                            </span>
                          </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ph.item.imagePath}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </span>
                      </span>
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {/* Encabezado grande, blanco con mix-blend-mode: difference */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-[1vw] mix-blend-difference" aria-hidden="true">
            <span
              ref={headingRef}
              className="block origin-top select-none whitespace-nowrap font-sans text-[10vw] leading-[0.8] font-bold tracking-tighter text-white uppercase"
            >
              {heading}
            </span>
          </div>

          {/* Título de la foto abierta */}
          <div className="pointer-events-none absolute inset-x-0 top-22 z-30 flex justify-center px-6">
            <p
              ref={titleRef}
              aria-hidden={!isOpen}
              style={{ opacity: 0 }}
              className="origin-top text-center font-serif text-3xl text-white italic sm:text-5xl"
            >
              {isOpen ? photos[openIdx]?.item.title : ''}
            </p>
          </div>

          {/* Volver */}
          <button
            ref={backRef}
            type="button"
            inert={!isOpen}
            onClick={() => apiRef.current?.close()}
            style={{ opacity: 0, pointerEvents: isOpen ? 'auto' : 'none' }}
            className="absolute bottom-22 left-1/2 z-30 -translate-x-1/2 cursor-pointer rounded-full bg-white px-5 py-2.5 text-xs font-bold tracking-wider text-black uppercase transition-colors hover:bg-[#DBDBDB] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:top-22 sm:bottom-auto sm:left-8 sm:translate-x-0"
          >
            Volver
          </button>
        </div>
      </div>
    </>
  );
}
