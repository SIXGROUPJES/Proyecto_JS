// ============================================
// CONFIGURACIÓN DE LA API
// ============================================
// URL base del backend: se construye con el mismo protocolo y host
// desde donde se abre la página, apuntando al puerto 3001 donde corre
// el backend Express (endpoints: /api/usuarios, /api/tareas/...).
const protocolo = window.location.protocol === 'https:' ? 'https:' : 'http:';
const host = window.location.hostname || 'localhost';
export const API_URL = `${protocolo}//${host}:3001/api`;
