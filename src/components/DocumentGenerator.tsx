import React, { useState } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { Student, FeePayment, CourseRegistration } from '../types';
import { UniversityCrest, NigerianFlagBadge } from './UniversityCrest';
import {
  Printer,
  IdCard,
  CreditCard,
  FileCheck2,
  Award,
  Search,
  CheckCircle2,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface DocumentGeneratorProps {
  onSelectReceipt: (payment: FeePayment) => void;
  onSelectCourseSlip: (registration: CourseRegistration) => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  onSelectReceipt,
  onSelectCourseSlip,
}) => {
  const { students, payments, registrations, currentSession } = useUniversity();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [activeDocType, setActiveDocType] = useState<'idcard' | 'clearance'>('idcard');

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header (No print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800">
              Official University Document & ID Card Center
            </h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-[#008751] font-bold text-xs rounded-full">
              Senate Print Depot
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate and print verified student plastic ID cards, Senate academic clearances & dossiers
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Current Document</span>
        </button>
      </div>

      {/* Selector Controls (No print) */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-4 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Select Student to Generate For:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-800 font-semibold"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.matricNo}) • {s.departmentName} - {s.level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Select Document Format:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveDocType('idcard')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeDocType === 'idcard'
                    ? 'bg-[#008751] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <IdCard className="w-4 h-4" />
                <span>Student ID Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDocType('clearance')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeDocType === 'clearance'
                    ? 'bg-[#008751] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Senate Clearance</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Document */}
      {selectedStudent && (
        <div>
          {activeDocType === 'idcard' ? (
            /* Student Plastic Identity Card (Front & Back Preview) */
            <div className="flex flex-col items-center justify-center py-6 gap-8">
              <div className="text-center no-print">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Standard CR80 Smart ID Card Layout (85.6mm × 53.98mm)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct thermal dye sublimation print ready
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 print-container">
                {/* ID CARD FRONT */}
                <div className="w-[340px] sm:w-[380px] h-[230px] sm:h-[245px] bg-white rounded-2xl shadow-xl border-2 border-emerald-700 overflow-hidden relative flex flex-col justify-between select-none">
                  {/* Card Header */}
                  <div className="bg-[#008751] text-white px-3.5 py-2 flex items-center gap-2.5 border-b-2 border-amber-400">
                    <div className="bg-white p-0.5 rounded shadow-xs">
                      <UniversityCrest size="sm" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] sm:text-[11px] font-extrabold font-crest tracking-wider uppercase truncate leading-tight">
                        Federal University of Technology & Sciences
                      </h4>
                      <p className="text-[8px] text-emerald-100 uppercase tracking-widest font-semibold">
                        Undergraduate Student Identity Card
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-3.5 py-2 flex items-start gap-3 flex-1">
                    <div className="shrink-0 text-center">
                      <img
                        src={selectedStudent.avatarUrl}
                        alt={selectedStudent.fullName}
                        className="w-18 h-22 object-cover rounded-lg border-2 border-emerald-600 shadow-xs bg-slate-100"
                      />
                      <span className="inline-block mt-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-900 font-bold text-[8px] rounded uppercase">
                        {selectedStudent.level}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div>
                        <span className="text-[8px] uppercase font-bold text-slate-400 block">Name:</span>
                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                          {selectedStudent.fullName}
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] uppercase font-bold text-slate-400 block">Matric No:</span>
                        <div className="font-mono font-black text-emerald-900 text-xs tracking-wider">
                          {selectedStudent.matricNo}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[9px]">
                        <div>
                          <span className="text-[7.5px] uppercase font-bold text-slate-400 block">Faculty:</span>
                          <span className="font-semibold text-slate-700 truncate block">
                            {selectedStudent.facultyName.replace('Faculty of ', '')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[7.5px] uppercase font-bold text-slate-400 block">Department:</span>
                          <span className="font-semibold text-slate-700 truncate block">
                            {selectedStudent.departmentName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[8px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Sex: <strong className="text-slate-800">{selectedStudent.gender[0]}</strong></span>
                        <span>Blood: <strong className="text-slate-800">O+</strong></span>
                        <span>Expires: <strong className="text-slate-800">12/2026</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Barcode & Republic Ribbon */}
                  <div className="bg-emerald-950 px-3 py-1 flex items-center justify-between text-[8px] text-emerald-200">
                    <div className="flex items-center gap-1">
                      <NigerianFlagBadge />
                      <span className="font-bold tracking-wider">NIGERIA</span>
                    </div>
                    {/* Simulated barcode */}
                    <div className="font-mono text-[7px] tracking-widest bg-white/20 px-2 py-0.5 rounded text-white">
                      ||| | |||| | ||| |||| ||
                    </div>
                  </div>
                </div>

                {/* ID CARD BACK */}
                <div className="w-[340px] sm:w-[380px] h-[230px] sm:h-[245px] bg-slate-50 rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden relative flex flex-col justify-between p-3.5 select-none text-[8.5px] text-slate-600">
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-900 uppercase text-[9px] border-b border-slate-200 pb-1 flex items-center justify-between">
                      <span>Conditions of Card Issuance</span>
                      <span className="text-emerald-800 font-crest">FUTS IBADAN</span>
                    </div>
                    <p className="leading-tight">
                      1. This identity card remains the exclusive property of Federal University of Technology & Sciences, Ibadan, Nigeria.
                    </p>
                    <p className="leading-tight">
                      2. If found, please return to the Office of the Dean of Student Affairs or the nearest Police Station.
                    </p>
                    <p className="leading-tight">
                      3. Must be displayed on campus premises and during all Senate semester examinations.
                    </p>
                  </div>

                  {/* Magnetic strip representation */}
                  <div className="w-full h-7 bg-slate-900 rounded my-1 flex items-center justify-center">
                    <span className="text-[7px] font-mono text-slate-400">HIGH-COERCIVITY MAGNETIC ENCODED STRIP</span>
                  </div>

                  {/* Signature block */}
                  <div className="pt-1 border-t border-slate-200 flex items-end justify-between">
                    <div>
                      <span className="block text-[7px] text-slate-400 uppercase font-bold">Emergency Contact:</span>
                      <span className="font-bold text-slate-800 text-[8px]">{selectedStudent.nextOfKinPhone}</span>
                    </div>

                    <div className="text-center">
                      <div className="font-serif italic text-emerald-950 font-bold text-[10px]">
                        Dr. Funmilayo Adeyemi
                      </div>
                      <div className="border-t border-slate-700 w-28 text-[7px] uppercase font-bold text-slate-700 pt-0.5">
                        Registrar & Secretary to Senate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Senate Clearance Certificate */
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-3xl mx-auto print-container">
              <div className="text-center border-b-2 border-emerald-800 pb-5">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <UniversityCrest size="lg" />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-[#008751] uppercase">
                  <NigerianFlagBadge />
                  <span>Federal Republic of Nigeria</span>
                </div>
                <h2 className="text-2xl font-black font-crest text-emerald-950">
                  FEDERAL UNIVERSITY OF TECHNOLOGY & SCIENCES
                </h2>
                <p className="text-xs text-slate-600">Office of the Registrar • Senate Secretariat</p>
                <div className="inline-block mt-3 px-4 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs uppercase tracking-wider">
                  SENATE ACADEMIC CLEARANCE & ADMISSION ATTESTATION
                </div>
              </div>

              <div className="my-6 space-y-4 text-xs leading-relaxed text-slate-800">
                <p>
                  This is to officially certify that <strong className="text-slate-950 uppercase">{selectedStudent.fullName}</strong>, with Matriculation Number{' '}
                  <strong className="text-emerald-900 font-mono">{selectedStudent.matricNo}</strong> and JAMB Registration Number{' '}
                  <strong className="text-slate-900 font-mono">{selectedStudent.jambRegNo}</strong>, is a bonafide undergraduate student of this University.
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">College & Faculty:</span>
                    <span className="font-bold text-slate-900">{selectedStudent.facultyName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Department:</span>
                    <span className="font-bold text-slate-900">{selectedStudent.departmentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Standing:</span>
                    <span className="font-bold text-slate-900">{selectedStudent.level} (Academic Session {currentSession})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">School Fees Status:</span>
                    <span className="font-bold text-emerald-800">{selectedStudent.feeStatus} (Treasury Single Account Cleared)</span>
                  </div>
                </div>

                <p>
                  Having duly fulfilled all institutional matriculation obligations, payment of approved fees, and verified course registrations, the above-named candidate is cleared to partake in all academic activities, university examinations, and access campus facilities for the active session.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="h-10 flex items-end justify-center font-serif italic text-slate-800 font-bold">
                    Prof. Babatunde A. Sanusi
                  </div>
                  <div className="border-t border-slate-800 pt-1">
                    <span className="font-bold text-slate-800 block">Vice-Chancellor</span>
                    <span className="text-[10px] text-slate-400">Chief Academic Officer</span>
                  </div>
                </div>

                <div>
                  <div className="h-10 flex items-end justify-center font-serif italic text-slate-800 font-bold">
                    Dr. (Mrs.) Funmilayo Adeyemi
                  </div>
                  <div className="border-t border-slate-800 pt-1">
                    <span className="font-bold text-slate-800 block">Registrar & Secretary to Senate</span>
                    <span className="text-[10px] text-slate-400">Official Seal Stamped</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
