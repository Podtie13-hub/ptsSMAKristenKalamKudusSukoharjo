import {
  AcademicYear,
  AdminUser,
  AuthSession,
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
import {
  defaultPrintSettings,
  initialAcademicYears,
  initialAdminUsers,
  initialClasses,
  initialEvaluations,
  initialGrades,
  initialSchoolProfile,
  initialStudents,
  initialSubjects,
  initialTeachers,
  initialTeachingAssignments,
} from '../data/initialData';

const STORAGE_KEYS = {
  ACADEMIC_YEARS: 'kk_pts_academic_years_v1',
  CLASSES: 'kk_pts_classes_v1',
  SUBJECTS: 'kk_pts_subjects_v1',
  TEACHERS: 'kk_pts_teachers_v1',
  ASSIGNMENTS: 'kk_pts_assignments_v1',
  STUDENTS: 'kk_pts_students_v1',
  GRADES: 'kk_pts_grades_v1',
  EVALUATIONS: 'kk_pts_evaluations_v1',
  PRINT_SETTINGS: 'kk_pts_print_settings_v1',
  SCHOOL_PROFILE: 'kk_pts_school_profile_v1',
  AUTH_SESSION: 'kk_pts_auth_session_v1',
  ADMIN_USERS: 'kk_pts_admin_users_v1',
};

// Safe localStorage helper
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage key: ${key}`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing localStorage key: ${key}`, e);
  }
}

export const StorageService = {
  getAcademicYears(): AcademicYear[] {
    return loadFromStorage(STORAGE_KEYS.ACADEMIC_YEARS, initialAcademicYears);
  },
  saveAcademicYears(data: AcademicYear[]) {
    saveToStorage(STORAGE_KEYS.ACADEMIC_YEARS, data);
  },

  getClasses(): ClassRoom[] {
    return loadFromStorage(STORAGE_KEYS.CLASSES, initialClasses);
  },
  saveClasses(data: ClassRoom[]) {
    saveToStorage(STORAGE_KEYS.CLASSES, data);
  },

  getSubjects(): Subject[] {
    return loadFromStorage(STORAGE_KEYS.SUBJECTS, initialSubjects);
  },
  saveSubjects(data: Subject[]) {
    saveToStorage(STORAGE_KEYS.SUBJECTS, data);
  },

  getTeachers(): Teacher[] {
    const raw = loadFromStorage(STORAGE_KEYS.TEACHERS, initialTeachers);
    return raw.map((t: Teacher) => {
      const match = initialTeachers.find((it) => it.id === t.id);
      return {
        ...t,
        username:
          t.username ||
          match?.username ||
          t.name
            .toLowerCase()
            .split(' ')[0]
            .replace(/[^a-z0-9]/g, '') ||
          'guru',
        password: t.password || match?.password || 'guru123',
      };
    });
  },
  saveTeachers(data: Teacher[]) {
    saveToStorage(STORAGE_KEYS.TEACHERS, data);
  },

  getAuthSession(): AuthSession | null {
    return loadFromStorage<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
  },
  saveAuthSession(session: AuthSession | null) {
    if (session) {
      saveToStorage(STORAGE_KEYS.AUTH_SESSION, session);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    }
  },

  getAssignments(): TeachingAssignment[] {
    return loadFromStorage(STORAGE_KEYS.ASSIGNMENTS, initialTeachingAssignments);
  },
  saveAssignments(data: TeachingAssignment[]) {
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, data);
  },

  getStudents(): Student[] {
    return loadFromStorage(STORAGE_KEYS.STUDENTS, initialStudents);
  },
  saveStudents(data: Student[]) {
    saveToStorage(STORAGE_KEYS.STUDENTS, data);
  },

  getGrades(): PTSGrade[] {
    return loadFromStorage(STORAGE_KEYS.GRADES, initialGrades);
  },
  saveGrades(data: PTSGrade[]) {
    saveToStorage(STORAGE_KEYS.GRADES, data);
  },

  getEvaluations(): StudentEvaluation[] {
    return loadFromStorage(STORAGE_KEYS.EVALUATIONS, initialEvaluations);
  },
  saveEvaluations(data: StudentEvaluation[]) {
    saveToStorage(STORAGE_KEYS.EVALUATIONS, data);
  },

  getPrintSettings(): PrintSettings {
    return loadFromStorage(STORAGE_KEYS.PRINT_SETTINGS, defaultPrintSettings);
  },
  savePrintSettings(data: PrintSettings) {
    saveToStorage(STORAGE_KEYS.PRINT_SETTINGS, data);
  },

  getSchoolProfile(): SchoolProfile {
    return loadFromStorage(STORAGE_KEYS.SCHOOL_PROFILE, initialSchoolProfile);
  },
  saveSchoolProfile(data: SchoolProfile) {
    saveToStorage(STORAGE_KEYS.SCHOOL_PROFILE, data);
  },

  getAdminUsers(): AdminUser[] {
    return loadFromStorage(STORAGE_KEYS.ADMIN_USERS, initialAdminUsers);
  },
  saveAdminUsers(data: AdminUser[]) {
    saveToStorage(STORAGE_KEYS.ADMIN_USERS, data);
  },

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.ACADEMIC_YEARS);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.GRADES);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.PRINT_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.SCHOOL_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USERS);
  },
};

// Helper to determine predicate based on score
export function calculatePredicate(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'D';
}

export function getPredicateLabel(predicate?: string): string {
  switch (predicate) {
    case 'A':
      return 'Sangat Baik';
    case 'B':
      return 'Baik';
    case 'C':
      return 'Cukup (Tuntas)';
    case 'D':
      return 'Perlu Bimbingan';
    default:
      return '-';
  }
}
