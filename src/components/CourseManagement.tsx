import React, { useState } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { Course, Level, Semester } from '../types';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Users,
  MapPin,
  Clock,
  Layers,
  CheckCircle2,
  X,
  GraduationCap,
} from 'lucide-react';

export const CourseManagement: React.FC = () => {
  const { courses, departments, faculties, staff, addCourse, updateCourse, deleteCourse } = useUniversity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [creditUnits, setCreditUnits] = useState(3);
  const [level, setLevel] = useState<Level>('100L');
  const [semester, setSemester] = useState<Semester>('First Semester');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [type, setType] = useState<'Compulsory' | 'Required' | 'Elective'>('Compulsory');
  const [lecturerStaffId, setLecturerStaffId] = useState('');
  const [venue, setVenue] = useState('Faculty Lecture Theatre');
  const [schedule, setSchedule] = useState('Mon 10:00 AM - 12:00 PM');
  const [capacity, setCapacity] = useState(150);
  const [prereqInput, setPrereqInput] = useState('');

  const openAddModal = () => {
    setEditingCourse(null);
    setCode('');
    setTitle('');
    setCreditUnits(3);
    setLevel('100L');
    setSemester('First Semester');
    setDepartmentId(departments[0]?.id || '');
    setType('Compulsory');
    setLecturerStaffId(staff[0]?.staffId || '');
    setVenue('Faculty Lecture Theatre A');
    setSchedule('Mon 10:00 AM - 12:00 PM');
    setCapacity(150);
    setPrereqInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setCode(c.code);
    setTitle(c.title);
    setCreditUnits(c.creditUnits);
    setLevel(c.level);
    setSemester(c.semester);
    setDepartmentId(c.departmentId);
    setType(c.type);
    setLecturerStaffId(c.lecturerStaffId);
    setVenue(c.venue);
    setSchedule(c.schedule);
    setCapacity(c.capacity);
    setPrereqInput(c.prerequisites.join(', '));
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dept = departments.find((d) => d.id === departmentId);
    const assignedStaff = staff.find((s) => s.staffId === lecturerStaffId);

    const prerequisites = prereqInput
      .split(',')
      .map((p) => p.trim().toUpperCase())
      .filter((p) => p.length > 0);

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        code: code.toUpperCase(),
        title,
        creditUnits,
        level,
        semester,
        departmentId,
        departmentName: dept?.name || editingCourse.departmentName,
        facultyName: dept?.facultyName || editingCourse.facultyName,
        type,
        lecturerInCharge: assignedStaff?.fullName || editingCourse.lecturerInCharge,
        lecturerStaffId: assignedStaff?.staffId || editingCourse.lecturerStaffId,
        venue,
        schedule,
        capacity,
        prerequisites,
      });
    } else {
      addCourse({
        code: code.toUpperCase(),
        title,
        creditUnits,
        level,
        semester,
        departmentId: dept?.id || '',
        departmentName: dept?.name || 'General Studies',
        facultyName: dept?.facultyName || 'Central Senate',
        type,
        lecturerInCharge: assignedStaff?.fullName || 'Academic Staff',
        lecturerStaffId: assignedStaff?.staffId || 'STAFF/001',
        venue,
        schedule,
        capacity,
        prerequisites,
      });
    }

    setIsModalOpen(false);
  };

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lecturerInCharge.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || c.departmentId === selectedDept;
    const matchesLevel = selectedLevel === 'ALL' || c.level === selectedLevel;
    const matchesSemester = selectedSemester === 'ALL' || c.semester === selectedSemester;

    return matchesSearch && matchesDept && matchesLevel && matchesSemester;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800">University Course Management</h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-[#008751] font-bold text-xs rounded-full">
              {courses.length} Active Courses
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Senate approved curriculum, credit unit allocations, prerequisite maps & lecture timetables
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
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
              placeholder="Search code (CSC 201), title, lecturer..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Department */}
          <div>
            <select
              aria-label="Filter by Academic Department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <select
              aria-label="Filter by Level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Levels</option>
              <option value="100L">100 Level</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
              <option value="500L">500 Level</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <select
              aria-label="Filter by Semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Semesters</option>
              <option value="First Semester">First Semester (Harmattan)</option>
              <option value="Second Semester">Second Semester (Rain)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 p-5 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Top tag & units */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-base font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {c.code}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {c.creditUnits} Units
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.type === 'Compulsory'
                        ? 'bg-rose-100 text-rose-800'
                        : c.type === 'Required'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {c.type}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                {c.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                {c.departmentName} • {c.level} • {c.semester}
              </p>

              {/* Lecturer in charge */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{c.lecturerInCharge}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{c.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{c.schedule}</span>
                </div>
              </div>

              {/* Prerequisites */}
              {c.prerequisites.length > 0 && (
                <div className="mt-2 text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                  Prerequisites: <span className="font-bold">{c.prerequisites.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions & Capacity */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {c.enrolledStudentsCount} / {c.capacity} Students
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit Course"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete course ${c.code} (${c.title}) from curriculum?`)) {
                      deleteCourse(c.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-100 my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#008751] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base font-crest">
                  {editingCourse ? `Edit Course: ${editingCourse.code}` : 'Add Course to Curriculum'}
                </h3>
                <p className="text-xs text-emerald-100">National Universities Commission (NUC) BMAS Catalog</p>
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
                {/* Course Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Course Code (e.g. CSC 305) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CSC 305"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Credit Units */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Credit Units (1 - 6) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={creditUnits}
                    onChange={(e) => setCreditUnits(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operating Systems & System Programming"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Host Department *
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Status / Category *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'Compulsory' | 'Required' | 'Elective')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Compulsory">Compulsory (Core)</option>
                    <option value="Required">Required (Faculty)</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Level *</label>
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

                {/* Semester */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Semester *</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as Semester)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="First Semester">First Semester (Harmattan)</option>
                    <option value="Second Semester">Second Semester (Rain)</option>
                  </select>
                </div>

                {/* Lecturer in charge */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lecturer in Charge *
                  </label>
                  <select
                    value={lecturerStaffId}
                    onChange={(e) => setLecturerStaffId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.staffId}>
                        {s.fullName} ({s.rank} - {s.departmentName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lecture Hall / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ETF 500-Seater Auditorium"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Weekly Schedule
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mon 9:00 AM - 11:00 AM"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Prerequisites */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Prerequisites (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSC 101, MTH 101"
                    value={prereqInput}
                    onChange={(e) => setPrereqInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hall Capacity
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={2500}
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 50)}
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
                  <span>{editingCourse ? 'Save Changes' : 'Add to Curriculum'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
