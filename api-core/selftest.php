<?php
// api-core/selftest.php — quick sanity checks for the scaffold modules.
// WARNING: use ONLY in development. Delete before production.
putenv('JWT_SECRET=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
putenv('APP_ENV=development');
putenv('ALLOWED_ORIGINS=https://example.com');
putenv('JWT_TTL_SECONDS=3600');
putenv('PASSWORD_RESET_TTL_SECONDS=1800');
putenv('LOG_DIRECTORY=__DIR__/storage/logs');

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/auth.php';

$pass = 0; $fail = 0;
function check(string $label, bool $cond): void {
    global $pass, $fail;
    if ($cond) { $pass++; echo "[PASS] $label\n"; }
    else { $fail++; echo "[FAIL] $label\n"; }
}

// --- JWT ------------------------------------------------------------------
$t = issueToken(['uuid' => '12345678-1234-1234-1234-123456789abc', 'role' => 'admin']);
check('JWT token issued', !empty($t['token']) && $t['expires_in'] === 3600);
$p = jwtVerify($t['token']);
check('JWT verifies to correct sub UUID', ($p['sub'] ?? '') === '12345678-1234-1234-1234-123456789abc');

$bad = substr($t['token'], 0, -1) . 'x';
check('Tampered token rejected', jwtVerify($bad) === null);

$now = time();
$exp = jwtSign(['alg' => 'HS256'], ['iss'=>'api','aud'=>'api','sub'=>'u','jti'=>'x','iat'=>$now-7200,'nbf'=>$now-7200,'exp'=>$now-3600,'sid'=>'s','scp'=>'user']);
check('Expired token rejected', jwtVerify($exp) === null);

$wrongAud = jwtSign(['alg' => 'HS256'], ['iss'=>'api','aud'=>'other','sub'=>'u','jti'=>'x','iat'=>$now-10,'nbf'=>$now-10,'exp'=>$now+3600,'sid'=>'s','scp'=>'user']);
check('Wrong-audience token rejected', jwtVerify($wrongAud) === null);

// --- security (XSS + validation) -------------------------------------------
require __DIR__ . '/security.php';
$clean = sanitizeInput('<script>alert(1)</script>Hello <img src=x onerror=alert(2)> World');
check('XSS stripped from input', strpos($clean, '<script>') === false && strpos($clean, 'onerror') === false && strpos($clean, 'Hello') !== false);
check('htmlEscape escapes <>&', htmlEscape('<b>&') === '&lt;b&gt;&amp;');
check('validateEmail rejects bad', validateEmail('not-an-email') === null);
check('validateEmail accepts good', validateEmail('a@b.com') === 'a@b.com');
check('validateString range', validateString('ok', 1, 10) === 'ok' && validateString('toolongstring', 1, 5) === null);

// --- SQL injection guard ----------------------------------------------------
require __DIR__ . '/database.php';
// The guard calls exit() on match, so test via a separate function that returns bool.
function guardedSQL(string $sql): bool {
    // Replicate guard check without exit
    $patterns = [
        '/;\s*(DROP|DELETE|TRUNCATE|ALTER|RENAME)\b/i',
        '/\b(DROP|TRUNCATE|ALTER|RENAME)\s+(TABLE|DATABASE)/i',
        '/--/', '/\/\*/',
        '/\b(UNION\s+(ALL\s+)?SELECT|UNION\s+ALL)\b/i',
        '/\b(SLEEP|BENCHMARK|LOAD_FILE|INTO\s+OUTFILE|INTO\s+DUMPFILE)\b/i',
        '/\b(IN|NOT\s+IN|EXISTS)\s*\(?\s*SELECT\b/i',
    ];
    foreach ($patterns as $p) if (preg_match($p, $sql)) return true;
    return false;
}
check('Guard flags UNION SELECT', guardedSQL('SELECT * FROM t UNION SELECT pw FROM users') === true);
check('Guard flags stacked drop', guardedSQL('SELECT * FROM t; DROP TABLE users') === true);
check('Guard flags comments', guardedSQL('SELECT * FROM t WHERE id=1--') === true);
check('Guard flags nested IN subquery', guardedSQL('SELECT * FROM notes WHERE user IN (SELECT uuid FROM users)') === true);
check('Guard passes benign SELECT', guardedSQL('SELECT * FROM user_notes WHERE user_uuid = ?') === false);

echo "\nRESULTS: $pass passed, $fail failed\n";
exit($fail === 0 ? 0 : 1);
