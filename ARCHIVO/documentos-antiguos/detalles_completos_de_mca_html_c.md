# Documentación Técnica y Detallada de `MCA.html`

## 1. Visión General del Proyecto
`MCA.html` es una aplicación web interactiva y educativa diseñada para visualizar el **Ecosistema del Mercado de Capitales Argentino (MCA)** bajo la supervisión de la **Comisión Nacional de Valores (CNV)**. La plataforma combina renderizado dinámico mediante Canvas 2.D, síntesis de voz (Web Speech API) y simulación en vivo de transacciones bursátiles.

---

## 2. Estructura Teórica y Datos del Ecosistema

El archivo contiene una estructura de datos central (`actorsData`) que define los 6 pilares regulados por la CNV:

| ID Nodo | Título | Categoría | Color | Función Principal | Ejemplos Integrados |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cnv` | Regulador (CNV) | Autoridad Nacional | `#38BDF8` | Organismo autárquico que regula, fiscaliza y supervisa la oferta pública. | CNV Argentina, Ley N° 26.831 |
| `emisoras` | Emisoras | Buscadores de Capital | `#00F0FF` | Emiten valores negociables para captar recursos de inversión productiva. | YPF S.A., YPF Luz, Pymes, Estado Nacional |
| `inversores` | Inversores | Proveedores de Fondos | `#10B981` | Ahorristas que colocan capital para obtener rendimiento asumiendo riesgos. | Minoristas, FCI, Aseguradoras, Bancos |
| `agentes` | Agentes (ALyC) | Intermediarios Registrados | `#818CF8` | Registrados ante CNV para ejecutar órdenes de compra/venta de clientes. | ALyCs Integrales/Propias, Agentes de Negociación |
| `mercados` | Mercados | Plataformas de Negociación | `#F59E0B` | Sistemas informáticos donde se cruzan ofertas en tiempo real de forma transparente. | BYMA, Matba Rofex, MAE |
| `camaras` | Cámaras Compensadoras | Liquidación y Garantía | `#EC4899` | Registran, compensan y custodian los activos asegurando la liquidación. | Caja de Valores S.A., Cámaras BYMA/Rofex |

---

## 3. Arquitectura del Código HTML / CSS / JS

### 3.1. Stack Tecnológico e Integraciones Externas
* **Tailwind CSS (`v3.x` via CDN):** Estilizado responsivo con paleta personalizada (`cnv-cyan`, `cnv-blue`, etc.).
* **Google Fonts (`Inter`):** Tipografía principal para legibilidad.
* **FontAwesome (`v6.4.0`):** Iconografía vectorial utilizada en botones, modales y nodos del canvas (usando `Font Awesome 6 Free` unicode).
* **HTML5 Canvas:** Motor 2D dinámico para el mapa de red interconectada.
* **Web Speech API:** Motor nativo del navegador para narración en español latinoamericano (`es-AR`, `es-MX`, `es-CO`).

### 3.2. Secciones Principales de la interfaz

1. **Header / Navbar:**
   * Logo vectorial (SVG) estilizado en tonos esmeralda/cian con gráfica de gráfico bursátil y nodos.
   * Título principal e indicador de estado en vivo (CNV Argentina con animación pulse).
   * Marquesina superior derecha con botones de navegación/acción (`Ley de Mercado de Capitales`, `Normativa`, `Quiz`).

2. **Mapa de Flujo e Interacciones (Canvas Interactivo):**
   * Red de 6 nodos distribuidos estratégicamente.
   * Conexiones animadas con flujo de partículas (cian para *Fondos*, ámbar para *Valores*).
   * Interacción Hover/Click con detección de colisión circular (`Math.hypot`).

3. **Simulador de Operación en Vivo:**
   * Ejecución secuencial en 5 pasos que ilumina cada etapa del proceso de compraventa con soporte de audio.

4. **Modal Informativo de Actores:**
   * Ventana emergente con definición CNV, roles clave, ejemplos y controles de lectura por voz sintetizada (`Play`, `Pause`, `Stop`).

---

## 4. Lógica de Funcionalidades Clave en JavaScript

### 4.1. Animación y Renderizado del Canvas (`networkCanvas`)
* **Posicionamiento Relativo:** Coordenadas en porcentajes para adaptabilidad móvil y de escritorio (`nodePositions`).
* **Partículas en movimiento:** Generación aleatoria de 35 partículas que viajan continuamente entre nodos representando el flujo continuo de mercado.
* **Iconos Unicode:** Renderizado directo de glifos FontAwesome dentro del Canvas utilizando `ctx.fillText(node.unicodeIcon, x, y)`.

### 4.2. Secuencia del Simulador de Compra (`startSimulation()`)
La simulación recorre 5 fases con un tiempo de espera de 4.5 segundos por paso, activando la narración por voz de cada hito:
1. **Orden de Inversor:** Envío de orden al Agente (ALyC).
2. **Oferta en Mercado:** Carga de la oferta en BYMA/ROFEX.
3. **Calce con Emisora:** Match de oferta/demanda.
4. **Compensación:** Aprobación en Cámara Compensadora.
5. **Custodia y Supervisión:** Acreditación en Caja de Valores bajo control CNV.

### 4.3. Motor de Voz (Web Speech API)
* Filtrado prioritario de voces en español latinoamericano (`es-AR` como preferencia primaria).
* Métodos implementados: `speakText()`, `toggleModalSpeech()`, `stopSpeech()`.

---

## 5. Código Fuente Completo de `MCA.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ecosistema Interactivo del Mercado de Capitales Argentino</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        cnv: {
                            cyan: '#00F0FF',
                            blue: '#0A84FF',
                            purple: '#7D5230',
                            dark: '#0B1120',
                            card: '#161F33'
                        }
                    }
                }
            }
        }
    </script>

    <style>
        body {
            background-color: #070B14;
            color: #F1F5F9;
        }
        .glow-cyan {
            box-shadow: 0 0 25px rgba(0, 240, 255, 0.25);
        }
        .pulse-border {
            animation: borderPulse 2s infinite;
        }
        @keyframes borderPulse {
            0%, 100% { border-color: rgba(0, 240, 255, 0.3); }
            50% { border-color: rgba(0, 240, 255, 0.9); }
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0B1120;
        }
        ::-webkit-scrollbar-thumb {
            background: #1E293B;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #0A84FF;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">

    <!-- Header / Navbar -->
    <header class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-3.5">
                <!-- Logo MCA Integrado Fiel al Original -->
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10 flex-shrink-0 relative overflow-hidden p-1">
                    <svg viewBox="0 0 100 100" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 75 L28 40 L45 60 L72 25 L88 55" stroke="#10B981" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M72 25 L88 28 M88 25 L88 41" stroke="#10B981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="28" cy="40" r="4" fill="#00F0FF" />
                        <circle cx="56" cy="18" r="4" fill="#00F0FF" />
                        <circle cx="72" cy="25" r="4" fill="#10B981" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-white tracking-wide leading-tight">Ecosistema del Mercado de Capitales</h1>
                    <p class="text-xs text-cyan-400 font-medium flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        República Argentina • CNV
                    </p>
                </div>
            </div>

            <!-- Botones Superiores Derecha -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <button onclick="alert('Próximamente: Ley de Mercado de Capitales')" class="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/50 px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-sm">
                    <i class="fa-solid fa-scale-balanced text-cyan-400"></i>
                    <span>Ley de Mercado de Capitales</span>
                </button>
                <button onclick="alert('Próximamente: Normativa')" class="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/50 px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-sm">
                    <i class="fa-solid fa-file-lines text-cyan-400"></i>
                    <span>Normativa</span>
                </button>
                <button onclick="alert('Próximamente: Quiz')" class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-cyan-500/20">
                    <i class="fa-solid fa-circle-question"></i>
                    <span>Quiz</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-grow w-full space-y-10">

        <!-- Banner Explicativo -->
        <div class="text-center max-w-3xl mx-auto space-y-3">
            <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Red Interconectada de Participantes
            </h2>
        </div>

        <!-- Canvas Red Interactiva de Nodos -->
        <section class="relative bg-slate-950/90 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-2xl pulse-border">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4 z-10 relative">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-circle-nodes text-cyan-400"></i>
                    <h3 class="text-base font-bold text-white">Mapa de Flujo e Interacciones</h3>
                </div>
                <div class="flex items-center gap-4 text-xs text-slate-400">
                    <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Flujo de Fondos</span>
                    <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Flujo de Valores</span>
                </div>
            </div>

            <!-- Canvas Container -->
            <div class="relative w-full h-[420px] sm:h-[500px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-900">
                <canvas id="networkCanvas" class="w-full h-full cursor-pointer block"></canvas>
                
                <!-- Overlay de Instrucción en Pantalla -->
                <div class="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl text-xs text-slate-400 pointer-events-none flex items-center gap-2">
                    <i class="fa-solid fa-hand-pointer text-cyan-400 animate-bounce"></i>
                    <span>Haz clic en un nodo para escucharlo y ver su rol detallado.</span>
                </div>
            </div>
        </section>

        <!-- Simulación Paso a Paso -->
        <section class="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-play text-cyan-400"></i>
                        Simulador de Operación en Vivo
                    </h3>
                    <p class="text-slate-400 text-xs sm:text-sm mt-1">
                        Experimenta el recorrido completo de una orden desde el inversor hasta la liquidación en la Cámara Compensadora.
                    </p>
                </div>
                <button id="start-sim-btn" onclick="startSimulation()" class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 font-bold px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 text-sm">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Iniciar Simulación de Compra</span>
                </button>
            </div>

            <!-- Progreso de Pasos de la Simulación -->
            <div id="sim-steps-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div id="sim-step-1" class="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl transition-all opacity-50">
                    <div class="text-cyan-400 font-bold text-xs uppercase mb-1">Paso 1</div>
                    <div class="font-bold text-white text-sm">1. Orden de Inversor</div>
                    <p class="text-xs text-slate-400 mt-1">El Inversor envía orden de compra al Agente (ALYC).</p>
                </div>
                <div id="sim-step-2" class="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl transition-all opacity-50">
                    <div class="text-cyan-400 font-bold text-xs uppercase mb-1">Paso 2</div>
                    <div class="font-bold text-white text-sm">2. Oferta en Mercado</div>
                    <p class="text-xs text-slate-400 mt-1">El Agente ingresa la oferta al Mercado (BYMA/ROFEX).</p>
                </div>
                <div id="sim-step-3" class="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl transition-all opacity-50">
                    <div class="text-cyan-400 font-bold text-xs uppercase mb-1">Paso 3</div>
                    <div class="font-bold text-white text-sm">3. Calce con Emisora</div>
                    <p class="text-xs text-slate-400 mt-1">Se hace match con la oferta de la Emisora o vendedor.</p>
                </div>
                <div id="sim-step-4" class="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl transition-all opacity-50">
                    <div class="text-cyan-400 font-bold text-xs uppercase mb-1">Paso 4</div>
                    <div class="font-bold text-white text-sm">4. Compensación</div>
                    <p class="text-xs text-slate-400 mt-1">La Cámara Compensadora aprueba la transacción.</p>
                </div>
                <div id="sim-step-5" class="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl transition-all opacity-50">
                    <div class="text-cyan-400 font-bold text-xs uppercase mb-1">Paso 5</div>
                    <div class="font-bold text-white text-sm">5. Custodia y Supervisión</div>
                    <p class="text-xs text-slate-400 mt-1">Títulos acreditados en Caja de Valores bajo control de la CNV.</p>
                </div>
            </div>
        </section>

    </main>

    <!-- Modal Explicativo -->
    <div id="actorModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md hidden transition-opacity duration-300 opacity-0" aria-modal="true" role="dialog">
        <div id="modalContainer" class="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl transform scale-95 transition-all duration-300">
            <button onclick="closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-2.5 rounded-full transition">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>
            <div class="flex items-center space-x-4 mb-6">
                <div id="modal-icon-bg" class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-slate-900 font-bold shadow-lg">
                    <i id="modal-icon" class="fa-solid fa-building"></i>
                </div>
                <div>
                    <span id="modal-category" class="text-xs font-bold uppercase tracking-wider text-cyan-400">Categoría</span>
                    <h3 id="modal-title" class="text-2xl font-extrabold text-white mt-0.5">Nombre del Actor</h3>
                </div>
            </div>
            <div class="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Definición CNV</h4>
                    <p id="modal-description" class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-slate-200">
                        Explicación detallada...
                    </p>
                </div>
                <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Función Clave</h4>
                    <p id="modal-function" class="text-slate-300">
                        Función dentro de la red...
                    </p>
                </div>
                <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ejemplos y Tipos</h4>
                    <ul id="modal-examples" class="list-disc list-inside text-slate-400 space-y-1 text-xs sm:text-sm"></ul>
                </div>
            </div>
            <div class="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center space-x-3">
                    <button id="modal-speech-btn" onclick="toggleModalSpeech()" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-xs">
                        <i id="modal-speech-icon" class="fa-solid fa-volume-high"></i>
                        <span id="modal-speech-text">Escuchar Explicación</span>
                    </button>
                    <button onclick="stopSpeech()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition" title="Detener Audio">
                        <i class="fa-solid fa-stop"></i>
                    </button>
                </div>
                <div class="text-xs text-slate-500 italic flex items-center gap-1">
                    <i class="fa-solid fa-microchip"></i>
                    Voz Generada por Web Speech API (Latinoamericana)
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4">
            <p>© Mercado de Capitales Argentino — Plataforma Educativa Interactiva</p>
            <p class="mt-1 text-slate-600">Supervisado bajo normativa de la Comisión Nacional de Valores (CNV)</p>
        </div>
    </footer>

    <!-- Lógica JavaScript Principal -->
    <script>
        const actorsData = [
            {
                id: "emisoras",
                title: "Emisoras",
                category: "Buscadores de Capital",
                icon: "fa-building",
                unicodeIcon: "\uf1ad",
                color: "#00F0FF",
                shortDesc: "Empresas privadas y organismos públicos que emiten valores para financiar proyectos.",
                fullDesc: "Las Emisoras son las sociedades anónimas, Pymes o entidades estatales que emiten valores negociables (como acciones, obligaciones negociables o bonos) en el mercado de capitales para captar recursos financieros destinados a inversión productiva o refinanciación.",
                marketRole: "Canalizan sus necesidades de financiamiento mediante la oferta pública autorizada por la CNV, otorgando títulos a los inversores.",
                examples: ["YPF S.A., YPF Luz, Pymes industriales", "Estado Nacional (Bonos Soberanos)", "Provincias y Municipios"],
                speechText: "Las Emisoras son empresas y organismos públicos que acuden al mercado de capitales para obtener financiamiento mediante la emisión de bonos o acciones. Su objetivo es financiar proyectos de inversión y desarrollo."
            },
            {
                id: "inversores",
                title: "Inversores",
                category: "Proveedores de Fondos",
                icon: "fa-users",
                unicodeIcon: "\uf0c0",
                color: "#10B981",
                shortDesc: "Personas físicas y jurídicas que destinan sus ahorros para obtener rentabilidad.",
                fullDesc: "Los Inversores son los ahorristas individuales o institucionales que compran valores negociables para rentabilizar sus fondos a cambio de un rendimiento, dividendos o intereses ajustados al riesgo.",
                marketRole: "Proporcionan la liquidez y el capital necesario para que la economía productiva funcione de manera sostenible.",
                examples: ["Inversores Minoristas (Ahorristas individuales)", "Fondos Comunes de Inversión (FCI)", "Compañías de Seguros y Bancos"],
                speechText: "Los Inversores son personas u organizaciones que colocan su capital sobrante en títulos valores con el propósito de obtener rendimientos financieros futuros, asumiendo riesgos calculados."
            },
            {
                id: "agentes",
                title: "Agentes (ALyC)",
                category: "Intermediarios Registrados",
                icon: "fa-handshake",
                unicodeIcon: "\uf2b5",
                color: "#818CF8",
                shortDesc: "Organizaciones autorizadas que conectan a inversores y emisoras ejecutando órdenes.",
                fullDesc: "Los Agentes de Liquidación y Compensación (ALyC) y Agentes de Negociación son personas jurídicas registradas ante la CNV que ejecutan las órdenes de compra y venta formuladas por sus clientes.",
                marketRole: "Ofrecen asesoramiento bursátil, estructuran emisiones y garantizan la intermediación transparente en los mercados autorizados.",
                examples: ["ALyCs Integrales y Propias", "Agentes de Negociación", "Agentes de Distribución de FCI"],
                speechText: "Los Agentes, ampliamente conocidos como ALyC o brokers, son los intermediarios autorizados por la CNV para cursar las órdenes de compra y venta de activos financieros de los clientes en los mercados."
            },
            {
                id: "mercados",
                title: "Mercados",
                category: "Plataformas de Negociación",
                icon: "fa-chart-line",
                unicodeIcon: "\uf201",
                color: "#F59E0B",
                shortDesc: "Ámbitos autorizados donde se negocian los activos en un marco de transparencia.",
                fullDesc: "Los Mercados son las instituciones autárquicas que ofrecen los sistemas informáticos de negociación donde se cruzan las ofertas de compra y venta en tiempo real bajo reglamentos aprobados.",
                marketRole: "Establecen reglas claras, difunden información de precios e índices bursátiles y garantizan la libre concurrencia de la oferta y demanda.",
                examples: ["BYMA (Bolsas y Mercados Argentinos)", "Matba Rofex (Futuros y Opciones)", "MAE (Mercado Abierto Electrónico)"],
                speechText: "Los Mercados son los ámbitos reglamentados y tecnológicamente equipados donde compradores y vendedores interactúan para negociar activos bajo transparencia e igualdad de condiciones."
            },
            {
                id: "camaras",
                title: "Cámaras Compensadoras",
                category: "Liquidación y Garantía",
                icon: "fa-shield-halved",
                unicodeIcon: "\uf3ed",
                color: "#EC4899",
                shortDesc: "Garantizan que el dinero y los títulos se liquiden en tiempo y forma.",
                fullDesc: "Las Cámaras Compensadoras y Custodios registran, liquidan y compensan las operaciones concertadas en los mercados, asegurando que los títulos lleguen al comprador y el dinero al vendedor.",
                marketRole: "Minimizan el riesgo de incumplimiento actuando como contraparte central y realizando la custodia de los títulos valores.",
                examples: ["Caja de Valores S.A. (Custodia Centralizada)", "Cámaras de Liquidación de BYMA y Matba Rofex"],
                speechText: "Las Cámaras Compensadoras y entidades de custodia se aseguran de que todas las operaciones acordadas se liquiden correctamente, entregando los fondos y transfiriendo la propiedad de los valores."
            },
            {
                id: "cnv",
                title: "Regulador (CNV)",
                category: "Autoridad Nacional",
                icon: "fa-scale-balanced",
                unicodeIcon: "\uf24e",
                color: "#38BDF8",
                shortDesc: "Comisión Nacional de Valores: regula, autoriza y supervisa todo el mercado.",
                fullDesc: "La Comisión Nacional de Valores (CNV) es el organismo autárquico del Estado Nacional argentino encargado de promover, regular y fiscalizar el mercado de capitales en todo el país.",
                marketRole: "Protege al público inversor, otorga licencias a todos los agentes y empresas emisoras y sanciona cualquier tipo de infracción a la transparencia.",
                examples: ["Comisión Nacional de Valores de la República Argentina", "Leyes de Mercado de Capitales N° 26.831 y reformas"],
                speechText: "La Comisión Nacional de Valores es la máxima autoridad del mercado de capitales argentino. Dicta las reglas, autoriza la oferta pública y fiscaliza a todos los participantes para velar por la transparencia."
            }
        ];

        const nodePositions = [
            { id: "cnv", x: 0.5, y: 0.15 },
            { id: "emisoras", x: 0.2, y: 0.45 },
            { id: "inversores", x: 0.8, y: 0.45 },
            { id: "agentes", x: 0.65, y: 0.72 },
            { id: "mercados", x: 0.35, y: 0.72 },
            { id: "camaras", x: 0.5, y: 0.52 }
        ];

        let canvas, ctx;
        let particles = [];
        let canvasNodes = [];
        let hoveredNode = null;
        let activeActorModal = null;

        const synth = window.speechSynthesis;
        let voices = [];
        let selectedVoice = null;

        function loadVoices() {
            voices = synth.getVoices().filter(v => v.lang.startsWith('es'));
            if (voices.length > 0) {
                selectedVoice = voices.find(v => v.lang === 'es-AR' || v.lang.includes('AR')) ||
                                voices.find(v => v.lang === 'es-MX' || v.lang.includes('MX')) ||
                                voices.find(v => v.lang === 'es-CO' || v.lang.includes('CO')) ||
                                voices.find(v => v.lang === 'es-US' || v.lang.includes('US')) ||
                                voices.find(v => !v.lang.includes('ES') && v.lang.startsWith('es')) ||
                                voices[0];
            }
        }

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        function initCanvas() {
            canvas = document.getElementById('networkCanvas');
            ctx = canvas.getContext('2d');
            resizeCanvas();

            window.addEventListener('resize', resizeCanvas);
            canvas.addEventListener('mousemove', handleCanvasMouseMove);
            canvas.addEventListener('click', handleCanvasClick);

            createParticles();
            requestAnimationFrame(animateCanvas);
        }

        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            updateNodePositions();
        }

        function updateNodePositions() {
            const w = canvas.width;
            const h = canvas.height;

            canvasNodes = nodePositions.map(pos => {
                const data = actorsData.find(a => a.id === pos.id);
                return {
                    ...data,
                    x: pos.x * w,
                    y: pos.y * h,
                    radius: Math.min(w, h) < 500 ? 28 : 36
                };
            });
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < 35; i++) {
                const source = nodePositions[Math.floor(Math.random() * nodePositions.length)];
                let target = nodePositions[Math.floor(Math.random() * nodePositions.length)];
                while (target === source) {
                    target = nodePositions[Math.floor(Math.random() * nodePositions.length)];
                }

                particles.push({
                    sourceId: source.id,
                    targetId: target.id,
                    progress: Math.random(),
                    speed: 0.003 + Math.random() * 0.004,
                    type: Math.random() > 0.5 ? 'money' : 'titles'
                });
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 1.5;
            canvasNodes.forEach(nodeA => {
                canvasNodes.forEach(nodeB => {
                    if (nodeA.id !== nodeB.id) {
                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
                        ctx.stroke();
                    }
                });
            });

            particles.forEach(p => {
                p.progress += p.speed;
                if (p.progress >= 1) p.progress = 0;

                const nodeA = canvasNodes.find(n => n.id === p.sourceId);
                const nodeB = canvasNodes.find(n => n.id === p.targetId);

                if (nodeA && nodeB) {
                    const currentX = nodeA.x + (nodeB.x - nodeA.x) * p.progress;
                    const currentY = nodeA.y + (nodeB.y - nodeA.y) * p.progress;

                    ctx.beginPath();
                    ctx.arc(currentX, currentY, p.type === 'money' ? 3 : 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = p.type === 'money' ? '#00F0FF' : '#F59E0B';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            canvasNodes.forEach(node => {
                const isHovered = hoveredNode && hoveredNode.id === node.id;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + (isHovered ? 12 : 6), 0, Math.PI * 2);
                ctx.fillStyle = isHovered ? `${node.color}33` : 'rgba(15, 23, 42, 0.8)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#0B1120';
                ctx.strokeStyle = node.color;
                ctx.lineWidth = isHovered ? 3 : 2;
                ctx.shadowBlur = isHovered ? 22 : 12;
                ctx.shadowColor = node.color;
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.fillStyle = node.color;
                ctx.font = `900 ${node.radius * 0.9}px "Font Awesome 6 Free"`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.unicodeIcon, node.x, node.y);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = `${isHovered ? 'bold 13px' : '12px'} Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'alphabetic';
                ctx.fillText(node.title, node.x, node.y + node.radius + 18);
            });

            requestAnimationFrame(animateCanvas);
        }

        function handleCanvasMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            hoveredNode = canvasNodes.find(node => {
                const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
                return dist <= node.radius;
            });

            canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
        }

        function handleCanvasClick(e) {
            if (hoveredNode) {
                openActorModal(hoveredNode.id);
            }
        }

        function openActorModal(actorId) {
            const actor = actorsData.find(a => a.id === actorId);
            if (!actor) return;

            activeActorModal = actor;

            document.getElementById('modal-icon-bg').style.backgroundColor = actor.color;
            document.getElementById('modal-icon').className = `fa-solid ${actor.icon}`;
            document.getElementById('modal-category').textContent = actor.category;
            document.getElementById('modal-title').textContent = actor.title;
            document.getElementById('modal-description').textContent = actor.fullDesc;
            document.getElementById('modal-function').textContent = actor.marketRole;

            const examplesList = document.getElementById('modal-examples');
            examplesList.innerHTML = '';
            actor.examples.forEach(ex => {
                const li = document.createElement('li');
                li.textContent = ex;
                examplesList.appendChild(li);
            });

            const modal = document.getElementById('actorModal');
            const container = document.getElementById('modalContainer');

            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                container.classList.remove('scale-95');
                container.classList.add('scale-100');
            }, 10);

            speakText(actor.speechText);
        }

        function closeModal() {
            const modal = document.getElementById('actorModal');
            const container = document.getElementById('modalContainer');

            modal.classList.add('opacity-0');
            container.classList.remove('scale-100');
            container.classList.add('scale-95');

            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);

            stopSpeech();
        }

        function speakText(text) {
            stopSpeech();

            if (!('speechSynthesis' in window)) return;

            if (!selectedVoice) {
                loadVoices();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            synth.speak(utterance);
        }

        function toggleModalSpeech() {
            if (synth.speaking && !synth.paused) {
                synth.pause();
            } else if (synth.paused) {
                synth.resume();
            } else if (activeActorModal) {
                speakText(activeActorModal.speechText);
            }
        }

        function stopSpeech() {
            if (synth.speaking || synth.paused) {
                synth.cancel();
            }
        }

        function startSimulation() {
            stopSpeech();

            const items = [
                { id: 1, text: "Iniciando orden: El inversor decide comprar bonos emitidos por la empresa." },
                { id: 2, text: "El Agente ALyC carga la orden en el sistema del Mercado." },
                { id: 3, text: "El Mercado hace el calce oferta-demanda con la Emisora." },
                { id: 4, text: "La Cámara Compensadora aprueba la transacción y liquida los fondos." },
                { id: 5, text: "Títulos custodiados en Caja de Valores bajo control de la CNV. ¡Operación exitosa!" }
            ];

            let currentStep = 0;

            function runStep() {
                for (let i = 1; i <= 5; i++) {
                    const el = document.getElementById(`sim-step-${i}`);
                    el.classList.add('opacity-50');
                    el.classList.remove('border-cyan-400', 'bg-slate-900', 'scale-105');
                }

                if (currentStep < items.length) {
                    const stepObj = items[currentStep];
                    const activeEl = document.getElementById(`sim-step-${stepObj.id}`);
                    activeEl.classList.remove('opacity-50');
                    activeEl.classList.add('border-cyan-400', 'bg-slate-900', 'scale-105');

                    speakText(stepObj.text);

                    currentStep++;
                    setTimeout(runStep, 4500);
                }
            }

            runStep();
        }

        window.onload = () => {
            loadVoices();
            initCanvas();
        };
    </script>
</body>
</html>
```