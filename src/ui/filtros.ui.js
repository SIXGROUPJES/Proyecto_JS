import { notificarInfo, notificarError, notificarExito } from './notificaciones.ui.js';
import { abrirModal, cerrarModal } from './modales.ui.js';
import { obtenerUsuarios } from '../services/usuarios.service.js';

// Cache de usuarios para el autocompletado por nombre y la resolución
// del usuario al aplicar el filtro.
let usuariosCache = [];

function normalizarTexto(valor) {
    return String(valor ?? '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

async function cargarSugerenciasNombres() {
    const datalist = document.getElementById('listaNombresUsuarios');

    if (!datalist) {
        return;
    }

    try {
        const usuarios = await obtenerUsuarios();
        usuariosCache = Array.isArray(usuarios) ? usuarios : [];

        datalist.innerHTML = '';

        usuariosCache.forEach(usuario => {
            const opcion = document.createElement('option');
            opcion.value = usuario.name;
            datalist.appendChild(opcion);
        });
    } catch (error) {
        console.error('Error al cargar nombres para autocompletar:', error);
        usuariosCache = [];
    }
}

async function resolverUsuarioPorNombre(nombre) {
    if (usuariosCache.length === 0) {
        await cargarSugerenciasNombres();
    }

    const objetivo = normalizarTexto(nombre);

    if (!objetivo) {
        return null;
    }

    return (
        usuariosCache.find(usuario => normalizarTexto(usuario.name) === objetivo) ||
        usuariosCache.find(usuario => normalizarTexto(usuario.name).includes(objetivo)) ||
        null
    );
}

export function configurarControlesTareas({ onChange, onCancel, onExport, onUsuarioEncontrado }) {
    const botonMostrarFiltros = document.getElementById('botonMostrarFiltros');
    const botonAplicar = document.getElementById('botonAplicarFiltro');
    const botonCancelar = document.getElementById('botonCancelarFiltro');
    const botonExportar = document.getElementById('botonExportarTareas');
    const filtroTipo = document.getElementById('filtroTipo');

    if (botonMostrarFiltros) {
        botonMostrarFiltros.addEventListener('click', () => {
            actualizarVisibilidadFiltros();
            cargarSugerenciasNombres();
            abrirModal('modalFiltrar');
        });
    }

    if (filtroTipo) {
        filtroTipo.addEventListener('change', actualizarVisibilidadFiltros);
    }

    if (botonAplicar) {
        botonAplicar.addEventListener('click', async () => {
            const controles = obtenerControlesTareas();

            // Filtro por nombre: se resuelve el usuario real desde la base
            // de datos (como la búsqueda por documento) y se cargan sus
            // tareas asignadas junto con su información y correo.
            if (controles.filtros.tipo === 'nombre' && controles.filtros.nombre) {
                const usuario = await resolverUsuarioPorNombre(controles.filtros.nombre);

                if (!usuario) {
                    notificarError(
                        `No se encontró ningún usuario con el nombre "${controles.filtros.nombre}".`
                    );
                    return;
                }

                if (typeof onUsuarioEncontrado === 'function') {
                    await onUsuarioEncontrado(usuario);
                }

                cerrarModal('modalFiltrar');
                notificarExito(`Usuario "${usuario.name}" cargado correctamente.`);
                return;
            }

            await onChange(controles);
            cerrarModal('modalFiltrar');
        });
    }

    if (botonCancelar) {
        botonCancelar.addEventListener('click', async () => {
            restablecerFiltros();
            cerrarModal('modalFiltrar');
            if (typeof onCancel === 'function') {
                await onCancel(obtenerControlesTareas());
            } else {
                await onChange(obtenerControlesTareas());
            }
            notificarInfo('Filtros restablecidos.');
        });
    }

    if (botonExportar) {
        botonExportar.addEventListener('click', () => {
            onExport(obtenerControlesTareas());
        });
    }
}

export function obtenerControlesTareas() {
    const tipo = document.getElementById('filtroTipo')?.value || '';
    const filtros = { tipo };

    if (tipo === 'fecha') {
        filtros.fechaDesde = document.getElementById('filtroFechaDesde')?.value || '';
        filtros.fechaHasta = document.getElementById('filtroFechaHasta')?.value || '';
    } else if (tipo === 'estado') {
        filtros.estado = document.getElementById('filtroEstado')?.value || 'Todas';
    } else if (tipo === 'nombre') {
        filtros.nombre = document.getElementById('filtroNombre')?.value.trim() || '';
    }

    return {
        filtros,
        orden: document.getElementById('ordenTareas')?.value || 'fecha'
    };
}

function actualizarVisibilidadFiltros() {
    const tipo = document.getElementById('filtroTipo')?.value || '';

    const controlFecha = document.getElementById('controlFiltroFecha');
    const controlEstado = document.getElementById('controlFiltroEstado');
    const controlNombre = document.getElementById('controlFiltroNombre');

    if (controlFecha) {
        controlFecha.classList.toggle('hidden', tipo !== 'fecha');
    }

    if (controlEstado) {
        controlEstado.classList.toggle('hidden', tipo !== 'estado');
    }

    if (controlNombre) {
        controlNombre.classList.toggle('hidden', tipo !== 'nombre');
    }
}

export function resetearControlesTareas() {
    restablecerFiltros();
}

function restablecerFiltros() {
    const filtroTipo = document.getElementById('filtroTipo');
    const filtroFechaDesde = document.getElementById('filtroFechaDesde');
    const filtroFechaHasta = document.getElementById('filtroFechaHasta');
    const filtroEstado = document.getElementById('filtroEstado');
    const filtroNombre = document.getElementById('filtroNombre');
    const ordenTareas = document.getElementById('ordenTareas');

    if (filtroTipo) {
        filtroTipo.value = '';
    }

    if (filtroFechaDesde) {
        filtroFechaDesde.value = '';
    }

    if (filtroFechaHasta) {
        filtroFechaHasta.value = '';
    }

    if (filtroEstado) {
        filtroEstado.value = 'Todas';
    }

    if (filtroNombre) {
        filtroNombre.value = '';
    }

    if (ordenTareas) {
        ordenTareas.value = 'fecha';
    }

    actualizarVisibilidadFiltros();
}
