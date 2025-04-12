# Frontend de la Aplicación de Gestión de Tareas

Este es el frontend de la aplicación de gestión de tareas, construido con Vite + React . Se comunica con una API REST para la gestión de las tareas.

## Rutas de la Aplicación

* **`/`**: Página principal que muestra la lista de tareas. Permite ver, filtrar y ordenar las tareas existentes.
* **`/nueva-tarea`**: Formulario para crear una nueva tarea.
* **`/editar-tarea/:id`**: Formulario para editar una tarea existente, donde `:id` es el identificador único de la tarea.

## Estructura del Proyecto

```
├── src/
│   ├── main.tsx          # Punto de entrada principal de la aplicación React.
│   ├── App.tsx           # Componente raíz de la aplicación.
│   ├── index.css         # Archivo de estilos CSS global.
│   ├── components/
│   │   ├── EditTask.tsx  # Formulario para editar una tarea existente.
│   │   ├── NewTask.tsx   # Formulario para crear una nueva tarea.
│   │   ├── TaskTable.tsx # Tabla mostrando la lista de tareas.
│   ├── types/
│   │   ├── task.d.ts     # Archivo de definición de tipo para la entidad 'Task'..
│   ├── assets/
│   └── ...
├── index.html          # Archivo HTML principal.
├── README.md           # Este archivo
└── ...
```

## Comandos para Correr la Aplicación

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/Pykto/task-app-frontend.git
    cd task-app-frontend
    ```

2.  **Instalar las Dependencias:**

    Si utilizas **npm**:
    ```bash
    npm install
    ```

3.  **Configurar las Variables de Entorno:**
  
    Archivo `.env` en la raíz del proyecto:

    ```
    VITE_TASK_API_BASE_URL=http://localhost:5000
    ```

4.  **Iniciar la Aplicación en Modo Desarrollo:**

    ```bash
    npm run dev
    ```

## Notas Adicionales

* Asegurar de que la API backend esté en ejecución y accesible desde la URL configurada en las variables de entorno.