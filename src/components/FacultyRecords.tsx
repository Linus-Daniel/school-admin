import React, { useState } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { Staff, StaffRank } from '../types';
import {
  Users2,
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  Award,
  BookOpen,
  Phone,
  Mail,
  GraduationCap,
  Building,
  CheckCircle2,
  X,
  ShieldAlert,
} from 'lucide-react';

export const FacultyRecords: React.FC = () => {
  const { staff, departments, faculties, addStaff, updateStaff, deleteStaff } = useUniversity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedRank, setSelectedRank] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [rank, setRank] = useState<StaffRank>('Senior Lecturer');
  const [role, setRole] = useState<'Lecturer' | 'HOD' | 'Dean' | 'Course Adviser'>('Lecturer');
  const [facultyId, setFacultyId] = useState(faculties[0]?.id || '');
  const [departmentId, setDepartmentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [status, setStatus] = useState<'Active' | 'On Sabbatical' | 'Study Leave' | 'Retired'>('Active');
  const [qualificationsInput, setQualificationsInput] = useState('B.Sc, M.Sc, Ph.D');
  const [coursesInput, setCoursesInput] = useState('');

  const openAddModal = () => {
    setEditingStaff(null);
    const initialFac = faculties[0]?.id || '';
    setFacultyId(initialFac);
    const depts = departments.filter((d) => d.facultyId === initialFac);
    setDepartmentId(depts[0]?.id || '');
    setFullName('');
    setStaffId(`FU/ACAD/${depts[0]?.code || 'SCI'}/${Math.floor(100 + Math.random() * 900)}`);
    setRank('Senior Lecturer');
    setRole('Lecturer');
    setEmail('');
    setPhone('+234 80');
    setStatus('Active');
    setQualificationsInput('B.Sc, M.Sc, Ph.D');
    setCoursesInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (st: Staff) => {
    setEditingStaff(st);
    setFullName(st.fullName);
    setStaffId(st.staffId);
    setRank(st.rank);
    setRole(st.role);
    setFacultyId(st.facultyId);
    setDepartmentId(st.departmentId);
    setEmail(st.email);
    setPhone(st.phone);
    setStatus(st.status);
    setQualificationsInput(st.qualifications.join(', '));
    setCoursesInput(st.coursesAssigned.join(', '));
    setIsModalOpen(true);
  };

  const handleFacultyChangeInForm = (facId: string) => {
    setFacultyId(facId);
    const depts = departments.filter((d) => d.facultyId === facId);
    if (depts.length > 0) {
      setDepartmentId(depts[0].id);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fac = faculties.find((f) => f.id === facultyId);
    const dept = departments.find((d) => d.id === departmentId);

    const qualifications = qualificationsInput
      .split(',')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    const coursesAssigned = coursesInput
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length > 0);

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        fullName,
        staffId,
        rank,
        role,
        facultyId,
        facultyName: fac?.name || editingStaff.facultyName,
        departmentId,
        departmentName: dept?.name || editingStaff.departmentName,
        email,
        phone,
        status,
        qualifications,
        coursesAssigned,
      });
    } else {
      addStaff({
        fullName,
        staffId,
        rank,
        role,
        facultyId: fac?.id || 'fac-sci',
        facultyName: fac?.name || 'Faculty of Science',
        departmentId: dept?.id || 'dept-csc',
        departmentName: dept?.name || 'Computer Science',
        email: email || `${fullName.toLowerCase().replace(/[^a-z]/g, '.')}@uninaija.edu.ng`,
        phone: phone || '+234 803 000 0000',
        status,
        qualifications,
        coursesAssigned,
        hireYear: new Date().getFullYear(),
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });
    }

    setIsModalOpen(false);
  };

  // Filter staff
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFaculty = selectedFaculty === 'ALL' || s.facultyId === selectedFaculty;
    const matchesRank = selectedRank === 'ALL' || s.rank === selectedRank;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

    return matchesSearch && matchesFaculty && matchesRank && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800">Faculty & Academic Staff Records</h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-[#008751] font-bold text-xs rounded-full">
              {staff.length} Academic Staff
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Professorial chairs, senior lecturers, HOD appointments & academic workload allocations
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Academic Staff</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name, ID, department..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Faculty */}
          <div>
            <select
              aria-label="Filter by Faculty"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Faculties</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rank */}
          <div>
            <select
              aria-label="Filter by Academic Rank"
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Academic Ranks</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor (Reader)">Associate Professor (Reader)</option>
              <option value="Senior Lecturer">Senior Lecturer</option>
              <option value="Lecturer I">Lecturer I</option>
              <option value="Lecturer II">Lecturer II</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              aria-label="Filter by Staff Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active On Campus</option>
              <option value="On Sabbatical">On Sabbatical</option>
              <option value="Study Leave">Study Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((st) => (
          <div
            key={st.id}
            className="bg-white rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 p-5 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Header: Photo & Title */}
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={st.avatarUrl}
                  alt={st.fullName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {st.rank}
                    </span>
                    {st.role !== 'Lecturer' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-900">
                        {st.role}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm mt-1 leading-snug truncate">
                    {st.fullName}
                  </h3>
                  <div className="text-[11px] font-mono text-emerald-800 font-bold">
                    {st.staffId}
                  </div>
                </div>
              </div>

              {/* Department & Faculty */}
              <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">
                    {st.departmentName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-600">{st.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-600">{st.phone}</span>
                </div>
              </div>

              {/* Qualifications */}
              <div className="mt-3 text-[11px] text-slate-600">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Credentials & Degrees:
                </span>
                <div className="flex flex-wrap gap-1">
                  {st.qualifications.map((q, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-700"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Courses */}
              {st.coursesAssigned.length > 0 && (
                <div className="mt-3 text-[11px]">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Assigned Teaching Load:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {st.coursesAssigned.map((code) => (
                      <span
                        key={code}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-mono font-bold"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  st.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {st.status}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(st)}
                  className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit Staff Record"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Remove staff record for ${st.fullName}?`)) {
                      deleteStaff(st.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-100 my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#008751] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base font-crest">
                  {editingStaff ? `Edit Staff: ${editingStaff.fullName}` : 'Register Academic Staff Member'}
                </h3>
                <p className="text-xs text-emerald-100">Senate Registry & Human Resources Academic File</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Staff Full Name (with Titles) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Babatunde A. Sanusi (FAS)"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Staff ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Staff ID Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="FU/ACAD/SCI/044"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Rank */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Academic Rank *
                  </label>
                  <select
                    value={rank}
                    onChange={(e) => setRank(e.target.value as StaffRank)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor (Reader)">Associate Professor (Reader)</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="Lecturer I">Lecturer I</option>
                    <option value="Lecturer II">Lecturer II</option>
                    <option value="Assistant Lecturer">Assistant Lecturer</option>
                    <option value="Graduate Assistant">Graduate Assistant</option>
                  </select>
                </div>

                {/* Administrative Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Administrative Designation
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Lecturer">Academic Staff (Lecturer)</option>
                    <option value="HOD">Head of Department (HOD)</option>
                    <option value="Dean">Dean of Faculty</option>
                    <option value="Course Adviser">Departmental Course Adviser</option>
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
                    Primary Department *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {departments
                      .filter((d) => d.facultyId === facultyId)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Duty Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Sabbatical">On Sabbatical</option>
                    <option value="Study Leave">Study Leave</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@uninaija.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Telephone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Qualifications */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Academic Qualifications (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Sc (Ife), M.Sc (London), Ph.D (UNILAG)"
                    value={qualificationsInput}
                    onChange={(e) => setQualificationsInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Courses Assigned */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Courses Assigned (comma separated codes)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSC 201, CSC 401"
                    value={coursesInput}
                    onChange={(e) => setCoursesInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
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
                  <span>{editingStaff ? 'Update Staff Record' : 'Enroll Staff Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
