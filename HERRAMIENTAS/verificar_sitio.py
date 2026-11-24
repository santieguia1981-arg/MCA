#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verifica el sitio MCA antes de publicarlo.

Revisa:
  1. Que todos los enlaces, imágenes, scripts y estilos locales de los .HTML apunten a archivos que existen
     (respetando mayúsculas/minúsculas, como lo hacen la mayoría de los hostings).
  2. Que los archivos referenciados por url() en los .css existan.
  3. El banco de preguntas de QUIZ.HTML: cantidad por módulo, enunciados repetidos, opciones repetidas o
     vacías y preguntas sin fuente.
  4. Que exista data/normativa.js y que cada .HTML cargue js/ui.js y tenga las etiquetas de seguridad.

Uso:   python HERRAMIENTAS/verificar_sitio.py
Salida: código 0 si todo está bien, 1 si hay problemas.
"""
import os
import re
import sys
import unicodedata
from urllib.parse import unquote, urlsplit

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITIO = os.path.join(RAIZ, "PÁGINA")
problemas = []
avisos = []


def existe_exacto(ruta):
    """True si la ruta existe con las mayúsculas exactas (sensible a mayúsculas en cada tramo)."""
    ruta = os.path.normpath(ruta)
    partes = ruta.split(os.sep)
    actual = partes[0] + os.sep if re.match(r"^[A-Za-z]:$", partes[0]) else os.sep if partes[0] == "" else partes[0]
    for p in partes[1:]:
        try:
            if p not in os.listdir(actual):
                return False
        except OSError:
            return False
        actual = os.path.join(actual, p)
    return True


def es_local(url):
    u = url.strip()
    if not u or u.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return False
    return not urlsplit(u).scheme and not u.startswith("//")


def revisar_html(nombre):
    ruta = os.path.join(SITIO, nombre)
    html = open(ruta, encoding="utf-8").read()
    for m in re.finditer(r'(?:href|src)\s*=\s*"([^"]*)"', html):
        url = m.group(1)
        if not es_local(url):
            continue
        destino = unquote(urlsplit(url).path)
        if not destino:
            continue
        if not existe_exacto(os.path.join(SITIO, destino)):
            problemas.append(f"{nombre}: enlace roto -> {url}")
    if "js/ui.js" not in html:
        avisos.append(f"{nombre}: no carga js/ui.js")
    if "Content-Security-Policy" not in html:
        avisos.append(f"{nombre}: sin etiqueta Content-Security-Policy")
    if 'name="description"' not in html:
        avisos.append(f"{nombre}: sin meta description")


def revisar_css():
    carpeta = os.path.join(SITIO, "css")
    for nombre in sorted(os.listdir(carpeta)):
        if not nombre.endswith(".css"):
            continue
        css = open(os.path.join(carpeta, nombre), encoding="utf-8").read()
        for m in re.finditer(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", css):
            url = m.group(1)
            if es_local(url) and not existe_exacto(os.path.join(carpeta, unquote(urlsplit(url).path))):
                problemas.append(f"css/{nombre}: recurso inexistente -> {url}")


def fold(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]+", " ", s)).strip()


def revisar_banco():
    html = open(os.path.join(SITIO, "QUIZ.HTML"), encoding="utf-8").read()
    a = html.index("const RAW_QUESTIONS")
    b = html.index("const QUESTION_BANK")
    bloque = "\n".join(l for l in html[a:b].splitlines() if not l.strip().startswith("//"))
    cadenas = re.findall(r'"((?:[^"\\]|\\.)*)"', bloque)
    n_llamadas = len(re.findall(r"\bq\(\s*\"MOD\d\"", bloque))
    if len(cadenas) != n_llamadas * 7:
        problemas.append(f"QUIZ.HTML: el banco no se pudo leer bien ({n_llamadas} preguntas, {len(cadenas)} textos)")
        return
    por_modulo, vistos = {}, {}
    for i in range(n_llamadas):
        mod, preg, ok, w1, w2, w3, fuente = cadenas[i * 7:(i + 1) * 7]
        por_modulo[mod] = por_modulo.get(mod, 0) + 1
        opciones = [ok, w1, w2, w3]
        if any(not o.strip() for o in opciones) or len({fold(o) for o in opciones}) != 4:
            problemas.append(f"QUIZ.HTML: opciones repetidas o vacías -> {preg[:70]}")
        if not fuente.strip():
            problemas.append(f"QUIZ.HTML: pregunta sin fuente -> {preg[:70]}")
        clave = fold(preg)
        if clave in vistos:
            problemas.append(f"QUIZ.HTML: pregunta repetida -> {preg[:70]}")
        vistos[clave] = True
    print(f"Banco de preguntas: {n_llamadas} en total")
    for mod in sorted(por_modulo):
        print(f"   {mod}: {por_modulo[mod]}")


def main():
    if not os.path.isdir(SITIO):
        print("No se encontró la carpeta PÁGINA junto a HERRAMIENTAS.")
        return 1
    paginas = sorted(f for f in os.listdir(SITIO) if f.upper().endswith(".HTML"))
    print(f"Páginas revisadas: {', '.join(paginas)}")
    for p in paginas:
        revisar_html(p)
    revisar_css()
    revisar_banco()
    if not os.path.isfile(os.path.join(SITIO, "data", "normativa.js")):
        problemas.append("falta data/normativa.js")
    print()
    for a in avisos:
        print("AVISO   ", a)
    for p in problemas:
        print("PROBLEMA", p)
    print(f"\n{len(problemas)} problema(s), {len(avisos)} aviso(s).")
    return 1 if problemas else 0


if __name__ == "__main__":
    sys.exit(main())
