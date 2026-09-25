import React, { useState } from 'react';
import { UniversityProvider, useUniversity } from './context/UniversityContext';
import { AuthScreen } from './components/AuthScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { StudentEnrollment } from './components/StudentEnrollment';
import { CourseManagement } from './components/CourseManagement';
import { FacultyRecords } from './components/FacultyRecords';
import { SchoolFeesManagement } from './components/SchoolFeesManagement';
import { SemesterRegistration } from './components/SemesterRegistration';
import { DepartmentManagement } from './components/DepartmentManagement';
import { DocumentGenerator } from './components/DocumentGenerator';
import { StudentDetailModal } from './components/StudentDetailModal';
import { RemitaReceiptModal } from './components/RemitaReceiptModal';
import { CourseFormModal } from './components/CourseFormModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ToastContainer } from './components/Toast';
import { Student, FeePayment, CourseRegistration } from './types';

function MainApp() {
  const { isAuthenticated, students, registrations } = useUniversity();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Modals & Selected Entities
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePayment | null>(null);
  const [selectedCourseSlip, setSelectedCourseSlip] = useState<CourseRegistration | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // If user is not authenticated, show Nigerian green/white login screen
  if (!isAuthenticated) {
    return (
      <>
        <AuthScreen />
        <ToastContainer />
      </>
    );
  }

  const handlePrintStudentId = (student: Student) => {
    setSelectedStudent(null);
    setActiveTab('documents');
  };

  const handlePrintCourseSlipForStudent = (student: Student) => {
    const reg = registrations.find((r) => r.studentId === student.id);
    if (reg) {
      setSelectedStudent(null);
      setSelectedCourseSlip(reg);
    } else {
      setSelectedStudent(null);
      setActiveTab('registrations');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top University Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenEnrollModal={() => setActiveTab('students')}
              onOpenVerifyFeeModal={() => setActiveTab('fees')}
              onSelectReceipt={(pay) => setSelectedReceipt(pay)}
              onSelectStudent={(stu) => setSelectedStudent(stu)}
            />
          )}

          {activeTab === 'students' && (
            <StudentEnrollment
              onSelectStudent={(stu) => setSelectedStudent(stu)}
              onPrintStudentId={handlePrintStudentId}
            />
          )}

          {activeTab === 'courses' && <CourseManagement />}

          {activeTab === 'faculty-records' && <FacultyRecords />}

          {activeTab === 'fees' && (
            <SchoolFeesManagement
              onSelectReceipt={(pay) => setSelectedReceipt(pay)}
            />
          )}

          {activeTab === 'registrations' && (
            <SemesterRegistration
              onSelectRegistration={(reg) => setSelectedCourseSlip(reg)}
            />
          )}

          {activeTab === 'departments' && <DepartmentManagement />}

          {activeTab === 'documents' && (
            <DocumentGenerator
              onSelectReceipt={(pay) => setSelectedReceipt(pay)}
              onSelectCourseSlip={(reg) => setSelectedCourseSlip(reg)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onPrintIdCard={handlePrintStudentId}
        onPrintCourseSlip={handlePrintCourseSlipForStudent}
      />

      <RemitaReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      <CourseFormModal
        registration={selectedCourseSlip}
        onClose={() => setSelectedCourseSlip(null)}
      />

      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectStudent={(stu) => setSelectedStudent(stu)}
        onSelectReceipt={(pay) => setSelectedReceipt(pay)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Real-time Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <UniversityProvider>
      <MainApp />
    </UniversityProvider>
  );
}
