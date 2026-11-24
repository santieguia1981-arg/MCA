#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parsea el TOC 2013 (Normas CNV, act. 16-04-2026) a: Título > Capítulo > Sección > Artículo (+ Anexos).
Los nombres de Capítulos/Secciones se toman del ÍNDICE del documento; el cuerpo aporta el texto de los artículos."""
import re, json, sys

SRC, OUT = sys.argv[1], sys.argv[2]
lines = open(SRC, encoding='utf-8').read().split('\n')
start = next(i for i, l in enumerate(lines) if l.strip() == '# TÍTULOI' and i > 300)
index_lines, body = lines[:start], lines[start:]

R = {'I':1,'V':5,'X':10,'L':50}
def r2i(s):
    t = 0
    for i, c in enumerate(s):
        v = R[c]; t += -v if i+1 < len(s) and R[s[i+1]] > v else v
    return t
def i2r(n):
    out = ''
    for v, c in ((50,'L'),(40,'XL'),(10,'X'),(9,'IX'),(5,'V'),(4,'IV'),(1,'I')):
        while n >= v: out += c; n -= v
    return out

NOISE = re.compile(
    r'(COMISI[ÓO]N\s*NACIONAL\s*DE\s*VALORES\s*)?NORMAS\s*A[ÑN]O\s*2013'
    r'(\s*COMISI[ÓO]N\s*NACIONAL\s*DE\s*VALORES)?(\s*NORMAS\s*A[ÑN]O\s*2013)?'
    r'(?:\s*(\d{1,3})(?=\s|$))?')
def clean(l):
    return re.sub(r'\s+', ' ', NOISE.sub(' ', l)).strip()
def norm(x):
    return re.sub(r'[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]', '', x).lower()

# ---------------- índice (nombres autoritativos) ----------------
itxt = ' '.join(clean(l) for l in index_lines if l.strip() and not l.startswith('#'))
itxt = re.sub(r'\s+', ' ', itxt)
tmark = list(re.finditer(r'T[ÍI]TULO\s*([IVXL]+)\s*\.', itxt))
index = {}   # titulo -> {'name':..., 'chapters': {roman:name}, 'sections': {(chroman,roman):name}}
for k, tm in enumerate(tmark):
    seg = itxt[tm.end(): tmark[k+1].start() if k+1 < len(tmark) else len(itxt)]
    # el primer tramo hasta CAPÍTULO/Sección es el nombre del título
    toks = list(re.finditer(r'(CAP[ÍI]TULO|Secci[óo]n|SECCI[ÓO]N|Anexo|ANEXO)\s*([IVXL]+|[A-Z])\s*\.', seg))
    num = tm.group(1)
    d = index.setdefault(num, {'name': '', 'chapters': {}, 'sections': {}})
    if num not in index or not d['name']:
        d['name'] = (seg[:toks[0].start()] if toks else seg).strip(' .')
    curch = None
    for j, t in enumerate(toks):
        nm = seg[t.end(): toks[j+1].start() if j+1 < len(toks) else len(seg)].strip(' .')
        kw = t.group(1).upper(); rn = t.group(2)
        if kw.startswith('CAP'):
            if rn not in d['chapters']: d['chapters'][rn] = nm
            curch = rn
        elif kw.startswith('SEC'):
            d['sections'].setdefault((curch, rn), nm)

# ---------------- cuerpo ----------------
ART = re.compile(
    r'ART[ÍIÌÏ]CULO\s*(\d+)\s*[º°o]?\s*((?:bis|ter|qu[aá]ter|quinquies|sexies|septies|octies|novies|decies|BIS|TER|QU[AÁ]TER|QUINQUIES|SEXIES|SEPTIES|OCTIES|NOVIES|DECIES)(?:\s*\d+)?)?(?:\s*[.\-–—]\s*-?|(?<=\d)(?=[A-ZÁÉÍÓÚ][a-záéíóú]))')
HEAD = re.compile(r'(?<![A-Za-zÁÉÍÓÚñ])(?:(CAP[ÍI]TULO|SECCI[ÓO]N)\s*([IVXL]+)(?![IVXLa-zñáéíóú])|(ANEXO)\s*([IVXL]+|[A-Z])(?![A-Za-zÁÉÍÓÚñ]))(?!\s*(?:DEL?\s+(?:PRESENTE\s+)?(?:CAP[ÍI]TULO|T[ÍI]TULO|SECCI[ÓO]N)|DE ESTE|DE LA PRESENTE|DEL PRESENTE|DE LAS PRESENTES))')

def is_upper_sentence(s):
    L = [c for c in s if c.isalpha()]
    return bool(L) and sum(c.isupper() for c in L) / len(L) > 0.85

def split_trailing_title(pre):
    pre = pre.strip()
    if not pre: return '', ''
    sents = re.split(r'(?<=[.:;])\s+', pre)
    title = []
    while sents and is_upper_sentence(sents[-1]) and len(' '.join(title)) < 300:
        title.insert(0, sents.pop())
    return ' '.join(sents).strip(), ' '.join(title).strip().rstrip('.')

def consume_prefix(txt, name):
    """Quita de txt el prefijo equivalente (ignorando espacios/puntuación) a name. Devuelve (resto, consumido) o (None, '')."""
    nn = norm(name)
    if not nn: return None, ''
    k = 0
    for pos, ch in enumerate(txt):
        if k >= len(nn): return txt[pos:], txt[:pos].strip()
        c = norm(ch)
        if not c: continue
        if c == nn[k]: k += 1
        else: return None, ''
    return ('', txt.strip()) if k >= len(nn) else (None, '')

titles = []
cur = {'title': None, 'chapter': None, 'section': None, 'leaf': None, 'head': None, 'strip': None}

def new_node(kind, num, name):
    return {'kind': kind, 'num': num, 'name': name.strip(' .'), 'text': [], 'children': []}

def base_container():
    return cur['section'] if cur['section'] is not None else (cur['chapter'] if cur['chapter'] is not None else cur['title'])

def container():
    if cur.get('anexo') is not None:
        return cur.get('anexo_section') or cur['anexo']
    return base_container()

def add_text(s):
    s = s.strip()
    if not s: return
    n = cur['leaf'] or container()
    if n is not None: n['text'].append(s)

def tnum(): return cur['title']['num']

def set_head_text(txt):
    txt = txt.strip()
    if not txt: return
    h = cur['head']
    if h is not None:
        if h['kind'] == 'anexo' and len(txt) > 100:
            cut = txt.find('. ', 15)
            if cut == -1 or cut > 150:
                cut = txt.rfind(' ', 0, 120)
                if cut <= 0: cut = 120
            h['name'] = txt[:cut].strip(' .'); add_text(txt[cut:])
        elif h['kind'] in ('chapter', 'section'):
            known = h.get('_idxname')
            if known:
                rest, used = consume_prefix(txt, known)
                if rest is None: h['name'] = (h['name'] + ' ' + txt).strip(' .')
                else:
                    h['name'] = used.strip(' .'); add_text(rest)
            else:
                h['name'] = (h['name'] + ' ' + txt).strip(' .')
        else:
            h['name'] = (h['name'] + ' ' + txt).strip(' .')
    elif cur['strip']:
        rest, _u = consume_prefix(txt, cur['strip'])
        add_text(txt if rest is None else rest)
    else:
        add_text(txt)

def start_title(num, name):
    t = new_node('title', num, name)
    titles.append(t)
    cur.update(title=t, chapter=None, section=None, leaf=None, head=None, strip=None, anexo=None, anexo_section=None)

def start_heading(kind, roman, ):
    ch, se = cur['chapter'], cur['section']
    d = index.get(tnum(), {'chapters': {}, 'sections': {}})
    if kind == 'chapter':
        if ch is not None and ch['num'] == roman:        # cabecera de página repetida o capítulo provisorio
            cur['head'] = ch if ch.get('_ph') else None
            cur['strip'] = ch.get('_idxname') or ch['name']
            ch['_ph'] = False
            return
        tc = cur['title']['children']
        if ch is None and d['chapters'] and any(c['kind'] != 'chapter' for c in tc):
            # contenido anterior al primer encabezado de capítulo: pertenece al Capítulo I (encabezado desplazado o ausente)
            first = new_node('chapter', 'I', '')
            first['_idxname'] = d['chapters'].get('I', '')
            first['name'] = first['_idxname']
            first['children'] = tc[:]
            del tc[:]
            cur.update(anexo=None, anexo_section=None)
            tc.append(first)
            if roman == 'I':
                cur.update(chapter=first, section=None, leaf=None, head=first, strip=None)
                first['_idxname'] = d['chapters'].get('I', '')
                return
            ch = first
        n = new_node('chapter', roman, '')
        n['_idxname'] = d['chapters'].get(roman, '')
        cur['title']['children'].append(n)
        cur.update(chapter=n, section=None, leaf=None, head=n, strip=None, anexo=None, anexo_section=None)
    elif kind == 'section':
        a = cur.get('anexo')
        if a is not None:
            secs = [c for c in (ch['children'] if ch else cur['title']['children']) if c['kind'] == 'section']
            expected = r2i(secs[-1]['num']) + 1 if secs else 1
            idxmax = max([r2i(k[1]) for k in d['sections'] if k[0] == (ch['num'] if ch else None)] or [0])
            nested = not (r2i(roman) == expected and (idxmax == 0 or r2i(roman) <= idxmax))
            if nested:
                n = new_node('section', roman, '')
                a['children'].append(n)
                cur.update(anexo_section=n, leaf=None, head=n, strip=None)
                return
            cur.update(anexo=None, anexo_section=None)
        if se is not None and se['num'] == roman and ch is cur['chapter']:   # cabecera repetida
            cur['head'] = None; cur['strip'] = se.get('_idxname') or se['name']
            return
        # "SECCIÓN I" tras otras secciones sin que haya aparecido su capítulo (encabezado desplazado en el PDF)
        nxt = i2r(r2i(ch['num']) + 1) if ch is not None else None
        maxsec = max([r2i(k[1]) for k in d['sections'] if k[0] == (ch['num'] if ch else None)] or [0])
        if (roman == 'I' and se is not None and se['num'] != 'I' and ch is not None
                and nxt in d['chapters'] and chapter_token_soon(nxt) and r2i(se['num']) >= maxsec
                and not any(c['kind'] == 'chapter' and c['num'] == nxt for c in cur['title']['children'])):
            ph = new_node('chapter', nxt, '')
            ph['_ph'] = True; ph['_idxname'] = d['chapters'].get(nxt, '')
            ph['name'] = ph['_idxname']
            cur['title']['children'].append(ph)
            cur.update(chapter=ph, section=None)
            ch = ph
        n = new_node('section', roman, '')
        n['_idxname'] = d['sections'].get((ch['num'] if ch else None, roman), '')
        (ch if ch is not None else cur['title'])['children'].append(n)
        cur.update(section=n, leaf=None, head=n, strip=None)
    else:
        n = new_node('anexo', roman, '')
        base_container()['children'].append(n)
        cur.update(leaf=n, head=n, strip=None, anexo=n, anexo_section=None)

def chapter_token_soon(roman, window=80):
    for raw in body[i: i + window]:
        c = clean(raw)
        for mm in HEAD.finditer(c):
            if mm.group(1) and mm.group(1).upper().startswith('CAP') and mm.group(2) == roman: return True
    return False

def chapter_has_articles(ch):
    for c in ch.get('children', []):
        if c['kind'] == 'article': return True
        if c['kind'] == 'section' and chapter_has_articles(c): return True
    return False

def last_article_n(node):
    last = 0
    for c in node.get('children', []):
        if c['kind'] == 'article': last = c['n']
        elif c['kind'] == 'section': last = last_article_n(c) or last
    return last

def start_article(num, suffix, title):
    a = cur.get('anexo')
    if a is not None and not a['children']:
        base = cur['chapter'] if cur['chapter'] is not None else cur['title']
        if int(num) == last_article_n(base) + 1:
            cur.update(anexo=None, anexo_section=None)
    ch = cur['chapter']
    if ch is not None and cur.get('anexo') is None and int(num) == 1 and not suffix and chapter_has_articles(ch):
        d = index.get(tnum(), {'chapters': {}})
        nxt = i2r(r2i(ch['num']) + 1)
        if nxt in d['chapters'] and chapter_token_soon(nxt) and not any(c['kind'] == 'chapter' and c['num'] == nxt for c in cur['title']['children']):
            ph = new_node('chapter', nxt, d['chapters'][nxt])
            ph['_ph'] = True; ph['_idxname'] = d['chapters'][nxt]
            cur['title']['children'].append(ph)
            cur.update(chapter=ph, section=None, leaf=None, head=None, strip=None)
    n = new_node('article', (num + (' ' + suffix.lower() if suffix else '')).strip(), title)
    n['n'] = int(num)
    container()['children'].append(n)
    cur.update(leaf=n, head=None, strip=None)

pending_cap_fill = None
i = 0
while i < len(body):
    raw = body[i]; i += 1
    s = raw.strip()
    if not s: continue
    m1 = re.match(r'^#\s+T[ÍI]TULO\s*([IVXLxl]+)\s*$', s)
    if m1 and cur['title'] is not None:
        rn = m1.group(1).upper()
        if titles[-1]['num'] != rn and r2i(rn) > r2i(titles[-1]['num']) and r2i(rn) - r2i(titles[-1]['num']) <= 2:
            start_title(rn, '')
        continue
    m = re.match(r'^##\s+T[ÍI]TULO\s*([IVXL]+)\s*$', s)
    if m and cur['title'] is not None and titles[-1]['num'] == m.group(1):
        continue
    if m:
        name = []
        j = i
        while j < len(body) and len(name) < 4:
            t = body[j].strip(); j += 1
            if not t: continue
            if t.startswith('####'): name.append(t.lstrip('# ').strip())
            elif name: break
            elif t.startswith('#') or 'NORMAS' in t: continue
            else: break
        start_title(m.group(1), ' '.join(name))
        continue
    if s.startswith('#') or cur['title'] is None: continue
    s = clean(s)
    if not s: continue

    toks = [(mm.start(), mm.end(), 'art', mm) for mm in ART.finditer(s)]
    for mm in HEAD.finditer(s):
        toks.append((mm.start(), mm.end(), 'head', mm))
    toks.sort(key=lambda x: x[0])
    flt, last = [], -1
    for t in toks:
        if t[0] >= last: flt.append(t); last = t[1]
    toks = flt

    if not toks:
        h = cur['head']
        if h is not None and not h['text'] and is_upper_sentence(s) and len(s) < 260 and not h.get('_closed') and not h.get('_idxname'):
            h['name'] = (h['name'] + ' ' + s).strip(' .')
        else:
            if h is not None: h['_closed'] = True
            cur['strip'] = None
            add_text(s)
        continue

    pos, prev = 0, None
    for t in toks:
        between = s[pos:t[0]]
        keep, title = split_trailing_title(between) if t[2] == 'art' else (between, '')
        if prev is not None and prev[2] == 'head': set_head_text(keep)
        elif keep.strip(): add_text(keep)
        if t[2] == 'art':
            start_article(t[3].group(1), (t[3].group(2) or '').strip(), title)
        else:
            g = t[3]
            if g.group(3):
                start_heading('anexo', g.group(4))
            else:
                start_heading('chapter' if g.group(1).upper().startswith('CAP') else 'section', g.group(2))
        prev, pos = t, t[1]
    tail = s[pos:]
    if prev[2] == 'head': set_head_text(tail)
    elif tail.strip(): add_text(tail)

# ---------------- post-proceso ----------------
def finalize(n, tnum_=None):
    n['text'] = '\n'.join(n['text']).strip()
    for k in ('_closed', '_ph'): n.pop(k, None)
    idxn = n.pop('_idxname', '')
    if n['kind'] in ('chapter', 'section') and idxn:
        b, i_ = n['name'], idxn.strip(' .')
        rest, used = consume_prefix(b, i_) if b else (None, '')
        if rest is not None:
            n['name'] = used if used.count(' ') >= i_.count(' ') else i_
        else:
            n['name'] = i_
    for c in n['children']: finalize(c)
    if not n['children']: n.pop('children')
    if not n['text']: n.pop('text')
for t in titles:
    d = index.get(t['num'])
    if d and d['name']:
        i_, b = d['name'].strip(' .'), t['name']
        t['name'] = b if b and (norm(i_) in norm(b) or norm(b) in norm(i_)) and b.count(' ') > i_.count(' ') and len(norm(b)) <= len(norm(i_)) + 3 else i_
    finalize(t)

if 'XIX' not in [t['num'] for t in titles]:
    idx = [t['num'] for t in titles].index('XVIII') + 1
    titles.insert(idx, {'kind': 'title', 'num': 'XIX', 'name': 'DEROGADO',
                        'text': 'Título derogado. Figura en el índice del TOC como "TÍTULO XIX. DEROGADO".'})

# ---- segmentación de palabras pegadas en nombres de encabezados (vocabulario del propio TOC) ----
import math, collections
vocab = collections.Counter()
def collect(n):
    for w in re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+", n.get('text', '')):
        if len(w) <= 18: vocab[w.lower()] += 1
    for c in n.get('children', []): collect(c)
for t in titles: collect(t)
TINY = {'de','la','el','y','e','en','a','o','u','los','las','del','al','por','para','con','un','una','que','se','su','sus','no','lo','ni'}
def wcost(w):
    f = vocab.get(w, 0)
    if w in TINY: return 1.0
    if len(w) < 3: return None
    if f >= 3: return 2.0 + 6.0 / (1 + math.log(1 + f))
    return None
def segment(tok):
    low = tok.lower(); n = len(low)
    best = [(0.0, [])] + [None] * n
    for i in range(1, n + 1):
        for j in range(max(0, i - 30), i):
            if best[j] is None: continue
            c = wcost(low[j:i])
            if c is None: continue
            cand = best[j][0] + c
            if best[i] is None or cand < best[i][0]: best[i] = (cand, best[j][1] + [(j, i)])
    if best[n] is None: return tok
    return ' '.join(tok[a:b] for a, b in best[n][1])
COSM = [('FONDOSCOMUNES DEINVERSIÓN','FONDOS COMUNES DE INVERSIÓN'),('PRODUCTOS DEINVERSIÓN','PRODUCTOS DE INVERSIÓN'),
 ('NEGOCIACIÓNSECUNDARIADEVALORESNEGOCIABLESDEEMISION','NEGOCIACIÓN SECUNDARIA DE VALORES NEGOCIABLES DE EMISIÓN'),
 ('AGENTEDE CORRETAJE','AGENTE DE CORRETAJE'),('AGENTEDEPOSITARIO CENTRAL DEVALORES','AGENTE DEPOSITARIO CENTRAL DE VALORES'),
 ('AGENTES DECUSTODIA,REGISTRO','AGENTES DE CUSTODIA, REGISTRO'),('AGENTES DECALIFICACIÓN','AGENTES DE CALIFICACIÓN'),
 ('IMPLEMENTACIONPROTOCOLOISO20022','IMPLEMENTACIÓN PROTOCOLO ISO 20022'),
 ('REPRESENTACIONDIGITALDEVALORESNEGOCIABLES.ÁMBITODE APLICACIÓN','REPRESENTACIÓN DIGITAL DE VALORES NEGOCIABLES. ÁMBITO DE APLICACIÓN'),
 ('GENERALNº835','GENERAL Nº 835'),('REPÚBLICAARGENTINA','REPÚBLICA ARGENTINA'),('FUNCIONARIOS(“','FUNCIONARIOS (“'),
 ('LEYN°','LEY N° '),('LEY N° 19.550','LEY N° 19.550'),('Nº 19.550','Nº 19.550'),('(ACRYP','(ACRYP)'),('(ADCVN','(ADCVN)'),('(AN','(AN)'),
 ('(ACRYP))','(ACRYP)'),('(ADCVN))','(ADCVN)'),('(AN))','(AN)'),('AGENTEDE ','AGENTE DE '),('AGENTES DECALIFICACIÓN','AGENTES DE CALIFICACIÓN'),
 ('FONDOSCOMUNES','FONDOS COMUNES'),('INVERSIÓNCOLECTIVA','INVERSIÓN COLECTIVA'),('DEINVERSIÓN','DE INVERSIÓN'),('OFERTAPÚBLICA','OFERTA PÚBLICA'),
 ('EMISORAS–OBLIGACIONES','EMISORAS – OBLIGACIONES'),('ADECUACIÓN–PATRIMONIO','ADECUACIÓN – PATRIMONIO'),('EMPRESAS–INSTRUMENTOS','EMPRESAS – INSTRUMENTOS')]
def fix_names(txt, kind=None):
    if kind == 'section' and ' PRODUCTOS DE INVERSIÓN COLECTIVA.IMPUESTO' in txt: txt = txt.split(' PRODUCTOS DE INVERSIÓN COLECTIVA.IMPUESTO')[0]
    if kind in ('chapter', 'section', 'title'):
        txt = re.split(r'\s*(?:Secci[óo]n|SECCI[ÓO]N|Cap[ií]tulo|CAP[ÍI]TULO|Anexo|ANEXO)\s*[IVXL]+(?![a-zñáéíóú])', txt)[0]
    def rep(m):
        w = m.group(0)
        return segment(w) if vocab.get(w.lower(), 0) < 5 else w
    txt = re.sub(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{10,}", rep, txt)
    for a_, b_ in COSM:
        txt = txt.replace(a_, b_)
    txt = re.sub(r'(?<=[A-ZÁÉÍÓÚ]{2})\.(?=[A-ZÁÉÍÓÚ]{3})', '. ', txt)
    txt = re.sub(r'(?<=[A-Za-zÁÉÍÓÚ]{3})\((?=[A-Z“])', ' (', txt)
    if txt.count('(') > txt.count(')') and re.search(r'\([A-Za-z]+$', txt): txt += ')'
    txt = re.sub(r'\s+', ' ', txt).strip(' .')
    if kind == 'anexo' and len(txt) > 110:
        txt = txt[:txt.rfind(' ', 0, 105)].rstrip(' ,;:') + '…'
    return txt
def rename(n):
    if n['kind'] != 'article': n['name'] = fix_names(n['name'], n['kind'])
    for c in n.get('children', []): rename(c)
for t in titles: rename(t)

TITLE_NAMES = {
 'I':'DISPOSICIONES PRELIMINARES','II':'EMISORAS',
 'III':'RETIRO DE LA OFERTA PÚBLICA. CANCELACIONES. OFERTA PÚBLICA DE ADQUISICIÓN. APORTES IRREVOCABLES',
 'IV':'RÉGIMEN INFORMATIVO PERIÓDICO','V':'PRODUCTOS DE INVERSIÓN COLECTIVA (PIC)',
 'VI':'MERCADOS Y CÁMARAS COMPENSADORAS',
 'VII':'AGENTE DE NEGOCIACIÓN. AGENTE DE LIQUIDACIÓN Y COMPENSACIÓN. AGENTE ASESOR GLOBAL DE INVERSIÓN. AGENTE PRODUCTOR. AGENTE DE CORRETAJE DE VALORES NEGOCIABLES. DISPOSICIONES COMUNES',
 'VIII':'AGENTE DEPOSITARIO CENTRAL DE VALORES NEGOCIABLES. AGENTE DE CUSTODIA, REGISTRO Y PAGO',
 'IX':'AGENTES DE CALIFICACIÓN DE RIESGOS (ACR)',
 'X':'DEL REGISTRO DE MERCADOS, CÁMARAS COMPENSADORAS Y AGENTES BAJO COMPETENCIA DE LA GERENCIA DE AGENTES Y MERCADOS',
 'XI':'PREVENCIÓN DEL LAVADO DE ACTIVOS Y FINANCIACIÓN DEL TERRORISMO (PLAyFT)',
 'XII':'TRANSPARENCIA EN EL ÁMBITO DE LA OFERTA PÚBLICA',
 'XIII':'PROCEDIMIENTO DE INVESTIGACIONES. PROCEDIMIENTO SUMARIAL. PUBLICIDAD',
 'XIV':'PLATAFORMA DE FINANCIAMIENTO COLECTIVO. REGISTRO DE PROVEEDORES DE SERVICIOS DE ACTIVOS VIRTUALES',
 'XV':'AUTOPISTA DE LA INFORMACIÓN FINANCIERA (AIF)','XVI':'DISPOSICIONES GENERALES',
 'XVII':'TASAS DE FISCALIZACIÓN Y CONTROL - ARANCELES DE AUTORIZACIÓN','XVIII':'DISPOSICIONES TRANSITORIAS',
 'XX':'OFERTAS PRIVADAS DE VALORES NEGOCIABLES','XXI':'REGLAMENTACIÓN DE OTRAS LEYES Y DECRETOS','XXII':'TOKENIZACIÓN'}
for t in titles:
    if t['num'] in TITLE_NAMES: t['name'] = TITLE_NAMES[t['num']]

json.dump(titles, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

def walk(n, acc):
    acc[n['kind']] = acc.get(n['kind'], 0) + 1
    for c in n.get('children', []): walk(c, acc)
tot = {}
for t in titles:
    a = {}; walk(t, a)
    for k, v in a.items(): tot[k] = tot.get(k, 0) + v
    print('TÍTULO %-5s %-60s %s' % (t['num'], t['name'][:60], a))
print('TOTAL', tot)
