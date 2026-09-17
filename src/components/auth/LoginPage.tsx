import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { AdminUser, AuthRole, AuthSession, ClassRoom, SchoolProfile, Teacher } from '../../types';
import { KalamKudusLogo } from '../KalamKudusLogo';

interface LoginPageProps {
  teachers: Teacher[];
  classes: ClassRoom[];
  schoolProfile: SchoolProfile;
  adminUsers?: AdminUser[];
  onLogin: (session: AuthSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  teachers,
  classes,
  schoolProfile,
  adminUsers = [],
  onLogin,
}) => {
  const [activeTab, setActiveTab] = useState<AuthRole>('guru');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Login submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Silakan masukkan username dan kata sandi.');
      return;
    }

    if (activeTab === 'admin') {
      const matchedAdmin = adminUsers.find(
        (a) => a.username.toLowerCase() === cleanUser
      );

      if (matchedAdmin) {
        if (cleanPass === matchedAdmin.password) {
          onLogin({
            role: 'admin',
            username: matchedAdmin.username,
            name: matchedAdmin.name,
          });
          return;
        } else {
          setErrorMessage('Kata sandi Admin salah. Silakan periksa kembali kata sandi Anda.');
          return;
        }
      }

      // Fallback check
      if (cleanUser === '...' && cleanPass === '...') {
        onLogin({
          role: 'admin',
          username: 'podtie13',
          name: 'Admin Utama',
        });
        return;
      }

      setErrorMessage('ID Admin tidak terdaftar atau kata sandi salah.');
      return;
    }

    // Check Teacher credentials
    const matchedTeacher = teachers.find(
      (t) =>
        t.username?.toLowerCase() === cleanUser ||
        t.nip.replace(/\s+/g, '') === cleanUser.replace(/\s+/g, '') ||
        t.email?.toLowerCase() === cleanUser
    );

    if (!matchedTeacher) {
      setErrorMessage('Akun guru dengan username/NIP tersebut tidak ditemukan.');
      return;
    }

    const expectedPass = matchedTeacher.password || 'guru123';
    if (cleanPass !== expectedPass) {
      setErrorMessage('Kata sandi salah. Silakan hubungi admin sekolah jika Anda lupa kata sandi.');
      return;
    }

    // Successful Teacher login
    onLogin({
      role: 'guru',
      teacherId: matchedTeacher.id,
      username: matchedTeacher.username || cleanUser,
      name: matchedTeacher.name,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50/40 flex flex-col justify-center items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Card Login Utama */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#1E3A6C] px-6 pt-7 pb-6 text-white text-center relative border-b-4 border-[#D8232A]">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-amber-300 inline-block">
                <KalamKudusLogo size="md" variant="icon-only" logoUrl={schoolProfile.logoUrl} />
              </div>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
              {schoolProfile.name}
            </h1>
            <p className="text-xs text-blue-200 mt-0.5">
              Portal Penilaian Tengah Semester (PTS) Kurikulum Merdeka
            </p>
          </div>

          {/* Role Tab Selector: Guru vs Admin */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              type="button"
              id="tab-login-guru"
              onClick={() => {
                setActiveTab('guru');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'guru'
                  ? 'bg-white text-[#1E3A6C] border-b-2 border-[#D8232A] font-extrabold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#D8232A]" />
              <span>Masuk Guru / Wali Kelas</span>
            </button>
            <button
              type="button"
              id="tab-login-admin"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'admin'
                  ? 'bg-white text-[#1E3A6C] border-b-2 border-[#D8232A] font-extrabold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#1E3A6C]" />
              <span>Masuk Administrator</span>
            </button>
          </div>

          {/* Form Login Body */}
          <div className="p-6 sm:p-7">
            <div className="mb-5">
              <h2 className="text-sm font-bold text-slate-800">
                {activeTab === 'guru' ? 'Autentikasi Guru Mata Pelajaran' : 'Autentikasi Pengelola Sistem'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === 'guru'
                  ? 'Gunakan akun dan kata sandi yang telah didaftarkan oleh admin sekolah.'
                  : 'Akses khusus administrator untuk pengaturan kurikulum dan data master.'}
              </p>
            </div>

            {/* Error message banner */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D8232A]" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="login-username">
                  {activeTab === 'guru' ? 'Username Guru atau NIP' : 'Username Admin'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={activeTab === 'guru' ? 'Masukkan username atau NIP...' : 'Masukkan username admin...'}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="login-password">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1E3A6C] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                className="w-full mt-2 bg-[#1E3A6C] hover:bg-[#162B52] text-white font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>Masuk ke {activeTab === 'guru' ? 'Portal Guru' : 'Panel Admin'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          SMA Kristen Kalam Kudus Sukoharjo • Sistem e-Rapor PTS Terintegrasi
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
