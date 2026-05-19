# DEV.wiki — guia retro para quien empieza a programar

Esta pagina la hice como **referencia y orientacion** para personas que estan **comenzando en el mundo del desarrollo** y necesitan un sitio donde consultar ideas ordenadas, sin sustituir a la documentacion oficial ni a un curso completo. Es una wiki modular con aspecto de terminal retro (CRT): pensada para leer poco a poco, buscar por tema y practicar un poco con el teclado.

La idea principal es ayudar a quien quiere entrar al mundo de la programacion, Git y las herramientas que se usan todos los dias. Aqui puedes aprender conceptos basicos de backend, interfaces, APIs, bases de datos, seguridad, testing, Linux y mas, con explicaciones cortas y faciles de recorrer.

Tambien es un proyecto de codigo abierto que puedes descargar para estudiar como esta hecho por dentro. Puedes abrirlo en tu editor, revisar la estructura de archivos, modificar secciones, cambiar estilos y aprender viendo codigo real en funcionamiento.

## Para quien es

- Quien esta empezando y se pierde entre *frontend*, *backend*, *Git*, herramientas, interfaces, deploy, APIs, etc.
- Quien quiere aprender a usar herramientas como Git sin sentirse abrumado.
- Quien prefiere **texto claro**, listas y ejemplos cortos antes que tutoriales infinitos.
- Quien quiere **un mapa** de que existe, por donde empezar y que seguir investigando.
- Quien quiere descargar un proyecto sencillo para leer el codigo, romperlo, arreglarlo y aprender del proceso.

No es un bootcamp: es una **brujula** con apuntes que puedes ampliar tu mismo en el codigo.

## Que incluye

- **Secciones tematicas** (interfaz y submenus: React, Vite, CSS, Bootstrap, Tailwind, TypeScript, accesibilidad; backend, DevOps, Git, herramientas, etc.).
- **Busqueda** en el menu y dentro de cada seccion.
- **Once idiomas** seleccionables desde la barra superior:
  - Completos: **EN** (fuente), **ES**, **FR**, **DE**, **PT**.
  - Parciales (traduccion experimental, las cadenas faltantes caen en ingles): **IT**, **RU**, **JA**, **KO**, **ZH**, **AR** (este ultimo con layout *RTL* automatico).
- **Tres temas de color** (CRT teal, Ember dusk, Void violet) con selector en la barra superior; la preferencia se guarda en el navegador.
- **Arcade de Git** en la seccion Git: minijuegos y un laboratorio de comandos simulados para asociar ordenes con el modelo mental (worktree / index / HEAD).

## Aprender desde el codigo

Ademas de leer la wiki, puedes usar este repositorio como practica:

- Clonarlo en tu computador y ejecutarlo localmente.
- Revisar como se separa el contenido por secciones.
- Ver como funciona la navegacion, los submenus, el buscador y los temas visuales.
- Cambiar textos, colores o componentes para experimentar sin miedo.
- Usarlo como primer proyecto para entender el flujo basico: descargar, instalar dependencias, correr, modificar y volver a probar.

## Como ejecutarlo en local

Requisitos: [Node.js](https://nodejs.org/) (recomendado LTS) y Git instalado.

Clona el repositorio:

```bash
git clone https://github.com/Astrssuy/WIKI-DEV.git
cd WIKI-DEV
```

Instala dependencias y levanta el servidor local:

```bash
npm install
npm run dev
```

Abre la URL que muestre Vite (por defecto `http://localhost:5173`).

Compilacion para produccion:

```bash
npm run build
npm run preview   # sirve la carpeta dist
```

## Traducciones de la wiki

El contenido en ingles vive en `src/locales/source/sections.js`. Para regenerar los JSON traducidos (necesita red):

```bash
npm run i18n:generate
```

Las cadenas de la interfaz estan en `src/locales/ui/*.json` y la lista de idiomas activos se mantiene en `src/locales/registry.js`.

> **Nota sobre idiomas parciales**: IT, RU, JA, KO, ZH y AR todavia no cubren todas las cadenas (sobre todo del *arcade de Git* y del selector de temas). Lo que falte se muestra en ingles gracias al `fallbackLng` de i18next. Si quieres completarlos, anade las claves que faltan tomando como referencia `src/locales/ui/en.json` y regenera las secciones con `npm run i18n:generate`.

## Atajos utiles (en la app)

- `/` - foco en la busqueda del menu
- `f` - filtro dentro de la seccion abierta
- `Esc` - limpiar la busqueda activa
- `1`-`9` - saltar a las entradas **de primer nivel** del menu (en el orden actual filtrado)

## Estructura del proyecto (resumen)

| Ruta | Rol |
|------|-----|
| `src/main.js` | Shell de la app, navegacion, render de bloques |
| `src/style.css` | Estilos y variables por tema |
| `src/themes.js` | Tema activo y `localStorage` |
| `src/i18n.js` | i18next y carga de bundles |
| `src/locales/registry.js` | Registro de idiomas activos (label, `dir`, `partial`) |
| `src/locales/source/sections.js` | Documentacion fuente (EN) |
| `src/locales/ui/*.json` | Cadenas de interfaz por idioma |
| `src/locales/generated/*.json` | Secciones traducidas |
| `src/git-games.js` / `src/git-terminal-sim.js` | Arcade Git |
| `scripts/i18n-generate.mjs` | Script de traduccion |

## Licencia y uso

El proyecto es tuyo de ampliar o adaptar. Si reutilizas bloques de texto o codigo en otro sitio, mencionar la fuente siempre ayuda a quien llega despues.

---

*Hecha como guia personal para acompanar a quien empieza - o para recordar yo mismo por donde iban los conceptos.*
