/*
 * @file 001_categories.sql
 * @brief Migra categorías de texto a una tabla normalizada.
 * @project Bibliotech
 * @details Ejecutar UNA SOLA VEZ sobre una base bibliotech existente y con respaldo previo.
 *          No elimina ni recrea la base de datos, usuarios, libros ni la columna category antigua.
 *          Categorías desconocidas o nulas se asignan a 'Otros'.
 */
USE bibliotech;
SET NAMES utf8mb4;

/** @brief Crea el catálogo de categorías disponibles en Bibliotech. */
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO categories (name) VALUES
    ('Novela'), ('Ciencia Ficción'), ('Técnico / Académico'),
    ('Historia'), ('Poesía'), ('Otros');

-- Agregamos la referencia como nullable mientras se migran los registros existentes.
ALTER TABLE books ADD COLUMN category_id INT NULL AFTER category;

-- Conservamos el significado de las categorías conocidas y agrupamos las restantes en 'Otros'.
UPDATE books AS b
LEFT JOIN categories AS c
    ON TRIM(b.category) COLLATE utf8mb4_unicode_ci = c.name
SET b.category_id = COALESCE(
    c.id,
    (SELECT other_category.id FROM categories AS other_category WHERE other_category.name = 'Otros')
);

-- Una vez migradas las filas, imponemos la integridad referencial.
ALTER TABLE books
    MODIFY COLUMN category_id INT NOT NULL,
    ADD CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES categories(id);

DELIMITER //

/**
 * @brief Inserta un libro usando el identificador de una categoría.
 * @param p_category_id Identificador existente en categories.
 */
CREATE PROCEDURE sp_create_book_v2(
    IN p_user_id INT,
    IN p_filename VARCHAR(255),
    IN p_title VARCHAR(100),
    IN p_author VARCHAR(100),
    IN p_category_id INT,
    IN p_pages INT,
    IN p_file_path VARCHAR(255)
)
BEGIN
    INSERT INTO books (user_id, filename, title, author, category_id, pages, file_path)
    VALUES (p_user_id, p_filename, p_title, p_author, p_category_id, p_pages, p_file_path);
    SELECT LAST_INSERT_ID() AS insertId;
END //

/** @brief Lista los libros de un usuario junto con el nombre legible de su categoría. */
CREATE PROCEDURE sp_find_books_by_user_v2(IN p_user_id INT)
BEGIN
    SELECT b.*, c.name AS category
    FROM books b JOIN categories c ON b.category_id = c.id
    WHERE b.user_id = p_user_id;
END //

/** @brief Busca un libro por ID y propietario, incluyendo el nombre de la categoría. */
CREATE PROCEDURE sp_find_book_by_id_v2(IN p_id INT, IN p_user_id INT)
BEGIN
    SELECT b.*, c.name AS category
    FROM books b JOIN categories c ON b.category_id = c.id
    WHERE b.id = p_id AND b.user_id = p_user_id;
END //

/** @brief Devuelve el catálogo de categorías para cargar los formularios. */
CREATE PROCEDURE sp_get_all_categories()
BEGIN
    SELECT id, name FROM categories ORDER BY id;
END //

DELIMITER ;

-- Verificación: esta consulta debe devolver cero filas.
SELECT b.id, b.category_id
FROM books AS b LEFT JOIN categories AS c ON b.category_id = c.id
WHERE c.id IS NULL;
