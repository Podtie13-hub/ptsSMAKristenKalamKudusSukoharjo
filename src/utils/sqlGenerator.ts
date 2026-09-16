import {
  AcademicYear,
  ClassRoom,
  PTSGrade,
  Student,
  Subject,
  Teacher,
  TeachingAssignment,
} from '../types';

export function generateMySQLDump(
  academicYears: AcademicYear[],
  classes: ClassRoom[],
  subjects: Subject[],
  teachers: Teacher[],
  assignments: TeachingAssignment[],
  students: Student[],
  grades: PTSGrade[]
): string {
  const timestamp = new Date().toISOString();

  return `-- =========================================================
-- DATABASE SCHEMA & DUMP: SISTEM RAPOR PENILAIAN TENGAH SEMESTER (PTS)
-- SEKOLAH MENENGAH ATAS KRISTEN KALAM KUDUS SUKOHARJO
-- Generated on: ${timestamp}
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

CREATE DATABASE IF NOT EXISTS \`db_rapor_kalamkudus\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_rapor_kalamkudus\`;

-- ---------------------------------------------------------
-- 1. Table structure for \`tahun_akademik\` (Setting Tahun Ajaran)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS \`tahun_akademik\`;
CREATE TABLE \`tahun_akademik\` (
  \`id\` varchar(50) NOT NULL,
  \`tahun\` varchar(20) NOT NULL,
  \`semester\` enum('Ganjil','Genap') NOT NULL,
  \`is_active\` tinyint(1) NOT NULL DEFAULT 0,
  \`tanggal_mulai\` date DEFAULT NULL,
  \`tanggal_selesai\` date DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 2. Table structure for \`guru\` (Data Guru & Wali Kelas)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS \`guru\`;
CREATE TABLE \`guru\` (
  \`id\` varchar(50) NOT NULL,
  \`nip\` varchar(30) NOT NULL,
  \`nama\` varchar(100) NOT NULL,
  \`jenis_kelamin\` enum('L','P') NOT NULL,
  \`telepon\` varchar(20) DEFAULT NULL,
  \`email\` varchar(100) DEFAULT NULL,
  \`is_wali_kelas\` tinyint(1) NOT NULL DEFAULT 0,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_nip\` (\`nip\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 3. Table structure for \`kelas\` (Data Kelas & Penetapan Wali Kelas)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS \`kelas\`;
CREATE TABLE \`kelas\` (
  \`id\` varchar(50) NOT NULL,
  \`nama_kelas\` varchar(50) NOT NULL,
  \`tingkat\` enum('X','XI','XII') NOT NULL,
  \`jurusan\` varchar(50) DEFAULT 'Umum',
  \`wali_kelas_id\` varchar(50) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`fk_kelas_wali\` (\`wali_kelas_id\`),
  CONSTRAINT \`fk_kelas_wali\` FOREIGN KEY (\`wali_kelas_id\`) REFERENCES \`guru\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 4. Table structure for \`mata_pelajaran\` (Daftar Mata Pelajaran)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS \`mata_pelajaran\`;
CREATE TABLE \`mata_pelajaran\` (
  \`id\` varchar(50) NOT NULL,
  \`kode_mapel\` varchar(20) NOT NULL,
  \`nama_mapel\` varchar(100) NOT NULL,
  \`kategori\` varchar(100) NOT NULL,
  \`urutan\` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_kode_mapel\` (\`kode_mapel\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 5. Table structure for \`guru_mengajar\` (Pembagian Mengajar Guru Mapel di Kelas)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS \`guru_mengajar\`;
CREATE TABLE \`guru_mengajar\` (
  \`id\` varchar(50) NOT NULL,
  \`guru_id\` varchar(50) NOT NULL,
  \`mapel_id\` varchar(50) NOT NULL,
  \`kelas_id\` varchar(50) NOT NULL,
  \`tahun_akademik_id\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_gm_guru\` (\`guru_id\`),
  KEY \`fk_gm_mapel\` (\`mapel_id\`),
  KEY \`fk_gm_kelas\` (\`kelas_id\`),
  KEY \`fk_gm_tahun\` (\`tahun_akademik_id\`),
  CONSTRAINT \`fk_gm_guru\` FOREIGN KEY (\`guru_id\`) REFERENCES \`guru\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_gm_mapel\` FOREIGN KEY (\`mapel_id\`) REFERENCES \`mata_pelajaran\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_gm_kelas\` FOREIGN KEY (\`kelas_id\`) REFERENCES \`kelas\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_gm_tahun\` FOREIGN KEY (\`tahun_akademik_id\`) REFERENCES \`tahun_akademik\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 6. Table structure for \`siswa\` (Data Siswa)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS \`siswa\`;
CREATE TABLE \`siswa\` (
  \`id\` varchar(50) NOT NULL,
  \`nis\` varchar(20) NOT NULL,
  \`nisn\` varchar(20) NOT NULL,
  \`nama_lengkap\` varchar(150) NOT NULL,
  \`jenis_kelamin\` enum('L','P') NOT NULL,
  \`kelas_id\` varchar(50) NOT NULL,
  \`status\` enum('Aktif','Mutasi','Lulus') NOT NULL DEFAULT 'Aktif',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_nis\` (\`nis\`),
  UNIQUE KEY \`idx_nisn\` (\`nisn\`),
  KEY \`fk_siswa_kelas\` (\`kelas_id\`),
  CONSTRAINT \`fk_siswa_kelas\` FOREIGN KEY (\`kelas_id\`) REFERENCES \`kelas\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 7. Table structure for \`nilai_pts\` (1 Nilai Akhir Tengah Semester oleh Guru Mapel)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS \`nilai_pts\`;
CREATE TABLE \`nilai_pts\` (
  \`id\` varchar(50) NOT NULL,
  \`siswa_id\` varchar(50) NOT NULL,
  \`mapel_id\` varchar(50) NOT NULL,
  \`tahun_akademik_id\` varchar(50) NOT NULL,
  \`semester\` enum('Ganjil','Genap') NOT NULL,
  \`nilai_akhir\` decimal(5,2) NOT NULL,
  \`predikat\` enum('A','B','C','D') DEFAULT NULL,
  \`catatan_capaian\` text DEFAULT NULL,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_siswa_mapel_periode\` (\`siswa_id\`,\`mapel_id\`,\`tahun_akademik_id\`,\`semester\`),
  KEY \`fk_nilai_siswa\` (\`siswa_id\`),
  KEY \`fk_nilai_mapel\` (\`mapel_id\`),
  KEY \`fk_nilai_tahun\` (\`tahun_akademik_id\`),
  CONSTRAINT \`fk_nilai_siswa\` FOREIGN KEY (\`siswa_id\`) REFERENCES \`siswa\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_nilai_mapel\` FOREIGN KEY (\`mapel_id\`) REFERENCES \`mata_pelajaran\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_nilai_tahun\` FOREIGN KEY (\`tahun_akademik_id\`) REFERENCES \`tahun_akademik\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 8. Table structure for \`evaluasi_wali_kelas\` (Kehadiran & Catatan Rapor)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS \`evaluasi_wali_kelas\`;
CREATE TABLE \`evaluasi_wali_kelas\` (
  \`id\` varchar(50) NOT NULL,
  \`siswa_id\` varchar(50) NOT NULL,
  \`tahun_akademik_id\` varchar(50) NOT NULL,
  \`semester\` enum('Ganjil','Genap') NOT NULL,
  \`sakit\` int(11) NOT NULL DEFAULT 0,
  \`izin\` int(11) NOT NULL DEFAULT 0,
  \`alpa\` int(11) NOT NULL DEFAULT 0,
  \`catatan_wali_kelas\` text DEFAULT NULL,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_eval_siswa_periode\` (\`siswa_id\`,\`tahun_akademik_id\`,\`semester\`),
  CONSTRAINT \`fk_eval_siswa\` FOREIGN KEY (\`siswa_id\`) REFERENCES \`siswa\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- DUMP DATA AWAL (SEED DATA)
-- ---------------------------------------------------------

-- Insert Tahun Akademik
INSERT INTO \`tahun_akademik\` (\`id\`, \`tahun\`, \`semester\`, \`is_active\`) VALUES
${academicYears
  .map(
    (ay) =>
      `('${ay.id}', '${ay.name}', '${ay.semester}', ${ay.isActive ? 1 : 0})`
  )
  .join(',\n')};

-- Insert Guru
INSERT INTO \`guru\` (\`id\`, \`nip\`, \`nama\`, \`jenis_kelamin\`, \`email\`, \`is_wali_kelas\`) VALUES
${teachers
  .map(
    (t) =>
      `('${t.id}', '${t.nip}', '${t.name.replace(/'/g, "\\'")}', '${t.gender}', '${t.email || ''}', ${t.isHomeroom ? 1 : 0})`
  )
  .join(',\n')};

-- Insert Kelas
INSERT INTO \`kelas\` (\`id\`, \`nama_kelas\`, \`tingkat\`, \`jurusan\`, \`wali_kelas_id\`) VALUES
${classes
  .map(
    (c) =>
      `('${c.id}', '${c.name}', '${c.gradeLevel}', '${c.major || 'Umum'}', '${c.homeroomTeacherId}')`
  )
  .join(',\n')};

-- Insert Mata Pelajaran
INSERT INTO \`mata_pelajaran\` (\`id\`, \`kode_mapel\`, \`nama_mapel\`, \`kategori\`, \`urutan\`) VALUES
${subjects
  .map(
    (s) =>
      `('${s.id}', '${s.code}', '${s.name.replace(/'/g, "\\'")}', '${s.category}', ${s.orderIndex})`
  )
  .join(',\n')};

-- Insert Guru Mengajar
INSERT INTO \`guru_mengajar\` (\`id\`, \`guru_id\`, \`mapel_id\`, \`kelas_id\`, \`tahun_akademik_id\`) VALUES
${assignments
  .map(
    (a) =>
      `('${a.id}', '${a.teacherId}', '${a.subjectId}', '${a.classId}', '${a.academicYearId}')`
  )
  .join(',\n')};

-- Insert Siswa
INSERT INTO \`siswa\` (\`id\`, \`nis\`, \`nisn\`, \`nama_lengkap\`, \`jenis_kelamin\`, \`kelas_id\`, \`status\`) VALUES
${students
  .map(
    (s) =>
      `('${s.id}', '${s.nis}', '${s.nisn}', '${s.name.replace(/'/g, "\\'")}', '${s.gender}', '${s.classId}', '${s.status}')`
  )
  .join(',\n')};

-- Insert Nilai PTS
INSERT INTO \`nilai_pts\` (\`id\`, \`siswa_id\`, \`mapel_id\`, \`tahun_akademik_id\`, \`semester\`, \`nilai_akhir\`, \`predikat\`, \`catatan_capaian\`) VALUES
${grades
  .map(
    (g) =>
      `('${g.id}', '${g.studentId}', '${g.subjectId}', '${g.academicYearId}', '${g.semester}', ${g.score}, '${g.predicate || 'B'}', '${(g.competencyNote || '').replace(/'/g, "\\'")}')`
  )
  .join(',\n')};

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
`;
}
