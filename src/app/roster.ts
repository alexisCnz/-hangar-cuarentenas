import { departamentosBase } from '@jules/oficina';
import type { Actividad, AgenteOficina, EstadoAgente } from '@jules/oficina';

const TAREAS: Record<string, string> = {
  'Front designer':
    'Inspeccionando lote de álabes P/N CFM56-BLD-9041 (PO-AERO-7701 Demo). Falta FAA Form 8130-3 original del taller.',
  Backend:
    'Reclamando duplicado digital de EASA Form 1 al taller reparador AeroTurbine Ficticio.',
  QA: 'Liberación técnica detenida para válvula P/N VLV-402-HYD. Certificado de conformidad ilegible.',
  Integrador:
    'Acta de liberación técnica lista para álabe P/N CFM56-BLD-9041. Espera tu firma de QA para desmarcar de cuarentena.',
  'Ejecutivo de ventas':
    'Expediente RMA-4402 preparado contra Titan Aero Components Demo. Espera tu aprobación para despachar.',
  'Analista comercial':
    'Cruzando costos de flete internacional por devoluciones RMA con el proveedor SkySupply Ficticio.',
  Redactor:
    'Redactando informe de no conformidad técnica por bomba con fuga de combustible en banco de pruebas.',
  Guionista:
    'Documentando discrepancia en actuador: empaque rotulado P/N ACT-9920-A pero pieza física grabada P/N ACT-9920-B.',
  'Editor de video':
    'Procesando fotografías macro de la placa de datos para informe de divergencia física P/N.',
  Community:
    'Consultando catálogo ilustrado de partes (IPC) para confirmar si P/N ACT-9920-B es alterno aprobado.',
  Contador:
    'Conciliando nota de crédito NC-8821 Demo por $14,200 USD tras scrap de corona dentada no reparable.',
  Planificador:
    'Coordinando corte físico con soplete y certificado BER (Beyond Economical Repair) de tren de aterrizaje.',
  Cobranza:
    'Reclamando nota de crédito pendiente al proveedor GlobalParts Ficticio por componente mutilado.',
  'Asistente personal':
    'Monitoreando temperatura y humedad relativa en la bóveda climatizada de sellos según ATA 106.',
  Coach:
    'Programando rotación y descarte preventivo de sellantes y sellos con fecha de cura próxima a vencer.',
  Compras:
    'Cotizando reemplazo urgente de kit de juntas P/N SL-KIT-084 vencido con proveedor AeroPlast Demo.',
  Científico:
    'Auditando trazabilidad completa Back-to-Birth de disco de turbina P/N CF6-DSK-3320 de AeroNordic Ficticio.',
  'Vigía de novedades':
    'Monitoreando nuevas directivas de aeronavegabilidad (ADs) de FAA/EASA aplicables a partes en almacén.',
  Verificador:
    'Verificando firmas y licencias de mecánicos A&P en registros históricos de mantenimiento mayor.',
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

/** Cargos visibles en pantalla para el Hangar de Cuarentenas (sin cambiar la clave interna `rol`). */
export const CARGOS_VISIBLES: Record<string, string> = {
  'Front designer': 'Inspector de Certificación',
  Backend: 'Verificador de Registros',
  QA: 'Auditora de Recepción',
  Integrador: 'Ingeniero de Liberación QA',
  'Ejecutivo de ventas': 'Gestor de RMA y Garantías',
  'Analista comercial': 'Analista de Costos y Retornos',
  Redactor: 'Coordinador de Discrepancias',
  Guionista: 'Verificadora de Recepción',
  'Editor de video': 'Especialista en Metrología e Imagen',
  Community: 'Analista de Catálogos e IPC',
  Contador: 'Analista de Scrap y Notas de Crédito',
  Planificador: 'Gestor de Disposición y Mutilación',
  Cobranza: 'Recuperadora de Créditos de Repuestos',
  'Asistente personal': 'Monitoreo de Almacén Climatizado',
  Coach: 'Supervisor de Inspecciones Periódicas',
  Compras: 'Especialista en Reposición de Sellos',
  Científico: 'Auditor de Trazabilidad',
  'Vigía de novedades': 'Monitor de Directivas de Aeronavegabilidad',
  Verificador: 'Verificadora de Firmas y Logbooks',
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
    const nombreBase = NOMBRES_RECORRIDO[rol] ?? rol;
    const nombre = n > 1 ? `${nombreBase} · ${n}` : nombreBase;
    agentes.push({
      id: `${sala}:${nombre}`,
      nombre,
      rol,
      departamento: departamentosBase[sala]?.id ?? '',
      estado,
      actividad,
      tarea: TAREAS[rol] ?? 'Trabajando en inspección técnica.',
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
  'Front designer':
    'Inspeccionando lote de álabes P/N CFM56-BLD-9041 (PO-AERO-7701 Demo). Falta FAA Form 8130-3 original del taller.',
  Backend:
    'Reclamando duplicado digital de EASA Form 1 al taller reparador AeroTurbine Ficticio.',
  QA: 'Liberación técnica detenida para válvula P/N VLV-402-HYD. Certificado de conformidad ilegible.',
  Integrador:
    'Acta de liberación técnica lista para álabe P/N CFM56-BLD-9041. Espera tu firma de QA para desmarcar de cuarentena.',
  'Ejecutivo de ventas':
    'Expediente RMA-4402 preparado contra Titan Aero Components Demo. Espera tu aprobación para despachar.',
  'Analista comercial':
    'Cruzando costos de flete internacional por devoluciones RMA con el proveedor SkySupply Ficticio.',
  Redactor:
    'Redactando informe de no conformidad técnica por bomba con fuga de combustible en banco de pruebas.',
  Guionista:
    'Documentando discrepancia en actuador: empaque rotulado P/N ACT-9920-A pero pieza física grabada P/N ACT-9920-B.',
  'Editor de video':
    'Procesando fotografías macro de la placa de datos para informe de divergencia física P/N.',
  Community:
    'Consultando catálogo ilustrado de partes (IPC) para confirmar si P/N ACT-9920-B es alterno aprobado.',
  Contador:
    'Conciliando nota de crédito NC-8821 Demo por $14,200 USD tras scrap de corona dentada no reparable.',
  Planificador:
    'Coordinando corte físico con soplete y certificado BER (Beyond Economical Repair) de tren de aterrizaje.',
  Cobranza:
    'Reclamando nota de crédito pendiente al proveedor GlobalParts Ficticio por componente mutilado.',
  'Asistente personal':
    'Monitoreando temperatura y humedad relativa en la bóveda climatizada de sellos según ATA 106.',
  Coach:
    'Programando rotación y descarte preventivo de sellantes y sellos con fecha de cura próxima a vencer.',
  Compras:
    'Cotizando reemplazo urgente de kit de juntas P/N SL-KIT-084 vencido con proveedor AeroPlast Demo.',
  Científico:
    'Auditando trazabilidad completa Back-to-Birth de disco de turbina P/N CF6-DSK-3320 de AeroNordic Ficticio.',
  'Vigía de novedades':
    'Monitoreando nuevas directivas de aeronavegabilidad (ADs) de FAA/EASA aplicables a partes en almacén.',
  Verificador:
    'Verificando firmas y licencias de mecánicos A&P en registros históricos de mantenimiento mayor.',
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
