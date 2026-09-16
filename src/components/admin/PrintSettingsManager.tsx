import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  UserCheck,
  CheckCircle2,
  Sliders,
  Printer,
  Sparkles,
  Info,
} from 'lucide-react';
import { PrintSettings } from '../../types';

interface PrintSettingsManagerProps {
  printSettings: PrintSettings;
  onUpdatePrintSettings: (settings: PrintSettings) => void;
}

export const PrintSettingsManager: React.FC<PrintSettingsManagerProps> = ({
  printSettings,
  onUpdatePrintSettings,
}) => {
  const [formData, setFormData] = useState<PrintSettings>(printSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Format today's date in Indonesian: Sukoharjo, 15 September 2026
  const setTodayDate = () => {
    const today = new Date();
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const formatted = `Sukoharjo, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    setFormData((prev) => ({ ...prev, printDate: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePrintSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A6C] to-[#152B52] text-white p-5 rounded-2xl shadow-sm border-l-4 border-[#D8232A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-300" />
            <span>Pengaturan Cetak Rapor & Tanda Tangan</span>
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Atur nama Kepala Sekolah, NIP, tanggal penerbitan rapor, dan tata letak margin dokumen untuk seluruh sekolah.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-3 font-semibold text-xs sm:text-sm animate-scaleIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengaturan Kepala Sekolah & Tanggal Cetak Rapor berhasil disimpan ke sistem!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Kepala Sekolah & Tanggal */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <UserCheck className="w-4 h-4 text-[#1E3A6C]" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pengesahan & Tanggal Terbit
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Kepala Sekolah (Lengkap dengan Gelar)
                </label>
                <input
                  type="text"
                  required
                  value={formData.principalName}
                  onChange={(e) =>
                    setFormData({ ...formData, principalName: e.target.value })
                  }
                  placeholder="misal: Drs. Andreas Setiawan, M.Pd."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Nama ini akan dicetak pada kolom tanda tangan pengesahan di bawah tanda tangan Orang Tua dan Wali Kelas.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.principalNIP}
                  onChange={(e) =>
                    setFormData({ ...formData, principalNIP: e.target.value })
                  }
                  placeholder="misal: 19710314 199802 1 001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Tempat & Tanggal Terbit Rapor
                  </label>
                  <button
                    type="button"
                    onClick={setTodayDate}
                    className="text-[11px] font-semibold text-[#1E3A6C] hover:underline"
                  >
                    Pakai Tanggal Hari Ini
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.printDate}
                  onChange={(e) =>
                    setFormData({ ...formData, printDate: e.target.value })
                  }
                  placeholder="misal: Sukoharjo, 27 September 2024"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Format baku: <span className="font-mono">Sukoharjo, [Tanggal] [Bulan] [Tahun]</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Pengaturan Kertas & Margin */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-[#1E3A6C]" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Kertas & Margin Cetak
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ukuran Kertas Rapor
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['A4', 'F4', 'Letter'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({ ...formData, paperSize: size })}
                      className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all ${
                        formData.paperSize === size
                          ? 'bg-[#1E3A6C] text-white border-[#1E3A6C] shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Margin Atas / Ruang Kop Surat (mm)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.marginTop}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marginTop: Number(e.target.value),
                      })
                    }
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-center focus:ring-1 focus:ring-[#1E3A6C]"
                  />
                  <span className="text-slate-500 text-xs">milimeter (mm)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Direkomendasikan <strong>38 - 42 mm</strong> untuk kertas resmi yang sudah memiliki kop cetak sekolah.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Bawah (mm)
                  </span>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={formData.marginBottom}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marginBottom: Number(e.target.value),
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center font-mono font-semibold"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Kiri (mm)
                  </span>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={formData.marginLeft}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marginLeft: Number(e.target.value),
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center font-mono font-semibold"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Kanan (mm)
                  </span>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={formData.marginRight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marginRight: Number(e.target.value),
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Penamaan Kelompok Mata Pelajaran di Lembar Rapor */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1E3A6C]" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Penamaan Kelompok Mata Pelajaran di Lembar Rapor & Leger
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Dapat disesuaikan bebas sesuai kurikulum sekolah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Header Kelompok A
              </label>
              <input
                type="text"
                value={
                  formData.subjectGroupTitles?.['Kelompok A (Umum)'] ??
                  'Kelompok A (Muatan Umum / Wajib)'
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subjectGroupTitles: {
                      ...formData.subjectGroupTitles,
                      'Kelompok A (Umum)': e.target.value,
                    },
                  })
                }
                placeholder="misal: Kelompok A (Muatan Umum / Wajib)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Default: Kelompok A (Muatan Umum / Wajib)
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Header Kelompok B
              </label>
              <input
                type="text"
                value={
                  formData.subjectGroupTitles?.['Kelompok B (Umum)'] ??
                  'Kelompok B (Muatan Kewilayahan / Umum)'
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subjectGroupTitles: {
                      ...formData.subjectGroupTitles,
                      'Kelompok B (Umum)': e.target.value,
                    },
                  })
                }
                placeholder="misal: Kelompok B (Muatan Kewilayahan / Umum)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Default: Kelompok B (Muatan Kewilayahan / Umum)
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Header Kelompok C
              </label>
              <input
                type="text"
                value={
                  formData.subjectGroupTitles?.['Kelompok C (Peminatan)'] ??
                  'Kelompok C (Peminatan / Pilihan)'
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subjectGroupTitles: {
                      ...formData.subjectGroupTitles,
                      'Kelompok C (Peminatan)': e.target.value,
                    },
                  })
                }
                placeholder="misal: Kelompok C (Peminatan / Pilihan)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-1 focus:ring-[#1E3A6C]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Default: Kelompok C (Peminatan / Pilihan)
              </p>
            </div>
          </div>
        </div>

        {/* Visual Preview of Signature Layout */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#1E3A6C]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pratinjau Posisi Tanda Tangan pada Rapor Tengah Semester
            </h4>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-2xs space-y-6 max-w-lg mx-auto">
            {/* Row 1: Orang Tua & Wali Kelas */}
            <div className="flex justify-between items-start">
              <div className="text-center w-40">
                <p className="font-semibold text-slate-700">Mengetahui,</p>
                <p className="font-semibold text-slate-700 mb-12">Orang Tua / Wali Siswa</p>
                <div className="border-b border-slate-800 w-32 mx-auto"></div>
              </div>
              <div className="text-center w-48">
                <p className="text-slate-600 mb-1">{formData.printDate || 'Sukoharjo, ...'}</p>
                <p className="font-semibold text-slate-700 mb-12">Wali Kelas</p>
                <div className="border-b border-slate-800 w-36 mx-auto font-bold text-slate-800">
                  Nama Wali Kelas
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">NIP: 198... ...</p>
              </div>
            </div>

            {/* Row 2: Kepala Sekolah */}
            <div className="text-center pt-2">
              <p className="font-semibold text-slate-700">Mengetahui,</p>
              <p className="font-bold text-slate-800 mb-12">Kepala Sekolah</p>
              <div className="border-b border-slate-800 w-52 mx-auto font-bold text-slate-900">
                {formData.principalName || 'Nama Kepala Sekolah'}
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                NIP. {formData.principalNIP || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1E3A6C] hover:bg-[#162B52] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Simpan Pengaturan Cetak Rapor</span>
          </button>
        </div>
      </form>
    </div>
  );
};
