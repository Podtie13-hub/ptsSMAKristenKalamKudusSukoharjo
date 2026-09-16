/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AcademicYear,
  AdminUser,
  AuthSession,
  ClassRoom,
  PTSGrade,
  PrintSettings,
  SchoolProfile,
  Student,
  StudentEvaluation,
  Subject,
  Teacher,
  TeachingAssignment,
} from './types';
import { StorageService } from './utils/storage';
import Header from './components/Header';
import AdminDashboard from './components/admin/AdminDashboard';
import { PortalGuru } from './components/guru/PortalGuru';
import { LoginPage } from './components/auth/LoginPage';
import PrintPreviewModal from './components/rapor/PrintPreviewModal';
import SqlExportModal from './components/sql/SqlExportModal';
import RaporDocument from './components/rapor/RaporDocument';

export default function App() {
  // Main state initialized from storage / defaults
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() =>
    StorageService.getAcademicYears()
  );
  const [classes, setClasses] = useState<ClassRoom[]>(() =>
    StorageService.getClasses()
  );
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    StorageService.getSubjects()
  );
  const [teachers, setTeachers] = useState<Teacher[]>(() =>
    StorageService.getTeachers()
  );
  const [assignments, setAssignments] = useState<TeachingAssignment[]>(() =>
    StorageService.getAssignments()
  );
  const [students, setStudents] = useState<Student[]>(() =>
    StorageService.getStudents()
  );
  const [grades, setGrades] = useState<PTSGrade[]>(() =>
    StorageService.getGrades()
  );
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>(() =>
    StorageService.getEvaluations()
  );
  const [printSettings, setPrintSettings] = useState<PrintSettings>(() =>
    StorageService.getPrintSettings()
  );
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() =>
    StorageService.getSchoolProfile()
  );
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() =>
    StorageService.getAdminUsers()
  );

  // Auth Session state (null = not logged in, otherwise holds user credentials and role)
  const [authSession, setAuthSession] = useState<AuthSession | null>(() =>
    StorageService.getAuthSession()
  );

  // Modals state
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [previewModalConfig, setPreviewModalConfig] = useState<{
    isOpen: boolean;
    mode: 'single' | 'class';
    studentIndex: number;
    classId?: string;
  }>({
    isOpen: false,
    mode: 'class',
    studentIndex: 0,
  });

  // Active academic year & semester
  const activeAcademicYear =
    academicYears.find((ay) => ay.isActive) || academicYears[0];

  // Save changes to localStorage
  useEffect(() => {
    StorageService.saveAcademicYears(academicYears);
  }, [academicYears]);

  useEffect(() => {
    StorageService.saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    StorageService.saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    StorageService.saveTeachers(teachers);
  }, [teachers]);

  useEffect(() => {
    StorageService.saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    StorageService.saveStudents(students);
  }, [students]);

  useEffect(() => {
    StorageService.saveGrades(grades);
  }, [grades]);

  useEffect(() => {
    StorageService.saveEvaluations(evaluations);
  }, [evaluations]);

  useEffect(() => {
    StorageService.savePrintSettings(printSettings);
  }, [printSettings]);

  useEffect(() => {
    StorageService.saveSchoolProfile(schoolProfile);
  }, [schoolProfile]);

  useEffect(() => {
    StorageService.saveAdminUsers(adminUsers);
  }, [adminUsers]);

  // Auth handlers
  const handleLogin = (session: AuthSession) => {
    StorageService.saveAuthSession(session);
    setAuthSession(session);
  };

  const handleLogout = () => {
    StorageService.saveAuthSession(null);
    setAuthSession(null);
  };

  // Direct login / impersonation for testing from Admin Dashboard
  const handleImpersonateTeacher = (teacher: Teacher) => {
    const session: AuthSession = {
      role: 'guru',
      username: teacher.username || teacher.name.toLowerCase().split(' ')[0],
      name: teacher.name,
      teacherId: teacher.id,
      loggedInAt: new Date().toISOString(),
    };
    StorageService.saveAuthSession(session);
    setAuthSession(session);
  };

  // Reset demo data handler
  const handleResetData = () => {
    StorageService.resetAllData();
    setAcademicYears(StorageService.getAcademicYears());
    setClasses(StorageService.getClasses());
    setSubjects(StorageService.getSubjects());
    setTeachers(StorageService.getTeachers());
    setAssignments(StorageService.getAssignments());
    setStudents(StorageService.getStudents());
    setGrades(StorageService.getGrades());
    setEvaluations(StorageService.getEvaluations());
    setPrintSettings(StorageService.getPrintSettings());
    setSchoolProfile(StorageService.getSchoolProfile());
    setAdminUsers(StorageService.getAdminUsers());
  };

  // Open Preview Modal
  const handleOpenPreviewModal = (
    mode: 'single' | 'class',
    studentIndex = 0,
    classId?: string
  ) => {
    setPreviewModalConfig({
      isOpen: true,
      mode,
      studentIndex,
      classId,
    });
  };

  // Current logged in teacher entity
  const currentLoggedInTeacher =
    authSession?.role === 'guru' && authSession.teacherId
      ? teachers.find((t) => t.id === authSession.teacherId) || teachers[0]
      : teachers[0];

  // Determine targeted classroom for printing
  const targetClass =
    (previewModalConfig.classId
      ? classes.find((c) => c.id === previewModalConfig.classId)
      : null) ||
    (authSession?.role === 'guru' && currentLoggedInTeacher
      ? classes.find((c) => c.homeroomTeacherId === currentLoggedInTeacher.id)
      : null) ||
    classes[0];

  const classStudents = students.filter((s) => s.classId === targetClass?.id);

  // Student list to print (single student or whole class)
  const studentsToPrint =
    previewModalConfig.mode === 'single'
      ? [classStudents[previewModalConfig.studentIndex] || classStudents[0]].filter(Boolean)
      : classStudents;

  // IF USER IS NOT LOGGED IN: Render Login Page
  if (!authSession) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <LoginPage
          teachers={teachers}
          classes={classes}
          schoolProfile={schoolProfile}
          adminUsers={adminUsers}
          onLogin={handleLogin}
        />

        {/* SQL Export Modal accessible from anywhere if needed */}
        {isSqlModalOpen && (
          <SqlExportModal
            isOpen={isSqlModalOpen}
            onClose={() => setIsSqlModalOpen(false)}
            academicYears={academicYears}
            classes={classes}
            subjects={subjects}
            teachers={teachers}
            assignments={assignments}
            students={students}
            grades={grades}
          />
        )}
      </div>
    );
  }

  // IF USER IS LOGGED IN: Render Workspace
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-[#1E3A6C] selection:text-white">
      {/* 1. Official Header with Brand Identity, User Badge, and Logout */}
      <Header
        authSession={authSession}
        onLogout={handleLogout}
        activeAcademicYear={activeAcademicYear}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        schoolProfile={schoolProfile}
        teachers={teachers}
        classes={classes}
      />

      {/* 2. Main Workspace Body (Visible on screen, hidden on print) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        {authSession.role === 'admin' && (
          <AdminDashboard
            academicYears={academicYears}
            classes={classes}
            subjects={subjects}
            teachers={teachers}
            assignments={assignments}
            students={students}
            schoolProfile={schoolProfile}
            adminUsers={adminUsers}
            currentAdminUsername={authSession.username}
            printSettings={printSettings}
            onUpdateAcademicYears={setAcademicYears}
            onUpdateClasses={setClasses}
            onUpdateSubjects={setSubjects}
            onUpdateTeachers={setTeachers}
            onUpdateAssignments={setAssignments}
            onUpdateStudents={setStudents}
            onUpdateSchoolProfile={setSchoolProfile}
            onUpdateAdminUsers={setAdminUsers}
            onUpdatePrintSettings={setPrintSettings}
            onResetData={handleResetData}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
            onImpersonateTeacher={handleImpersonateTeacher}
          />
        )}

        {authSession.role === 'guru' && (
          <PortalGuru
            currentTeacher={currentLoggedInTeacher}
            teachers={teachers}
            academicYears={academicYears}
            activeAcademicYear={activeAcademicYear}
            classes={classes}
            subjects={subjects}
            assignments={assignments}
            students={students}
            grades={grades}
            evaluations={evaluations}
            printSettings={printSettings}
            schoolProfile={schoolProfile}
            onSaveGrades={setGrades}
            onUpdateEvaluations={setEvaluations}
            onUpdatePrintSettings={setPrintSettings}
            onOpenPreviewModal={handleOpenPreviewModal}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} <strong>{schoolProfile.name}</strong> • Sistem Penilaian Tengah Semester (PTS)
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Solo Baru, Sukoharjo</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSqlModalOpen(true)}
              className="text-[#1E3A6C] hover:underline font-semibold"
            >
              MySQL Database Schema & PHP Code
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Interactive Print Preview Modal */}
      {previewModalConfig.isOpen && (
        <PrintPreviewModal
          isOpen={previewModalConfig.isOpen}
          onClose={() => setPreviewModalConfig((prev) => ({ ...prev, isOpen: false }))}
          students={studentsToPrint}
          classroom={targetClass}
          academicYear={activeAcademicYear}
          subjects={subjects}
          grades={grades}
          evaluations={evaluations}
          printSettings={printSettings}
          onUpdatePrintSettings={setPrintSettings}
          schoolProfile={schoolProfile}
          initialStudentIndex={previewModalConfig.studentIndex}
          printMode={previewModalConfig.mode}
        />
      )}

      {/* 5. SQL & PHP Database Export Modal */}
      {isSqlModalOpen && (
        <SqlExportModal
          isOpen={isSqlModalOpen}
          onClose={() => setIsSqlModalOpen(false)}
          academicYears={academicYears}
          classes={classes}
          subjects={subjects}
          teachers={teachers}
          assignments={assignments}
          students={students}
          grades={grades}
        />
      )}

      {/* 6. Print-Only Dedicated Area (Rendered when user triggers window.print()) */}
      <div className="print-only">
        <RaporDocument
          students={studentsToPrint}
          classroom={targetClass}
          academicYear={activeAcademicYear}
          subjects={subjects}
          grades={grades}
          evaluations={evaluations}
          printSettings={printSettings}
          schoolProfile={schoolProfile}
        />
      </div>
    </div>
  );
}
