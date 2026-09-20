import React, { useState } from 'react';
import {
  Download,
  FileCode,
  FolderArchive,
  Check,
  ExternalLink,
  Info,
  Server,
  Database,
  X,
  Copy,
} from 'lucide-react';
import {
  AcademicYear,
  AdminUser,
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
import { generatePhpPackageZip } from '../../utils/phpPackageGenerator';

interface PhpPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYears: AcademicYear[];
  classes: ClassRoom[];
  subjects: Subject[];
  teachers: Teacher[];
  assignments: TeachingAssignment[];
  students: Student[];
  grades: PTSGrade[];
  evaluations: StudentEvaluation[];
  printSettings: PrintSettings;
  schoolProfile: SchoolProfile;
  adminUsers?: AdminUser[];
}

export const PhpPackageModal: React.FC<PhpPackageModalProps> = ({
  isOpen,
  onClose,
  academicYears,
  classes,
  subjects,
  teachers,
  assignments,
  students,
  grades,
  evaluations,
  printSettings,
  schoolProfile,
  adminUsers,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'structure' | 'info'>('instructions');
  const [copiedPort, setCopiedPort] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);
    try {
      await generatePhpPackageZip(
        academicYears,
        classes,
        subjects,
        teachers,
        assignments,
        students,
        grades,
        evaluations,
        printSettings,
        schoolProfile,
        adminUsers
      );
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Failed to generate PHP package:', err);
      alert('Gagal menghasilkan file ZIP paket PHP. Periksa konsol browser.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyDbCode = () => {
    navigator.clipboard.writeText('$conn = mysqli_connect("localhost", "root", "", "db_rapor_pts");');
    setCopiedPort(true);
    setTimeout(() => setCopiedPort(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-[#1E3A6C] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <FolderArchive className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Download Paket Web PHP Native + MySQL</h2>
              <p className="text-xs text-emerald-100">
                Aplikasi siap jalan di XAMPP / Hosting cPanel tanpa perlu install Node.js
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'instructions'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Panduan Pasang di XAMPP</span>
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'structure'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Struktur File ZIP</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Detail Fitur PHP</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm text-slate-700">
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start space-x-3">
                <Info className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Paket PHP Native Mandiri:</strong> Seluruh kode PHP, CSS styling cetak rapor, script database MySQL (<code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">database.sql</code>), dan file konfigurasi sudah dibundel otomatis ke dalam satu file ZIP.
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">1</span>
                  Unduh dan Ekstrak ke Folder htdocs
                </h4>
                <p className="text-xs text-slate-600 pl-7">
                  Klik tombol <strong>"Download File ZIP Sekarang"</strong> di bawah, lalu ekstrak folder hasil unduhan ke:
                  <br />
                  <code className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono text-xs inline-block mt-1">
                    C:\xampp\htdocs\rapor_pts
                  </code>
                </p>

                <h4 className="font-bold text-slate-900 flex items-center gap-2 pt-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">2</span>
                  Import Database di phpMyAdmin
                </h4>
                <div className="text-xs text-slate-600 pl-7 space-y-1.5">
                  <p>Buka browser dan akses <a href="http://localhost/phpmyadmin" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline inline-flex items-center gap-0.5">http://localhost/phpmyadmin <ExternalLink className="w-3 h-3" /></a></p>
                  <p>Buat database baru bernama: <code className="font-mono font-bold text-slate-900 bg-slate-100 px-1 py-0.5 rounded">db_rapor_pts</code></p>
                  <p>Klik tab <strong>Import</strong>, lalu pilih file <code className="font-mono text-slate-900 bg-slate-100 px-1 py-0.5 rounded">database.sql</code> yang ada di dalam paket ZIP tersebut, lalu klik <strong>Kirim / Go</strong>.</p>
                </div>

                <h4 className="font-bold text-slate-900 flex items-center gap-2 pt-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">3</span>
                  Jalankan Aplikasi di Browser
                </h4>
                <p className="text-xs text-slate-600 pl-7">
                  Buka browser Anda dan ketik URL:
                  <br />
                  <code className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono text-xs inline-block mt-1 font-bold text-emerald-800">
                    http://localhost/rapor_pts
                  </code>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-3 font-mono text-xs bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed">
              <p className="text-emerald-400 font-bold font-sans text-sm mb-2">Isi Berkas Paket ZIP:</p>
              <div className="space-y-1">
                <div>📁 <strong>rapor_pts/</strong></div>
                <div className="pl-4">├── 📄 <strong>database.sql</strong> <span className="text-slate-400">(Skrip skema & data MySQL lengkap)</span></div>
                <div className="pl-4">├── 📄 <strong>config.php</strong> <span className="text-slate-400">(Koneksi database mysqli)</span></div>
                <div className="pl-4">├── 📄 <strong>index.php</strong> <span className="text-slate-400">(Halaman Login Guru & Admin)</span></div>
                <div className="pl-4">├── 📄 <strong>admin_dashboard.php</strong> <span className="text-slate-400">(Kelola Guru, Mapel, Siswa, Kelas)</span></div>
                <div className="pl-4">├── 📄 <strong>guru_portal.php</strong> <span className="text-slate-400">(Input Nilai PTS & Cetak Rapor)</span></div>
                <div className="pl-4">├── 📄 <strong>cetak_rapor.php</strong> <span className="text-slate-400">(Halaman Cetak Rapor Standar F4/A4)</span></div>
                <div className="pl-4">├── 📄 <strong>logout.php</strong></div>
                <div className="pl-4">└── 📄 <strong>README.txt</strong> <span className="text-slate-400">(Panduan konfigurasi cepat)</span></div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Spesifikasi Server:</h4>
              <ul className="list-disc list-inside text-xs space-y-1.5 text-slate-600">
                <li>Bahasa: <strong>PHP 7.4 - PHP 8.x</strong> (Ekstensi <code className="font-mono">mysqli</code> aktif)</li>
                <li>Database: <strong>MySQL 5.7+ / MariaDB 10.x</strong></li>
                <li>Web Server: <strong>Apache (XAMPP / Laragon / cPanel Hosting)</strong></li>
                <li>Tidak memerlukan <code className="font-mono">composer</code> atau Node.js untuk dijalankan.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {downloadSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> File ZIP berhasil diunduh!
              </span>
            ) : (
              <span>Ukuran file diperkirakan ~100 KB</span>
            )}
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Membuat ZIP...' : 'Download File ZIP Sekarang'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhpPackageModal;
