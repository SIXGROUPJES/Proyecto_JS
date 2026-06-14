export function configurarControlesTareas({ onChange, onExport }) {
    const filtroEstado = document.getElementById('filtroEstado');
    const filtroUsuario = document.getElementById('filtroUsuario');
    const ordenTareas = document.getElementById('ordenTareas');
    const botonExportar = document.getElementById('botonExportarTareas');

    [filtroEstado, filtroUsuario, ordenTareas].forEach((control) => {
        if (!control) {
            return;
        }

        control.addEventListener('input', () => {
            onChange(obtenerControlesTareas());
        });

        control.addEventListener('change', () => {
            onChange(obtenerControlesTareas());
        });
    });

    if (botonExportar) {
        botonExportar.addEventListener('click', () => {
            onExport(obtenerControlesTareas());
        });
    }
}

export function obtenerControlesTareas() {
    return {
        filtros: {
            estado: document.getElementById('filtroEstado')?.value || 'Todas',
            usuario: document.getElementById('filtroUsuario')?.value || ''
        },
        orden: document.getElementById('ordenTareas')?.value || 'fecha'
    };
}
