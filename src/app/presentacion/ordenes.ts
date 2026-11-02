import type { AgenteOficina } from '@jules/oficina';
import { requiereAprobacion } from './aprobacion';

export { requiereAprobacion };

/** Un clip pregrabado de Jules confirmando una orden (`public/presentacion/ordenes/frases.json`). */
export interface Clip {
  archivo: string;
  texto: string;
  /** `true` si la frase dice que espera permiso; `false` si anuncia acción inmediata. */
  aprobacion: boolean;
}

const GENERICAS = ['Dame un resumen', 'Prioriza lo urgente', 'Avísame cuando termines'];

/** Tres órdenes rápidas por rol, para grabar sin escribir. */
const SUGERENCIAS: Record<string, string[]> = {
  'Front designer': [
    'Haz el botón más grande',
    'Revisa el modo oscuro',
    'Ajusta el espaciado del panel',
  ],
  Backend: [
    'Revisa la migración pendiente',
    'Agrega un índice a pedidos',
    'Corre los tests de nuevo',
  ],
  QA: ['Prueba el flujo de pago', 'Revisa en un iPhone real', 'Busca errores en el login'],
  Integrador: ['Sube la rama a producción', 'Espera hasta mañana', 'Resume qué cambió'],
  'Ejecutivo de ventas': [
    'Envía los seguimientos de hoy',
    'Cambia el tono a más cercano',
    'Sube a diez los seguimientos',
  ],
  'Analista comercial': [
    'Compara este mes con el anterior',
    'Dime qué cotización se enfría',
    'Arma el cierre semanal',
  ],
  Redactor: ['Escribe un mensaje de bienvenida', 'Hazlo más corto', 'Prepara tres versiones'],
  Guionista: [
    'Escribe el gancho del próximo reel',
    'Resume el guion en tres líneas',
    'Propón cinco títulos',
  ],
  'Editor de video': ['Corta el silencio del inicio', 'Agrega subtítulos', 'Exporta en vertical'],
  Community: [
    'Responde los comentarios nuevos',
    'Marca los que son preguntas',
    'Prepara el mensaje fijado',
  ],
  Contador: ['Cierra el mes ahora', 'Revisa las boletas pendientes', 'Dime cuánto IVA toca pagar'],
  Planificador: [
    'Proyecta los gastos de diciembre',
    'Busca dónde recortar',
    'Compara con el presupuesto',
  ],
  Cobranza: ['Recuerda los pagos atrasados', 'Prepara un aviso amable', 'Lista quién debe más'],
  'Asistente personal': [
    'Mueve mi reunión a la tarde',
    'Ordena mi agenda de mañana',
    'Recuérdame llamar al banco',
  ],
  Coach: [
    'Prepara mi revisión del domingo',
    'Dime una meta para la semana',
    'Revisa cómo voy con mis hábitos',
  ],
  Compras: [
    'Busca el mejor precio de mi lista',
    'Compara dos proveedores',
    'Arma el pedido del mes',
  ],
  Científico: [
    'Resume el estudio de la semana',
    'Busca fuentes sobre sueño',
    'Explícamelo en dos frases',
  ],
  'Vigía de novedades': [
    'Avísame de modelos nuevos',
    'Resume los lanzamientos de hoy',
    'Sigue a estos tres equipos',
  ],
  Verificador: [
    'Verifica esta noticia',
    'Busca la fuente primaria',
    'Marca lo que no tiene respaldo',
  ],
};

/** Respuestas cortas y con carácter por rol (locales, sin red ni API). */
const RESPUESTAS: Record<string, string[]> = {
  'Front designer': [
    'Me encanta. Lo dejo precioso.',
    'Pixel a pixel, ya lo veo.',
    'Listo, y se ve mejor que antes.',
  ],
  Backend: [
    'Anotado. Nada de esto rompe producción.',
    'Voy, con respaldo primero.',
    'Ya lo estoy corriendo.',
  ],
  QA: [
    'Si se rompe, me entero primero.',
    'Voy a intentar romperlo.',
    'Lo pruebo en serio, no en teoría.',
  ],
  Integrador: [
    'Entendido. Lo dejo listo, pero no subo nada sin tu aprobación.',
    'Preparado. Espero tu permiso para continuar.',
    'Todo en orden de mi lado. Tú das la señal.',
  ],
  'Ejecutivo de ventas': [
    'Perfecto. Los mensajes están listos, esperan tu visto bueno.',
    'Lo ajusto. Nada sale hasta que apruebes.',
    'Hecho. Dime cuándo y los envío.',
  ],
  'Analista comercial': [
    'Cruzando números, vuelvo con una conclusión.',
    'Los datos ya dicen algo interesante.',
    'Dame un momento y te lo cuento claro.',
  ],
  Redactor: [
    'Con tu tono, sin sonar a robot.',
    'Va, lo escribo como lo dirías tú.',
    'Tengo la primera línea. Ya sigo.',
  ],
  Guionista: [
    'Ya tengo el gancho en la cabeza.',
    'Escena uno, a escribir.',
    'Dame cinco minutos y tienes guion.',
  ],
  'Editor de video': [
    'Renderizando. Café incluido.',
    'Corte limpio, ya mismo.',
    'Va al timeline ahora.',
  ],
  Community: [
    'Yo respondo, tú decides cuáles.',
    'Los ordeno por urgencia.',
    'Listo, nadie se queda sin respuesta.',
  ],
  Contador: [
    'Cuadrando los números, como siempre.',
    'Anotado. Todo con respaldo.',
    'Lo reviso y te lo dejo en orden.',
  ],
  Planificador: [
    'Proyección en marcha.',
    'Lo simulo y te muestro el resultado.',
    'Entendido, armo el escenario.',
  ],
  Cobranza: [
    'Con tacto y con fecha.',
    'Lo preparo amable pero firme.',
    'Anotado, nadie se me escapa.',
  ],
  'Asistente personal': [
    'Tu agenda queda ordenada.',
    'Hecho, y con recordatorio.',
    'Ya lo muevo, tú no te preocupes.',
  ],
  Coach: ['Buen foco. Lo preparo para ti.', 'Una cosa a la vez, vamos.', 'Perfecto, esto suma.'],
  Compras: [
    'Comparando precios ahora mismo.',
    'Encuentro algo mejor, seguro.',
    'Anotado, voy por la mejor oferta.',
  ],
  Científico: [
    'Interesante. Reviso la evidencia.',
    'Solo con fuente, como siempre.',
    'Déjame leerlo bien antes de opinar.',
  ],
  'Vigía de novedades': [
    'Atento. Si sale algo, te aviso.',
    'Ya estoy mirando.',
    'Nada se me pasa.',
  ],
  Verificador: [
    'Sin fuente primaria no hay noticia.',
    'Voy a contrastarlo.',
    'Lo verifico antes de darlo por cierto.',
  ],
};

const RESPUESTAS_GENERICAS = ['Anotado, me pongo en eso.', 'Va, ya empiezo.', 'Entendido.'];

/** Alivio al aprobar, por rol. */
const ALIVIO: Record<string, string> = {
  Integrador: 'Gracias. Subo ahora y respiro tranquilo.',
  'Ejecutivo de ventas': 'Por fin. Envío los mensajes ahora.',
};
const ALIVIO_GENERICO = 'Gracias. Me pongo en marcha.';
const RECHAZO = 'Entendido. Lo dejo en pausa.';

export const sugerenciasDe = (rol: string): string[] => SUGERENCIAS[rol] ?? GENERICAS;

/** Frase del agente al recibir su `n`-ésima orden: rota por la lista del rol. */
export function respuestaDe(rol: string, n: number): string {
  const lista = RESPUESTAS[rol] ?? RESPUESTAS_GENERICAS;
  return lista[((n % lista.length) + lista.length) % lista.length] ?? '';
}

/**
 * Elige un clip al azar sin repetir el último (si hay más de uno). Solo entran los clips cuyo
 * sentido calza con el rol: quien exige aprobación no oye «no te va a pedir permiso».
 */
export function elegirClip(
  clips: Clip[],
  ultimo: string | null,
  azar: () => number,
  rol: string,
): Clip | undefined {
  const delRol = clips.filter((c) => c.aprobacion === requiereAprobacion(rol));
  const posibles = delRol.length > 1 ? delRol.filter((c) => c.archivo !== ultimo) : delRol;
  if (posibles.length === 0) return undefined;
  const i = Math.min(posibles.length - 1, Math.floor(azar() * posibles.length));
  return posibles[i];
}

/** Cola de clips por reproducir: una orden nueva no pisa la voz que ya suena. */
export const encolar = (cola: Clip[], clip: Clip): Clip[] => [...cola, clip];
export const siguiente = (cola: Clip[]): { clip: Clip | undefined; resto: Clip[] } => ({
  clip: cola[0],
  resto: cola.slice(1),
});

/** Lo que dice el agente cuando el cerebro marca su orden como delicada y no hay texto del modelo. */
export const FRASE_ORDEN_DELICADA =
  'Esta orden es delicada: te digo qué haré y espero tu aprobación.';

/** Queda `esperando_decision` con la orden como tarea, en el formato que lee `aprobar`. */
export function esperarDecision(agente: AgenteOficina, orden: string): AgenteOficina {
  return {
    ...agente,
    estado: 'esperando_decision',
    actividad: 'pensando',
    tarea: `Orden: «${orden.trim()}». Espera tu aprobación.`,
  };
}

/**
 * Transición al ordenar. Quien necesita aprobación queda `esperando_decision` con la orden
 * como tarea; el resto pasa a `trabajando` escribiendo. Una orden vacía no cambia nada.
 */
export function ordenar(agente: AgenteOficina, orden: string): AgenteOficina {
  const texto = orden.trim();
  if (!texto) return agente;
  if (requiereAprobacion(agente.rol)) return esperarDecision(agente, texto);
  return { ...agente, estado: 'trabajando', actividad: 'escribiendo', tarea: texto };
}

/** Aprobar: pasa a `trabajando` escribiendo, con la orden como tarea. */
export function aprobar(agente: AgenteOficina): { agente: AgenteOficina; frase: string } {
  const orden = /^Orden: «(.*)». Espera tu aprobación\.$/.exec(agente.tarea ?? '')?.[1];
  return {
    agente: {
      ...agente,
      estado: 'trabajando',
      actividad: 'escribiendo',
      tarea: orden ?? agente.tarea,
    },
    frase: ALIVIO[agente.rol] ?? ALIVIO_GENERICO,
  };
}

/** Rechazar: queda libre y sin actividad. */
export function rechazar(agente: AgenteOficina): { agente: AgenteOficina; frase: string } {
  return {
    agente: {
      ...agente,
      estado: 'libre',
      actividad: undefined,
      tarea: 'Orden rechazada. A la espera.',
    },
    frase: RECHAZO,
  };
}

/** Todo texto fijo que la Presentación puede mostrar por las órdenes (para revisar que sea genérico). */
export const textosDeOrdenes = (): string[] => [
  ...Object.values(SUGERENCIAS).flat(),
  ...GENERICAS,
  ...Object.values(RESPUESTAS).flat(),
  ...RESPUESTAS_GENERICAS,
  ...Object.values(ALIVIO),
  ALIVIO_GENERICO,
  RECHAZO,
];
