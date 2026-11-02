import { plano } from '@jules/oficina';
import type { AgenteOficina } from '@jules/oficina';
import { CARGOS_VISIBLES } from '../roster';

const PISO: Record<string, string> = {
  piso1: 'Piso 1',
  piso2: 'Piso 2',
  piso3: 'Piso 3',
  torre: 'Torre',
};

/** El guion llama «gimnasio» al living (ahí están el Asistente y el Coach). */
const NOMBRE_ROTULADO: Record<string, string> = { living: 'Shelf Life Vencido' };

/** Rótulo de sala tipo documental: «Piso 3 · Desarrollo». El atrio va solo; `null` = sin rótulo. */
export function rotuloAmbiente(id: string | null): string | null {
  const ambiente = plano.ambientes.find((a) => a.id === id);
  if (!ambiente) return null;
  if (ambiente.id === 'atrio') return 'Atrio';
  const nombre = NOMBRE_ROTULADO[ambiente.id] ?? ambiente.nombre;
  const piso = PISO[ambiente.nivel];
  return piso ? `${piso} · ${nombre}` : nombre;
}

export interface RotuloAgente {
  nombre: string;
  rol: string;
  /** Qué hace, en una frase corta (la primera de su tarea); vacío en el rótulo de Jules. */
  linea: string;
}

/** Rótulo de Jules mientras la cámara está en el atrio. */
export const ROTULO_JULES: RotuloAgente = {
  nombre: 'Jules',
  rol: 'Supervisora de Calidad & Cuarentenas',
  linea: '',
};

/** Nombre grande, rol y una línea de lo que hace el agente enfocado; `null` si no hay o no existe. */
export function rotuloAgente(id: string | null, agentes: AgenteOficina[]): RotuloAgente | null {
  const agente = agentes.find((a) => a.id === id);
  if (!agente) return null;
  const primera = (agente.tarea ?? '').split(/(?<=[.!?])\s/)[0] ?? '';
  return {
    nombre: agente.nombre,
    rol: CARGOS_VISIBLES[agente.rol] ?? agente.rol,
    linea: primera.replace(/[.!?]+$/, ''),
  };
}
