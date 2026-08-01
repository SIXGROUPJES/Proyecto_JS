import { notificarInfo } from './notificaciones.ui.js';
import { abrirModal, cerrarModal } from './modales.ui.js';

export function configurarControlesTareas({ onChange, onCancel, onExport }) {
    const botonMostrarFiltros = document.getElementById('botonMostrarFiltros');
    const botonAplicar = document.getElementById('botonAplicarFiltro');
    const botonCancelar = document.getElementById('botonCancelarFiltro');
    const botonExportar = document.getElementById('botonExportarTareas');
    const filtroTipo = document.getElementById('filtroTipo');

    if (botonMostrarFiltros) {
        botonMostrarFiltros.addEventListener('click', () => {
            actualizarVisibilidadFiltros();
            abrirModal('modalFiltrar');
        });
    }

    if (filtroTipo) {
        filtroTipo.addEventListener('change', actualizarVisibilidadFiltros);
    }

    if (botonAplicar) {
        botonAplicar.addEventListener('click', async () => {
            await onChange(obtenerControlesTareas());
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
