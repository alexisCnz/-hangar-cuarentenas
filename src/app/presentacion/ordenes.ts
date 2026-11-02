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

const GENERICAS = [
  'Emitir reporte de condición',
  'Mantener precinto de cuarentena',
  'Verificar trazabilidad en ERP',
];

/** Tres órdenes rápidas por rol, para grabar sin escribir. */
const SUGERENCIAS: Record<string, string[]> = {
  'Front designer': [
    'Exigir FAA 8130-3 original',
    'Validar firma del taller en EASA Form 1',
    'Rechazar lote por falta de release note',
  ],
  Backend: [
    'Solicitar duplicado a AeroTurbine Ficticio',
    'Confirmar número de autorización',
    'Corroborar bloque 12 de observaciones',
  ],
  QA: [
    'Bloquear ingreso de válvula en ERP',
    'Colocar precinto rojo de rechazo',
    'Revisar si sello de aduana coincide',
  ],
  Integrador: [
    'Aprobar liberación técnica de álabe',
    'Mantener retención en cuarentena',
    'Emitir certificado de conformidad final',
  ],
  'Ejecutivo de ventas': [
    'Despachar expediente RMA a Titan Aero Demo',
    'Exigir nota de crédito inmediata',
    'Pausar envíos a proveedor no conforme',
  ],
  'Analista comercial': [
    'Calcular flete aéreo de retorno',
    'Totalizar costo de repuestos varados',
    'Comparar penalidades por demora',
  ],
  Redactor: [
    'Redactar informe de no conformidad técnica',
    'Notificar discrepancia a Compras Demo',
    'Emitir reporte de condición de pieza',
  ],
  Guionista: [
    'Revisar código de barras en empaque',
    'Confrontar P/N físico con orden PO',
    'Marcar lote con etiqueta amarilla de mismatch',
  ],
  'Editor de video': [
    'Tomar boroscopía de número de serie',
    'Medir holgura de acople con calibre',
    'Adjuntar fotos al legajo de cuarentena',
  ],
  Community: [
    'Buscar alterno equivalente en manual IPC',
    'Consultar boletín de servicio (SB)',
    'Validar modificación menor de P/N',
  ],
  Contador: [
    'Registrar nota de crédito en el ledger',
    'Validar monto de indemnización de seguro',
    'Dar de baja pieza del balance de activos',
  ],
  Planificador: [
    'Emitir certificado de mutilación BER',
    'Coordinar corte de pieza con soplete',
    'Archivar acta de destrucción física',
  ],
  Cobranza: [
    'Reclamar saldo a GlobalParts Ficticio',
    'Bloquear pagos a proveedor en falta',
    'Confirmar depósito de nota de crédito',
  ],
  'Asistente personal': [
    'Revisar higrómetro en bóveda de sellos',
    'Registrar bitácora ambiental ATA 106',
    'Ajustar climatización a 21°C',
  ],
  Coach: [
    'Auditar sellos con fecha de cura próxima a vencer',
    'Rotar inventario bajo regla FIFO',
    'Separar elastómeros vencidos a scrap',
  ],
  Compras: [
    'Pedir cotización de O-rings a AeroPlast Demo',
    'Exigir lote con fecha de cura menor a 6 meses',
    'Tramitar orden de compra PO-AERO-9012 Demo',
  ],
  Científico: [
    'Reconstruir historial Back-to-Birth',
    'Verificar ciclos de vida desde fábrica',
    'Comprobar horas de vuelo en AeroNordic Ficticio',
  ],
  'Vigía de novedades': [
    'Consultar directivas de emergencia FAA',
    'Filtrar partes afectadas por AD 2026-11',
    'Reportar componente crítico a Calidad',
  ],
  Verificador: [
    'Comprobar licencia A&P de mecánico firmante',
    'Validar sello del taller de overhaul',
    'Detectar enmiendas en bitácora técnica',
  ],
};

/** Respuestas cortas y con carácter por rol (locales, sin red ni API). */
const RESPUESTAS: Record<string, string[]> = {
  'Front designer': [
    'Anotado. Sin FAA Form 8130-3 válido no sale ningún álabe a la línea.',
    'Revisando el release note del taller. Si no cumple, se queda retenido.',
    'Cotejando firmas autorizadas en el bloque 14 del certificado.',
  ],
  Backend: [
    'Enlace enviado a AeroTurbine Ficticio. Reclamando copia fiel digital.',
    'Esperando confirmación del taller reparador.',
    'Verificando el registro en el portal de trazabilidad.',
  ],
  QA: [
    'Pieza bloqueada en el ERP. Etiqueta roja colocada.',
    'Ningún componente dudoso entra al stock aeronavegable.',
    'Inspección dimensional en curso. Te informo ante cualquier desvío.',
  ],
  Integrador: [
    'Entendido. Legajo técnico armado, pero no libero la pieza sin tu visto bueno.',
    'Pieza en cuarentena. Espero tu firma técnica para habilitar el despacho.',
    'Todos los sellos de calidad están listos. Tú autorizas la salida.',
  ],
  'Ejecutivo de ventas': [
    'Expediente RMA armado contra Titan Aero Demo. Espera tu aprobación para el retorno.',
    'Reclamo formal listo. No despachamos nada hasta que lo revises.',
    'Garantía lista para enviar al proveedor. Tú das la orden.',
  ],
  'Analista comercial': [
    'Calculando flete y lucro cesante por pieza inoperativa.',
    'El costo de la cuarentena ya está documentado en la reclamación.',
    'Analizando impacto financiero del retorno RMA.',
  ],
  Redactor: [
    'Reporte de condición redactado con estándar técnico aeronáutico.',
    'Detallando la fuga en el sello para que el proveedor no la objete.',
    'Carta de discrepancia lista para el departamento de calidad.',
  ],
  Guionista: [
    'Divergencia de P/N fotografiada y registrada en el sistema.',
    'Empaque y placa no coinciden: discrepancia formal en proceso.',
    'Documentando diferencia física para el rechazo en recepción.',
  ],
  'Editor de video': [
    'Fotos macro en alta resolución adjuntas a la ficha de la pieza.',
    'Boroscopía completada: el número de serie físico coincide con el rechazo.',
    'Evidencia fotográfica lista para auditoría.',
  ],
  Community: [
    'Revisando catálogo IPC: el P/N no figura como alterno homologado.',
    'Consultando los boletines de servicio del fabricante.',
    'Confirmando si la modificación de número de parte fue certificada.',
  ],
  Contador: [
    'Nota de crédito por repuesto scrap conciliada con precisión.',
    'Todo con soporte documental: baja de inventario y crédito en orden.',
    'Revisando valor residual y recupero contable del material.',
  ],
  Planificador: [
    'Orden de corte y mutilación física BER programada.',
    'Coordinando la inutilización del componente para evitar piezas no autorizadas (SUP).',
    'Certificado de destrucción preparado para archivo aeronáutico.',
  ],
  Cobranza: [
    'Seguimiento al reembolso de GlobalParts Ficticio en marcha.',
    'Exigiendo la nota de crédito por la pieza declarada chatarra.',
    'Crédito a favor reclamado al proveedor.',
  ],
  'Asistente personal': [
    'Condiciones ambientales de la bóveda dentro de los rangos ATA 106.',
    'Bitácora de temperatura y humedad al día.',
    'Almacén de elastómeros controlado y seguro.',
  ],
  Coach: [
    'Lote de sellos auditado. Descartando los que superaron el shelf life.',
    'Plan de rotación de material perecible actualizado.',
    'Prevención de vida límite en marcha.',
  ],
  Compras: [
    'Cotización de reemplazo urgente pedida a AeroPlast Demo.',
    'Exigiendo certificado de cura reciente para el nuevo lote.',
    'Gestionando reposición inmediata de material aeronavegable.',
  ],
  Científico: [
    'Trazabilidad Back-to-Birth auditada: faltaba un registro de operador previo.',
    'Solo componentes con historial 100% ininterrumpido pueden volar.',
    'Reconstruyendo la cadena de custodia desde la entrega de fábrica.',
  ],
  'Vigía de novedades': [
    'Monitoreo de Directivas de Aeronavegabilidad (ADs) al día.',
    'Alerta técnica: verificando si este lote está bajo boletín mandatorio.',
    'Base de datos de la autoridad aeronáutica contrastada.',
  ],
  Verificador: [
    'Firmas y estampillas de mecánicos A&P verificadas en sistema.',
    'Bitácoras históricas contrastadas: los sellos son conformes.',
    'Verificando trazabilidad documental antes de la auditoría.',
  ],
};

const RESPUESTAS_GENERICAS = [
  'Anotado, registro la acción técnica.',
  'Entendido, pieza bajo custodia.',
  'Procedimiento de cuarentena actualizado.',
];

/** Alivio al aprobar, por rol. */
const ALIVIO: Record<string, string> = {
  Integrador:
    'Firma de QA recibida. Álabe liberado de cuarentena y transferido a stock aeronavegable.',
  'Ejecutivo de ventas':
    'Autorización recibida. Expediente RMA despachado y reclamo formal presentado a Titan Aero Demo.',
};
const ALIVIO_GENERICO = 'Conformidad técnica otorgada. Procediendo con el plan de acción.';
const RECHAZO = 'Decisión acatada. El repuesto permanece bajo precinto de cuarentena hasta nueva orden.';

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
  'Esta orden afecta la aeronavegabilidad: preparo el legajo y espero tu firma de QA.';

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
