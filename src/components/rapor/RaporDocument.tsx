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
  // Ambil judul kelompok mapel kustom dari printSettings
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
    // 1. Mapel yang diset ada guru pengampunya di kelas ini (Setting Mengajar Guru)
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

    // 2. Mapel yang sudah memiliki nilai diinput untuk siswa ini pada semester aktif
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

    // Fallback cadangan jika belum ada data penugasan di sistem
    return assignedSubjectIds.size > 0 || gradedSubjectIds.size > 0 ? filtered : subjects;
  }, [assignments, classroom.id, academicYear.id, academicYear.semester, grades, student.id, subjects]);

  // Urutkan mapel berdasarkan kategori dan nomor urut
  const kelA = classSubjects.filter((s) => s.category === 'Kelompok A (Umum)').sort((a, b) => a.orderIndex - b.orderIndex);
  const kelB = classSubjects.filter((s) => s.category === 'Kelompok B (Umum)').sort((a, b) => a.orderIndex - b.orderIndex);
  const kelC = classSubjects.filter((s) => s.category === 'Kelompok C (Peminatan)').sort((a, b) => a.orderIndex - b.orderIndex);

  // Nilai siswa untuk tahun akademik & semester aktif
  const studentGrades = grades.filter(
    (g) =>
      g.studentId === student.id &&
      g.academicYearId === academicYear.id &&
      g.semester === academicYear.semester
  );

  // Margin kertas dari printSettings
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
            <span className="font-semibold">{student.nis} / {student.nisn || '-'}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex">
            <span className="w-28 text-slate-700 font-medium">Kelas</span>
            <span className="w-3">:</span>
            <span className="font-bold">{classroom.name}</span>
          </div>
          <div className="flex">
            <span className="w-28 text-slate-700 font-medium">Fase</span>
            <span className="w-3">:</span>
            <span className="font-bold">
              {classroom.gradeLevel === 'X' ? 'E' : 'F'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. TABEL NILAI PTS */}
      <div className="my-2.5">
        <table className="w-full border-collapse border border-black text-[10.5px]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black py-2 px-2 w-12 text-center">No</th>
              <th className="border border-black py-2 px-3 text-left">Mata Pelajaran</th>
              <th className="border border-black py-2 px-3 w-32 text-center">Nilai PTS</th>
            </tr>
          </thead>
          <tbody>
            {/* Kelompok A */}
            <tr className="bg-slate-50 font-bold">
              <td colSpan={3} className="border border-black py-1 px-3 text-[10px] uppercase text-[#1E3A6C] tracking-wide">
                {titleKelA}
              </td>
            </tr>
            {kelA.map((sub, idx) => {
              const grade = studentGrades.find((g) => g.subjectId === sub.id);
              const score = grade?.score;
              return (
                <tr key={sub.id} className="hover:bg-slate-50/50">
                  <td className="border border-black py-1.5 px-2 text-center font-medium">{idx + 1}</td>
                  <td className="border border-black py-1.5 px-3 font-medium text-slate-900">{sub.name}</td>
                  <td className="border border-black py-1.5 px-3 text-center font-bold text-slate-950">
                    {score !== undefined ? score : '-'}
                  </td>
                </tr>
              );
            })}

            {/* Kelompok B */}
            {kelB.length > 0 && (
              <>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="border border-black py-1 px-3 text-[10px] uppercase text-[#1E3A6C] tracking-wide">
                    {titleKelB}
                  </td>
                </tr>
                {kelB.map((sub, idx) => {
                  const grade = studentGrades.find((g) => g.subjectId === sub.id);
                  const score = grade?.score;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50">
                      <td className="border border-black py-1.5 px-2 text-center font-medium">{idx + 1}</td>
                      <td className="border border-black py-1.5 px-3 font-medium text-slate-900">{sub.name}</td>
                      <td className="border border-black py-1.5 px-3 text-center font-bold text-slate-950">
                        {score !== undefined ? score : '-'}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}

            {/* Kelompok C */}
            {kelC.length > 0 && (
              <>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="border border-black py-1 px-3 text-[10px] uppercase text-[#1E3A6C] tracking-wide">
                    {titleKelC}
                  </td>
                </tr>
                {kelC.map((sub, idx) => {
                  const grade = studentGrades.find((g) => g.subjectId === sub.id);
                  const score = grade?.score;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50">
                      <td className="border border-black py-1.5 px-2 text-center font-medium">{idx + 1}</td>
                      <td className="border border-black py-1.5 px-3 font-medium text-slate-900">{sub.name}</td>
                      <td className="border border-black py-1.5 px-3 text-center font-bold text-slate-950">
                        {score !== undefined ? score : '-'}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. TANDA TANGAN */}
      <div className="mt-8 pt-2 text-[10.5px]">
        <div className="flex justify-between items-start px-2">
          {/* Orang Tua / Wali */}
          <div className="text-center w-60">
            <p>Mengetahui,</p>
            <p className="font-medium">Orang Tua / Wali Siswa</p>
            <div className="h-20"></div>
            <div className="border-b border-black w-44 mx-auto"></div>
            <p className="text-[9.5px] text-slate-500 mt-1">( ................................................... )</p>
          </div>

          {/* Wali Kelas */}
          <div className="text-center w-60">
            <p>{printSettings.printDate || 'Sukoharjo, 27 September 2024'}</p>
            <p className="font-medium">Wali Kelas {classroom.name}</p>
            <div className="h-20"></div>
            <p className="font-bold underline text-slate-900">
              {printSettings.homeroomTeacherName || 'Drs. Budi Santoso, M.Pd.'}
            </p>
            <p className="text-[9.5px] text-slate-700 mt-0.5">
              NIP. {printSettings.homeroomTeacherNIP || '-'}
            </p>
          </div>
        </div>

        {/* Kepala Sekolah */}
        <div className="mt-8 text-center">
          <div className="inline-block text-center w-64">
            <p>Mengetahui,</p>
            <p className="font-medium">Kepala Sekolah</p>
            <div className="h-20"></div>
            <p className="font-bold underline text-slate-900">
              {printSettings.principalName || 'Drs. Andreas Setiawan, M.Pd.'}
            </p>
            <p className="text-[9.5px] text-slate-700 mt-0.5">
              NIP. {printSettings.principalNIP || '19710314 199802 1 001'}
            </p>
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
  assignments,
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
