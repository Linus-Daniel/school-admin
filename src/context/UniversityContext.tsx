import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Faculty,
  Department,
  Course,
  Staff,
  FeePayment,
  FeeSchedule,
  CourseRegistration,
  AcademicSession,
  Semester,
  UniversityStats,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_FACULTIES,
  INITIAL_DEPARTMENTS,
  INITIAL_COURSES,
  INITIAL_STAFF,
  INITIAL_PAYMENTS,
  INITIAL_FEE_SCHEDULES,
  INITIAL_REGISTRATIONS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

interface UniversityContextType {
  isAuthenticated: boolean;
  currentUser: { username: string; role: string; name: string } | null;
  login: (u: string, p: string) => boolean;
  logout: () => void;

  students: Student[];
  faculties: Faculty[];
  departments: Department[];
  courses: Course[];
  staff: Staff[];
  payments: FeePayment[];
  feeSchedules: FeeSchedule[];
  registrations: CourseRegistration[];

  currentSession: AcademicSession;
  currentSemester: Semester;
  setAcademicPeriod: (session: AcademicSession, semester: Semester) => void;

  stats: UniversityStats;

  // Student operations
  addStudent: (student: Omit<Student, 'id' | 'admissionYear' | 'cgpa'>) => Student;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Course operations
  addCourse: (course: Omit<Course, 'id' | 'enrolledStudentsCount'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Staff operations
  addStaff: (staffMember: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staffMember: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Faculty & Department operations
  addFaculty: (faculty: Omit<Faculty, 'id' | 'departmentCount' | 'studentCount'>) => void;
  addDepartment: (dept: Omit<Department, 'id' | 'studentCount' | 'staffCount'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;

  // Fee Operations
  recordFeePayment: (payment: Omit<FeePayment, 'id' | 'receiptNo' | 'paymentDate'>) => FeePayment;
  verifyFeePayment: (rrr: string) => boolean;

  // Course Registration operations
  approveRegistration: (regId: string, comment?: string) => void;
  rejectRegistration: (regId: string, comment?: string) => void;
  createCourseRegistration: (reg: Omit<CourseRegistration, 'id' | 'regNumber' | 'submissionDate'>) => void;

  // System
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  resetAllData: () => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'uninaija_admin_';

export const UniversityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`) === 'true';
  });

  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; name: string } | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : null;
  });

  const [currentSession, setCurrentSession] = useState<AcademicSession>('2024/2025');
  const [currentSemester, setCurrentSemester] = useState<Semester>('First Semester');

  // Load state with fallback to mock data
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [faculties, setFaculties] = useState<Faculty[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}faculties`);
    return saved ? JSON.parse(saved) : INITIAL_FACULTIES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}departments`);
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}courses`);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [payments, setPayments] = useState<FeePayment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}payments`);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [feeSchedules] = useState<FeeSchedule[]>(INITIAL_FEE_SCHEDULES);

  const [registrations, setRegistrations] = useState<CourseRegistration[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}registrations`);
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, String(isAuthenticated));
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}faculties`, JSON.stringify(faculties));
  }, [faculties]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}departments`, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}courses`, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}staff`, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}registrations`, JSON.stringify(registrations));
  }, [registrations]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth: admin / password
  const login = (u: string, p: string): boolean => {
    if (u.trim().toLowerCase() === 'admin' && p === 'password') {
      const user = {
        username: 'admin',
        role: 'Central Academic Registrar & Chief Administrator',
        name: 'Dr. (Mrs.) Funmilayo Adeyemi',
      };
      setIsAuthenticated(true);
      setCurrentUser(user);
      showToast('Welcome to UniNaija Central Administration Portal', 'success');
      return true;
    }
    showToast('Invalid credentials. Use admin / password', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Successfully logged out of portal session', 'info');
  };

  const setAcademicPeriod = (session: AcademicSession, semester: Semester) => {
    setCurrentSession(session);
    setCurrentSemester(semester);
    showToast(`Active period set to ${session} - ${semester}`, 'info');
  };

  // Student Operations
  const addStudent = (studentData: Omit<Student, 'id' | 'admissionYear' | 'cgpa'>): Student => {
    const newId = `stu-${Date.now().toString(36)}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      admissionYear: 2024,
      cgpa: 0.0,
      avatarUrl:
        studentData.avatarUrl ||
        (studentData.gender === 'Female'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update faculty and department counts
    setDepartments((prev) =>
      prev.map((d) => (d.id === studentData.departmentId ? { ...d, studentCount: d.studentCount + 1 } : d))
    );
    setFaculties((prev) =>
      prev.map((f) => (f.id === studentData.facultyId ? { ...f, studentCount: f.studentCount + 1 } : f))
    );

    showToast(`Student ${newStudent.fullName} (${newStudent.matricNo}) successfully enrolled!`, 'success');
    return newStudent;
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s)));
    showToast('Student academic record updated', 'success');
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    if (!target) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast(`Student ${target.fullName} record removed`, 'info');
  };

  // Course Operations
  const addCourse = (courseData: Omit<Course, 'id' | 'enrolledStudentsCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now().toString(36)}`,
      enrolledStudentsCount: 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
    showToast(`Course ${newCourse.code}: ${newCourse.title} added to curriculum`, 'success');
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast('Course curriculum details updated', 'success');
  };

  const deleteCourse = (id: string) => {
    const target = courses.find((c) => c.id === id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast(`Course ${target?.code} deleted`, 'info');
  };

  // Staff Operations
  const addStaff = (staffData: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: `staff-${Date.now().toString(36)}`,
      avatarUrl:
        staffData.avatarUrl ||
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    };
    setStaff((prev) => [newStaff, ...prev]);
    setDepartments((prev) =>
      prev.map((d) => (d.id === staffData.departmentId ? { ...d, staffCount: d.staffCount + 1 } : d))
    );
    showToast(`Staff record for ${newStaff.fullName} created (${newStaff.staffId})`, 'success');
  };

  const updateStaff = (id: string, updated: Partial<Staff>) => {
    setStaff((prev) => prev.map((st) => (st.id === id ? { ...st, ...updated } : st)));
    showToast('Staff profile & academic assignment updated', 'success');
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((st) => st.id !== id));
    showToast('Staff record removed from university directory', 'info');
  };

  // Faculty & Department Operations
  const addFaculty = (data: Omit<Faculty, 'id' | 'departmentCount' | 'studentCount'>) => {
    const newFaculty: Faculty = {
      ...data,
      id: `fac-${data.code.toLowerCase()}`,
      departmentCount: 0,
      studentCount: 0,
    };
    setFaculties((prev) => [...prev, newFaculty]);
    showToast(`New Faculty of ${newFaculty.name} established`, 'success');
  };

  const addDepartment = (data: Omit<Department, 'id' | 'studentCount' | 'staffCount'>) => {
    const newDept: Department = {
      ...data,
      id: `dept-${data.code.toLowerCase()}`,
      studentCount: 0,
      staffCount: 1,
    };
    setDepartments((prev) => [...prev, newDept]);
    setFaculties((prev) =>
      prev.map((f) => (f.id === data.facultyId ? { ...f, departmentCount: f.departmentCount + 1 } : f))
    );
    showToast(`Department of ${newDept.name} (${newDept.code}) initialized`, 'success');
  };

  const updateDepartment = (id: string, data: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
    showToast('Department details and HOD designation updated', 'success');
  };

  // Fee Operations
  const recordFeePayment = (
    paymentData: Omit<FeePayment, 'id' | 'receiptNo' | 'paymentDate'>
  ): FeePayment => {
    const receiptNo = `REC/${new Date().getFullYear().toString().slice(-2)}/${paymentData.departmentName
      .slice(0, 3)
      .toUpperCase()}/${Math.floor(10000 + Math.random() * 90000)}`;

    const newPayment: FeePayment = {
      ...paymentData,
      id: `pay-${Date.now().toString(36)}`,
      receiptNo,
      paymentDate: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update student payment status
    if (newPayment.status === 'Successful') {
      setStudents((prev) =>
        prev.map((s) => (s.id === newPayment.studentId ? { ...s, feeStatus: 'Paid' } : s))
      );
    }

    showToast(`Remita Payment Verified: ₦${paymentData.amount.toLocaleString()} (RRR: ${paymentData.rrr})`, 'success');
    return newPayment;
  };

  const verifyFeePayment = (rrr: string): boolean => {
    const payment = payments.find((p) => p.rrr.replace(/[\s-]/g, '') === rrr.replace(/[\s-]/g, ''));
    if (!payment) {
      showToast(`RRR ${rrr} not found in Central Remita Portal`, 'error');
      return false;
    }
    setPayments((prev) =>
      prev.map((p) => (p.id === payment.id ? { ...p, status: 'Successful' } : p))
    );
    setStudents((prev) =>
      prev.map((s) => (s.id === payment.studentId ? { ...s, feeStatus: 'Paid' } : s))
    );
    showToast(`RRR ${rrr} confirmed and cleared with Treasury Single Account (TSA)`, 'success');
    return true;
  };

  // Course Registration
  const approveRegistration = (regId: string, comment?: string) => {
    const reg = registrations.find((r) => r.id === regId);
    if (!reg) return;

    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === regId
          ? {
              ...r,
              status: 'Approved',
              approvedDate: new Date().toISOString().split('T')[0],
              approvedBy: 'Central Senate Academic Clearance & HOD',
              courseAdviserComment: comment || 'Official course form approved. Student cleared for examinations.',
            }
          : r
      )
    );

    setStudents((prev) =>
      prev.map((s) => (s.id === reg.studentId ? { ...s, registrationStatus: 'Approved' } : s))
    );

    showToast(`Course Registration for ${reg.studentName} (${reg.matricNo}) has been Approved`, 'success');
  };

  const rejectRegistration = (regId: string, comment?: string) => {
    const reg = registrations.find((r) => r.id === regId);
    if (!reg) return;

    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === regId
          ? {
              ...r,
              status: 'Rejected',
              courseAdviserComment: comment || 'Registration rejected: Exceeds unit limit or outstanding prerequisite.',
            }
          : r
      )
    );

    setStudents((prev) =>
      prev.map((s) => (s.id === reg.studentId ? { ...s, registrationStatus: 'Rejected' } : s))
    );

    showToast(`Course Registration for ${reg.studentName} marked as Rejected/Needs Revision`, 'info');
  };

  const createCourseRegistration = (
    data: Omit<CourseRegistration, 'id' | 'regNumber' | 'submissionDate'>
  ) => {
    const regNumber = `CRF/${new Date().getFullYear()}/${data.departmentName
      .slice(0, 3)
      .toUpperCase()}/${Math.floor(100 + Math.random() * 900)}`;

    const newReg: CourseRegistration = {
      ...data,
      id: `reg-${Date.now().toString(36)}`,
      regNumber,
      submissionDate: new Date().toISOString().split('T')[0],
    };

    setRegistrations((prev) => [newReg, ...prev]);
    setStudents((prev) =>
      prev.map((s) => (s.id === data.studentId ? { ...s, registrationStatus: data.status } : s))
    );

    showToast(`Semester course form submitted for ${data.studentName}`, 'success');
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setFaculties(INITIAL_FACULTIES);
    setDepartments(INITIAL_DEPARTMENTS);
    setCourses(INITIAL_COURSES);
    setStaff(INITIAL_STAFF);
    setPayments(INITIAL_PAYMENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    localStorage.clear();
    showToast('All database records reset to official initial university state', 'info');
  };

  // Stats calculation
  const stats: UniversityStats = {
    totalStudents: students.length,
    totalFacultyStaff: staff.length,
    totalDepartments: departments.length,
    totalFaculties: faculties.length,
    totalFeesCollected: payments
      .filter((p) => p.status === 'Successful')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingClearances: payments.filter((p) => p.status === 'Pending Verification').length,
    pendingRegistrations: registrations.filter((r) => r.status === 'Pending Approval').length,
    coursesOffered: courses.length,
  };

  return (
    <UniversityContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        students,
        faculties,
        departments,
        courses,
        staff,
        payments,
        feeSchedules,
        registrations,
        currentSession,
        currentSemester,
        setAcademicPeriod,
        stats,
        addStudent,
        updateStudent,
        deleteStudent,
        addCourse,
        updateCourse,
        deleteCourse,
        addStaff,
        updateStaff,
        deleteStaff,
        addFaculty,
        addDepartment,
        updateDepartment,
        recordFeePayment,
        verifyFeePayment,
        approveRegistration,
        rejectRegistration,
        createCourseRegistration,
        toasts,
        showToast,
        dismissToast,
        resetAllData,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
};
