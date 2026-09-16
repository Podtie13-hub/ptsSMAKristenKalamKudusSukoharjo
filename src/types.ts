export type SemesterType = 'Ganjil' | 'Genap';
export type GradeLevel = 'X' | 'XI' | 'XII';
export type SubjectCategory = 'Kelompok A (Umum)' | 'Kelompok B (Umum)' | 'Kelompok C (Peminatan)' | string;
export type UserRole = 'admin' | 'guru' | 'walikelas';

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2024/2025"
  semester: SemesterType;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "X-A", "XI-MIPA 1"
  gradeLevel: GradeLevel;
  major?: string; // e.g. "Umum", "MIPA", "IPS"
  homeroomTeacherId: string; // ID of the wali kelas
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  category: SubjectCategory;
  orderIndex: number;
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  gender: 'L' | 'P';
  phone?: string;
  email?: string;
  isHomeroom?: boolean;
  username: string;
  password?: string;
}

export type AuthRole = 'admin' | 'guru';

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'superadmin' | 'admin';
  createdAt?: string;
}

export interface AuthSession {
  role: AuthRole;
  teacherId?: string; // id guru jika role 'guru'
  username: string;
  name: string;
  loggedInAt?: string;
}

export interface TeachingAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  academicYearId: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  status: 'Aktif' | 'Mutasi' | 'Lulus';
}

export interface PTSGrade {
  id: string;
  studentId: string;
  subjectId: string;
  academicYearId: string;
  semester: SemesterType;
  score: number; // 1 nilai akhir tengah semester (0 - 100)
  predicate?: 'A' | 'B' | 'C' | 'D';
  competencyNote?: string;
  updatedAt: string;
  updatedByTeacherId?: string;
}

export interface StudentEvaluation {
  id: string;
  studentId: string;
  academicYearId: string;
  semester: SemesterType;
  sickDays: number; // Sakit
  permittedDays: number; // Izin
  unexcusedDays: number; // Alpa / Tanpa Keterangan
  homeroomNotes: string; // Catatan Wali Kelas untuk PTS
}

export interface PrintSettings {
  printDate: string; // e.g., "Sukoharjo, 27 September 2024"
  homeroomTeacherName: string;
  homeroomTeacherNIP: string;
  principalName: string;
  principalNIP: string;
  paperSize: 'A4' | 'F4' | 'Letter';
  marginTop: number; // in mm
  marginBottom: number; // in mm
  marginLeft: number; // in mm
  marginRight: number; // in mm
  showWatermark?: boolean;
  showSignatureLine?: boolean;
  includeKop?: boolean; // false jika mencetak pada kertas berkop resmi sekolah
  subjectGroupTitles?: Record<string, string>; // Penamaan judul kelompok mapel di rapor & leger
}

export interface SchoolProfile {
  name: string;
  formalName: string;
  npsn: string;
  address: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  accreditation: string;
  logoUrl?: string; // custom logo upload data URL or path
}
