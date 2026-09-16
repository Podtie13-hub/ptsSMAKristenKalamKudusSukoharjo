export function generatePhpBackendCode(): { configPhp: string; apiPhp: string; readme: string } {
  const configPhp = `<?php
/**
 * Konfigurasi Database MySQL
 * SMA Kristen Kalam Kudus Sukoharjo - Sistem Rapor PTS
 */
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'db_rapor_kalamkudus');
define('DB_PORT', 3306);

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Koneksi database gagal: ' . $e->getMessage()]);
    exit;
}
?>`;

  const apiPhp = `<?php
/**
 * REST API Backend (PHP) - Sistem Rapor PTS
 * SMA Kristen Kalam Kudus Sukoharjo
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db_config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_academic_year':
        $stmt = $pdo->query("SELECT * FROM tahun_akademik WHERE is_active = 1 LIMIT 1");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetch()]);
        break;

    case 'get_students_by_class':
        $classId = $_GET['class_id'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM siswa WHERE kelas_id = ? ORDER BY nama_lengkap ASC");
        $stmt->execute([$classId]);
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'save_pts_grade':
        // Guru input 1 nilai akhir
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO nilai_pts (id, siswa_id, mapel_id, tahun_akademik_id, semester, nilai_akhir, predikat, catatan_capaian)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                nilai_akhir = VALUES(nilai_akhir),
                predikat = VALUES(predikat),
                catatan_capaian = VALUES(catatan_capaian),
                updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([
            $input['id'],
            $input['studentId'],
            $input['subjectId'],
            $input['academicYearId'],
            $input['semester'],
            $input['score'],
            $input['predicate'],
            $input['competencyNote'] ?? ''
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Nilai berhasil disimpan']);
        break;

    default:
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Action tidak ditemukan']);
        break;
}
?>`;

  const readme = `PANDUAN DEPLOYMENT PHP & MYSQL:
1. Buat database baru di phpMyAdmin / MySQL dengan nama 'db_rapor_kalamkudus'.
2. Import file SQL dump yang diunduh dari tombol "Download SQL Dump" di tab Database Admin.
3. Tempatkan file 'db_config.php' dan 'api.php' di folder server web Anda (misal: /htdocs/rapor-pts/ atau cPanel public_html).
4. Sesuaikan konstanta DB_USER dan DB_PASS di 'db_config.php'.
5. Sistem siap digunakan untuk mengelola data rapor PTS SMA Kristen Kalam Kudus Sukoharjo.`;

  return { configPhp, apiPhp, readme };
}
