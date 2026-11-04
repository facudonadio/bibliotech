/*
 * @file 002_book_metadata.sql
 * @brief Agrega procedimientos para editar metadatos y listar libros en administración.
 * @project Bibliotech
 * @details Ejecutar UNA SOLA VEZ sobre una base que ya tenga aplicada 001_categories.sql.
 *          No altera archivos PDF ni modifica columnas o registros existentes.
 */
USE bibliotech;
SET NAMES utf8mb4;

DROP PROCEDURE IF EXISTS sp_update_book_metadata;
DROP PROCEDURE IF EXISTS sp_find_all_books_v2;

DELIMITER //

/**
 * @brief Actualiza metadatos solo si el usuario es propietario o administrador.
 * @details No modifica filename ni file_path, por lo que el PDF permanece intacto.
 */
CREATE PROCEDURE sp_update_book_metadata(
    IN p_id INT,
    IN p_user_id INT,
    IN p_is_admin TINYINT,
    IN p_title VARCHAR(100),
    IN p_author VARCHAR(100),
    IN p_category_id INT,
    IN p_pages INT
)
BEGIN
    UPDATE books
    SET title = p_title,
        author = p_author,
        category_id = p_category_id,
        pages = p_pages
    WHERE id = p_id
      AND (p_is_admin = 1 OR user_id = p_user_id);

    -- Se devuelve una fila si el libro existe y el solicitante está autorizado,
    -- incluso si los valores enviados eran iguales a los ya almacenados.
    SELECT id
    FROM books
    WHERE id = p_id
      AND (p_is_admin = 1 OR user_id = p_user_id);
END //

/**
 * @brief Lista todos los libros con categoría y propietario para el panel admin.
 */
CREATE PROCEDURE sp_find_all_books_v2()
BEGIN
    SELECT b.*, c.name AS category, u.username AS owner_username
    FROM books b
    JOIN categories c ON b.category_id = c.id
    JOIN users u ON b.user_id = u.id
    ORDER BY b.id DESC;
END //

DELIMITER ;
