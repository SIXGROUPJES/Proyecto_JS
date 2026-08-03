// ============================================
// UTILIDAD: ORDENAMIENTO DE TAREAS
// ============================================
// Tabla de comparadores: cada criterio tiene una función que
// recibe dos tareas y devuelve la diferencia para ordenarlas.
const ORDENADORES = {
    // Más recientes primero (de mayor a menor fecha).
    fecha: (a, b) =>
        new Date(b.fechaAsignacion || 0) - new Date(a.fechaAsignacion || 0),

    // Alfabético por nombre de usuario (con soporte de acentos).
    nombre: (a, b) =>
        String(a.usuarioNombre || '')
            .localeCompare(String(b.usuarioNombre || ''), 'es'),

    // Alfabético por estado.
    estado: (a, b) =>
        String(a.estado || '')
            .localeCompare(String(b.estado || ''), 'es')
};

// Ordena una copia de las tareas según el criterio (por defecto fecha).
export function ordenarTareas(tareas, criterio = 'fecha') {
    const ordenar = ORDENADORES[criterio] || ORDENADORES.fecha;

    return [...tareas].sort(ordenar);
}
