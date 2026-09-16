import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  BookOpen,
  School,
  Printer,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  Download,
  Upload,
  ClipboardPaste,
  Search,
  Sliders,
  Award,
  Users,
  UserCheck,
  Eye,
  HelpCircle,
  X,
  Edit3,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  AcademicYear,
  ClassRoom,
  PTSGrade,
  PrintSettings,
  SchoolProfile,
  Student,
  StudentEvaluation,
  Subject,
  Teacher,
  TeachingAssignment,
} from '../../types';

interface PortalGuruProps {
  currentTeacher: Teacher;
  teachers?: Teacher[];
  academicYears: AcademicYear[];
  activeAcademicYear: AcademicYear;
  classes: ClassRoom[];
  subjects: Subject[];
  assignments: TeachingAssignment[];
  students: Student[];
  grades: PTSGrade[];
  evaluations: StudentEvaluation[];
  printSettings: PrintSettings;
  schoolProfile: SchoolProfile;
  onSaveGrades: (updatedGrades: PTSGrade[]) => void;
  onUpdateEvaluations: (updatedEvals: StudentEvaluation[]) => void;
  onUpdatePrintSettings: (settings: PrintSettings) => void;
  onOpenPreviewModal: (mode: 'single' | 'class', studentIndex?: number, classId?: string) => void;
}

export const PortalGuru: React.FC<PortalGuruProps> = ({
  currentTeacher,
  teachers = [],
  academicYears,
  activeAcademicYear,
  classes,
  subjects,
  assignments,
  students,
  grades,
  evaluations,
  printSettings,
  schoolProfile,
  onSaveGrades,
  onUpdateEvaluations,
  onUpdatePrintSettings,
  onOpenPreviewModal,
}) => {
  // Check if current teacher is a Homeroom Teacher for any class
  const homeroomClass = classes.find((c) => c.homeroomTeacherId === currentTeacher.id);
  const isHomeroom = Boolean(homeroomClass);

  // Active tab: 'input_nilai' | 'walikelas'
  const [activeTab, setActiveTab] = useState<'input_nilai' | 'walikelas'>('input_nilai');

  // --- TAB 1: INPUT NILAI GURU STATES ---
  const teacherAssignments = assignments.filter((a) => a.teacherId === currentTeacher.id);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    teacherAssignments[0]?.id || ''
  );
  const [currentScores, setCurrentScores] = useState<{ [studentId: string]: string }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchGradeQuery, setSearchGradeQuery] = useState('');

  // Excel paste modal
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [pasteMatchBy, setPasteMatchBy] = useState<'order' | 'nis'>('order');
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current active assignment details
  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId);
  const currentClass = classes.find((c) => c.id === currentAssignment?.classId);
  const currentSubject = subjects.find((s) => s.id === currentAssignment?.subjectId);
  const assignmentStudents = students.filter((s) => s.classId === currentClass?.id);

  // Ensure selectedAssignmentId is valid
  useEffect(() => {
    if (teacherAssignments.length > 0) {
      const exists = teacherAssignments.some((a) => a.id === selectedAssignmentId);
      if (!exists) {
        setSelectedAssignmentId(teacherAssignments[0].id);
      }
    } else {
      setSelectedAssignmentId('');
    }
  }, [currentTeacher.id, assignments]);

  // Load existing grades into local form state
  useEffect(() => {
    if (!currentAssignment || !currentSubject) return;

    const scoresMap: { [studentId: string]: string } = {};
    assignmentStudents.forEach((student) => {
      const existing = grades.find(
        (g) =>
          g.studentId === student.id &&
          g.subjectId === currentSubject.id &&
          g.academicYearId === activeAcademicYear.id &&
          g.semester === activeAcademicYear.semester
      );

      scoresMap[student.id] = existing && existing.score !== undefined ? String(existing.score) : '';
    });

    setCurrentScores(scoresMap);
    setSaveSuccess(false);
  }, [selectedAssignmentId, activeAcademicYear.id, activeAcademicYear.semester, grades.length]);

  // Score change handler
  const handleScoreChange = (studentId: string, value: string) => {
    if (value === '') {
      setCurrentScores((prev) => ({ ...prev, [studentId]: '' }));
      return;
    }
    const num = Number(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setCurrentScores((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextInput = document.getElementById(`score-input-${currentIndex + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
        (nextInput as HTMLInputElement).select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = document.getElementById(`score-input-${currentIndex - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
        (prevInput as HTMLInputElement).select();
      }
    }
  };

  // Save Grades
  const handleSaveGrades = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentAssignment || !currentSubject) return;

    const updatedGradesList: PTSGrade[] = [...grades];
    const nowIso = new Date().toISOString();

    assignmentStudents.forEach((student) => {
      const rawScore = currentScores[student.id];
      const scoreNum = rawScore !== undefined && rawScore !== '' ? Number(rawScore) : undefined;

      const existingIdx = updatedGradesList.findIndex(
        (g) =>
          g.studentId === student.id &&
          g.subjectId === currentSubject.id &&
          g.academicYearId === activeAcademicYear.id &&
          g.semester === activeAcademicYear.semester
      );

      if (scoreNum !== undefined && !isNaN(scoreNum)) {
        const gradeRecord: PTSGrade = {
          id: existingIdx >= 0 ? updatedGradesList[existingIdx].id : `grd-${Date.now()}-${student.id}`,
          studentId: student.id,
          subjectId: currentSubject.id,
          academicYearId: activeAcademicYear.id,
          semester: activeAcademicYear.semester,
          score: scoreNum,
          updatedAt: nowIso,
          updatedByTeacherId: currentTeacher.id,
        };

        if (existingIdx >= 0) {
          updatedGradesList[existingIdx] = gradeRecord;
        } else {
          updatedGradesList.push(gradeRecord);
        }
      } else if (existingIdx >= 0 && (rawScore === '' || rawScore === undefined)) {
        updatedGradesList.splice(existingIdx, 1);
      }
    });

    onSaveGrades(updatedGradesList);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Excel paste handler
  const handleApplyPaste = () => {
    if (!pasteContent.trim() || !assignmentStudents.length) {
      setIsPasteModalOpen(false);
      return;
    }

    const lines = pasteContent.trim().split(/\r?\n/);
    const newScores = { ...currentScores };

    if (pasteMatchBy === 'order') {
      lines.forEach((line, index) => {
        if (index < assignmentStudents.length) {
          const student = assignmentStudents[index];
          const val = line.trim().replace(',', '.');
          const num = parseFloat(val);
          if (!isNaN(num) && num >= 0 && num <= 100) {
            newScores[student.id] = String(Math.round(num * 10) / 10);
          }
        }
      });
    } else {
      lines.forEach((line) => {
        const parts = line.split(/[\t,;]/);
        if (parts.length >= 2) {
          const nisKey = parts[0].trim();
          const val = parts[1].trim().replace(',', '.');
          const student = assignmentStudents.find(
            (s) => s.nis.trim() === nisKey || s.nisn.trim() === nisKey
          );
          if (student) {
            const num = parseFloat(val);
            if (!isNaN(num) && num >= 0 && num <= 100) {
              newScores[student.id] = String(Math.round(num * 10) / 10);
            }
          }
        }
      });
    }

    setCurrentScores(newScores);
    setIsPasteModalOpen(false);
    setPasteContent('');
  };

  // CSV Export & Import
  const handleDownloadCsvTemplate = () => {
    if (!currentAssignment || !currentSubject || !currentClass) return;

    let csv = `No,NIS,NISN,Nama Siswa,L/P,Nilai PTS (0-100)\n`;
    assignmentStudents.forEach((student, index) => {
      const val = currentScores[student.id] || '';
      csv += `${index + 1},"${student.nis}","${student.nisn}","${student.name}","${student.gender}","${val}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Format_PTS_${currentClass.name}_${currentSubject.code}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/);
      const newScores = { ...currentScores };

      lines.forEach((line, idx) => {
        if (idx === 0 || !line.trim()) return;
        const cols = line.split(',').map((c) => c.replace(/"/g, '').trim());
        if (cols.length >= 6) {
          const nis = cols[1];
          const scoreStr = cols[5];
          const student = assignmentStudents.find((s) => s.nis === nis);
          if (student && scoreStr !== '') {
            const num = parseFloat(scoreStr);
            if (!isNaN(num) && num >= 0 && num <= 100) {
              newScores[student.id] = String(num);
            }
          }
        }
      });

      setCurrentScores(newScores);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Quick statistics for current assignment
  const filledCount = Object.values(currentScores).filter((v) => v !== '').length;
  const totalCount = assignmentStudents.length;
  const percentComplete = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

  const validScores = Object.values(currentScores)
    .filter((v) => v !== '')
    .map(Number);
  const avgScore =
    validScores.length > 0
      ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
      : '-';
  const maxScore = validScores.length > 0 ? Math.max(...validScores) : '-';
  const minScore = validScores.length > 0 ? Math.min(...validScores) : '-';

  // --- TAB 2: WALI KELAS STATES & LOGIC ---
  const homeroomStudents = students.filter((s) => s.classId === homeroomClass?.id);

  // Print Configuration form states
  const [localPrintDate, setLocalPrintDate] = useState(printSettings.printDate);
  const [localKepsekName, setLocalKepsekName] = useState(printSettings.principalName);
  const [localKepsekNip, setLocalKepsekNip] = useState(printSettings.principalNIP);
  const [marginTop, setMarginTop] = useState(printSettings.marginTop);
  const [showPrintSettingsModal, setShowPrintSettingsModal] = useState(false);
  const [searchWaliStudent, setSearchWaliStudent] = useState('');
  const [waliSuccessMsg, setWaliSuccessMsg] = useState<string | null>(null);

  // Synchronize wali kelas print settings on mount
  useEffect(() => {
    if (isHomeroom) {
      onUpdatePrintSettings({
        ...printSettings,
        homeroomTeacherName: currentTeacher.name,
        homeroomTeacherNIP: currentTeacher.nip,
      });
    }
  }, [currentTeacher.id, isHomeroom]);

  // Save Print Configuration
  const handleSavePrintConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePrintSettings({
      ...printSettings,
      printDate: localPrintDate,
      homeroomTeacherName: currentTeacher.name,
      homeroomTeacherNIP: currentTeacher.nip,
      principalName: localKepsekName,
      principalNIP: localKepsekNip,
      marginTop: Number(marginTop),
    });
    setShowPrintSettingsModal(false);
    setWaliSuccessMsg('Pengaturan cetak dan margin atas berhasil diperbarui!');
    setTimeout(() => setWaliSuccessMsg(null), 3500);
  };

  // Calculate statistics for students in homeroom class
  const homeroomStudentStats = homeroomStudents.map((student) => {
    const studentGrades = grades.filter(
      (g) =>
        g.studentId === student.id &&
        g.academicYearId === activeAcademicYear.id &&
        g.semester === activeAcademicYear.semester
    );

    let total = 0;
    let count = 0;
    studentGrades.forEach((g) => {
      if (g.score !== undefined) {
        total += g.score;
        count += 1;
      }
    });

    const average = count > 0 ? Number((total / count).toFixed(1)) : 0;
    const completeness = subjects.length > 0 ? Math.round((count / subjects.length) * 100) : 0;

    return {
      student,
      total,
      count,
      average,
      completeness,
    };
  });

  return (
    <div className="space-y-6">
      {/* 1. Profile Banner Guru yang Sedang Login */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A6C] text-white flex items-center justify-center font-bold text-lg shadow-xs">
            {currentTeacher.gender === 'P' ? '👩‍🏫' : '👨‍🏫'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-[#1E3A6C]">{currentTeacher.name}</h1>
              {isHomeroom && (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Wali Kelas {homeroomClass?.name}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>NIP: {currentTeacher.nip}</span>
              <span>•</span>
              <span>
                Mengampu <strong>{teacherAssignments.length}</strong> kelas/mata pelajaran
              </span>
              <span>•</span>
              <span>
                Tahun Ajaran: <strong>{activeAcademicYear.name} ({activeAcademicYear.semester})</strong>
              </span>
            </p>
          </div>
        </div>

        {/* Quick Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            id="tab-guru-input"
            onClick={() => setActiveTab('input_nilai')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'input_nilai'
                ? 'bg-white text-[#1E3A6C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#D8232A]" />
            <span>Input Nilai Mapel ({teacherAssignments.length})</span>
          </button>

          {/* KHUSUS GURU YANG WALI KELAS: Tab Cetak Rapor Kelas Perwalian */}
          {isHomeroom && (
            <button
              type="button"
              id="tab-guru-walikelas"
              onClick={() => setActiveTab('walikelas')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'walikelas'
                  ? 'bg-[#1E3A6C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Portal Wali Kelas ({homeroomClass?.name})</span>
            </button>
          )}
        </div>
      </div>

      {/* --- TAB 1: INPUT NILAI MATA PELAJARAN --- */}
      {activeTab === 'input_nilai' && (
        <div className="space-y-6">
          {/* Daftar Kartu Penugasan Guru (Kelas & Mapel) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1E3A6C]" />
                <span>Pilih Kelas & Mata Pelajaran yang Diampu:</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Klik kartu untuk membuka tabel input nilai
              </span>
            </div>

            {teacherAssignments.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-800">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-bold text-sm">Belum Ada Penugasan Mengajar</h3>
                <p className="text-xs mt-1 text-amber-700">
                  Admin sekolah belum menetapkan jadwal mengajar untuk akun Anda pada tahun ajaran ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {teacherAssignments.map((a) => {
                  const cls = classes.find((c) => c.id === a.classId);
                  const sub = subjects.find((s) => s.id === a.subjectId);
                  const isSelected = a.id === selectedAssignmentId;

                  // Progress check
                  const cStudents = students.filter((s) => s.classId === cls?.id);
                  const filled = cStudents.filter((st) => {
                    const g = grades.find(
                      (gr) =>
                        gr.studentId === st.id &&
                        gr.subjectId === sub?.id &&
                        gr.academicYearId === activeAcademicYear.id &&
                        gr.semester === activeAcademicYear.semester
                    );
                    return g && g.score !== undefined;
                  }).length;

                  const percent = cStudents.length > 0 ? Math.round((filled / cStudents.length) * 100) : 0;

                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelectedAssignmentId(a.id)}
                      className={`text-left p-4 rounded-xl border transition-all relative ${
                        isSelected
                          ? 'border-[#1E3A6C] bg-blue-50/50 shadow-sm ring-2 ring-[#1E3A6C]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {sub?.code}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1E3A6C] text-white">
                          Kelas {cls?.name}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#1E3A6C] mb-1 truncate">{sub?.name}</h3>
                      <div className="text-[11px] text-slate-500 mb-3">{sub?.category}</div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-semibold">
                          <span className="text-slate-500">Progres Nilai:</span>
                          <span className={percent === 100 ? 'text-emerald-700 font-bold' : 'text-slate-700'}>
                            {filled}/{cStudents.length} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              percent === 100 ? 'bg-emerald-500' : 'bg-[#1E3A6C]'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Area Tabel Input Nilai Kelas yang Dipilih */}
          {currentAssignment && currentClass && currentSubject && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Toolbar Atas */}
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1E3A6C] flex items-center gap-2">
                    <span>Input Nilai PTS:</span>
                    <span className="text-slate-900">{currentSubject.name}</span>
                    <span className="bg-[#D8232A] text-white text-xs font-bold px-2.5 py-0.5 rounded">
                      Kelas {currentClass.name}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Masukkan nilai angka akhir PTS skala 0–100. Tekan tombol <strong>Enter</strong> atau <strong>Panah Bawah (↓)</strong> untuk navigasi cepat antar siswa.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPasteModalOpen(true)}
                    className="flex items-center gap-1.5 bg-blue-50 text-[#1E3A6C] hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    <ClipboardPaste className="w-4 h-4 text-[#D8232A]" />
                    <span>Tempel dari Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    title="Unduh Template CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Template CSV</span>
                  </button>

                  <label className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Impor Nilai</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleSaveGrades()}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Nilai</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              {saveSuccess && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center gap-2 text-emerald-800 text-xs font-bold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Nilai Penilaian Tengah Semester (PTS) berhasil disimpan ke sistem!</span>
                </div>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/50 border-b border-slate-200 text-center text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-slate-400 font-semibold text-[11px]">Kelengkapan</div>
                  <div className="text-base font-black text-[#1E3A6C] mt-0.5">
                    {filledCount} / {totalCount} ({percentComplete}%)
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-slate-400 font-semibold text-[11px]">Rata-rata Kelas</div>
                  <div className="text-base font-black text-slate-800 mt-0.5">{avgScore}</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-slate-400 font-semibold text-[11px]">Nilai Tertinggi</div>
                  <div className="text-base font-black text-emerald-700 mt-0.5">{maxScore}</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-slate-400 font-semibold text-[11px]">Nilai Terendah</div>
                  <div className="text-base font-black text-[#D8232A] mt-0.5">{minScore}</div>
                </div>
              </div>

              {/* Search Bar Siswa */}
              <div className="p-3 border-b border-slate-200 flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama atau NIS siswa..."
                    value={searchGradeQuery}
                    onChange={(e) => setSearchGradeQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1E3A6C]"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Total {assignmentStudents.length} Siswa di Kelas {currentClass.name}
                </span>
              </div>

              {/* Tabel Input Nilai Siswa */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3 w-12 text-center">No</th>
                      <th className="py-2.5 px-3 w-28">NIS</th>
                      <th className="py-2.5 px-3 w-28">NISN</th>
                      <th className="py-2.5 px-3">Nama Lengkap Siswa</th>
                      <th className="py-2.5 px-3 w-16 text-center">L/P</th>
                      <th className="py-2.5 px-3 w-36 text-center bg-blue-50/70 border-x border-blue-200 text-[#1E3A6C]">
                        Nilai PTS (0–100)
                      </th>
                      <th className="py-2.5 px-3 w-32 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {assignmentStudents
                      .filter(
                        (s) =>
                          s.name.toLowerCase().includes(searchGradeQuery.toLowerCase()) ||
                          s.nis.includes(searchGradeQuery)
                      )
                      .map((student, index) => {
                        const scoreVal = currentScores[student.id] || '';
                        const hasScore = scoreVal !== '';

                        return (
                          <tr
                            key={student.id}
                            className={`hover:bg-blue-50/40 transition-colors ${
                              index % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                            }`}
                          >
                            <td className="py-2 px-3 text-center text-slate-500 font-mono">
                              {index + 1}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-600">{student.nis}</td>
                            <td className="py-2 px-3 font-mono text-slate-500">{student.nisn}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{student.name}</td>
                            <td className="py-2 px-3 text-center text-slate-600 font-semibold">
                              {student.gender}
                            </td>
                            <td className="py-2 px-3 text-center bg-blue-50/30 border-x border-blue-200">
                              <input
                                id={`score-input-${index}`}
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                placeholder="0–100"
                                value={scoreVal}
                                onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={`w-24 px-2 py-1 text-center font-bold text-sm rounded border ${
                                  hasScore
                                    ? 'bg-white border-[#1E3A6C] text-[#1E3A6C]'
                                    : 'bg-slate-50 border-slate-300 text-slate-400'
                                } focus:ring-2 focus:ring-[#1E3A6C] focus:bg-white`}
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              {hasScore ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Terisi
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                  Belum
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Bottom save bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Pastikan semua nilai siswa telah terisi sebelum menekan simpan.
                </span>
                <button
                  type="button"
                  onClick={() => handleSaveGrades()}
                  className="flex items-center gap-2 bg-[#1E3A6C] hover:bg-[#162B52] text-white px-6 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Semua Nilai PTS</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: KHUSUS GURU WALI KELAS (CETAK RAPOR & KELAS PERWALIAN) --- */}
      {activeTab === 'walikelas' && isHomeroom && homeroomClass && (
        <div className="space-y-6">
          {/* Banner Aksi Utama Cetak Rapor */}
          <div className="bg-gradient-to-r from-[#1E3A6C] to-[#152B52] text-white rounded-xl p-5 shadow-sm border border-blue-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#D8232A] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" />
                Portal Cetak Rapor Wali Kelas
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Kelas Perwalian: {homeroomClass.name} ({homeroomClass.major})
              </h2>
              <p className="text-xs text-blue-200 mt-1 max-w-xl">
                Wali Kelas: <strong>{currentTeacher.name}</strong> • Total {homeroomStudents.length} Siswa Terdaftar. Anda dapat mencetak rapor langsung 1 kelas penuh atau mencetak per anak.
              </p>
            </div>

            {/* Tombol Utama Cetak */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                id="btn-print-class-all"
                onClick={() => onOpenPreviewModal('class', 0, homeroomClass.id)}
                className="flex items-center gap-2 bg-[#D8232A] hover:bg-[#b81c22] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all hover:shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rapor 1 Kelas ({homeroomStudents.length} Siswa)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPrintSettingsModal(true)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors"
              >
                <Sliders className="w-4 h-4" />
                <span>Pengaturan Cetak & Kop</span>
              </button>
            </div>
          </div>

          {/* Alert Success */}
          {waliSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{waliSuccessMsg}</span>
            </div>
          )}

          {/* Status Monitoring Input Guru Mapel untuk Kelas Ini */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <h3 className="text-xs sm:text-sm font-bold text-[#1E3A6C] mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D8232A]" />
              <span>Monitoring Kelengkapan Nilai Mata Pelajaran Kelas {homeroomClass.name}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Pantau kesiapan nilai dari masing-masing guru pengampu sebelum mencetak rapor siswa.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {subjects.map((sub) => {
                const asg = assignments.find(
                  (a) => a.classId === homeroomClass.id && a.subjectId === sub.id
                );
                const teacher = teachers.find((t) => t.id === asg?.teacherId);

                // Check completeness
                const filled = homeroomStudents.filter((st) => {
                  const g = grades.find(
                    (gr) =>
                      gr.studentId === st.id &&
                      gr.subjectId === sub.id &&
                      gr.academicYearId === activeAcademicYear.id &&
                      gr.semester === activeAcademicYear.semester
                  );
                  return g && g.score !== undefined;
                }).length;

                const isComplete = filled === homeroomStudents.length && homeroomStudents.length > 0;

                return (
                  <div
                    key={sub.id}
                    className={`p-2.5 rounded-lg border text-xs ${
                      isComplete
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 truncate" title={sub.name}>
                        {sub.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isComplete
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-amber-200 text-amber-800'
                        }`}
                      >
                        {filled}/{homeroomStudents.length}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate" title={teacher?.name || 'Belum ada guru'}>
                      {teacher ? teacher.name.split(',')[0] : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabel Daftar Siswa Kelas Perwalian & Aksi Cetak Per Anak */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Daftar Siswa Kelas {homeroomClass.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klik <strong>Cetak Rapor</strong> di samping nama siswa untuk pratinjau dan print rapor perorangan.
                </p>
              </div>

              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari siswa atau NIS..."
                  value={searchWaliStudent}
                  onChange={(e) => setSearchWaliStudent(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1E3A6C]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3 w-24">NIS</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3 w-12 text-center">L/P</th>
                    <th className="py-2.5 px-3 text-center w-32">Kelengkapan Nilai</th>
                    <th className="py-2.5 px-3 text-center w-28">Rata-rata PTS</th>
                    <th className="py-2.5 px-3 text-center w-36">Status Rapor</th>
                    <th className="py-2.5 px-3 text-center w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {homeroomStudentStats
                    .filter(
                      (item) =>
                        item.student.name.toLowerCase().includes(searchWaliStudent.toLowerCase()) ||
                        item.student.nis.includes(searchWaliStudent)
                    )
                    .map((item, index) => {
                      const isComplete = item.count === subjects.length && subjects.length > 0;

                      return (
                        <tr
                          key={item.student.id}
                          className={`hover:bg-blue-50/40 transition-colors ${
                            index % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                            {index + 1}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{item.student.nis}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{item.student.name}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600 font-semibold">
                            {item.student.gender}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                isComplete
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {item.count} / {subjects.length} mapel
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-sm text-[#1E3A6C]">
                            {item.average > 0 ? item.average : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                isComplete
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
                              {isComplete ? 'Siap Cetak' : 'Belum Lengkap'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {/* Cetak Rapor Per Siswa */}
                            <button
                              type="button"
                              onClick={() =>
                                onOpenPreviewModal('single', index, homeroomClass.id)
                              }
                              className="inline-flex items-center gap-1.5 bg-[#1E3A6C] hover:bg-[#162B52] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs transition-colors"
                              title="Cetak Rapor Siswa Ini"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak Rapor</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: PENGATURAN CETAK & KOP RAPOR --- */}
      {showPrintSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-[#1E3A6C] text-white p-4 flex items-center justify-between border-b-2 border-[#D8232A]">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-300" />
                <span>Pengaturan Cetak & Kop Rapor PTS</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPrintSettingsModal(false)}
                className="p-1 text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrintConfig} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Margin Atas (Top Margin: 0 – 100 mm)
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Atur jarak kosong atas agar teks rapor pas berada tepat di bawah kertas berkop resmi sekolah.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={marginTop}
                    onChange={(e) => setMarginTop(Number(e.target.value))}
                    className="flex-1 accent-[#1E3A6C]"
                  />
                  <span className="font-mono font-bold text-[#1E3A6C] text-xs w-16 text-right">
                    {marginTop} mm
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Pencetakan Rapor
                </label>
                <input
                  type="text"
                  value={localPrintDate}
                  onChange={(e) => setLocalPrintDate(e.target.value)}
                  placeholder="contoh: Sukoharjo, 27 September 2024"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={localKepsekName}
                    onChange={(e) => setLocalKepsekName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={localKepsekNip}
                    onChange={(e) => setLocalKepsekNip(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPrintSettingsModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E3A6C] text-white rounded-lg text-xs font-bold hover:bg-[#162B52]"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: TEMPEL NILAI DARI EXCEL --- */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-[#1E3A6C] text-white p-4 flex items-center justify-between border-b-2 border-[#D8232A]">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-amber-300" />
                <span>Tempel Nilai dari Excel / Spreadsheet</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="p-1 text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="matchBy"
                      checked={pasteMatchBy === 'order'}
                      onChange={() => setPasteMatchBy('order')}
                      className="accent-[#1E3A6C]"
                    />
                    <span className="font-semibold">Sesuai Urutan Baris Siswa (1 Kolom Nilai)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="matchBy"
                      checked={pasteMatchBy === 'nis'}
                      onChange={() => setPasteMatchBy('nis')}
                      className="accent-[#1E3A6C]"
                    />
                    <span className="font-semibold">Cocokkan dengan NIS (Kolom 1: NIS, Kolom 2: Nilai)</span>
                  </label>
                </div>

                <p className="text-[11px] text-slate-500">
                  Blok nilai di file Excel Anda, tekan <strong>Ctrl + C</strong>, lalu klik di dalam kotak di bawah dan tekan <strong>Ctrl + V</strong>.
                </p>
              </div>

              <textarea
                rows={8}
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder={
                  pasteMatchBy === 'order'
                    ? '85\n90\n78\n82\n...'
                    : '1024001\t85\n1024002\t90\n...'
                }
                className="w-full font-mono text-xs p-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1E3A6C]"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyPaste}
                  className="px-5 py-2 bg-[#1E3A6C] text-white rounded-lg text-xs font-bold hover:bg-[#162B52]"
                >
                  Terapkan Nilai ke Tabel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalGuru;
