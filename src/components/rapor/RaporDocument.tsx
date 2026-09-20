import React from 'react';
import {
  AcademicYear,
  ClassRoom,
  PTSGrade,
  PrintSettings,
  SchoolProfile,
  Student,
  StudentEvaluation,
  Subject,
  TeachingAssignment,
} from '../../types';

interface RaporDocumentProps {
  students: Student[];
  classroom: ClassRoom;
  academicYear: AcademicYear;
  subjects: Subject[];
  grades: PTSGrade[];
  evaluations: StudentEvaluation[];
  printSettings: PrintSettings;
  schoolProfile: SchoolProfile;
  assignments?: TeachingAssignment[];
}

export const SingleStudentRapor: React.FC<{
  student: Student;
  classroom: ClassRoom;
  academicYear: AcademicYear;
  subjects: Subject[];
  grades: PTSGrade[];
  evaluation?: StudentEvaluation;
  printSettings: PrintSettings;
  schoolProfile: SchoolProfile;
  assignments?: TeachingAssignment[];
  pageNumber?: number;
  totalPages?: number;
}> = ({
  student,
  classroom,
  academicYear,
  subjects,
  grades,
  evaluation,
  printSettings,
  schoolProfile,
  assignments = [],
}) => {
  // Get custom subject group titles from printSettings
  const titleKelA =
    printSettings.subjectGroupTitles?.['Kelompok A (Umum)'] ||
    'Kelompok A (Muatan Umum / Wajib)';
  const titleKelB =
    printSettings.subjectGroupTitles?.['Kelompok B (Umum)'] ||
    'Kelompok B (Muatan Kewilayahan / Umum)';
  const titleKelC =
    printSettings.subjectGroupTitles?.['Kelompok C (Peminatan)'] ||
    'Kelompok C (Peminatan / Pilihan)';

  // Saring mata pelajaran: Hanya yang ada guru pengampu di kelas ini ATAU ada nilai yang sudah diinput
  const classSubjects = React.useMemo(() => {
    // 1. Mapel yang diset ada guru pengampunya di kelas ini
    const assignedSubjectIds = new Set<string>();
    if (assignments && assignments.length > 0) {
      assignments.forEach((a) => {
        if (
          a.classId === classroom.id &&
          (!a.academicYearId || a.academicYearId === academicYear.id)
        ) {
          assignedSubjectIds.add(a.subjectId);
        }
      });
    }

    // 2. Mapel yang sudah memiliki nilai diinput untuk siswa ini atau untuk kelas ini
    const gradedSubjectIds = new Set<string>();
    grades.forEach((g) => {
      if (
        g.academicYearId === academicYear.id &&
        g.semester === academicYear.semester &&
        g.studentId === student.id &&
        g.score !== undefined &&
        g.score > 0
      ) {
        gradedSubjectIds.add(g.subjectId);
      }
    });

    // Saring mata pelajaran
    const filtered = subjects.filter(
      (s) => assignedSubjectIds.has(s.id) || gradedSubjectIds.has(s.id)
    );

    // Jika ditemukan mapel yang diset mengajar atau bernilai di kelas ini, gunakan hasil filter
    if (filtered.length > 0) {
      return filtered;
    }

    // Fallback cadangan jika belum ada data penugasan sama sekali di sistem
    return assignedSubjectIds.size > 0 || gradedSubjectIds.size > 0 ? filtered : subjects;
  }, [assignments, classroom.id, academicYear.id, academicYear.semester, grades, student.id, subjects]);

  // Sort subjects by category and orderIndex
  const kelA = classSubjects.filter((s) => s.category === 'Kelompok A (Umum)').sort((a, b) => a.orderIndex - b.orderIndex);
  const kelB = classSubjects.filter((s) => s.category === 'Kelompok B (Umum)').sort((a, b) => a.orderIndex - b.orderIndex);
  const kelC = classSubjects.filter((s) => s.category === 'Kelompok C (Peminatan)').sort((a, b) => a.orderIndex - b.orderIndex);

  // Student grades for this academic year & semester
  const studentGrades = grades.filter(
    (g) =>
      g.studentId === student.id &&
      g.academicYearId === academicYear.id &&
      g.semester === academicYear.semester
  );

  // Paper margin inline style from printSettings
  const marginStyle: React.CSSProperties = {
    paddingTop: `${printSettings.marginTop !== undefined ? printSettings.marginTop : 40}mm`,
    paddingBottom: `${printSettings.marginBottom || 15}mm`,
    paddingLeft: `${printSettings.marginLeft || 15}mm`,
    paddingRight: `${printSettings.marginRight || 15}mm`,
  };

  return (
    <div
      className="rapor-page bg-white text-black font-sans mx-auto relative box-border"
      style={{
        ...marginStyle,
        width: printSettings.paperSize === 'F4' ? '215mm' : '210mm',
        minHeight: printSettings.paperSize === 'F4' ? '330mm' : '297mm',
      }}
    >
      {/* 1. JUDUL RAPOR HASIL BELAJAR SISWA TENGAH SEMESTER */}
      <div className="text-center mb-3">
        <h1 className="text-[13.5px] font-black uppercase tracking-wide underline decoration-1 underline-offset-4">
          LAPORAN HASIL BELAJAR SISWA TENGAH SEMESTER
        </h1>
        <div className="text-[11px] font-bold text-slate-800 mt-1">
          TAHUN PELAJARAN {academicYear.name} — SEMESTER {academicYear.semester.toUpperCase()}
        </div>
      </div>

      {/* 2. BIODATA SISWA */}
      <div className="grid grid-cols-2 text-[10.5px] gap-x-6 gap-y-1 my-3 px-1 leading-relaxed border-b border-slate-300 pb-2">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-32 text-slate-700 font-medium">Nama Peserta Didik</span>
            <span className="w-3">:</span>
            <span className="font-bold uppercase text-slate-900">{student.name}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-slate-700 font-medium">Nomor Induk / NISN</span>
            <span className="w-3">:</span>
            <span className="font-mono text-slate-900">{student.nis} {student.nisn ? `/ ${student.nisn}` : ''}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-slate-700 font-medium">Kelas / Rombel</span>
            <span className="w-3">:</span>
            <span className="font-bold text-slate-900">{classroom.name}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex">
            <span className="w-32 text-slate-700 font-medium">Nama Sekolah</span>
            <span className="w-3">:</span>
            <span className="font-bold text-slate-900 uppercase">{schoolProfile.name}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-slate-700 font-medium">Fase Kurikulum</span>
            <span className="w-3">:</span>
            <span className="font-bold text-slate-900">{classroom.fase || 'Fase E (Kelas X)'}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-slate-700 font-medium">Semester</span>
            <span className="w-3">:</span>
            <span className="font-bold text-slate-900">{academicYear.semester}</span>
          </div>
        </div>
      </div>

      {/* 3. TABEL NILAI MATA PELAJARAN */}
      <div className="my-2">
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-slate-100 text-slate-900 font-bold text-center border-b border-black">
              <th className="border border-black px-1.5 py-1.5 w-7">No</th>
              <th className="border border-black px-2 py-1.5 text-left">Mata Pelajaran</th>
              <th className="border border-black px-1 py-1.5 w-12">KKTP / KKM</th>
              <th className="border border-black px-1 py-1.5 w-12">Nilai PTS</th>
              <th className="border border-black px-1 py-1.5 w-10">Predikat</th>
              <th className="border border-black px-2 py-1.5 text-left">Deskripsi Capaian Kompetensi</th>
            </tr>
          </thead>
          <tbody>
            {/* Kelompok A */}
            {kelA.length > 0 && (
              <>
                <tr className="bg-slate-50 font-bold border-b border-black text-slate-900">
                  <td colSpan={6} className="border border-black px-2 py-1">
                    {titleKelA}
                  </td>
                </tr>
                {kelA.map((sub, idx) => {
                  const g = studentGrades.find((gr) => gr.subjectId === sub.id);
                  const isUnderKKTP = g?.score !== undefined && g.score < sub.kkm;
                  return (
                    <tr key={sub.id} className="border-b border-black">
                      <td className="border border-black text-center py-1 font-medium">{idx + 1}</td>
                      <td className="border border-black px-2 py-1 font-semibold">{sub.name}</td>
                      <td className="border border-black text-center py-1 font-medium">{sub.kkm}</td>
                      <td className={`border border-black text-center py-1 font-bold ${isUnderKKTP ? 'text-red-700 bg-red-50/50' : ''}`}>
                        {g?.score !== undefined ? g.score : '-'}
                      </td>
                      <td className="border border-black text-center py-1 font-bold">{g?.predicate || '-'}</td>
                      <td className="border border-black px-2 py-1 leading-snug text-[9.5px]">
                        {g?.competencyNote || '-'}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}

            {/* Kelompok B */}
            {kelB.length > 0 && (
              <>
                <tr className="bg-slate-50 font-bold border-b border-black text-slate-900">
                  <td colSpan={6} className="border border-black px-2 py-1">
                    {titleKelB}
                  </td>
                </tr>
                {kelB.map((sub, idx) => {
                  const g = studentGrades.find((gr) => gr.subjectId === sub.id);
                  const isUnderKKTP = g?.score !== undefined && g.score < sub.kkm;
                  return (
                    <tr key={sub.id} className="border-b border-black">
                      <td className="border border-black text-center py-1 font-medium">{idx + 1}</td>
                      <td className="border border-black px-2 py-1 font-semibold">{sub.name}</td>
                      <td className="border border-black text-center py-1 font-medium">{sub.kkm}</td>
                      <td className={`border border-black text-center py-1 font-bold ${isUnderKKTP ? 'text-red-700 bg-red-50/50' : ''}`}>
                        {g?.score !== undefined ? g.score : '-'}
                      </td>
                      <td className="border border-black text-center py-1 font-bold">{g?.predicate || '-'}</td>
                      <td className="border border-black px-2 py-1 leading-snug text-[9.5px]">
                        {g?.competencyNote || '-'}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}

            {/* Kelompok C */}
            {kelC.length > 0 && (
              <>
                <tr className="bg-slate-50 font-bold border-b border-black text-slate-900">
                  <td colSpan={6} className="border border-black px-2 py-1">
                    {titleKelC}
                  </td>
                </tr>
                {kelC.map((sub, idx) => {
                  const g = studentGrades.find((gr) => gr.subjectId === sub.id);
                  const isUnderKKTP = g?.score !== undefined && g.score < sub.kkm;
                  return (
                    <tr key={sub.id} className="border-b border-black">
                      <td className="border border-black text-center py-1 font-medium">{idx + 1}</td>
                      <td className="border border-black px-2 py-1 font-semibold">{sub.name}</td>
                      <td className="border border-black text-center py-1 font-medium">{sub.kkm}</td>
                      <td className={`border border-black text-center py-1 font-bold ${isUnderKKTP ? 'text-red-700 bg-red-50/50' : ''}`}>
                        {g?.score !== undefined ? g.score : '-'}
                      </td>
                      <td className="border border-black text-center py-1 font-bold">{g?.predicate || '-'}</td>
                      <td className="border border-black px-2 py-1 leading-snug text-[9.5px]">
                        {g?.competencyNote || '-'}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. TABEL KEHADIRAN (KETIDAKHADIRAN) & CATATAN WALI KELAS */}
      <div className="grid grid-cols-12 gap-3 my-3 text-[10px]">
        {/* Kolom Kiri: Tabel Ketidakhadiran */}
        <div className="col-span-5">
          <table className="w-full border-collapse border border-black text-[10px]">
            <thead>
              <tr className="bg-slate-100 border-b border-black text-center font-bold">
                <th colSpan={2} className="border border-black px-2 py-1 text-left">
                  Ketidakhadiran
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="border border-black px-2 py-1 font-medium">Sakit</td>
                <td className="border border-black text-center py-1 w-16 font-bold">
                  {evaluation?.sickDays !== undefined ? evaluation.sickDays : 0} hari
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border border-black px-2 py-1 font-medium">Izin</td>
                <td className="border border-black text-center py-1 w-16 font-bold">
                  {evaluation?.permittedDays !== undefined ? evaluation.permittedDays : 0} hari
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border border-black px-2 py-1 font-medium">Tanpa Keterangan</td>
                <td className="border border-black text-center py-1 w-16 font-bold">
                  {evaluation?.unexcusedDays !== undefined ? evaluation.unexcusedDays : 0} hari
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Kolom Kanan: Catatan Wali Kelas */}
        <div className="col-span-7">
          <div className="border border-black p-2 h-full flex flex-col justify-between">
            <div>
              <div className="font-bold uppercase tracking-wider text-[9.5px] border-b border-slate-300 pb-0.5 mb-1 text-slate-800">
                Catatan Wali Kelas
              </div>
              <p className="italic text-[10px] leading-relaxed text-slate-900">
                "{evaluation?.homeroomNotes || 'Tingkatkan ketekunan belajar dan pertahankan prestasi di tengah semester.'}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TANDA TANGAN (LEGALITAS RAPOR) */}
      <div className="mt-5 text-[10.5px] break-inside-avoid">
        {/* Baris Tanggal */}
        <div className="flex justify-end mb-1 pr-6">
          <span>{printSettings.printDate || 'Sukoharjo, 27 September 2024'}</span>
        </div>

        {/* 3 Kolom Tanda Tangan: Orang Tua/Wali, Wali Kelas, Kepala Sekolah */}
        <div className="grid grid-cols-3 text-center gap-4 pt-1">
          {/* Kolom 1: Orang Tua / Wali Siswa */}
          <div className="flex flex-col justify-between h-24">
            <div>Mengetahui,<br />Orang Tua / Wali Siswa</div>
            <div>
              <div className="border-b border-black w-36 mx-auto"></div>
              <div className="text-[9.5px] text-slate-500 mt-0.5">(........................................)</div>
            </div>
          </div>

          {/* Kolom 2: Wali Kelas */}
          <div className="flex flex-col justify-between h-24">
            <div>Wali Kelas,</div>
            <div>
              <div className="font-bold underline uppercase">{printSettings.homeroomTeacherName || 'Drs. Budi Santoso, M.Pd.'}</div>
              <div className="text-[9.5px]">NIP. {printSettings.homeroomTeacherNIP || '-'}</div>
            </div>
          </div>

          {/* Kolom 3: Kepala Sekolah */}
          <div className="flex flex-col justify-between h-24">
            <div>Mengetahui,<br />Kepala Sekolah</div>
            <div>
              <div className="font-bold underline uppercase">{printSettings.principalName || schoolProfile.principalName || 'Drs. Andreas Setiawan, M.Pd.'}</div>
              <div className="text-[9.5px]">NIP. {printSettings.principalNIP || schoolProfile.principalNIP || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RaporDocument: React.FC<RaporDocumentProps> = ({
  students,
  classroom,
  academicYear,
  subjects,
  grades,
  evaluations,
  printSettings,
  schoolProfile,
  assignments = [],
}) => {
  return (
    <div id="rapor-printable-area" className="w-full">
      {students.map((student, index) => {
        const evalRecord = evaluations.find(
          (e) =>
            e.studentId === student.id &&
            e.academicYearId === academicYear.id &&
            e.semester === academicYear.semester
        );

        return (
          <div key={student.id} className="rapor-page-container">
            <SingleStudentRapor
              student={student}
              classroom={classroom}
              academicYear={academicYear}
              subjects={subjects}
              grades={grades}
              evaluation={evalRecord}
              printSettings={printSettings}
              schoolProfile={schoolProfile}
              assignments={assignments}
              pageNumber={index + 1}
              totalPages={students.length}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RaporDocument;
