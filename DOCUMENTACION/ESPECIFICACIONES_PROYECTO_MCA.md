# MCA · Mercado de Capitales Argentino — Especificaciones del proyecto

Documento técnico y funcional de todo el sitio: las seis páginas HTML, el sistema de diseño compartido (con modo diurno y nocturno), los datos, los scripts y los recursos.

> Estado documentado: 24 de noviembre de 2026 (incluye Cálculos, aviso legal en todas las páginas, modo diurno/nocturno y el banco de 560 preguntas; ver `../README.md` y `CAMBIOS.md`). El sitio es estático (HTML + CSS + JavaScript sin servidor ni base de datos) y funciona abriendo los archivos o sirviéndolos desde cualquier hosting estático.

---

## 1. Resumen

**MCA** es una plataforma educativa interactiva sobre el mercado de capitales argentino. Reúne:

- un **mapa interactivo** de los participantes del mercado (con voz, glosario y mini desafíos),
- las **Normas CNV (Texto Ordenado)** completas, con buscador y lectura artículo por artículo,
- la **guía de idoneidad de la CNV** (6 módulos, temarios y bibliografía),
- **recursos extra** (podcasts, presentaciones y un video) y enlaces institucionales,
- una sección de **Cálculos** con 33 calculadoras de matemática financiera (tasas, bonos, acciones, derivados, cartera y análisis de balances),
- un **simulador de examen de idoneidad** con 560 preguntas (61 de ellas de cálculo), con progreso guardado y repaso de errores,
- un selector de **modo diurno / nocturno** y un **aviso legal** accesibles desde todas las páginas.

Es contenido con fines educativos e informativos; no reemplaza los textos oficiales ni constituye asesoramiento profesional.

| Página | Archivo | Rol |
|---|---|---|
| Inicio | `MCA.HTML` | Portada, accesos, mapa interactivo, simulador de operación, marco legal |
| Normas CNV T.O. | `NORMAS CNV T.O..HTML` | Texto Ordenado completo con buscador |
| Normativa | `NORMATIVA.HTML` | Los 6 módulos de la guía de idoneidad |
| Extras | `EXTRAS.HTML` | Biblioteca de podcasts, presentaciones y video |
| Cálculos | `CALCULOS.HTML` | 33 calculadoras de matemática financiera con su fórmula |
| Quiz | `QUIZ.HTML` | Simulador de examen de idoneidad |

---

## 2. Estructura de carpetas

La carpeta `MCA/` separa el **sitio publicable** (`PÁGINA/`) de las fuentes, herramientas, documentación y archivo histórico. Solo `PÁGINA/` se publica en el hosting.

```
MCA/
├── README.md                      Punto de entrada: qué es el proyecto y cómo usarlo
├── PÁGINA/                        SITIO PUBLICABLE (no contiene nada que no se use)
│   ├── MCA.HTML                   Inicio
│   ├── NORMAS CNV T.O..HTML       Normas CNV (Texto Ordenado)
│   ├── NORMATIVA.HTML             Guía de idoneidad (6 módulos)
│   ├── EXTRAS.HTML                Recursos extra
│   ├── CALCULOS.HTML              Calculadoras de matemática financiera
│   ├── QUIZ.HTML                  Simulador de examen (banco de 560 preguntas)
│   ├── vercel.json                Cabeceras de seguridad para Vercel (hosting elegido)
│   ├── _headers                   Las mismas cabeceras para Netlify / Cloudflare Pages
│   ├── css/
│   │   ├── mca.css                Sistema de diseño compartido (todas las páginas) y variables del modo claro
│   │   ├── fonts.css              Tipografía Inter alojada localmente
│   │   └── tailwind-mca.css       Utilidades Tailwind usadas por MCA.HTML (generado una vez)
│   ├── js/
│   │   ├── normativa-view.js      Árbol y buscador de las Normas CNV
│   │   ├── tema.js                Modo diurno / nocturno (botón sol-luna y recuerdo de la elección)
│   │   ├── ui.js                  Saltar al contenido, volver arriba, atajo «/»
│   │   ├── config.js, nube.js     Conexión con Supabase (vacía = solo modo local; ver SUPABASE.md)
│   │   └── login.js               Botón «Ingresar» (solo se carga en MCA.HTML)
│   ├── data/normativa.js          Texto Ordenado completo (~3 MB)
│   ├── fonts/                     Inter (latin y latin-ext, .woff2)
│   ├── vendor/fontawesome/        FontAwesome 6.4.0 (css + webfonts)
│   ├── vendor/supabase/           supabase-js 2.45.4 (copia local)
│   └── img/logo-mca.png           Logo transparente para marquesina, pie y portada
├── FUENTES/                       Material de origen (no se publica)
│   ├── normativa/                 Leyes, decreto, Texto Ordenado y guía de estudio (PDF, .md y .docx)
│   ├── resoluciones-cnv/          Texto de las resoluciones generales (RGCRGN…-26.md)
│   └── correcciones/              Correcciones documentadas del 23-10-26
├── RECURSOS/                      Material que no se publica
│   ├── LOGO/                      Logos originales y versiones editadas
│   └── EXTRAS/                    Originales de audios, presentaciones (.pptx, ya sin uso) y video (~494 MB); se publican desde Cloudinary
├── HERRAMIENTAS/                  Scripts y accesos directos (ver HERRAMIENTAS/README.md)
├── DOCUMENTACION/                 Este documento, el resto de la documentación (.md) y MODIFICACIONES.docx (lista de pendientes)
└── ARCHIVO/                       Histórico: no forma parte del sitio ni se usa
    ├── copias-html/               Copias de las páginas de antes del rediseño, del banco de 221 preguntas y de antes del modo nocturno (24-11-2026)
    ├── respaldos-normativa/       Versiones históricas de normativa.js
    ├── herramientas-reemplazadas/ parse_toc.py y validar.py (reemplazados; NO USAR)
    └── documentos-antiguos/       Documentación anterior de MCA.html
```

**Convenciones**
- Los enlaces son **relativos**: el sitio debe conservar la carpeta `PÁGINA` completa (con `css`, `fonts`, `vendor`, `img`, `js` y `data` dentro). Ninguna página enlaza a archivos fuera de `PÁGINA/`.
- Los nombres de los `.HTML` van en mayúsculas (incluido `EXTRAS.HTML`, que antes estaba como `EXTRAS.html` y se corrigió el 24-11-2026) y el de Normas CNV tiene espacios y doble punto; en los enlaces se escribe `NORMAS%20CNV%20T.O..HTML`. En hosting con distinción de mayúsculas hay que respetar exactamente estos nombres.
- En `PÁGINA/` no debe quedar nada que no sea parte del sitio (documentos de trabajo, listas de pendientes, copias): todo lo que está ahí se publica.
- El logo se referencia como `img/logo-mca.png?v=2` (el `?v=2` evita que el navegador use una versión anterior guardada).

---

## 3. Sistema de diseño compartido (`css/mca.css`)

### 3.1 Identidad
Tema **oscuro con verde esmeralda** por defecto y **modo claro** opcional (ver 3.6). Tipografía **Inter** (300–800), cifras en tipografía monoespaciada del sistema.

### 3.2 Variables (tokens)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#060A12` | Fondo de página |
| `--surface` / `--surface-2` / `--surface-3` | `#0C1322` / `#101A2D` / `#15213A` | Superficies |
| `--line` / `--line-2` | gris azulado al 14 % / 26 % | Bordes |
| `--ink` / `--ink-2` / `--muted` / `--faint` | `#F1F5F9` / `#CBD5E1` / `#94A3B8` / `#64748B` | Texto |
| `--acc` / `--acc-2` / `--acc-3` | `#10B981` / `#34D399` / `#2DD4BF` | Acento |
| `--grad` | `linear-gradient(135deg, #10B981, #2DD4BF)` | Botones, títulos destacados |
| `--r-sm … --r-xl` | 10 / 14 / 20 / 28 px | Radios |
| `--nav-h` | 68 px | Altura del menú |
| `--ink-strong` | `#FFFFFF` (claro: `#0B1220`) | Títulos y texto destacado |
| `--nav-bg`, `--card-a`, `--card-b`, `--input-bg`, `--footer-bg`, `--kpi-bg`, `--block-bg` | fondos oscuros translúcidos | Menú, tarjetas, campos, pie, indicadores y bloques; cambian en modo claro |
| `--ok-text`, `--bad-text`, `--bad-text-2` | menta / rosa claro | Texto de acierto y de error del quiz (oscurecidos en modo claro) |

### 3.3 Componentes

| Clase | Descripción |
|---|---|
| `.m-nav`, `.m-brand`, `.m-links`, `.m-cta` | Menú superior fijo, con logo, enlaces y botón «Quiz» |
| `.m-container`, `.m-main`, `.m-section`, `.m-section-head`, `.m-kicker` | Estructura y encabezados de sección |
| `.m-hero`, `.m-eyebrow`, `.m-hero-actions` | Portada de cada página (etiqueta, título con degradé, bajada, botones) |
| `.m-card`, `.m-icon-tile`, `.m-chip` | Tarjetas, íconos en recuadro y etiquetas |
| `.m-kpis`, `.m-kpi` | Indicadores numéricos |
| `.m-grid`, `.m-grid--cards`, `.m-grid--4` | Grillas responsivas |
| `.m-btn`, `.m-btn--primary`, `.m-btn--ghost` | Botones |
| `.m-input` | Campos de texto y selects |
| `.m-footer` | Pie común: logo, secciones, referencias oficiales y nota legal |
| `.m-reveal` | Animación de entrada escalonada (`--i`) |

### 3.4 Fondo y comportamiento
- Resplandores verdes y **cuadrícula tenue** fija detrás del contenido.
- Menú con efecto vidrio (`backdrop-filter`) y línea de brillo inferior.
- **Accesibilidad:** foco visible con teclado y animaciones desactivadas si el sistema indica «reducir movimiento».
- **Responsive:** en pantallas de hasta 860 px el menú pasa a una fila deslizable bajo el logo y se oculta el texto de marca.

### 3.5 Menú y pie comunes
Todas las páginas incluyen el mismo menú: **Inicio · Normas CNV T.O. · Normativa · Extras · Cálculos · Quiz** (la página actual lleva `aria-current="page"`), seguido del **botón sol/luna** del modo diurno/nocturno. Los enlaces navegan en la misma pestaña, salvo **Quiz**: desde cualquier página que no sea el propio Quiz se abre en una **pestaña nueva** (`target="_blank"`); dentro de `QUIZ.HTML` abre en la misma. El botón **Ingresar** aparece solo en `MCA.HTML` (se quitó de `QUIZ.HTML`). El pie repite el logo, el botón **AVISO LEGAL**, los enlaces a las seis secciones y las referencias oficiales (CNV, UIF, BYMA, BCRA) y agrega la nota legal propia de cada página.

### 3.6 Modo diurno / nocturno
- **Botón sol/luna** al final del menú, creado por `js/tema.js` (se carga en el `<head>` de las seis páginas, sin `defer`, para aplicar el tema antes de pintar y evitar el destello).
- Parte del modo del sistema del lector (`prefers-color-scheme`); al elegir uno, queda guardado en `localStorage` con la clave `mca-tema` (`light` o `dark`) y se aplica en todas las páginas. Si el navegador bloquea el almacenamiento, funciona igual sin recordar.
- El modo claro se activa con `<html data-theme="light">`. `css/mca.css` define las variables del modo claro en `:root[data-theme="light"]`; las páginas usan esas variables en lugar de colores fijos. El logo se oscurece con un filtro en modo claro.
- `MCA.HTML` usa utilidades Tailwind pensadas para fondo oscuro: su `<style>` incluye un bloque de reglas `:root[data-theme="light"] main …` que las adapta.
- **Quedan oscuros a propósito en ambos modos:** los nodos del mapa interactivo. (El aviso legal sí cambia: en modo diurno es blanco con texto negro; ver 3.7.)
- Para sumar el selector a una página nueva: cargar `js/tema.js` en el `<head>`, usar las variables de `mca.css` (`--ink-strong`, `--card-a`, `--card-b`, `--block-bg`…) en vez de colores fijos y tener un `.m-links` en el menú.

### 3.7 Aviso legal
Botón **AVISO LEGAL** en el pie (columna del logo) de las seis páginas. Abre un modal con cuatro bloques: carácter exclusivamente educativo; origen y fuentes públicas de la normativa; ausencia de opinión profesional y juicios de valor; vigencia normativa y responsabilidad del usuario. Se cierra solo con el botón «Entendido». **En modo diurno** el modal cambia a fondo blanco con **todo el texto en negro** (reglas `:root[data-theme="light"] #legal-modal …` al final de `css/mca.css`, comunes a las seis páginas); en modo nocturno sigue oscuro. El texto, el botón y las funciones `openLegalModal()` / `closeLegalModal(true)` son iguales en todas las páginas y se tomaron de `MCA.HTML` (referencia). Todas las páginas llevan el bloque de estilos `#legal-modal` en su `<style>` (desde el 24-11-2026 también `MCA.HTML`, cuyo modal usaba clases de Tailwind que nunca se generaron: no tenía espaciado y la tarjeta quedaba transparente).

---

## 4. Páginas

### 4.1 Inicio — `MCA.HTML`
**Propósito:** puerta de entrada y mapa interactivo del mercado.

**Secciones (en este orden)**
1. **Portada:** logo grande, etiqueta «República Argentina • CNV», título «Ecosistema del Mercado de Capitales» y bajada «Descubrí cómo se conectan…» (sin botones).
2. **Mapa interactivo («Red Interconectada de Participantes»):** `canvas#networkCanvas` con seis nodos y partículas que representan flujos.
3. **Simulador de operación en vivo:** cinco pasos animados y narrados.
4. **Accesos («Explorá · Todo el material, en un solo lugar»):** cuatro tarjetas (Normas CNV T.O., Normativa, Extras, Simulador de examen).
5. **Marco legal y respaldo institucional:** Ley 26.831, transparencia y control, protección del inversor.
6. **Indicadores (al final):** 6 módulos de idoneidad · 22 títulos de las Normas CNV · más de 2.200 artículos · 560 preguntas de práctica (cifras escritas a mano en el HTML).

**Actores del mapa** (datos en el script `actorsData`)

| Id | Actor | Color del nodo | Categoría |
|---|---|---|---|
| `emisoras` | Emisoras | `#00F0FF` | Buscadores de capital |
| `inversores` | Inversores | `#10B981` | Proveedores de fondos |
| `agentes` | Agentes (ALyC) | `#818CF8` | Intermediarios registrados |
| `mercados` | Mercados | `#F59E0B` | Plataformas de negociación |
| `camaras` | Cámaras Compensadoras | `#EC4899` | Liquidación y garantía |
| `cnv` | Regulador (CNV) | `#38BDF8` | Autoridad nacional |

Las partículas: cian = **flujo de fondos**, ámbar = **flujo de valores** (la leyenda de la sección usa los mismos colores).

**Modal de actor** (`#actorModal`): categoría, definición con términos de glosario (tooltip), función clave, ejemplos y tipos, y un **desafío flash** de 2 opciones con explicación. Incluye lectura en voz alta con la **Web Speech API**: al abrir un actor se leen, en orden, la **Definición CNV**, la **Función clave** y los **Ejemplos y tipos**; hay botones de pausa/reanudar y detener. La voz es **femenina con acento argentino**: se elige entre las voces en español instaladas (prioriza es-AR, luego variantes rioplatenses y latinoamericanas, deja es-ES al final; descarta nombres masculinos como Tomás o Diego).

**Simulación (5 pasos):** orden del inversor → oferta en mercado → calce con emisora → compensación → custodia y supervisión (Caja de Valores bajo control de la CNV). Cada paso se resalta y se narra durante 4,5 s con la misma voz femenina del mapa. `speakText(texto, 'male')` permite una voz masculina (busca Tomás/Diego…; si no existe, baja el tono de la voz base), pero hoy ningún componente la usa.

**Funciones del script:** `openActorModal`, `closeModal`, `buildActorSpeech`, `loadVoices`, `speakText`, `toggleModalSpeech`, `stopSpeech`, `startSimulation`, `initCanvas`/`animateCanvas` (animación del mapa con `requestAnimationFrame`).

**Dependencias:** `css/tailwind-mca.css` (utilidades para modal, simulador y marco legal), `css/mca.css`, `css/fonts.css`, `vendor/fontawesome`. El canvas usa la fuente «Font Awesome 6 Free» (peso 900) para dibujar los íconos de los nodos.

---

### 4.2 Normas CNV T.O. — `NORMAS CNV T.O..HTML`
**Propósito:** lectura y búsqueda del Texto Ordenado completo de las Normas CNV.

**Elementos y ids**

| Id | Función |
|---|---|
| `#norm-date`, `#norm-upd` | Fecha de vigencia y última actualización incorporada |
| `#norm-stats` | Resumen de contenido (títulos, capítulos, secciones, artículos, anexos) |
| `#norm-search` | Buscador de texto (activa desde 3 caracteres) |
| `#norm-open-chapters`, `#norm-collapse` | Abrir todos los capítulos / contraer todo |
| `#norm-results` | Lista de resultados del buscador |
| `#norm-tree` | Árbol desplegable |

**Datos actuales** (`data/normativa.js`, objeto `window.NORMATIVA_META`)
- **Texto vigente al 07-11-2026**, última actualización incorporada: **R.G. N.º 1178** (criterios de carga en `ACTUALIZACION_NORMAS.md`).
- Fuente: *Normas CNV – Texto Ordenado 2013 y modificatorias*.
- Contenido: **22 títulos · 87 capítulos · 458 secciones · 2.232 artículos · 61 anexos**.
- `NORMATIVA_META.vigencias` registra resoluciones con vigencia diferida (por ejemplo R.G. 1163/26 desde el 23-10-2026, R.G. 1158/26 desde el 10-08-2026, R.G. 1107/26, 1120/26 y 1156/26) y la fecha de vigencia de las R.G. 1174, 1175, 1177 y 1178.

**Comportamiento (`js/normativa-view.js`)**
- Árbol de **4 niveles**: Título › Capítulo › Sección › Artículo (más Anexos). Los nodos se **construyen al abrirlos** (carga diferida) para mantener la página ágil.
- Cada nivel muestra una etiqueta (TÍTULO, CAPÍTULO, SECCIÓN, ANEXO o «Art. N°»), el nombre y la cantidad de artículos.
- El buscador ignora tildes y mayúsculas, muestra el recorrido (título › capítulo › sección) y al hacer clic en un resultado **abre y resalta** el artículo.
- La barra de búsqueda queda **fija** al desplazarse.

---

### 4.3 Normativa — `NORMATIVA.HTML`
**Propósito:** guía de estudio del examen de idoneidad de la CNV, con temarios y bibliografía oficial.

**Estructura:** portada, índice de accesos (`#modulo-I … #modulo-VI`) y seis módulos desplegables (`<details>`). El índice abre el módulo al hacer clic (script de pocas líneas que escucha `hashchange`). Cada módulo tiene un **color propio**, un bloque «a) Temario del Módulo» y otro «b) Bibliografía y Fuentes Oficiales» con hipervínculos.

| Módulo | Título | Enlaces de bibliografía |
|---|---|---|
| I | Marco Normativo, Emisoras y Régimen Sancionatorio | 7 |
| II | Prevención del Lavado de Activos y Financiamiento del Terrorismo | 13 |
| III | Transparencia, Gobierno Corporativo y Atención al Inversor | 3 |
| IV | Análisis de Inversiones, Contabilidad y NIIF | 11 |
| V | Agentes, Instrumentos, Liquidación y Compensación | 7 |
| VI | Productos de Inversión Colectiva (FCI y Fideicomisos) | 5 |

---

### 4.4 Extras — `EXTRAS.HTML`
**Propósito:** material complementario. Los **audios se reproducen en la misma tarjeta** (`<audio>`) y el **video** de la Resol. 78 UIF abre en una pestaña nueva; todos se cargan desde **Cloudinary** (`https://res.cloudinary.com/bbcp8n6k/…`), no desde archivos del sitio. Son 19 podcasts y 1 video (los enlaces están en `EXTRAS.HTML`; la lista de origen está en `EXTRAS/CLOUDINARY PODCAST.docx`).

**Enlaces institucionales:** CNV, BYMA, Banco Central de la República Argentina y UIF (pestaña nueva).

> Para sumar o cambiar un recurso: subirlo a Cloudinary y poner su URL en el `src` (audio) o `href` (video) de la tarjeta. La CSP de la página y las cabeceras de `vercel.json` / `_headers` autorizan solo `https://res.cloudinary.com` para medios; otro dominio quedaría bloqueado. Las presentaciones PowerPoint ya no están enlazadas.

---

### 4.5 Cálculos — `CALCULOS.HTML`
**Propósito:** 33 calculadoras de matemática financiera con su fórmula a la vista, para practicar los cálculos del examen y de la operatoria bursátil. Las preguntas de cálculo del quiz se basan en estas fórmulas.

**Diseño (menú lateral + área de trabajo)**
- **Escritorio:** columna izquierda (`.calc-tabs-wrap`) con el filtro por categoría y las 33 calculadoras; se mantiene a la vista al desplazarse pero tiene su propio scroll, por lo que no tapa la calculadora. A la derecha (`.calc-main`) se muestra solo el panel elegido, a ancho completo.
- **Celular (≤ 900 px):** el menú se pliega en un botón «Fórmulas» que muestra la calculadora actual; al elegir una se cierra solo y la página sube al inicio del panel.
- Cada pestaña (`.calc-tab`, `data-target`) muestra su panel (`.calc-panel`); el filtro por categoría (`.calc-cat-btn`, `data-cat`) oculta las pestañas de otras categorías. Cada panel tiene entradas, resultados, el recuadro **«Fórmulas aplicadas»** y un botón para restablecer valores.

**Categorías y calculadoras**

| Categoría | Calculadoras |
|---|---|
| Tasas y FX (01–02, 05, 17, 25, 30) | Conversión de tasas · Dólar MEP/CCL · Ratio CEDEAR · Futuros de dólar · Interés simple y compuesto · Sistemas de amortización |
| Renta Fija (03–04, 06–10, 29, 31) | Paridad y bonos · Caución bursátil · Cupón cero / letras · Ajuste CER y Dollar-Linked · Duration y convexidad · Intereses corridos · Spread y riesgo país · TIR de bono con cupones · ON convertible |
| Renta Variable (11–14) | Múltiplos (PER / EV) · Dividend Yield y Payout · Gordon (DDM) y CAPM · Suscripción y split |
| Derivados y Cartera (15–20, 32–33) | Black-Scholes y Griegas · Estrategias con opciones · Sharpe, Sortino y volatilidad · VaR y máximo drawdown · PPP, caución y breakeven · Tamaño de posición · Beta de cartera y Alpha de Jensen |
| Análisis Fundamental (21–23, 26–28) | Liquidez, solvencia y endeudamiento · ROE, ROA y apalancamiento · EBITDA y márgenes · Capital de trabajo y CCC · Cobertura y deuda neta/EBITDA · WACC |
| Proyectos de Inversión (24) | VAN y TIR de proyectos |

Todo el cálculo ocurre en el navegador (sin servidor). La sección carga `js/ui.js` y `js/tema.js`; los estilos son propios (bloque `<style>`) sobre `css/mca.css`.

---

### 4.6 Quiz — `QUIZ.HTML`
**Propósito:** simulador de práctica para el examen de idoneidad de la CNV.

**Flujo:** Configuración → Examen → Resultados.

**Configuración**
- **Módulos:** seis casillas (todas marcadas por defecto, mínimo una).
- **Cantidad de preguntas:** 10 (por defecto), 20, 30, 40, 50 y 60.
- **Tiempo límite:** 10, 20, 30 (por defecto), 45 y 60 minutos (se quitaron 90 y 120).
- Botón de inicio: **«Simulador de Examen»**. El pie ya no tiene el botón «Rendir el examen de idoneidad»; queda el enlace «Examen Idoneidad» en las referencias oficiales.
- Muestra cuántas preguntas hay disponibles en los módulos elegidos.

**Reglas del examen**
- **Sin repeticiones:** cada pregunta aparece una sola vez; nunca se piden más de las disponibles.
- Se mezclan las preguntas y las opciones (Fisher-Yates) conservando la correcta.
- Al responder se bloquea la pregunta, se marca la correcta en verde y, si hubo error, la elegida en rojo; luego se habilita «Siguiente».
- **Reloj regresivo:** con el 20 % del tiempo o menos el contador se pone rojo y parpadea; al llegar a cero el examen termina y se corrige lo respondido.
- **Aprobación:** 70 % o más sobre el total de preguntas del examen; las no respondidas cuentan como no acertadas.
- **Progreso guardado** (solo en este navegador, `localStorage`): el examen en curso se guarda al responder, cada 5 s y al cerrar la pestaña; al volver aparece «Tienes un examen en curso» con *Continuar* o *Descartar*. El tiempo no corre mientras el alumno está fuera.
- **Historial** de los últimos 15 intentos (fecha, aciertos, tiempo, porcentaje) y botón **Repasar mis errores**, que arma un examen solo con las preguntas falladas (una sale de la lista cuando se acierta). Se recuerda además la última configuración (módulos, cantidad, tiempo).
- **Barra de progreso** superior y **gráfico de velas japonesas** (vela verde = respuesta correcta, roja = incorrecta; su tamaño es aleatorio y es solo una visualización).

**Resultados:** indicador circular con el porcentaje, aciertos sobre total, tiempo usado, mensaje de aprobado/no aprobado (con variante por tiempo agotado) y **revisión de cada error** con la respuesta elegida, la correcta y la **fuente o marco legal**. Botón para realizar un nuevo examen.

**Banco de preguntas: 560 preguntas únicas, 4 opciones cada una**

| Módulo | Tema | Preguntas |
|---|---|---|
| I | Marco normativo, emisoras y régimen sancionatorio | 84 |
| II | Prevención del lavado de activos y financiamiento del terrorismo | 84 |
| III | Transparencia, gobierno corporativo y atención al inversor | 83 |
| IV | Análisis de inversiones, contabilidad y NIIF | 107 |
| V | Agentes, instrumentos, liquidación y compensación | 109 |
| VI | Productos de inversión colectiva (FCI y fideicomisos) | 93 |

Las primeras 221 son el banco original. Otras 279 se agregaron el 13-11-2026 desde el material del proyecto, cada una con su cita textual verificada por programa (ver `BANCO_DE_PREGUNTAS.md`). Las **61 últimas (24-11-2026) son preguntas de cálculo** basadas en la sección Cálculos: 24 en el módulo IV, 26 en el V y 11 en el VI; cada una cita el panel y la fórmula (por ejemplo «Cálculos – Ratios de Liquidez, Solvencia y Endeudamiento (Liquidez Corriente = AC / PC)»). Sus resultados se calcularon con un programa y los distractores son errores típicos (inversión del cociente, base 360, término omitido). Cada pregunta muestra su fuente (ley y artículo, Título de las Normas CNV o «Guía de Idoneidad CNV – Módulo X»).

**Ids principales:** `#config-screen`, `#quiz-screen`, `#results-screen`, `#question-count`, `#time-limit`, `#availability-note`, `#candlestick-canvas`, `#digital-timer`, `#options-container`, `#next-btn`, `#q-progress-bar`, `#result-ring-fg`, `#incorrect-list`. **Funciones:** `startQuiz(reviewKeys?)`, `nextQuestion`, `resetQuiz`, `updateAvailability`, `saveSession`/`loadSession`/`resumeQuiz`, `recordResult`, `renderHome`. Claves de `localStorage`: `mca.quiz.session.v1`, `mca.quiz.history.v1`, `mca.quiz.wrong.v1`, `mca.quiz.config.v1`.

---

## 5. Mantenimiento

### 5.1 Agregar una pregunta al quiz
En `QUIZ.HTML`, dentro de `RAW_QUESTIONS`:

```js
q("MOD1",
  "Texto de la pregunta",
  "Opción correcta",
  ["Incorrecta 1", "Incorrecta 2", "Incorrecta 3"],
  "Normas CNV T.O. – Título X, Cap. Y, Art. Z"),
```
- Módulo de `MOD1` a `MOD6`; la correcta siempre primero (el código mezcla las opciones).
- Evitar comillas dobles dentro de los textos y mantener las opciones de largo parecido.
- Cada pregunta debe tener una fuente verificable en `FUENTES/` (las de cálculo, el panel de `CALCULOS.HTML` con su fórmula). Después de editar, ejecutar `python HERRAMIENTAS/verificar_sitio.py` (detecta repetidas, opciones repetidas y preguntas sin fuente).
- Las preguntas con texto repetido se descartan solas al cargar. El selector y el aviso de disponibilidad se actualizan automáticamente.

### 5.2 Actualizar las Normas CNV
- `data/normativa.js` se actualiza **a mano, resolución por resolución**; no se debe regenerar desde el Texto Ordenado original. El procedimiento y los criterios (fuente al pie, anexos, consultas públicas que no se incorporan) están en `ACTUALIZACION_NORMAS.md`.
- Antes de cambios grandes conviene guardar una copia en `ARCHIVO/respaldos-normativa/` (con fecha y motivo en el nombre).
- Actualizar `NORMATIVA_META` (`fecha`, `actualizacion`, `vigencias`) para que la portada muestre la fecha correcta.
- Las cifras de la portada de `MCA.HTML` (22 títulos, 2.200+ artículos, 560 preguntas; hoy son 2.232 artículos) y la bajada de las normas son texto fijo: revisarlas si cambia la estructura o el banco.
- Las resoluciones generales fuente están en `FUENTES/resoluciones-cnv/`.

### 5.3 Agregar o cambiar un recurso en Extras
Subir el archivo a Cloudinary y agregar (o editar) la tarjeta correspondiente en `EXTRAS.HTML` con la URL de Cloudinary (ver 4.4).

### 5.4 Cambiar el aspecto
Modificar los tokens o componentes en `css/mca.css`; el cambio se aplica a las seis páginas. Los colores nuevos deben definirse como variable con su valor para modo oscuro (`:root`) y para modo claro (`:root[data-theme="light"]`); ver 3.6. Las páginas tienen además un bloque `<style>` propio con estilos específicos (quiz, normas, normativa, extras, mapa).

### 5.5 Agregar o cambiar una calculadora
En `CALCULOS.HTML`: agregar el botón (`.calc-tab`, con `data-cat` y `data-target`) en el menú lateral, el `<section id="calc-…" class="calc-panel hidden">` dentro de `.calc-main` y su función de cálculo en el script; actualizar los contadores del filtro («Todas (33)» y los rangos por categoría). Si se quiere usar en el quiz, agregar la pregunta con su fuente (ver 5.1).

### 5.6 Regenerar `css/tailwind-mca.css`
Solo `MCA.HTML` usa clases de Tailwind (modal, simulador, marco legal). El archivo se generó una sola vez a partir de las clases presentes en la página. Si se agregan clases de Tailwind nuevas en `MCA.HTML` hay que regenerarlo con Tailwind CSS 3.4 (por ejemplo con su CLI, usando `MCA.HTML` como contenido).

---

## 6. Dependencias y compatibilidad

- **Recursos externos:** tipografía, íconos y estilos se cargan desde carpetas locales; el código no incluye scripts, estilos ni fuentes de internet. La **única excepción** son los audios y el video de `EXTRAS.HTML`, que se sirven desde Cloudinary (autorizado en `media-src`). Además hay enlaces a sitios oficiales: los hipervínculos a sitios oficiales (CNV, UIF, BYMA, BCRA, InfoLeg, Argentina.gob.ar).
- **Navegadores:** modernos (Chrome, Edge, Firefox, Safari). Se usan `backdrop-filter`, `color-mix()`, `:has()` y `<details>`.
- **Voz del mapa:** depende de las voces en español instaladas en el sistema (Web Speech API).
- **Rendimiento:** `data/normativa.js` pesa unos 3 MB; la página de Normas puede tardar un instante en cargar y, desde un servidor sencillo de pruebas, a veces corta la descarga: ante una página vacía, recargar.
- **Almacenamiento:** el sitio guarda en el navegador del lector (`localStorage`) el modo diurno/nocturno (`mca-tema`) y, en el quiz, el examen en curso, el historial y los errores; no se envía nada a ningún servidor. Si el navegador bloquea el almacenamiento, el sitio funciona igual sin esas funciones.
- **Seguridad:** cada página declara una política CSP y de referrer por `<meta>`, y fuerza HTTPS fuera de localhost. Las cabeceras de servidor están en `PÁGINA/vercel.json` (Vercel) y `PÁGINA/_headers` (Netlify / Cloudflare); ver `SEGURIDAD.md`.

---

## 7. Advertencias

- El contenido normativo es informativo. Los plazos, montos y porcentajes de las Normas CNV cambian con frecuencia: contrastar siempre con el texto oficial vigente.
- Las 560 preguntas del quiz no fueron validadas por un especialista en normativa (las 61 de cálculo se verificaron contra las fórmulas de la sección Cálculos, no contra un docente); se recomienda una revisión antes de usarlas como material de estudio definitivo.
- Las cifras de portada en `MCA.HTML` son estáticas y pueden quedar desactualizadas si el banco de preguntas o las normas crecen.
- Todo lo que está en `ARCHIVO/` es histórico y no forma parte del sitio activo.
