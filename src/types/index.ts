export type Level = '100L' | '200L' | '300L' | '400L' | '500L';
export type Semester = 'First Semester' | 'Second Semester';
export type AcademicSession = '2023/2024' | '2024/2025' | '2025/2026';

export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Pending Verification';
export type RegistrationStatus = 'Approved' | 'Pending Approval' | 'Rejected' | 'Draft';
export type StaffRank = 
  | 'Professor'
  | 'Associate Professor (Reader)'
  | 'Senior Lecturer'
  | 'Lecturer I'
  | 'Lecturer II'
  | 'Assistant Lecturer'
  | 'Graduate Assistant';

export interface Department {
  id: string;
  code: string; // e.g. "CSC"
  name: string; // e.g. "Computer Science"
  facultyId: string;
  facultyName: string;
  hodName: string;
  hodStaffId: string;
  officeLocation: string;
  studentCount: number;
  staffCount: number;
  programs: string[];
  establishedYear: number;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  deanName: string;
  deanStaffId: string;
  departmentCount: number;
  studentCount: number;
  colorTheme?: string;
}

export interface Student {
  id: string;
  matricNo: string;
  jambRegNo: string;
  fullName: string;
  gender: 'Male' | 'Female';
  facultyId: string;
  facultyName: string;
  departmentId: string;
  departmentName: string;
  level: Level;
  modeOfEntry: 'UTME' | 'Direct Entry' | 'Transfer';
  stateOfOrigin: string;
  lga: string;
  email: string;
  phone: string;
  cgpa: number;
  admissionYear: number;
  feeStatus: PaymentStatus;
  registrationStatus: RegistrationStatus;
  avatarUrl: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  currentAddress: string;
}

export interface Course {
  id: string;
  code: string; // e.g. "CSC 201"
  title: string;
  creditUnits: number;
  level: Level;
  semester: Semester;
  departmentId: string;
  departmentName: string;
  facultyName: string;
  type: 'Compulsory' | 'Required' | 'Elective';
  lecturerInCharge: string;
  lecturerStaffId: string;
  enrolledStudentsCount: number;
  capacity: number;
  prerequisites: string[];
  venue: string;
  schedule: string;
}

export interface Staff {
  id: string;
  staffId: string; // e.g. "FU/ACAD/SCI/042"
  fullName: string;
  rank: StaffRank;
  role: 'Dean' | 'HOD' | 'Course Adviser' | 'Lecturer';
  facultyId: string;
  facultyName: string;
  departmentId: string;
  departmentName: string;
  qualifications: string[];
  email: string;
  phone: string;
  status: 'Active' | 'On Sabbatical' | 'Study Leave' | 'Retired';
  coursesAssigned: string[]; // Course codes
  hireYear: number;
  avatarUrl: string;
}

export interface FeeSchedule {
  facultyId: string;
  facultyName: string;
  level: Level;
  tuitionFee: number;
  ictFee: number;
  libraryFee: number;
  medicalFee: number;
  labWorkshopFee: number;
  sugDues: number;
  totalAmount: number;
}

export interface FeePayment {
  id: string;
  rrr: string; // Remita Retrieval Reference e.g. "2409-8812-7491"
  studentId: string;
  matricNo: string;
  studentName: string;
  departmentName: string;
  facultyName: string;
  level: Level;
  session: AcademicSession;
  semester: Semester;
  amount: number;
  paymentChannel: 'Remita TSA' | 'Bank Branch (e-Tranzact)' | 'Interswitch WebPay' | 'Quickteller';
  paymentDate: string;
  status: 'Successful' | 'Pending Verification' | 'Failed';
  receiptNo: string;
  narration: string;
}

export interface CourseRegistration {
  id: string;
  regNumber: string;
  studentId: string;
  matricNo: string;
  studentName: string;
  departmentName: string;
  level: Level;
  session: AcademicSession;
  semester: Semester;
  courses: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    creditUnits: number;
    type: 'Compulsory' | 'Required' | 'Elective';
  }[];
  totalCreditUnits: number;
  status: RegistrationStatus;
  submissionDate: string;
  approvedDate?: string;
  approvedBy?: string;
  courseAdviserComment?: string;
}

export interface UniversityStats {
  totalStudents: number;
  totalFacultyStaff: number;
  totalDepartments: number;
  totalFaculties: number;
  totalFeesCollected: number;
  pendingClearances: number;
  pendingRegistrations: number;
  coursesOffered: number;
}
