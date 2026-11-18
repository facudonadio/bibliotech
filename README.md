# Bibliotech

**Bibliotech** es una plataforma web para la gestión de libros y documentos en formato PDF. El proyecto evolucionó desde *Sample Vault* hacia un repositorio documental con autenticación, administración de usuarios, categorías dinámicas, edición de metadatos y auditoría de operaciones críticas.

La aplicación utiliza Node.js, Express y MySQL/MariaDB, organizada mediante una arquitectura en capas y el patrón Repository. El frontend está desarrollado con JavaScript nativo y construye las interfaces dinámicas mediante métodos del DOM.

Proyecto de origen: https://github.com/gabrielinuz/sample-vault  
Revisión V1.0: https://github.com/Sdpuchatt  
Revisión V2.0: https://github.com/tecnobfi/bibliotech

---

## Funcionalidades principales

### A. Edición de metadatos de libros

Permite modificar el título, autor, categoría y cantidad de páginas de un libro sin reemplazar ni alterar el archivo PDF almacenado.

- Los clientes pueden editar únicamente los libros de su propiedad.
- Los administradores pueden editar los metadatos de los libros de los clientes.
- El backend valida los datos recibidos y aplica la autorización antes de actualizar.
- La operación se realiza mediante `PUT /api/books/:id` y el procedimiento almacenado `sp_update_book_metadata`.
- La interfaz utiliza un componente de edición y envía los cambios a través del servicio de API.

### B. Auditoría de eliminaciones

Registra operaciones críticas de eliminación en la tabla `audit_logs`.

- `DELETE_BOOK`: registra la eliminación de un libro.
- `DELETE_USER`: registra la eliminación de una cuenta por parte de un administrador.
- Cada evento conserva el identificador del usuario que realizó la acción, el recurso afectado, la dirección IP disponible y la fecha.
- La eliminación en la base de datos y la inserción del evento de auditoría se ejecutan dentro de una misma transacción. Si alguna de esas operaciones falla, la transacción se revierte.
- Luego de confirmar la transacción, el backend intenta eliminar los archivos PDF asociados y comunica si la limpieza de archivos tuvo algún inconveniente.

La tabla de auditoría no tiene una clave foránea hacia `users`, de modo que el historial pueda conservarse aunque se elimine una cuenta.

### C. Categorías dinámicas

Las categorías se almacenan en la tabla `categories` y se consultan mediante `GET /api/categories`.

- El catálogo inicial incluye Novela, Ciencia Ficción, Técnico / Académico, Historia, Poesía y Otros.
- Los formularios obtienen las opciones desde el backend, en lugar de mantener una lista fija en el HTML.
- Los libros guardan la referencia mediante `category_id`, protegida por una clave foránea.
- El frontend construye las opciones utilizando métodos nativos del DOM, como `createElement` y `textContent`.

---

## Arquitectura y criterios de calidad

El backend separa responsabilidades en capas:

1. **Base de datos:** tablas y procedimientos almacenados para encapsular operaciones.
2. **Repositorios:** centralizan el acceso a datos y las llamadas parametrizadas a los procedimientos.
3. **Controladores:** coordinan las solicitudes y las respuestas de la aplicación.
4. **Middlewares:** aplican autenticación, autorización y validaciones.
5. **Rutas:** definen los endpoints de la API.
6. **Frontend:** presenta las pantallas y se comunica con el backend mediante Fetch API.

También se utiliza un middleware global para centralizar el tratamiento de errores y un módulo de internacionalización para los mensajes de la aplicación.

En las interfaces dinámicas implementadas se utilizan métodos nativos del DOM para evitar insertar contenido recibido dinámicamente mediante `innerHTML`. Las operaciones de acceso a datos utilizan parámetros en lugar de concatenar valores recibidos en sentencias SQL.

---

## Tecnologías

**Backend**
- Node.js y Express.
- MySQL o MariaDB, mediante `mysql2`.
- Multer para la carga de archivos PDF.
- JSON Web Tokens (JWT) para autenticación.
- Bcrypt para el hash de contraseñas.
- Dotenv para cargar variables de entorno.

**Frontend**
- JavaScript nativo (Vanilla JavaScript) y Fetch API.
- W3.CSS.
- CSS Custom Properties.

---

## Estructura del proyecto

El siguiente árbol resume los archivos y directorios relevantes presentes en el repositorio. Los archivos locales de configuración, como `backend/.env`, y el directorio de archivos cargados no se versionan.

```text
bibliotech/
├── backend/
│   ├── config/
│   │   ├── migrations/
│   │   │   ├── 001_categories.sql
│   │   │   ├── 002_book_metadata.sql
│   │   │   ├── 003_audit_logs.sql
│   │   │   └── 004_delete_affected_rows.sql
│   │   ├── db.js
│   │   ├── delete.sql
│   │   ├── init.sql
│   │   └── multer_config.js
│   ├── controllers/
│   │   ├── admin_controller.js
│   │   ├── auth_controller.js
│   │   ├── book_controller.js
│   │   └── category_controller.js
│   ├── middleware/
│   │   ├── auth_middleware.js
│   │   ├── global_error_middleware.js
│   │   └── validation_middleware.js
│   ├── repositories/
│   │   ├── audit_repository.js
│   │   ├── book_repository.js
│   │   ├── category_repository.js
│   │   └── user_repository.js
│   ├── routes/
│   │   ├── admin_routes.js
│   │   ├── auth_routes.js
│   │   ├── book_routes.js
│   │   ├── category_routes.js
│   │   ├── tests_routes.js
│   │   └── view_routes.js
│   ├── utils/
│   │   ├── dbutils/
│   │   │   ├── db_check.js
│   │   │   └── db_setup.js
│   │   ├── file_helper/
│   │   │   └── file_helper.js
│   │   ├── i18n/
│   │   │   ├── locales/
│   │   │   ├── i18n.js
│   │   │   └── README.md
│   │   └── validator/
│   │       ├── rules/
│   │       ├── validator.js
│   │       └── README.md
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   │   ├── style.css
│   │   └── w3.css
│   ├── html/
│   │   ├── admin_dashboard.html
│   │   ├── client_dashboard.html
│   │   ├── login.html
│   │   ├── register.html
│   │   └── tests.html
│   └── js/
│       ├── components/
│       │   ├── book_editor.js
│       │   └── ui_handlers.js
│       ├── front_controllers/
│       │   ├── admin_front_controller.js
│       │   ├── auth_front_controller.js
│       │   └── books_front_controller.js
│       ├── services/
│       │   └── api_service.js
│       ├── tests/
│       │   ├── admin_tests.js
│       │   ├── auth_tests.js
│       │   ├── book_tests.js
│       │   └── test_utils.js
│       └── utils/
│           └── auth_helper.js
├── .gitignore
└── README.md
```

---

## Instalación y puesta en marcha

### 1. Prerrequisitos

- **Node.js 18 o superior** y npm.
- **MySQL o MariaDB** instalado y en ejecución.
- **Git** para clonar el repositorio.
- Permisos administrativos de MySQL/MariaDB para una instalación nueva o para importar el esquema inicial.
- Un editor de texto para configurar las variables de entorno.

### 2. Obtener el proyecto e instalar dependencias

Cloná el repositorio y entrá en la carpeta del backend:

```bash
git clone https://github.com/facudonadio/bibliotech.git
cd bibliotech/backend
npm install
```

### 3. Configurar las variables de entorno

El backend carga la configuración desde un archivo local llamado `.env`, ubicado dentro de `backend/`. El repositorio no incluye un archivo `.env.example`; creá `backend/.env` manualmente con esta estructura y adaptá los valores a tu instalación:

```env
PORT=3000
DB_HOST=localhost
DB_USER=bibliotech
DB_PASS=bibliotech
DB_NAME=bibliotech
JWT_SECRET=REEMPLAZAR_POR_UN_SECRETO_ALEATORIO
NODE_ENV=development
```

Consideraciones de seguridad:

- `.env` contiene credenciales y secretos: no lo subas a Git ni lo compartas.
- El archivo está excluido del control de versiones mediante `.gitignore`.
- Reemplazá el valor de ejemplo de `JWT_SECRET` por una clave larga, aleatoria y privada. Podés generarla con `openssl rand -hex 32`.
- No utilices la cuenta `root` como usuario de conexión de la aplicación. `DB_USER` y `DB_PASS` corresponden al usuario de aplicación creado en la base de datos.
- El `init.sql` actual crea el usuario local `bibliotech` con contraseña inicial `bibliotech` y permisos limitados para la aplicación. Si cambiás esa contraseña en MySQL/MariaDB, actualizá también `DB_PASS` en `.env`.
- El script `db_setup.js` utiliza una conexión administrativa independiente: actualmente intenta conectarse como `root` en el host indicado por `DB_HOST`, sin contraseña. No guarda ni toma la contraseña de root desde `.env`. Si tu instalación requiere otra configuración administrativa, importá `backend/config/init.sql` mediante un cliente SQL con los permisos necesarios.

### 4. Preparar la base de datos

Elegí **un solo escenario** según el estado de tu base de datos. No combines la inicialización completa con las migraciones.

#### A. Instalación nueva

Usá esta alternativa únicamente si todavía no existe una base Bibliotech que quieras conservar.

Desde `backend/`, ejecutá:

```bash
node utils/dbutils/db_setup.js
```

El script lee y ejecuta `config/init.sql`. El archivo crea la base `bibliotech`, el usuario de aplicación, las tablas, las categorías iniciales y los procedimientos almacenados correspondientes a la versión actual del proyecto.

Si no podés utilizar las condiciones de conexión administrativa que espera `db_setup.js`, importá `backend/config/init.sql` desde MySQL Workbench, phpMyAdmin u otro cliente SQL con permisos administrativos.

**Importante:** `init.sql` es un script de inicialización completa, no una migración incremental. No lo ejecutes sobre una base existente que contenga datos que quieras conservar. No lo vuelvas a ejecutar como método de actualización.

#### B. Actualización de una base existente

Usá esta alternativa solamente para actualizar una base Bibliotech de una versión anterior que todavía no tenga aplicados estos cambios.

1. Realizá un respaldo completo de la base antes de empezar.
2. Verificá que la base corresponda al esquema anterior esperado por las migraciones.
3. Ejecutá cada archivo **una sola vez y en el orden indicado**:
   - `backend/config/migrations/001_categories.sql`
   - `backend/config/migrations/002_book_metadata.sql`
   - `backend/config/migrations/003_audit_logs.sql`
   - `backend/config/migrations/004_delete_affected_rows.sql`
4. Comprobá que cada migración finalice correctamente antes de ejecutar la siguiente.

Las migraciones están destinadas a una base existente llamada `bibliotech`. La migración 002 requiere la 001; la 003 requiere las dos anteriores; y la 004 requiere la 003. No ejecutes nuevamente una migración ya aplicada.

**No ejecutes estas migraciones sobre una base creada desde cero con el `init.sql` actual:** ese archivo ya contiene las estructuras y procedimientos de la versión final. Tampoco ejecutes `init.sql` sobre una base existente para intentar actualizarla.

### 5. Iniciar el servidor

Desde `backend/`:

```bash
npm start
```

Por defecto, la aplicación queda disponible en:

```text
http://localhost:3000
```

---

## Guía de uso

Desde la aplicación se puede:

- Registrar una cuenta e iniciar sesión.
- Cargar, consultar, visualizar, descargar y eliminar libros PDF.
- Editar metadatos de acuerdo con el rol y los permisos del usuario.
- Seleccionar categorías cargadas desde la API.
- Acceder a las funciones de administración disponibles para el rol administrador.

La base inicial contiene cuentas de ejemplo para desarrollo y pruebas locales:

| Rol | Usuario | Contraseña inicial |
|---|---|---|
| Administrador | `admin` | `12345` |
| Cliente | `pepe` | `12345` |

**Advertencia:** estas credenciales son públicas y exclusivamente demostrativas. No las utilices en un entorno expuesto ni con información real. Cambiá las contraseñas o eliminá las cuentas de ejemplo antes de cualquier despliegue no local.

---

## Laboratorio de pruebas

El proyecto incluye una interfaz de pruebas que se habilita cuando `NODE_ENV=testing`.

Para acceder a ella:

1. Asegurate de que el backend esté configurado para conectarse a una **base de datos exclusiva de desarrollo o pruebas**, con datos descartables.
2. En `backend/.env`, establecé:
   ```env
   NODE_ENV=testing
   ```
3. Reiniciá el servidor con `npm start`.
4. Abrí `http://localhost:3000`; en este modo, la ruta inicial sirve la interfaz de pruebas.

Los casos contemplan validaciones de autenticación, contraseñas, usuarios duplicados, carga y consulta de documentos y operaciones administrativas.

**Las pruebas pueden crear, modificar o eliminar datos. Ejecutalas únicamente en entornos de desarrollo o pruebas, nunca contra producción ni contra una base con información que necesites conservar.** Al terminar, devolvé `NODE_ENV` a `development` y reiniciá el servidor.

