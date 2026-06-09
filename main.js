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
    registrarTarea,
    limpiarTodasLasTareas,
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
            Configurar eventos
        */
        configurarEventos();
        configurarDropdown();

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
        Limpiar tareas
    */
    document
        .getElementById(
            'botonLimpiarTareas'
        )
        .addEventListener(
            'click',
            async function () {

                await limpiarTodasLasTareas();

            }
        );
    /*
        Guardar cambios de la tarea editada - CORREGIDO
        Ely
        */
    document
        .getElementById('formularioEditarTarea')
        .addEventListener('submit', async function (evento) {
            evento.preventDefault();
            
            const id = document.getElementById('editarAsignadaId').value;
            
            // Enviamos únicamente los campos modificados. 
            // json-server mantendrá intactos el usuarioId, tareaId y fechaAsignacion.
            const datosActualizados = {
                titulo: document.getElementById('editarAsignadaTitulo').value.trim(),
                descripcion: document.getElementById('editarAsignadaDescripcion').value.trim(),
                estado: document.getElementById('editarAsignadaEstado').value,
                usuarioNombre: document.getElementById('editarAsignadaUsuario').value.trim()
            };

            try {
                // 1. Importamos el servicio correcto
                const { actualizarTareaAsignada } = await import('./services/tareasAsignadas.service.js');
                await actualizarTareaAsignada(id, datosActualizados);

                // 2. Ocultar la sección de edición tras guardar
                document.getElementById('seccionEditarTareaAsignada').classList.add('hidden');
                
                // 3. RECARGA SEGURA: En lugar de simular el botón limpiar (que borraba todo),
                // importamos de forma dinámica la función que redibuja la tabla de tu compañero
                const { cargarTareasUsuario } = await import('./ui/tareas.ui.js');
                
                // Obtenemos el documento del input para saber a qué usuario recargarle la tabla
                const documentoUsuario = document.getElementById('documentoUsuario').value.trim();
                if (documentoUsuario) {
                    await cargarTareasUsuario(documentoUsuario);
                }

                alert('¡Tarea actualizada correctamente!');
            } catch (error) {
                console.error('Error al actualizar la tarea:', error);
                alert('Ocurrió un error al intentar guardar los cambios.');
            }
        });

    document
        .getElementById('botonCancelarEdicion')
        .addEventListener('click', function () {
            document.getElementById('formularioEditarTarea').reset();
            document.getElementById('seccionEditarTareaAsignada').classList.add('hidden');
        });
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

        return;

    }

    /*
        Mostrar usuario
    */
    mostrarDatosUsuario(
        usuario
    );

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
    await registrarTarea({

        idTarea,
        estado

    });

    /*
        Reiniciar formulario
    */
    document
        .getElementById(
            'formularioTareas'
        )
        .reset();

    /*
        Mensaje
    */
    console.log(
        '✅ Tarea asignada correctamente'
    );
    return false;

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

const boton = document.getElementById('botonAgregarTarea');
if (boton) {
    boton.addEventListener('click', () => {
        abrirPanelAgregar();
    });
}