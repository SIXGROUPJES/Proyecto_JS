// ============================================
// UTILIDAD: FILTRADO DE TAREAS
// ============================================
// Función pura que filtra una lista de tareas según el tipo de
// filtro elegido (fecha, estado o nombre de usuario).
// No toca el DOM: solo recibe datos y devuelve los que coinciden.

export function filtrarTareas(tareas, filtros = {}) {
    const tipo = normalizar(filtros.tipo);

    // Sin tipo de filtro se devuelven todas las tareas.
    if (!tipo) {
        return tareas;
    }

    return tareas.filter((tarea) => {
        if (tipo === 'fecha') {
            return coincideFecha(
                tarea.fechaAsignacion,
                filtros.fechaDesde,
                filtros.fechaHasta
            );
        }

        if (tipo === 'estado') {
            return coincideEstado(tarea.estado, filtros.estado);
        }

        if (tipo === 'nombre') {
            return coincideNombre(tarea.usuarioNombre, filtros.nombre);
        }

        return true;
    });
}

// Compara solo la parte de fecha (YYYY-MM-DD) contra el rango indicado.
function coincideFecha(fechaAsignacion, desde, hasta) {
    const fecha = String(fechaAsignacion ?? '').slice(0, 10);

    if (!fecha) {
        return false;
    }

    if (desde && fecha < desde) {
        return false;
    }

    if (hasta && fecha > hasta) {
        return false;
    }

    return true;
}

// Compara el estado; "Todas" o vacío devuelven true (no filtra).
function coincideEstado(estado, estadoFiltro) {
    const estadoNormalizado = normalizar(estadoFiltro);

    return (
        !estadoNormalizado ||
        estadoNormalizado === 'todas' ||
        normalizar(estado) === estadoNormalizado
    );
}

// Compara el nombre del usuario; la búsqueda es parcial (includes)
// e insensible a mayúsculas.
function coincideNombre(usuarioNombre, nombreFiltro) {
    const nombre = String(nombreFiltro ?? '').trim().toLowerCase();

    return (
        !nombre ||
        String(usuarioNombre ?? '')
            .trim()
            .toLowerCase()
            .includes(nombre)
    );
}

// Normaliza un texto: lo convierte a minúsculas y le quita los espacios.
function normalizar(valor) {
    return String(valor ?? '')
        .trim()
        .toLowerCase();
}
