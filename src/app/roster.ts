import { departamentosBase } from '@jules/oficina';
import type { Actividad, AgenteOficina, EstadoAgente } from '@jules/oficina';

const TAREAS: Record<string, string> = {
  'Front designer': 'Armando el panel de pedidos con filtros por estado.',
  Backend: 'Migración de inventario por bodega. Corriendo tests.',
  QA: 'Revisando la versión de prueba en un iPhone real.',
  Integrador: 'La rama pasó todo. Pide permiso para subir a producción.',
  'Ejecutivo de ventas':
    'Preparó 6 seguimientos por WhatsApp para clientes de octubre. Espera tu aprobación para enviar.',
  'Analista comercial': 'Cruzando cotizaciones con ventas cerradas del mes.',
  Redactor: 'Escribiendo mensajes en tu tono para nuevos clientes.',
  Guionista: 'Último trabajo: guion del episodio 14.',
  'Editor de video': 'Renderizando el reel de la semana.',
  Community: 'Ordenando comentarios para que respondas.',
  Contador: 'Cierre de octubre programado para el lunes a las 09:00.',
  Planificador: 'Proyectando gastos de noviembre.',
  Cobranza: 'Revisando pagos pendientes de clientes.',
  'Asistente personal': 'Ordenando tu agenda de mañana y tus pendientes.',
  Coach: 'Prepara tu revisión semanal del domingo.',
  Compras: 'Comparando precios de lo que dejaste en tu lista.',
  Científico:
    'Boletín de la semana: entrenamiento, sueño, finanzas, agentes e interfaces generativas.',
  'Vigía de novedades': 'Siguiendo lanzamientos de modelos nuevos.',
  Verificador: 'Revisando si tres noticias tienen fuente primaria.',
};

/** Roles de cada departamento; `true` = se puede clonar para llenar la sala. */
const ROLES: [string, boolean][][] = [
  [
    ['Front designer', true],
    ['Backend', true],
    ['QA', true],
    ['Integrador', true],
  ],
  [
    ['Ejecutivo de ventas', true],
    ['Analista comercial', true],
    ['Redactor', true],
  ],
  [
    ['Guionista', true],
    ['Editor de video', true],
    ['Community', true],
  ],
  [
    ['Contador', false],
    ['Planificador', true],
    ['Cobranza', true],
  ],
  [
    ['Asistente personal', false],
    ['Coach', false],
    ['Compras', true],
  ],
  [
    ['Científico', false],
    ['Vigía de novedades', true],
    ['Verificador', true],
  ],
];

/**
 * Los 9 agentes base del prototipo: [departamento, rol, estado, actividad]. Las actividades
 * reparten los cuatro gestos (teclear, leer, pensar, hablar) para verlos en la escena.
 */
const BASE: [number, string, EstadoAgente, Actividad?][] = [
  [0, 'Front designer', 'trabajando', 'escribiendo'],
  [0, 'Backend', 'trabajando', 'leyendo'],
  [0, 'QA', 'libre'],
  [0, 'Integrador', 'esperando_decision', 'pensando'],
  [1, 'Ejecutivo de ventas', 'esperando_decision', 'hablando'],
  [2, 'Guionista', 'libre'],
  [3, 'Contador', 'libre'],
  [4, 'Asistente personal', 'trabajando', 'hablando'],
  [5, 'Científico', 'trabajando', 'pensando'],
];

const POR_SALA: Record<number, number[]> = {
  9: [4, 1, 1, 1, 1, 1],
  18: [5, 3, 3, 2, 2, 3],
  30: [5, 5, 5, 5, 5, 5],
};

export const CANTIDADES = [9, 18, 30];

/** Roster de ejemplo del laboratorio (9, 18 o 30 agentes), determinista. */
export function armarRoster(cantidad: number): AgenteOficina[] {
  const cuentas = POR_SALA[cantidad] ?? POR_SALA[9] ?? [];
  const usados = new Map<string, number>();
  const agentes: AgenteOficina[] = [];
  const agregar = (sala: number, rol: string, estado: EstadoAgente, actividad?: Actividad) => {
    const clave = `${sala}:${rol}`;
    const n = (usados.get(clave) ?? 0) + 1;
    usados.set(clave, n);
    const nombre = n > 1 ? `${rol} · ${n}` : rol;
    agentes.push({
      id: `${sala}:${nombre}`,
      nombre,
      rol,
      departamento: departamentosBase[sala]?.id ?? '',
      estado,
      actividad,
      tarea: TAREAS[rol] ?? 'Trabajando en su brief.',
    });
  };
  for (const [sala, rol, estado, actividad] of BASE) agregar(sala, rol, estado, actividad);

  let semilla = 7;
  const azar = () => {
    semilla = (semilla * 9301 + 49297) % 233280;
    return semilla / 233280;
  };
  ROLES.forEach((roles, sala) => {
    const clonables = roles.filter(([, clonable]) => clonable);
    let tiene = agentes.filter((a) => a.departamento === departamentosBase[sala]?.id).length;
    let k = 0;
    while (tiene < (cuentas[sala] ?? 0) && clonables.length > 0) {
      const rol = clonables[k % clonables.length]?.[0] ?? '';
      k++;
      const r = azar();
      agregar(sala, rol, r < 0.6 ? 'trabajando' : r < 0.9 ? 'libre' : 'esperando_decision');
      tiene++;
    }
  });
  return agentes;
}

const TAREAS_RECORRIDO: Record<string, string> = {
  'Front designer': 'Armando el panel de pedidos con filtros por estado.',
  Backend: 'Migración de inventario por bodega. Corriendo tests.',
  QA: 'Revisando la versión de prueba en un iPhone real.',
  Integrador: 'La rama pasó todo. Pide permiso para subir a producción.',
  'Ejecutivo de ventas': 'Preparó 6 seguimientos por WhatsApp. Espera tu aprobación para enviar.',
  'Analista comercial': 'Cruzando cotizaciones con ventas cerradas del mes.',
  Redactor: 'Escribiendo mensajes en tu tono para nuevos clientes.',
  Guionista: 'Escribiendo el guion del próximo video.',
  'Editor de video': 'Renderizando el reel de la semana.',
  Community: 'Ordenando comentarios para que respondas.',
  Contador: 'Cierre de mes programado para el lunes a las 09:00.',
  Planificador: 'Proyectando gastos del próximo mes.',
  Cobranza: 'Revisando pagos pendientes.',
  'Asistente personal': 'Ordenando tu agenda de mañana y tus pendientes.',
  Coach: 'Prepara tu revisión semanal del domingo.',
  Compras: 'Comparando precios de lo que dejaste en tu lista.',
  Científico: 'Boletín de la semana: sueño, finanzas y agentes.',
  'Vigía de novedades': 'Siguiendo lanzamientos de modelos nuevos.',
  Verificador: 'Revisando si tres noticias tienen fuente primaria.',
};

/**
 * Nombre propio de cada agente del recorrido (el rol queda debajo en rótulos y panel). Aquí se
 * cambian los nombres: el paquete `@jules/oficina` solo muestra `nombre`.
 */
const NOMBRES_RECORRIDO: Record<string, string> = {
  'Front designer': 'Tomás',
  Backend: 'Matías',
  QA: 'Camila',
  Integrador: 'Bruno',
  'Ejecutivo de ventas': 'Nico',
  'Analista comercial': 'Sofía',
  Redactor: 'Andrés',
  Guionista: 'Valentina',
  'Editor de video': 'Diego',
  Community: 'Lucía',
  Contador: 'Don Ramiro',
  Planificador: 'Rodrigo',
  Cobranza: 'Paula',
  'Asistente personal': 'Mariana',
  Coach: 'Joaquín',
  Compras: 'Fernanda',
  Científico: 'Víctor',
  'Vigía de novedades': 'Emilio',
  Verificador: 'Renata',
};

/** Departamento, rol, estado y actividad de cada agente del recorrido (incluye todos los roles que Jules nombra). */
const AGENTES_RECORRIDO: [number, string, EstadoAgente, Actividad?][] = [
  [0, 'Front designer', 'trabajando', 'escribiendo'],
  [0, 'Backend', 'trabajando', 'leyendo'],
  [0, 'QA', 'libre'],
  [0, 'Integrador', 'esperando_decision', 'pensando'],
  [1, 'Ejecutivo de ventas', 'esperando_decision', 'hablando'],
  [1, 'Analista comercial', 'trabajando', 'leyendo'],
  [1, 'Redactor', 'trabajando', 'escribiendo'],
  [2, 'Guionista', 'trabajando', 'escribiendo'],
  [2, 'Editor de video', 'trabajando', 'pensando'],
  [2, 'Community', 'libre'],
  [3, 'Contador', 'trabajando', 'leyendo'],
  [3, 'Planificador', 'trabajando', 'pensando'],
  [3, 'Cobranza', 'libre'],
  [4, 'Asistente personal', 'trabajando', 'hablando'],
  [4, 'Coach', 'libre'],
  [4, 'Compras', 'trabajando', 'leyendo'],
  [5, 'Científico', 'trabajando', 'pensando'],
  [5, 'Vigía de novedades', 'trabajando', 'leyendo'],
  [5, 'Verificador', 'libre'],
];

/**
 * Roster de la Presentación: un agente por rol, ids `${departamento}:${rol}` y tareas genéricas
 * (sin nombres de clientes). No cambia el roster del laboratorio.
 */
export function armarRosterRecorrido(): AgenteOficina[] {
  return AGENTES_RECORRIDO.map(([sala, rol, estado, actividad]) => ({
    id: `${sala}:${rol}`,
    nombre: NOMBRES_RECORRIDO[rol] ?? rol,
    rol,
    departamento: departamentosBase[sala]?.id ?? '',
    estado,
    actividad,
    tarea: TAREAS_RECORRIDO[rol] ?? 'Trabajando en su brief.',
  }));
}
