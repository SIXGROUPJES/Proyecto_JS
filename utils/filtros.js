export function filtrarTareas(tareas, filtros = {}) {
    const estado = normalizar(filtros.estado);
    const usuario = normalizar(filtros.usuario);

    return tareas.filter((tarea) => {
        const coincideEstado =
            !estado ||
            estado === 'todas' ||
            normalizar(tarea.estado) === estado;

        const coincideUsuario =
            !usuario ||
            normalizar(tarea.usuarioNombre).includes(usuario) ||
            normalizar(tarea.usuarioId).includes(usuario);

        return coincideEstado && coincideUsuario;
    });
}

function normalizar(valor) {
    return String(valor ?? '')
        .trim()
        .toLowerCase();
}
