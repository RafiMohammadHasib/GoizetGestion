-- ==============================================================================
-- 🏛️ GOIZET GESTION — ADMIN USER SETUP FOR MYSQL / MARIADB
-- ==============================================================================
-- Target User:
-- Email: admin@gg.fr.com
-- Password: @dmin@gg.fr
-- ==============================================================================

-- ==============================================================================
-- OPTION A (RECOMMENDED): Insert into your EXISTING `admin_users` table
-- (Matches the existing schema: id, name, email, role, avatar, active)
-- ==============================================================================
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
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `role` = VALUES(`role`),
  `avatar` = VALUES(`avatar`),
  `active` = 1;


-- ==============================================================================
-- OPTION B: If you want to store the password column inside MySQL as well:
-- Step 1: Add the columns to your existing table
-- ==============================================================================
-- ALTER TABLE `admin_users` ADD COLUMN `password` VARCHAR(255) NULL AFTER `email`;
-- ALTER TABLE `admin_users` ADD COLUMN `password_hash` VARCHAR(255) NULL AFTER `password`;

-- Step 2: Then run this insert with passwords:
-- INSERT INTO `admin_users` (
--   `id`, `name`, `email`, `password`, `password_hash`, `role`, `avatar`, `active`
-- )
-- VALUES (
--   'usr_admin',
--   'Administrateur Goizet Gestion',
--   'admin@gg.fr.com',
--   '@dmin@gg.fr',
--   SHA2('@dmin@gg.fr', 256),
--   'Super Admin',
--   '/apple-touch-icon.png',
--   1
-- )
-- ON DUPLICATE KEY UPDATE
--   `name` = VALUES(`name`),
--   `password` = VALUES(`password`),
--   `password_hash` = VALUES(`password_hash`),
--   `role` = VALUES(`role`),
--   `active` = 1;


-- ==============================================================================
-- Verification Query
-- ==============================================================================
SELECT `id`, `name`, `email`, `role`, `active`
FROM `admin_users` 
WHERE `email` = 'admin@gg.fr.com';
