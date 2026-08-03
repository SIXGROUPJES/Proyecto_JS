// ============================================
// SERVICIO: TAREAS ASIGNADAS
// ============================================
// Capa de comunicación con la API para las tareas asignadas
// (la relación usuario <-> tarea con su estado).
import { API_URL } from '../config/api.config.js';

const URL = `${API_URL}/tareas/asignadas`;

// Listar todas las asignaciones del sistema.
export async function obtenerTodasLasTareasAsignadas() {
    const respuesta = await fetch(URL);

    if (!respuesta.ok) {
        throw new Error('Error al cargar tareas asignadas');
    }

    const tareas = await respuesta.json();
    return tareas;
}

// Listar las asignaciones de un usuario concreto (filtro ?usuarioId=).
export async function obtenerTareasAsignadasPorUsuario(usuarioId) {
    const respuesta = await fetch(
        `${URL}?usuarioId=${encodeURIComponent(String(usuarioId))}`
    );

    if (!respuesta.ok) {
        throw new Error('Error al cargar tareas asignadas');
    }

    const tareas = await respuesta.json();
    return tareas;
}

// Asignar una tarea a un usuario (crea la relación).
export async function crearTareaAsignada(tareaAsignada) {
    const respuesta = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tareaAsignada)
    });

    return respuesta;
}

// Eliminar una asignación por su ID.
export async function eliminarTareaAsignada(idTarea) {
    const respuesta = await fetch(`${URL}/${idTarea}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('Error al eliminar tarea');
    }

    return respuesta;
}

// Eliminar TODAS las asignaciones de un usuario:
// primero las consulta y luego las borra una a una.
export async function eliminarTareasAsignadasPorUsuario(usuarioId) {
    const tareas = await obtenerTareasAsignadasPorUsuario(usuarioId);

    for (const tarea of tareas) {
        await eliminarTareaAsignada(tarea.id);
    }
}

// Actualizar una asignación (PATCH = actualización parcial).
export async function actualizarTareaAsignada(idTarea, datosActualizados) {
    const respuesta = await fetch(`${URL}/${idTarea}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
    });

    if (!respuesta.ok) {
        throw new Error('Error al actualizar la tarea asignada');
    }

    return respuesta;
}
