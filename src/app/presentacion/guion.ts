/**
 * Qué hace la cámara y la demo en cada línea del guion (`public/presentacion/dueto-recorrido.*`).
 * Declarativo: cada paso se dispara cuando la voz dice su `ancla` (una frase de 1+ palabras; sin
 * tildes ni mayúsculas) dentro de su línea, o al empezar la línea si el ancla es `null`.
 *
 * La línea se identifica por un fragmento de su texto (`linea`), nunca por su posición: el guion
 * puede ganar o perder líneas (p. ej. las de Jules) sin tocar este archivo.
 *
 * Los ids de agente son `${departamento}:${rol}` según `armarRosterRecorrido` (0 Desarrollo,
 * 1 Ventas, 2 Contenido, 3 Finanzas, 4 Personal, 5 Investigación).
 */
export type Accion =
  /** Entra a un ambiente (`null` = casa completa sin cambiar el encuadre de orientación). */
  | { ambiente: string | null }
  /** Enfoca a un agente. */
  | { enfoca: string }
  /** Vuelve a la vista general inicial. */
  | { general: true }
  /** Entrega la cámara al usuario. */
  | { libre: true }
  /** Plano de la toma que empieza (1 = plano medio; más es más cerrado). Se restablece en cada cambio de sala. */
  | { plano: number }
  /** Anota un instante para la demo (cursor, panel, tarjetas, CTA); con `fin`, el final de la línea. */
  | { marca: string; fin?: true };

export interface Paso {
  /** Fragmento del texto de la línea (sin tildes ni mayúsculas ni signos). */
  linea: string;
  ancla: string | null;
  accion: Accion;
  /** El cambio de cámara es un corte: llega de golpe, sin viajar (ni se funde el empuje). */
  corte?: true;
}

export const GUION: Paso[] = [
  { linea: 'diecinueve empleados', ancla: null, accion: { general: true } },
  { linea: 'diecinueve empleados', ancla: 'esta es mi oficina', accion: { marca: 'empuje' } },
  { linea: 'Ella es Jules', ancla: null, accion: { ambiente: 'atrio' }, corte: true },
  { linea: 'Ella es Jules', ancla: null, accion: { marca: 'jules' } },
  { linea: 'Ella es Jules', ancla: null, accion: { enfoca: 'jules' }, corte: true },
  // Inserto de la casa en corte mientras dice que reparte el trabajo (líneas ámbar desde Jules).
  { linea: 'Ella es Jules', ancla: 'Reparte el trabajo', accion: { general: true }, corte: true },
  { linea: 'Ella es Jules', ancla: 'Reparte el trabajo', accion: { marca: 'reparte' } },
  // Inserto de una sala con sus burbujas de estado mientras revisa todo.
  { linea: 'Ella es Jules', ancla: 'revisa todo', accion: { ambiente: 'desarrollo' }, corte: true },
  // Vuelta a Jules en primer plano.
  {
    linea: 'Ella es Jules',
    ancla: 'lo que necesito saber',
    accion: { ambiente: 'atrio' },
    corte: true,
  },
  {
    linea: 'Ella es Jules',
    ancla: 'lo que necesito saber',
    accion: { enfoca: 'jules' },
    corte: true,
  },
  { linea: 'Ella es Jules', ancla: 'lo que necesito saber', accion: { plano: 1.05 } },
  { linea: 'Ella es Jules', ancla: 'se lo pido a ella', accion: { marca: 'mira-camara' } },
  { linea: 'Hola. Él da', ancla: null, accion: { marca: 'jules-fin', fin: true } },
  { linea: 'Arriba está Desarrollo', ancla: null, accion: { ambiente: 'desarrollo' } },
  { linea: 'Arriba está Desarrollo', ancla: 'Tomás', accion: { enfoca: '0:Front designer' } },
  { linea: 'Arriba está Desarrollo', ancla: 'si lo toco', accion: { marca: 'tomas-toca' } },
  { linea: 'Y este es Bruno', ancla: null, accion: { marca: 'tomas-fin' } },
  { linea: 'Y este es Bruno', ancla: 'Bruno', accion: { enfoca: '0:Integrador' } },
  { linea: 'Y este es Bruno', ancla: 'mirándome', accion: { marca: 'bruno-panel' } },
  { linea: 'Yo que tú lo apruebo', ancla: 'apruebo', accion: { marca: 'bruno-aprueba' } },
  { linea: 'Al lado está Contenido', ancla: null, accion: { marca: 'bruno-fin' } },
  { linea: 'Al lado está Contenido', ancla: null, accion: { ambiente: 'contenido' } },
  { linea: 'Al lado está Contenido', ancla: 'Valentina', accion: { enfoca: '2:Guionista' } },
  {
    linea: 'Al lado está Contenido',
    ancla: 'también el de este',
    accion: { marca: 'valentina-panel' },
  },
  { linea: 'Abajo, en Ventas', ancla: null, accion: { marca: 'valentina-fin' } },
  { linea: 'Abajo, en Ventas', ancla: null, accion: { ambiente: 'ventas' } },
  { linea: 'Abajo, en Ventas', ancla: 'Nico', accion: { enfoca: '1:Ejecutivo de ventas' } },
  { linea: 'Abajo, en Ventas', ancla: 'Le pido', accion: { marca: 'nico-pide' } },
  { linea: 'Abajo, en Ventas', ancla: 'se pone a trabajar', accion: { marca: 'nico-envia' } },
  { linea: 'Don Ramiro lleva', ancla: null, accion: { marca: 'nico-fin' } },
  { linea: 'Don Ramiro lleva', ancla: null, accion: { ambiente: 'finanzas' } },
  { linea: 'Don Ramiro lleva', ancla: 'Ramiro', accion: { enfoca: '3:Contador' } },
  { linea: 'arriba en la torre está Víctor', ancla: null, accion: { ambiente: 'investigacion' } },
  { linea: 'arriba en la torre está Víctor', ancla: 'Víctor', accion: { enfoca: '5:Científico' } },
  { linea: 'sé en qué está cada uno', ancla: null, accion: { general: true } },
  { linea: 'sé en qué está cada uno', ancla: null, accion: { marca: 'tarjetas' } },
  { linea: 'sé en qué está cada uno', ancla: null, accion: { marca: 'tarjetas-fin', fin: true } },
  { linea: 'Te la regalo', ancla: null, accion: { libre: true } },
  { linea: 'Síguelo y comenta', ancla: null, accion: { marca: 'cta' } },
];
