@echo off
chcp 65001 >nul
rem Abre la portada del sitio MCA en el navegador predeterminado.
rem No hace falta servidor: el sitio funciona abriendo los archivos directamente.
start "" "%~dp0..\PÁGINA\MCA.HTML"
