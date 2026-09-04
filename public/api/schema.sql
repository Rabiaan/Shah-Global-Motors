-- ==========================================================
-- Shahglobal Luxury Dealership - MySQL Database Schema
-- Compatible with cPanel MySQL / MariaDB (PHP 7.4 - 8.3+)
-- Import this file in cPanel > phpMyAdmin > Import
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: admin_users
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin Account (Username: admin | Password: shahglobal2025)
-- Password hash generated via password_hash('shahglobal2025', PASSWORD_BCRYPT)
INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `role`) VALUES
(1, 'admin', 'admin@shahglobal.com', '$2y$10$Q7eY9X0vMhLp1G3BfQpBw.vE0bK0C8wH5Kj2N1M9L7P3O5R7T9V1X', 'Super Admin')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- --------------------------------------------------------
-- Table: vehicles
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` VARCHAR(64) PRIMARY KEY,
  `make` VARCHAR(100) NOT NULL,
  `model` VARCHAR(150) NOT NULL,
  `year` INT NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `mileage` INT NOT NULL DEFAULT 0,
  `engine` VARCHAR(150) NOT NULL,
  `transmission` VARCHAR(100) NOT NULL,
  `fuel_type` VARCHAR(50) NOT NULL,
  `body_type` VARCHAR(50) NOT NULL,
  `color` VARCHAR(80) NOT NULL,
  `category` ENUM('New', 'Used') NOT NULL DEFAULT 'New',
  `availability` ENUM('Available', 'Reserved', 'Sold') NOT NULL DEFAULT 'Available',
  `condition` VARCHAR(80) NOT NULL DEFAULT 'Brand New',
  `location` VARCHAR(150) NOT NULL DEFAULT 'Silicon Valley Showroom',
  `description` TEXT,
  `features` JSON,
  `images` JSON,
  `horsepower` INT DEFAULT 0,
  `top_speed` VARCHAR(50) DEFAULT '200 mph',
  `acceleration` VARCHAR(50) DEFAULT '3.0s',
  `vin` VARCHAR(100) UNIQUE,
  `date_added` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_make` (`make`),
  INDEX `idx_category` (`category`),
  INDEX `idx_availability` (`availability`),
  INDEX `idx_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: test_drives
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test_drives` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64) NULL,
  `vehicle_name` VARCHAR(200) NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `preferred_date` DATE NOT NULL,
  `preferred_time` VARCHAR(50) NOT NULL,
  `notes` TEXT,
  `status` ENUM('Pending', 'Approved', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_date` (`preferred_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: enquiries
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64) NULL,
  `vehicle_name` VARCHAR(200) NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'Contacted', 'Closed') NOT NULL DEFAULT 'New',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_enquiry_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: sell_requests
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sell_requests` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `make` VARCHAR(100) NOT NULL,
  `model` VARCHAR(150) NOT NULL,
  `year` INT NOT NULL,
  `mileage` INT NOT NULL,
  `condition` VARCHAR(80) NOT NULL,
  `expected_price` DECIMAL(12,2) NOT NULL,
  `offer_amount` DECIMAL(12,2) NULL,
  `notes` TEXT,
  `images` JSON,
  `status` ENUM('Pending', 'Under Review', 'Offer Made', 'Accepted', 'Declined') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sell_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
