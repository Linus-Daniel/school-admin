import React from 'react';
import { Student } from '../types';
import { useUniversity } from '../context/UniversityContext';
import { UniversityCrest, NigerianFlagBadge } from './UniversityCrest';
import {
  X,
  Printer,
  IdCard,
  CreditCard,
  BookOpen,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onPrintIdCard: (student: Student) => void;
  onPrintCourseSlip: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onPrintIdCard,
  onPrintCourseSlip,
}) => {
  const { payments, registrations } = useUniversity();

  if (!student) return null;

  const studentPayments = payments.filter((p) => p.studentId === student.id);
  const studentRegs = registrations.filter((r) => r.studentId === student.id);

  const getClassOfDegree = (cgpa: number) => {
    if (cgpa >= 4.5) return { label: 'First Class Honours', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (cgpa >= 3.5) return { label: 'Second Class Honours (Upper Division)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (cgpa >= 2.4) return { label: 'Second Class Honours (Lower Division)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (cgpa >= 1.5) return { label: 'Third Class Honours', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Pass / Probation', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const degreeClass = getClassOfDegree(student.cgpa);

  return (
    <div className="fixed inset-0 bg-emerald-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-emerald-100 my-6 overflow-hidden animate-in fade-in zoom-in-95">
        {/* University Header Banner */}
        <div className="bg-linear-to-r from-[#008751] via-emerald-800 to-emerald-950 text-white p-5 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl shadow-md">
                <UniversityCrest size="md" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <NigerianFlagBadge />
                  <span className="text-[11px] font-bold tracking-widest text-emerald-200 uppercase">
                    Federal University of Technology & Sciences
                  </span>
                </div>
                <h2 className="text-lg font-black font-crest text-white">
                  Student Academic Dossier & Senate Record
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Profile Ribbon */}
          <div className="mt-5 pt-4 border-t border-emerald-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/80 shadow-md bg-white"
              />
              <div>
                <h3 className="text-lg font-extrabold text-white">{student.fullName}</h3>
                <div className="flex items-center gap-2 text-xs text-emerald-200 font-mono mt-0.5">
                  <span className="bg-white/20 px-2 py-0.5 rounded font-bold text-white">
                    {student.matricNo}
                  </span>
                  <span>•</span>
                  <span>JAMB: {student.jambRegNo}</span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-1">
                  {student.departmentName} • {student.level} ({student.facultyName})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPrintIdCard(student)}
                className="px-3 py-1.5 bg-white text-[#008751] hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <IdCard className="w-4 h-4" />
                <span>Print ID Card</span>
              </button>
              <button
                onClick={() => onPrintCourseSlip(student)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-emerald-400/30"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Course Slip</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-200px)] overflow-y-auto">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Cumulative GPA</span>
              <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">
                {student.cgpa > 0 ? student.cgpa.toFixed(2) : '100L Freshman'}
              </div>
              <span className="text-[9px] text-slate-500">Scale of 5.00</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Class Standing</span>
              <div className="mt-1">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${degreeClass.color}`}>
                  {degreeClass.label}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Remita Fee Status</span>
              <div className="mt-1">
                {student.feeStatus === 'Paid' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    <Clock className="w-3 h-3 text-amber-600" /> {student.feeStatus}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Admission Mode</span>
              <div className="text-sm font-bold text-slate-800 mt-1">{student.modeOfEntry}</div>
              <span className="text-[9px] text-slate-500">Year {student.admissionYear}</span>
            </div>
          </div>

          {/* Bio Data & Demographics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bio-Data & Demographic Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">State of Origin & LGA:</span>
                <span className="font-bold text-slate-800">
                  {student.stateOfOrigin} • {student.lga} LGA
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email Address:</span>
                <span className="font-bold text-slate-800">{student.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Telephone Contact:</span>
                <span className="font-bold text-slate-800">{student.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Current Hall / Address:</span>
                <span className="font-bold text-slate-800">{student.currentAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Next of Kin / Sponsor:</span>
                <span className="font-bold text-slate-800">{student.nextOfKinName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Next of Kin Phone:</span>
                <span className="font-bold text-slate-800">{student.nextOfKinPhone}</span>
              </div>
            </div>
          </div>

          {/* School Fees & Remita Record */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              <span>Treasury Single Account (Remita RRR) Payments</span>
            </h4>
            {studentPayments.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                No fee payment records found for this student. Student owes tuition for the active session.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Remita RRR</th>
                      <th className="py-2.5 px-3">Session & Semester</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Channel</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{p.rrr}</td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {p.session} • {p.semester}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          ₦{p.amount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{p.paymentChannel}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Registered Semester Courses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Registered Courses & Departmental Endorsements</span>
            </h4>
            {studentRegs.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                No active semester course forms submitted yet for {student.level}.
              </div>
            ) : (
              studentRegs.map((reg) => (
                <div key={reg.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 font-mono">{reg.regNumber}</span>
                      <span className="text-slate-500 ml-2">
                        {reg.session} • {reg.semester}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      {reg.status} ({reg.totalCreditUnits} Units)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {reg.courses.map((c) => (
                      <div
                        key={c.courseId}
                        className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono font-bold text-emerald-800">{c.courseCode}</span>
                          <span className="block text-[11px] text-slate-600 truncate max-w-[200px]">
                            {c.courseTitle}
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                          {c.creditUnits} Units
                        </span>
                      </div>
                    ))}
                  </div>

                  {reg.courseAdviserComment && (
                    <div className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200">
                      <strong>Course Adviser Endorsement:</strong> "{reg.courseAdviserComment}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-medium">
            Senate Registry Record • Verified by Registrar
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
