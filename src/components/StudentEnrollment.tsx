import React, { useState } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { Student, Level } from '../types';
import { NIGERIAN_STATES } from '../data/mockData';
import {
  GraduationCap,
  Search,
  Filter,
  UserPlus,
  FileSpreadsheet,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  IdCard,
  Trash2,
  Edit,
  Building,
  Phone,
  Mail,
  MapPin,
  X,
} from 'lucide-react';

interface StudentEnrollmentProps {
  onSelectStudent: (student: Student) => void;
  onPrintStudentId: (student: Student) => void;
  openEnrollModalDefault?: boolean;
}

export const StudentEnrollment: React.FC<StudentEnrollmentProps> = ({
  onSelectStudent,
  onPrintStudentId,
}) => {
  const { students, faculties, departments, addStudent, deleteStudent } = useUniversity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Student Form State
  const [fullName, setFullName] = useState('');
  const [jambRegNo, setJambRegNo] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [facultyId, setFacultyId] = useState(faculties[0]?.id || '');
  const [departmentId, setDepartmentId] = useState('');
  const [level, setLevel] = useState<Level>('100L');
  const [modeOfEntry, setModeOfEntry] = useState<'UTME' | 'Direct Entry'>('UTME');
  const [stateOfOrigin, setStateOfOrigin] = useState('Oyo State');
  const [lga, setLga] = useState('Ibadan North');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [nextOfKinName, setNextOfKinName] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('+234 ');
  const [currentAddress, setCurrentAddress] = useState('Hall of Residence, Main Campus');

  // Update department options when faculty changes
  const availableDepartments = departments.filter((d) => d.facultyId === facultyId);

  const handleOpenEnrollModal = () => {
    const currentFac = faculties[0]?.id || '';
    setFacultyId(currentFac);
    const depts = departments.filter((d) => d.facultyId === currentFac);
    setDepartmentId(depts[0]?.id || '');
    setJambRegNo(`2024${Math.floor(10000000 + Math.random() * 90000000)}AB`);
    setIsModalOpen(true);
  };

  const handleFacultyChangeInForm = (newFacId: string) => {
    setFacultyId(newFacId);
    const depts = departments.filter((d) => d.facultyId === newFacId);
    if (depts.length > 0) {
      setDepartmentId(depts[0].id);
    }
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const faculty = faculties.find((f) => f.id === facultyId);
    const department = departments.find((d) => d.id === departmentId);

    if (!faculty || !department) return;

    // Generate Nigerian University matriculation number: 2024/1/XXXXX{DEPT}
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const entryCode = modeOfEntry === 'Direct Entry' ? 'DE' : '1';
    const matricNo = `2024/${entryCode}/${randomDigits}${department.code.slice(0, 2)}`;

    addStudent({
      matricNo,
      jambRegNo: jambRegNo.toUpperCase(),
      fullName,
      gender,
      facultyId: faculty.id,
      facultyName: faculty.name,
      departmentId: department.id,
      departmentName: department.name,
      level,
      modeOfEntry,
      stateOfOrigin,
      lga,
      email: email || `${fullName.toLowerCase().replace(/[^a-z]/g, '.')}@student.uninaija.edu.ng`,
      phone: phone || '+234 803 000 0000',
      feeStatus: 'Unpaid',
      registrationStatus: 'Draft',
      avatarUrl:
        gender === 'Female'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      nextOfKinName: nextOfKinName || 'Parent / Guardian',
      nextOfKinPhone: nextOfKinPhone || '+234 802 000 0000',
      currentAddress: currentAddress || 'University Hostel, Ibadan',
    });

    setIsModalOpen(false);
    // Reset form
    setFullName('');
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.jambRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFaculty = selectedFaculty === 'ALL' || s.facultyId === selectedFaculty;
    const matchesDepartment = selectedDepartment === 'ALL' || s.departmentId === selectedDepartment;
    const matchesLevel = selectedLevel === 'ALL' || s.level === selectedLevel;
    const matchesFee = selectedFeeStatus === 'ALL' || s.feeStatus === selectedFeeStatus;

    return matchesSearch && matchesFaculty && matchesDepartment && matchesLevel && matchesFee;
  });

  const exportCSV = () => {
    const headers = ['Matric No', 'JAMB No', 'Full Name', 'Faculty', 'Department', 'Level', 'CGPA', 'Fee Status', 'State of Origin'];
    const rows = filteredStudents.map((s) => [
      s.matricNo,
      s.jambRegNo,
      `"${s.fullName}"`,
      `"${s.facultyName}"`,
      `"${s.departmentName}"`,
      s.level,
      s.cgpa,
      s.feeStatus,
      s.stateOfOrigin,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UniNaija_Student_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Module Title & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800">Student Enrollment & Registry</h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-[#008751] font-bold text-xs rounded-full">
              {students.length} Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Matriculation database, bio-data validation, and undergraduate clearance management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download CSV report"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handleOpenEnrollModal}
            className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit / Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, matric no, JAMB reg..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800 font-medium"
            />
          </div>

          {/* Faculty Filter */}
          <div>
            <select
              aria-label="Filter by Faculty"
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                setSelectedDepartment('ALL');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Faculties</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              aria-label="Filter by Level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Academic Levels</option>
              <option value="100L">100 Level (Freshmen)</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
              <option value="500L">500 Level (Final Year)</option>
            </select>
          </div>

          {/* Fee Status Filter */}
          <div>
            <select
              aria-label="Filter by School Fees Status"
              value={selectedFeeStatus}
              onChange={(e) => setSelectedFeeStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Fees Statuses</option>
              <option value="Paid">Cleared (Paid)</option>
              <option value="Pending Verification">Pending TSA</option>
              <option value="Unpaid">Unpaid Fees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-emerald-950/5 border-b border-emerald-100 text-emerald-950 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-4">Matric & JAMB No</th>
                <th className="py-3 px-4">Faculty & Department</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Remita Fees</th>
                <th className="py-3 px-4">Course Form</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.avatarUrl}
                          alt={stu.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
                        />
                        <div>
                          <div className="font-bold text-slate-800 hover:text-emerald-700 cursor-pointer" onClick={() => onSelectStudent(stu)}>
                            {stu.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                            <span>{stu.gender}</span>
                            <span>•</span>
                            <span>{stu.stateOfOrigin}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Matric & JAMB */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-emerald-900">{stu.matricNo}</div>
                      <div className="font-mono text-[10px] text-slate-400">JAMB: {stu.jambRegNo}</div>
                    </td>

                    {/* Faculty & Department */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700">{stu.departmentName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{stu.facultyName}</div>
                    </td>

                    {/* Level */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-md text-[11px]">
                        {stu.level}
                      </span>
                    </td>

                    {/* CGPA */}
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono font-bold text-xs ${
                          stu.cgpa >= 4.5
                            ? 'text-emerald-700'
                            : stu.cgpa >= 3.5
                            ? 'text-blue-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {stu.cgpa > 0 ? stu.cgpa.toFixed(2) : 'Freshman'}
                      </span>
                      {stu.cgpa >= 4.5 && (
                        <span className="block text-[9px] text-emerald-600 font-bold">First Class</span>
                      )}
                    </td>

                    {/* Fee Status */}
                    <td className="py-3 px-4">
                      {stu.feeStatus === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                        </span>
                      ) : stu.feeStatus === 'Pending Verification' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending TSA
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Unpaid
                        </span>
                      )}
                    </td>

                    {/* Registration Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          stu.registrationStatus === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : stu.registrationStatus === 'Pending Approval'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {stu.registrationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudent(stu)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="View Student Academic Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPrintStudentId(stu)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Generate & Print Student ID Card"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${stu.fullName} (${stu.matricNo})?`)) {
                              deleteStudent(stu.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-100 my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#008751] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base tracking-wide font-crest">
                  New Student Admission & Matriculation Enrollment
                </h3>
                <p className="text-xs text-emerald-100">
                  JAMB UTME / Direct Entry Official Verification Register
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Full Name (Surname First) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Oluwaseun Emmanuel"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* JAMB Reg Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    JAMB Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="202410884912AB"
                    value={jambRegNo}
                    onChange={(e) => setJambRegNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Faculty */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Faculty *
                  </label>
                  <select
                    value={facultyId}
                    onChange={(e) => handleFacultyChangeInForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Department *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {availableDepartments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode of Entry */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mode of Entry
                  </label>
                  <select
                    value={modeOfEntry}
                    onChange={(e) => {
                      const mode = e.target.value as 'UTME' | 'Direct Entry';
                      setModeOfEntry(mode);
                      setLevel(mode === 'Direct Entry' ? '200L' : '100L');
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="UTME">UTME (Unified Tertiary Matriculation Exam)</option>
                    <option value="Direct Entry">Direct Entry (JUPEB / IJMB / NCE / OND)</option>
                  </select>
                </div>

                {/* Academic Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Entry Level *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="100L">100 Level</option>
                    <option value="200L">200 Level</option>
                    <option value="300L">300 Level</option>
                    <option value="400L">400 Level</option>
                    <option value="500L">500 Level</option>
                  </select>
                </div>

                {/* State of Origin */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    State of Origin *
                  </label>
                  <select
                    value={stateOfOrigin}
                    onChange={(e) => setStateOfOrigin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={`${state} State`}>
                        {state} State
                      </option>
                    ))}
                  </select>
                </div>

                {/* LGA */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Local Government Area (LGA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ibadan North / Owerri North"
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@student.uninaija.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Next of Kin Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Next of Kin Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Adeleke Johnson"
                    value={nextOfKinName}
                    onChange={(e) => setNextOfKinName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Next of Kin Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Next of Kin Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 802 987 6543"
                    value={nextOfKinPhone}
                    onChange={(e) => setNextOfKinPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Campus Address / Hostel */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hostel / Residential Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 12, Independence Hall / Off-campus Bodija"
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Generate Matric No & Enroll</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
