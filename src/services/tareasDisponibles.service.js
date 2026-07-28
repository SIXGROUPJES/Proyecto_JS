import { API_URL } from '../config/api.config.js';

const URL = `${API_URL}/tareas/disponibles`;

export async function obtenerTareasDisponibles() {
    const respuesta = await fetch(URL);

    if (!respuesta.ok) {
        throw new Error('Error al cargar tareas disponibles');
    }

    const tareas = await respuesta.json();
    return tareas;
}

export async function crearTareaDisponible(tarea) {
    const respuesta = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarea)
    });

    return respuesta;
}

export async function actualizarTareaDisponible(id, datos) {
    const respuesta = await fetch(`${URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    return respuesta;
}

export async function eliminarTareaDisponible(id) {
    const respuesta = await fetch(`${URL}/${id}`, {
        method: 'DELETE'
    });

    return respuesta;
}
