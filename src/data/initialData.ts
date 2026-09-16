import {
  AcademicYear,
  AdminUser,
  ClassRoom,
  PTSGrade,
  PrintSettings,
  SchoolProfile,
  Student,
  StudentEvaluation,
  Subject,
  Teacher,
  TeachingAssignment,
} from '../types';

export const initialSchoolProfile: SchoolProfile = {
  name: 'SMA Kristen Kalam Kudus Sukoharjo',
  formalName: 'SEKOLAH MENENGAH ATAS KRISTEN KALAM KUDUS SUKOHARJO',
  npsn: '20361284',
  address: 'Jl. Suharso No. 1, Solo Baru, Kec. Grogol',
  district: 'Grogol',
  regency: 'Kabupaten Sukoharjo',
  province: 'Jawa Tengah',
  postalCode: '57552',
  phone: '(0271) 621422',
  email: 'smakristen@kalamkudussolo.sch.id',
  website: 'https://kalamkudussolo.sch.id',
  accreditation: 'A (Unggul)',
};

export const initialAcademicYears: AcademicYear[] = [
  {
    id: 'ay-2024-ganjil',
    name: '2024/2025',
    semester: 'Ganjil',
    isActive: true,
    startDate: '2024-07-15',
    endDate: '2024-12-20',
  },
  {
    id: 'ay-2024-genap',
    name: '2024/2025',
    semester: 'Genap',
    isActive: false,
    startDate: '2025-01-06',
    endDate: '2025-06-20',
  },
  {
    id: 'ay-2025-ganjil',
    name: '2025/2026',
    semester: 'Ganjil',
    isActive: false,
    startDate: '2025-07-14',
    endDate: '2025-12-19',
  },
];

export const initialTeachers: Teacher[] = [
  { id: 't-1', nip: '19780512 200501 1 004', name: 'Drs. Budi Santoso, M.Pd.', gender: 'L', phone: '081234567891', email: 'budi.santoso@kalamkudussolo.sch.id', isHomeroom: true, username: 'budi', password: 'guru123' },
  { id: 't-2', nip: '19820319 200801 2 009', name: 'Maria Natalia, S.Pd.', gender: 'P', phone: '081234567892', email: 'maria.natalia@kalamkudussolo.sch.id', isHomeroom: true, username: 'maria', password: 'guru123' },
  { id: 't-3', nip: '19851108 201001 1 012', name: 'Yohanes Kristianto, S.Si.', gender: 'L', phone: '081234567893', email: 'yohanes.k@kalamkudussolo.sch.id', isHomeroom: true, username: 'yohanes', password: 'guru123' },
  { id: 't-4', nip: '19890425 201402 2 007', name: 'Ester Susilowati, S.Pd.', gender: 'P', phone: '081234567894', email: 'ester.s@kalamkudussolo.sch.id', isHomeroom: true, username: 'ester', password: 'guru123' },
  { id: 't-5', nip: '19750914 200212 1 003', name: 'Daniel Prasetyo, M.Sc.', gender: 'L', phone: '081234567895', email: 'daniel.p@kalamkudussolo.sch.id', isHomeroom: true, username: 'daniel', password: 'guru123' },
  { id: 't-6', nip: '19901201 201503 2 008', name: 'Ruth Handayani, S.Sos.', gender: 'P', phone: '081234567896', email: 'ruth.h@kalamkudussolo.sch.id', isHomeroom: true, username: 'ruth', password: 'guru123' },
  { id: 't-7', nip: '19810817 200604 1 005', name: 'Pdt. Andreas Setiawan, M.Th.', gender: 'L', phone: '081234567897', email: 'andreas.s@kalamkudussolo.sch.id', isHomeroom: false, username: 'andreas', password: 'guru123' },
  { id: 't-8', nip: '19840211 200901 2 011', name: 'Grace Permatasari, S.Pd.', gender: 'P', phone: '081234567898', email: 'grace.p@kalamkudussolo.sch.id', isHomeroom: false, username: 'grace', password: 'guru123' },
  { id: 't-9', nip: '19870720 201101 1 010', name: 'David Gunawan, S.Or.', gender: 'L', phone: '081234567899', email: 'david.g@kalamkudussolo.sch.id', isHomeroom: false, username: 'david', password: 'guru123' },
  { id: 't-10', nip: '19920115 201801 2 004', name: 'Lydia Kusuma, S.Sn.', gender: 'P', phone: '081234567800', email: 'lydia.k@kalamkudussolo.sch.id', isHomeroom: false, username: 'lydia', password: 'guru123' },
];

export const initialClasses: ClassRoom[] = [
  { id: 'cls-1', name: 'X-A', gradeLevel: 'X', major: 'Fase E (Umum)', homeroomTeacherId: 't-1' },
  { id: 'cls-2', name: 'X-B', gradeLevel: 'X', major: 'Fase E (Umum)', homeroomTeacherId: 't-2' },
  { id: 'cls-3', name: 'XI-MIPA 1', gradeLevel: 'XI', major: 'MIPA', homeroomTeacherId: 't-3' },
  { id: 'cls-4', name: 'XI-IPS 1', gradeLevel: 'XI', major: 'IPS', homeroomTeacherId: 't-4' },
  { id: 'cls-5', name: 'XII-MIPA', gradeLevel: 'XII', major: 'MIPA', homeroomTeacherId: 't-5' },
  { id: 'cls-6', name: 'XII-IPS', gradeLevel: 'XII', major: 'IPS', homeroomTeacherId: 't-6' },
];

export const initialSubjects: Subject[] = [
  // Kelompok A (Umum)
  { id: 'sub-1', code: 'PAK', name: 'Pendidikan Agama Kristen & Budi Pekerti', category: 'Kelompok A (Umum)', orderIndex: 1 },
  { id: 'sub-2', code: 'PPKN', name: 'Pendidikan Pancasila & Kewarganegaraan', category: 'Kelompok A (Umum)', orderIndex: 2 },
  { id: 'sub-3', code: 'BINDO', name: 'Bahasa Indonesia', category: 'Kelompok A (Umum)', orderIndex: 3 },
  { id: 'sub-4', code: 'MTK', name: 'Matematika', category: 'Kelompok A (Umum)', orderIndex: 4 },
  { id: 'sub-5', code: 'SEJ', name: 'Sejarah Indonesia', category: 'Kelompok A (Umum)', orderIndex: 5 },
  { id: 'sub-6', code: 'BING', name: 'Bahasa Inggris', category: 'Kelompok A (Umum)', orderIndex: 6 },

  // Kelompok B (Umum)
  { id: 'sub-7', code: 'SBD', name: 'Seni Budaya', category: 'Kelompok B (Umum)', orderIndex: 7 },
  { id: 'sub-8', code: 'PJOK', name: 'Pendidikan Jasmani, Olahraga & Kesehatan', category: 'Kelompok B (Umum)', orderIndex: 8 },
  { id: 'sub-9', code: 'PKWU', name: 'Prakarya dan Kewirausahaan', category: 'Kelompok B (Umum)', orderIndex: 9 },

  // Kelompok C (Peminatan / Pilihan)
  { id: 'sub-10', code: 'FIS', name: 'Fisika', category: 'Kelompok C (Peminatan)', orderIndex: 10 },
  { id: 'sub-11', code: 'KIM', name: 'Kimia', category: 'Kelompok C (Peminatan)', orderIndex: 11 },
  { id: 'sub-12', code: 'BIO', name: 'Biologi', category: 'Kelompok C (Peminatan)', orderIndex: 12 },
  { id: 'sub-13', code: 'EKO', name: 'Ekonomi', category: 'Kelompok C (Peminatan)', orderIndex: 13 },
  { id: 'sub-14', code: 'SOS', name: 'Sosiologi', category: 'Kelompok C (Peminatan)', orderIndex: 14 },
];

export const initialTeachingAssignments: TeachingAssignment[] = [
  // Budi Santoso -> Matematika di X-A, X-B
  { id: 'ta-1', teacherId: 't-1', subjectId: 'sub-4', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  { id: 'ta-2', teacherId: 't-1', subjectId: 'sub-4', classId: 'cls-2', academicYearId: 'ay-2024-ganjil' },
  // Maria Natalia -> Bahasa Indonesia di X-A, X-B, XI-MIPA 1
  { id: 'ta-3', teacherId: 't-2', subjectId: 'sub-3', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  { id: 'ta-4', teacherId: 't-2', subjectId: 'sub-3', classId: 'cls-2', academicYearId: 'ay-2024-ganjil' },
  // Yohanes Kristianto -> Fisika di X-A, XI-MIPA 1
  { id: 'ta-5', teacherId: 't-3', subjectId: 'sub-10', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  { id: 'ta-6', teacherId: 't-3', subjectId: 'sub-10', classId: 'cls-3', academicYearId: 'ay-2024-ganjil' },
  // Ester Susilowati -> Bahasa Inggris di X-A, X-B, XI-IPS 1
  { id: 'ta-7', teacherId: 't-4', subjectId: 'sub-6', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  { id: 'ta-8', teacherId: 't-4', subjectId: 'sub-6', classId: 'cls-2', academicYearId: 'ay-2024-ganjil' },
  // Pdt Andreas Setiawan -> Agama Kristen di X-A, X-B
  { id: 'ta-9', teacherId: 't-7', subjectId: 'sub-1', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  { id: 'ta-10', teacherId: 't-7', subjectId: 'sub-1', classId: 'cls-2', academicYearId: 'ay-2024-ganjil' },
  // Grace Permatasari -> PPKn di X-A, X-B
  { id: 'ta-11', teacherId: 't-8', subjectId: 'sub-2', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  { id: 'ta-12', teacherId: 't-8', subjectId: 'sub-2', classId: 'cls-2', academicYearId: 'ay-2024-ganjil' },
  // David Gunawan -> PJOK di X-A
  { id: 'ta-13', teacherId: 't-9', subjectId: 'sub-8', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  // Lydia Kusuma -> Seni Budaya di X-A
  { id: 'ta-14', teacherId: 't-10', subjectId: 'sub-7', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  // Daniel Prasetyo -> Kimia di X-A
  { id: 'ta-15', teacherId: 't-5', subjectId: 'sub-11', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
  // Ruth Handayani -> Sejarah di X-A
  { id: 'ta-16', teacherId: 't-6', subjectId: 'sub-5', classId: 'cls-1', academicYearId: 'ay-2024-ganjil' },
];

export const initialStudents: Student[] = [
  // Siswa Kelas X-A
  { id: 's-1', nis: '24001', nisn: '0071234561', name: 'Alexander Bryan Christian', gender: 'L', classId: 'cls-1', status: 'Aktif' },
  { id: 's-2', nis: '24002', nisn: '0071234562', name: 'Bernadette Valerie Santoso', gender: 'P', classId: 'cls-1', status: 'Aktif' },
  { id: 's-3', nis: '24003', nisn: '0071234563', name: 'Christian Jonathan Wijaya', gender: 'L', classId: 'cls-1', status: 'Aktif' },
  { id: 's-4', nis: '24004', nisn: '0071234564', name: 'Deborah Michelle Hartono', gender: 'P', classId: 'cls-1', status: 'Aktif' },
  { id: 's-5', nis: '24005', nisn: '0071234565', name: 'Ethan Samuel Prasetya', gender: 'L', classId: 'cls-1', status: 'Aktif' },
  { id: 's-6', nis: '24006', nisn: '0071234566', name: 'Felicia Audrey Kurniawan', gender: 'P', classId: 'cls-1', status: 'Aktif' },
  { id: 's-7', nis: '24007', nisn: '0071234567', name: 'Gabriel Nathaniel Tanaka', gender: 'L', classId: 'cls-1', status: 'Aktif' },
  { id: 's-8', nis: '24008', nisn: '0071234568', name: 'Hannah Stephanie Suryadi', gender: 'P', classId: 'cls-1', status: 'Aktif' },
  { id: 's-9', nis: '24009', nisn: '0071234569', name: 'Immanuel Timothy Setiawan', gender: 'L', classId: 'cls-1', status: 'Aktif' },
  { id: 's-10', nis: '24010', nisn: '0071234570', name: 'Jessica Abigail Gunawan', gender: 'P', classId: 'cls-1', status: 'Aktif' },

  // Siswa Kelas X-B
  { id: 's-11', nis: '24011', nisn: '0071234571', name: 'Kevin Joshua Pratama', gender: 'L', classId: 'cls-2', status: 'Aktif' },
  { id: 's-12', nis: '24012', nisn: '0071234572', name: 'Laurencia Evelyn Sutanto', gender: 'P', classId: 'cls-2', status: 'Aktif' },
  { id: 's-13', nis: '24013', nisn: '0071234573', name: 'Matthew Darren Susanto', gender: 'L', classId: 'cls-2', status: 'Aktif' },
  { id: 's-14', nis: '24014', nisn: '0071234574', name: 'Natasha Celine Hidayat', gender: 'P', classId: 'cls-2', status: 'Aktif' },

  // Siswa Kelas XI-MIPA 1
  { id: 's-15', nis: '23001', nisn: '0061234581', name: 'Oliver Kenneth Nugroho', gender: 'L', classId: 'cls-3', status: 'Aktif' },
  { id: 's-16', nis: '23002', nisn: '0061234582', name: 'Patricia Shannon Kusumo', gender: 'P', classId: 'cls-3', status: 'Aktif' },
];

export const initialGrades: PTSGrade[] = [
  // Nilai PTS Kelas X-A untuk Tahun 2024/2025 Ganjil
  // Alexander Bryan Christian (s-1)
  { id: 'g-1-1', studentId: 's-1', subjectId: 'sub-1', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 88, predicate: 'A', competencyNote: 'Sangat memahami nilai-nilai Kristiani dalam kehidupan sehari-hari.', updatedAt: '2024-09-20' },
  { id: 'g-1-2', studentId: 's-1', subjectId: 'sub-2', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 84, predicate: 'B', competencyNote: 'Memahami hak dan kewajiban warga negara dengan baik.', updatedAt: '2024-09-20' },
  { id: 'g-1-3', studentId: 's-1', subjectId: 'sub-3', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 90, predicate: 'A', competencyNote: 'Sangat terampil menganalisis teks laporan hasil observasi.', updatedAt: '2024-09-20' },
  { id: 'g-1-4', studentId: 's-1', subjectId: 'sub-4', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 92, predicate: 'A', competencyNote: 'Sangat mahir menyelesaikan persamaan dan pertidaksamaan linear.', updatedAt: '2024-09-20' },
  { id: 'g-1-5', studentId: 's-1', subjectId: 'sub-5', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 82, predicate: 'B', competencyNote: 'Mampu menjelaskan proses masuknya budaya pra-aksara di Indonesia.', updatedAt: '2024-09-20' },
  { id: 'g-1-6', studentId: 's-1', subjectId: 'sub-6', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 89, predicate: 'A', competencyNote: 'Excellent reading comprehension and descriptive text composition.', updatedAt: '2024-09-20' },
  { id: 'g-1-7', studentId: 's-1', subjectId: 'sub-7', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 85, predicate: 'B', competencyNote: 'Kreatif dalam apresiasi karya seni rupa dua dimensi.', updatedAt: '2024-09-20' },
  { id: 'g-1-8', studentId: 's-1', subjectId: 'sub-8', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 86, predicate: 'B', competencyNote: 'Menunjukkan kebugaran jasmani dan teknik dasar atletik yang baik.', updatedAt: '2024-09-20' },
  { id: 'g-1-10', studentId: 's-1', subjectId: 'sub-10', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 91, predicate: 'A', competencyNote: 'Sangat baik dalam konsep besaran, satuan, dan pengukuran.', updatedAt: '2024-09-20' },
  { id: 'g-1-11', studentId: 's-1', subjectId: 'sub-11', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 87, predicate: 'B', competencyNote: 'Memahami teori struktur atom dan konfigurasi elektron dengan baik.', updatedAt: '2024-09-20' },

  // Bernadette Valerie Santoso (s-2)
  { id: 'g-2-1', studentId: 's-2', subjectId: 'sub-1', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 94, predicate: 'A', competencyNote: 'Teladan dalam kebajikan dan penerapan firman Tuhan.', updatedAt: '2024-09-20' },
  { id: 'g-2-2', studentId: 's-2', subjectId: 'sub-2', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 91, predicate: 'A', competencyNote: 'Sangat aktif dan kritis dalam diskusi konstitusi negara.', updatedAt: '2024-09-20' },
  { id: 'g-2-3', studentId: 's-2', subjectId: 'sub-3', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 95, predicate: 'A', competencyNote: 'Sangat unggul dalam penulisan narasi dan kebahasaan baku.', updatedAt: '2024-09-20' },
  { id: 'g-2-4', studentId: 's-2', subjectId: 'sub-4', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 96, predicate: 'A', competencyNote: 'Logika matematika sangat tajam, perhitungan akurat.', updatedAt: '2024-09-20' },
  { id: 'g-2-5', studentId: 's-2', subjectId: 'sub-5', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 88, predicate: 'A', competencyNote: 'Analisis sejarah runtut dan komprehensif.', updatedAt: '2024-09-20' },
  { id: 'g-2-6', studentId: 's-2', subjectId: 'sub-6', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 93, predicate: 'A', competencyNote: 'Fluent in communicative speaking and essay writing.', updatedAt: '2024-09-20' },
  { id: 'g-2-7', studentId: 's-2', subjectId: 'sub-7', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 88, predicate: 'A', competencyNote: 'Apresiasi seni sangat halus dan berkarakter.', updatedAt: '2024-09-20' },
  { id: 'g-2-8', studentId: 's-2', subjectId: 'sub-8', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 84, predicate: 'B', competencyNote: 'Kedisiplinan dan semangat berolahraga konsisten.', updatedAt: '2024-09-20' },
  { id: 'g-2-10', studentId: 's-2', subjectId: 'sub-10', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 93, predicate: 'A', competencyNote: 'Pemahaman analisis vektor dan kinematika gerak sangat baik.', updatedAt: '2024-09-20' },
  { id: 'g-2-11', studentId: 's-2', subjectId: 'sub-11', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 92, predicate: 'A', competencyNote: 'Sangat teliti dalam perhitungan ikatan kimia.', updatedAt: '2024-09-20' },

  // Christian Jonathan Wijaya (s-3)
  { id: 'g-3-1', studentId: 's-3', subjectId: 'sub-1', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 82, predicate: 'B', competencyNote: 'Berpartisipasi aktif dalam kegiatan ibadah dan renungan.', updatedAt: '2024-09-20' },
  { id: 'g-3-2', studentId: 's-3', subjectId: 'sub-2', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 79, predicate: 'B', competencyNote: 'Cukup memahami sistem peradilan dan hukum nasional.', updatedAt: '2024-09-20' },
  { id: 'g-3-3', studentId: 's-3', subjectId: 'sub-3', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 80, predicate: 'B', competencyNote: 'Mampu menyusun teks eksposisi dengan argumen logis.', updatedAt: '2024-09-20' },
  { id: 'g-3-4', studentId: 's-3', subjectId: 'sub-4', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 78, predicate: 'B', competencyNote: 'Perlu latihan lebih lanjut pada soal cerita matematika.', updatedAt: '2024-09-20' },
  { id: 'g-3-5', studentId: 's-3', subjectId: 'sub-5', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 76, predicate: 'C', competencyNote: 'Memahami dasar-dasar kronologi peristiwa sejarah.', updatedAt: '2024-09-20' },
  { id: 'g-3-6', studentId: 's-3', subjectId: 'sub-6', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 82, predicate: 'B', competencyNote: 'Good vocabulary mastery and polite conversational English.', updatedAt: '2024-09-20' },
  { id: 'g-3-7', studentId: 's-3', subjectId: 'sub-7', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 80, predicate: 'B', competencyNote: 'Cukup tekun dalam menyelesaikan tugas kerajinan.', updatedAt: '2024-09-20' },
  { id: 'g-3-8', studentId: 's-3', subjectId: 'sub-8', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 88, predicate: 'A', competencyNote: 'Sportif dan sangat lincah dalam permainan bola besar.', updatedAt: '2024-09-20' },
  { id: 'g-3-10', studentId: 's-3', subjectId: 'sub-10', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 77, predicate: 'B', competencyNote: 'Cukup mampu menganalisis gerak lurus beraturan.', updatedAt: '2024-09-20' },
  { id: 'g-3-11', studentId: 's-3', subjectId: 'sub-11', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 78, predicate: 'B', competencyNote: 'Memahami konsep dasar tabel periodik unsur.', updatedAt: '2024-09-20' },

  // Deborah Michelle Hartono (s-4)
  { id: 'g-4-1', studentId: 's-4', subjectId: 'sub-1', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 91, predicate: 'A', competencyNote: 'Menghayati nilai kasih Kristus dengan sikap sopan dan ramah.', updatedAt: '2024-09-20' },
  { id: 'g-4-2', studentId: 's-4', subjectId: 'sub-2', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 86, predicate: 'B', competencyNote: 'Memiliki wawasan kebangsaan dan toleransi yang tinggi.', updatedAt: '2024-09-20' },
  { id: 'g-4-3', studentId: 's-4', subjectId: 'sub-3', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 88, predicate: 'A', competencyNote: 'Kemampuan menyimak dan menulis ide pokok sangat baik.', updatedAt: '2024-09-20' },
  { id: 'g-4-4', studentId: 's-4', subjectId: 'sub-4', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 85, predicate: 'B', competencyNote: 'Rapi dalam langkah penyelesaian aljabar dan matriks.', updatedAt: '2024-09-20' },
  { id: 'g-4-5', studentId: 's-4', subjectId: 'sub-5', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 84, predicate: 'B', competencyNote: 'Mampu menghubungkan peristiwa sejarah dengan masa kini.', updatedAt: '2024-09-20' },
  { id: 'g-4-6', studentId: 's-4', subjectId: 'sub-6', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 90, predicate: 'A', competencyNote: 'Confident in presentation and grammatical accuracy.', updatedAt: '2024-09-20' },
  { id: 'g-4-7', studentId: 's-4', subjectId: 'sub-7', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 92, predicate: 'A', competencyNote: 'Bakat musikal dan vokal menonjol dalam paduan suara.', updatedAt: '2024-09-20' },
  { id: 'g-4-8', studentId: 's-4', subjectId: 'sub-8', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 85, predicate: 'B', competencyNote: 'Aktif mengikuti seluruh rangkaian pemanasan dan senam.', updatedAt: '2024-09-20' },
  { id: 'g-4-10', studentId: 's-4', subjectId: 'sub-10', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 84, predicate: 'B', competencyNote: 'Memahami konsep hukum Newton tentang gerak.', updatedAt: '2024-09-20' },
  { id: 'g-4-11', studentId: 's-4', subjectId: 'sub-11', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 86, predicate: 'B', competencyNote: 'Penguasaan konsep mol dan stoikiometri baik.', updatedAt: '2024-09-20' },

  // Ethan Samuel Prasetya (s-5)
  { id: 'g-5-1', studentId: 's-5', subjectId: 'sub-1', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 85, predicate: 'B', competencyNote: 'Rendah hati dan memiliki empati tinggi terhadap rekan sebaya.', updatedAt: '2024-09-20' },
  { id: 'g-5-2', studentId: 's-5', subjectId: 'sub-2', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 82, predicate: 'B', competencyNote: 'Disiplin mentaati tata tertib dan etika sekolah.', updatedAt: '2024-09-20' },
  { id: 'g-5-3', studentId: 's-5', subjectId: 'sub-3', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 84, predicate: 'B', competencyNote: 'Kosakata kaya dan runtut dalam penulisan resensi buku.', updatedAt: '2024-09-20' },
  { id: 'g-5-4', studentId: 's-5', subjectId: 'sub-4', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 89, predicate: 'A', competencyNote: 'Analitis dan cekatan dalam menyelesaikan fungsi kuadrat.', updatedAt: '2024-09-20' },
  { id: 'g-5-5', studentId: 's-5', subjectId: 'sub-5', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 80, predicate: 'B', competencyNote: 'Antusias mempelajari asal-usul nenek moyang bangsa.', updatedAt: '2024-09-20' },
  { id: 'g-5-6', studentId: 's-5', subjectId: 'sub-6', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 86, predicate: 'B', competencyNote: 'Good understanding of grammar tenses and listening tasks.', updatedAt: '2024-09-20' },
  { id: 'g-5-7', studentId: 's-5', subjectId: 'sub-7', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 82, predicate: 'B', competencyNote: 'Karya sketsa pensil proporsional dan memiliki kedalaman.', updatedAt: '2024-09-20' },
  { id: 'g-5-8', studentId: 's-5', subjectId: 'sub-8', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 85, predicate: 'B', competencyNote: 'Ketahanan fisik prima dan selalu bersemangat.', updatedAt: '2024-09-20' },
  { id: 'g-5-10', studentId: 's-5', subjectId: 'sub-10', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 88, predicate: 'A', competencyNote: 'Daya nalar fisika praktis sangat memuaskan.', updatedAt: '2024-09-20' },
  { id: 'g-5-11', studentId: 's-5', subjectId: 'sub-11', academicYearId: 'ay-2024-ganjil', semester: 'Ganjil', score: 84, predicate: 'B', competencyNote: 'Memahami perbedaan unsur, senyawa, dan campuran.', updatedAt: '2024-09-20' },
];

export const initialEvaluations: StudentEvaluation[] = [
  {
    id: 'eval-1',
    studentId: 's-1',
    academicYearId: 'ay-2024-ganjil',
    semester: 'Ganjil',
    sickDays: 0,
    permittedDays: 1,
    unexcusedDays: 0,
    homeroomNotes: 'Alexander menunjukkan ketekunan belajar dan kepemimpinan yang sangat membanggakan di tengah semester ini. Pertahankan dedikasi dan prestasi!',
  },
  {
    id: 'eval-2',
    studentId: 's-2',
    academicYearId: 'ay-2024-ganjil',
    semester: 'Ganjil',
    sickDays: 0,
    permittedDays: 0,
    unexcusedDays: 0,
    homeroomNotes: 'Bernadette meraih capaian akademik luar biasa dengan integritas tinggi. Tetap rendah hati dan menjadi teladan bagi sesama teman.',
  },
  {
    id: 'eval-3',
    studentId: 's-3',
    academicYearId: 'ay-2024-ganjil',
    semester: 'Ganjil',
    sickDays: 1,
    permittedDays: 0,
    unexcusedDays: 0,
    homeroomNotes: 'Christian memiliki potensi besar terutama di bidang kebugaran jasmani dan seni. Tingkatkan konsentrasi dan waktu belajar mandiri di rumah.',
  },
  {
    id: 'eval-4',
    studentId: 's-4',
    academicYearId: 'ay-2024-ganjil',
    semester: 'Ganjil',
    sickDays: 0,
    permittedDays: 0,
    unexcusedDays: 0,
    homeroomNotes: 'Deborah berkarakter santun, rajin, dan memiliki prestasi yang stabil di semua mata pelajaran. Sangat aktif mendukung kegiatan kelas.',
  },
  {
    id: 'eval-5',
    studentId: 's-5',
    academicYearId: 'ay-2024-ganjil',
    semester: 'Ganjil',
    sickDays: 0,
    permittedDays: 1,
    unexcusedDays: 0,
    homeroomNotes: 'Ethan menunjukkan perkembangan nalar logika dan sains yang mantap. Pertahankan semangat belajar hingga akhir semester.',
  },
];

export const defaultPrintSettings: PrintSettings = {
  printDate: 'Sukoharjo, 27 September 2024',
  homeroomTeacherName: 'Drs. Budi Santoso, M.Pd.',
  homeroomTeacherNIP: '19780512 200501 1 004',
  principalName: 'Drs. Andreas Setiawan, M.Pd.',
  principalNIP: '19710314 199802 1 001',
  paperSize: 'A4',
  marginTop: 40, // Ruang 40mm untuk kertas yang sudah memiliki kop resmi cetak
  marginBottom: 15,
  marginLeft: 15,
  marginRight: 15,
  showWatermark: false,
  showSignatureLine: true,
  includeKop: false, // Default TANPA KOP karena sekolah sudah memiliki kertas berkop resmi
  subjectGroupTitles: {
    'Kelompok A (Umum)': 'Kelompok A (Muatan Umum / Wajib)',
    'Kelompok B (Umum)': 'Kelompok B (Muatan Kewilayahan / Umum)',
    'Kelompok C (Peminatan)': 'Kelompok C (Peminatan / Pilihan)',
  },
};

export const initialAdminUsers: AdminUser[] = [
  {
    id: 'adm-main',
    username: 'podtie13',
    password: 'Zionathan123',
    name: 'Admin Utama (podtie13)',
    role: 'superadmin',
    createdAt: '2024-07-01',
  },
];
