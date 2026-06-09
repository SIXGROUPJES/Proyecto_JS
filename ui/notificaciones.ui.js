// ============================================
// MÓDULO INDEPENDIENTE DE NOTIFICACIONES (RF03)
// ============================================

/**
 * Muestra un mensaje dinámico en el contenedor del sistema.
 * * @param {string} mensaje - Texto a mostrar.
 * @param {string} tipo - Clase CSS del mensaje ('exito', 'error', 'info').
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const contenedor = document.getElementById('mensajeSistema');
    
    if (!contenedor) {
        console.warn('⚠️ No se encontró el contenedor #mensajeSistema en el DOM.');
        return;
    }

    // Insertar el texto del mensaje
    contenedor.textContent = mensaje;

    // Limpiar clases previas para evitar conflictos de estilos
    contenedor.className = '';

    // Añadir la clase base del sistema de notificaciones y el tipo específico
    contenedor.classList.add('notificacion-activa', tipo);

    // Desaparecer automáticamente después de 4 segundos
    setTimeout(() => {
        contenedor.textContent = '';
        contenedor.className = '';
    }, 4000);
}

/**
 * Notificación de éxito (Verde)
 * @param {string} mensaje 
 */
export function notificarExito(mensaje) {
    mostrarNotificacion(mensaje, 'exito');
}

/**
 * Notificación de error (Rojo)
 * @param {string} mensaje 
 */
export function notificarError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

/**
 * Notificación de información (Azul/Gris)
 * @param {string} mensaje 
 */
export function notificarInfo(mensaje) {
    mostrarNotificacion(mensaje, 'info');
}