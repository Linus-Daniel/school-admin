import React, { useState } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { CourseRegistration, Level } from '../types';
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Plus,
  BookOpen,
  User,
  Building,
  AlertTriangle,
  X,
} from 'lucide-react';

interface SemesterRegistrationProps {
  onSelectRegistration: (reg: CourseRegistration) => void;
}

export const SemesterRegistration: React.FC<SemesterRegistrationProps> = ({
  onSelectRegistration,
}) => {
  const {
    registrations,
    students,
    courses,
    approveRegistration,
    rejectRegistration,
    createCourseRegistration,
    currentSession,
    currentSemester,
  } = useUniversity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  // New Registration Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  // Reject Remark Modal
  const [rejectingRegId, setRejectingRegId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const openNewRegistrationModal = () => {
    const defaultStudent = students[0];
    if (defaultStudent) {
      setSelectedStudentId(defaultStudent.id);
      // Pre-select courses matching student department & level
      const matching = courses
        .filter(
          (c) =>
            c.departmentId === defaultStudent.departmentId ||
            c.type === 'Required' ||
            c.level === defaultStudent.level
        )
        .slice(0, 4)
        .map((c) => c.id);
      setSelectedCourseIds(matching);
    }
    setIsModalOpen(true);
  };

  const handleStudentSelect = (stuId: string) => {
    setSelectedStudentId(stuId);
    const stu = students.find((s) => s.id === stuId);
    if (stu) {
      const matching = courses
        .filter(
          (c) =>
            c.departmentId === stu.departmentId ||
            c.type === 'Required' ||
            c.level === stu.level
        )
        .slice(0, 4)
        .map((c) => c.id);
      setSelectedCourseIds(matching);
    }
  };

  const toggleCourseSelect = (cId: string) => {
    if (selectedCourseIds.includes(cId)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== cId));
    } else {
      setSelectedCourseIds([...selectedCourseIds, cId]);
    }
  };

  const totalSelectedUnits = courses
    .filter((c) => selectedCourseIds.includes(c.id))
    .reduce((sum, c) => sum + c.creditUnits, 0);

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student || selectedCourseIds.length === 0) return;

    const chosenCourses = courses
      .filter((c) => selectedCourseIds.includes(c.id))
      .map((c) => ({
        courseId: c.id,
        courseCode: c.code,
        courseTitle: c.title,
        creditUnits: c.creditUnits,
        type: c.type,
      }));

    createCourseRegistration({
      studentId: student.id,
      matricNo: student.matricNo,
      studentName: student.fullName,
      departmentName: student.departmentName,
      level: student.level,
      session: currentSession,
      semester: currentSemester,
      courses: chosenCourses,
      totalCreditUnits: totalSelectedUnits,
      status: student.feeStatus === 'Paid' ? 'Approved' : 'Pending Approval',
      courseAdviserComment:
        student.feeStatus === 'Paid'
          ? 'Cleared by Central Registry. All courses approved.'
          : 'Pending fee reconciliation before final exam clearance.',
      approvedBy: student.feeStatus === 'Paid' ? 'Central Senate Registrar' : undefined,
      approvedDate: student.feeStatus === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
    });

    setIsModalOpen(false);
  };

  const handleConfirmReject = () => {
    if (!rejectingRegId) return;
    rejectRegistration(rejectingRegId, rejectReason || 'Exceeds unit limit or missing prerequisite');
    setRejectingRegId(null);
    setRejectReason('');
  };

  // Filter registrations
  const filteredRegs = registrations.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    const matchesLevel = selectedLevel === 'ALL' || r.level === selectedLevel;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800">
              Semester Course Registrations
            </h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-[#008751] font-bold text-xs rounded-full">
              Harmattan Senate Clearances
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Departmental course adviser endorsements, credit unit limit audits (15-24 Units), and exam clearance
          </p>
        </div>

        <button
          onClick={openNewRegistrationModal}
          className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Course Registration Form</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, matric no, CRF slip no..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <select
              aria-label="Filter by Clearance Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Clearance Statuses</option>
              <option value="Approved">Approved (Cleared for Exams)</option>
              <option value="Pending Approval">Pending HOD / Adviser</option>
              <option value="Rejected">Rejected / Needs Revision</option>
            </select>
          </div>

          <div>
            <select
              aria-label="Filter by Academic Level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="ALL">All Academic Levels</option>
              <option value="100L">100 Level</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
              <option value="500L">500 Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registration Forms Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRegs.map((reg) => (
          <div
            key={reg.id}
            className="bg-white rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 p-5 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {reg.regNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {reg.session} • {reg.semester}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base mt-1.5">{reg.studentName}</h3>
                  <div className="text-xs text-slate-500 font-mono">
                    {reg.matricNo} • {reg.departmentName} ({reg.level})
                  </div>
                </div>

                <div>
                  {reg.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cleared
                    </span>
                  ) : reg.status === 'Rejected' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                    </span>
                  )}
                </div>
              </div>

              {/* Course Units Summary Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Total Registered Load:</span>
                  <span className="font-bold text-slate-800">
                    {reg.courses.length} Courses •{' '}
                    <strong className="text-emerald-900 font-mono text-sm">{reg.totalCreditUnits} Units</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Limit Compliance:</span>
                  <span className="font-semibold text-emerald-700 text-[11px]">
                    {reg.totalCreditUnits <= 24 ? 'Within NUC Limits' : 'Exceeds Max 24!'}
                  </span>
                </div>
              </div>

              {/* Registered Courses Pills */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Enrolled Course Codes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {reg.courses.map((c) => (
                    <span
                      key={c.courseId}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                      title={c.courseTitle}
                    >
                      <strong className="text-emerald-800">{c.courseCode}</strong>
                      <span className="text-[9px] text-slate-400 font-sans">({c.creditUnits}U)</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Adviser Comment */}
              {reg.courseAdviserComment && (
                <div className="text-[11px] text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-950">Adviser Remark:</span>{' '}
                  {reg.courseAdviserComment}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectRegistration(reg)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip (CRF)</span>
              </button>

              <div className="flex items-center gap-2">
                {reg.status !== 'Approved' && (
                  <button
                    onClick={() => approveRegistration(reg.id)}
                    className="px-3 py-1.5 bg-[#008751] hover:bg-[#007043] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {reg.status !== 'Rejected' && (
                  <button
                    onClick={() => setRejectingRegId(reg.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-rose-200"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {rejectingRegId && (
        <div className="fixed inset-0 bg-emerald-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base">Reject Course Registration Slip</h3>
            </div>
            <p className="text-xs text-slate-600">
              Provide instructions or prerequisite details for the student to revise their course selection.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Exceeds max 24 credit unit senate ceiling. Remove one elective."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingRegId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Course Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-100 my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#008751] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base font-crest">
                  Register Semester Courses (Course Form)
                </h3>
                <p className="text-xs text-emerald-100">
                  {currentSession} • {currentSemester}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRegistration} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Student *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.matricNo}) - {s.departmentName} - {s.level} [{s.feeStatus}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Select Courses to Register *
                  </label>
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      totalSelectedUnits > 24
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Total: {totalSelectedUnits} / 24 Units
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 p-2 space-y-1">
                  {courses.map((c) => {
                    const isSelected = selectedCourseIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleCourseSelect(c.id)}
                        className={`p-2.5 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50 border border-emerald-300' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                          />
                          <div>
                            <span className="font-mono font-bold text-emerald-900">{c.code}</span>
                            <span className="ml-2 font-medium text-slate-800">{c.title}</span>
                            <span className="block text-[10px] text-slate-400">
                              {c.departmentName} • {c.level} • {c.type}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold font-mono text-slate-700 px-2 py-0.5 bg-white rounded border border-slate-200 shrink-0">
                          {c.creditUnits} Units
                        </span>
                      </div>
                    );
                  })}
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
                  disabled={selectedCourseIds.length === 0}
                  className="px-5 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Course Form</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
