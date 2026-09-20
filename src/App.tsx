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
import { storage } from './utils/storage';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PortalGuru } from './components/guru/PortalGuru';
import { WaliKelasView } from './components/walikelas/WaliKelasView';
import PrintPreviewModal from './components/rapor/PrintPreviewModal';
import LegerNilaiModal from './components/walikelas/LegerNilaiModal';
import SqlExportModal from './components/sql/SqlExportModal';
import RaporDocument from './components/rapor/RaporDocument';
import PhpPackageModal from './components/admin/PhpPackageModal';

export const App: React.FC = () => {
  // 1. Core State Initialization with LocalStorage Persistence
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() =>
    storage.getAcademicYears()
  );
  const [classes, setClasses] = useState<ClassRoom[]>(() => storage.getClasses());
  const [teachers, setTeachers] = useState<Teacher[]>(() => storage.getTeachers());
  const [subjects, setSubjects] = useState<Subject[]>(() => storage.getSubjects());
  const [students, setStudents] = useState<Student[]>(() => storage.getStudents());
  const [grades, setGrades] = useState<PTSGrade[]>(() => storage.getGrades());
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>(() =>
    storage.getEvaluations()
  );
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() =>
    storage.getSchoolProfile()
  );
  const [printSettings, setPrintSettings] = useState<PrintSettings>(() =>
    storage.getPrintSettings()
  );
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() =>
    storage.getAdminUsers()
  );
  const [assignments, setAssignments] = useState<TeachingAssignment[]>(() =>
    storage.getAssignments()
  );

  // 2. Authentication State
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(() =>
    storage.getSession()
  );

  // 3. Modals & Print Config State
  const [previewModalConfig, setPreviewModalConfig] = useState<{
    isOpen: boolean;
    classId: string;
    studentIndex: number;
    mode: 'single' | 'class';
  }>({
    isOpen: false,
    classId: '',
    studentIndex: 0,
    mode: 'single',
  });

  const [legerModalClassId, setLegerModalClassId] = useState<string | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [isPhpModalOpen, setIsPhpModalOpen] = useState<boolean>(false);

  // 4. Persistence Effects
  useEffect(() => {
    storage.saveAcademicYears(academicYears);
  }, [academicYears]);

  useEffect(() => {
    storage.saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    storage.saveTeachers(teachers);
  }, [teachers]);

  useEffect(() => {
    storage.saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    storage.saveStudents(students);
  }, [students]);

  useEffect(() => {
    storage.saveGrades(grades);
  }, [grades]);

  useEffect(() => {
    storage.saveEvaluations(evaluations);
  }, [evaluations]);

  useEffect(() => {
    storage.saveSchoolProfile(schoolProfile);
  }, [schoolProfile]);

  useEffect(() => {
    storage.savePrintSettings(printSettings);
  }, [printSettings]);

  useEffect(() => {
    storage.saveAdminUsers(adminUsers);
  }, [adminUsers]);

  useEffect(() => {
    storage.saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    storage.saveSession(currentSession);
  }, [currentSession]);

  // Handle active academic year
  const activeAcademicYear =
    academicYears.find((y) => y.isActive) || academicYears[0];

  // Grade save handler with batch support
  const handleSaveGrades = (newGrades: PTSGrade[]) => {
    setGrades((prev) => {
      const updated = [...prev];
      newGrades.forEach((ng) => {
        const index = updated.findIndex(
          (g) =>
            g.studentId === ng.studentId &&
            g.subjectId === ng.subjectId &&
            g.academicYearId === ng.academicYearId &&
            g.semester === ng.semester
        );
        if (index >= 0) {
          updated[index] = ng;
        } else {
          updated.push(ng);
        }
      });
      return updated;
    });
  };

  // Evaluation save handler
  const handleSaveEvaluations = (newEvals: StudentEvaluation[]) => {
    setEvaluations((prev) => {
      const updated = [...prev];
      newEvals.forEach((ne) => {
        const index = updated.findIndex(
          (e) =>
            e.studentId === ne.studentId &&
            e.academicYearId === ne.academicYearId &&
            e.semester === ne.semester
        );
        if (index >= 0) {
          updated[index] = ne;
        } else {
          updated.push(ne);
        }
      });
      return updated;
    });
  };

  // Print Handlers
  const handlePrintStudent = (classId: string, studentId: string) => {
    const classStudents = students.filter((s) => s.classId === classId);
    const sIndex = classStudents.findIndex((s) => s.id === studentId);
    setPreviewModalConfig({
      isOpen: true,
      classId,
      studentIndex: sIndex >= 0 ? sIndex : 0,
      mode: 'single',
    });
  };

  const handlePrintClass = (classId: string) => {
    setPreviewModalConfig({
      isOpen: true,
      classId,
      studentIndex: 0,
      mode: 'class',
    });
  };

  const handleOpenLeger = (classId: string) => {
    setLegerModalClassId(classId);
  };

  const handleLogout = () => {
    setCurrentSession(null);
  };

  // Resolve target class and students for printing
  const targetClass =
    classes.find((c) => c.id === previewModalConfig.classId) || classes[0];
  const classStudents = students.filter((s) => s.classId === targetClass?.id);
  const studentsToPrint =
    previewModalConfig.mode === 'single'
      ? [classStudents[previewModalConfig.studentIndex] || classStudents[0]].filter(
          Boolean
        )
      : classStudents;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 1. Main View Routing Based on Auth State */}
      <main className="flex-1">
        {!currentSession ? (
          <LoginPage
            teachers={teachers}
            classes={classes}
            schoolProfile={schoolProfile}
            adminUsers={adminUsers}
            onLogin={setCurrentSession}
            onOpenPhpPackage={() => setIsPhpModalOpen(true)}
          />
        ) : currentSession.role === 'admin' ? (
          <AdminDashboard
            schoolProfile={schoolProfile}
            academicYears={academicYears}
            classes={classes}
            teachers={teachers}
            subjects={subjects}
            students={students}
            grades={grades}
            evaluations={evaluations}
            adminUsers={adminUsers}
            printSettings={printSettings}
            assignments={assignments}
            currentUser={currentSession}
            onLogout={handleLogout}
            onUpdateProfile={setSchoolProfile}
            onUpdateAcademicYears={setAcademicYears}
            onUpdateClasses={setClasses}
            onUpdateTeachers={setTeachers}
            onUpdateSubjects={setSubjects}
            onUpdateStudents={setStudents}
            onUpdateAdminUsers={setAdminUsers}
            onUpdatePrintSettings={setPrintSettings}
            onUpdateAssignments={setAssignments}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
            onOpenPhpPackage={() => setIsPhpModalOpen(true)}
            onOpenLeger={handleOpenLeger}
            onPrintClass={handlePrintClass}
            onPrintStudent={handlePrintStudent}
          />
        ) : currentSession.role === 'walikelas' ? (
          <WaliKelasView
            teacherId={currentSession.teacherId || ''}
            classes={classes}
            students={students}
            subjects={subjects}
            grades={grades}
            evaluations={evaluations}
            academicYear={activeAcademicYear}
            schoolProfile={schoolProfile}
            currentUser={currentSession}
            onLogout={handleLogout}
            onSaveEvaluations={handleSaveEvaluations}
            onPrintStudent={handlePrintStudent}
            onPrintClass={handlePrintClass}
            onOpenLeger={handleOpenLeger}
          />
        ) : (
          <PortalGuru
            teacherId={currentSession.teacherId || ''}
            teachers={teachers}
            classes={classes}
            subjects={subjects}
            students={students}
            grades={grades}
            assignments={assignments}
            academicYear={activeAcademicYear}
            currentUser={currentSession}
            onLogout={handleLogout}
            onSaveGrades={handleSaveGrades}
          />
        )}
      </main>

      {/* 2. Leger Nilai Modal */}
      {legerModalClassId && (
        <LegerNilaiModal
          isOpen={!!legerModalClassId}
          onClose={() => setLegerModalClassId(null)}
          classroom={classes.find((c) => c.id === legerModalClassId) || classes[0]}
          students={students.filter((s) => s.classId === legerModalClassId)}
          subjects={subjects}
          grades={grades}
          evaluations={evaluations}
          academicYear={activeAcademicYear}
          schoolProfile={schoolProfile}
        />
      )}

      {/* 3. MySQL SQL Export Modal */}
      {isSqlModalOpen && (
        <SqlExportModal
          isOpen={isSqlModalOpen}
          onClose={() => setIsSqlModalOpen(false)}
          academicYears={academicYears}
          classes={classes}
          teachers={teachers}
          subjects={subjects}
          students={students}
          grades={grades}
          evaluations={evaluations}
          schoolProfile={schoolProfile}
          adminUsers={adminUsers}
          assignments={assignments}
        />
      )}

      {/* 4. Interactive Print Preview Modal */}
      {previewModalConfig.isOpen && (
        <PrintPreviewModal
          isOpen={previewModalConfig.isOpen}
          onClose={() =>
            setPreviewModalConfig((prev) => ({ ...prev, isOpen: false }))
          }
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
          assignments={assignments}
        />
      )}

      {/* 5. PHP Native + MySQL Package Modal */}
      {isPhpModalOpen && (
        <PhpPackageModal
          isOpen={isPhpModalOpen}
          onClose={() => setIsPhpModalOpen(false)}
          academicYears={academicYears}
          classes={classes}
          teachers={teachers}
          subjects={subjects}
          students={students}
          grades={grades}
          evaluations={evaluations}
          schoolProfile={schoolProfile}
          adminUsers={adminUsers}
          assignments={assignments}
        />
      )}

      {/* 6. Print-Only Dedicated Area */}
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
          assignments={assignments}
        />
      </div>
    </div>
  );
};

export default App;
