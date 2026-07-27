const JSON_SERVER_URL = 'http://127.0.0.1:3000';
const USUARIOS_URL = `${JSON_SERVER_URL}/usuarios`;
const TAREAS_ASIGNADAS_URL = `${JSON_SERVER_URL}/tareasAsignadas`;

export class JsonServerNoDisponibleError extends Error {
    constructor() {
        super('JSON Server no está disponible');
        this.name = 'JsonServerNoDisponibleError';
    }
}

async function solicitar(url, opciones) {
    let respuesta;

    try {
        respuesta = await fetch(url, opciones);
    } catch (error) {
        throw new JsonServerNoDisponibleError();
    }

    return respuesta;
}

async function leerJson(respuesta) {
    const texto = await respuesta.text();
    return texto ? JSON.parse(texto) : null;
}

export async function obtenerTodos() {
    const respuesta = await solicitar(USUARIOS_URL);

    if (!respuesta.ok) {
        throw new Error('No fue posible obtener los usuarios');
    }

    return leerJson(respuesta);
}

export async function obtenerPorId(id) {
    const respuesta = await solicitar(
        `${USUARIOS_URL}/${encodeURIComponent(String(id))}`
    );

    if (respuesta.status === 404) {
        return null;
    }

    if (!respuesta.ok) {
        throw new Error('No fue posible obtener el usuario');
    }

    return leerJson(respuesta);
}

export async function crear(usuario) {
    const respuesta = await solicitar(USUARIOS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    });

    if (!respuesta.ok) {
        throw new Error('No fue posible crear el usuario');
    }

    return leerJson(respuesta);
}

export async function actualizar(id, usuario) {
    const respuesta = await solicitar(
        `${USUARIOS_URL}/${encodeURIComponent(String(id))}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        }
    );

    if (respuesta.status === 404) {
        return null;
    }

    if (!respuesta.ok) {
        throw new Error('No fue posible actualizar el usuario');
    }

    return leerJson(respuesta);
}

export async function eliminar(id) {
    const respuesta = await solicitar(
        `${USUARIOS_URL}/${encodeURIComponent(String(id))}`,
        {
            method: 'DELETE'
        }
    );

    if (respuesta.status === 404) {
        return false;
    }

    if (!respuesta.ok) {
        throw new Error('No fue posible eliminar el usuario');
    }

    return true;
}

export async function obtenerTareasAsignadasPorUsuario(id) {
    const parametros = new URLSearchParams({
        usuarioId: String(id)
    });
    const respuesta = await solicitar(
        `${TAREAS_ASIGNADAS_URL}?${parametros.toString()}`
    );

    if (!respuesta.ok) {
        throw new Error('No fue posible consultar las tareas asignadas');
    }

    return leerJson(respuesta);
}
