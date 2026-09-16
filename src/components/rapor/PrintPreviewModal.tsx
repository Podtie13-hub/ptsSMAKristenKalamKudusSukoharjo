import React, { useState } from 'react';
import {
  Printer,
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Sliders,
  FileText,
  Maximize2,
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
} from '../../types';
import { SingleStudentRapor } from './RaporDocument';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  classroom: ClassRoom;
  academicYear: AcademicYear;
  subjects: Subject[];
  grades: PTSGrade[];
  evaluations: StudentEvaluation[];
  printSettings: PrintSettings;
  onUpdatePrintSettings: (settings: PrintSettings) => void;
  schoolProfile: SchoolProfile;
  initialStudentIndex?: number;
  printMode: 'single' | 'class';
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  students,
  classroom,
  academicYear,
  subjects,
  grades,
  evaluations,
  printSettings,
  onUpdatePrintSettings,
  schoolProfile,
  initialStudentIndex = 0,
  printMode,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(initialStudentIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(0.9);
  const [showMarginControls, setShowMarginControls] = useState<boolean>(true);

  if (!isOpen || students.length === 0) return null;

  const currentStudent = students[currentPageIndex] || students[0];
  const evalRecord = evaluations.find(
    (e) =>
      e.studentId === currentStudent.id &&
      e.academicYearId === academicYear.id &&
      e.semester === academicYear.semester
  );

  const handlePrint = () => {
    window.print();
  };

  const handleMarginChange = (key: keyof PrintSettings, val: number) => {
    const maxLimit = key === 'marginTop' ? 100 : 50;
    onUpdatePrintSettings({
      ...printSettings,
      [key]: Math.max(0, Math.min(maxLimit, val)),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-xs no-print">
      {/* Top Toolbar */}
      <div className="bg-[#1E3A6C] text-white px-4 py-3 border-b-2 border-[#D8232A] flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#152B52] rounded-lg">
            <FileText className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
              <span>Pratinjau Laporan Hasil Belajar Siswa Tengah Semester</span>
              <span className="bg-[#D8232A] text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                {printMode === 'class' ? `1 Kelas (${students.length} Siswa)` : 'Per Siswa'}
              </span>
            </h2>
            <p className="text-xs text-blue-200">
              Kelas {classroom.name} • T.A. {academicYear.name} ({academicYear.semester})
            </p>
          </div>
        </div>

        {/* Center: Page navigator if multi-student */}
        {printMode === 'class' && students.length > 1 && (
          <div className="flex items-center gap-2 bg-[#152B52] px-3 py-1.5 rounded-lg border border-blue-900">
            <button
              type="button"
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-1 text-white hover:bg-blue-700/50 rounded disabled:opacity-30"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-white px-1">
              Siswa {currentPageIndex + 1} / {students.length}:{' '}
              <strong className="text-amber-300">{currentStudent.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => setCurrentPageIndex((prev) => Math.min(students.length - 1, prev + 1))}
              disabled={currentPageIndex === students.length - 1}
              className="p-1 text-white hover:bg-blue-700/50 rounded disabled:opacity-30"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Zoom and Print Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMarginControls(!showMarginControls)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              showMarginControls
                ? 'bg-white text-[#1E3A6C] border-white'
                : 'bg-blue-900/60 text-blue-200 border-blue-700 hover:bg-blue-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Atur Margin</span>
          </button>

          <div className="hidden sm:flex items-center bg-[#152B52] rounded-lg p-1 border border-blue-900">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
              className="p-1 text-blue-200 hover:text-white"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-white font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="p-1 text-blue-200 hover:text-white"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            id="btn-trigger-print-modal"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#D8232A] hover:bg-[#b81c22] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg ml-1"
            title="Tutup Pratinjau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sub-toolbar: Margin & Paper Size Controls */}
      {showMarginControls && (
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700 shadow-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-[#1E3A6C] flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#D8232A]" />
              Pengaturan Margin Kertas (mm):
            </span>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-700 font-bold">Atas (Kertas Berkop):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={printSettings.marginTop}
                onChange={(e) => handleMarginChange('marginTop', Number(e.target.value))}
                className="w-14 border border-slate-300 rounded px-1.5 py-1 text-center font-semibold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
                title="Sesuaikan dengan tinggi kop surat yang sudah tercetak pada kertas Anda (default 40mm)"
              />
              <span className="text-[10px] text-slate-500 font-medium">mm</span>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-500 font-medium">Bawah (Bottom):</label>
              <input
                type="number"
                min="0"
                max="40"
                value={printSettings.marginBottom}
                onChange={(e) => handleMarginChange('marginBottom', Number(e.target.value))}
                className="w-14 border border-slate-300 rounded px-1.5 py-1 text-center font-semibold text-slate-800"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-500 font-medium">Kiri (Left):</label>
              <input
                type="number"
                min="0"
                max="40"
                value={printSettings.marginLeft}
                onChange={(e) => handleMarginChange('marginLeft', Number(e.target.value))}
                className="w-14 border border-slate-300 rounded px-1.5 py-1 text-center font-semibold text-slate-800"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-slate-500 font-medium">Kanan (Right):</label>
              <input
                type="number"
                min="0"
                max="40"
                value={printSettings.marginRight}
                onChange={(e) => handleMarginChange('marginRight', Number(e.target.value))}
                className="w-14 border border-slate-300 rounded px-1.5 py-1 text-center font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Ukuran Kertas:</span>
            <select
              value={printSettings.paperSize}
              onChange={(e) =>
                onUpdatePrintSettings({
                  ...printSettings,
                  paperSize: e.target.value as 'A4' | 'F4' | 'Letter',
                })
              }
              className="border border-slate-300 rounded px-2 py-1 bg-white font-bold text-[#1E3A6C]"
            >
              <option value="A4">A4 (210 x 297 mm)</option>
              <option value="F4">F4 / Folio (215 x 330 mm)</option>
              <option value="Letter">Letter (216 x 279 mm)</option>
            </select>

            <button
              type="button"
              onClick={() => {
                onUpdatePrintSettings({
                  ...printSettings,
                  marginTop: 15,
                  marginBottom: 15,
                  marginLeft: 15,
                  marginRight: 15,
                });
              }}
              className="text-[11px] text-blue-600 hover:underline ml-2"
            >
              Reset Margin (15mm)
            </button>
          </div>
        </div>
      )}

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-800">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="shadow-2xl rounded-sm my-4 bg-white"
        >
          {printMode === 'single' ? (
            <SingleStudentRapor
              student={currentStudent}
              classroom={classroom}
              academicYear={academicYear}
              subjects={subjects}
              grades={grades}
              evaluation={evalRecord}
              printSettings={printSettings}
              schoolProfile={schoolProfile}
              pageNumber={1}
              totalPages={1}
            />
          ) : (
            // In class mode, show currently selected student in the viewer
            <div className="relative">
              <SingleStudentRapor
                student={currentStudent}
                classroom={classroom}
                academicYear={academicYear}
                subjects={subjects}
                grades={grades}
                evaluation={evalRecord}
                printSettings={printSettings}
                schoolProfile={schoolProfile}
                pageNumber={currentPageIndex + 1}
                totalPages={students.length}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
