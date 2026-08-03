// ============================================
// UI: ADMINISTRACIÓN DE USUARIOS
// ============================================
// Maneja la tabla y el formulario del tab "Usuarios":
// registrar, editar y eliminar usuarios usando el servicio
// usuarios.service.js.
import {
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario,
    obtenerUsuarioPorId,
    obtenerUsuariosAdmin
} from '../services/usuarios.service.js';

// Estado interno del módulo.
let idUsuarioEnEdicion = null;
let enviandoFormulario = false;
let cargandoUsuarios = false;

// Referencias al DOM (se llenan en obtenerReferencias).
let formulario;
let campoId;
let campoName;
let campoEmail;
let campoRole;
let botonEnviar;
let botonCancelar;
let mensaje;
let cuerpoTabla;

// ============================================
// REFERENCIAS AL DOM
// ============================================
// Busca todos los elementos del formulario y la tabla; si falta
// alguno, lanza un error claro (evita fallos silenciosos).
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

// ============================================
// AYUDANTES DE RENDERIZADO
// ============================================

// Muestra un mensaje en el área del formulario con estilo por tipo.
function mostrarMensaje(texto, tipo = 'info') {
    mensaje.textContent = texto;
    mensaje.className = 'usuario-admin__mensaje';

    if (texto) {
        mensaje.classList.add(`usuario-admin__mensaje--${tipo}`);
    }
}

// Muestra un mensaje de una sola fila (carga/estado) en la tabla.
function mostrarEstadoTabla(texto) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');

    celda.colSpan = 5;
    celda.textContent = texto;
    fila.appendChild(celda);
    cuerpoTabla.replaceChildren(fila);
}

// Crea una celda con su etiqueta (útil para el responsive).
function crearCelda(texto, etiqueta) {
    const celda = document.createElement('td');
    celda.textContent = texto;

    if (etiqueta) {
        celda.dataset.label = etiqueta;
    }

    return celda;
}

// Traduce el rol de la API a un texto legible.
function obtenerNombreRole(role) {
    return role === 'admin' ? 'Administrador' : 'Usuario';
}

// ============================================
// RENDERIZAR TABLA DE USUARIOS
// ============================================
// Crea una fila por usuario con los botones Editar y Eliminar,
// y los inserta todos juntos usando un DocumentFragment.
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
        celdaAcciones.dataset.label = 'Acciones';
        fila.append(
            crearCelda(String(usuario.id), 'ID'),
            crearCelda(String(usuario.name), 'Nombre'),
            crearCelda(String(usuario.email), 'Correo'),
            crearCelda(obtenerNombreRole(usuario.role), 'Rol'),
            celdaAcciones
        );
        fragmento.appendChild(fila);
    });

    cuerpoTabla.replaceChildren(fragmento);
}

// ============================================
// CARGAR USUARIOS DESDE EL BACKEND
// ============================================
async function cargarUsuarios(mostrarCargaEnMensaje = true) {
    // Evita dobles peticiones mientras una ya está en curso.
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

// ============================================
// MODOS DEL FORMULARIO (CREAR / EDITAR)
// ============================================

// Deja el formulario listo para crear un usuario nuevo.
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

// Carga un usuario por su ID y pone el formulario en modo edición
// (el ID queda de solo lectura y el botón cambia a "Guardar cambios").
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

// ============================================
// ENVÍO DEL FORMULARIO (CREAR O ACTUALIZAR)
// ============================================
async function gestionarFormulario(evento) {
    evento.preventDefault();

    // Evita envíos dobles.
    if (enviandoFormulario) {
        return;
    }

    // Valida los campos nativos del HTML antes de enviar.
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
            // Modo edición: no se envía el ID (no es modificable).
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
            // Modo creación.
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

// Cancela la edición y vuelve al modo creación.
function cancelarEdicion() {
    if (enviandoFormulario) {
        return;
    }

    establecerModoCreacion();
}

// ============================================
// ELIMINAR USUARIO
// ============================================
// Pide confirmación; el backend bloquea el borrado si el usuario
// tiene tareas activas (responde 409 con el detalle de tareas).
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

        // Si se eliminó al usuario que estaba en edición, se resetea el modo.
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
        // 409 = el usuario tiene tareas activas: se muestra aviso de advertencia.
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

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================
// Punto de entrada: obtiene las referencias, conecta los eventos
// del formulario y carga la tabla de usuarios.
export function inicializarAdministracionUsuarios() {
    obtenerReferencias();
    formulario.addEventListener('submit', gestionarFormulario);
    botonCancelar.addEventListener('click', cancelarEdicion);
    cargarUsuarios();
}
