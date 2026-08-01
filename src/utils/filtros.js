export function filtrarTareas(tareas, filtros = {}) {
    const tipo = normalizar(filtros.tipo);

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

function coincideEstado(estado, estadoFiltro) {
    const estadoNormalizado = normalizar(estadoFiltro);

    return (
        !estadoNormalizado ||
        estadoNormalizado === 'todas' ||
        normalizar(estado) === estadoNormalizado
    );
}

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

function normalizar(valor) {
    return String(valor ?? '')
        .trim()
        .toLowerCase();
}
