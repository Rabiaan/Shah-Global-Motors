<?php
/**
 * ============================================================================
 * api-core/database.php
 * ============================================================================
 * Reusable PDO connection factory + query helpers.
 *
 * SQL INJECTION protection [requirement #4]:
 *   - PDO with EMULATE_PREPARES = false (native server-side prepared statements)
 *   - ERRMODE_EXCEPTION so every error is caught centrally
 *   - All queries built in endpoints MUST use ? placeholders via these helpers,
 *     never string interpolation of user input.
 *   - A SQL "injection guard" flag blocks raw string concatenation patterns that
 *     contain user input (defense in depth on top of prepared statements).
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if (!function_exists('getDb')) {
    /**
     * Returns a shared PDO connection (lazily created once per request).
     */
    function getDb(): PDO
    {
        static $pdo = null;
        if ($pdo instanceof PDO) return $pdo;

        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // <-- native prepared statements = injection safe
            PDO::ATTR_PERSISTENT         => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            apiCoreLog('critical', 'Database connection failed', ['message' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['status' => 'error', 'message' => 'Database unavailable']);
            exit;
        }
        return $pdo;
    }
}

if (!function_exists('dbQuery')) {
    /**
     * Safely run a prepared SELECT and return all rows.
     * Use ONLY the '?' placeholder style. Never pass a user-controlled value
     * directly into the SQL string itself.
     */
    function dbQuery(string $sql, array $params = []): array
    {
        sqlInjectionGuard($sql);
        $stmt = getDb()->prepare($sql);
        bindParams($stmt, $params);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}

if (!function_exists('dbRow')) {
    /** Run a prepared SELECT and return a single row (or null). */
    function dbRow(string $sql, array $params = []): ?array
    {
        sqlInjectionGuard($sql);
        $stmt = getDb()->prepare($sql);
        bindParams($stmt, $params);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }
}

if (!function_exists('dbExecute')) {
    /** Run a prepared INSERT/UPDATE/DELETE; returns affected row count. */
    function dbExecute(string $sql, array $params = []): int
    {
        sqlInjectionGuard($sql);
        $stmt = getDb()->prepare($sql);
        bindParams($stmt, $params);
        $stmt->execute();
        return $stmt->rowCount();
    }
}

if (!function_exists('dbLastId')) {
    function dbLastId(): string
    {
        return getDb()->lastInsertId();
    }
}

if (!function_exists('bindParams')) {
    function bindParams(PDOStatement $stmt, array $params): void
    {
        $i = 1;
        foreach ($params as $key => $value) {
            $type = match (true) {
                is_int($value)   => PDO::PARAM_INT,
                is_bool($value)  => PDO::PARAM_BOOL,
                is_null($value)  => PDO::PARAM_NULL,
                default          => PDO::PARAM_STR,
            };
            $stmt->bindValue($key, $value, $type);
            $i++;
        }
    }
}

if (!function_exists('sqlInjectionGuard')) {
    /**
     * Defense-in-depth: reject SQL strings that attempt to escape the intended
     * prepared-statement structure. This is a guard against accidental/injected
     * raw concatenation of user input into the query string.
     *
     * It flags suspicious patterns rather than trying to sanitise a query —
     * the real protection is always the prepared statement + bound parameters.
     */
    function sqlInjectionGuard(string $sql): void
    {
        static $patterns = [
            '/;\s*(DROP|DELETE|TRUNCATE|ALTER|RENAME)\b/i',      // stacked DDL/DML
            '/\b(DROP|TRUNCATE|ALTER|RENAME)\s+(TABLE|DATABASE)/i',
            '/--/',                                                // SQL comment
            '/\/\*/',                                              // block comment
            '/\b(UNION\s+(ALL\s+)?SELECT|UNION\s+ALL)\b/i',        // union-based exfil
            '/\b(SLEEP|BENCHMARK|LOAD_FILE|INTO\s+OUTFILE|INTO\s+DUMPFILE)\b/i', // time/file attacks
            // Nested select injection ONLY when it's clearly an extra in-band
            // subquery appended into a WHERE/IN clause, not a normal single
            // "SELECT ... FROM" statement (which is standard and allowed).
            '/\b(IN|NOT\s+IN|EXISTS)\s*\(?\s*SELECT\b/i',
        ];
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $sql)) {
                apiCoreLog('critical', 'SQL injection attempt blocked', ['sql' => $sql]);
                http_response_code(403);
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode(['status' => 'error', 'message' => 'Request blocked']);
                exit;
            }
        }
    }
}
