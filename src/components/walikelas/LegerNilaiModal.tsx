import React, { useState, useMemo } from 'react';
import {
  X,
  Download,
  Printer,
  FileSpreadsheet,
  Award,
  Users,
  Search,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
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

interface LegerNilaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignedClass: ClassRoom;
  academicYear: AcademicYear;
  students: Student[];
  subjects: Subject[];
  grades: PTSGrade[];
  evaluations: StudentEvaluation[];
  homeroomTeacher?: Teacher;
  printSettings: PrintSettings;
  schoolProfile: SchoolProfile;
}

export const LegerNilaiModal: React.FC<LegerNilaiModalProps> = ({
  isOpen,
  onClose,
  assignedClass,
  academicYear,
  students,
  subjects,
  grades,
  evaluations,
  homeroomTeacher,
  printSettings,
  schoolProfile,
}) => {
  if (!isOpen) return null;

  const [sortBy, setSortBy] = useState<'name' | 'rank'>('name');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom subject group titles
  const titleKelA =
    printSettings.subjectGroupTitles?.['Kelompok A (Umum)'] ||
    'Kelompok A (Muatan Umum / Wajib)';
  const titleKelB =
    printSettings.subjectGroupTitles?.['Kelompok B (Umum)'] ||
    'Kelompok B (Muatan Kewilayahan / Umum)';
  const titleKelC =
    printSettings.subjectGroupTitles?.['Kelompok C (Peminatan)'] ||
    'Kelompok C (Peminatan / Pilihan)';

  // Group and sort subjects
  const kelA = useMemo(
    () =>
      subjects
        .filter((s) => s.category === 'Kelompok A (Umum)')
        .sort((a, b) => a.orderIndex - b.orderIndex),
    [subjects]
  );
  const kelB = useMemo(
    () =>
      subjects
        .filter((s) => s.category === 'Kelompok B (Umum)')
        .sort((a, b) => a.orderIndex - b.orderIndex),
    [subjects]
  );
  const kelC = useMemo(
    () =>
      subjects
        .filter((s) => s.category === 'Kelompok C (Peminatan)')
        .sort((a, b) => a.orderIndex - b.orderIndex),
    [subjects]
  );

  // All ordered subjects
  const orderedSubjects = useMemo(() => [...kelA, ...kelB, ...kelC], [kelA, kelB, kelC]);

  // Compute student stats
  const studentRows = useMemo(() => {
    return students.map((student) => {
      const studentGrades = grades.filter(
        (g) =>
          g.studentId === student.id &&
          g.academicYearId === academicYear.id &&
          g.semester === academicYear.semester
      );

      const evalRec = evaluations.find(
        (e) =>
          e.studentId === student.id &&
          e.academicYearId === academicYear.id &&
          e.semester === academicYear.semester
      );

      const subjectScores: Record<string, number | undefined> = {};
      let total = 0;
      let count = 0;

      orderedSubjects.forEach((sub) => {
        const found = studentGrades.find((g) => g.subjectId === sub.id);
        if (found && found.score !== undefined && found.score >= 0) {
          subjectScores[sub.id] = found.score;
          total += found.score;
          count += 1;
        } else {
          subjectScores[sub.id] = undefined;
        }
      });

      const average = count > 0 ? Number((total / count).toFixed(1)) : 0;

      return {
        student,
        subjectScores,
        total,
        count,
        average,
        evalRec,
      };
    });
  }, [students, grades, evaluations, academicYear, orderedSubjects]);

  // Compute ranks
  const rankedData = useMemo(() => {
    const sortedForRank = [...studentRows].sort((a, b) => b.average - a.average);
    return studentRows.map((item) => {
      const rankIdx = sortedForRank.findIndex((r) => r.student.id === item.student.id);
      return {
        ...item,
        rank: rankIdx >= 0 ? rankIdx + 1 : 0,
      };
    });
  }, [studentRows]);

  // Filter and Sort rows
  const displayRows = useMemo(() => {
    let list = [...rankedData];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.student.name.toLowerCase().includes(q) ||
          item.student.nis.includes(q) ||
          item.student.nisn.includes(q)
      );
    }

    if (sortBy === 'rank') {
      list.sort((a, b) => a.rank - b.rank);
    } else {
      list.sort((a, b) => a.student.name.localeCompare(b.student.name));
    }

    return list;
  }, [rankedData, sortBy, searchQuery]);

  // Per-Subject Summary Statistics for the Class
  const subjectStats = useMemo(() => {
    const stats: Record<
      string,
      { total: number; count: number; avg: number; max: number; min: number }
    > = {};

    orderedSubjects.forEach((sub) => {
      let sum = 0;
      let cnt = 0;
      let maxScore = -1;
      let minScore = 999;

      studentRows.forEach((row) => {
        const val = row.subjectScores[sub.id];
        if (val !== undefined && val >= 0) {
          sum += val;
          cnt += 1;
          if (val > maxScore) maxScore = val;
          if (val < minScore) minScore = val;
        }
      });

      stats[sub.id] = {
        total: sum,
        count: cnt,
        avg: cnt > 0 ? Number((sum / cnt).toFixed(1)) : 0,
        max: cnt > 0 ? maxScore : 0,
        min: cnt > 0 ? minScore : 0,
      };
    });

    return stats;
  }, [orderedSubjects, studentRows]);

  // Export to Excel / CSV format
  const handleExportCSV = () => {
    const sep = ';'; // Semicolon standard for Indonesian Excel
    const lines: string[] = [];

    // School & Class Header
    lines.push(`"LEGER NILAI PENILAIAN TENGAH SEMESTER (PTS)"`);
    lines.push(`"Nama Satuan Pendidikan"${sep}"${schoolProfile.name}"`);
    lines.push(`"Kelas"${sep}"${assignedClass.name}"`);
    lines.push(`"Tahun Pelajaran"${sep}"${academicYear.name}"`);
    lines.push(`"Semester"${sep}"${academicYear.semester}"`);
    lines.push(`"Wali Kelas"${sep}"${homeroomTeacher?.name || printSettings.homeroomTeacherName}"`);
    lines.push(`"Tanggal Unduh"${sep}"${new Date().toLocaleDateString('id-ID')}"`);
    lines.push('');

    // Table Header Row 1 (Subject groups)
    let headerGroupRow = `"No"${sep}"NIS"${sep}"NISN"${sep}"Nama Peserta Didik"${sep}"L/P"`;
    orderedSubjects.forEach((sub) => {
      headerGroupRow += `${sep}"${sub.category}"`;
    });
    headerGroupRow += `${sep}"Total Nilai"${sep}"Rata-rata PTS"${sep}"Peringkat"${sep}"Sakit"${sep}"Izin"${sep}"Alpa"${sep}"Catatan Wali Kelas"`;
    lines.push(headerGroupRow);

    // Table Header Row 2 (Subject Codes)
    let headerCodeRow = `""${sep}""${sep}""${sep}""${sep}""`;
    orderedSubjects.forEach((sub) => {
      headerCodeRow += `${sep}"${sub.code}"`;
    });
    headerCodeRow += `${sep}""${sep}""${sep}""${sep}""${sep}""${sep}""${sep}""`;
    lines.push(headerCodeRow);

    // Student Data Rows
    displayRows.forEach((row, idx) => {
      let r = `"${idx + 1}"${sep}"${row.student.nis}"${sep}"${row.student.nisn || '-'}"${sep}"${row.student.name.replace(/"/g, '""')}"${sep}"${row.student.gender}"`;

      orderedSubjects.forEach((sub) => {
        const val = row.subjectScores[sub.id];
        r += `${sep}"${val !== undefined ? val : ''}"`;
      });

      const s = row.evalRec?.sickDays || 0;
      const i = row.evalRec?.permittedDays || 0;
      const a = row.evalRec?.unexcusedDays || 0;
      const notes = (row.evalRec?.homeroomNotes || '').replace(/"/g, '""');

      r += `${sep}"${row.total}"${sep}"${row.average}"${sep}"${row.rank}"${sep}"${s}"${sep}"${i}"${sep}"${a}"${sep}"${notes}"`;
      lines.push(r);
    });

    // Summary Statistics Rows
    lines.push('');
    // Rata-rata Kelas
    let avgRow = `""${sep}""${sep}""${sep}"RATA-RATA KELAS"${sep}""`;
    orderedSubjects.forEach((sub) => {
      avgRow += `${sep}"${subjectStats[sub.id]?.avg || ''}"`;
    });
    lines.push(avgRow);

    // Nilai Tertinggi
    let maxRow = `""${sep}""${sep}""${sep}"NILAI TERTINGGI"${sep}""`;
    orderedSubjects.forEach((sub) => {
      maxRow += `${sep}"${subjectStats[sub.id]?.max || ''}"`;
    });
    lines.push(maxRow);

    // Nilai Terendah
    let minRow = `""${sep}""${sep}""${sep}"NILAI TERENDAH"${sep}""`;
    orderedSubjects.forEach((sub) => {
      minRow += `${sep}"${subjectStats[sub.id]?.min || ''}"`;
    });
    lines.push(minRow);

    // Signatures
    lines.push('');
    lines.push(`""${sep}""${sep}""${sep}"Mengetahui,"${sep}""${sep}""${sep}""${sep}""${sep}""${sep}""${sep}"${printSettings.printDate || 'Sukoharjo'}"`);
    lines.push(`""${sep}""${sep}""${sep}"Kepala Sekolah,"${sep}""${sep}""${sep}""${sep}""${sep}""${sep}""${sep}"Wali Kelas,"`);
    lines.push('');
    lines.push('');
    lines.push(
      `""${sep}""${sep}""${sep}"${printSettings.principalName}"${sep}""${sep}""${sep}""${sep}""${sep}""${sep}""${sep}"${homeroomTeacher?.name || printSettings.homeroomTeacherName}"`
    );
    lines.push(
      `""${sep}""${sep}""${sep}"NIP. ${printSettings.principalNIP || '-'}"${sep}""${sep}""${sep}""${sep}""${sep}""${sep}""${sep}"NIP. ${homeroomTeacher?.nip || printSettings.homeroomTeacherNIP || '-'}"`
    );

    // Create CSV file with UTF-8 BOM
    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeClassName = assignedClass.name.replace(/\s+/g, '_');
    const safeYearName = academicYear.name.replace(/[\/\\]/g, '-');
    link.setAttribute(
      'download',
      `Leger_Nilai_PTS_${safeClassName}_${safeYearName}_Semester_${academicYear.semester}.csv`
    );
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-[98vw] max-h-[96vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden print:p-0 print:border-none print:shadow-none print:max-w-none print:max-h-none print:rounded-none">
        
        {/* Top Control Header (Hidden on Print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1E3A6C] to-[#152B52] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-400/20 text-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-1">
                <span>Kelas {assignedClass.name}</span>
                <span>•</span>
                <span>Tahun {academicYear.name} ({academicYear.semester})</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Leger Nilai Penilaian Tengah Semester (PTS)
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white/10 p-1 rounded-xl gap-1 text-xs">
              <button
                type="button"
                onClick={() => setSortBy('name')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  sortBy === 'name' ? 'bg-white text-[#1E3A6C] shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
              >
                Urut Nama
              </button>
              <button
                type="button"
                onClick={() => setSortBy('rank')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  sortBy === 'rank' ? 'bg-white text-[#1E3A6C] shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Urut Peringkat</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
              title="Unduh leger dalam format CSV kompatibel Microsoft Excel"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel (CSV)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#D8232A] hover:bg-[#b81c22] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
              title="Cetak leger nilai secara horizontal / landscape"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Leger (Landscape)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar Filter & Information (Hidden on Print) */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0 print:hidden">
          <div className="flex items-center gap-4 text-slate-600">
            <div>
              <span className="text-slate-400">Total Siswa: </span>
              <strong className="text-slate-800">{students.length} Orang</strong>
            </div>
            <div>
              <span className="text-slate-400">Wali Kelas: </span>
              <strong className="text-[#1E3A6C]">{homeroomTeacher?.name || printSettings.homeroomTeacherName}</strong>
            </div>
            <div>
              <span className="text-slate-400">Total Mapel: </span>
              <strong className="text-slate-800">{orderedSubjects.length} Mata Pelajaran</strong>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa atau NIS..."
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white w-56 focus:ring-1 focus:ring-[#1E3A6C] focus:outline-none"
            />
          </div>
        </div>

        {/* Printable & Scrollable Matrix Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-white">
          
          {/* Printable Formal Header */}
          <div className="hidden print:block text-center mb-4 pb-2 border-b-2 border-black">
            <h1 className="text-base font-bold uppercase tracking-wider text-black">
              LEGER NILAI PENILAIAN TENGAH SEMESTER (PTS)
            </h1>
            <h2 className="text-sm font-semibold uppercase text-black">
              {schoolProfile.name}
            </h2>
            <div className="flex justify-between items-center text-[10px] mt-2 px-1 text-black font-medium">
              <div>
                <span>Kelas: <strong>{assignedClass.name}</strong></span>
                <span className="mx-2">|</span>
                <span>Semester: <strong>{academicYear.semester}</strong></span>
                <span className="mx-2">|</span>
                <span>Tahun Ajaran: <strong>{academicYear.name}</strong></span>
              </div>
              <div>
                <span>Wali Kelas: <strong>{homeroomTeacher?.name || printSettings.homeroomTeacherName}</strong></span>
              </div>
            </div>
          </div>

          {/* Table Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-black print:text-[9px]">
              <thead>
                {/* Row 1: Super Headers */}
                <tr className="bg-slate-100 print:bg-slate-200 text-black font-bold text-center">
                  <th rowSpan={2} className="border border-black px-2 py-1.5 w-8">No</th>
                  <th rowSpan={2} className="border border-black px-2 py-1.5 w-16">NIS</th>
                  <th rowSpan={2} className="border border-black px-2 py-1.5 w-20">NISN</th>
                  <th rowSpan={2} className="border border-black px-3 py-1.5 min-w-[180px] text-left">Nama Peserta Didik</th>
                  <th rowSpan={2} className="border border-black px-1.5 py-1.5 w-8">L/P</th>

                  {kelA.length > 0 && (
                    <th colSpan={kelA.length} className="border border-black px-2 py-1 text-[10px] uppercase bg-blue-50/60 print:bg-slate-100">
                      {titleKelA}
                    </th>
                  )}

                  {kelB.length > 0 && (
                    <th colSpan={kelB.length} className="border border-black px-2 py-1 text-[10px] uppercase bg-amber-50/60 print:bg-slate-100">
                      {titleKelB}
                    </th>
                  )}

                  {kelC.length > 0 && (
                    <th colSpan={kelC.length} className="border border-black px-2 py-1 text-[10px] uppercase bg-emerald-50/60 print:bg-slate-100">
                      {titleKelC}
                    </th>
                  )}

                  <th rowSpan={2} className="border border-black px-2 py-1.5 w-14 bg-slate-100">Total</th>
                  <th rowSpan={2} className="border border-black px-2 py-1.5 w-14 bg-blue-100 text-[#1E3A6C] print:text-black">Rerata</th>
                  <th rowSpan={2} className="border border-black px-2 py-1.5 w-12 bg-amber-100 text-amber-900 print:text-black">Rank</th>
                  <th colSpan={3} className="border border-black px-2 py-1 bg-slate-100">Absensi</th>
                  <th rowSpan={2} className="border border-black px-3 py-1.5 min-w-[150px] text-left">Catatan Wali Kelas</th>
                </tr>

                {/* Row 2: Subject Codes & Sub-columns */}
                <tr className="bg-slate-50 print:bg-slate-100 text-black font-bold text-center text-[10px] print:text-[8px]">
                  {orderedSubjects.map((sub) => (
                    <th
                      key={sub.id}
                      className="border border-black px-1.5 py-1 w-11 hover:bg-slate-200 transition-colors"
                      title={`${sub.name} (${sub.code})`}
                    >
                      {sub.code}
                    </th>
                  ))}
                  <th className="border border-black px-1 py-1 w-7" title="Sakit">S</th>
                  <th className="border border-black px-1 py-1 w-7" title="Izin">I</th>
                  <th className="border border-black px-1 py-1 w-7" title="Alpa / Tanpa Keterangan">A</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black font-medium">
                {displayRows.length === 0 ? (
                  <tr>
                    <td colSpan={orderedSubjects.length + 11} className="py-8 text-center text-slate-400">
                      Tidak ada data siswa ditemukan.
                    </td>
                  </tr>
                ) : (
                  displayRows.map((row, idx) => {
                    const isTopThree = row.rank <= 3 && row.rank > 0;
                    return (
                      <tr
                        key={row.student.id}
                        className={`hover:bg-blue-50/40 print:hover:bg-transparent ${
                          isTopThree ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        <td className="border border-black px-2 py-1 text-center font-mono">{idx + 1}</td>
                        <td className="border border-black px-2 py-1 font-mono text-slate-700 text-center">{row.student.nis}</td>
                        <td className="border border-black px-2 py-1 font-mono text-slate-500 text-center">{row.student.nisn || '-'}</td>
                        <td className="border border-black px-3 py-1 font-bold text-slate-900 whitespace-nowrap">
                          {row.student.name}
                        </td>
                        <td className="border border-black px-1.5 py-1 text-center font-semibold">{row.student.gender}</td>

                        {/* Subject Scores */}
                        {orderedSubjects.map((sub) => {
                          const score = row.subjectScores[sub.id];
                          return (
                            <td
                              key={sub.id}
                              className={`border border-black px-1.5 py-1 text-center font-bold font-mono ${
                                score !== undefined && score >= 90
                                  ? 'text-emerald-800'
                                  : score === undefined
                                  ? 'text-slate-300'
                                  : 'text-slate-900'
                              }`}
                            >
                              {score !== undefined ? score : '-'}
                            </td>
                          );
                        })}

                        {/* Total Score */}
                        <td className="border border-black px-2 py-1 text-center font-bold font-mono bg-slate-50/60 print:bg-transparent">
                          {row.total > 0 ? row.total : '-'}
                        </td>

                        {/* Average Score */}
                        <td className="border border-black px-2 py-1 text-center font-black font-mono bg-blue-50/80 text-[#1E3A6C] print:text-black print:bg-transparent">
                          {row.average > 0 ? row.average : '-'}
                        </td>

                        {/* Rank */}
                        <td className="border border-black px-1.5 py-1 text-center font-black font-mono">
                          {row.rank === 1 ? (
                            <span className="inline-block bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded text-[10px] font-black print:bg-transparent print:text-black">
                              1
                            </span>
                          ) : row.rank === 2 ? (
                            <span className="inline-block bg-slate-300 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black print:bg-transparent print:text-black">
                              2
                            </span>
                          ) : row.rank === 3 ? (
                            <span className="inline-block bg-amber-700/20 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-black print:bg-transparent print:text-black">
                              3
                            </span>
                          ) : (
                            <span>{row.rank || '-'}</span>
                          )}
                        </td>

                        {/* Attendance */}
                        <td className="border border-black px-1 py-1 text-center font-mono text-slate-700">
                          {row.evalRec?.sickDays || 0}
                        </td>
                        <td className="border border-black px-1 py-1 text-center font-mono text-slate-700">
                          {row.evalRec?.permittedDays || 0}
                        </td>
                        <td className="border border-black px-1 py-1 text-center font-mono text-slate-700">
                          {row.evalRec?.unexcusedDays || 0}
                        </td>

                        {/* Notes */}
                        <td className="border border-black px-2.5 py-1 text-[11px] text-slate-600 print:text-[8px] truncate max-w-xs">
                          {row.evalRec?.homeroomNotes || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}

                {/* Summary Statistics Rows */}
                {displayRows.length > 0 && (
                  <>
                    {/* Rata-rata Kelas */}
                    <tr className="bg-slate-100 print:bg-slate-100 font-bold border-t-2 border-black text-black">
                      <td colSpan={5} className="border border-black px-3 py-1 text-right uppercase tracking-wider text-[10px]">
                        Rata-rata Kelas:
                      </td>
                      {orderedSubjects.map((sub) => (
                        <td key={sub.id} className="border border-black px-1 py-1 text-center font-mono text-[11px] print:text-[8px] text-[#1E3A6C] print:text-black">
                          {subjectStats[sub.id]?.avg || '-'}
                        </td>
                      ))}
                      <td colSpan={6} className="border border-black bg-slate-100"></td>
                    </tr>

                    {/* Nilai Tertinggi */}
                    <tr className="bg-slate-50 font-bold text-black">
                      <td colSpan={5} className="border border-black px-3 py-1 text-right uppercase tracking-wider text-[10px] text-emerald-800 print:text-black">
                        Nilai Tertinggi:
                      </td>
                      {orderedSubjects.map((sub) => (
                        <td key={sub.id} className="border border-black px-1 py-1 text-center font-mono text-[11px] print:text-[8px] text-emerald-700 print:text-black">
                          {subjectStats[sub.id]?.max || '-'}
                        </td>
                      ))}
                      <td colSpan={6} className="border border-black bg-slate-50"></td>
                    </tr>

                    {/* Nilai Terendah */}
                    <tr className="bg-slate-50 font-bold text-black">
                      <td colSpan={5} className="border border-black px-3 py-1 text-right uppercase tracking-wider text-[10px] text-rose-800 print:text-black">
                        Nilai Terendah:
                      </td>
                      {orderedSubjects.map((sub) => (
                        <td key={sub.id} className="border border-black px-1 py-1 text-center font-mono text-[11px] print:text-[8px] text-rose-700 print:text-black">
                          {subjectStats[sub.id]?.min || '-'}
                        </td>
                      ))}
                      <td colSpan={6} className="border border-black bg-slate-50"></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Printable Signature Block at Bottom */}
          <div className="hidden print:flex justify-between items-start mt-6 text-[10px] text-black">
            <div className="text-center w-56">
              <p>Mengetahui,</p>
              <p className="font-bold mb-14">Kepala Sekolah</p>
              <p className="font-bold underline">{printSettings.principalName}</p>
              <p className="font-mono">NIP. {printSettings.principalNIP || '-'}</p>
            </div>

            <div className="text-center w-56">
              <p>{printSettings.printDate || 'Sukoharjo'}</p>
              <p className="font-bold mb-14">Wali Kelas {assignedClass.name}</p>
              <p className="font-bold underline">{homeroomTeacher?.name || printSettings.homeroomTeacherName}</p>
              <p className="font-mono">NIP. {homeroomTeacher?.nip || printSettings.homeroomTeacherNIP || '-'}</p>
            </div>
          </div>

        </div>

        {/* Footer info (Hidden on Print) */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Format leger telah disesuaikan dengan Kurikulum Merdeka (penilaian murni 0–100).</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
