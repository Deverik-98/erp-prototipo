/** Marca y datos de sesión demo (prototipo). */
export const APP_NAME = "DemoApp";
export const APP_TAGLINE = "Sistema de gestión";

export const SESSION_DISPLAY_NAME = "Epacheco";
export const SESSION_EMAIL = "pachecoerikson@gmail.com";
export const SESSION_INITIALS = "EP";

/** Placeholders de formularios de ejemplo */
export const PLACEHOLDER_FULL_NAME = "Erikson Pacheco";
export const PLACEHOLDER_EMAIL = "pachecoerikson@gmail.com";

export function logoUrl(): string {
  return `${import.meta.env.BASE_URL}demoapp-logo.svg`;
}
