# PROYECTO BASE: Proyecto JS - Software Factory SENA

**Metodología:** *"Del Requerimiento al Producto"*

Este repositorio constituye la base técnica y administrativa para el desarrollo del proyecto. No es solo un contenedor de código, es una simulación de un entorno profesional donde se aplican estándares de calidad, gestión ágil y flujos de trabajo colaborativos reales.

---

## INTRODUCCIÓN Y PROPÓSITO

El objetivo de este proyecto es desarrollar una solución tecnológica funcional, priorizando:

- Arquitectura limpia  
- Código escalable  
- Trazabilidad total  

### El "Por qué" (Justificación)

Dominar el ciclo de vida del software es tan importante como programar. Esta metodología alinea las habilidades técnicas con las exigencias de la industria, garantizando que cada línea de código tenga un propósito claro y demostrable.

---

## CENTRO DE DOCUMENTACIÓN (WIKI DEL PROYECTO)

Antes de escribir la primera línea de código o ejecutar un comando, es obligatorio revisar las guías de trabajo.

### Nivel 1. Sistema  
**Ubicación:** `docs/01-guia-sistema/`  
- Manuales técnicos: creación de Issues y Milestones  

### Nivel 2. Metodología  
**Ubicación:** `docs/02-guia-metodologia/`  
- Reglas para reportar tareas y solicitar revisiones (PR)  

### Nivel 3. Formatos  
**Ubicación:** `docs/03-formatos-maestros/`  
- Plantillas oficiales de documentos  

---

## ROLES DE LA CÉLULA ÁGIL

### Líder (Arquitecto)

- **Responsabilidad:** Integridad del repositorio y control de calidad  
- **Tareas en GitHub:**
  - Protección de ramas  
  - Gestión de Milestones  
  - Aprobación de Pull Requests  

---

### Desarrollador (Albañil)

- **Responsabilidad:** Construcción de módulos y lógica  
- **Tareas en GitHub:**
  - Desarrollo en ramas `feat/`  
  - Reporte de avances  
  - Solicitud de revisión técnica  

---

### El "Por qué"

La división de roles evita duplicidad de tareas y establece una jerarquía clara de responsabilidad (segregación de funciones), esencial en equipos de alto rendimiento.

---

## CONFIGURACIÓN DEL ENTORNO (LOCAL)

Para estandarizar el desarrollo y evitar errores de compatibilidad, sigue estos pasos en tu terminal:

### Instalación

```bash
# Paso 1. Clonar el repositorio
git clone [URL-del-repositorio-grupal]

# Paso 2. Instalar dependencias (en la raíz del frontend)
npm install
```

> El proyecto ya **no usa JSON Server**: los datos viven en una base de datos **MySQL** expuesta por un backend propio (Express) en el puerto `3001`. El frontend se conecta a él a través de `src/config/api.config.js`.

### Comandos

```bash
# Frontend Vite (puerto 5173 por defecto)
npm run dev

# Compilar el proyecto para producción
npm run build

# Previsualizar la compilación
npm run preview
```

### Backend (requisito para que la interfaz funcione)

El frontend consume la API del repositorio backend (`BACKENDLY6/backendly`). Para levantarlo:

```bash
# En el repositorio del backend
npm install
npm run migrate   # crea la base de datos y los datos iniciales
npm run dev       # API disponible en http://localhost:3001
```

La interfaz carga únicamente cuando el backend está corriendo en `http://localhost:3001/api`.

### El "por que"

Estandarizar el entorno asegura la paridad entre las máquinas de todos los colaboradores, erradicando para siempre la excusa de "en mi máquina sí funciona".

## ARQUITECTURA Y ESTRUCTURA DEL PROYECTO

Mantenemos una organización modular para facilitar el mantenimiento:

```
/
├── index.html               # Estructura HTML de la interfaz (una sola página)
├── dist/                    # Compilación de producción (vite build)
├── docs/                    # Guías metodológicas y reportes técnicos
├── src/                     # Código fuente principal
│   ├── config/              # Configuraciones (URL de la API, partículas de fondo)
│   ├── services/            # Lógica de consumo de datos (fetch a la API)
│   ├── styles/              # Estilos globales (main.css)
│   ├── ui/                  # Piezas de interfaz y lógica de presentación
│   ├── utils/               # Utilidades (filtros, ordenamiento, exportador)
│   └── main.js              # Punto de entrada de la aplicación
├── .gitignore               # Archivos que Git debe ignorar
├── package.json             # Dependencias y scripts del proyecto
├── README.md                # Manual principal del repositorio
└── TEAM_AGREEMENT.md        # Acuerdo y normas de convivencia del equipo
```

### Detalle de módulos

| Módulo                      | Función                                                      |
| --------------------------- | ------------------------------------------------------------ |
| `src/config/api.config.js`  | URL base de la API del backend (`http://localhost:3001/api`) |
| `src/services/usuarios.service.js` | CRUD de usuarios contra la API                         |
| `src/services/tareasDisponibles.service.js` | CRUD del catálogo de tareas                   |
| `src/services/tareasAsignadas.service.js`  | CRUD de tareas asignadas                        |
| `src/ui/usuarios.ui.js`     | Administración de usuarios (registrar, editar, eliminar)     |
| `src/ui/tareas.ui.js`       | Asignación de tareas y edición de tareas asignadas           |
| `src/ui/tareasTabla.ui.js`  | Renderizado de la tabla de tareas y vista filtrada           |
| `src/ui/filtros.ui.js`      | Modal de filtros y ordenamiento de tareas                    |
| `src/ui/modales.ui.js`      | Apertura/cierre de modales                                   |
| `src/ui/formularios.ui.js`  | Validación de formularios                                    |
| `src/ui/notificaciones.ui.js` | Notificaciones de éxito/error/información                  |
| `src/utils/filtros.js`      | Lógica de filtrado de tareas                                 |
| `src/utils/ordenamiento.js` | Lógica de ordenamiento                                       |
| `src/utils/exportador.js`   | Exportación de tareas a JSON                                 |

## FUNCIONALIDADES DE LA INTERFAZ

La aplicación es una SPA (una sola página) con navegación por **tabs**:

### Tab "Usuarios"

- Registro de nuevos usuarios (ID/documento, nombre, correo y rol).
- Edición y eliminación de usuarios desde la tabla.
- No se puede eliminar un usuario con tareas activas (regla del backend).

### Tab "Gestión de Tareas"

- **Filtrar Tareas** (arriba de todo): abre el modal de filtros para buscar tareas por fecha, estado o nombre de usuario, con opción de ordenarlas.
- **Crear Nueva Tarea** (justo debajo de "Filtrar Tareas"): abre el modal para registrar una tarea en el catálogo de tareas disponibles.
- **Búsqueda de usuario**: se ingresa el documento y se carga la información del usuario junto con sus tareas asignadas.
- **Asignar Tarea**: botón que solo aparece después de buscar un usuario, para garantizar que la asignación siempre sea a un usuario real.
- **Edición de tareas asignadas**: cambia tarea, usuario, estado o título/descripción desde el modal de edición.
- **Borrar tareas asignadas** y **Exportar JSON** de las tareas visibles.

### Comportamiento de los botones

- El botón **"Crear Nueva Tarea"** solo existe debajo de **"Filtrar Tareas"**, antes de la búsqueda de usuario.
- El botón **"Asignar Tarea"** únicamente se habilita cuando ya se buscó un usuario; si se intenta abrir sin usuario, el sistema muestra una notificación de error.

## METODOLOGÍA DE TRABAJO (GITFLOW PROFESIONAL)

El flujo de trabajo es el corazón de nuestra colaboración.  
Está estrictamente prohibido hacer commits directos sobre las ramas `main` o `develop`.

---

### Paso 1. Sincronizar
Trae los últimos cambios aprobados del equipo:

```bash
git checkout develop
git pull origin develop
```
### Paso 2. Rama de Tarea

Crea un espacio aislado para tu requerimiento:

```bash
git checkout -b feat/nombre-tarea
```

### Paso 3. Desarrollo

Escribe código limpio y realiza commits descriptivos.

### Paso 4. Sincronización Final

Antes de entregar, integra los cambios recientes del equipo para resolver conflictos en tu máquina:

```bash
git checkout develop
git pull origin develop
git checkout feat/nombre-tarea
git merge develop
```

### Paso 5. Solicitud de PR

Sube tu rama y solicita la revisión técnica en GitHub:

```bash
git push origin feat/nombre-tarea
```

### El "Por qué"

Este flujo protege la estabilidad del código base. Si tu código falla, solo falla en tu rama, manteniendo el proyecto principal intacto y siempre funcional.

## BLINDAJE DE RAMAS Y SEGURIDAD

Para garantizar la integridad del producto, el repositorio cuenta con candados de seguridad:

- **Rama `main`:**
  - Representa el estado de producción  
  - Solo recibe código desde `develop` cuando un Milestone (Hito) está al 100%  

- **Restricción de Merge:**
  - El botón de integración está bloqueado para los desarrolladores  
  - Solo el Líder tiene el permiso final tras la revisión  

---

## ESTÁNDARES DE CALIDAD (DEFINITION OF DONE)

Antes de que el Líder apruebe un Pull Request, el desarrollador debe garantizar:

- **Limpieza:**  
  Cero `console.log`, variables sin uso o código comentado (*"por si acaso"*)  

- **Responsive:**  
  El diseño se adapta sin romperse a pantallas móviles  

- **Sincronización:**  
  La rama está actualizada y sin conflictos de merge  

- **Automatización:**  
  La descripción del PR incluye `Closes #ID` para cerrar la tarea  

### El "Por qué"

Un control de calidad preventivo reduce la deuda técnica (errores acumulados) y automatiza el proceso administrativo.

---

## CRITERIOS DE ENTREGA Y EVALUACIÓN

La fase del proyecto se considera exitosa, terminada y lista para calificación únicamente cuando:

- El **Milestone** en GitHub marca el **100%** de progreso  
- Todas las **Issues** del hito están cerradas y vinculadas a un PR aprobado  
- El proyecto está desplegado en vivo (ej. Vercel, GitHub Pages) y funciona sin errores  

### El "Por qué"

En la industria, el software que no está publicado no existe. Esto vincula el resultado técnico con la gestión profesional.

---

## DIRECCIÓN DEL PROYECTO

- **Instructor:** [Tu Nombre Aquí]  
- **Institución:** Servicio Nacional de Aprendizaje (SENA)  
- **Centro:** [Nombre de tu Centro de Formación]  
- **Programa:** Análisis y Desarrollo de Software  

---

Este repositorio es propiedad del equipo de desarrollo y se rige por las políticas de formación profesional integral del SENA.
