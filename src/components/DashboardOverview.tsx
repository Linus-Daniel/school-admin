import React from 'react';
import { useUniversity } from '../context/UniversityContext';
import {
  GraduationCap,
  Users2,
  BookOpen,
  CreditCard,
  FileCheck2,
  TrendingUp,
  AlertCircle,
  Building,
  ArrowUpRight,
  Printer,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { FeePayment, Student } from '../types';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
  onOpenEnrollModal: () => void;
  onOpenVerifyFeeModal: () => void;
  onSelectReceipt: (payment: FeePayment) => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onOpenEnrollModal,
  onOpenVerifyFeeModal,
  onSelectReceipt,
  onSelectStudent,
}) => {
  const {
    stats,
    students,
    payments,
    faculties,
    departments,
    currentSession,
    currentSemester,
    registrations,
    approveRegistration,
  } = useUniversity();

  const paidStudents = students.filter((s) => s.feeStatus === 'Paid').length;
  const paymentRate = students.length > 0 ? Math.round((paidStudents / students.length) * 100) : 0;

  const approvedRegs = registrations.filter((r) => r.status === 'Approved').length;
  const regRate = registrations.length > 0 ? Math.round((approvedRegs / registrations.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Institutional Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#008751] via-emerald-800 to-emerald-950 text-white p-6 md:p-8 shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <GraduationCap className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-semibold text-emerald-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Harmattan Semester Senate Executive View • {currentSession}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-crest">
            Federal University Central Senate Registry
          </h1>
          <p className="mt-2 text-sm md:text-base text-emerald-100/90 leading-relaxed">
            Administering student admissions, course allocations, Treasury Single Account (TSA) Remita tuition clearances, and departmental academic boards.
          </p>

          {/* Quick Action buttons */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenEnrollModal}
              className="px-4 py-2 bg-white text-[#008751] hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll New Student</span>
            </button>

            <button
              onClick={onOpenVerifyFeeModal}
              className="px-4 py-2 bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-400/40 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Remita RRR</span>
            </button>

            <button
              onClick={() => onNavigate('registrations')}
              className="px-4 py-2 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Course Clearances ({stats.pendingRegistrations})</span>
            </button>

            <button
              onClick={() => onNavigate('documents')}
              className="px-4 py-2 bg-emerald-900/40 hover:bg-emerald-900/80 text-emerald-100 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Enrolled Students
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalStudents}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{paidStudents} Fees Cleared</span>
            <button
              onClick={() => onNavigate('students')}
              className="text-[#008751] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Directory <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Fees Collected in ₦ */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Remita Fees Collected
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 truncate">
            <span className="text-xl md:text-2xl font-black text-slate-900">
              ₦{stats.totalFeesCollected.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-amber-700 font-medium">
              {stats.pendingClearances} Pending RRR
            </span>
            <button
              onClick={() => onNavigate('fees')}
              className="text-[#008751] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              TSA Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Faculty & Academic Staff */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Faculty & Staff
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalFacultyStaff}</span>
            <span className="text-xs font-medium text-slate-500">Academic Roster</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{departments.length} Depts Assigned</span>
            <button
              onClick={() => onNavigate('faculty-records')}
              className="text-[#008751] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Staff Roster <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Course Catalog */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Approved Courses
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.coursesOffered}</span>
            <span className="text-xs font-medium text-slate-500">Active Curriculum</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{stats.pendingRegistrations} Pending CRF</span>
            <button
              onClick={() => onNavigate('courses')}
              className="text-[#008751] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Curriculum <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics & Compliance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Faculty distribution */}
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Faculty Academic Distribution</h2>
              <p className="text-xs text-slate-500">Student enrollment and capacity by College & Faculty</p>
            </div>
            <button
              onClick={() => onNavigate('departments')}
              className="text-xs font-semibold text-[#008751] hover:underline"
            >
              Manage Faculties
            </button>
          </div>

          <div className="space-y-3.5">
            {faculties.map((fac) => {
              const facStudents = students.filter((s) => s.facultyId === fac.id).length;
              const percent = Math.min(100, Math.round((facStudents / Math.max(1, students.length)) * 100));

              return (
                <div key={fac.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{fac.name}</span>
                    <span className="text-slate-500 font-medium">
                      {facStudents} students ({percent}%) • Dean: {fac.deanName}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 to-[#008751] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-emerald-50/50 rounded-xl">
              <span className="block text-slate-500 text-[10px] uppercase font-bold">Faculties</span>
              <span className="font-bold text-emerald-900 text-sm">{faculties.length} Colleges</span>
            </div>
            <div className="p-2 bg-emerald-50/50 rounded-xl">
              <span className="block text-slate-500 text-[10px] uppercase font-bold">Departments</span>
              <span className="font-bold text-emerald-900 text-sm">{departments.length} Units</span>
            </div>
            <div className="p-2 bg-emerald-50/50 rounded-xl">
              <span className="block text-slate-500 text-[10px] uppercase font-bold">Accreditation</span>
              <span className="font-bold text-emerald-700 text-sm flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% NUC
              </span>
            </div>
          </div>
        </div>

        {/* Right: Academic Senate Calendar & Compliance */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Senate Calendar</h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-[#008751] text-[10px] font-bold rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Course Registration Deadline</div>
                  <div className="text-[11px] text-slate-500">October 15, 2024 • Late fee applies after</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Senate Matriculation Ceremony</div>
                  <div className="text-[11px] text-slate-500">Convocation Amphitheatre (100L Freshmen)</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Remita TSA Reconciliation</div>
                  <div className="text-[11px] text-slate-500">Daily midnight settlement with CBN portal</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-emerald-950 text-white rounded-xl text-xs">
            <div className="flex items-center justify-between font-bold mb-1">
              <span>Fees Compliance Rate</span>
              <span className="text-emerald-300">{paymentRate}%</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-800 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${paymentRate}%` }} />
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Students must complete fees payment prior to course registration endorsement.
            </p>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Remita Fees & Recent Course Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Fees Transactions with Remita RRR */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-base font-bold text-slate-800">Recent Remita RRR Payments</h2>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-[#008751] hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="pb-2.5">Student / Matric</th>
                  <th className="pb-2.5">RRR Number</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 pr-2">
                      <div className="font-bold text-slate-800">{pay.studentName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{pay.matricNo}</div>
                    </td>
                    <td className="py-2.5 pr-2 font-mono text-[11px] text-emerald-800 font-bold">
                      {pay.rrr}
                    </td>
                    <td className="py-2.5 pr-2 font-bold text-slate-800">
                      ₦{pay.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-2">
                      {pay.status === 'Successful' ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onSelectReceipt(pay)}
                        className="px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                        title="View Official Remita e-Receipt"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Semester Course Registrations */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-base font-bold text-slate-800">Semester Course Form Clearances</h2>
            </div>
            <button
              onClick={() => onNavigate('registrations')}
              className="text-xs font-semibold text-[#008751] hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {registrations.slice(0, 4).map((reg) => (
              <div
                key={reg.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800">{reg.studentName}</div>
                  <div className="text-[11px] text-slate-500">
                    {reg.matricNo} • {reg.departmentName} ({reg.level})
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                    {reg.courses.length} Courses ({reg.totalCreditUnits} Units registered)
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {reg.status === 'Approved' ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => approveRegistration(reg.id)}
                      className="px-2.5 py-1 bg-[#008751] hover:bg-[#007043] text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Approve CRF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Regulation: Max 24 Units per semester</span>
            <span className="text-emerald-700 font-bold">{regRate}% Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
