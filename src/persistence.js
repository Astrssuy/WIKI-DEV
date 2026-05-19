/**
 * Persistencia ligera en localStorage para recordar la última sección
 * abierta y el filtro de búsqueda. Se aísla en este módulo para que
 * el resto del código siga viendo el estado como simple lectura/escritura.
 */
const SECTION_KEY = "wiki-active-section";
const SEARCH_KEY = "wiki-search-query";
const EXPANDED_KEY = "wiki-nav-expanded";

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    if (value === null || value === undefined || value === "") {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    /* almacenamiento lleno o privado: ignoramos */
  }
}

export function getLastSection() {
  return safeGet(SECTION_KEY) ?? "";
}

export function saveLastSection(id) {
  safeSet(SECTION_KEY, id);
}

export function getLastSearch() {
  return safeGet(SEARCH_KEY) ?? "";
}

export function saveLastSearch(q) {
  safeSet(SEARCH_KEY, q);
}

/** Grupo desplegado en la barra lateral (solo uno a la vez). */
export function getExpandedGroup() {
  const raw = safeGet(EXPANDED_KEY);
  if (!raw) return "";
  if (raw.startsWith("[")) {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) && arr.length ? String(arr[0]) : "";
    } catch {
      return "";
    }
  }
  return raw;
}

export function saveExpandedGroup(id) {
  safeSet(EXPANDED_KEY, id || "");
}
