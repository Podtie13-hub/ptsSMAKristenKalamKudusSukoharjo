import React, { useState } from 'react';
import {
  Database,
  Download,
  Copy,
  Check,
  X,
  FileCode,
  Server,
  BookOpen,
  Code,
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
import { generateMySQLDump } from '../../utils/sqlGenerator';
import { generatePhpBackendCode } from '../../utils/phpCodeGenerator';

interface SqlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYears: AcademicYear[];
  classes: ClassRoom[];
  subjects: Subject[];
  teachers: Teacher[];
  assignments: TeachingAssignment[];
  students: Student[];
  grades: PTSGrade[];
}

export const SqlExportModal: React.FC<SqlExportModalProps> = ({
  isOpen,
  onClose,
  academicYears,
  classes,
  subjects,
  teachers,
  assignments,
  students,
  grades,
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'php_config' | 'php_api' | 'guide'>('sql');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlDump = generateMySQLDump(
    academicYears,
    classes,
    subjects,
    teachers,
    assignments,
    students,
    grades
  );

  const { configPhp, apiPhp, readme } = generatePhpBackendCode();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlDump], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'db_rapor_kalamkudus_sukoharjo.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentContent =
    activeTab === 'sql'
      ? sqlDump
      : activeTab === 'php_config'
      ? configPhp
      : activeTab === 'php_api'
      ? apiPhp
      : readme;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-6 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#1E3A6C] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#D8232A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#152B52] rounded-lg">
              <Database className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Integrasi Database MySQL & Backend PHP
              </h2>
              <p className="text-xs text-blue-200">
                SMA Kristen Kalam Kudus Sukoharjo — DDL Schema, Relasional & Seed Data
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 pt-2 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 rounded-t-md transition-colors ${
                activeTab === 'sql'
                  ? 'border-[#D8232A] text-[#1E3A6C] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#D8232A]" />
              <span>Skema MySQL (.sql)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('php_config')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 rounded-t-md transition-colors ${
                activeTab === 'php_config'
                  ? 'border-[#D8232A] text-[#1E3A6C] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-indigo-600" />
              <span>db_config.php</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('php_api')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 rounded-t-md transition-colors ${
                activeTab === 'php_api'
                  ? 'border-[#D8232A] text-[#1E3A6C] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>api.php (REST API)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 rounded-t-md transition-colors ${
                activeTab === 'guide'
                  ? 'border-[#D8232A] text-[#1E3A6C] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Petunjuk Instalasi</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-1.5">
            <button
              type="button"
              onClick={() => handleCopy(currentContent)}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1 rounded-md text-xs font-semibold shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>

            {activeTab === 'sql' && (
              <button
                type="button"
                onClick={handleDownloadSql}
                className="inline-flex items-center gap-1.5 bg-[#D8232A] hover:bg-[#b81c22] text-white px-3 py-1 rounded-md text-xs font-bold shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .SQL Dump</span>
              </button>
            )}
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200">
          <pre className="whitespace-pre-wrap leading-relaxed">{currentContent}</pre>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Format database terstruktur sesuai entitas: <strong>tahun_akademik, guru, kelas, mata_pelajaran, guru_mengajar, siswa, nilai_pts</strong>.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SqlExportModal;
