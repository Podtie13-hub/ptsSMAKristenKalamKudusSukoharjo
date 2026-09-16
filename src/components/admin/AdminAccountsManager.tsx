import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Key,
  Trash2,
  Edit2,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminAccountsManagerProps {
  adminUsers: AdminUser[];
  currentAdminUsername: string;
  onUpdateAdminUsers: (users: AdminUser[]) => void;
}

export const AdminAccountsManager: React.FC<AdminAccountsManagerProps> = ({
  adminUsers,
  currentAdminUsername,
  onUpdateAdminUsers,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'superadmin' | 'admin'>('admin');
  const [showPassMap, setShowPassMap] = useState<Record<string, boolean>>({});

  // Edit state
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  const toggleShowPass = (id: string) => {
    setShowPassMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Add new admin
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = newUsername.trim().toLowerCase();
    const cleanPass = newPassword.trim();
    const cleanName = newName.trim();

    if (!cleanUser || !cleanPass || !cleanName) {
      showNotification('Semua kolom wajib diisi.', 'error');
      return;
    }

    if (adminUsers.some((a) => a.username.toLowerCase() === cleanUser)) {
      showNotification(`Username "${cleanUser}" sudah digunakan. Silakan gunakan username lain.`, 'error');
      return;
    }

    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      username: cleanUser,
      password: cleanPass,
      name: cleanName,
      role: newRole,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdateAdminUsers([...adminUsers, newAdmin]);
    setNewUsername('');
    setNewName('');
    setNewPassword('');
    setShowAddForm(false);
    showNotification(`Akun admin "${cleanUser}" berhasil ditambahkan!`);
  };

  // Save edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (!editName.trim() || !editPassword.trim()) {
      showNotification('Nama dan Kata Sandi tidak boleh kosong.', 'error');
      return;
    }

    const updated = adminUsers.map((a) => {
      if (a.id === editingAdmin.id) {
        return {
          ...a,
          name: editName.trim(),
          password: editPassword.trim(),
        };
      }
      return a;
    });

    onUpdateAdminUsers(updated);
    setEditingAdmin(null);
    showNotification(`Data akun admin "${editingAdmin.username}" berhasil diperbarui!`);
  };

  // Delete admin
  const handleDeleteAdmin = (adminToDelete: AdminUser) => {
    if (adminToDelete.username === 'podtie13') {
      showNotification('Akun Admin Utama (podtie13) tidak dapat dihapus demi keamanan sistem.', 'error');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus akun admin "${adminToDelete.name}" (${adminToDelete.username})?`)) {
      const updated = adminUsers.filter((a) => a.id !== adminToDelete.id);
      onUpdateAdminUsers(updated);
      showNotification(`Akun admin "${adminToDelete.username}" telah dihapus.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A6C] to-[#152B52] text-white p-5 rounded-2xl shadow-sm border-l-4 border-[#D8232A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span>Manajemen Akun Administrator</span>
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Kelola ID login dan kata sandi admin. Admin utama (<strong className="text-amber-300 font-mono">podtie13</strong>) memiliki akses penuh untuk menambah dan mengubah akun admin lainnya.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D8232A] hover:bg-[#b01c22] text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Form' : 'Tambah Admin Baru'}</span>
        </button>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-red-50 text-red-800 border border-red-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Form Tambah Admin Baru */}
      {showAddForm && (
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-md space-y-4 animate-scaleIn">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserPlus className="w-4 h-4 text-[#1E3A6C]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Buat Akun Admin Baru
            </h4>
          </div>

          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ID / Username Admin
              </label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="misal: kurikulum1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-[#1E3A6C]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap / Jabatan
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="misal: Bpk. Kurniawan (Waka Kurikulum)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1E3A6C]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <input
                type="text"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Kata sandi aman"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-[#1E3A6C]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hak Akses / Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white focus:ring-1 focus:ring-[#1E3A6C]"
              >
                <option value="admin">Admin Standar (Kurikulum & Nilai)</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1E3A6C] hover:bg-[#162B52] text-white rounded-lg text-xs font-bold shadow-2xs"
              >
                Simpan Akun Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Akun Admin Terdaftar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#1E3A6C]" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Daftar ID Administrator Aktif ({adminUsers.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Total {adminUsers.length} akun terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-4 w-12 text-center">No</th>
                <th className="py-2.5 px-4 w-36">ID / Username</th>
                <th className="py-2.5 px-4">Nama Lengkap & Jabatan</th>
                <th className="py-2.5 px-4 w-32">Role</th>
                <th className="py-2.5 px-4 w-44">Kata Sandi</th>
                <th className="py-2.5 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminUsers.map((adm, index) => {
                const isMainAdmin = adm.username === 'podtie13';
                const isShowingPass = showPassMap[adm.id] || false;

                return (
                  <tr
                    key={adm.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isMainAdmin ? 'bg-amber-50/30' : index % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                        <span>{adm.username}</span>
                        {isMainAdmin && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-1.5 py-0.2 rounded font-sans font-bold">
                            Utama
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {adm.name}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          adm.role === 'superadmin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {adm.role === 'superadmin' ? 'Super Admin' : 'Admin Nilai'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">
                          {isShowingPass ? adm.password : '••••••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPass(adm.id)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title={isShowingPass ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                        >
                          {isShowingPass ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAdmin(adm);
                            setEditName(adm.name);
                            setEditPassword(adm.password || '');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-[#1E3A6C] hover:bg-blue-100 rounded border border-blue-200 transition-colors flex items-center gap-1"
                          title="Ubah Password & Nama"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Ubah</span>
                        </button>

                        {!isMainAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(adm)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors"
                            title="Hapus Akun Admin Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Admin */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-[#1E3A6C] text-white p-4 flex items-center justify-between border-b-2 border-[#D8232A]">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-300" />
                <span>Ubah Sandi & Akun: {editingAdmin.username}</span>
              </h3>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap / Jabatan
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1E3A6C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-1 focus:ring-[#1E3A6C]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Gunakan sandi yang kuat dan mudah diingat.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E3A6C] text-white rounded-lg text-xs font-bold hover:bg-[#162B52]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
