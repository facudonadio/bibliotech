/*
 * @file 004_delete_affected_rows.sql
 * @brief Actualiza los procedimientos de borrado para informar filas realmente eliminadas.
 * @project Bibliotech
 * @details Aplicar una sola vez luego de 003_audit_logs.sql sobre bases existentes.
 *          La respuesta affectedRows permite evitar falsos éxitos y eventos de auditoría
 *          cuando el identificador no corresponde a un registro existente o autorizado.
 */
USE bibliotech;
SET NAMES utf8mb4;

DROP PROCEDURE IF EXISTS sp_delete_user;
DROP PROCEDURE IF EXISTS sp_delete_book;

DELIMITER //

/**
 * @brief Elimina una cuenta y devuelve la cantidad real de filas afectadas.
 * @param p_id Identificador de la cuenta que se desea eliminar.
 * @details La cascada de claves foráneas elimina sus roles y metadatos documentales.
 */
CREATE PROCEDURE sp_delete_user(IN p_id INT)
BEGIN
    DELETE FROM users WHERE id = p_id;
    SELECT ROW_COUNT() AS affectedRows;
END //

/**
 * @brief Elimina un libro únicamente si pertenece al usuario indicado.
 * @param p_id Identificador del documento.
 * @param p_user_id Identificador del propietario autenticado.
 * @details Devuelve ROW_COUNT para confirmar que la eliminación ocurrió.
 */
CREATE PROCEDURE sp_delete_book(IN p_id INT, IN p_user_id INT)
BEGIN
    DELETE FROM books WHERE id = p_id AND user_id = p_user_id;
    SELECT ROW_COUNT() AS affectedRows;
END //

DELIMITER ;
