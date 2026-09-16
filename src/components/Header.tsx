import React from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Database,
  Calendar,
  LogOut,
  User,
  Award,
} from 'lucide-react';
import { AcademicYear, AuthSession, ClassRoom, SchoolProfile, Teacher } from '../types';
import KalamKudusLogo from './KalamKudusLogo';

interface HeaderProps {
  authSession: AuthSession | null;
  onLogout: () => void;
  activeAcademicYear?: AcademicYear;
  onOpenSqlModal: () => void;
  schoolProfile?: SchoolProfile;
  teachers?: Teacher[];
  classes?: ClassRoom[];
}

export const Header: React.FC<HeaderProps> = ({
  authSession,
  onLogout,
  activeAcademicYear,
  onOpenSqlModal,
  schoolProfile,
  teachers = [],
  classes = [],
}) => {
  // Check if logged in teacher is homeroom
  const loggedInTeacher = authSession?.role === 'guru'
    ? teachers.find((t) => t.id === authSession.teacherId)
    : null;
  const homeroomClass = loggedInTeacher
    ? classes.find((c) => c.homeroomTeacherId === loggedInTeacher.id)
    : null;

  return (
    <header className="bg-[#1E3A6C] text-white shadow-md border-b-2 border-[#D8232A] sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-2.5 gap-3">
          {/* School Brand & Logo */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <KalamKudusLogo
                size="md"
                variant="full"
                textColor="text-white"
                subtextColor="text-blue-100"
                logoUrl={schoolProfile?.logoUrl}
              />
            </div>

            {/* Academic Year Badge for Mobile */}
            <div className="md:hidden flex items-center gap-1.5 bg-[#15294e] text-blue-100 text-xs px-2.5 py-1 rounded-full border border-blue-400/20">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{activeAcademicYear ? `${activeAcademicYear.name} (${activeAcademicYear.semester})` : '2024/2025'}</span>
            </div>
          </div>

          {/* Right Info: User identity & Logout & MySQL */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Academic Year PTS info */}
            <div className="hidden lg:block text-right border-r border-blue-700/50 pr-3">
              <div className="flex items-center gap-1 text-[11px] text-blue-200">
                <Calendar className="w-3 h-3 text-amber-300" />
                <span>T.A. Aktif</span>
              </div>
              <div className="text-xs font-bold text-white tracking-wide">
                {activeAcademicYear ? `${activeAcademicYear.name} (${activeAcademicYear.semester})` : '2024/2025 (Ganjil)'}
              </div>
            </div>

            {/* Logged in User Badge */}
            {authSession && (
              <div className="flex items-center gap-2 bg-[#152B52] pl-3 pr-2 py-1.5 rounded-xl border border-blue-800">
                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                    {authSession.role === 'admin' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                    ) : (
                      <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span className="truncate max-w-[160px] sm:max-w-[200px]">{authSession.name}</span>
                  </div>
                  <div className="text-[10px] text-blue-200 flex items-center justify-end gap-1">
                    {authSession.role === 'admin' ? (
                      <span className="bg-purple-900/60 text-purple-200 px-1.5 py-0.2 rounded font-semibold">
                        Administrator
                      </span>
                    ) : (
                      <>
                        <span className="bg-blue-900/60 text-blue-200 px-1.5 py-0.2 rounded font-semibold">
                          Guru Mapel
                        </span>
                        {homeroomClass && (
                          <span className="bg-emerald-800/80 text-emerald-200 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Award className="w-2.5 h-2.5 text-emerald-300" />
                            Wali {homeroomClass.name}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-logout"
                  onClick={onLogout}
                  className="flex items-center gap-1 bg-red-600/80 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ml-1"
                  title="Keluar dari akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            )}

            {/* MySQL Button */}
            <button
              type="button"
              id="btn-mysql-database"
              onClick={onOpenSqlModal}
              className="flex items-center gap-1.5 bg-[#D8232A] hover:bg-[#b51b22] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              title="Lihat Database MySQL & Skema SQL"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Database MySQL</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
