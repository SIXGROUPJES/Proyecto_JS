import {
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario,
    obtenerUsuarioPorId,
    obtenerUsuariosAdmin
} from '../services/usuarios.service.js';

let idUsuarioEnEdicion = null;
let enviandoFormulario = false;
let cargandoUsuarios = false;

let formulario;
let campoId;
let campoName;
let campoEmail;
let campoRole;
let botonEnviar;
let botonCancelar;
let mensaje;
let cuerpoTabla;

function obtenerReferencias() {
    formulario = document.getElementById('usuario-admin-formulario');
    campoId = document.getElementById('usuario-admin-id');
    campoName = document.getElementById('usuario-admin-name');
    campoEmail = document.getElementById('usuario-admin-email');
    campoRole = document.getElementById('usuario-admin-role');
    botonEnviar = document.getElementById('usuario-admin-enviar');
    botonCancelar = document.getElementById('usuario-admin-cancelar');
    mensaje = document.getElementById('usuario-admin-mensaje');
    cuerpoTabla = document.getElementById('usuario-admin-tabla-cuerpo');

    const referencias = [
        formulario,
        campoId,
        campoName,
        campoEmail,
        campoRole,
        botonEnviar,
        botonCancelar,
        mensaje,
        cuerpoTabla
    ];

    if (referencias.some((referencia) => !referencia)) {
        throw new Error(
            'Faltan elementos de la administración de usuarios en el DOM'
        );
    }
}

function mostrarMensaje(texto, tipo = 'info') {
    mensaje.textContent = texto;
    mensaje.className = 'usuario-admin__mensaje';

    if (texto) {
        mensaje.classList.add(`usuario-admin__mensaje--${tipo}`);
    }
}

function mostrarEstadoTabla(texto) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');

    celda.colSpan = 5;
    celda.textContent = texto;
    fila.appendChild(celda);
    cuerpoTabla.replaceChildren(fila);
}

function crearCelda(texto) {
    const celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
}

function obtenerNombreRole(role) {
    return role === 'admin' ? 'Administrador' : 'Usuario';
}

function renderizarUsuarios(usuarios) {
    if (usuarios.length === 0) {
        mostrarEstadoTabla('No hay usuarios registrados.');
        return;
    }

    const fragmento = document.createDocumentFragment();

    usuarios.forEach((usuario) => {
        const fila = document.createElement('tr');
        const celdaAcciones = document.createElement('td');
        const acciones = document.createElement('div');
        const botonEditar = document.createElement('button');
        const botonEliminar = document.createElement('button');

        acciones.className = 'usuario-admin__acciones-tabla';

        botonEditar.type = 'button';
        botonEditar.className = 'usuario-admin__boton-editar';
        botonEditar.textContent = 'Editar';
        botonEditar.addEventListener('click', async () => {
            if (botonEditar.disabled) {
                return;
            }

            botonEditar.disabled = true;

            try {
                await iniciarEdicion(String(usuario.id));
            } finally {
                botonEditar.disabled = false;
            }
        });

        botonEliminar.type = 'button';
        botonEliminar.className = 'usuario-admin__boton-eliminar';
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', async () => {
            await gestionarEliminacion(
                String(usuario.id),
                String(usuario.name),
                botonEliminar
            );
        });

        acciones.append(botonEditar, botonEliminar);
        celdaAcciones.appendChild(acciones);
        fila.append(
            crearCelda(String(usuario.id)),
            crearCelda(String(usuario.name)),
            crearCelda(String(usuario.email)),
            crearCelda(obtenerNombreRole(usuario.role)),
            celdaAcciones
        );
        fragmento.appendChild(fila);
    });

    cuerpoTabla.replaceChildren(fragmento);
}

async function cargarUsuarios(mostrarCargaEnMensaje = true) {
    if (cargandoUsuarios) {
        return;
    }

    cargandoUsuarios = true;
    mostrarEstadoTabla('Cargando usuarios...');

    if (mostrarCargaEnMensaje) {
        mostrarMensaje('Cargando usuarios...', 'info');
    }

    try {
        const usuarios = await obtenerUsuariosAdmin();
        renderizarUsuarios(usuarios);

        if (mostrarCargaEnMensaje) {
            mostrarMensaje('');
        }
    } catch (error) {
        mostrarEstadoTabla('No fue posible cargar los usuarios.');
        mostrarMensaje(
            `No fue posible cargar los usuarios. ${error.message}`,
            'error'
        );
    } finally {
        cargandoUsuarios = false;
    }
}

function establecerModoCreacion({
    limpiarMensaje = true,
    enfocar = true
} = {}) {
    idUsuarioEnEdicion = null;
    formulario.reset();
    campoId.readOnly = false;
    campoRole.value = 'user';
    botonEnviar.textContent = 'Registrar usuario';
    botonCancelar.classList.add('hidden');

    if (limpiarMensaje) {
        mostrarMensaje('');
    }

    if (enfocar) {
        campoId.focus();
    }
}

async function iniciarEdicion(id) {
    mostrarMensaje('Cargando usuario para edición...', 'info');

    try {
        const usuario = await obtenerUsuarioPorId(id);

        idUsuarioEnEdicion = String(usuario.id);
        campoId.value = idUsuarioEnEdicion;
        campoName.value = usuario.name;
        campoEmail.value = usuario.email;
        campoRole.value = usuario.role;
        campoId.readOnly = true;
        botonEnviar.textContent = 'Guardar cambios';
        botonCancelar.classList.remove('hidden');
        mostrarMensaje(`Editando a ${usuario.name}.`, 'info');
        campoName.focus();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

async function gestionarFormulario(evento) {
    evento.preventDefault();

    if (enviandoFormulario) {
        return;
    }

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    enviandoFormulario = true;
    botonEnviar.disabled = true;
    botonCancelar.disabled = true;

    const datos = new FormData(formulario);
    const usuario = {
        id: String(datos.get('id')).trim(),
        name: String(datos.get('name')).trim(),
        email: String(datos.get('email')).trim(),
        role: String(datos.get('role'))
    };
    const editando = idUsuarioEnEdicion !== null;

    try {
        if (editando) {
            mostrarMensaje('Guardando cambios...', 'info');
            await actualizarUsuario(
                idUsuarioEnEdicion,
                {
                    name: usuario.name,
                    email: usuario.email,
                    role: usuario.role
                }
            );
            establecerModoCreacion({
                limpiarMensaje: false,
                enfocar: false
            });
            mostrarMensaje(
                'Usuario actualizado correctamente.',
                'success'
            );
        } else {
            mostrarMensaje('Registrando usuario...', 'info');
            await crearUsuario(usuario);
            establecerModoCreacion({
                limpiarMensaje: false,
                enfocar: false
            });
            mostrarMensaje(
                'Usuario registrado correctamente.',
                'success'
            );
        }

        await cargarUsuarios(false);
        campoId.focus();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    } finally {
        enviandoFormulario = false;
        botonEnviar.disabled = false;
        botonCancelar.disabled = false;
    }
}

function cancelarEdicion() {
    if (enviandoFormulario) {
        return;
    }

    establecerModoCreacion();
}

async function gestionarEliminacion(id, name, botonEliminar) {
    if (botonEliminar.disabled) {
        return;
    }

    const confirmado = window.confirm(
        `¿Deseas eliminar a ${name}?\n\n`
        + 'Si el usuario tiene tareas activas, la eliminación será bloqueada.\n'
        + 'Las tareas completadas se conservarán como historial.'
    );

    if (!confirmado) {
        return;
    }

    botonEliminar.disabled = true;
    mostrarMensaje('Eliminando usuario...', 'info');

    try {
        const mensajeEliminacion = await eliminarUsuario(id);

        if (idUsuarioEnEdicion === id) {
            establecerModoCreacion({
                limpiarMensaje: false,
                enfocar: false
            });
        }

        mostrarMensaje(
            mensajeEliminacion || 'Usuario eliminado correctamente.',
            'success'
        );
        await cargarUsuarios(false);
    } catch (error) {
        if (error.status === 409) {
            const detalleTareas =
                typeof error.tareasActivas === 'number'
                    ? ` Tareas activas: ${error.tareasActivas}.`
                    : '';

            mostrarMensaje(
                `${error.message}${detalleTareas}`,
                'warning'
            );
        } else {
            mostrarMensaje(error.message, 'error');
        }
    } finally {
        if (botonEliminar.isConnected) {
            botonEliminar.disabled = false;
        }
    }
}

export function inicializarAdministracionUsuarios() {
    obtenerReferencias();
    formulario.addEventListener('submit', gestionarFormulario);
    botonCancelar.addEventListener('click', cancelarEdicion);
    cargarUsuarios();
}
