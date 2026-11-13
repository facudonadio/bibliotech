# ⧉ Bibliotech

**Bibliotech** es una plataforma web para la gestión documental de libros y archivos en formato PDF (.pdf). Está desarrollada con una arquitectura en **N capas**, el **patrón Repository**, procedimientos almacenados (*Stored Procedures*) para las operaciones de base de datos y manipulación nativa del DOM en el frontend.

El proyecto surge de la evolución y transformación del sistema *Sample Vault*, adaptando la gestión multimedia hacia un repositorio documental de lectura y descarga digital.

Proyecto Sample Vault Original: https://github.com/gabrielinuz/sample-vault  
Revisión V1.0 Sergio Puchatt: https://github.com/Sdpuchatt  
Revisión V2.0 GNGF: https://github.com/tecnobfi/bibliotech

---

## ⧉ Funcionalidades principales

- **Gestión de libros PDF:** carga, consulta, visualización, descarga y eliminación de documentos.
- **Edición de metadatos:** permite actualizar los datos descriptivos de los libros respetando los permisos del usuario y conservando la referencia al archivo PDF.
- **Categorías dinámicas:** las categorías se almacenan en la base de datos y se obtienen desde la API para completar los selectores del frontend.
- **Auditoría:** registra eventos de eliminación de libros y usuarios, incluyendo el usuario que realizó la acción, el elemento afectado, la dirección IP disponible y la fecha.
- **Administración de usuarios:** permite consultar y administrar las cuentas según los roles definidos.

---

## ⧉ Hitos de Ingeniería y Arquitectura

1. **Arquitectura en N Capas (separación de responsabilidades):**
   - **Base de Datos:** tablas y procedimientos almacenados para las operaciones de persistencia.
   - **Repositorios (Repository Pattern):** abstracción del acceso a los datos.
   - **Controladores:** coordinación de la lógica de las solicitudes.
   - **Middlewares:** validación de datos, autenticación y autorización.
   - **Rutas (Router):** definición modular de los endpoints de la API.
2. **Motor de Validación y Patrones de Diseño:**
   - Implementación de la clase `Validator` utilizando Fluent Interface y reglas extensibles.
   - `validation_middleware.js`: aplica las reglas de validación antes de que las solicitudes lleguen a los controladores.
3. **Internacionalización y Localización (i18n):**
   - Diccionarios de traducción centralizados para los mensajes del sistema.
4. **Manejo Global de Errores:**
   - `global_error_middleware.js`: centraliza el tratamiento de errores y evita exponer detalles internos sensibles en las respuestas de producción.
5. **Frontend:**
   - Construcción de elementos dinámicos mediante métodos nativos del DOM, como `createElement`, `textContent` y `replaceChildren`, evitando insertar contenido dinámico mediante `innerHTML`.

---

## ⧉ Tecnologías Utilizadas

### Backend
- **Node.js & Express:** servidor HTTP y API REST.
- **MySQL / MariaDB (`mysql2`):** base de datos relacional.
- **Multer:** procesamiento de cargas `multipart/form-data` para archivos PDF.
- **JSON Web Tokens (JWT):** autenticación mediante tokens.
- **Bcrypt:** hash de contraseñas.
- **Dotenv:** lectura de variables de entorno.

### Frontend
- **Vanilla JavaScript:** lógica frontend asíncrona mediante Fetch API.
- **W3.CSS:** estilos y componentes de interfaz.
- **CSS Custom Properties:** variables CSS para mantener una paleta visual unificada.

---

## ⧉ Estructura del Proyecto

```text
bibliotech/
├── backend/
│   ├── config/
│   │   ├── migrations/
│   │   │   ├── 001_categories.sql          # Categorías dinámicas
│   │   │   ├── 002_book_metadata.sql       # Edición de metadatos
│   │   │   └── 003_audit_logs.sql          # Auditoría
│   │   ├── db.js                           # Pool de conexiones a MySQL
│   │   ├── init.sql                        # Estructura inicial y Stored Procedures
│   │   ├── delete.sql                      # Script de limpieza
│   │   └── multer_config.js                # Configuración de carga de PDFs
│   ├── controllers/
│   │   ├── admin_controller.js             # Operaciones administrativas
│   │   ├── auth_controller.js              # Registro e inicio de sesión
│   │   ├── book_controller.js              # Gestión de libros
│   │   └── category_controller.js          # Consulta de categorías
│   ├── middleware/
│   │   ├── auth_middleware.js              # Verificación de JWT y roles
│   │   ├── global_error_middleware.js      # Manejo global de errores
│   │   └── validation_middleware.js        # Validación de solicitudes
│   ├── repositories/
│   │   ├── audit_repository.js             # Persistencia de eventos de auditoría
│   │   ├── book_repository.js              # Acceso a datos de libros
│   │   ├── category_repository.js          # Acceso a datos de categorías
│   │   └── user_repository.js              # Acceso a datos de usuarios
│   ├── routes/
│   │   ├── admin_routes.js                 # Endpoints administrativos
│   │   ├── auth_routes.js                  # Endpoints de autenticación
│   │   ├── book_routes.js                  # Endpoints de libros
│   │   ├── category_routes.js              # Endpoints de categorías
│   │   ├── tests_routes.js                 # Rutas de pruebas
│   │   └── view_routes.js                  # Rutas de vistas HTML
│   ├── uploads/                            # Almacenamiento de archivos PDF
│   ├── utils/
│   │   ├── dbutils/
│   │   │   ├── db_check.js                 # Diagnóstico de conexión
│   │   │   └── db_setup.js                 # Inicialización de la base de datos
│   │   ├── file_helper/
│   │   │   └── file_helper.js              # Gestión de archivos
│   │   ├── i18n/
│   │   │   ├── locales/                    # Diccionarios de traducción
│   │   │   ├── i18n.js                     # Motor de traducciones
│   │   │   └── README.md                   # Documentación del módulo
│   │   └── validator/
│   │       ├── rules/                      # Reglas de validación
│   │       ├── validator.js                # Motor de validación
│   │       └── README.md                   # Documentación del módulo
│   ├── .env.example                        # Plantilla de variables de entorno
│   ├── package.json                        # Dependencias y scripts
│   └── server.js                            # Punto de entrada del servidor
├── frontend/
│   ├── css/
│   │   ├── style.css                       # Estilos personalizados
│   │   └── w3.css                          # Framework CSS
│   ├── html/
│   │   ├── admin_dashboard.html            # Panel administrativo
│   │   ├── client_dashboard.html            # Panel del cliente
│   │   ├── login.html                      # Inicio de sesión
│   │   ├── register.html                   # Registro
│   │   └── tests.html                      # Interfaz de pruebas
│   └── js/
│       ├── components/
│       │   ├── book_editor.js              # Edición de metadatos
│       │   └── ui_handlers.js              # Componentes dinámicos de interfaz
│       ├── front_controllers/
│       │   ├── admin_front_controller.js
│       │   ├── auth_front_controller.js
│       │   └── books_front_controller.js
│       ├── services/
│       │   └── api_service.js              # Cliente HTTP e inyección de JWT
│       ├── tests/                          # Pruebas del frontend
│       └── utils/
│           └── auth_helper.js              # Gestión de autenticación en frontend
├── .gitignore
└── README.md
```

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Prerrequisitos

- **Node.js** (v18 o superior recomendado).
- **MySQL** o **MariaDB**.
- Un gestor de base de datos o acceso a la consola para inicializarla.

### 2. Configurar las variables de entorno

En la carpeta `backend/`, crea un archivo llamado `.env` tomando como referencia `.env.example`.

Configura los valores correspondientes a tu entorno:

```env
PORT=3000
DB_HOST=localhost
DB_USER=usuario_de_base_de_datos
DB_PASS=contraseña_de_base_de_datos
DB_NAME=bibliotech
JWT_SECRET=una_clave_larga_y_aleatoria
NODE_ENV=development
```

No compartas ni subas el archivo `.env` al repositorio. Utiliza valores propios de tu entorno y mantené las credenciales fuera del control de versiones.

### 3. Instalar dependencias

Desde una terminal, ingresa a la carpeta del backend:

```bash
cd backend
npm install
```

### 4. Inicializar o actualizar la base de datos

**Instalación nueva:** ejecuta el script de inicialización siguiendo la configuración de tu entorno:

```bash
node utils/dbutils/db_setup.js
```

El script prepara la base de datos y sus objetos según la configuración del proyecto. También se puede utilizar `config/init.sql` desde una herramienta de administración de MySQL/MariaDB, con los permisos necesarios.

**Base de datos existente:** si la base ya contiene la estructura anterior del proyecto, revisa primero qué cambios tiene aplicados y realiza una copia de seguridad. Luego aplica, en orden y una sola vez, las migraciones:

1. `config/migrations/001_categories.sql`
2. `config/migrations/002_book_metadata.sql`
3. `config/migrations/003_audit_logs.sql`

Las migraciones deben ejecutarse sobre la base de datos correspondiente y con un usuario que tenga los permisos necesarios. No ejecutes las migraciones sobre una base que ya tenga esos cambios aplicados.

### 5. Iniciar la aplicación

Desde la carpeta `backend/`:

```bash
npm start
```

El servidor estará disponible, según la configuración, en:

`http://localhost:3000`

---

## ⧉ Guía de Uso

Abre el navegador e ingresa a `http://localhost:3000`.

Desde la interfaz se puede:

- Registrarse e iniciar sesión.
- Cargar y consultar libros PDF.
- Visualizar y descargar documentos.
- Editar los metadatos de los libros según los permisos del usuario.
- Consultar las categorías disponibles.
- Realizar operaciones administrativas según el rol asignado.

Los usuarios y contraseñas de prueba, si están habilitados en la instalación, deben configurarse de acuerdo con el entorno local. Cambia las credenciales predeterminadas antes de utilizar el sistema fuera de un entorno de prueba.

---

## ⧉ Laboratorio de Pruebas API

El proyecto incluye un entorno de pruebas para validar endpoints y comportamientos de la API.

Si el entorno de pruebas está habilitado en la configuración:

1. En `backend/.env`, configura `NODE_ENV=testing`.
2. Reinicia el servidor.
3. Accede a `http://localhost:3000` y utiliza la interfaz de pruebas.

Las pruebas disponibles pueden incluir validaciones de autenticación, prevención de usuarios duplicados, carga y listado de documentos y operaciones administrativas. Ejecutalas sobre una base de datos de prueba, nunca sobre datos de producción.
