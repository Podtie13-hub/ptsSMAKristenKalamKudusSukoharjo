import React, { useState, useEffect } from 'react';
import {
  Calendar,
  School,
  BookOpen,
  Users,
  UserCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Database,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Building,
  Key,
  Lock,
  GraduationCap,
  Eye,
  LogIn,
  X,
  Printer,
  ShieldCheck,
  Sparkles,
  FileSpreadsheet,
  Sliders,
} from 'lucide-react';
import {
  AcademicYear,
  AdminUser,
  ClassRoom,
  PrintSettings,
  SchoolProfile,
  SemesterType,
  Student,
  Subject,
  SubjectCategory,
  Teacher,
  TeachingAssignment,
} from '../../types';
import { KalamKudusLogo } from '../KalamKudusLogo';
import { BulkImportModal, ImportType } from './BulkImportModal';
import { ClassPromotionWizard } from './ClassPromotionWizard';
import { AdminAccountsManager } from './AdminAccountsManager';
import { PrintSettingsManager } from './PrintSettingsManager';

interface AdminDashboardProps {
  academicYears: AcademicYear[];
  classes: ClassRoom[];
  subjects: Subject[];
  teachers: Teacher[];
  assignments: TeachingAssignment[];
  students: Student[];
  schoolProfile: SchoolProfile;
  adminUsers?: AdminUser[];
  currentAdminUsername?: string;
  printSettings?: PrintSettings;
  onUpdateAcademicYears: (years: AcademicYear[]) => void;
  onUpdateClasses: (classes: ClassRoom[]) => void;
  onUpdateSubjects: (subjects: Subject[]) => void;
  onUpdateTeachers: (teachers: Teacher[]) => void;
  onUpdateAssignments: (assignments: TeachingAssignment[]) => void;
  onUpdateStudents: (students: Student[]) => void;
  onUpdateSchoolProfile: (profile: SchoolProfile) => void;
  onUpdateAdminUsers?: (users: AdminUser[]) => void;
  onUpdatePrintSettings?: (settings: PrintSettings) => void;
  onResetData: () => void;
  onOpenSqlModal: () => void;
  onImpersonateTeacher?: (teacher: Teacher) => void;
}

type AdminTab =
  | 'tahun_ajaran'
  | 'kelas'
  | 'mapel'
  | 'guru'
  | 'siswa'
  | 'cetak'
  | 'profil'
  | 'admin_users';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  academicYears,
  classes,
  subjects,
  teachers,
  assignments,
  students,
  schoolProfile,
  adminUsers,
  currentAdminUsername = 'podtie13',
  printSettings,
  onUpdateAcademicYears,
  onUpdateClasses,
  onUpdateSubjects,
  onUpdateTeachers,
  onUpdateAssignments,
  onUpdateStudents,
  onUpdateSchoolProfile,
  onUpdateAdminUsers,
  onUpdatePrintSettings,
  onResetData,
  onOpenSqlModal,
  onImpersonateTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('tahun_ajaran');

  // State for Bulk Import Modal
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportDefaultType, setBulkImportDefaultType] = useState<ImportType>('siswa');

  // State for Class Promotion & Graduation Wizard
  const [isPromotionWizardOpen, setIsPromotionWizardOpen] = useState(false);

  // State for new Academic Year modal / form
  const [newYearName, setNewYearName] = useState('2025/2026');
  const [newYearSemester, setNewYearSemester] = useState<SemesterType>('Ganjil');

  // State for Class modal / form
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<'X' | 'XI' | 'XII'>('X');
  const [newClassMajor, setNewClassMajor] = useState('Fase E (Umum)');
  const [newClassWaliId, setNewClassWaliId] = useState('');

  // State for Subject modal / form
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCategory, setNewSubjectCategory] = useState<SubjectCategory>('Kelompok A (Umum)');

  // State for Subject Group Titles
  const [catTitleA, setCatTitleA] = useState(
    printSettings?.subjectGroupTitles?.['Kelompok A (Umum)'] || 'Kelompok A (Muatan Umum / Wajib)'
  );
  const [catTitleB, setCatTitleB] = useState(
    printSettings?.subjectGroupTitles?.['Kelompok B (Umum)'] || 'Kelompok B (Muatan Kewilayahan / Umum)'
  );
  const [catTitleC, setCatTitleC] = useState(
    printSettings?.subjectGroupTitles?.['Kelompok C (Peminatan)'] || 'Kelompok C (Peminatan / Pilihan)'
  );

  useEffect(() => {
    if (printSettings?.subjectGroupTitles) {
      if (printSettings.subjectGroupTitles['Kelompok A (Umum)']) {
        setCatTitleA(printSettings.subjectGroupTitles['Kelompok A (Umum)']);
      }
      if (printSettings.subjectGroupTitles['Kelompok B (Umum)']) {
        setCatTitleB(printSettings.subjectGroupTitles['Kelompok B (Umum)']);
      }
      if (printSettings.subjectGroupTitles['Kelompok C (Peminatan)']) {
        setCatTitleC(printSettings.subjectGroupTitles['Kelompok C (Peminatan)']);
      }
    }
  }, [printSettings]);

  // State for Teacher form & accounts
  const [newTeacherNip, setNewTeacherNip] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherGender, setNewTeacherGender] = useState<'L' | 'P'>('L');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherUsername, setNewTeacherUsername] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('guru123');
  const [teacherSearch, setTeacherSearch] = useState('');

  // Editing Teacher Modal state
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherNip, setEditTeacherNip] = useState('');
  const [editTeacherGender, setEditTeacherGender] = useState<'L' | 'P'>('L');
  const [editTeacherEmail, setEditTeacherEmail] = useState('');
  const [editTeacherUsername, setEditTeacherUsername] = useState('');
  const [editTeacherPassword, setEditTeacherPassword] = useState('');

  // State for Assignment form
  const [assignTeacherId, setAssignTeacherId] = useState('');
  const [assignSubjectId, setAssignSubjectId] = useState('');
  const [assignClassId, setAssignClassId] = useState('');

  // State for Student form
  const [studentNis, setStudentNis] = useState('');
  const [studentNisn, setStudentNisn] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentGender, setStudentGender] = useState<'L' | 'P'>('L');
  const [studentClassId, setStudentClassId] = useState(classes[0]?.id || '');
  const [studentSearch, setStudentSearch] = useState('');
  const [filterClassId, setFilterClassId] = useState<string>('all');

  // Success / alert notifications
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // --- Handlers: Bulk Import ---
  const handleOpenBulkImport = (type: ImportType = 'siswa') => {
    setBulkImportDefaultType(type);
    setIsBulkImportOpen(true);
  };

  const handleImportTeachers = (newTeachers: Teacher[]) => {
    const updated = [...teachers];
    newTeachers.forEach((nt) => {
      const idx = updated.findIndex(
        (t) => t.id === nt.id || (nt.nip && t.nip === nt.nip)
      );
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], ...nt };
      } else {
        updated.push(nt);
      }
    });
    onUpdateTeachers(updated);
    showFeedback(`Berhasil mengimpor ${newTeachers.length} data guru ke sistem.`);
  };

  const handleImportStudents = (newStudents: Student[]) => {
    const updated = [...students];
    newStudents.forEach((ns) => {
      const idx = updated.findIndex(
        (s) => s.id === ns.id || (ns.nis && s.nis === ns.nis)
      );
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], ...ns };
      } else {
        updated.push(ns);
      }
    });
    onUpdateStudents(updated);
    showFeedback(`Berhasil mengimpor ${newStudents.length} data siswa.`);
  };

  const handleImportSubjects = (newSubjects: Subject[]) => {
    const updated = [...subjects];
    newSubjects.forEach((ns) => {
      const idx = updated.findIndex((s) => s.id === ns.id || s.code === ns.code);
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], ...ns };
      } else {
        updated.push(ns);
      }
    });
    onUpdateSubjects(updated);
    showFeedback(`Berhasil mengimpor ${newSubjects.length} mata pelajaran.`);
  };

  // --- Handlers: Academic Year ---
  const handleSetActiveYear = (id: string) => {
    const updated = academicYears.map((ay) => ({
      ...ay,
      isActive: ay.id === id,
    }));
    onUpdateAcademicYears(updated);
    showFeedback('Tahun ajaran & semester aktif berhasil diperbarui untuk seluruh sistem!');
  };

  const handleAddAcademicYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName.trim()) return;
    const newId = `ay-${Date.now()}`;
    const newYear: AcademicYear = {
      id: newId,
      name: newYearName.trim(),
      semester: newYearSemester,
      isActive: false,
    };
    onUpdateAcademicYears([...academicYears, newYear]);
    showFeedback(`Tahun Ajaran ${newYearName} (${newYearSemester}) berhasil ditambahkan.`);
  };

  // --- Handlers: Classes ---
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newId = `cls-${Date.now()}`;
    const newCls: ClassRoom = {
      id: newId,
      name: newClassName.trim(),
      gradeLevel: newClassGrade,
      major: newClassMajor,
      homeroomTeacherId: newClassWaliId || (teachers[0]?.id || ''),
    };
    onUpdateClasses([...classes, newCls]);
    setNewClassName('');
    showFeedback(`Kelas ${newCls.name} berhasil ditambahkan.`);
  };

  const handleDeleteClass = (id: string) => {
    const cls = classes.find((c) => c.id === id);
    if (!cls) return;
    if (confirm(`Hapus kelas ${cls.name}? Siswa di kelas ini perlu dipindahkan.`)) {
      onUpdateClasses(classes.filter((c) => c.id !== id));
      showFeedback(`Kelas ${cls.name} dihapus.`);
    }
  };

  const handleUpdateWaliKelas = (classId: string, teacherId: string) => {
    const updated = classes.map((c) => (c.id === classId ? { ...c, homeroomTeacherId: teacherId } : c));
    onUpdateClasses(updated);
    showFeedback('Wali kelas berhasil diperbarui.');
  };

  // --- Handlers: Subjects ---
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectCode.trim() || !newSubjectName.trim()) return;
    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      code: newSubjectCode.trim().toUpperCase(),
      name: newSubjectName.trim(),
      category: newSubjectCategory,
      orderIndex: subjects.length + 1,
    };
    onUpdateSubjects([...subjects, newSub]);
    setNewSubjectCode('');
    setNewSubjectName('');
    showFeedback(`Mata pelajaran ${newSub.name} berhasil ditambahkan.`);
  };

  const handleDeleteSubject = (id: string) => {
    const sub = subjects.find((s) => s.id === id);
    if (!sub) return;
    if (confirm(`Hapus mata pelajaran ${sub.name}?`)) {
      onUpdateSubjects(subjects.filter((s) => s.id !== id));
      showFeedback(`Mata pelajaran ${sub.name} dihapus.`);
    }
  };

  const handleSaveCategoryTitles = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePrintSettings && printSettings) {
      onUpdatePrintSettings({
        ...printSettings,
        subjectGroupTitles: {
          ...printSettings.subjectGroupTitles,
          'Kelompok A (Umum)': catTitleA.trim() || 'Kelompok A (Muatan Umum / Wajib)',
          'Kelompok B (Umum)': catTitleB.trim() || 'Kelompok B (Muatan Kewilayahan / Umum)',
          'Kelompok C (Peminatan)': catTitleC.trim() || 'Kelompok C (Peminatan / Pilihan)',
        },
      });
      showFeedback('Nama kelompok mata pelajaran berhasil disimpan dan disinkronkan ke Rapor & Leger Nilai!');
    }
  };

  // --- Handlers: Teachers & Teaching Assignments ---
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;
    const defaultUsername =
      newTeacherUsername.trim() ||
      newTeacherName.toLowerCase().trim().split(' ')[0].replace(/[^a-z0-9]/g, '') ||
      `guru${teachers.length + 1}`;

    const newT: Teacher = {
      id: `t-${Date.now()}`,
      nip: newTeacherNip.trim() || '-',
      name: newTeacherName.trim(),
      gender: newTeacherGender,
      email: newTeacherEmail.trim(),
      isHomeroom: false,
      username: defaultUsername,
      password: newTeacherPassword.trim() || 'guru123',
    };
    onUpdateTeachers([...teachers, newT]);
    setNewTeacherNip('');
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherUsername('');
    setNewTeacherPassword('guru123');
    showFeedback(`Guru ${newT.name} berhasil didaftarkan (Username: ${newT.username}).`);
  };

  const handleStartEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    setEditTeacherName(t.name);
    setEditTeacherNip(t.nip || '');
    setEditTeacherGender(t.gender || 'L');
    setEditTeacherEmail(t.email || '');
    setEditTeacherUsername(t.username || '');
    setEditTeacherPassword(t.password || 'guru123');
  };

  const handleSaveEditTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    const updated = teachers.map((t) =>
      t.id === editingTeacher.id
        ? {
            ...t,
            name: editTeacherName.trim(),
            nip: editTeacherNip.trim() || '-',
            gender: editTeacherGender,
            email: editTeacherEmail.trim(),
            username: editTeacherUsername.trim() || t.username,
            password: editTeacherPassword.trim() || t.password,
          }
        : t
    );
    onUpdateTeachers(updated);
    setEditingTeacher(null);
    showFeedback('Data & akun login guru berhasil diperbarui.');
  };

  const handleResetTeacherPassword = (t: Teacher) => {
    const updated = teachers.map((item) =>
      item.id === t.id ? { ...item, password: 'guru123' } : item
    );
    onUpdateTeachers(updated);
    showFeedback(`Kata sandi untuk ${t.name} berhasil direset menjadi: guru123`);
  };

  const handleDeleteTeacher = (id: string) => {
    const t = teachers.find((item) => item.id === id);
    if (!t) return;
    if (confirm(`Hapus guru ${t.name}? Akun login dan penugasan mengajar guru ini juga akan dihapus.`)) {
      onUpdateTeachers(teachers.filter((item) => item.id !== id));
      onUpdateAssignments(assignments.filter((a) => a.teacherId !== id));
      showFeedback(`Guru ${t.name} berhasil dihapus.`);
    }
  };

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeacherId || !assignSubjectId || !assignClassId) {
      alert('Pilih Guru, Mata Pelajaran, dan Kelas terlebih dahulu.');
      return;
    }
    const activeYear = academicYears.find((ay) => ay.isActive);
    const newAssign: TeachingAssignment = {
      id: `ta-${Date.now()}`,
      teacherId: assignTeacherId,
      subjectId: assignSubjectId,
      classId: assignClassId,
      academicYearId: activeYear ? activeYear.id : 'ay-active',
    };
    onUpdateAssignments([...assignments, newAssign]);
    showFeedback('Penugasan mengajar guru mapel berhasil disimpan.');
  };

  const handleDeleteAssignment = (id: string) => {
    onUpdateAssignments(assignments.filter((a) => a.id !== id));
    showFeedback('Penugasan mengajar dihapus.');
  };

  // --- Handlers: Students ---
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentNis.trim()) {
      alert('Isi NIS dan Nama Siswa.');
      return;
    }
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      nis: studentNis.trim(),
      nisn: studentNisn.trim() || '-',
      name: studentName.trim(),
      gender: studentGender,
      classId: studentClassId || classes[0]?.id || '',
      status: 'Aktif',
    };
    onUpdateStudents([...students, newStudent]);
    setStudentNis('');
    setStudentNisn('');
    setStudentName('');
    showFeedback(`Siswa ${newStudent.name} berhasil ditambahkan.`);
  };

  const handleDeleteStudent = (id: string) => {
    const st = students.find((s) => s.id === id);
    if (!st) return;
    if (confirm(`Hapus data siswa ${st.name}?`)) {
      onUpdateStudents(students.filter((s) => s.id !== id));
      showFeedback(`Data siswa ${st.name} dihapus.`);
    }
  };

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchClass = filterClassId === 'all' || s.classId === filterClassId;
    const matchSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nis.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nisn.toLowerCase().includes(studentSearch.toLowerCase());
    return matchClass && matchSearch;
  });

  const activeYear = academicYears.find((ay) => ay.isActive);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E3A6C] px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D8232A]"></span>
              Portal Administrator Sekolah
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E3A6C] tracking-tight">
              Manajemen Data Akademik Rapor PTS
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              SMA Kristen Kalam Kudus Sukoharjo • Tahun Aktif:{' '}
              <strong className="text-[#1E3A6C]">
                {activeYear ? `${activeYear.name} (${activeYear.semester})` : '-'}
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="admin-btn-bulk-import"
              onClick={() => handleOpenBulkImport('siswa')}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
              title="Upload masal Guru, Siswa, atau Mata Pelajaran sekaligus (Excel / CSV)"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-100" />
              <span>Upload Masal Data</span>
            </button>
            <button
              type="button"
              id="admin-btn-promotion"
              onClick={() => setIsPromotionWizardOpen(true)}
              className="inline-flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
              title="Fitur ganti tahun ajaran: luluskan jenjang XII dan naikkan siswa kelas berikutnya"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Kenaikan Kelas & Kelulusan</span>
            </button>
            <button
              type="button"
              id="admin-btn-sql"
              onClick={onOpenSqlModal}
              className="inline-flex items-center gap-1.5 bg-[#1E3A6C] hover:bg-[#162B52] text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Skema & Export SQL</span>
            </button>
            <button
              type="button"
              id="admin-btn-reset"
              onClick={() => {
                if (confirm('Kembalikan data ke data awal contoh sekolah Kalam Kudus Sukoharjo?')) {
                  onResetData();
                  showFeedback('Data berhasil dikembalikan ke standar awal.');
                }
              }}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
              title="Reset ke data awal"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Demo</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500">Total Kelas</div>
            <div className="text-2xl font-extrabold text-[#1E3A6C] mt-0.5">{classes.length}</div>
            <div className="text-[11px] text-slate-500">Kelas X, XI, & XII</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500">Total Siswa</div>
            <div className="text-2xl font-extrabold text-[#1E3A6C] mt-0.5">{students.length}</div>
            <div className="text-[11px] text-emerald-600 font-medium">Terdaftar aktif</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500">Dewan Guru</div>
            <div className="text-2xl font-extrabold text-[#1E3A6C] mt-0.5">{teachers.length}</div>
            <div className="text-[11px] text-slate-500">{classes.length} Wali Kelas</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500">Mata Pelajaran</div>
            <div className="text-2xl font-extrabold text-[#1E3A6C] mt-0.5">{subjects.length}</div>
            <div className="text-[11px] text-emerald-600 font-medium">Kurikulum Merdeka</div>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-xs animate-in fade-in text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{feedbackMessage}</span>
        </div>
      )}

      {/* Admin Sub-tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-0.5">
        <button
          type="button"
          id="tab-tahun-ajaran"
          onClick={() => setActiveTab('tahun_ajaran')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'tahun_ajaran'
              ? 'border-[#D8232A] text-[#1E3A6C] bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#D8232A]" />
          <span>Tahun Ajaran & Semester</span>
        </button>

        <button
          type="button"
          id="tab-kelas"
          onClick={() => setActiveTab('kelas')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'kelas'
              ? 'border-[#D8232A] text-[#1E3A6C] bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          }`}
        >
          <School className="w-4 h-4 text-[#1E3A6C]" />
          <span>Kelas & Wali Kelas ({classes.length})</span>
        </button>

        <button
          type="button"
          id="tab-mapel"
          onClick={() => setActiveTab('mapel')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'mapel'
              ? 'border-[#D8232A] text-[#1E3A6C] bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#1E3A6C]" />
          <span>Mata Pelajaran ({subjects.length})</span>
        </button>

        <button
          type="button"
          id="tab-guru"
          onClick={() => setActiveTab('guru')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'guru'
              ? 'border-[#D8232A] text-[#1E3A6C] bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          }`}
        >
          <Users className="w-4 h-4 text-[#1E3A6C]" />
          <span>Guru & Pembagian Mengajar ({assignments.length})</span>
        </button>

        <button
          type="button"
          id="tab-siswa"
          onClick={() => setActiveTab('siswa')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'siswa'
              ? 'border-[#D8232A] text-[#1E3A6C] bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#1E3A6C]" />
          <span>Kelola Siswa ({students.length})</span>
        </button>

        <button
          type="button"
          id="tab-cetak"
          onClick={() => setActiveTab('cetak')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'cetak'
              ? 'border-[#D8232A] text-[#1E3A6C] bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          }`}
        >
          <Printer className="w-4 h-4 text-[#1E3A6C]" />
          <span>Pengaturan Cetak & Rapor</span>
        </button>

        <button
          type="button"
          id="tab-profil"
          onClick={() => setActiveTab('profil')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'profil'
              ? 'border-[#D8232A] text-[#1E3A6C] bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          }`}
        >
          <Building className="w-4 h-4 text-[#1E3A6C]" />
          <span>Profil & Logo Sekolah</span>
        </button>

        <button
          type="button"
          id="tab-admin-users"
          onClick={() => setActiveTab('admin_users')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'admin_users'
              ? 'border-[#D8232A] text-[#1E3A6C] bg-white font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#1E3A6C]" />
          <span>Akun Login Admin</span>
          {adminUsers && (
            <span className="bg-blue-100 text-[#1E3A6C] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {adminUsers.length}
            </span>
          )}
        </button>
      </div>

      {/* --- TAB CONTENT: TAHUN AJARAN & SEMESTER --- */}
      {activeTab === 'tahun_ajaran' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-[#1E3A6C] mb-1">
              Daftar Periode Tahun Ajaran & Semester
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pilih tahun ajaran dan semester aktif untuk penilaian tengah semester (PTS). Seluruh sistem guru dan wali kelas akan tersinkronisasi otomatis.
            </p>

            <div className="space-y-3">
              {academicYears.map((ay) => (
                <div
                  key={ay.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    ay.isActive
                      ? 'bg-blue-50/70 border-[#1E3A6C] ring-2 ring-[#1E3A6C]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                        ay.isActive ? 'bg-[#1E3A6C] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      PTS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-base">T.A. {ay.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-semibold ${
                            ay.semester === 'Ganjil'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Semester {ay.semester}
                        </span>
                        {ay.isActive && (
                          <span className="bg-[#D8232A] text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Aktif Sekarang
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Penilaian Tengah Semester (PTS) SMA Kristen Kalam Kudus Sukoharjo
                      </div>
                    </div>
                  </div>

                  <div>
                    {ay.isActive ? (
                      <span className="text-xs font-semibold text-[#1E3A6C] flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-blue-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Periode Digunakan
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetActiveYear(ay.id)}
                        className="w-full sm:w-auto text-xs font-semibold bg-[#1E3A6C] hover:bg-[#162B52] text-white px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                      >
                        Jadikan Aktif
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Banner Fitur Kenaikan Kelas & Pergantian Tahun Ajaran */}
            <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-indigo-600 text-white rounded-lg shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-950">
                    Pergantian Tahun Ajaran Baru: Kenaikan Kelas & Kelulusan
                  </h3>
                  <p className="text-xs text-indigo-800/80 mt-0.5 max-w-xl leading-relaxed">
                    Fitur otomatis untuk meluluskan & menghapus arsip rombel jenjang kelas XII, menaikkan siswa kelas X ke XI, dan siswa kelas XI ke XII saat memasuki tahun ajaran baru.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPromotionWizardOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Buka Wizard Kenaikan Kelas</span>
              </button>
            </div>
          </div>

          {/* Form Tambah Tahun Ajaran Baru */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
            <h2 className="text-sm font-bold text-[#1E3A6C] mb-1 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#D8232A]" />
              Tambah Tahun Akademik Baru
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Sistem ini dirancang untuk dapat digunakan berkelanjutan setiap tahun pelajaran baru.
            </p>

            <form onSubmit={handleAddAcademicYear} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Format Tahun Ajaran (Contoh: 2025/2026)
                </label>
                <input
                  type="text"
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  placeholder="2025/2026"
                  required
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Periode Semester
                </label>
                <select
                  value={newYearSemester}
                  onChange={(e) => setNewYearSemester(e.target.value as SemesterType)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none bg-white"
                >
                  <option value="Ganjil">Semester Ganjil (Gasal)</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D8232A] hover:bg-[#b81c22] text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Simpan Tahun Ajaran Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: KELAS & WALI KELAS --- */}
      {activeTab === 'kelas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1E3A6C]">Daftar Rombongan Belajar (Kelas)</h2>
                <p className="text-xs text-slate-500">Tentukan nama kelas dan guru yang ditugaskan sebagai Wali Kelas</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Nama Kelas</th>
                    <th className="py-2.5 px-3">Tingkat / Kurikulum</th>
                    <th className="py-2.5 px-3">Wali Kelas Terpilih</th>
                    <th className="py-2.5 px-3 text-center">Jml Siswa</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((c) => {
                    const studentCount = students.filter((s) => s.classId === c.id).length;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-bold text-[#1E3A6C]">
                          <span className="bg-blue-50 px-2 py-1 rounded border border-blue-200">
                            {c.name}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {c.gradeLevel} • {c.major || 'Umum'}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={c.homeroomTeacherId}
                            onChange={(e) => handleUpdateWaliKelas(c.id, e.target.value)}
                            className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#1E3A6C] bg-white font-medium"
                          >
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="bg-slate-100 font-semibold px-2 py-0.5 rounded text-xs">
                            {studentCount} Siswa
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteClass(c.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                            title="Hapus Kelas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Tambah Kelas */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
            <h2 className="text-sm font-bold text-[#1E3A6C] mb-1 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#D8232A]" />
              Buat Kelas Baru
            </h2>
            <p className="text-xs text-slate-500 mb-4">Tambahkan rombel kelas baru ke dalam sistem.</p>

            <form onSubmit={handleAddClass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kelas</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Contoh: X-C atau XI-MIPA 2"
                  required
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value as 'X' | 'XI' | 'XII')}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="X">Kelas X (Fase E)</option>
                  <option value="XI">Kelas XI (Fase F)</option>
                  <option value="XII">Kelas XII (Fase F)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fokus / Jurusan</label>
                <input
                  type="text"
                  value={newClassMajor}
                  onChange={(e) => setNewClassMajor(e.target.value)}
                  placeholder="Fase E / MIPA / IPS"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Wali Kelas</label>
                <select
                  value={newClassWaliId}
                  onChange={(e) => setNewClassWaliId(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Pilih Guru --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A6C] hover:bg-[#162B52] text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-lg shadow-xs transition-colors mt-2"
              >
                Simpan Kelas Baru
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: MATA PELAJARAN --- */}
      {activeTab === 'mapel' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1E3A6C]">
                  Daftar Mata Pelajaran
                </h2>
                <p className="text-xs text-slate-500">
                  Mata pelajaran dikelompokkan sesuai kurikulum resmi. Penilaian capaian belajar menggunakan skala murni 0–100 sesuai standar Kurikulum Merdeka.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBulkImport('mapel')}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
                title="Import daftar mata pelajaran dari file Excel atau CSV"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-100" />
                <span>Upload Masal Mapel</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Nama Mata Pelajaran</th>
                    <th className="py-2.5 px-3">Kelompok</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        {sub.code}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#1E3A6C]">
                        {sub.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-xs">
                        <span className="bg-slate-100 px-2 py-0.5 rounded">
                          {sub.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(sub.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="Hapus Mapel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Tambah Mapel */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
            <h2 className="text-sm font-bold text-[#1E3A6C] mb-1 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#D8232A]" />
              Tambah Mata Pelajaran
            </h2>
            <p className="text-xs text-slate-500 mb-4">Tambahkan mapel baru untuk struktur penilaian PTS.</p>

            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Mapel</label>
                <input
                  type="text"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  placeholder="Misal: INF / BIO"
                  required
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Misal: Informatika"
                  required
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kelompok Mapel</label>
                <select
                  value={newSubjectCategory}
                  onChange={(e) => setNewSubjectCategory(e.target.value as SubjectCategory)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Kelompok A (Umum)">{catTitleA}</option>
                  <option value="Kelompok B (Umum)">{catTitleB}</option>
                  <option value="Kelompok C (Peminatan)">{catTitleC}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A6C] hover:bg-[#162B52] text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-lg shadow-xs transition-colors mt-2"
              >
                Simpan Mata Pelajaran
              </button>
            </form>
          </div>

          {/* Form Pengaturan Nama Kelompok Mapel */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
            <h2 className="text-sm font-bold text-[#1E3A6C] mb-1 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Atur Nama Kelompok Mapel
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Ubah penamaan kategori kelompok mata pelajaran yang akan ditampilkan pada Rapor PTS dan Leger Nilai.
            </p>

            <form onSubmit={handleSaveCategoryTitles} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Header Kelompok A
                </label>
                <input
                  type="text"
                  value={catTitleA}
                  onChange={(e) => setCatTitleA(e.target.value)}
                  placeholder="Kelompok A (Muatan Umum / Wajib)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Header Kelompok B
                </label>
                <input
                  type="text"
                  value={catTitleB}
                  onChange={(e) => setCatTitleB(e.target.value)}
                  placeholder="Kelompok B (Muatan Kewilayahan / Umum)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Header Kelompok C
                </label>
                <input
                  type="text"
                  value={catTitleC}
                  onChange={(e) => setCatTitleC(e.target.value)}
                  placeholder="Kelompok C (Peminatan / Pilihan)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-lg shadow-xs transition-colors mt-2"
              >
                Simpan Nama Kelompok
              </button>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-500 mt-2">
                💡 <em>Catatan:</em> Penamaan ini juga tersinkronisasi otomatis dengan menu <strong>Pengaturan Cetak & Rapor</strong>.
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: GURU & PEMBAGIAN MENGAJAR --- */}
      {activeTab === 'guru' && (
        <div className="space-y-6">
          {/* Section 1: Daftar Guru & Akun Login */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1E3A6C] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#D8232A]" />
                  <span>Daftar Guru & Akun Login Sistem</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Guru login menggunakan Username dan Kata Sandi di bawah ini untuk mengakses form penginputan nilai dan pencetakan rapor.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenBulkImport('guru')}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
                  title="Import data dewan guru & akun login dari file Excel / CSV"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-100" />
                  <span>Upload Masal Guru</span>
                </button>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Cari guru / NIP..."
                    className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1E3A6C] focus:outline-none w-44 sm:w-56"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Nama Guru & NIP</th>
                    <th className="py-2.5 px-3 text-center">L/P</th>
                    <th className="py-2.5 px-3">Status Perwalian</th>
                    <th className="py-2.5 px-3">Username Login</th>
                    <th className="py-2.5 px-3">Kata Sandi</th>
                    <th className="py-2.5 px-3 text-center">Aksi & Akses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers
                    .filter((t) =>
                      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                      t.nip.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                      (t.username || '').toLowerCase().includes(teacherSearch.toLowerCase())
                    )
                    .map((teacher, idx) => {
                      const homeroom = classes.find((c) => c.homeroomTeacherId === teacher.id);
                      const isHomeroom = Boolean(homeroom);

                      return (
                        <tr key={teacher.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-800">{teacher.name}</div>
                            <div className="text-[11px] text-slate-400">NIP: {teacher.nip}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${
                                teacher.gender === 'L'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-pink-50 text-pink-700'
                              }`}
                            >
                              {teacher.gender}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {isHomeroom ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">
                                <UserCheck className="w-3 h-3 text-emerald-600" />
                                Wali Kelas {homeroom?.name}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">Guru Mapel</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className="bg-blue-50 text-[#1E3A6C] px-2 py-0.5 rounded font-bold border border-blue-200 text-xs">
                              {teacher.username || '-'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                              {teacher.password || 'guru123'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {onImpersonateTeacher && (
                                <button
                                  type="button"
                                  onClick={() => onImpersonateTeacher(teacher)}
                                  className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded text-xs font-bold transition-colors"
                                  title="Langsung login / masuk ke portal guru ini"
                                >
                                  <LogIn className="w-3 h-3 text-amber-700" />
                                  <span className="hidden sm:inline">Uji Login</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleResetTeacherPassword(teacher)}
                                className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100 text-xs"
                                title="Reset kata sandi ke 'guru123'"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartEditTeacher(teacher)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                title="Edit data & akun guru"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTeacher(teacher.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                title="Hapus guru"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Matriks Pembagian Mengajar & Form Pendaftaran Guru */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Tabel Penugasan Mengajar (Guru mengajar mapel apa di kelas mana) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h2 className="text-base font-bold text-[#1E3A6C] mb-1">
                  Matriks Pembagian Mengajar Guru Mapel
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Guru mapel hanya memiliki akses untuk menginput nilai siswa sesuai kelas dan mapel yang diampunya di bawah ini.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">Nama Guru</th>
                        <th className="py-2.5 px-3">Mata Pelajaran</th>
                        <th className="py-2.5 px-3">Kelas yang Diampu</th>
                        <th className="py-2.5 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assignments.map((assign) => {
                        const teacher = teachers.find((t) => t.id === assign.teacherId);
                        const subject = subjects.find((s) => s.id === assign.subjectId);
                        const cls = classes.find((c) => c.id === assign.classId);

                        return (
                          <tr key={assign.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              {teacher?.name || '-'}
                              <div className="text-[11px] text-slate-400">NIP: {teacher?.nip}</div>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-[#1E3A6C]">
                              {subject?.name || '-'}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="bg-blue-50 text-[#1E3A6C] font-bold px-2 py-0.5 rounded border border-blue-200 text-xs">
                                {cls?.name || '-'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteAssignment(assign.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                title="Hapus Penugasan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form Penetapan Penugasan Mengajar */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-[#1E3A6C] mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#D8232A]" />
                  Tugaskan Guru Mapel Mengajar di Kelas
                </h3>

                <form onSubmit={handleAddAssignment} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Guru</label>
                    <select
                      value={assignTeacherId}
                      onChange={(e) => setAssignTeacherId(e.target.value)}
                      required
                      className="w-full text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- Pilih Guru --</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                    <select
                      value={assignSubjectId}
                      onChange={(e) => setAssignSubjectId(e.target.value)}
                      required
                      className="w-full text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- Pilih Mapel --</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Target</label>
                    <select
                      value={assignClassId}
                      onChange={(e) => setAssignClassId(e.target.value)}
                      required
                      className="w-full text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3 pt-1">
                    <button
                      type="submit"
                      className="w-full bg-[#1E3A6C] hover:bg-[#162B52] text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-lg shadow-xs transition-colors"
                    >
                      Tambahkan Penugasan Mengajar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Form Tambah Guru Baru */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
              <h2 className="text-sm font-bold text-[#1E3A6C] mb-1 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#D8232A]" />
                Daftarkan Guru Baru
              </h2>
              <p className="text-xs text-slate-500 mb-4">Tambahkan data tenaga pengajar beserta akun login sistem.</p>

              <form onSubmit={handleAddTeacher} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={newTeacherName}
                    onChange={(e) => {
                      setNewTeacherName(e.target.value);
                      if (!newTeacherUsername) {
                        const suggested = e.target.value.toLowerCase().trim().split(' ')[0].replace(/[^a-z0-9]/g, '');
                        setNewTeacherUsername(suggested);
                      }
                    }}
                    placeholder="Contoh: Yohanes Kristianto, S.Si."
                    required
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / NUPTK</label>
                  <input
                    type="text"
                    value={newTeacherNip}
                    onChange={(e) => setNewTeacherNip(e.target.value)}
                    placeholder="19851108 201001 1 012"
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                    <select
                      value={newTeacherGender}
                      onChange={(e) => setNewTeacherGender(e.target.value as 'L' | 'P')}
                      className="w-full text-xs sm:text-sm px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Sekolah</label>
                    <input
                      type="email"
                      value={newTeacherEmail}
                      onChange={(e) => setNewTeacherEmail(e.target.value)}
                      placeholder="guru@kalamkudus..."
                      className="w-full text-xs sm:text-sm px-2.5 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">Akun Login Guru:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Username</label>
                      <input
                        type="text"
                        value={newTeacherUsername}
                        onChange={(e) => setNewTeacherUsername(e.target.value)}
                        placeholder="Contoh: yohanes"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kata Sandi</label>
                      <input
                        type="text"
                        value={newTeacherPassword}
                        onChange={(e) => setNewTeacherPassword(e.target.value)}
                        placeholder="guru123"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1E3A6C] hover:bg-[#162B52] text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-lg shadow-xs transition-colors mt-2"
                >
                  Simpan Guru & Akun
                </button>
              </form>
            </div>
          </div>

          {/* Modal Edit Akun & Data Guru */}
          {editingTeacher && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
                <div className="bg-[#1E3A6C] text-white px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-amber-300" />
                    <h3 className="text-sm font-bold">Edit Data & Akun Guru</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(null)}
                    className="text-blue-200 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditTeacher} className="p-5 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      value={editTeacherName}
                      onChange={(e) => setEditTeacherName(e.target.value)}
                      required
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">NIP</label>
                      <input
                        type="text"
                        value={editTeacherNip}
                        onChange={(e) => setEditTeacherNip(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                      <select
                        value={editTeacherGender}
                        onChange={(e) => setEditTeacherGender(e.target.value as 'L' | 'P')}
                        className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Sekolah</label>
                    <input
                      type="email"
                      value={editTeacherEmail}
                      onChange={(e) => setEditTeacherEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-700 block mb-2">Akun Login:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Username</label>
                        <input
                          type="text"
                          value={editTeacherUsername}
                          onChange={(e) => setEditTeacherUsername(e.target.value)}
                          required
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kata Sandi</label>
                        <input
                          type="text"
                          value={editTeacherPassword}
                          onChange={(e) => setEditTeacherPassword(e.target.value)}
                          required
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingTeacher(null)}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1E3A6C] hover:bg-[#162B52] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: KELOLA SISWA SECARA EFISIEN --- */}
      {activeTab === 'siswa' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tabel Daftar Siswa dengan Pencarian dan Filter Cepat */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A6C]">Data Induk Siswa</h2>
                  <p className="text-xs text-slate-500">
                    Menampilkan {filteredStudents.length} dari total {students.length} siswa terdaftar
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenBulkImport('siswa')}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
                    title="Upload masal data siswa dan penempatan kelas dari file CSV atau Excel"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-100" />
                    <span>Upload Masal Siswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPromotionWizardOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
                    title="Proses kenaikan kelas atau kelulusan siswa"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Kenaikan Kelas</span>
                  </button>

                  {/* Filter Kelas */}
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={filterClassId}
                      onChange={(e) => setFilterClassId(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="all">Semua Kelas</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          Kelas {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Cari Nama / NIS / NISN..."
                      className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1E3A6C] focus:outline-none w-36 sm:w-48"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[480px]">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold z-10">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">NIS / NISN</th>
                      <th className="py-2.5 px-3">Nama Lengkap Siswa</th>
                      <th className="py-2.5 px-3 text-center">L/P</th>
                      <th className="py-2.5 px-3">Kelas</th>
                      <th className="py-2.5 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                          Tidak ditemukan siswa yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st, idx) => {
                        const cls = classes.find((c) => c.id === st.classId);
                        return (
                          <tr key={st.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-700">
                              <span className="font-semibold">{st.nis}</span>
                              <div className="text-[11px] text-slate-400">{st.nisn}</div>
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">
                              {st.name}
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  st.gender === 'L'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {st.gender}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="bg-slate-100 text-[#1E3A6C] font-semibold px-2 py-0.5 rounded text-xs">
                                {cls?.name || '-'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(st.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                title="Hapus Siswa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form Tambah Siswa Baru */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
              <h2 className="text-sm font-bold text-[#1E3A6C] mb-1 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#D8232A]" />
                Registrasi Siswa Baru
              </h2>
              <p className="text-xs text-slate-500 mb-4">Tambahkan siswa ke kelas yang dituju.</p>

              <form onSubmit={handleAddStudent} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Samuel Kurniawan"
                    required
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NIS</label>
                    <input
                      type="text"
                      value={studentNis}
                      onChange={(e) => setStudentNis(e.target.value)}
                      placeholder="24015"
                      required
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NISN</label>
                    <input
                      type="text"
                      value={studentNisn}
                      onChange={(e) => setStudentNisn(e.target.value)}
                      placeholder="0071234..."
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                    <select
                      value={studentGender}
                      onChange={(e) => setStudentGender(e.target.value as 'L' | 'P')}
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Kelas</label>
                    <select
                      value={studentClassId}
                      onChange={(e) => setStudentClassId(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D8232A] hover:bg-[#b81c22] text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-lg shadow-xs transition-colors mt-3 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Simpan Data Siswa
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: PROFIL & LOGO SEKOLAH --- */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box Kiri: Pengaturan & Upload Logo Sekolah */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#1E3A6C] mb-1 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#D8232A]" />
                Logo Resmi Sekolah
              </h2>
              <p className="text-xs text-slate-500">
                Sesuaikan logo sekolah agar persis sama dengan lambang resmi SMA Kristen Kalam Kudus Sukoharjo.
              </p>
            </div>

            {/* Preview Logo Saat Ini */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Preview Logo Aktif
              </span>
              <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center min-h-32">
                <KalamKudusLogo
                  size="lg"
                  variant="full"
                  logoUrl={schoolProfile.logoUrl}
                />
              </div>
              <div className="mt-3">
                {schoolProfile.logoUrl ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Logo Kustom Terpasang
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    Logo Vektor Standar
                  </span>
                )}
              </div>
            </div>

            {/* Unggah File Logo Baru */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1E3A6C]">
                Unggah File Gambar Logo (PNG / JPG / SVG)
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-[#1E3A6C] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 relative">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        if (dataUrl) {
                          onUpdateSchoolProfile({
                            ...schoolProfile,
                            logoUrl: dataUrl,
                          });
                          showFeedback('Logo sekolah berhasil diperbarui dari file.');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-[#1E3A6C] block">
                  Klik atau Tarik File Logo ke Sini
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Format PNG transparan atau JPG beresolusi tinggi
                </span>
              </div>

              {/* Atau masukkan URL gambar langsung */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Atau Tempel URL Gambar Logo:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://domain.com/logo-kalam-kudus.png"
                    value={schoolProfile.logoUrl || ''}
                    onChange={(e) =>
                      onUpdateSchoolProfile({
                        ...schoolProfile,
                        logoUrl: e.target.value,
                      })
                    }
                    className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1E3A6C]"
                  />
                </div>
              </div>

              {/* Tombol Reset ke Logo Standar */}
              {schoolProfile.logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSchoolProfile({
                      ...schoolProfile,
                      logoUrl: undefined,
                    });
                    showFeedback('Logo sekolah dikembalikan ke standar lambang Kalam Kudus.');
                  }}
                  className="w-full text-xs font-semibold text-slate-600 hover:text-[#D8232A] py-1.5 border border-slate-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Kembalikan ke Logo Standar
                </button>
              )}
            </div>
          </div>

          {/* Box Kanan: Data Profil & Legalitas Sekolah */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-[#1E3A6C] mb-1 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#D8232A]" />
              Informasi Resmi Satuan Pendidikan
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Data identitas satuan pendidikan yang digunakan pada basis data dan dokumen rapor PTS.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showFeedback('Profil sekolah berhasil disimpan.');
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Satuan Pendidikan
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.name}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-[#1E3A6C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NPSN (Nomor Pokok Sekolah Nasional)
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.npsn}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, npsn: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Resmi Lembaga (Huruf Kapital)
                </label>
                <input
                  type="text"
                  value={schoolProfile.formalName}
                  onChange={(e) =>
                    onUpdateSchoolProfile({ ...schoolProfile, formalName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold uppercase text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Jalan & Kawasan
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.address}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.district}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, district: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kabupaten / Kota
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.regency}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, regency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.province}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, province: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.postalCode}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, postalCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.phone}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={schoolProfile.email}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Akreditasi
                  </label>
                  <input
                    type="text"
                    value={schoolProfile.accreditation}
                    onChange={(e) =>
                      onUpdateSchoolProfile({ ...schoolProfile, accreditation: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#1E3A6C] hover:bg-[#162B52] text-white px-6 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  Simpan Perubahan Profil Sekolah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: PENGATURAN CETAK & RAPOR --- */}
      {activeTab === 'cetak' && printSettings && onUpdatePrintSettings && (
        <PrintSettingsManager
          printSettings={printSettings}
          onUpdatePrintSettings={onUpdatePrintSettings}
        />
      )}

      {/* --- TAB CONTENT: KELOLA AKUN LOGIN ADMIN --- */}
      {activeTab === 'admin_users' && adminUsers && onUpdateAdminUsers && (
        <AdminAccountsManager
          adminUsers={adminUsers}
          currentAdminUsername={currentAdminUsername || 'podtie13'}
          onUpdateAdminUsers={onUpdateAdminUsers}
        />
      )}

      {/* Modal Upload Masal Data */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        defaultType={bulkImportDefaultType}
        classes={classes}
        subjects={subjects}
        onImportTeachers={handleImportTeachers}
        onImportStudents={handleImportStudents}
        onImportSubjects={handleImportSubjects}
      />

      {/* Wizard Kenaikan Kelas & Kelulusan */}
      <ClassPromotionWizard
        isOpen={isPromotionWizardOpen}
        onClose={() => setIsPromotionWizardOpen(false)}
        classes={classes}
        students={students}
        academicYears={academicYears}
        activeYear={activeYear || academicYears[0]}
        onUpdateStudents={onUpdateStudents}
        onUpdateClasses={onUpdateClasses}
      />
    </div>
  );
};

export default AdminDashboard;
