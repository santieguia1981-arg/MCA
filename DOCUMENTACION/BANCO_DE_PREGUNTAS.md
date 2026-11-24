# Banco de preguntas del Simulador de examen

El quiz (`PÁGINA/QUIZ.HTML`) tiene **560 preguntas** de 4 opciones (500 de contenido normativo y 61 de cálculo; ver el último apartado), repartidas en los 6 módulos de la guía de idoneidad:

| Módulo | Preguntas |
|---|---|
| I · Marco normativo, emisoras y régimen sancionatorio | 84 |
| II · Prevención del lavado de activos y FT | 84 |
| III · Transparencia, gobierno corporativo y atención al inversor | 83 |
| IV · Análisis de inversiones, contabilidad y NIIF | 83 |
| V · Agentes, instrumentos, liquidación y compensación | 83 |
| VI · Productos de inversión colectiva (FCI y fideicomisos) | 83 |

## Origen

- **Las primeras 221** son el banco original del proyecto.
- **Las otras 279** se agregaron el 13-11-2026, con la regla de **no inventar nada**: cada pregunta sale de texto del material de `FUENTES/` y tiene una cita textual de ese texto.

## Cómo se armaron las 279 nuevas

1. **Redacción por módulo.** Seis agentes (uno por módulo) redactaron 55 candidatas cada uno (330 en total) a partir de la guía de estudio y de las leyes y normas correspondientes. Cada candidata trae: pregunta, respuesta correcta, tres incorrectas, fuente mostrada, archivo fuente y **cita literal** (`HERRAMIENTAS/banco_preguntas/candidatas/MOD*.json`).
2. **Verificación automática.** Un script comprobó que cada cita existe literalmente en su archivo de `FUENTES/normativa/NORMATIVA md/`. Las que no pasaron se descartaron.
3. **Que no se repita ninguna.** Se descartaron las candidatas muy parecidas a las 221 existentes, las parecidas entre sí (comparación sin tildes ni mayúsculas, por similitud de texto) y las que usaban la misma cita. Además, el quiz sortea cada pregunta una sola vez por examen y descarta enunciados repetidos al cargar.
4. **Revisión manual de los casos dudosos.** Se revisaron 15 preguntas cuya respuesta no estaba claramente dentro de la cita. Todas se confirmaron en los textos. Se excluyeron tres: una de bibliografía sin valor para estudiar, un cálculo de caución cuyo resultado en la guía no pudo confirmarse y una sobre el plazo para reportar operaciones sospechosas, porque la guía se contradice sobre ese plazo. Una cuarta fue quitada por duplicar a otra sobre operaciones con partes relacionadas.
5. **Muestra de control.** Se revisaron 24 preguntas al azar (4 por módulo): las 24 respuestas están respaldadas por su cita. La muestra está en `muestra_revision_preguntas.md`.

## Origen de las preguntas nuevas, por fuente (aproximado)

Normas CNV (Texto Ordenado), Ley 26.831, guía de estudio, Ley 24.083, Código Civil y Comercial (fideicomiso), Ley 27.440, Ley 23.576, Ley 19.550, Ley 24.441 y Decreto 1023/2013. Cada pregunta muestra su fuente al alumno.

## Limitaciones conocidas

- **Las opciones incorrectas** las redactaron los agentes como alternativas plausibles; a veces no figuran literalmente en los textos.
- **La guía de estudio** tiene errores de extracción (palabras pegadas) y alguna respuesta dudosa o contradictoria. Se evitaron las detectadas, pero las preguntas basadas en la guía no se revisaron una por una.
- **Algunas fuentes son genéricas** («Guía de Idoneidad CNV – Módulo X») en lugar de ley y artículo.
- **Las preguntas del banco original** (las 221) no se volvieron a auditar.
- El banco **no fue validado por un especialista en normativa**: se recomienda esa revisión antes de usarlo como material de estudio definitivo.

## Cómo agregar una pregunta a mano

En `QUIZ.HTML`, dentro de `RAW_QUESTIONS`:

```js
q("MOD1",
  "Texto de la pregunta",
  "Opción correcta",
  ["Incorrecta 1", "Incorrecta 2", "Incorrecta 3"],
  "Ley 26.831, art. 2"),
```

- Módulo de `MOD1` a `MOD6`; **la correcta va primero** (el código mezcla las opciones).
- Evitar comillas dobles dentro de los textos y mantener las cuatro opciones de largo parecido.
- La fuente debe poder verificarse en `FUENTES/`.
- Después de editar: `python -X utf8 HERRAMIENTAS/verificar_sitio.py` (detecta repetidas, opciones duplicadas y preguntas sin fuente).
- Si cambia la cantidad, actualizar las cifras a mano: indicador «560» en `MCA.HTML` y las tablas de este documento y de `ESPECIFICACIONES_PROYECTO_MCA.md`.

## Cómo agregar muchas preguntas con cita verificada

1. Preparar un `MODn.json` por módulo en `HERRAMIENTAS/banco_preguntas/candidatas/` con el formato de los existentes (`module`, `question`, `correct`, `wrong` ×3, `source`, `file`, `evidence`).
2. Subir `TARGET_TOTAL` y `TARGET_BY_MOD` en `construir_banco.py`.
3. Ejecutar el script sin opciones (informe), revisar con `--audit 0.5` y, si está bien, con `--write` (hacer antes una copia de `QUIZ.HTML` en `ARCHIVO/copias-html/`).

Las 38 candidatas válidas que sobraron siguen en los `.json` y pueden reutilizarse.

## Datos que guarda el navegador del alumno

`localStorage`, solo en su equipo: examen en curso (`mca.quiz.session.v1`), últimos 15 intentos (`mca.quiz.history.v1`), errores a repasar (`mca.quiz.wrong.v1`) y última configuración (`mca.quiz.config.v1`). Las preguntas se identifican por un hash de su enunciado, así que agregar preguntas no desordena lo guardado; **cambiar el texto de una pregunta sí la desvincula** del historial de errores.

## Preguntas de cálculo (24-11-2026)

Se agregaron **61 preguntas orientadas a cálculos matemáticos**, basadas en las 33 calculadoras de `PÁGINA/CALCULOS.HTML`, con el mismo formato del resto del banco (respuesta correcta primero, tres incorrectas y fuente).

| Módulo | Preguntas | Temas |
|---|---|---|
| IV – Análisis de inversiones, contabilidad y NIIF | 24 | Liquidez, solvencia, endeudamiento, ROE, ROA, apalancamiento, EBITDA, VAN, TIR, interés simple y compuesto, ciclo de conversión, deuda neta, cobertura, WACC, PER, P/VC, EV/EBITDA, dividend yield, CAPM, Gordon |
| V – Agentes, instrumentos, liquidación y compensación | 26 | Equivalencia de tasas, MEP/CCL y canje, paridad, valor técnico y current yield, caución, CEDEAR, cupón cero, CER, intereses corridos, spread, futuros de dólar, estrategias con opciones, ON convertible, PPP, breakeven, TERP, amortización |
| VI – Productos de inversión colectiva | 11 | Sharpe, Sortino, VaR, drawdown, beta ponderada, alpha de Jensen, tamaño de posición, relación riesgo-beneficio, PPP de cuotapartes, duration/convexidad y capitalización de un FCI |

Los módulos I, II y III no recibieron preguntas de cálculo (son normativos).

**Método**
- La **fuente** de cada pregunta cita el panel de Cálculos y la fórmula (por ejemplo «Cálculos – Evaluación de Proyectos: VAN y TIR (VAN = −FF₀ + Σ FF_t / (1 + k)^t)»).
- Las respuestas correctas **se calcularon con un programa** a partir de esas fórmulas (no a mano) y los distractores son errores típicos: inversión del cociente, uso de base 360 en lugar de 365, olvido de un término, confusión entre TNA y TEA o entre interés simple y compuesto.
- Los números se escriben en formato argentino (coma decimal, punto de miles).
- El verificador del sitio (`verificar_sitio.py`) detecta enunciados repetidos y opciones repetidas o vacías; con estas preguntas dio `0 problema(s)` después de corregir tres opciones que solo diferían en el signo.
- **Pendiente de revisión:** igual que el resto, no fueron validadas por un especialista; sí se contrastaron con las fórmulas de la sección Cálculos.
