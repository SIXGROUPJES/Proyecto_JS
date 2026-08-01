// ============================================
// SISTEMA DE MODALES
// ============================================

function obtenerModal(id) {
    return document.getElementById(id);
}

/**
 * Abre un modal quitando la clase 'hidden'.
 *
 * @param {string} id
 */
export function abrirModal(id) {
    const modal = obtenerModal(id);

    if (modal) {
        modal.classList.remove('hidden');
    }
}

/**
 * Cierra un modal agregando la clase 'hidden'.
 *
 * @param {string} id
 */
export function cerrarModal(id) {
    const modal = obtenerModal(id);

    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Cierra todos los modales abiertos.
 */
export function cerrarTodasLasModales() {
    document
        .querySelectorAll('.modal-backdrop:not(.hidden)')
        .forEach((modal) => modal.classList.add('hidden'));
}

/**
 * Configura el comportamiento global de los modales:
 * - Cerrar con el botón que tenga data-cerrar.
 * - Cerrar al hacer clic fuera del modal.
 * - Cerrar con la tecla Escape.
 */
export function configurarModales() {
    document.querySelectorAll('[data-cerrar]').forEach((boton) => {
        boton.addEventListener('click', () => {
            const modal = boton.closest('.modal-backdrop');

            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.addEventListener('click', (evento) => {
            if (evento.target === backdrop) {
                backdrop.classList.add('hidden');
            }
        });
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            cerrarTodasLasModales();
        }
    });
}
