// ============================================================
// AJUSTES DE LA ANIMACIÓN DE "PRÓXIMOS EVENTOS"
// Cambia los números, guarda el archivo y la página se actualiza sola (npm run dev).
// Todo el recorrido va de p = 0 (inicio de la sección) a p = 1 (final del scroll).
// ============================================================

export const eventsAnimation = {
  // ---------- PC / TABLET (pantallas de 640 px o más) ----------
  desktop: {
    // Largo del scroll mientras la sección está fija. Más alto = animación más lenta.
    runwaySvh: 260,

    // Altura de la fila de tarjetas dentro de la pantalla (% del alto). 45 = centro exacto.
    rowTopPercent: 56,

    // Espacio entre tarjetas (en vw).
    gapVw: 2,

    // POSICIÓN INICIAL: cuánto empieza desplazada la fila hacia la DERECHA,
    // como fracción del ancho de la pantalla. 0.2 = poco, 0.45 = mucho, 0.8 = casi fuera.
    rowStartX: 0.45,

    // Hasta qué punto del scroll (0 a 1) termina de entrar la fila completa.
    rowEnterUntil: 0.7,

    // Desfase extra de cada tarjeta (en anchos de tarjeta). Se multiplica por 1, 2, 3…
    // 0.15 → la 1.ª sobra 15 %, la 2.ª 30 %, la 3.ª 45 %. Pon 0 para quitar la cascada.
    cardStartX: 0.15,

    // Retraso entre una tarjeta y la siguiente (en p). 0 = llegan todas juntas.
    cardStagger: 0.08,

    // Cuánto del scroll tarda cada tarjeta en acomodarse (en p). Más alto = más suave.
    cardSettleSpan: 0.6,

    // En qué punto del scroll empieza a formarse la escalera.
    stairStart: 0.35,

    // Cuánto baja cada tarjeta (en alturas de tarjeta). Se multiplica por 1, 2, 3…
    // 0.06 → 6 %, 12 %, 18 %. Pon 0 para quitar la escalera.
    stairStep: 0.06,
  },

  // ---------- CELULAR (menos de 640 px) ----------
  // Las tarjetas se apilan (una debajo de otra) para que se vean todas a la vez.
  mobile: {
    // Largo del scroll mientras la sección está fija.
    runwaySvh: 220,

    // Ancho de la columna de tarjetas (% del ancho de la pantalla).
    rowWidthPercent: 80,

    // Espacio entre tarjetas (en px).
    gapPx: 10,

    // Posición inicial hacia la DERECHA (fracción del ancho de pantalla). 0.6 = casi fuera.
    rowStartX: 0.6,

    rowEnterUntil: 0.7,

    // Desfase extra de cada tarjeta (en anchos de tarjeta), × 1, 2, 3…
    cardStartX: 0.15,

    // Retraso entre tarjetas.
    cardStagger: 0.1,

    cardSettleSpan: 0.6,

    // En qué punto empieza la "escalera" final.
    stairStart: 0.4,

    // En celular la escalera es hacia la derecha: cada tarjeta se corre este
    // porcentaje de su ancho × 0, 1, 2… Pon 0 para dejarlas alineadas.
    stairStep: 0.05,
  },
};

export type EventsAnimation = typeof eventsAnimation;
