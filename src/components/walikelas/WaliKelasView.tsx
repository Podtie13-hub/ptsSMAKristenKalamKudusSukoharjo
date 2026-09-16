import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Eye,
  Settings,
  Calendar,
  User,
  Sliders,
  Award,
  CheckCircle2,
  FileCheck,
  Edit3,
  Search,
  Filter,
  Users,
  Download,
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
} from '../../types';
import { LegerNilaiModal } from './LegerNilaiModal';

interface WaliKelasViewProps {
  teachers: Teacher[];
  classes: ClassRoom[];
  students: Student[];
  subjects: Subject[];
  grades: PTSGrade[];
  evaluations: StudentEvaluation[];
  activeAcademicYear: AcademicYear;
  printSettings: PrintSettings;
  onUpdatePrintSettings: (settings: PrintSettings) => void;
  onUpdateEvaluations: (evals: StudentEvaluation[]) => void;
  schoolProfile: SchoolProfile;
  onOpenPreviewModal: (mode: 'single' | 'class', studentIndex?: number) => void;
}

export const WaliKelasView: React.FC<WaliKelasViewProps> = ({
  teachers,
  classes,
  students,
  subjects,
  grades,
  evaluations,
  activeAcademicYear,
  printSettings,
  onUpdatePrintSettings,
  onUpdateEvaluations,
  schoolProfile,
  onOpenPreviewModal,
}) => {
  // Select active Homeroom Teacher
  const homeroomTeachers = teachers.filter((t) => classes.some((c) => c.homeroomTeacherId === t.id));
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    homeroomTeachers[0]?.id || teachers[0]?.id || ''
  );

  // Active class of this homeroom teacher
  const assignedClass = classes.find((c) => c.homeroomTeacherId === selectedTeacherId) || classes[0];

  // Form states for Print Configuration
  const [localPrintDate, setLocalPrintDate] = useState(printSettings.printDate);
  const [localWaliName, setLocalWaliName] = useState(printSettings.homeroomTeacherName);
  const [localWaliNip, setLocalWaliNip] = useState(printSettings.homeroomTeacherNIP);
  const [localKepsekName, setLocalKepsekName] = useState(printSettings.principalName);
  const [localKepsekNip, setLocalKepsekNip] = useState(printSettings.principalNIP);

  // Margin states
  const [marginTop, setMarginTop] = useState(printSettings.marginTop);
  const [marginBottom, setMarginBottom] = useState(printSettings.marginBottom);
  const [marginLeft, setMarginLeft] = useState(printSettings.marginLeft);
  const [marginRight, setMarginRight] = useState(printSettings.marginRight);
  const [paperSize, setPaperSize] = useState(printSettings.paperSize);

  // Quick edit modal for student attendance & notes
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editSick, setEditSick] = useState<number>(0);
  const [editPermitted, setEditPermitted] = useState<number>(0);
  const [editUnexcused, setEditUnexcused] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isLegerModalOpen, setIsLegerModalOpen] = useState(false);

  // Sync Wali Kelas name when teacher changes
  useEffect(() => {
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (teacher) {
      setLocalWaliName(teacher.name);
      setLocalWaliNip(teacher.nip);
      onUpdatePrintSettings({
        ...printSettings,
        homeroomTeacherName: teacher.name,
        homeroomTeacherNIP: teacher.nip,
      });
    }
  }, [selectedTeacherId]);

  // Students in this assigned class
  const classStudents = students.filter((s) => s.classId === assignedClass?.id);

  // Calculate statistics for each student
  const studentStats = classStudents.map((student) => {
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

  // Sort by average to determine class rankings
  const rankedStudents = [...studentStats].sort((a, b) => b.average - a.average);

  // Map ranking
  const getRank = (studentId: string) => {
    const idx = rankedStudents.findIndex((r) => r.student.id === studentId);
    return idx >= 0 ? idx + 1 : '-';
  };

  // Save print configuration
  const handleSavePrintSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePrintSettings({
      ...printSettings,
      printDate: localPrintDate,
      homeroomTeacherName: localWaliName,
      homeroomTeacherNIP: localWaliNip,
      principalName: localKepsekName,
      principalNIP: localKepsekNip,
      paperSize: paperSize,
      marginTop: Number(marginTop),
      marginBottom: Number(marginBottom),
      marginLeft: Number(marginLeft),
      marginRight: Number(marginRight),
    });
    setSaveSuccessMsg('Pengaturan cetak rapor dan margin berhasil diperbarui!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Open Edit Attendance & Notes
  const handleOpenEditEvaluation = (student: Student) => {
    setEditingStudent(student);
    const existing = evaluations.find(
      (e) =>
        e.studentId === student.id &&
        e.academicYearId === activeAcademicYear.id &&
        e.semester === activeAcademicYear.semester
    );
    setEditSick(existing?.sickDays || 0);
    setEditPermitted(existing?.permittedDays || 0);
    setEditUnexcused(existing?.unexcusedDays || 0);
    setEditNotes(
      existing?.homeroomNotes ||
        'Tingkatkan ketekunan belajar dan pertahankan prestasi di tengah semester.'
    );
  };

  // Save Attendance & Notes
  const handleSaveEvaluation = () => {
    if (!editingStudent) return;
    const existingIdx = evaluations.findIndex(
      (e) =>
        e.studentId === editingStudent.id &&
        e.academicYearId === activeAcademicYear.id &&
        e.semester === activeAcademicYear.semester
    );

    const updatedRec: StudentEvaluation = {
      id: existingIdx >= 0 ? evaluations[existingIdx].id : `eval-${Date.now()}-${editingStudent.id}`,
      studentId: editingStudent.id,
      academicYearId: activeAcademicYear.id,
      semester: activeAcademicYear.semester,
      sickDays: editSick,
      permittedDays: editPermitted,
      unexcusedDays: editUnexcused,
      homeroomNotes: editNotes,
    };

    let updatedList: StudentEvaluation[];
    if (existingIdx >= 0) {
      updatedList = [...evaluations];
      updatedList[existingIdx] = updatedRec;
    } else {
      updatedList = [...evaluations, updatedRec];
    }

    onUpdateEvaluations(updatedList);
    setEditingStudent(null);
    setSaveSuccessMsg(`Catatan & kehadiran untuk ${editingStudent.name} berhasil disimpan.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const filteredStats = studentStats.filter((item) =>
    item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.student.nis.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner for Wali Kelas */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E3A6C] px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D8232A]"></span>
              Portal Wali Kelas & Layanan Cetak Rapor
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E3A6C] tracking-tight">
              Rekapitulasi Nilai & Cetak Rapor Tengah Semester
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Pantau kelengkapan nilai, catatan wali kelas, atur margin cetak, dan cetak rapor per kelas maupun per siswa secara otomatis dalam format PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-leger-nilai"
              onClick={() => setIsLegerModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors"
              title="Buka dan unduh Leger Nilai PTS (Excel / PDF)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Leger Nilai PTS</span>
            </button>

            <button
              type="button"
              id="btn-preview-class"
              onClick={() => onOpenPreviewModal('class')}
              className="inline-flex items-center gap-1.5 bg-[#1E3A6C] hover:bg-[#162B52] text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>Pratinjau Rapor 1 Kelas</span>
            </button>

            <button
              type="button"
              id="btn-print-class"
              onClick={() => {
                onOpenPreviewModal('class');
              }}
              className="inline-flex items-center gap-1.5 bg-[#D8232A] hover:bg-[#b81c22] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rapor 1 Kelas (PDF)</span>
            </button>
          </div>
        </div>

        {/* Wali Kelas Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#1E3A6C] mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#D8232A]" />
              Pilih Akun Wali Kelas
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
            >
              {homeroomTeachers.map((t) => {
                const cls = classes.find((c) => c.homeroomTeacherId === t.id);
                return (
                  <option key={t.id} value={t.id}>
                    {t.name} — Wali Kelas {cls ? cls.name : '-'} (NIP: {t.nip})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Kelas yang Dipegang:</div>
              <div className="text-lg font-black text-[#1E3A6C]">Kelas {assignedClass?.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Jumlah Siswa:</div>
              <div className="text-lg font-bold text-slate-800">{classStudents.length} Siswa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Save feedback alert */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-xs text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Grid: Form Pengaturan Cetak Rapor & Rekap Nilai Siswa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Konfigurasi Cetak Rapor & Margin Kertas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#1E3A6C] flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#D8232A]" />
              Pengaturan Cetak & Penandatangan Rapor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan tanggal cetak, penandatangan, dan margin kertas rapor.
            </p>
          </div>

          <form onSubmit={handleSavePrintSettings} className="space-y-3.5">
            {/* Input Tanggal Cetak */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Cetak Rapor
              </label>
              <input
                type="text"
                value={localPrintDate}
                onChange={(e) => setLocalPrintDate(e.target.value)}
                placeholder="Sukoharjo, 27 September 2024"
                required
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Contoh: Sukoharjo, 27 September 2024</span>
            </div>

            {/* Nama Wali Kelas & NIP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Wali Kelas
              </label>
              <input
                type="text"
                value={localWaliName}
                onChange={(e) => setLocalWaliName(e.target.value)}
                placeholder="Nama Wali Kelas beserta gelar"
                required
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP Wali Kelas
              </label>
              <input
                type="text"
                value={localWaliNip}
                onChange={(e) => setLocalWaliNip(e.target.value)}
                placeholder="19780512 200501 1 004"
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
              />
            </div>

            {/* Nama Kepala Sekolah & NIP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={localKepsekName}
                onChange={(e) => setLocalKepsekName(e.target.value)}
                placeholder="Drs. Andreas Setiawan, M.Pd."
                required
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={localKepsekNip}
                onChange={(e) => setLocalKepsekNip(e.target.value)}
                placeholder="19710314 199802 1 001"
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none"
              />
            </div>

            {/* Fitur Margin Halaman Cetak */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-[#1E3A6C] mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#D8232A]" />
                Pengaturan Margin Kertas Cetak (mm)
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-700 font-bold">Margin Atas (Kertas Berkop):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marginTop}
                    onChange={(e) => setMarginTop(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-300 rounded px-2 py-1.5 text-center font-semibold focus:ring-1 focus:ring-[#1E3A6C]"
                    title="Ruang kosong di atas rapor agar pas di bawah kop surat yang sudah tercetak pada kertas (default 40mm)"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">*Kop digital ditiadakan</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Margin Bawah:</span>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={marginBottom}
                    onChange={(e) => setMarginBottom(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-300 rounded px-2 py-1.5 text-center font-semibold"
                  />
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Margin Kiri:</span>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={marginLeft}
                    onChange={(e) => setMarginLeft(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-300 rounded px-2 py-1.5 text-center font-semibold"
                  />
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Margin Kanan:</span>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={marginRight}
                    onChange={(e) => setMarginRight(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-300 rounded px-2 py-1.5 text-center font-semibold"
                  />
                </div>
              </div>

              {/* Ukuran Kertas */}
              <div className="mt-3">
                <span className="text-slate-600 font-bold text-xs block mb-1">Ukuran Kertas Rapor:</span>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as 'A4' | 'F4' | 'Letter')}
                  className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-lg bg-white font-semibold"
                >
                  <option value="A4">A4 (Standar Rapor 210 x 297 mm)</option>
                  <option value="F4">F4 / Folio (215 x 330 mm)</option>
                  <option value="Letter">Letter (216 x 279 mm)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E3A6C] hover:bg-[#162B52] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-lg shadow-xs transition-colors"
            >
              Simpan Pengaturan Cetak
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Tabel Rekapitulasi Nilai Siswa & Aksi Cetak Per Siswa / Per Kelas */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#1E3A6C] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#D8232A]" />
                Rekapitulasi Nilai Siswa — Kelas {assignedClass?.name}
              </h2>
              <p className="text-xs text-slate-500">
                Peringkat kelas, rata-rata nilai tengah semester, dan cetak rapor otomatis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLegerModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 shadow-2xs"
                title="Buka atau unduh Leger Nilai PTS kelas ini"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Leger Nilai</span>
              </button>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari siswa di kelas ini..."
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#1E3A6C] focus:outline-none w-44 sm:w-52"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-2.5 text-center w-10">Rank</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Peserta Didik</th>
                  <th className="py-2.5 px-2.5 text-center">Kelengkapan</th>
                  <th className="py-2.5 px-2.5 text-center">Rata-rata PTS</th>
                  <th className="py-2.5 px-3 text-center">Catatan & Absen</th>
                  <th className="py-2.5 px-3 text-center">Cetak Rapor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStats.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                      Tidak ada siswa di kelas ini atau tidak cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredStats.map((item) => {
                    const rank = getRank(item.student.id);
                    const evalRecord = evaluations.find(
                      (e) =>
                        e.studentId === item.student.id &&
                        e.academicYearId === activeAcademicYear.id &&
                        e.semester === activeAcademicYear.semester
                    );

                    // Find index in main list for preview
                    const studentMainIdx = classStudents.findIndex((s) => s.id === item.student.id);

                    return (
                      <tr key={item.student.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-2.5 text-center font-bold">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-black shadow-xs">
                              1
                            </span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-black">
                              2
                            </span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-900 text-xs font-black">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono">{rank}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">{item.student.nis}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">
                          {item.student.name}
                        </td>
                        <td className="py-3 px-2.5 text-center">
                          <div className="inline-flex items-center gap-1">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                item.completeness >= 100
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.count}/{subjects.length} Mapel
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2.5 text-center">
                          <span className="text-sm font-black text-[#1E3A6C] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                            {item.average > 0 ? item.average : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEditEvaluation(item.student)}
                            className="inline-flex items-center gap-1 text-xs text-[#1E3A6C] hover:text-[#D8232A] font-semibold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
                            title="Edit Catatan & Ketidakhadiran"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>
                              S:{evalRecord?.sickDays || 0} I:{evalRecord?.permittedDays || 0} A:{evalRecord?.unexcusedDays || 0}
                            </span>
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Tombol Pratinjau Per Siswa */}
                            <button
                              type="button"
                              onClick={() => onOpenPreviewModal('single', studentMainIdx)}
                              className="p-1.5 text-slate-600 hover:text-[#1E3A6C] hover:bg-blue-50 rounded border border-slate-200 transition-colors"
                              title="Pratinjau Rapor Siswa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Tombol Cetak / PDF Per Siswa */}
                            <button
                              type="button"
                              onClick={() => {
                                onOpenPreviewModal('single', studentMainIdx);
                              }}
                              className="inline-flex items-center gap-1 bg-[#D8232A] hover:bg-[#b81c22] text-white px-2.5 py-1 rounded text-xs font-bold shadow-xs transition-colors"
                              title="Cetak Rapor Siswa ini"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Class Distribution Note */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              💡 <strong>Distribusi Rapor ke Orang Tua:</strong> Anda dapat mencetak rapor sekaligus per kelas (tombol merah di atas) atau mencetak rapor per siswa sesuai kebutuhan fisik pembagian rapor.
            </span>
          </div>
        </div>
      </div>

      {/* Modal Edit Kehadiran & Catatan Siswa */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-[#1E3A6C] mb-1">
              Catatan & Kehadiran PTS: {editingStudent.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Data ini akan tercetak pada bagian Ketidakhadiran dan Catatan Wali Kelas di rapor siswa.
            </p>

            <div className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sakit (Hari)</label>
                  <input
                    type="number"
                    min="0"
                    value={editSick}
                    onChange={(e) => setEditSick(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Izin (Hari)</label>
                  <input
                    type="number"
                    min="0"
                    value={editPermitted}
                    onChange={(e) => setEditPermitted(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Alpa (Hari)</label>
                  <input
                    type="number"
                    min="0"
                    value={editUnexcused}
                    onChange={(e) => setEditUnexcused(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Motivasi / Perkembangan Wali Kelas
                </label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Catatan perkembangan akademik dan karakter siswa..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvaluation}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#D8232A] hover:bg-[#b81c22] rounded-lg shadow-xs"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Leger Nilai PTS */}
      {assignedClass && (
        <LegerNilaiModal
          isOpen={isLegerModalOpen}
          onClose={() => setIsLegerModalOpen(false)}
          assignedClass={assignedClass}
          academicYear={activeAcademicYear}
          students={classStudents}
          subjects={subjects}
          grades={grades}
          evaluations={evaluations}
          homeroomTeacher={teachers.find((t) => t.id === selectedTeacherId)}
          printSettings={printSettings}
          schoolProfile={schoolProfile}
        />
      )}
    </div>
  );
};

export default WaliKelasView;
