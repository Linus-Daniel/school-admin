import React from 'react';
import { CourseRegistration, Student } from '../types';
import { UniversityCrest, NigerianFlagBadge } from './UniversityCrest';
import { Printer, X, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { useUniversity } from '../context/UniversityContext';

interface CourseFormModalProps {
  registration: CourseRegistration | null;
  onClose: () => void;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({ registration, onClose }) => {
  const { students } = useUniversity();

  if (!registration) return null;

  const student = students.find((s) => s.id === registration.studentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 my-6 overflow-hidden animate-in fade-in zoom-in-95 print-container">
        {/* Top bar (No Print) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Official Semester Course Registration Slip (CRF)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#008751] hover:bg-[#007043] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Course Form</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Course Form Body */}
        <div className="p-8 bg-white text-slate-900 relative">
          {/* Official University Header */}
          <div className="border-b-2 border-emerald-800 pb-4 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <UniversityCrest size="lg" />
              <div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-[#008751] uppercase">
                  <NigerianFlagBadge />
                  <span>Federal Republic of Nigeria</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black font-crest text-emerald-950 leading-tight">
                  FEDERAL UNIVERSITY OF TECHNOLOGY & SCIENCES
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  Office of the Academic Registrar • Senate Secretariat
                </p>
                <div className="inline-block mt-1 px-3 py-0.5 bg-emerald-900 text-white rounded text-[11px] font-bold uppercase tracking-wider">
                  STUDENT COURSE REGISTRATION FORM (CRF)
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-700 mt-2">
              ACADEMIC SESSION: <span className="text-emerald-900">{registration.session}</span> • SEMESTER:{' '}
              <span className="text-emerald-900 uppercase">{registration.semester}</span>
            </div>
          </div>

          {/* Student Dossier Strip */}
          <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs flex-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Full Name:</span>
                <span className="font-extrabold text-slate-900">{registration.studentName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Matriculation No:</span>
                <span className="font-mono font-bold text-emerald-900">{registration.matricNo}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Department:</span>
                <span className="font-semibold text-slate-800">{registration.departmentName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Level:</span>
                <span className="font-bold text-slate-800">{registration.level}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Form Serial Ref:</span>
                <span className="font-mono font-bold text-slate-700">{registration.regNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Senate Clearance Status:</span>
                <span className="font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {registration.status}
                </span>
              </div>
            </div>

            {/* Passport Photo */}
            <div className="shrink-0 text-center">
              <img
                src={
                  student?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={registration.studentName}
                className="w-20 h-24 object-cover border-2 border-slate-300 rounded shadow-xs bg-slate-100"
              />
              <span className="block text-[8px] font-mono text-slate-400 mt-1 uppercase">Official Photo</span>
            </div>
          </div>

          {/* Registered Courses Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden mb-5">
            <thead className="bg-emerald-950/5 border-b border-slate-200 text-slate-800 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">S/N</th>
                <th className="py-2.5 px-3">Course Code</th>
                <th className="py-2.5 px-3">Course Title</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registration.courses.map((c, idx) => (
                <tr key={c.courseId} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{c.courseCode}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{c.courseTitle}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                      {c.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {c.creditUnits}
                  </td>
                </tr>
              ))}
              {/* Total Units Summary */}
              <tr className="bg-emerald-50/80 font-black border-t-2 border-emerald-800 text-slate-900">
                <td colSpan={4} className="py-3 px-3 uppercase text-emerald-950">
                  Total Registered Credit Units (NUC Limit: Min 15 - Max 24 Units)
                </td>
                <td className="py-3 px-3 text-right text-base text-emerald-950 font-mono">
                  {registration.totalCreditUnits} Units
                </td>
              </tr>
            </tbody>
          </table>

          {/* Endorsement Comments */}
          {registration.courseAdviserComment && (
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
              <strong className="text-slate-900">Departmental Senate Remark:</strong>{' '}
              {registration.courseAdviserComment}
            </div>
          )}

          {/* Signatures Grid */}
          <div className="pt-4 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-slate-800 font-bold">{registration.studentName}</span>
              </div>
              <div className="border-t border-slate-800 pt-1">
                <span className="font-bold text-slate-700 block">Student's Signature</span>
                <span className="text-[10px] text-slate-400">Date: {registration.submissionDate}</span>
              </div>
            </div>

            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-emerald-900 font-bold">
                  {registration.approvedBy || 'Course Adviser Endorsed'}
                </span>
              </div>
              <div className="border-t border-slate-800 pt-1">
                <span className="font-bold text-slate-700 block">Course Adviser / HOD</span>
                <span className="text-[10px] text-slate-400">Date: {registration.approvedDate || 'Pending'}</span>
              </div>
            </div>

            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-slate-800 font-bold">Dr. Funmilayo Adeyemi</span>
              </div>
              <div className="border-t border-slate-800 pt-1">
                <span className="font-bold text-slate-700 block">Academic Registrar</span>
                <span className="text-[10px] text-slate-400">Senate Examination Seal</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-[9px] text-slate-400 border-t border-dashed border-slate-200 pt-2">
            Notice: No student shall be admitted to any semester examination without presenting this stamped and endorsed Course Registration Slip.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between no-print">
          <span className="text-[11px] text-slate-500">Official Senate Examination Docket</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Form</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
