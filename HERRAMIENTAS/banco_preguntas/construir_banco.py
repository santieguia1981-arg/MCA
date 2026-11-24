"""Valida, deduplica y selecciona preguntas nuevas para el banco de QUIZ.HTML.

Lee candidatas/MOD1.json ... MOD6.json (cada pregunta trae su cita textual y el archivo fuente), comprueba que la
cita exista literalmente en FUENTES/normativa/NORMATIVA md, descarta las repetidas o muy parecidas a las ya
cargadas y arma hasta TARGET_TOTAL preguntas.

Uso (desde la carpeta MCA):
  python -X utf8 HERRAMIENTAS/banco_preguntas/construir_banco.py             solo informe, no modifica nada
  python -X utf8 HERRAMIENTAS/banco_preguntas/construir_banco.py --audit 0.5 lista las de baja coincidencia respuesta-cita
  python -X utf8 HERRAMIENTAS/banco_preguntas/construir_banco.py --write     AGREGA las preguntas a QUIZ.HTML (hacer copia antes)

Con el banco ya completo (500) el informe da 0 nuevas: todas las candidatas ya están cargadas.
"""
import json, re, sys, unicodedata, difflib, os, glob

AQUI = os.path.dirname(os.path.abspath(__file__))
SP = os.path.join(AQUI, "candidatas")
ROOT = os.path.dirname(os.path.dirname(AQUI))
NORM_DIR = os.path.join(ROOT, "FUENTES", "normativa", "NORMATIVA md")
QUIZ = os.path.join(ROOT, "PÁGINA", "QUIZ.HTML")
TARGET_TOTAL = 500
TARGET_BY_MOD = {"MOD1": 84, "MOD2": 84, "MOD3": 83, "MOD4": 83, "MOD5": 83, "MOD6": 83}


def fold(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9ñ ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def norm_ev(s):
    s = unicodedata.normalize("NFC", s)
    s = re.sub(r"[*\\_`#>]", "", s)
    return re.sub(r"\s+", " ", s).strip()


_file_cache = {}


def file_text(name):
    if name not in _file_cache:
        cands = [os.path.join(NORM_DIR, name)]
        cands += glob.glob(os.path.join(NORM_DIR, "*" + name + "*"))
        path = next((p for p in cands if os.path.isfile(p)), None)
        if not path:
            _file_cache[name] = None
        else:
            _file_cache[name] = norm_ev(open(path, encoding="utf-8").read())
    return _file_cache[name]


def sim(a, b):
    ta, tb = set(a.split()), set(b.split())
    jac = len(ta & tb) / max(1, len(ta | tb))
    return max(jac, difflib.SequenceMatcher(None, a, b).ratio())


# ---- banco existente
html = open(QUIZ, encoding="utf-8").read()
a = html.index("const RAW_QUESTIONS")
b = html.index("const QUESTION_BANK")
# Cada q(...) tiene 7 textos entre comillas: módulo, pregunta, correcta, 3 incorrectas y fuente
_bloque = "\n".join(l for l in html[a:b].splitlines() if not l.strip().startswith("//"))
_textos = re.findall(r'"((?:[^"\\]|\\.)*)"', _bloque)
existing = [(_textos[i], json.loads('"' + _textos[i + 1] + '"')) for i in range(0, len(_textos) - 6, 7)]
existing_stems = [fold(s) for _, s in existing]
print("existentes:", len(existing))
existing_count = {}
for m, _ in existing:
    existing_count[m] = existing_count.get(m, 0) + 1

# ---- candidatos
report = {}
accepted = {m: [] for m in TARGET_BY_MOD}
seen_stems = list(existing_stems)
seen_ev = set()
seen_answers = []
for mod in TARGET_BY_MOD:
    path = os.path.join(SP, mod + ".json")
    rej = {"json": 0, "schema": 0, "evidence": 0, "dup_existing": 0, "dup_new": 0, "dup_evidence": 0}
    if not os.path.isfile(path):
        report[mod] = ("sin archivo", rej, 0)
        continue
    try:
        data = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        print(mod, "JSON inválido:", e)
        report[mod] = ("json inválido", rej, 0)
        continue
    for it in data:
        try:
            q, c, w, src, f, ev = it["question"].strip(), it["correct"].strip(), [x.strip() for x in it["wrong"]], it["source"].strip(), it["file"].strip(), it["evidence"]
        except Exception:
            rej["schema"] += 1
            continue
        opts = [c] + w
        if (it.get("module") != mod or len(w) != 3 or not q or not src or any(not o for o in opts)
                or len({fold(o) for o in opts}) != 4 or q.count("?") > 2):
            rej["schema"] += 1
            continue
        txt = file_text(f)
        nev = norm_ev(ev)
        if not txt or len(nev) < 30 or nev not in txt:
            rej["evidence"] += 1
            continue
        fq = fold(q)
        # Excluidas tras revisión manual: bajo valor (bibliografía) o respuesta de la guía no verificable
        if any(x in q for x in ("En la bibliografía del Módulo IV", "Se efectúa una caución de 1.000 acciones",
                             "resarcimiento por una infracción al procedimiento de operaciones con partes relacionadas",
                             "el plazo máximo para reportar hechos u operaciones sospechosas de lavado de activos")):
            rej["dup_evidence"] += 1
            continue
        if any(sim(fq, s) > 0.78 for s in existing_stems):
            rej["dup_existing"] += 1
            continue
        if any(sim(fq, s) > 0.78 for s in seen_stems[len(existing_stems):]):
            rej["dup_new"] += 1
            continue
        if nev in seen_ev:
            rej["dup_evidence"] += 1
            continue
        seen_ev.add(nev)
        seen_stems.append(fq)
        accepted[mod].append({"module": mod, "question": q, "correct": c, "wrong": w, "source": src, "evidence": ev, "file": f})
    report[mod] = ("ok", rej, len(accepted[mod]))

# ---- selección por módulo (hasta completar 500 en total)
selected = {}
for mod, tgt in TARGET_BY_MOD.items():
    need = max(0, tgt - existing_count.get(mod, 0))
    selected[mod] = accepted[mod][:need]
total_new_needed = TARGET_TOTAL - len(existing)
short = total_new_needed - sum(len(v) for v in selected.values())
if short > 0:  # completar con sobrantes de otros módulos
    for mod in TARGET_BY_MOD:
        extra = accepted[mod][len(selected[mod]):]
        take = extra[:short]
        selected[mod] += take
        short -= len(take)
        if short <= 0:
            break

print("\nINFORME")
for mod, (st, rej, n) in report.items():
    print(mod, st, "válidas:", n, "descartes:", rej, "-> elegidas:", len(selected[mod]))
final_new = sum(len(v) for v in selected.values())
print("nuevas elegidas:", final_new, "| total quedaría:", len(existing) + final_new, "| faltan para 500:", max(0, short))

if "--audit" in sys.argv:
    thr = float(sys.argv[sys.argv.index("--audit") + 1])
    n = 0
    for mod in TARGET_BY_MOD:
        for it in selected[mod]:
            toks = [t for t in fold(it["correct"]).split() if len(t) > 3 and not t.isdigit()] + re.findall(r"\d+", fold(it["correct"]))
            ev = fold(it["evidence"])
            if not toks:
                continue
            ov = sum(1 for t in toks if t in ev) / len(toks)
            if ov < thr:
                n += 1
                print("[%s] ov=%.2f | P: %s | C: %s | EV: %s | SRC: %s" % (mod, ov, it["question"], it["correct"], it["evidence"], it["source"]))
    print("revisar:", n)

if "--write" in sys.argv and not final_new:
    print("No hay preguntas nuevas para agregar: QUIZ.HTML no se modificó.")
elif "--write" in sys.argv:
    def js(s):
        return json.dumps(s, ensure_ascii=False)
    def line(it):
        return "            q(%s, %s, %s, [%s], %s)" % (js(it["module"]), js(it["question"]), js(it["correct"]), ", ".join(js(x) for x in it["wrong"]), js(it["source"]))
    out = []
    names = {"MOD1": "MÓDULO I", "MOD2": "MÓDULO II", "MOD3": "MÓDULO III", "MOD4": "MÓDULO IV", "MOD5": "MÓDULO V", "MOD6": "MÓDULO VI"}
    for mod in TARGET_BY_MOD:
        if selected[mod]:
            out.append("            // ===== %s: PREGUNTAS ADICIONALES (cada una con cita verificada en el material del proyecto) =====" % names[mod])
            out.append(",\n".join(line(it) for it in selected[mod]))
    block = ",\n".join(out)
    # insertar antes del cierre del arreglo RAW_QUESTIONS
    seg = html[a:b]
    m = list(re.finditer(r"\n\s*\];", seg))[-1]
    head = seg[:m.start()].rstrip()
    assert head.endswith(")"), head[-40:]
    new_seg = head + ",\n" + block + seg[m.start():]
    open(QUIZ, "w", encoding="utf-8", newline="").write(html[:a] + new_seg + html[b:])
    print("QUIZ.HTML actualizado")
