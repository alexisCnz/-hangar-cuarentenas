import type { Resumen } from './resumen';
import { CERTCHECK_URL } from './enlaces';

/** Marca y burbuja de Jules: resumen de la oficina y qué decisiones esperan. */
export function Burbuja({ resumen }: { resumen: Resumen }) {
  const { linea, mensaje } = resumen;
  return (
    <header className="hud burbuja" aria-live="polite">
      <h1>
        <span className="orbe" aria-hidden="true" />
        Hangar de Cuarentenas
      </h1>
      <p className="burbuja-resumen">{linea}</p>
      <p className="burbuja-mensaje">
        {mensaje.negrita && <b>{mensaje.negrita}</b>}
        {mensaje.resto}
      </p>
      <a href={CERTCHECK_URL} target="_blank" rel="noopener noreferrer" className="chip-certcheck">
        Probar CertCheck AI ↗
      </a>
    </header>
  );
}
