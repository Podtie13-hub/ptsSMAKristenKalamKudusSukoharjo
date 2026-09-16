import React, { useState } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  HelpCircle,
  Users,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { ClassRoom, Student, Subject, SubjectCategory, Teacher } from '../../types';

export type ImportType = 'guru' | 'siswa' | 'mapel';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: ImportType;
  classes: ClassRoom[];
  subjects: Subject[];
  onImportTeachers: (newTeachers: Teacher[]) => void;
  onImportStudents: (newStudents: Student[]) => void;
  onImportSubjects: (newSubjects: Subject[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'siswa',
  classes,
  subjects,
  onImportTeachers,
  onImportStudents,
  onImportSubjects,
}) => {
  const [importType, setImportType] = useState<ImportType>(defaultType);
  const [pasteData, setPasteData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [previewActive, setPreviewActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Template generators
  const downloadTemplate = () => {
    let headers = '';
    let sample = '';
    let filename = '';

    if (importType === 'guru') {
      filename = 'template_impor_guru.csv';
      headers = 'NIP,Nama Lengkap,Jenis Kelamin (L/P),No HP,Email,Username,Password';
      sample =
        '19850110 200801 1 005,Drs. Eko Prasetyo M.Pd.,L,081234567811,eko.p@kalamkudussolo.sch.id,ekopras,guru123\n' +
        '19920315 201702 2 008,Siti Rahayu S.Pd.,P,081234567812,siti.r@kalamkudussolo.sch.id,sitir,guru123';
    } else if (importType === 'siswa') {
      filename = 'template_impor_siswa.csv';
      headers = 'NIS,NISN,Nama Siswa,Jenis Kelamin (L/P),Kelas';
      const sampleClass = classes[0]?.name || 'X-A';
      sample =
        `24050,0071239901,Jonathan Aditya Surya,L,${sampleClass}\n` +
        `24051,0071239902,Stephanie Priscilla,P,${sampleClass}`;
    } else {
      filename = 'template_impor_mapel.csv';
      headers = 'Kode Mapel,Nama Mata Pelajaran,Kategori (A/B/C),Urutan';
      sample =
        'INF,Informatika,Kelompok B (Umum),15\n' +
        'MAND,Bahasa Mandarin,Kelompok C (Peminatan),16';
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + '\n' + sample);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', csvContent);
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Parsing CSV or Tab-separated values
  const handleParse = (rawText: string) => {
    setParseErrors([]);
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setParseErrors(['Data kosong atau tidak dapat dibaca.']);
      setParsedRows([]);
      setPreviewActive(false);
      return;
    }

    // Check if line 1 is header
    let startIdx = 0;
    const firstLine = lines[0].toLowerCase();
    if (
      firstLine.includes('nip') ||
      firstLine.includes('nis') ||
      firstLine.includes('kode') ||
      firstLine.includes('nama')
    ) {
      startIdx = 1;
    }

    const dataLines = lines.slice(startIdx);
    if (dataLines.length === 0) {
      setParseErrors(['Tidak ada baris data setelah header.']);
      setParsedRows([]);
      setPreviewActive(false);
      return;
    }

    const rows: any[] = [];
    const errors: string[] = [];

    dataLines.forEach((line, idx) => {
      // split by tab (Excel copy-paste) or semicolon or comma
      let cols: string[] = [];
      if (line.includes('\t')) {
        cols = line.split('\t').map((c) => c.trim());
      } else if (line.includes(';')) {
        cols = line.split(';').map((c) => c.trim());
      } else {
        cols = line.split(',').map((c) => c.trim());
      }

      const rowNum = idx + 1 + startIdx;

      if (importType === 'guru') {
        const [nip, name, genderRaw, phone, email, usernameRaw, passRaw] = cols;
        if (!name) {
          errors.push(`Baris ${rowNum}: Nama Guru wajib diisi.`);
          return;
        }
        const gender: 'L' | 'P' = genderRaw?.toUpperCase() === 'P' ? 'P' : 'L';
        const cleanUser = usernameRaw || name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
        const pass = passRaw || 'guru123';

        rows.push({
          id: `t-${Date.now()}-${idx}`,
          nip: nip || '-',
          name,
          gender,
          phone: phone || '',
          email: email || '',
          username: cleanUser,
          password: pass,
          isHomeroom: false,
        } as Teacher);
      } else if (importType === 'siswa') {
        const [nis, nisn, name, genderRaw, classNameRaw] = cols;
        if (!name) {
          errors.push(`Baris ${rowNum}: Nama Siswa wajib diisi.`);
          return;
        }
        const gender: 'L' | 'P' = genderRaw?.toUpperCase() === 'P' ? 'P' : 'L';

        // Match class by name or fallback to first class
        let matchedClass = classes.find(
          (c) => c.name.toLowerCase() === (classNameRaw || '').toLowerCase()
        );
        if (!matchedClass && classes.length > 0) {
          matchedClass = classes[0];
        }

        rows.push({
          id: `s-${Date.now()}-${idx}`,
          nis: nis || `${24000 + idx}`,
          nisn: nisn || '',
          name,
          gender,
          classId: matchedClass?.id || (classes[0]?.id || 'cls-1'),
          className: matchedClass?.name || classNameRaw || '-',
          status: 'Aktif',
        });
      } else {
        // Mapel
        const [code, name, catRaw, orderRaw] = cols;
        if (!code || !name) {
          errors.push(`Baris ${rowNum}: Kode Mapel dan Nama Mapel wajib diisi.`);
          return;
        }

        let category: SubjectCategory = 'Kelompok A (Umum)';
        const catStr = (catRaw || '').toLowerCase();
        if (catStr.includes('b')) {
          category = 'Kelompok B (Umum)';
        } else if (catStr.includes('c') || catStr.includes('peminatan')) {
          category = 'Kelompok C (Peminatan)';
        }

        const order = parseInt(orderRaw, 10) || subjects.length + idx + 1;

        rows.push({
          id: `sub-${Date.now()}-${idx}`,
          code: code.toUpperCase(),
          name,
          category,
          orderIndex: order,
        } as Subject);
      }
    });

    setParseErrors(errors);
    setParsedRows(rows);
    setPreviewActive(true);
  };

  // Handle file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPasteData(content);
      handleParse(content);
    };
    reader.readAsText(file);
  };

  // Execute Import
  const handleExecuteImport = () => {
    if (parsedRows.length === 0) return;

    if (importType === 'guru') {
      onImportTeachers(parsedRows as Teacher[]);
      setSuccessMsg(`Berhasil mengimpor ${parsedRows.length} guru baru!`);
    } else if (importType === 'siswa') {
      onImportStudents(parsedRows as Student[]);
      setSuccessMsg(`Berhasil mengimpor ${parsedRows.length} siswa baru!`);
    } else {
      onImportSubjects(parsedRows as Subject[]);
      setSuccessMsg(`Berhasil mengimpor ${parsedRows.length} mata pelajaran baru!`);
    }

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
      // Reset
      setPasteData('');
      setParsedRows([]);
      setPreviewActive(false);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-[#1E3A6C] text-white px-6 py-4 flex items-center justify-between border-b-4 border-[#D8232A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/60 rounded-lg">
              <Upload className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Upload & Impor Masal Data
              </h3>
              <p className="text-xs text-blue-200">
                Impor Guru, Siswa, atau Mata Pelajaran via CSV / Excel
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-3 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Type Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Pilih Jenis Data yang Akan Diimpor:
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setImportType('siswa');
                  setPreviewActive(false);
                  setParsedRows([]);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  importType === 'siswa'
                    ? 'bg-[#1E3A6C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportType('guru');
                  setPreviewActive(false);
                  setParsedRows([]);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  importType === 'guru'
                    ? 'bg-[#1E3A6C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Guru & Akun</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportType('mapel');
                  setPreviewActive(false);
                  setParsedRows([]);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  importType === 'mapel'
                    ? 'bg-[#1E3A6C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Mata Pelajaran</span>
              </button>
            </div>
          </div>

          {/* Download Template Card */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-blue-200 text-[#1E3A6C] shadow-2xs">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Unduh Format Template CSV
                </p>
                <p className="text-[11px] text-slate-500">
                  Gunakan template resmi untuk memastikan struktur kolom cocok dengan sistem.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-blue-50 text-[#1E3A6C] border border-blue-300 rounded-lg text-xs font-bold shadow-2xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4 text-[#D8232A]" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Method 1: File Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Metode 1: Unggah File CSV
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-[#1E3A6C] rounded-xl p-5 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="csvFileInput"
              />
              <label
                htmlFor="csvFileInput"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">
                  {fileName ? (
                    <strong className="text-[#1E3A6C]">{fileName}</strong>
                  ) : (
                    'Klik untuk memilih file CSV dari komputer Anda'
                  )}
                </span>
                <span className="text-[11px] text-slate-400">
                  Format file: .csv atau .txt dengan pemisah koma / titik koma / tab
                </span>
              </label>
            </div>
          </div>

          {/* Method 2: Paste Raw Data from Excel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Metode 2: Tempel (Paste) Langsung dari Excel / Google Sheets
              </label>
              <span className="text-[11px] text-slate-500 italic">
                Bisa copy tabel dari Excel lalu paste di bawah
              </span>
            </div>
            <textarea
              rows={4}
              value={pasteData}
              onChange={(e) => {
                setPasteData(e.target.value);
                setPreviewActive(false);
              }}
              placeholder={
                importType === 'siswa'
                  ? 'Contoh:\n24050\t0071239901\tJonathan Aditya Surya\tL\tX-A\n24051\t0071239902\tStephanie Priscilla\tP\tX-A'
                  : importType === 'guru'
                  ? 'Contoh:\n19850110 200801 1 005\tDrs. Eko Prasetyo M.Pd.\tL\t081234567811\teko.p@kalamkudussolo.sch.id\tekopras\tguru123'
                  : 'Contoh:\nINF\tInformatika\tKelompok B (Umum)\t15\nMAND\tBahasa Mandarin\tKelompok C (Peminatan)\t16'
              }
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E3A6C] bg-white leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleParse(pasteData)}
                disabled={!pasteData.trim()}
                className="px-4 py-2 bg-[#1E3A6C] hover:bg-[#162B52] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
              >
                Pratinjau Data ({pasteData.trim().split(/\r?\n/).filter(Boolean).length} Baris)
              </button>
            </div>
          </div>

          {/* Error messages if any */}
          {parseErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Peringatan Validasi ({parseErrors.length})</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 max-h-24 overflow-y-auto">
                {parseErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Data Preview Table */}
          {previewActive && parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Siap Diimpor: {parsedRows.length} Data</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Tinjau baris di bawah sebelum menekan tombol simpan
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                    {importType === 'guru' && (
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">No</th>
                        <th className="py-2 px-3">Nama Lengkap</th>
                        <th className="py-2 px-3">NIP</th>
                        <th className="py-2 px-3 text-center">L/P</th>
                        <th className="py-2 px-3">Username</th>
                        <th className="py-2 px-3">Password</th>
                      </tr>
                    )}
                    {importType === 'siswa' && (
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">No</th>
                        <th className="py-2 px-3">NIS</th>
                        <th className="py-2 px-3">NISN</th>
                        <th className="py-2 px-3">Nama Siswa</th>
                        <th className="py-2 px-3 text-center">L/P</th>
                        <th className="py-2 px-3">Kelas</th>
                      </tr>
                    )}
                    {importType === 'mapel' && (
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">No</th>
                        <th className="py-2 px-3">Kode</th>
                        <th className="py-2 px-3">Nama Mata Pelajaran</th>
                        <th className="py-2 px-3">Kelompok</th>
                        <th className="py-2 px-3 text-center">Urutan</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50/40">
                        <td className="py-1.5 px-3 text-center text-slate-400 font-mono">
                          {i + 1}
                        </td>
                        {importType === 'guru' && (
                          <>
                            <td className="py-1.5 px-3 font-semibold text-slate-800">
                              {row.name}
                            </td>
                            <td className="py-1.5 px-3 font-mono text-slate-600">
                              {row.nip}
                            </td>
                            <td className="py-1.5 px-3 text-center text-slate-600">
                              {row.gender}
                            </td>
                            <td className="py-1.5 px-3 font-mono text-slate-700">
                              {row.username}
                            </td>
                            <td className="py-1.5 px-3 font-mono text-slate-500">
                              {row.password}
                            </td>
                          </>
                        )}
                        {importType === 'siswa' && (
                          <>
                            <td className="py-1.5 px-3 font-mono text-slate-600">
                              {row.nis}
                            </td>
                            <td className="py-1.5 px-3 font-mono text-slate-500">
                              {row.nisn || '-'}
                            </td>
                            <td className="py-1.5 px-3 font-bold text-slate-800">
                              {row.name}
                            </td>
                            <td className="py-1.5 px-3 text-center text-slate-600">
                              {row.gender}
                            </td>
                            <td className="py-1.5 px-3 text-slate-700 font-semibold">
                              {row.className}
                            </td>
                          </>
                        )}
                        {importType === 'mapel' && (
                          <>
                            <td className="py-1.5 px-3 font-mono font-bold text-slate-700">
                              {row.code}
                            </td>
                            <td className="py-1.5 px-3 font-semibold text-slate-800">
                              {row.name}
                            </td>
                            <td className="py-1.5 px-3 text-slate-600">
                              {row.category}
                            </td>
                            <td className="py-1.5 px-3 text-center font-mono">
                              {row.orderIndex}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-white"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={!previewActive || parsedRows.length === 0}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan & Impor ({parsedRows.length}) Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
