import React, { useState, useEffect } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { Student, Course, Staff, FeePayment } from '../types';
import {
  Search,
  X,
  GraduationCap,
  BookOpen,
  Users2,
  CreditCard,
  Building,
  ArrowRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
  onSelectReceipt: (payment: FeePayment) => void;
  onNavigateTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  onSelectReceipt,
  onNavigateTab,
}) => {
  const { students, courses, staff, payments, departments } = useUniversity();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedStudents = q
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.matricNo.toLowerCase().includes(q) ||
          s.jambRegNo.toLowerCase().includes(q)
      )
    : [];

  const matchedCourses = q
    ? courses.filter(
        (c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
      )
    : [];

  const matchedStaff = q
    ? staff.filter(
        (st) => st.fullName.toLowerCase().includes(q) || st.staffId.toLowerCase().includes(q)
      )
    : [];

  const matchedPayments = q
    ? payments.filter(
        (p) =>
          p.rrr.replace(/[\s-]/g, '').includes(q.replace(/[\s-]/g, '')) ||
          p.studentName.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchedStudents.length + matchedCourses.length + matchedStaff.length + matchedPayments.length;

  return (
    <div className="fixed inset-0 bg-emerald-950/70 z-50 flex items-start justify-center pt-20 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-700 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search student matric, staff ID, course code (e.g. CSC 201), Remita RRR..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400">
              <p className="font-semibold text-slate-500">Global University Directory Query</p>
              <p className="text-[11px] mt-1">
                Type a matriculation number, student name, staff ID, Remita RRR, or course code
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No university records match "<strong className="text-slate-700">{query}</strong>"
            </div>
          ) : (
            <div className="space-y-4">
              {/* Students */}
              {matchedStudents.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Students ({matchedStudents.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedStudents.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onSelectStudent(s);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.avatarUrl}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-emerald-800">
                              {s.fullName}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-2 font-mono">
                              {s.matricNo}
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              {s.departmentName} • {s.level}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {matchedCourses.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Courses ({matchedCourses.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedCourses.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigateTab('courses');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <span className="font-mono font-bold text-emerald-800">{c.code}</span>
                          <span className="font-semibold text-slate-800 ml-2">{c.title}</span>
                          <span className="block text-[10px] text-slate-500">
                            {c.departmentName} • {c.creditUnits} Units • {c.lecturerInCharge}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff */}
              {matchedStaff.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Academic Staff ({matchedStaff.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedStaff.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => {
                          onNavigateTab('faculty-records');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{st.fullName}</span>
                          <span className="text-[11px] font-mono text-emerald-800 ml-2">
                            {st.staffId}
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            {st.rank} • {st.departmentName} ({st.role})
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments */}
              {matchedPayments.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Remita Payments ({matchedPayments.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedPayments.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectReceipt(p);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <span className="font-mono font-bold text-emerald-800">{p.rrr}</span>
                          <span className="text-slate-800 font-bold ml-2">
                            ₦{p.amount.toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            {p.studentName} ({p.matricNo}) • {p.status}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold text-[10px]">
                          View Receipt
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
