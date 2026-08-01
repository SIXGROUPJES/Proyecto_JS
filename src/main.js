// ============================================
// IMPORTACIONES
// ============================================
import {
    buscarUsuario,
} from './services/usuarios.service.js';

// ============================================
import {
    mostrarDatosUsuario,
    cargarTareasDisponibles,
    cargarTareasUsuario,
    registrarTarea,
    borrarTodasLasTareas,
    configurarEdicionTareaAsignada,
    cerrarPanel,
    abrirPanelEditar,
    abrirPanelAgregar

} from './ui/tareas.ui.js';

// ============================================
import {

    mostrarError,
    limpiarError,
    validarCampoVacio

} from './ui/formularios.ui.js';

// ============================================

import {
    crearTareaDisponible,
} from './services/tareasDisponibles.service.js';

import {
    obtenerTodasLasTareasAsignadas
} from './services/tareasAsignadas.service.js';

// ============================================
import { 
    notificarExito, notificarError 
} from './ui/notificaciones.ui.js';

import {
    configurarControlesTareas,
    obtenerControlesTareas
} from './ui/filtros.ui.js';

import {
    aplicarVistaTareas,
    obtenerTareasVisibles,
    renderizarVistaFiltrada
} from './ui/tareasTabla.ui.js';

import {
    exportarJson
} from './utils/exportador.js';

import {
    inicializarAdministracionUsuarios
} from './ui/usuarios.ui.js';

import {
    abrirModal,
    cerrarModal,
    configurarModales,
    cerrarTodasLasModales
} from './ui/modales.ui.js';


// ============================================
// NAVEGACIÓN POR TABS
// ============================================

function inicializarTabs() {
    var tabButtons = document.querySelectorAll('.tab-btn');
    var tabGroups = {
        usuarios: ['.usuario-admin'],
        tareas: [
            '.seccion-busqueda-usuario',
            '#seccionDatosUsuario',
            '.seccion-tabla-tareas'
        ]
    };

    function activarTab(tabName) {
        tabButtons.forEach(function (btn) {
            var isActive = btn.dataset.tab === tabName;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        document.querySelectorAll('.contenedor-principal > section').forEach(function (s) {
            s.classList.add('tab-hidden');
        });

        var selectors = tabGroups[tabName] || [];
        selectors.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                el.classList.remove('tab-hidden');
            });
        });

        cerrarTodasLasModales();
    }

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            activarTab(btn.dataset.tab);
        });
    });

    activarTab('usuarios');
}


// ============================================
// BOTÓN VOLVER ARRIBA
// ============================================

function configurarBotonSubir() {
    const boton = document.getElementById('botonSubir');

    if (!boton) {
        return;
    }

    window.addEventListener(
        'scroll',
        function () {
            boton.classList.toggle('visible', window.scrollY > 400);
        },
        { passive: true }
    );

    boton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Esperar a que el DOM cargue
 */
document.addEventListener(

    'DOMContentLoaded',

    function () {

        console.log(
            '✅ DOM completamente cargado'
        );

        console.log(
            '📝 Sistema de asignación de tareas iniciado');

        /*
            Inicializar tabs de navegación
        */
        inicializarTabs();
        configurarBotonSubir();
        configurarModales();

        /*
            Configurar eventos
        */
        configurarEventos();
        configurarDropdown();
        configurarControlesTareas({
            onChange: manejarAplicacionFiltros,
            onCancel: manejarCancelacionFiltros,
            onExport: manejarExportacionTareas
        });

        try {
            inicializarAdministracionUsuarios();
        } catch (error) {
            console.error(
                'No fue posible iniciar la administración de usuarios:',
                error
            );
        }

    }

);


// ============================================
// CONFIGURAR EVENTOS
// ============================================

/**
 * Configurar todos los eventos
 */
function configurarEventos() {

    /*
        Buscar usuario
    */
    document
        .getElementById(
            'formularioBusquedaUsuario'
        )
        .addEventListener(
            'submit',
            manejarBusquedaUsuario
        );

    /*
        Registrar tarea
    */
    document
        .getElementById(
            'formularioTareas'
        )
        .addEventListener(
            'submit',
            async function (evento) {

                evento.preventDefault();

                console.log(
                    '🚀 FORMULARIO DETECTADO');


                await manejarRegistroTarea(evento);

            }
        );

    /*
        Borrar tareas
    */
    document
        .getElementById(
            'botonBorrarTareas'
        )
        .addEventListener(
            'click',
            async function () {

                await borrarTodasLasTareas();

            }
        );

    /*
        Abrir modal de asignación de tarea
    */
    document
        .getElementById(
            'botonAsignarTarea'
        )
        .addEventListener(
            'click',
            function () {

                const formulario =
                    document.getElementById(
                        'formularioTareas'
                    );

                formulario.reset();

                document.getElementById(
                    'dropdownTexto'
                ).textContent = '-- Selecciona una tarea --';

                document.getElementById(
                    'selectorTareas'
                ).value = '';

                limpiarError(
                    document.getElementById(
                        'errorSelectorTareas'
                    )
                );

                limpiarError(
                    document.getElementById(
                        'errorEstadoTarea'
                    )
                );

                abrirModal('modalAsignarTarea');
                cargarTareasDisponibles();
            }
        );

    /*
        Abrir modal de nueva tarea
    */
    document
        .getElementById(
            'botonNuevaTarea'
        )
        .addEventListener(
            'click',
            function () {

                document.getElementById(
                    'formularioNuevaTarea'
                ).reset();

                abrirModal('modalNuevaTarea');
            }
        );

    /*
        Registrar nueva tarea disponible
    */
    document
        .getElementById(
            'formularioNuevaTarea'
        )
        .addEventListener(
            'submit',
            async function (evento) {

                evento.preventDefault();

                const titulo =
                    document.getElementById(
                        'nuevaTareaTitulo'
                    ).value.trim();

                const descripcion =
                    document.getElementById(
                        'nuevaTareaDescripcion'
                    ).value.trim();

                if (
                    !validarCampoVacio(
                        titulo
                    )
                ) {
                    notificarError(
                        'El título de la tarea es obligatorio.'
                    );

                    return;
                }

                try {

                    const respuesta =
                        await crearTareaDisponible({
                            titulo,
                            descripcion
                        });

                    if (!respuesta.ok) {
                        throw new Error(
                            'Error al crear la tarea'
                        );
                    }

                    cerrarModal('modalNuevaTarea');
                    this.reset();
                    await cargarTareasDisponibles();

                    notificarExito(
                        'Tarea creada correctamente.'
                    );

                } catch (error) {

                    console.error(
                        'Error al crear la tarea:',
                        error
                    );

                    notificarError(
                        'No se pudo crear la tarea.'
                    );

                }

            }
        );

    /*
        Edición de tarea asignada
    */
    configurarEdicionTareaAsignada();
}


// ============================================
// BUSCAR USUARIO
// ============================================

/**
 * Manejar búsqueda usuario
 * 
 * @param {Event} evento
 */
async function manejarBusquedaUsuario(evento) {

    /*
        Evitar recarga
    */
    evento.preventDefault();

    /*
        Obtener documento
    */
    const documentoUsuario =
        document.getElementById(
            'documentoUsuario'
        ).value.trim();

    /*
        Obtener elemento error
    */
    const elementoError =
        document.getElementById(
            'errorDocumentoUsuario'
        );

    /*
        Validar campo
    */
    if (
        !validarCampoVacio(
            documentoUsuario
        )
    ) {

        mostrarError(
            elementoError,
            'El documento es obligatorio'
        );

        return;

    }

    /*
        Limpiar error
    */
    limpiarError(
        elementoError
    );

    /*
        Buscar usuario
    */
    const usuario =
        await buscarUsuario(
            documentoUsuario
        );

    /*
        Verificar usuario
    */
    if (!usuario) {

        mostrarError(
            elementoError,
            'Usuario no encontrado'
        );

        // Agregar notificación de error
        notificarError('No se encontró ningún usuario con ese documento.');

        return;

    }

    /*
        Mostrar usuario
    */
    mostrarDatosUsuario(
        usuario
    );
    // Agregar notificación de éxito
    notificarExito(`Usuario "${usuario.name}" cargado correctamente.`);
}


// ============================================
// REGISTRAR TAREA
// ============================================

/**
 * Manejar registro tarea
 * 
 * @param {Event} evento
 */
async function manejarRegistroTarea(evento) {

    /*
        Evitar recarga
    */
    evento.preventDefault();

    /*
        Obtener valores
    */
    const idTarea =
        document.getElementById(
            'selectorTareas'
        ).value;

    const estado =
        document.getElementById(
            'estadoTarea'
        ).value;

    /*
        Elementos error
    */
    const errorTarea =
        document.getElementById(
            'errorSelectorTareas'
        );

    const errorEstado =
        document.getElementById(
            'errorEstadoTarea'
        );

    /*
        Variable validación
    */
    let formularioValido = true;

    /*
        Validar tarea
    */
    if (
        !validarCampoVacio(
            idTarea
        )
    ) {

        mostrarError(
            errorTarea,
            'Selecciona una tarea'
        );

        formularioValido = false;

    } else {

        limpiarError(
            errorTarea
        );

    }

    /*
        Validar estado
    */
    if (
        !validarCampoVacio(
            estado
        )
    ) {

        mostrarError(
            errorEstado,
            'Selecciona un estado'
        );

        formularioValido = false;

    } else {

        limpiarError(
            errorEstado
        );

    }

    /*
        Verificar validación
    */
    if (!formularioValido) {

        return;

    }

    /*
        Registrar tarea
    */
    const tareaAsignada = await registrarTarea({

        idTarea,
        estado

    });

    if (!tareaAsignada) {
        notificarError(
            'No se pudo asignar la tarea.'
        );

        return;
    }

    /*
        Reiniciar formulario
    */
    document
        .getElementById(
            'formularioTareas'
        )
        .reset();

    cerrarModal('modalAsignarTarea');

    /*
        Mensaje
    */
    console.log(
        '✅ Tarea asignada correctamente'
    );

    notificarExito(
        'Tarea asignada correctamente.'
    );

    return false;

}

function manejarExportacionTareas() {
    aplicarVistaTareas(
        obtenerControlesTareas()
    );

    const tareasVisibles = obtenerTareasVisibles();

    if (tareasVisibles.length === 0) {
        notificarError(
            'No hay tareas para exportar.'
        );

        return;
    }

    exportarJson(
        'tareas-visibles.json',
        tareasVisibles
    );

    notificarExito(
        'Tareas visibles exportadas correctamente.'
    );
}

async function manejarAplicacionFiltros(vista) {
    try {
        const tareasGlobales = await obtenerTodasLasTareasAsignadas();

        renderizarVistaFiltrada(
            tareasGlobales,
            vista,
            () => manejarAplicacionFiltros(vista)
        );
    } catch (error) {
        console.error('Error al aplicar filtros:', error);
        notificarError('No se pudieron aplicar los filtros.');
    }
}

async function manejarCancelacionFiltros() {
    await cargarTareasUsuario();
}

// DROPDOWN PERSONALIZADO
async function configurarDropdown() {
    const cabecera = document.getElementById('dropdownCabecera');
    const lista    = document.getElementById('listaTareasDisponibles');

    if (!cabecera || !lista) {
        return;
    }

    cabecera.addEventListener('click', function (e) {
        e.stopPropagation();
        lista.classList.toggle('abierto');
    });

    document.addEventListener('click', function () {
        lista.classList.remove('abierto');
    });

    lista.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}
// BOTON AGREGAR TAREAS

const boton = document.getElementById('panelBotonAgregarTarea');
if (boton) {
    boton.addEventListener('click', () => {
        abrirPanelAgregar();
    });
}
