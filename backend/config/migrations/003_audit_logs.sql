/*
 * @file 003_audit_logs.sql
 * @brief Incorpora persistencia de eventos críticos para trazabilidad y auditoría.
 * @project Bibliotech
 * @details Aplicar una sola vez sobre una base que ya tenga las migraciones 001 y 002.
 *          La tabla no declara FK hacia users para conservar auditoría aunque una cuenta
 *          registrada en user_id sea eliminada posteriormente.
 */

USE bibliotech;
SET NAMES utf8mb4;

/**
 * @brief Almacena eventos críticos sin depender del ciclo de vida de la cuenta auditada.
 * @details user_id identifica al actor que ejecutó la acción; target identifica el recurso afectado.
 */
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    target VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_logs_user_created (user_id, created_at),
    INDEX idx_audit_logs_action_created (action, created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

DELIMITER //

/**
 * @brief Persiste un evento de auditoría mediante parámetros tipados.
 * @param p_user_id Identificador del usuario autenticado que ejecutó la acción.
 * @param p_action Código estable de la acción, por ejemplo DELETE_BOOK o DELETE_USER.
 * @param p_target Identificador del recurso afectado.
 * @param p_ip_address Dirección IP disponible en la petición, o NULL.
 */
CREATE PROCEDURE sp_create_audit_log(
    IN p_user_id INT,
    IN p_action VARCHAR(50),
    IN p_target VARCHAR(255),
    IN p_ip_address VARCHAR(45)
)
BEGIN
    INSERT INTO audit_logs (user_id, action, target, ip_address)
    VALUES (p_user_id, p_action, p_target, p_ip_address);
END //

DELIMITER ;
