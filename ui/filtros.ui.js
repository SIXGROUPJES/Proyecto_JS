import { obtenerUsuarios } from '../services/usuarios.service.js';
import { obtenerTareasDisponibles } from '../services/tareasDisponibles.service.js';

export function configurarControlesTareas({ onChange, onExport }) {
    const botonMostrarFiltros = document.getElementById('botonMostrarFiltros');
    const seccionControles = document.getElementById('seccionControlesTareas');
    const tipoFiltro = document.getElementById('tipoFiltro');
    const botonAplicar = document.getElementById('botonAplicarFiltro');
    const botonCancelar = document.getElementById('botonCancelarFiltro');
    const botonExportar = document.getElementById('botonExportarTareas');

    if (botonMostrarFiltros && seccionControles) {
        botonMostrarFiltros.addEventListener('click', () => {
            seccionControles.classList.toggle('hidden');
        });
    }

    if (tipoFiltro) {
        tipoFiltro.addEventListener('change', () => {
            actualizarControlFiltroVisible();
        });
        actualizarControlFiltroVisible();
    }

    cargarOpcionesFiltro();

    if (botonAplicar) {
        botonAplicar.addEventListener('click', () => {
            onChange(obtenerControlesTareas());
        });
    }

    if (botonCancelar) {
        botonCancelar.addEventListener('click', () => {
            restablecerFiltros();
            onChange(obtenerControlesTareas());
            seccionControles?.classList.add('hidden');
        });
    }

    if (botonExportar) {
        botonExportar.addEventListener('click', () => {
            onExport(obtenerControlesTareas());
        });
    }
}

export function obtenerControlesTareas() {
    const tipoFiltro = document.getElementById('tipoFiltro')?.value || 'usuario';
    const filtros = {
        estado: 'Todas',
        usuario: '',
        tarea: ''
    };

    if (tipoFiltro === 'usuario') {
        filtros.usuario = document.getElementById('filtroUsuario')?.value || '';
    }

    if (tipoFiltro === 'estado') {
        filtros.estado = document.getElementById('filtroEstado')?.value || 'Todas';
    }

    if (tipoFiltro === 'tarea') {
        filtros.tarea = document.getElementById('filtroTarea')?.value || '';
    }

    return {
        filtros,
        orden: document.getElementById('ordenTareas')?.value || 'fecha'
    };
}

function actualizarControlFiltroVisible() {
    const tipoFiltro = document.getElementById('tipoFiltro')?.value || 'usuario';

    document.getElementById('controlFiltroUsuario')
        ?.classList.toggle('hidden', tipoFiltro !== 'usuario');

    document.getElementById('controlFiltroEstado')
        ?.classList.toggle('hidden', tipoFiltro !== 'estado');

    document.getElementById('controlFiltroTarea')
        ?.classList.toggle('hidden', tipoFiltro !== 'tarea');
}

async function cargarOpcionesFiltro() {
    await Promise.all([
        cargarUsuariosFiltro(),
        cargarTareasFiltro()
    ]);
}

async function cargarUsuariosFiltro() {
    const selector = document.getElementById('filtroUsuario');

    if (!selector) {
        return;
    }

    try {
        const usuarios = await obtenerUsuarios();

        selector.innerHTML = '<option value="">Todos los usuarios</option>';

        usuarios.forEach((usuario) => {
            const opcion = document.createElement('option');
            opcion.value = usuario.id;
            opcion.textContent = `${usuario.name} (${usuario.id})`;
            selector.appendChild(opcion);
        });
    } catch (error) {
        console.error('Error al cargar usuarios para filtros:', error);
    }
}

async function cargarTareasFiltro() {
    const selector = document.getElementById('filtroTarea');

    if (!selector) {
        return;
    }

    try {
        const tareas = await obtenerTareasDisponibles();

        selector.innerHTML = '<option value="">Todas las tareas</option>';

        tareas.forEach((tarea) => {
            const opcion = document.createElement('option');
            opcion.value = tarea.titulo;
            opcion.textContent = tarea.titulo;
            selector.appendChild(opcion);
        });
    } catch (error) {
        console.error('Error al cargar tareas para filtros:', error);
    }
}

function restablecerFiltros() {
    const tipoFiltro = document.getElementById('tipoFiltro');
    const filtroUsuario = document.getElementById('filtroUsuario');
    const filtroEstado = document.getElementById('filtroEstado');
    const filtroTarea = document.getElementById('filtroTarea');
    const ordenTareas = document.getElementById('ordenTareas');

    if (tipoFiltro) {
        tipoFiltro.value = 'usuario';
    }

    if (filtroUsuario) {
        filtroUsuario.value = '';
    }

    if (filtroEstado) {
        filtroEstado.value = 'Todas';
    }

    if (filtroTarea) {
        filtroTarea.value = '';
    }

    if (ordenTareas) {
        ordenTareas.value = 'fecha';
    }

    actualizarControlFiltroVisible();
}
