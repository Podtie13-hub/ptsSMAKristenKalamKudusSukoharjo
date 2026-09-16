import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  FolderMinus,
} from 'lucide-react';
import { AcademicYear, ClassRoom, Student } from '../../types';

interface ClassPromotionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  students: Student[];
  academicYears: AcademicYear[];
  activeYear: AcademicYear;
  onUpdateStudents: (students: Student[]) => void;
  onUpdateClasses: (classes: ClassRoom[]) => void;
}

export const ClassPromotionWizard: React.FC<ClassPromotionWizardProps> = ({
  isOpen,
  onClose,
  classes,
  students,
  academicYears,
  activeYear,
  onUpdateStudents,
  onUpdateClasses,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGraduates, setSelectedGraduates] = useState<string[]>([]);
  const [removeGraduatedClasses, setRemoveGraduatedClasses] = useState(false);

  // Mapping from source classId to destination classId
  // e.g. { 'cls-1': 'cls-3' }
  const [classPromotionMap, setClassPromotionMap] = useState<Record<string, string>>({});

  const [executionSummary, setExecutionSummary] = useState<{
    graduatedCount: number;
    promotedCount: number;
  } | null>(null);

  if (!isOpen) return null;

  // Grade XII Classes & Students
  const grade12Classes = classes.filter((c) => c.gradeLevel === 'XII');
  const grade12Students = students.filter((s) => {
    const cls = classes.find((c) => c.id === s.classId);
    return cls?.gradeLevel === 'XII' && s.status === 'Aktif';
  });

  // Grade XI Classes & Students
  const grade11Classes = classes.filter((c) => c.gradeLevel === 'XI');
  const grade11Students = students.filter((s) => {
    const cls = classes.find((c) => c.id === s.classId);
    return cls?.gradeLevel === 'XI' && s.status === 'Aktif';
  });

  // Grade X Classes & Students
  const grade10Classes = classes.filter((c) => c.gradeLevel === 'X');
  const grade10Students = students.filter((s) => {
    const cls = classes.find((c) => c.id === s.classId);
    return cls?.gradeLevel === 'X' && s.status === 'Aktif';
  });

  // Initialize selected graduates on first open
  const handleSelectAllGraduates = () => {
    if (selectedGraduates.length === grade12Students.length) {
      setSelectedGraduates([]);
    } else {
      setSelectedGraduates(grade12Students.map((s) => s.id));
    }
  };

  // Set default class mapping if not set
  const handleAutoMapClasses = () => {
    const newMap: Record<string, string> = {};

    // Map X to XI if names match or first available
    grade10Classes.forEach((xClass, i) => {
      const matchXI = grade11Classes[i] || grade11Classes[0];
      if (matchXI) {
        newMap[xClass.id] = matchXI.id;
      }
    });

    // Map XI to XII
    grade11Classes.forEach((xiClass, i) => {
      const matchXII = grade12Classes[i] || grade12Classes[0];
      if (matchXII) {
        newMap[xiClass.id] = matchXII.id;
      }
    });

    setClassPromotionMap(newMap);
  };

  // Execute promotion and graduation
  const handleExecutePromotion = () => {
    const updatedStudents = students.map((s) => {
      // 1. Process graduation for selected XII students
      if (selectedGraduates.includes(s.id)) {
        return {
          ...s,
          status: 'Lulus' as const,
          classId: '', // remove from active class
        };
      }

      // 2. Process promotion for other active students
      const targetClassId = classPromotionMap[s.classId];
      if (targetClassId) {
        return {
          ...s,
          classId: targetClassId,
        };
      }

      return s;
    });

    // Count how many were promoted
    let promotedCount = 0;
    students.forEach((s) => {
      if (!selectedGraduates.includes(s.id) && classPromotionMap[s.classId]) {
        promotedCount++;
      }
    });

    // If user chose to remove graduated Grade XII classes
    let updatedClasses = [...classes];
    if (removeGraduatedClasses && grade12Classes.length > 0) {
      const gradClassIds = grade12Classes.map((c) => c.id);
      updatedClasses = classes.filter((c) => !gradClassIds.includes(c.id));
    }

    onUpdateStudents(updatedStudents);
    if (removeGraduatedClasses) {
      onUpdateClasses(updatedClasses);
    }

    setExecutionSummary({
      graduatedCount: selectedGraduates.length,
      promotedCount,
    });
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Modal Header */}
        <div className="bg-[#1E3A6C] text-white px-6 py-4 flex items-center justify-between border-b-4 border-[#D8232A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/60 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Proses Kenaikan Kelas & Kelulusan Siswa
              </h3>
              <p className="text-xs text-blue-200">
                Transisi Tahun Ajaran Baru • Kelulusan Kelas XII & Kenaikan Jenjang
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Indicator */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div
            className={`flex items-center gap-2 ${
              step === 1 ? 'text-[#1E3A6C] font-bold' : 'text-slate-500'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 1
                  ? 'bg-[#1E3A6C] text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              1
            </span>
            <span>Kelulusan Kelas XII</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div
            className={`flex items-center gap-2 ${
              step === 2 ? 'text-[#1E3A6C] font-bold' : 'text-slate-500'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 2
                  ? 'bg-[#1E3A6C] text-white'
                  : step > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span>Kenaikan Jenjang (X & XI)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div
            className={`flex items-center gap-2 ${
              step === 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span>Selesai</span>
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* STEP 1: KELULUSAN KELAS XII */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong className="block text-sm font-bold text-amber-950 mb-1">
                    Langkah 1: Luluskan Siswa Kelas XII
                  </strong>
                  Siswa yang ditandai lulus akan diubah statusnya menjadi <strong>"Lulus"</strong> dan dikeluarkan dari rombel aktif sehingga tidak tercampur dengan siswa tahun ajaran baru.
                </div>
              </div>

              {grade12Students.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">
                    Tidak ditemukan siswa aktif di Kelas XII. Anda dapat melanjutkan langsung ke Kenaikan Jenjang.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Pilih Siswa Kelas XII yang Dinyatakan Lulus:
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectAllGraduates}
                      className="text-xs font-semibold text-[#1E3A6C] hover:underline"
                    >
                      {selectedGraduates.length === grade12Students.length
                        ? 'Batalkan Semua'
                        : 'Pilih Semua Siswa'}
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="py-2 px-3 w-10 text-center">Pilih</th>
                          <th className="py-2 px-3 w-20">NIS</th>
                          <th className="py-2 px-3">Nama Siswa</th>
                          <th className="py-2 px-3">Kelas Saat Ini</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {grade12Students.map((s) => {
                          const cls = classes.find((c) => c.id === s.classId);
                          const isChecked = selectedGraduates.includes(s.id);
                          return (
                            <tr
                              key={s.id}
                              onClick={() => {
                                if (isChecked) {
                                  setSelectedGraduates(
                                    selectedGraduates.filter((id) => id !== s.id)
                                  );
                                } else {
                                  setSelectedGraduates([...selectedGraduates, s.id]);
                                }
                              }}
                              className={`cursor-pointer transition-colors ${
                                isChecked ? 'bg-amber-50/70' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="py-2 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="w-4 h-4 text-[#1E3A6C] rounded"
                                />
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-600">
                                {s.nis}
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-800">
                                {s.name}
                              </td>
                              <td className="py-2 px-3 text-slate-600 font-semibold">
                                {cls?.name || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Option to delete/archive graduated class */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="removeGradClassCheck"
                      checked={removeGraduatedClasses}
                      onChange={(e) => setRemoveGraduatedClasses(e.target.checked)}
                      className="w-4 h-4 text-[#D8232A] rounded"
                    />
                    <label
                      htmlFor="removeGradClassCheck"
                      className="text-xs text-slate-700 cursor-pointer font-medium"
                    >
                      Hapus / Kosongkan data Rombel Kelas XII lama ({grade12Classes.map((c) => c.name).join(', ')}) agar tidak menumpuk di daftar kelas.
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: KENAIKAN TINGKAT X -> XI DAN XI -> XII */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#1E3A6C] shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 leading-relaxed">
                    <strong className="block text-sm font-bold text-[#1E3A6C] mb-1">
                      Langkah 2: Pemetaan Kenaikan Rombel
                    </strong>
                    Tentukan rombel tujuan untuk siswa yang naik jenjang (misal dari Kelas X ke Kelas XI, dan dari Kelas XI ke Kelas XII).
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutoMapClasses}
                  className="px-3 py-1.5 bg-[#1E3A6C] hover:bg-[#162B52] text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-2xs"
                >
                  Otomatis Petakan
                </button>
              </div>

              {/* Pemetaan Kelas X -> XI */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>1. Kenaikan Siswa Kelas X ke Jenjang XI ({grade10Students.length} Siswa)</span>
                </h4>
                <div className="space-y-2">
                  {grade10Classes.map((xCls) => {
                    const studentCount = grade10Students.filter((s) => s.classId === xCls.id).length;
                    return (
                      <div
                        key={xCls.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-50 rounded-lg gap-2 text-xs"
                      >
                        <div className="font-semibold text-slate-800">
                          Kelas {xCls.name} ({studentCount} siswa aktif)
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 text-xs">Pindah ke:</span>
                          <select
                            value={classPromotionMap[xCls.id] || ''}
                            onChange={(e) =>
                              setClassPromotionMap({
                                ...classPromotionMap,
                                [xCls.id]: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:ring-1 focus:ring-[#1E3A6C]"
                          >
                            <option value="">-- Tetap di kelas ini --</option>
                            {grade11Classes.map((xiCls) => (
                              <option key={xiCls.id} value={xiCls.id}>
                                Kelas {xiCls.name} ({xiCls.major || 'Umum'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pemetaan Kelas XI -> XII */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>2. Kenaikan Siswa Kelas XI ke Jenjang XII ({grade11Students.length} Siswa)</span>
                </h4>
                <div className="space-y-2">
                  {grade11Classes.map((xiCls) => {
                    const studentCount = grade11Students.filter((s) => s.classId === xiCls.id).length;
                    return (
                      <div
                        key={xiCls.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-50 rounded-lg gap-2 text-xs"
                      >
                        <div className="font-semibold text-slate-800">
                          Kelas {xiCls.name} ({studentCount} siswa aktif)
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 text-xs">Pindah ke:</span>
                          <select
                            value={classPromotionMap[xiCls.id] || ''}
                            onChange={(e) =>
                              setClassPromotionMap({
                                ...classPromotionMap,
                                [xiCls.id]: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:ring-1 focus:ring-[#1E3A6C]"
                          >
                            <option value="">-- Tetap di kelas ini --</option>
                            {grade12Classes.map((xiiCls) => (
                              <option key={xiiCls.id} value={xiiCls.id}>
                                Kelas {xiiCls.name} ({xiiCls.major || 'Umum'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY SELESAI */}
          {step === 3 && executionSummary && (
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  Kenaikan Kelas & Kelulusan Berhasil Diproses!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Data siswa dan rombel telah diperbarui untuk tahun ajaran baru.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[11px] font-bold text-amber-700 block">Siswa Lulus</span>
                  <span className="text-lg font-black text-amber-950">
                    {executionSummary.graduatedCount} Orang
                  </span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[11px] font-bold text-[#1E3A6C] block">Siswa Naik Kelas</span>
                  <span className="text-lg font-black text-[#1E3A6C]">
                    {executionSummary.promotedCount} Orang
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-[#1E3A6C] hover:bg-[#162B52] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>Lanjut ke Kenaikan Jenjang ({selectedGraduates.length} Lulus)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-white"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleExecutePromotion}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Terapkan Kenaikan Kelas & Kelulusan</span>
              </button>
            </>
          )}

          {step === 3 && (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#1E3A6C] text-white rounded-lg text-xs font-bold"
              >
                Tutup Jendela
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
