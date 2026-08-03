// ============================================
// SERVICIO: TAREAS DISPONIBLES (CATÁLOGO)
// ============================================
// Capa de comunicación con la API para el catálogo de tareas
// (las tareas que existen para asignar a los usuarios).
// Cada función hace un fetch al backend y devuelve la respuesta.
import { API_URL } from '../config/api.config.js';

const URL = `${API_URL}/tareas/disponibles`;

// Listar todas las tareas del catálogo.
export async function obtenerTareasDisponibles() {
    const respuesta = await fetch(URL);

    if (!respuesta.ok) {
        throw new Error('Error al cargar tareas disponibles');
    }

    const tareas = await respuesta.json();
    return tareas;
}

// Registrar una nueva tarea en el catálogo.
export async function crearTareaDisponible(tarea) {
    const respuesta = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarea)
    });

    return respuesta;
}

// Editar una tarea del catálogo (PATCH = actualización parcial).
export async function actualizarTareaDisponible(id, datos) {
    const respuesta = await fetch(`${URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    return respuesta;
}

// Eliminar una tarea del catálogo.
export async function eliminarTareaDisponible(id) {
    const respuesta = await fetch(`${URL}/${id}`, {
        method: 'DELETE'
    });

    return respuesta;
}
