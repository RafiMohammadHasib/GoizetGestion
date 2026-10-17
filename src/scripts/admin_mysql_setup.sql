-- ==============================================================================
-- 🏛️ GOIZET GESTION — BASE DE DONNÉES MYSQL / MARIADB CONFIGURATION
-- ==============================================================================
-- Instructions d'exécution :
-- 1. Connectez-vous à phpMyAdmin (ou votre console MySQL OVH / locale).
-- 2. Sélectionnez la base de données : `uwenyoidb1` (ou votre base active).
-- 3. Cliquez sur l'onglet "SQL".
-- 4. Copiez-collez l'ensemble des requêtes ci-dessous et cliquez sur "Exécuter" (Go).
-- ==============================================================================

-- ==============================================================================
-- PARTIE 1 : CONFIGURATION DU COMPTE ADMINISTRATEUR PRINCIPAL
-- Identifiants :
-- Email : admin@gg.fr.com
-- Mot de passe : @dmin@gg.fr
-- ==============================================================================

-- Insertion / Mise à jour de l'administrateur
INSERT INTO `admin_users` (
  `id`, 
  `name`, 
  `email`, 
  `role`, 
  `avatar`, 
  `active`
)
VALUES (
  'usr_admin',
  'Administrateur Goizet Gestion',
  'admin@gg.fr.com',
  'Super Admin',
  '/apple-touch-icon.png',
  1
) AS new_user
ON DUPLICATE KEY UPDATE
  `name` = new_user.`name`,
  `role` = new_user.`role`,
  `avatar` = new_user.`avatar`,
  `active` = 1;

-- (Optionnel) Si votre table `admin_users` stocke également les colonnes de mot de passe :
-- ALTER TABLE `admin_users` ADD COLUMN `password` VARCHAR(255) NULL AFTER `email`;
-- ALTER TABLE `admin_users` ADD COLUMN `password_hash` VARCHAR(255) NULL AFTER `password`;
-- UPDATE `admin_users` 
-- SET `password` = '@dmin@gg.fr', `password_hash` = SHA2('@dmin@gg.fr', 256) 
-- WHERE `email` = 'admin@gg.fr.com';


-- ==============================================================================
-- PARTIE 2 : TABLE DES PARAMÈTRES GLOBAUX & SYSTÈME (agency_settings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS `agency_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  -- 1. Identité de l'Agence
  `site_name` VARCHAR(255) NOT NULL DEFAULT 'GOIZET GESTION',
  `tagline` VARCHAR(255) DEFAULT 'Immobilier & Gestion Locative à Bordeaux',
  `phone` VARCHAR(64) DEFAULT '+33 6 95 57 70 33',
  `phone_edgar` VARCHAR(64) DEFAULT '+33 7 81 96 83 95',
  `email` VARCHAR(255) DEFAULT 'goizetgestion@gmail.com',
  `lead_email` VARCHAR(255) DEFAULT 'goizetgestion@gmail.com',
  `address` VARCHAR(255) DEFAULT '48 rue Calvé, 33000 Bordeaux',
  `opening_hours` VARCHAR(255) DEFAULT 'Lundi - Vendredi : 09h00 - 19h00 | Samedi : Sur rendez-vous',
  `siret` VARCHAR(64) DEFAULT '944 393 487 00011',
  `license_number` VARCHAR(128) DEFAULT 'CPI33012025000000128 — CCI Bordeaux',
  `financial_guarantee` VARCHAR(255) DEFAULT 'Galian Assurances — 120 000 €',

  -- 2. Règles Métier & Gestion Locative
  `management_fee_rate` DECIMAL(5,2) DEFAULT 6.50 COMMENT 'Taux standard gestion locative %',
  `default_deposit_months` INT DEFAULT 1 COMMENT 'Dépôt de garantie en mois de loyer HC',
  `gli_insurance_rate` DECIMAL(5,2) DEFAULT 2.50 COMMENT 'Taux Garantie Loyers Impayés %',
  `auto_reply_tenant` TINYINT(1) DEFAULT 1 COMMENT 'Accusé de réception auto candidat locataire',
  `auto_reply_owner` TINYINT(1) DEFAULT 1 COMMENT 'Accusé de réception auto propriétaire bailleur',

  -- 3. Système & Exploitation
  `maintenance_mode` TINYINT(1) DEFAULT 0 COMMENT 'Mode maintenance 0=Désactivé, 1=Activé',
  `session_timeout_hours` INT DEFAULT 24 COMMENT 'Durée validité session admin en heures',
  `rate_limiting_strict` TINYINT(1) DEFAULT 1 COMMENT 'Protection anti-bruteforce active',

  -- 4. Réseaux Sociaux & Visibilité
  `instagram_url` VARCHAR(255) DEFAULT 'https://instagram.com/goizetgestion',
  `linkedin_url` VARCHAR(255) DEFAULT 'https://linkedin.com/company/goizet-gestion',

  -- 5. Analytics & Référencement (SEO)
  `ga_measurement_id` VARCHAR(64) DEFAULT 'G-GOIZET2026',
  `gtm_container_id` VARCHAR(64) DEFAULT 'GTM-GOIZET01',
  `default_seo_title` VARCHAR(255) DEFAULT 'GOIZET GESTION | Immobilier & Gestion Locative à Bordeaux',
  `default_meta_description` TEXT,

  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initialisation des paramètres par défaut
INSERT INTO `agency_settings` (
  `id`, 
  `site_name`, 
  `tagline`, 
  `phone`, 
  `phone_edgar`, 
  `email`, 
  `lead_email`, 
  `address`, 
  `opening_hours`, 
  `siret`, 
  `license_number`, 
  `financial_guarantee`, 
  `management_fee_rate`, 
  `default_deposit_months`, 
  `gli_insurance_rate`, 
  `auto_reply_tenant`, 
  `auto_reply_owner`, 
  `maintenance_mode`, 
  `session_timeout_hours`, 
  `rate_limiting_strict`, 
  `instagram_url`, 
  `linkedin_url`, 
  `ga_measurement_id`, 
  `gtm_container_id`, 
  `default_seo_title`, 
  `default_meta_description`
) VALUES (
  1,
  'GOIZET GESTION',
  'Immobilier & Gestion Locative à Bordeaux',
  '+33 6 95 57 70 33',
  '+33 7 81 96 83 95',
  'goizetgestion@gmail.com',
  'goizetgestion@gmail.com',
  '48 rue Calvé, 33000 Bordeaux',
  'Lundi - Vendredi : 09h00 - 19h00 | Samedi : Sur rendez-vous',
  '944 393 487 00011',
  'CPI33012025000000128 — CCI Bordeaux',
  'Galian Assurances — 120 000 €',
  6.50,
  1,
  2.50,
  1,
  1,
  0,
  24,
  1,
  'https://instagram.com/goizetgestion',
  'https://linkedin.com/company/goizet-gestion',
  'G-GOIZET2026',
  'GTM-GOIZET01',
  'GOIZET GESTION | Immobilier & Gestion Locative à Bordeaux',
  'Maison de conseil immobilier et gestion locative sur-mesure à Bordeaux (Chartrons, Caudéran, Triangle d\'Or). Mandat transparent et rendement optimisé.'
) AS new_settings
ON DUPLICATE KEY UPDATE
  `site_name` = new_settings.`site_name`,
  `tagline` = new_settings.`tagline`,
  `phone` = new_settings.`phone`,
  `phone_edgar` = new_settings.`phone_edgar`,
  `email` = new_settings.`email`,
  `lead_email` = new_settings.`lead_email`,
  `address` = new_settings.`address`,
  `opening_hours` = new_settings.`opening_hours`,
  `siret` = new_settings.`siret`,
  `license_number` = new_settings.`license_number`,
  `financial_guarantee` = new_settings.`financial_guarantee`,
  `management_fee_rate` = new_settings.`management_fee_rate`,
  `default_deposit_months` = new_settings.`default_deposit_months`,
  `gli_insurance_rate` = new_settings.`gli_insurance_rate`,
  `auto_reply_tenant` = new_settings.`auto_reply_tenant`,
  `auto_reply_owner` = new_settings.`auto_reply_owner`,
  `maintenance_mode` = new_settings.`maintenance_mode`,
  `session_timeout_hours` = new_settings.`session_timeout_hours`,
  `rate_limiting_strict` = new_settings.`rate_limiting_strict`,
  `instagram_url` = new_settings.`instagram_url`,
  `linkedin_url` = new_settings.`linkedin_url`,
  `ga_measurement_id` = new_settings.`ga_measurement_id`,
  `gtm_container_id` = new_settings.`gtm_container_id`,
  `default_seo_title` = new_settings.`default_seo_title`,
  `default_meta_description` = new_settings.`default_meta_description`,
  `updated_at` = CURRENT_TIMESTAMP;


-- ==============================================================================
-- PARTIE 3 : REQUÊTES DE VÉRIFICATION
-- ==============================================================================
-- 1. Vérifier l'utilisateur admin
SELECT `id`, `name`, `email`, `role`, `active`
FROM `admin_users` 
WHERE `email` = 'admin@gg.fr.com';

-- 2. Vérifier les paramètres agence
SELECT `id`, `site_name`, `phone`, `email`, `management_fee_rate`, `updated_at`
FROM `agency_settings`
WHERE `id` = 1;
