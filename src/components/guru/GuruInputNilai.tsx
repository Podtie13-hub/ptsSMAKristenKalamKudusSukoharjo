import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  School,
  Download,
  Upload,
  Search,
  ClipboardPaste,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';
import {
  AcademicYear,
  ClassRoom,
  PTSGrade,
  Student,
  Subject,
  Teacher,
  TeachingAssignment,
} from '../../types';

interface GuruInputNilaiProps {
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassRoom[];
  assignments: TeachingAssignment[];
  students: Student[];
  grades: PTSGrade[];
  activeAcademicYear: AcademicYear;
  onSaveGrades: (updatedGrades: PTSGrade[]) => void;
}

export const GuruInputNilai: React.FC<GuruInputNilaiProps> = ({
  teachers,
  subjects,
  classes,
  assignments,
  students,
  grades,
  activeAcademicYear,
  onSaveGrades,
}) => {
  // Select active teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  // Selected assignment
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');

  // Local grades state while editing: map studentId -> string score
  const [currentScores, setCurrentScores] = useState<{ [studentId: string]: string }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal: Paste from Excel
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [pasteMatchBy, setPasteMatchBy] = useState<'order' | 'nis'>('order');
  const [showGuide, setShowGuide] = useState(true);

  // File input ref for CSV import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get assignments of this teacher
  const teacherAssignments = assignments.filter((a) => a.teacherId === selectedTeacherId);

  // Auto-select first assignment when teacher changes
  useEffect(() => {
    if (teacherAssignments.length > 0) {
      const stillValid = teacherAssignments.some((a) => a.id === selectedAssignmentId);
      if (!stillValid) {
        setSelectedAssignmentId(teacherAssignments[0].id);
      }
    } else {
      setSelectedAssignmentId('');
    }
  }, [selectedTeacherId, assignments]);

  // Current active assignment details
  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId);
  const currentClass = classes.find((c) => c.id === currentAssignment?.classId);
  const currentSubject = subjects.find((s) => s.id === currentAssignment?.subjectId);
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId);

  // Students in this class
  const classStudents = students.filter((s) => s.classId === currentClass?.id);

  // Load existing grades into local form state
  useEffect(() => {
    if (!currentAssignment || !currentSubject) return;

    const scoresMap: { [studentId: string]: string } = {};
    classStudents.forEach((student) => {
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
  }, [selectedAssignmentId, selectedTeacherId, activeAcademicYear.id, activeAcademicYear.semester, grades.length]);

  // Handle score change (single input)
  const handleScoreChange = (studentId: string, value: string) => {
    if (value === '') {
      setCurrentScores((prev) => ({
        ...prev,
        [studentId]: '',
      }));
      return;
    }

    const num = Number(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setCurrentScores((prev) => ({
        ...prev,
        [studentId]: value,
      }));
    }
  };

  // Keyboard navigation between student score inputs
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

  // Save all grades
  const handleSaveAllGrades = () => {
    if (!currentSubject || !currentClass) return;

    const newGradesList: PTSGrade[] = [...grades];

    classStudents.forEach((student) => {
      const scoreStr = currentScores[student.id];
      if (scoreStr === undefined || scoreStr === '') return;

      const scoreNum = Number(scoreStr);
      if (isNaN(scoreNum)) return;

      const existingIndex = newGradesList.findIndex(
        (g) =>
          g.studentId === student.id &&
          g.subjectId === currentSubject.id &&
          g.academicYearId === activeAcademicYear.id &&
          g.semester === activeAcademicYear.semester
      );

      const gradeObj: PTSGrade = {
        id: existingIndex >= 0 ? newGradesList[existingIndex].id : `g-${Date.now()}-${student.id}`,
        studentId: student.id,
        subjectId: currentSubject.id,
        academicYearId: activeAcademicYear.id,
        semester: activeAcademicYear.semester,
        score: scoreNum,
        updatedAt: new Date().toISOString().split('T')[0],
        updatedByTeacherId: selectedTeacherId,
      };

      if (existingIndex >= 0) {
        newGradesList[existingIndex] = gradeObj;
      } else {
        newGradesList.push(gradeObj);
      }
    });

    onSaveGrades(newGradesList);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Process paste from Excel
  const handleApplyPaste = () => {
    if (!pasteContent.trim()) return;

    const lines = pasteContent
      .trim()
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const updated = { ...currentScores };

    if (pasteMatchBy === 'nis') {
      // Lines might contain "NIS<tab>Nilai" or "NIS,Nilai"
      lines.forEach((line) => {
        const parts = line.split(/[\t,;]+/).map((p) => p.trim());
        if (parts.length >= 2) {
          const nis = parts[0];
          const val = Number(parts[1]);
          if (!isNaN(val) && val >= 0 && val <= 100) {
            const st = classStudents.find((s) => s.nis === nis);
            if (st) {
              updated[st.id] = String(val);
            }
          }
        }
      });
    } else {
      // Order-based: sequentially assign to class students
      lines.forEach((line, idx) => {
        if (idx < classStudents.length) {
          // If the line has tab, take the last column as score
          const parts = line.split(/[\t,;]+/).map((p) => p.trim());
          const scoreCandidate = parts[parts.length - 1];
          const num = Number(scoreCandidate);
          if (!isNaN(num) && num >= 0 && num <= 100) {
            const st = classStudents[idx];
            updated[st.id] = String(num);
          }
        }
      });
    }

    setCurrentScores(updated);
    setIsPasteModalOpen(false);
    setPasteContent('');
  };

  // Export class grades to clean CSV
  const handleExportCSV = () => {
    if (!currentSubject || !currentClass) return;
    const headers = 'No,NIS,NISN,Nama Siswa,Mata Pelajaran,Kelas,Nilai Akhir PTS\n';
    const rows = classStudents
      .map((st, idx) => {
        const score = currentScores[st.id] || '';
        return `${idx + 1},${st.nis},${st.nisn || '-'},"${st.name}","${currentSubject.name}","${currentClass.name}",${score}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Nilai_PTS_${currentClass.name}_${currentSubject.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV file directly
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const updated = { ...currentScores };

      // skip header row
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        // check if NIS is in cols[1] and Nilai is in cols[6] or cols[cols.length-1]
        if (cols.length >= 3) {
          const nis = cols[1];
          const lastCol = cols[cols.length - 1];
          const scoreNum = Number(lastCol);
          if (!isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 100) {
            const st = classStudents.find((s) => s.nis === nis);
            if (st) {
              updated[st.id] = String(scoreNum);
            }
          }
        }
      }

      setCurrentScores(updated);
      alert('Data nilai dari file CSV berhasil dimasukkan ke tabel! Silakan tinjau lalu klik "Simpan Semua Nilai".');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter students by search
  const filteredStudents = classStudents.filter((st) =>
    st.name.toLowerCase().includes(searchQuery.toLowerCase()) || st.nis.includes(searchQuery)
  );

  // Statistics
  const gradedCount = classStudents.filter(
    (st) => currentScores[st.id] !== undefined && currentScores[st.id] !== ''
  ).length;
  const progressPercent = classStudents.length > 0 ? Math.round((gradedCount / classStudents.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner for Guru Mapel */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E3A6C] px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D8232A]"></span>
              Portal Guru Mata Pelajaran
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E3A6C] tracking-tight">
              Input Nilai Penilaian Tengah Semester (PTS)
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Guru mapel cukup memasukkan <strong>1 Nilai Akhir PTS (skala 0–100)</strong> untuk setiap peserta didik. Penilaian murni berbasis capaian belajar sesuai Kurikulum Merdeka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Tombol Paste dari Excel */}
            <button
              type="button"
              id="btn-paste-excel"
              onClick={() => setIsPasteModalOpen(true)}
              disabled={!currentAssignment || classStudents.length === 0}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-50"
              title="Salin dan tempel kolom nilai langsung dari Excel"
            >
              <ClipboardPaste className="w-4 h-4" />
              <span>Paste dari Excel</span>
            </button>

            {/* Tombol Unduh Format CSV */}
            <button
              type="button"
              id="btn-export-csv"
              onClick={handleExportCSV}
              disabled={!currentAssignment || classStudents.length === 0}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-50"
              title="Unduh format daftar nilai untuk diisi offline"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Format CSV</span>
            </button>

            {/* Tombol Upload CSV */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!currentAssignment || classStudents.length === 0}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-50"
              title="Unggah file CSV nilai yang sudah diisi"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Unggah CSV</span>
            </button>

            {/* Tombol Simpan Nilai */}
            <button
              type="button"
              id="btn-save-grades"
              onClick={handleSaveAllGrades}
              disabled={!currentAssignment || classStudents.length === 0}
              className="inline-flex items-center gap-2 bg-[#D8232A] hover:bg-[#b81c22] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold shadow transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Semua Nilai</span>
            </button>
          </div>
        </div>

        {/* User Guide Card: Penjelasan Cara Guru Mapel Input Nilai */}
        {showGuide && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 relative text-xs text-slate-700">
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
              title="Tutup panduan"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#1E3A6C] text-white rounded-lg shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-1.5 pr-6">
                <h4 className="font-bold text-[#1E3A6C] text-sm flex items-center gap-1.5">
                  Bagaimana Cara Guru Mapel Menginput Nilai?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-xs">
                    <span className="font-bold text-[#1E3A6C] block mb-0.5">1. Pilih Akun & Mapel/Kelas</span>
                    Pilih nama Anda pada dropdown <em>"Pilih Akun Guru"</em>, lalu pilih mata pelajaran & kelas yang diampu.
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-xs">
                    <span className="font-bold text-[#1E3A6C] block mb-0.5">2. Masukkan 1 Nilai PTS</span>
                    Ketik nilai (0–100) langsung pada tabel (tekan <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300 font-mono">Enter</kbd> untuk pindah baris), atau klik <strong>"Paste dari Excel"</strong> jika sudah ada daftar nilai.
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-xs">
                    <span className="font-bold text-[#1E3A6C] block mb-0.5">3. Simpan Nilai</span>
                    Klik tombol merah <strong>"Simpan Semua Nilai"</strong>. Nilai otomatis tersinkronisasi ke portal Wali Kelas dan siap dicetak.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section: Guru & Rombel/Mapel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-[#1E3A6C] mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#D8232A]" />
              Pilih Akun Guru Pengampu
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (NIP: {t.nip})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E3A6C] mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D8232A]" />
              Pilih Mata Pelajaran & Kelas
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              disabled={teacherAssignments.length === 0}
              className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none disabled:bg-slate-100"
            >
              {teacherAssignments.length === 0 ? (
                <option value="">-- Guru ini belum memiliki jadwal mengajar --</option>
              ) : (
                teacherAssignments.map((a) => {
                  const s = subjects.find((sub) => sub.id === a.subjectId);
                  const c = classes.find((cls) => cls.id === a.classId);
                  return (
                    <option key={a.id} value={a.id}>
                      {s?.name} — Kelas {c?.name}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          {/* Progress & Stat Box */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Status Penilaian Siswa:</span>
              <span className="font-bold text-[#1E3A6C]">
                {gradedCount} / {classStudents.length} Siswa
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden my-1.5">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{progressPercent}% Lengkap</span>
              {gradedCount === classStudents.length && classStudents.length > 0 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Semua Terisi
                </span>
              ) : (
                <span className="text-amber-600 font-medium">
                  {classStudents.length - gradedCount} Belum
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success notification */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-xs text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Nilai PTS Berhasil Disimpan!</span>
            <p className="text-xs text-emerald-700 mt-0.5">
              Nilai untuk mata pelajaran {currentSubject?.name} (Kelas {currentClass?.name}) telah tersimpan ke sistem.
            </p>
          </div>
        </div>
      )}

      {/* Grades Input Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-[#1E3A6C] flex items-center gap-2">
              <span>Daftar Siswa Kelas {currentClass ? currentClass.name : '-'}</span>
              <span className="bg-blue-100 text-[#1E3A6C] text-xs font-semibold px-2 py-0.5 rounded">
                {classStudents.length} Siswa
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Mata Pelajaran: <strong>{currentSubject ? currentSubject.name : '-'}</strong> • Gunakan panah atas/bawah untuk pindah siswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari siswa atau NIS..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1E3A6C] focus:outline-none w-48 sm:w-56 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-3 w-28">NIS</th>
                <th className="py-3 px-3 w-32">NISN</th>
                <th className="py-3 px-3">Nama Peserta Didik</th>
                <th className="py-3 px-3 w-16 text-center">L/P</th>
                <th className="py-3 px-4 w-44 text-center">Nilai Akhir PTS (0 - 100)</th>
                <th className="py-3 px-3 w-32 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    {teacherAssignments.length === 0
                      ? 'Guru ini belum memiliki jadwal penugasan mengajar.'
                      : 'Tidak ada data siswa yang cocok dengan pencarian.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const scoreVal = currentScores[student.id] || '';
                  const hasScore = scoreVal !== '';

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-blue-50/30 transition-colors ${
                        hasScore ? 'bg-white' : 'bg-amber-50/20'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-xs">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                        {student.nis}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-slate-500 text-xs">
                        {student.nisn || '-'}
                      </td>

                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {student.name}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            student.gender === 'L'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {student.gender}
                        </span>
                      </td>

                      {/* Score Input */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            id={`score-input-${idx}`}
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={scoreVal}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            placeholder="0"
                            className={`w-24 text-center font-bold text-base py-1 px-2 border rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none transition-all ${
                              hasScore
                                ? 'bg-white border-blue-400 text-[#1E3A6C]'
                                : 'bg-white border-slate-300 text-slate-400 placeholder:text-slate-300'
                            }`}
                          />
                        </div>
                      </td>

                      {/* Status Pengisian */}
                      <td className="py-2.5 px-3 text-center">
                        {hasScore ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Terisi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 text-xs font-medium px-2 py-0.5 rounded-full">
                            Belum diisi
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Terisi: <strong className="text-[#1E3A6C]">{gradedCount}</strong> dari {classStudents.length} siswa • Nilai skala 0–100
          </div>
          <button
            type="button"
            onClick={handleSaveAllGrades}
            disabled={!currentAssignment || classStudents.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D8232A] hover:bg-[#b81c22] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Nilai PTS</span>
          </button>
        </div>
      </div>

      {/* MODAL: PASTE DARI EXCEL */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#1E3A6C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Paste Nilai dari Excel</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="text-blue-200 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <p>
                Salin (Copy) kolom nilai dari file Excel Anda, lalu tempelkan (Paste / <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300 font-mono">Ctrl+V</kbd>) ke dalam kotak di bawah ini.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Metode Pencocokan Nilai:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <input
                      type="radio"
                      name="matchType"
                      checked={pasteMatchBy === 'order'}
                      onChange={() => setPasteMatchBy('order')}
                    />
                    <span>Sesuai Urutan Baris Siswa (1, 2, 3...)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <input
                      type="radio"
                      name="matchType"
                      checked={pasteMatchBy === 'nis'}
                      onChange={() => setPasteMatchBy('nis')}
                    />
                    <span>Format 2 Kolom (NIS & Nilai)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tempelkan (Paste) Nilai di sini:
                </label>
                <textarea
                  rows={8}
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder={
                    pasteMatchBy === 'order'
                      ? 'Contoh (satu nilai per baris):\n85\n90\n78\n88\n92'
                      : 'Contoh:\n24001\t85\n24002\t90\n24003\t78'
                  }
                  className="w-full font-mono text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
                />
                <span className="text-[11px] text-slate-400">
                  {pasteContent.trim() ? `${pasteContent.trim().split(/\r?\n/).length} baris terdeteksi` : 'Kotak masih kosong'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyPaste}
                  disabled={!pasteContent.trim()}
                  className="px-4 py-2 bg-[#1E3A6C] hover:bg-[#162B52] text-white rounded-lg font-bold shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Terapkan Nilai ke Tabel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuruInputNilai;
