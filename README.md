# ⧉ Bibliotech

**Bibliotech** es una plataforma web para la gestión documental de libros y archivos en formato PDF (.pdf). Diseñada bajo una arquitectura en **N capas**, aplicando el **patrón Repository**, uso estricto de **Stored Procedures** en base de datos y un frontend seguro con manipulación nativa del DOM (**Zero innerHTML**).

Este proyecto surge de la evolución y transformación del sistema *Sample Vault*, adaptando la gestión multimedia hacia un repositorio documental de lectura y descarga digital con un alto enfoque en estándares profesionales de Ingeniería de Software.

Proyecto Sample Vault Original: https://github.com/gabrielinuz/sample-vault  
Revisión V1.0 Sergio Puchatt: https://github.com/Sdpuchatt  
Revisión V2.0 GNGF: https://github.com/tecnobfi/bibliotech  

---

## ⧉ Hitos de Ingeniería y Arquitectura

1. **Arquitectura en N Capas (Separación Estricta de Responsabilidades)**:
   - **Base de Datos**: Stored Procedures para transacciones encapsuladas y aplicación del Principio de Menor Privilegio (PoLP).
   - **Repositorios (`Repository Pattern`)**: Abstracción total del acceso a datos.
   - **Controladores**: Gestión exclusiva de la lógica de negocio semántica.
   - **Middlewares**: Escudos preventivos para validación sintáctica y autorización.
   - **Rutas (`Router`)**: Enrutamiento declarativo y modular para la API.
2. **Motor de Validación Custom y Patrones de Diseño**:
   - Implementación de la clase `Validator` utilizando **Fluent Interface**, **Strategy** (Principio Abierto/Cerrado para reglas) y **Visitor**.
   - `validation_middleware.js`: Aplica las reglas del validador deteniendo peticiones malformadas antes de que alcancen los controladores (Principio *Fail-Fast*).
3. **Internacionalización y Localización (i18n)**:
   - Implementación del patrón **Singleton** para cargar diccionarios estáticos en memoria, centralizando y traduciendo todos los mensajes del sistema y excepciones sin *hardcodear* strings en la lógica.
4. **Filtro de Errores Global**:
   - `global_error_middleware.js`: Red de contención final que atrapa excepciones del sistema, fallos de Multer o errores de MySQL (`ER_DUP_ENTRY`, `ECONNREFUSED`), traduciéndolos a un formato JSON estandarizado sin exponer el *stack trace* en producción.
5. **Frontend Seguro (Zero-XSS)**:
   - Renderización dinámica de tablas y modales utilizando estrictamente métodos nativos del DOM (`createElement`, `textContent`, `replaceChildren`), erradicando por completo el uso de la propiedad insegura `innerHTML`.

---

## ⧉ Funcionalidades principales

- **Gestión de libros PDF**: permite cargar, consultar, descargar y eliminar documentos.
- **Edición de metadatos**: permite actualizar título, autor, categoría y cantidad de páginas sin modificar el archivo PDF. Los clientes solo pueden editar sus propios libros; los administradores pueden editar los libros de los clientes. Endpoint: `PUT /api/books/:id`.
- **Categorías dinámicas**: las categorías se almacenan en la tabla `categories` y se consultan desde la API mediante `GET /api/categories`; los formularios cargan sus opciones desde el backend.
- **Auditoría**: registra las acciones de eliminación de libros (`DELETE_BOOK`) y usuarios (`DELETE_USER`) en `audit_logs`, incluyendo actor, recurso afectado, IP disponible y fecha.

---

## ⧉ Tecnologías Utilizadas

### Backend
- **Node.js & Express**: Servidor HTTP modular y enrutamiento REST.
- **MySQL / MariaDB (`mysql2`)**: Base de datos relacional y ejecución de Prepared Statements.
- **Multer**: Procesamiento seguro de cargas `multipart/form-data` para archivos PDF.
- **JSON Web Tokens (JWT)**: Autenticación *stateless* basada en tokens Bearer.
- **Bcrypt**: Hashing seguro de contraseñas con factor de costo.
- **Dotenv**: Gestión de variables de entorno para protección de secretos.

### Frontend
- **Vanilla JavaScript**: Lógica frontend asíncrona (Fetch API) sin frameworks pesados.
- **W3.CSS**: Framework CSS ligero para diseño responsive y componentes UI.
- **CSS Custom Properties**: Paleta de colores unificada (Single Source of Truth).

---

## ⧉ Estructura del Proyecto

```text
bibliotech/
├── backend/
│   ├── config/
│   │   ├── migrations/
│   │   │   ├── 001_categories.sql       # Normalización de categorías
│   │   │   ├── 002_book_metadata.sql    # Procedimientos para edición de metadatos
│   │   │   └── 003_audit_logs.sql       # Tabla y procedimiento de auditoría
│   │   ├── db.js                        # Pool de conexiones a MySQL
│   │   ├── init.sql                     # Script DDL: tablas, usuario y Stored Procedures
│   │   ├── delete.sql                   # Script de limpieza idempotente
│   │   └── multer_config.js             # Configuración y filtro estricto de PDFs
│   ├── controllers/
│   │   ├── admin_controller.js          # Lógica semántica de administración
│   │   ├── auth_controller.js           # Registro e inicio de sesión
│   │   ├── book_controller.js           # Carga, consulta, edición y borrado de documentos
│   │   └── category_controller.js       # Consulta del catálogo de categorías
│   ├── middleware/
│   │   ├── auth_middleware.js           # Verificación de JWT y roles
│   │   ├── global_error_middleware.js   # Red de contención y traducción de contingencias
│   │   └── validation_middleware.js     # Escudo de validación sintáctica (Validator)
│   ├── repositories/
│   │   ├── audit_repository.js          # Persistencia de eventos de auditoría
│   │   ├── book_repository.js           # Acceso a datos de libros (Capa Data Access)
│   │   ├── category_repository.js       # Acceso al catálogo de categorías
│   │   └── user_repository.js           # Acceso a identidades
│   ├── routes/
│   │   ├── admin_routes.js              # Endpoints protegidos para admins
│   │   ├── auth_routes.js               # Endpoints públicos de identidad
│   │   ├── book_routes.js               # Endpoints de la biblioteca privada
│   │   ├── category_routes.js           # Endpoint del catálogo de categorías
│   │   ├── tests_routes.js              # Ruta condicional para suite de pruebas
│   │   └── view_routes.js               # Enrutador de pantallas HTML
│   ├── uploads/                         # Directorio físico de almacenamiento PDF
│   ├── utils/
│   │   ├── dbutils/
│   │   │   ├── db_check.js              # Script CLI de diagnóstico de conexión
│   │   │   └── db_setup.js              # Inicialización automatizada (Bootstrap DB)
│   │   ├── file_helper/
│   │   │   └── file_helper.js           # Limpieza síncrona de archivos huérfanos
│   │   ├── i18n/
│   │   │   ├── locales/                 # Diccionarios JSON (es.json, en.json)
│   │   │   ├── i18n.js                  # Motor Singleton de traducciones
│   │   │   └── README.md                # Documentación del módulo
│   │   └── validator/
│   │       ├── rules/                   # Estrategias OCP (min_length, required, etc.)
│   │       ├── validator.js             # Motor Fluent Interface
│   │       └── README.md                # Documentación del módulo
│   ├── .env                             # Variables de entorno locales
│   ├── .env.example                     # Plantilla de variables de entorno
│   ├── package.json                     # Dependencias y scripts de Node
│   └── server.js                        # Punto de entrada y definición del Pipeline
├── frontend/
│   ├── css/
│   │   ├── style.css                    # Estilos personalizados (Variables CSS)
│   │   └── w3.css                       # Framework estructural
│   ├── html/
│   │   ├── admin_dashboard.html         # Panel de auditoría de usuarios
│   │   ├── client_dashboard.html        # Interfaz de lectura y gestión PDF
│   │   ├── login.html                   # Pantalla de inicio de sesión
│   │   ├── register.html                # Pantalla de creación de cuenta
│   │   └── tests.html                   # Interfaz del laboratorio de pruebas DOM
│   ├── img/                             # Favicon e iconografía
│   └── js/
│       ├── components/
│       │   ├── book_editor.js            # Formulario dinámico de edición de metadatos
│       │   └── ui_handlers.js           # Constructores de modales dinámicos (Zero-innerHTML)
│       ├── front_controllers/
│       │   ├── admin_front_controller.js
│       │   ├── auth_front_controller.js
│       │   └── books_front_controller.js
│       ├── services/
│       │   └── api_service.js           # Cliente Fetch interceptor (Inyección JWT)
│       ├── tests/
│       │   ├── admin_tests.js           # Tests unitarios de rol administrador
│       │   ├── auth_tests.js            # Tests de escudos de identidad (400, 401, 409)
│       │   ├── book_tests.js            # Simulación Blob de subida documental
│       │   └── test_utils.js            # Framework de testing DOM
│       └── utils/
│           └── auth_helper.js           # Gestión del ciclo de vida en localStorage
├── .gitignore
└── README.md
```

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Prerrequisitos
- **Node.js** (versión 18 o superior recomendada) y npm.
- **MySQL** o **MariaDB** en ejecución. Puede utilizarse una instalación local, XAMPP o Laragon.
- Un usuario administrador de MySQL/MariaDB para crear la base de datos y el usuario de aplicación durante la instalación inicial.


### 2. Configurar Variables de Entorno
Crea un archivo llamado `.env` dentro de `backend/`. Este archivo es local y no debe subirse al repositorio (está excluido mediante `.gitignore`).

```env
PORT=3000
DB_HOST=localhost
DB_USER=bibliotech
DB_PASS=bibliotech
DB_NAME=bibliotech
JWT_SECRET=reemplazar_por_una_clave_larga_y_aleatoria
NODE_ENV=development
```

### 3. Instalar Dependencias
Desde la terminal, accede a la carpeta `backend`:

```bash
cd backend
npm install
```

### 4. Inicializar la Base de Datos

**Instalación nueva:** utiliza esta opción solamente cuando todavía no exista el esquema de Bibliotech. Desde la carpeta `backend/`, ejecuta:

```bash
node utils/dbutils/db_setup.js
```

El script ejecuta `config/init.sql`, que crea la base `bibliotech`, el usuario de aplicación, las tablas, los procedimientos almacenados y los datos iniciales. La configuración actual del script supone que el usuario `root` de MySQL está disponible en `localhost` sin contraseña. Si tu instalación de MySQL requiere contraseña para `root`, importa `backend/config/init.sql` mediante phpMyAdmin, MySQL Workbench o un cliente SQL con permisos administrativos.

**Importante:** `init.sql` es un script de inicialización, no una migración incremental. No lo vuelvas a ejecutar sobre una base que ya contiene las tablas, porque varias instrucciones crean objetos sin `IF NOT EXISTS`.

**Base de datos existente de una versión anterior:** realiza primero un respaldo y aplica, una sola vez y en este orden, los archivos de `config/migrations/`:

1. `001_categories.sql`
2. `002_book_metadata.sql`
3. `003_audit_logs.sql`

Estas migraciones están destinadas a actualizar una base existente que todavía no contiene esos cambios. No las ejecutes sobre una base recién creada con el `init.sql` actual, porque ese archivo ya incluye las tres funcionalidades.

### 5. Iniciar la Aplicación

```bash
npm start
```

El servidor estará listo y escuchando en:
👉 **`http://localhost:3000`**

---

## ⧉ Guía de Uso

Abre tu navegador e ingresa a `http://localhost:3000`.

### Usuarios de Prueba Preconfigurados:

| Rol | Usuario | Contraseña | Permisos y Funcionalidad |
| :--- | :--- | :--- | :--- |
| **Cliente** | `pepe` | `12345` | Carga de libros PDF, visualización en modal, descarga y borrado. |
| **Administrador** | `admin` | `12345` | Vista de todos los clientes y borrado recursivo (DB + archivos en disco). |

*(También es posible crear nuevos usuarios desde el enlace **Regístrate** en la pantalla de inicio).*

> **Nota de seguridad:** las credenciales de ejemplo son únicamente para desarrollo y pruebas locales. Cambia las contraseñas y configura un `JWT_SECRET` propio antes de utilizar el sistema fuera de un entorno local.

---

## ⧉ Laboratorio de Pruebas API

El proyecto incluye un entorno integrado para validar los endpoints y filtros de error:

1. En el archivo `backend/.env`, cambia la variable `NODE_ENV`:
   ```env
   NODE_ENV=testing
   ```
2. Reinicia el servidor (`npm start`).
3. Accede a `http://localhost:3000`. Verás la consola interactiva con botones para ejecutar tests automatizados de:
   - Login correcto e incorrecto.
   - Control de contraseñas cortas (< 6 caracteres) con respuesta HTTP 400.
   - Prevención de usuarios duplicados con respuesta HTTP 409 (`ER_DUP_ENTRY`).
   - Carga y listado de documentos PDF con autenticación Bearer.
   - Listado administrativo de cuentas.
