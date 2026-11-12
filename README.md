# ⧉ Bibliotech

**Bibliotech** es una plataforma web para la gestión documental de libros y archivos PDF. Está desarrollada con Node.js, Express y MySQL/MariaDB, utilizando una arquitectura en capas, el patrón Repository, Stored Procedures y manipulación segura del DOM desde el frontend.

El proyecto surge de la evolución de *Sample Vault*, adaptando la gestión multimedia hacia un repositorio documental de lectura y descarga digital.

Proyecto Sample Vault Original: https://github.com/gabrielinuz/sample-vault  
Revisión V1.0 Sergio Puchatt: https://github.com/Sdpuchatt  
Revisión V2.0 GNGF: https://github.com/tecnobfi/bibliotech

---

## ⧉ Funcionalidades principales

- **Gestión de libros PDF:** carga, consulta, visualización, descarga y eliminación de documentos.
- **Edición de metadatos:** permite actualizar título, autor, categoría y cantidad de páginas sin modificar el archivo PDF almacenado. Los clientes pueden editar sus propios libros y los administradores pueden gestionar los libros de los clientes.
- **Categorías dinámicas:** las categorías se almacenan en la base de datos y se obtienen desde la API; no están definidas como una lista fija en el frontend.
- **Auditoría:** registra eventos de eliminación de libros (DELETE_BOOK) y usuarios (DELETE_USER), incluyendo actor, recurso afectado, dirección IP disponible y fecha.
- **Autenticación y autorización:** utiliza JWT y roles para proteger las operaciones.
- **Frontend seguro:** construye elementos dinámicos mediante métodos nativos del DOM como createElement, textContent y replaceChildren, evitando insertar contenido dinámico mediante innerHTML.

---

## ⧉ Arquitectura y organización

El proyecto separa las responsabilidades en capas:

1. **Base de datos:** tablas y Stored Procedures para encapsular las operaciones SQL.
2. **Repositorios:** centralizan el acceso a los datos.
3. **Controladores:** coordinan las solicitudes y la lógica de la aplicación.
4. **Middlewares:** gestionan autenticación, autorización y validación.
5. **Rutas:** definen los endpoints de la API.
6. **Frontend:** presenta la interfaz y se comunica con el backend mediante Fetch API.

También se utiliza un middleware global para centralizar el tratamiento de errores.

---

## ⧉ Tecnologías utilizadas

### Backend
- **Node.js y Express:** servidor HTTP y API REST.
- **MySQL / MariaDB (mysql2):** base de datos relacional.
- **Multer:** procesamiento de cargas de archivos PDF.
- **JSON Web Tokens (JWT):** autenticación basada en tokens.
- **Bcrypt:** hash de contraseñas.
- **Dotenv:** lectura de variables de entorno.

### Frontend
- **JavaScript (Vanilla):** lógica de interfaz y comunicación asíncrona mediante Fetch API.
- **W3.CSS:** estilos y componentes de interfaz.
- **CSS Custom Properties:** variables para mantener una paleta visual consistente.

---

## ⧉ Estructura del proyecto

~~~text
bibliotech/
├── backend/
│   ├── config/
│   │   ├── migrations/
│   │   │   ├── 001_categories.sql
│   │   │   ├── 002_book_metadata.sql
│   │   │   └── 003_audit_logs.sql
│   │   ├── db.js
│   │   ├── init.sql
│   │   ├── delete.sql
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
│   │   ├── file_helper/
│   │   ├── i18n/
│   │   └── validator/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   ├── html/
│   └── js/
│       ├── components/
│       │   ├── book_editor.js
│       │   └── ui_handlers.js
│       ├── front_controllers/
│       ├── services/
│       ├── tests/
│       └── utils/
├── .gitignore
└── README.md
~~~

---

## ⚙️ Instalación y puesta en marcha

### 1. Prerrequisitos

- **Node.js** (versión 18 o superior recomendada).
- **MySQL o MariaDB** en funcionamiento.
- **Git**, para clonar el repositorio.

### 2. Obtener el proyecto

Cloná el repositorio y entrá en la carpeta del backend:

~~~bash
git clone https://github.com/facudonadio/bibliotech.git
cd bibliotech/backend
~~~

### 3. Configurar las variables de entorno

En la carpeta backend/, copiá el archivo de ejemplo:

~~~bash
cp .env.example .env
~~~

Editá .env y configurá los valores correspondientes a tu instalación:

~~~env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_contrasena
DB_NAME=bibliotech
JWT_SECRET=una_clave_secreta_larga_y_aleatoria
NODE_ENV=development
~~~

No publiques el archivo .env ni compartas sus secretos. El repositorio incluye .env.example como plantilla; las credenciales reales deben configurarse localmente.

### 4. Instalar dependencias

Desde la carpeta backend/:

~~~bash
npm install
~~~

### 5. Preparar la base de datos

Hay dos escenarios posibles. Elegí **uno**, según el estado de la base de datos.

#### A. Instalación nueva

Para crear la base de datos y preparar su estructura inicial, ejecutá desde backend/:

~~~bash
node utils/dbutils/db_setup.js
~~~

El usuario de base de datos configurado debe contar con los permisos necesarios para crear la base y sus objetos.

El archivo backend/config/init.sql contiene la estructura inicial del proyecto, incluidos los objetos necesarios para las funcionalidades actuales.

#### B. Actualización de una base existente

Si ya tenés una base Bibliotech de una versión anterior, realizá primero un respaldo y aplicá las migraciones **una sola vez y en orden**:

1. backend/config/migrations/001_categories.sql
2. backend/config/migrations/002_book_metadata.sql
3. backend/config/migrations/003_audit_logs.sql

Los scripts están preparados para una base llamada bibliotech y cada uno indica en su encabezado los requisitos previos. La primera migración transforma la categoría de texto en una relación con la tabla categories, conservando el texto anterior en category_legacy.

**Importante:** no ejecutes estas migraciones sobre una base que ya fue creada con la versión actual de init.sql, porque esa estructura ya incluye los cambios finales. Tampoco ejecutes una misma migración más de una vez.

### 6. Iniciar la aplicación

Desde la carpeta backend/:

~~~bash
npm start
~~~

El servidor estará disponible en:

~~~text
http://localhost:3000
~~~

---

## ⧉ Guía de uso

Abrí el navegador e ingresá a:

~~~text
http://localhost:3000
~~~

Desde la interfaz se puede:

- Registrar una cuenta e iniciar sesión.
- Cargar archivos PDF.
- Consultar, visualizar y descargar libros.
- Editar los metadatos de los libros según los permisos del usuario.
- Seleccionar categorías obtenidas dinámicamente desde la API.
- Administrar usuarios y consultar las operaciones disponibles para el rol administrador.

---

## ⧉ Laboratorio de pruebas

El proyecto incluye rutas y recursos de prueba para verificar distintos comportamientos de la API.

Cuando corresponda utilizar el entorno de pruebas:

1. Realizá una copia de seguridad de la configuración local.
2. En backend/.env, configurá NODE_ENV=testing.
3. Reiniciá el servidor.
4. Accedé a la interfaz de pruebas, si está habilitada para ese entorno.

Las pruebas incluidas contemplan, entre otros casos:

- Inicio de sesión correcto e incorrecto.
- Validación de contraseñas cortas.
- Prevención de usuarios duplicados.
- Carga y listado de documentos PDF con autenticación.
- Listado administrativo de cuentas.

Ejecutá las pruebas únicamente contra una base de datos de desarrollo o pruebas, nunca contra una base de producción.
