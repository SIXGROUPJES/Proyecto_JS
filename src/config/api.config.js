//configuracion api//
/**
 * este archivo centraliza la url base del servidor json
 */
const protocolo = window.location.protocol === 'https:' ? 'https:' : 'http:';
//detecta el protocolo actual para que funcione tanto en desarrollo como en produccion//
const host = window.location.hostname || 'localhost';
export const API_URL = `${protocolo}//${host}:3001/api`;
