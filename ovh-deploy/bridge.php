<?php
/**
 * GOIZET GESTION - OVH Cloud MySQL Secure Data Bridge
 * Host: uwenyoidb1.mysql.db
 * DB / User: uwenyoidb1
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Bridge-Secret, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
define('DB_HOST', 'uwenyoidb1.mysql.db');
define('DB_NAME', 'uwenyoidb1');
define('DB_USER', 'uwenyoidb1');
define('DB_PASS', 'qNzqptAc3bvZDja');
define('BRIDGE_SECRET', 'goizet_ovh_sec_89d3a7e4b2f1c580');

// Authentication check
$providedSecret = $_SERVER['HTTP_X_BRIDGE_SECRET'] ?? ($_GET['secret'] ?? '');
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?? [];
if (empty($providedSecret) && isset($body['secret'])) {
    $providedSecret = $body['secret'];
}

if ($providedSecret !== BRIDGE_SECRET) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Unauthorized: Invalid or missing X-Bridge-Secret'
    ]);
    exit();
}

// Database Connection
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit();
}

$action = $_GET['action'] ?? ($body['action'] ?? 'ping');

// 1. PING ACTION
if ($action === 'ping') {
    $stmt = $pdo->query("SELECT VERSION() as mysql_version, DATABASE() as current_db");
    $info = $stmt->fetch();
    echo json_encode([
        'success' => true,
        'message' => 'Connected to OVH MySQL database successfully!',
        'database' => $info['current_db'],
        'mysql_version' => $info['mysql_version'],
        'timestamp' => date('c')
    ]);
    exit();
}

// 2. INSTALL ACTION (Create Tables & Migrate Schema)
if ($action === 'install') {
    try {
        $queries = [
            "CREATE TABLE IF NOT EXISTS `admin_users` (
                `id` VARCHAR(64) PRIMARY KEY,
                `name` VARCHAR(255) NOT NULL,
                `email` VARCHAR(255) NOT NULL,
                `role` VARCHAR(64) NOT NULL,
                `avatar` TEXT,
                `active` TINYINT(1) DEFAULT 1,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

            "CREATE TABLE IF NOT EXISTS `owners` (
                `id` VARCHAR(64) PRIMARY KEY,
                `name` VARCHAR(255) NOT NULL,
                `email` VARCHAR(255),
                `phone` VARCHAR(64),
                `address` TEXT,
                `notes` TEXT,
                `status` VARCHAR(64) DEFAULT 'Active',
                `properties_count` INT DEFAULT 0,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

            "CREATE TABLE IF NOT EXISTS `tenants` (
                `id` VARCHAR(64) PRIMARY KEY,
                `name` VARCHAR(255) NOT NULL,
                `email` VARCHAR(255),
                `phone` VARCHAR(64),
                `property_id` VARCHAR(64),
                `property_title` VARCHAR(255),
                `lease_start` VARCHAR(64),
                `lease_end` VARCHAR(64),
                `rent_amount` DECIMAL(10,2) DEFAULT 0,
                `deposit_amount` DECIMAL(10,2) DEFAULT 0,
                `status` VARCHAR(64) DEFAULT 'Active',
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

            "CREATE TABLE IF NOT EXISTS `properties` (
                `id` VARCHAR(64) PRIMARY KEY,
                `reference` VARCHAR(64),
                `title` VARCHAR(255) NOT NULL,
                `slug` VARCHAR(255) UNIQUE NOT NULL,
                `description` MEDIUMTEXT,
                `short_description` TEXT,
                `transaction_type` VARCHAR(32) NOT NULL,
                `property_type` VARCHAR(64) NOT NULL,
                `price` DECIMAL(12,2) NOT NULL,
                `charges` DECIMAL(10,2) DEFAULT 0,
                `deposit` DECIMAL(10,2) DEFAULT 0,
                `surface` DECIMAL(8,2) DEFAULT 0,
                `rooms` INT DEFAULT 1,
                `bedrooms` INT DEFAULT 0,
                `bathrooms` INT DEFAULT 0,
                `floor` INT DEFAULT 0,
                `total_floors` INT DEFAULT 0,
                `year_built` INT DEFAULT 0,
                `energy_rating` VARCHAR(8),
                `ges_rating` VARCHAR(8),
                `address` VARCHAR(255),
                `postal_code` VARCHAR(16),
                `city` VARCHAR(64),
                `neighborhood_slug` VARCHAR(64),
                `neighborhood_name` VARCHAR(128),
                `is_exclusive` TINYINT(1) DEFAULT 0,
                `status` VARCHAR(32) DEFAULT 'available',
                `features` LONGTEXT,
                `images` LONGTEXT,
                `cover_image` TEXT,
                `views` INT DEFAULT 0,
                `enquiries_count` INT DEFAULT 0,
                `owner_id` VARCHAR(64),
                `owner_name` VARCHAR(255),
                `seo_title` VARCHAR(255),
                `seo_description` TEXT,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_slug (`slug`),
                INDEX idx_status (`status`),
                INDEX idx_trans (`transaction_type`),
                INDEX idx_city (`city`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

            "CREATE TABLE IF NOT EXISTS `crm_leads` (
                `id` VARCHAR(64) PRIMARY KEY,
                `name` VARCHAR(255) NOT NULL,
                `email` VARCHAR(255),
                `phone` VARCHAR(64),
                `lead_type` VARCHAR(64),
                `status` VARCHAR(32) DEFAULT 'NEW',
                `subject` VARCHAR(255),
                `message` MEDIUMTEXT,
                `property_address` VARCHAR(255),
                `budget` VARCHAR(64),
                `surface` VARCHAR(64),
                `assigned_to` VARCHAR(64),
                `source` VARCHAR(64),
                `notes` LONGTEXT,
                `activities` LONGTEXT,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (`status`),
                INDEX idx_lead_type (`lead_type`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

            "CREATE TABLE IF NOT EXISTS `activity_logs` (
                `id` VARCHAR(64) PRIMARY KEY,
                `user_name` VARCHAR(255),
                `action` VARCHAR(255),
                `object` VARCHAR(255),
                `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
        ];

        foreach ($queries as $sql) {
            $pdo->exec($sql);
        }

        echo json_encode([
            'success' => true,
            'message' => 'All database tables created successfully in OVH MySQL!'
        ]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit();
    }
}

// HELPER: Format data for JSON columns
function prepareRowData($table, $data) {
    $jsonFields = [
        'properties' => ['features', 'images'],
        'crm_leads' => ['notes', 'activities']
    ];

    $fields = $jsonFields[$table] ?? [];
    foreach ($fields as $f) {
        if (isset($data[$f]) && is_array($data[$f])) {
            $data[$f] = json_encode($data[$f], JSON_UNESCAPED_UNICODE);
        }
    }
    return $data;
}

// HELPER: Parse JSON columns back to arrays
function parseRowData($table, $data) {
    if (!$data) return $data;
    $jsonFields = [
        'properties' => ['features', 'images'],
        'crm_leads' => ['notes', 'activities']
    ];
    $fields = $jsonFields[$table] ?? [];

    foreach ($fields as $f) {
        if (isset($data[$f]) && is_string($data[$f])) {
            $decoded = json_decode($data[$f], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $data[$f] = $decoded;
            }
        }
    }
    return $data;
}

// 3. QUERY HANDLER (CRUD)
try {
    $table = $body['table'] ?? '';
    $allowedTables = ['admin_users', 'owners', 'tenants', 'properties', 'crm_leads', 'activity_logs'];

    // Action: raw_query
    if ($action === 'raw_query') {
        $sql = $body['sql'] ?? '';
        $params = $body['params'] ?? [];
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $rows]);
        exit();
    }

    if (!in_array($table, $allowedTables)) {
        throw new Exception("Invalid table name: '$table'");
    }

    // Action: select
    if ($action === 'select') {
        $select = $body['select'] ?? '*';
        $where = $body['where'] ?? [];
        $order = $body['order'] ?? null;
        $limit = isset($body['limit']) ? (int)$body['limit'] : null;
        $offset = isset($body['offset']) ? (int)$body['offset'] : null;
        $single = !empty($body['single']);

        $sql = "SELECT $select FROM `$table`";
        $params = [];
        $whereClauses = [];

        if (!empty($where)) {
            foreach ($where as $w) {
                $col = preg_replace('/[^a-zA-Z0-9_]/', '', $w[0]);
                $op = strtoupper($w[1]);
                $val = $w[2];

                if ($op === 'IN' && is_array($val)) {
                    $placeholders = implode(',', array_fill(0, count($val), '?'));
                    $whereClauses[] = "`$col` IN ($placeholders)";
                    foreach ($val as $v) $params[] = $v;
                } elseif ($op === 'IS' && $val === null) {
                    $whereClauses[] = "`$col` IS NULL";
                } elseif ($op === 'IS NOT' && $val === null) {
                    $whereClauses[] = "`$col` IS NOT NULL";
                } else {
                    $whereClauses[] = "`$col` $op ?";
                    $params[] = $val;
                }
            }
        }

        if (!empty($whereClauses)) {
            $sql .= " WHERE " . implode(' AND ', $whereClauses);
        }

        if ($order && isset($order['column'])) {
            $orderCol = preg_replace('/[^a-zA-Z0-9_]/', '', $order['column']);
            $orderDir = strtoupper($order['direction'] ?? 'ASC') === 'DESC' ? 'DESC' : 'ASC';
            $sql .= " ORDER BY `$orderCol` $orderDir";
        }

        if ($limit !== null) {
            $sql .= " LIMIT $limit";
            if ($offset !== null) {
                $sql .= " OFFSET $offset";
            }
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        // Decode JSON columns
        $formattedRows = array_map(function($r) use ($table) {
            return parseRowData($table, $r);
        }, $rows);

        if ($single) {
            echo json_encode([
                'success' => true,
                'data' => !empty($formattedRows) ? $formattedRows[0] : null
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'data' => $formattedRows,
                'count' => count($formattedRows)
            ]);
        }
        exit();
    }

    // Action: insert
    if ($action === 'insert') {
        $data = $body['data'] ?? [];
        if (empty($data)) throw new Exception("Insert data cannot be empty");

        $isMultiple = isset($data[0]) && is_array($data[0]);
        $rows = $isMultiple ? $data : [$data];

        $insertedCount = 0;
        foreach ($rows as $row) {
            $row = prepareRowData($table, $row);
            $cols = array_keys($row);
            $colNames = implode('`, `', $cols);
            $placeholders = implode(', ', array_fill(0, count($cols), '?'));
            $sql = "INSERT INTO `$table` (`$colNames`) VALUES ($placeholders)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($row));
            $insertedCount++;
        }

        echo json_encode(['success' => true, 'inserted' => $insertedCount]);
        exit();
    }

    // Action: upsert
    if ($action === 'upsert') {
        $data = $body['data'] ?? [];
        if (empty($data)) throw new Exception("Upsert data cannot be empty");

        $isMultiple = isset($data[0]) && is_array($data[0]);
        $rows = $isMultiple ? $data : [$data];

        $upsertedCount = 0;
        foreach ($rows as $row) {
            $row = prepareRowData($table, $row);
            $cols = array_keys($row);
            $colNames = implode('`, `', $cols);
            $placeholders = implode(', ', array_fill(0, count($cols), '?'));

            $updateParts = [];
            foreach ($cols as $col) {
                if ($col !== 'id') {
                    $updateParts[] = "`$col` = VALUES(`$col`)";
                }
            }
            $updateSql = implode(', ', $updateParts);

            $sql = "INSERT INTO `$table` (`$colNames`) VALUES ($placeholders) ON DUPLICATE KEY UPDATE $updateSql";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($row));
            $upsertedCount++;
        }

        echo json_encode(['success' => true, 'upserted' => $upsertedCount]);
        exit();
    }

    // Action: update
    if ($action === 'update') {
        $data = prepareRowData($table, $body['data'] ?? []);
        $where = $body['where'] ?? [];
        if (empty($data)) throw new Exception("Update data cannot be empty");
        if (empty($where)) throw new Exception("Update must include where condition");

        $setParts = [];
        $params = [];
        foreach ($data as $col => $val) {
            $cleanCol = preg_replace('/[^a-zA-Z0-9_]/', '', $col);
            $setParts[] = "`$cleanCol` = ?";
            $params[] = $val;
        }

        $whereParts = [];
        $whereParams = [];
        foreach ($where as $w) {
            $col = preg_replace('/[^a-zA-Z0-9_]/', '', $w[0]);
            $op = strtoupper($w[1]);
            $whereParts[] = "`$col` $op ?";
            $whereParams[] = $w[2];
        }

        $allParams = array_merge($params, $whereParams);
        $sql = "UPDATE `$table` SET " . implode(', ', $setParts) . " WHERE " . implode(' AND ', $whereParts);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($allParams);

        // Fetch updated representation
        $selectSql = "SELECT * FROM `$table` WHERE " . implode(' AND ', $whereParts);
        $selectStmt = $pdo->prepare($selectSql);
        $selectStmt->execute($whereParams);
        $rows = $selectStmt->fetchAll();
        $formattedRows = array_map(function($r) use ($table) {
            return parseRowData($table, $r);
        }, $rows);

        $single = !empty($body['single']);
        echo json_encode([
            'success' => true,
            'affected' => $stmt->rowCount(),
            'data' => $single ? (!empty($formattedRows) ? $formattedRows[0] : null) : $formattedRows
        ]);
        exit();
    }

    // Action: delete
    if ($action === 'delete') {
        $where = $body['where'] ?? [];
        if (empty($where)) throw new Exception("Delete must include where condition");

        $whereParts = [];
        $whereParams = [];
        foreach ($where as $w) {
            $col = preg_replace('/[^a-zA-Z0-9_]/', '', $w[0]);
            $op = strtoupper($w[1]);
            $whereParts[] = "`$col` $op ?";
            $whereParams[] = $w[2];
        }

        $sql = "DELETE FROM `$table` WHERE " . implode(' AND ', $whereParts);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($whereParams);

        echo json_encode(['success' => true, 'deleted' => $stmt->rowCount()]);
        exit();
    }

    throw new Exception("Unknown action: '$action'");
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit();
}
