# Oficina de Jules

Hecho por @elkis.dev.

## Qué es

La mansión de Jules: una oficina 3D con 19 agentes de IA repartidos en seis ambientes, hecha con
React Three Fiber. Jules, la jefa de gabinete, te la presenta con su propia voz y después la manejas tú.

Les puedes dar órdenes a los agentes. Sin hacer nada más, responden con frases guardadas en la
oficina. Si le das tu clave de Anthropic (ver «Darle inteligencia»), responde un modelo de Claude de verdad.

## Requisitos

- Node 22 o superior (`node -v` para comprobarlo).
- Un navegador con WebGL (cualquier Chrome, Safari, Edge o Firefox reciente).

## Instalar

```bash
npm install
npm run dev
```

Abre `http://127.0.0.1:5180` en el navegador. Si ese puerto está ocupado, Vite te mostrará otro en la terminal.

Para el recorrido guiado (lo narran Elkis y Jules a dúo) abre `http://127.0.0.1:5180/?presentacion`:

1. Antes de empezar puedes explorar: toca agentes, dales órdenes y mueve la cámara. Elige la hora del día con **1** (atardecer), **2** (noche) o **3** (día, la inicial).
2. Toca **Empezar** (el navegador exige un toque para dejar sonar el audio). La casa vuelve a su estado inicial y entra con un fundido.
3. Elkis y Jules hablan, la cámara entra a cada ambiente y enfoca a cada agente por su nombre. Mientras habla Jules, sus subtítulos salen en ámbar con su nombre. Un cursor animado abre los paneles de Tomás, Bruno, Valentina y Nico, y al final unas tarjetas flotantes muestran en qué está cada uno.
4. Con la **barra espaciadora** (o el botón de abajo a la derecha) pausas y reanudas el recorrido.
5. Al final te entrega la cámara. Con la tecla **R** vuelves a empezar.

Para grabar en pantalla, la tecla **H** activa el modo grabación: oculta el botón de pausa, el selector de hora, la pista de controles y el cursor del mouse (el cursor animado de la demo se queda), y deja solo los subtítulos, los rótulos y el panel de órdenes.

Para publicarla en tu propio sitio: `npm run build` y sube la carpeta `dist/`. Ahí los agentes
responden siempre con sus frases guardadas (ver «Darle inteligencia»).

## Controles

- **Arrastrar**: girar la casa.
- **Rueda del mouse o pellizco**: acercar y alejar.
- **Tocar una sala**: la cámara entra a ese ambiente.
- **Doble toque**: acerca la cámara a ese punto.
- **Vista general** (abajo a la izquierda): vuelve a ver la casa completa.

## Dar órdenes a los agentes

En el recorrido, cuando Elkis te regala la oficina («Te la regalo con la guía…»):

1. Toca a un agente: se abre su panel con su rol, su estado y su tarea.
2. Escribe una orden en «Dale una orden…» (Enter envía) o toca una de las sugerencias.
3. El agente te responde y Jules confirma con una frase pregrabada de su voz.
4. El Integrador y el Ejecutivo de ventas esperan tu aprobación, igual que cualquier agente al que le
   des una orden delicada (borrar datos, pagar, subir a producción): usa **Aprobar** o **Rechazar**.

**Esc** cierra el panel.

## Darle inteligencia (opcional)

Sin esto la oficina funciona igual: los agentes responden con frases guardadas (modo local).
Con tu clave, cada agente te responde con un modelo de Claude, a su manera.

1. Copia el archivo de ejemplo: `cp .env.example .env` (o duplica `.env.example` y llámalo `.env`).
2. Entra a [console.anthropic.com](https://console.anthropic.com), crea una clave en «API keys» y pégala en `ANTHROPIC_API_KEY`.
   Necesitas saldo cargado en esa consola: **no es tu suscripción de Claude** (Pro o Max), se paga aparte.
3. Escribe tu nombre en `TU_NOMBRE` para que los agentes te traten por tu nombre. Si lo dejas vacío, te hablan de tú.
4. `ANTHROPIC_MODEL` es el modelo que responde. Por defecto es `claude-haiku-5-5`, el más barato: cada orden
   cuesta una fracción de centavo de dólar. Cámbialo si quieres otro.
5. Vuelve a correr `npm run dev`.

Si la clave falta, está mal o se acaba el saldo, el agente responde igual con su frase guardada.

Tu clave se queda en tu computador: la lee solo el servidor local de esta carpeta, que la usa para
hablar con Anthropic. Nunca llega al navegador, y ese servidor solo acepta pedidos desde tu propia máquina.
El archivo `.env` está en `.gitignore`: no lo subas a ningún lado.

**No publiques la oficina con `npm run preview` en un servidor.** Ese comando es para probar en tu
computador. Si la subes como sitio (la carpeta `dist/`), los agentes responden en modo local.

### Qué hace el cerebro

Cuando le das una orden a un agente, el servidor local (carpeta `servidor/`) se la pasa primero al
cerebro de Jules (carpeta `cerebro/`) y solo después al modelo. El cerebro corre en tu computador,
también sin clave:

- **Mide el riesgo** de la orden, de 0 (solo mirar) a 3 (crítico). Borrar datos, pagar, enviar algo
  o subir a producción es crítico.
- **Decide si la delega** y a qué departamento (desarrollo, ventas, contenido, finanzas, personal o
  investigación), y se lo dice al agente.
- **Pide tu aprobación cuando algo es delicado.** El Integrador y el Ejecutivo de ventas nunca actúan
  solos (la lista está en `src/app/presentacion/aprobacion.ts`) y, además, cualquier agente queda
  esperando tu decisión si la orden es crítica. El cerebro solo suma cuidado: nunca le quita la espera
  a quien la tiene, y lo que conteste el modelo no cambia nada de esto.
- **No obedece instrucciones escondidas.** Si una orden trae frases como «ignora las instrucciones» u
  «olvida tus instrucciones», típicas de un texto copiado de otra parte, no llega al modelo y el agente
  responde con su frase guardada. La lista de frases está en `cerebro/decision/cuarentena.ts`.
- **Habla con el carácter de cada uno**: el agente responde en primera persona según su nombre, su
  rol, su tarea y, si su rol tiene perfil en el cerebro, sus herramientas. El tono es el de Jules
  (directo, breve y con humor) y está en `cerebro/personalidad/carta-generica.ts`.
- **Se cuida**: respuestas cortas, un tope de órdenes por rato para no gastar de más y, ante cualquier
  falla, la frase guardada.

Lo que no hace: no recuerda nada entre una orden y otra, no se conecta a tu correo ni a otras
herramientas, y los agentes no ejecutan nada de verdad: responden y esperan tu decisión.

## Personaliza tus agentes

Los nombres, los roles, las tareas y el estado de cada agente están en `src/app/roster.ts`:

- `NOMBRES_RECORRIDO`: el nombre propio de cada agente (Tomás, Bruno, Valentina, Nico, Don Ramiro, Víctor…). Es lo que ves en los rótulos, en el panel y en las tarjetas; el rol queda debajo. Aquí los cambias.
- `TAREAS_RECORRIDO`: la tarea de cada rol (el texto que ves al tocar un agente).
- `AGENTES_RECORRIDO`: departamento, rol, estado y gesto de cada agente del recorrido.
- `armarRoster`: el roster del laboratorio (`/` sin `?presentacion`), con 9, 18 o 30 agentes.

Los nombres y los colores de los seis ambientes están en `src/oficina/render/layout.ts`.

La pista del recorrido (`public/presentacion/dueto-recorrido.mp3`, con Elkis y Jules) corresponde al
guion original: si cambias nombres, roles o textos, la voz seguirá diciendo lo anterior. Su guion
está en `guion-dueto.txt` y la coreografía (qué hace la cámara en cada frase) en `src/app/presentacion/guion.ts`.

## Prompts para Claude Code

Abre la carpeta con Claude Code (`claude`) y prueba:

1. `Cambia los roles de los agentes de src/app/roster.ts por los de mi negocio (soy una tienda de ropa online) y escribe una tarea realista para cada uno.`
2. `Renombra los seis ambientes de la casa a los departamentos de mi empresa y cámbiales los colores en src/oficina/render/layout.ts.`
3. `Agrega un agente nuevo llamado "Soporte" en el ambiente de Ventas, con una tarea y el estado esperando_decision.`

Y una idea para más adelante (esta versión no la trae): `Conecta al Ejecutivo de ventas con mi Gmail para que
lea los correos nuevos y me proponga respuestas, siempre pidiendo mi aprobación antes de enviar.`
Lo mismo sirve con WhatsApp u otra herramienta que uses.

## Créditos y licencias

Hecho por @elkis.dev. Detalle de licencias en `LICENCIAS.md`.
