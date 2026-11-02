import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Lab } from './Lab';
import { Presentacion } from './presentacion/Presentacion';

const raiz = document.getElementById('root');
if (!raiz) throw new Error('No se encontró el elemento #root');

const presentacion = new URLSearchParams(window.location.search).has('presentacion');

createRoot(raiz).render(<StrictMode>{presentacion ? <Presentacion /> : <Lab />}</StrictMode>);
