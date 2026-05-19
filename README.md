# DEV.wiki — guía retro para quien empieza a programar

Esta página la hice como **referencia y orientación** para personas que están **comenzando en el mundo del desarrollo** y necesitan un sitio donde consultar ideas ordenadas, sin sustituir a la documentación oficial ni a un curso completo. Es una wiki modular con aspecto de terminal retro (CRT): pensada para leer poco a poco, buscar por tema y practicar un poco con el teclado.

## ¿Para quién es?

- Quien está empezando y se pierde entre *frontend*, *backend*, *Git*, herramientas, etc.
- Quien prefiere **texto claro**, listas y ejemplos cortos antes que tutoriales infinitos.
- Quien quiere **un mapa** de “qué existe” y por dónde seguir investigando.

No es un bootcamp: es una **brújula** con apuntes que puedes ampliar tú mismo en el código.

## Qué incluye

- **Secciones temáticas** (interfaz y submenús: React, Vite, CSS, Bootstrap, Tailwind, TypeScript, accesibilidad; backend, DevOps, Git, herramientas, etc.).
- **Búsqueda** en el menú y dentro de cada sección.
- **Once idiomas** seleccionables desde la barra superior:
  - Completos: **EN** (fuente), **ES**, **FR**, **DE**, **PT**.
  - Parciales (traducción experimental, las cadenas faltantes caen en inglés): **IT**, **RU**, **JA**, **KO**, **ZH**, **AR** (este último con layout *RTL* automático).
- **Tres temas de color** (CRT teal, Ember dusk, Void violet) con selector en la barra superior; la preferencia se guarda en el navegador.
- **Arcade de Git** en la sección Git: minijuegos y un laboratorio de comandos simulados para asociar órdenes con el modelo mental (worktree / index / HEAD).

## Cómo ejecutarlo en local

Requisitos: [Node.js](https://nodejs.org/) (recomendado LTS).

```bash
npm install
npm run dev
```

Abre la URL que muestre Vite (por defecto `http://localhost:5173`).

Compilación para producción:

```bash
npm run build
npm run preview   # sirve la carpeta dist
```

## Traducciones de la wiki

El contenido en inglés vive en `src/locales/source/sections.js`. Para regenerar los JSON traducidos (necesita red):

```bash
npm run i18n:generate
```

Las cadenas de la interfaz están en `src/locales/ui/*.json` y la lista de idiomas activos se mantiene en `src/locales/registry.js`.

> **Nota sobre idiomas parciales**: IT, RU, JA, KO, ZH y AR todavía no cubren todas las cadenas (sobre todo del *arcade de Git* y del selector de temas). Lo que falte se muestra en inglés gracias al `fallbackLng` de i18next. Si quieres completarlos, añade las claves que faltan tomando como referencia `src/locales/ui/en.json` y regenera las secciones con `npm run i18n:generate`.

## Atajos útiles (en la app)

- `/` — foco en la búsqueda del menú  
- `f` — filtro dentro de la sección abierta  
- `Esc` — limpiar la búsqueda activa  
- `1`–`9` — saltar a las entradas **de primer nivel** del menú (en el orden actual filtrado)

## Estructura del proyecto (resumen)

| Ruta | Rol |
|------|-----|
| `src/main.js` | Shell de la app, navegación, render de bloques |
| `src/style.css` | Estilos y variables por tema |
| `src/themes.js` | Tema activo y `localStorage` |
| `src/i18n.js` | i18next y carga de bundles |
| `src/locales/registry.js` | Registro de idiomas activos (label, `dir`, `partial`) |
| `src/locales/source/sections.js` | Documentación fuente (EN) |
| `src/locales/ui/*.json` | Cadenas de interfaz por idioma |
| `src/locales/generated/*.json` | Secciones traducidas |
| `src/git-games.js` / `src/git-terminal-sim.js` | Arcade Git |
| `scripts/i18n-generate.mjs` | Script de traducción |

## Licencia y uso

El proyecto es tuyo de ampliar o adaptar. Si reutilizas bloques de texto o código en otro sitio, mencionar la fuente siempre ayuda a quien llega después.

---

*Hecha como guía personal para acompañar a quien empieza — o para recordar yo mismo por dónde iban los conceptos.*
