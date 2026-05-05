/**
 * Fuente Ãºnica de la wiki (inglÃ©s). Cada secciÃ³n vive en su propio archivo
 * dentro de ./sections/ para facilitar aÃ±adir/quitar capÃ­tulos.
 * Regenera el resto con: npm run i18n:generate
 */
import { inicioSection } from "./sections/inicio.js";
import { interfaceSections } from "./sections/interface.js";
import { backendSection } from "./sections/backend.js";
import { databasesSection } from "./sections/backend-databases.js";
import { apisSection } from "./sections/backend-apis.js";
import { devopsSection } from "./sections/devops.js";
import { gitSection } from "./sections/git.js";
import { herramientasSection } from "./sections/herramientas.js";

export const sections = [
  inicioSection,
  ...interfaceSections,
  backendSection,
  databasesSection,
  apisSection,
  devopsSection,
  gitSection,
  herramientasSection,
];
