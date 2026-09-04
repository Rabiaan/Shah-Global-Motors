-- ============================================================================
-- api-core/security_schema.sql
-- ============================================================================
-- Additions required by api-core auth, rate limiting, and password reset.
-- Run AFTER your base schema. Safe to re-run (all IF NOT EXISTS).
--
-- REQUIREMENTS COVERED:
--   [#3] users table uses a BINARY(16) UUID (rendered as canonical UUID string).
--   [#4] auth_sessions + password_reset_tokens with proper indexes.
--   [#8] Indexes added to high-traffic fields (lookup columns, FKs, statuses).
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ---------------------------------------------------------------------------
-- users — central user table keyed by UUID
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `uuid`          BINARY(16)    NOT NULL PRIMARY KEY,               -- canonical UUID
  `email`         VARCHAR(191)  NOT NULL,
  `password_hash` VARCHAR(255)  NOT NULL,
  `role`          VARCHAR(20)   NOT NULL DEFAULT 'user',
  `display_name`  VARCHAR(100)  NULL,
  `created_at`    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_users_email` (`email`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- auth_sessions — optional server-side revocation list (JWT jti revocation)
-- Indexed on user_uuid (high-traffic lookup) for quick revocation after reset.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `auth_sessions` (
  `id`         BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_uuid`  BINARY(16)    NOT NULL,
  `jti`        VARCHAR(64)   NOT NULL,
  `ip`         VARCHAR(45)   NOT NULL,
  `expires_at` DATETIME      NOT NULL,
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_sessions_jti` (`jti`),
  INDEX `idx_sessions_user_uuid` (`user_uuid`),       -- high-traffic: per-user queries
  INDEX `idx_sessions_expires` (`expires_at`),        -- high-traffic: cleanup sweep
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- password_reset_tokens — 30-minute, single-use reset tokens (stored hashed)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id`         BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_uuid`  BINARY(16)    NOT NULL,
  `token_hash` CHAR(64)      NOT NULL,               -- SHA-256 of raw token
  `expires_at` DATETIME      NOT NULL,               -- now + 30 min
  `used`       TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_reset_token_hash` (`token_hash`),
  INDEX `idx_reset_user_uuid` (`user_uuid`),
  INDEX `idx_reset_expires` (`expires_at`),          -- high-traffic: expiry sweep
  CONSTRAINT `fk_reset_user` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- rate_limit — sliding-window limiter buckets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rate_limit` (
  `id`           BIGINT AUTO_INCREMENT PRIMARY KEY,
  `bucket`       CHAR(32)    NOT NULL,               -- hash(ip|scope)
  `scope`        VARCHAR(32) NOT NULL DEFAULT 'general',
  `hits`         INT         NOT NULL DEFAULT 1,
  `window_start` BIGINT      NOT NULL,               -- unix seconds
  UNIQUE KEY `uq_rate_bucket_scope` (`bucket`, `scope`),   -- primary lookup key
  INDEX `idx_rate_window` (`window_start`)                -- cleanup sweep
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- auth_failures — account lockout tracking (brute force protection)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `auth_failures` (
  `id`         BIGINT AUTO_INCREMENT PRIMARY KEY,
  `bucket`     CHAR(32)   NOT NULL,                  -- hash of email/username
  `fails`      INT        NOT NULL DEFAULT 1,
  `last_fail`  BIGINT     NOT NULL,
  UNIQUE KEY `uq_auth_fail_bucket` (`bucket`),
  INDEX `idx_auth_fail_last` (`last_fail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INDEX GUIDANCE (requirement #8) for pre-existing tables.
-- Add these to YOUR existing high-traffic business tables if not already present.
-- ============================================================================

-- vehicles: lookup by make/category/availability/price (commonly filtered/sorted)
--   ALTER TABLE `vehicles` ADD INDEX `idx_make` (make);
--   ALTER TABLE `vehicles` ADD INDEX `idx_category` (category);
--   ALTER TABLE `vehicles` ADD INDEX `idx_availability` (availability);
--   ALTER TABLE `vehicles` ADD INDEX `idx_price` (price);

-- enquiries/test_drives/sell_requests: status columns drive admin dashboards
--   ALTER TABLE `enquiries`    ADD INDEX `idx_enquiries_status` (status);
--   ALTER TABLE `test_drives`  ADD INDEX `idx_testdrives_status` (status);
--   ALTER TABLE `sell_requests`ADD INDEX `idx_sellrequests_status` (status);

-- FK columns that will now reference users
--   ALTER TABLE `your_owned_row_table` ADD INDEX `idx_owned_user_uuid` (user_uuid);

-- ---------------------------------------------------------------------------
-- GLOBAL INDEX POLICY:
--   * Index every column used in WHERE, JOIN, or ORDER BY on hot tables.
--   * Keep indexes narrow (prefix on long VARCHAR).
--   * Composite indexes follow "leftmost prefix" — put equality cols first.
--   * Run `EXPLAIN SELECT ...` to confirm indexes are used.
-- ---------------------------------------------------------------------------
