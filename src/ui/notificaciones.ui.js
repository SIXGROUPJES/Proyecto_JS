// ============================================
// NOTIFICACIONES FLOTANTES
// ============================================
// Muestra avisos temporales en el contenedor #mensajeSistema.
// La notificación desaparece sola después de 4 segundos.
function mostrarNotificacion(mensaje, tipo = 'info') {
    const contenedor = document.getElementById('mensajeSistema');

    if (!contenedor) {
        return;
    }

    // Inserta el texto y resetea las clases CSS.
    contenedor.textContent = mensaje;
    contenedor.className = '';
    contenedor.classList.add('notificacion', tipo);

    // Auto-eliminación del aviso.
    setTimeout(() => {
        contenedor.textContent = '';
        contenedor.className = '';
    }, 4000);
}

// Aviso de operación exitosa (verde).
export function notificarExito(mensaje) {
    mostrarNotificacion(mensaje, 'exito');
}

// Aviso de error (rojo).
export function notificarError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

// Aviso informativo (azul).
export function notificarInfo(mensaje) {
    mostrarNotificacion(mensaje, 'info');
}
