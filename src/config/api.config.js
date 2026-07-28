const protocolo = window.location.protocol === 'https:' ? 'https:' : 'http:';
const host = window.location.hostname || 'localhost';
export const API_URL = `${protocolo}//${host}:3001/api`;
