import React from 'react';
import { FeePayment } from '../types';
import { UniversityCrest, NigerianFlagBadge } from './UniversityCrest';
import { Printer, X, CheckCircle2, ShieldCheck, Download, Share2 } from 'lucide-react';

interface RemitaReceiptModalProps {
  payment: FeePayment | null;
  onClose: () => void;
}

export const RemitaReceiptModal: React.FC<RemitaReceiptModalProps> = ({ payment, onClose }) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 my-6 overflow-hidden animate-in fade-in zoom-in-95 print-container">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Federal Government of Nigeria • Remita TSA e-Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#008751] hover:bg-[#007043] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-8 bg-white text-slate-900 relative">
          {/* Subtle Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-4">
            <div className="w-72 h-72 border-8 border-emerald-900 rounded-full flex items-center justify-center text-4xl font-extrabold text-emerald-900 font-crest rotate-[-25deg]">
              TSA PAID
            </div>
          </div>

          {/* Institutional Header */}
          <div className="border-b-2 border-emerald-800 pb-5 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <UniversityCrest size="lg" />
              <div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-[#008751] uppercase">
                  <NigerianFlagBadge />
                  <span>Federal Republic of Nigeria</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black font-crest text-emerald-950">
                  FEDERAL UNIVERSITY OF TECHNOLOGY & SCIENCES
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  P.M.B. 1004, Ibadan, Oyo State, Nigeria
                </p>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
                  Bursary Department • Treasury Single Account (TSA) Collection
                </p>
              </div>
            </div>

            <div className="inline-block mt-2 px-4 py-1 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-full font-mono text-xs font-bold">
              OFFICIAL ELECTRONIC SCHOOL FEES RECEIPT
            </div>
          </div>

          {/* RRR Barcode & Reference Banner */}
          <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Remita Retrieval Reference (RRR)
              </span>
              <span className="text-xl font-mono font-black text-emerald-900 tracking-wider">
                {payment.rrr}
              </span>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                Receipt No: <strong className="font-mono text-slate-700">{payment.receiptNo}</strong>
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>PAYMENT COMPLETED & VERIFIED</span>
              </span>
              <div className="text-[10px] text-slate-500 mt-1">
                Cleared at: <strong>{payment.paymentDate}</strong>
              </div>
            </div>
          </div>

          {/* Student & Payment Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-6">
            <div className="space-y-2 border-r border-slate-200 pr-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payer / Student Name:</span>
                <span className="font-extrabold text-slate-900 text-sm">{payment.studentName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Matriculation Number:</span>
                <span className="font-mono font-bold text-emerald-900">{payment.matricNo}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty & Department:</span>
                <span className="font-medium text-slate-800">
                  {payment.departmentName} ({payment.facultyName})
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Level:</span>
                <span className="font-bold text-slate-800">{payment.level}</span>
              </div>
            </div>

            <div className="space-y-2 pl-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Session & Term:</span>
                <span className="font-bold text-slate-800">
                  {payment.session} • {payment.semester}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Channel:</span>
                <span className="font-medium text-slate-800">{payment.paymentChannel}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Description:</span>
                <span className="font-medium text-slate-800">{payment.narration}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Type / GIFMIS Code:</span>
                <span className="font-mono text-slate-600">FGN-TSA-UNIV-FEES-100293</span>
              </div>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden mb-6">
            <thead className="bg-emerald-950/5 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">Account Code</th>
                <th className="py-2.5 px-3 text-right">Amount (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3 font-medium">Undergraduate Tuition & Faculty Charges</td>
                <td className="py-2 px-3 font-mono text-slate-500">REV-2101</td>
                <td className="py-2 px-3 text-right font-mono">
                  ₦{(payment.amount * 0.65).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">ICT / E-Learning Portal & Library Development</td>
                <td className="py-2 px-3 font-mono text-slate-500">REV-2105</td>
                <td className="py-2 px-3 text-right font-mono">
                  ₦{(payment.amount * 0.15).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Laboratory Consumables & Workshop Practicum</td>
                <td className="py-2 px-3 font-mono text-slate-500">REV-2108</td>
                <td className="py-2 px-3 text-right font-mono">
                  ₦{(payment.amount * 0.12).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Medical / TSHIP Health Insurance & SUG Dues</td>
                <td className="py-2 px-3 font-mono text-slate-500">REV-2114</td>
                <td className="py-2 px-3 text-right font-mono">
                  ₦{(payment.amount * 0.08).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-emerald-50/80 font-bold border-t-2 border-emerald-800 text-slate-900">
                <td colSpan={2} className="py-3 px-3 uppercase text-emerald-950 font-black">
                  Total Amount Remitted & Cleared
                </td>
                <td className="py-3 px-3 text-right text-base text-emerald-950 font-black font-mono">
                  ₦{payment.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signatures & Security Stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-end justify-between text-xs">
            <div>
              {/* Simulated QR Code / Barcode representation */}
              <div className="p-2 border border-slate-300 rounded bg-slate-50 inline-block font-mono text-[9px] text-slate-500">
                <div className="w-16 h-16 bg-slate-900 grid grid-cols-4 gap-0.5 p-1 rounded">
                  <div className="bg-white" /><div className="bg-slate-900" /><div className="bg-white" /><div className="bg-white" />
                  <div className="bg-white" /><div className="bg-white" /><div className="bg-slate-900" /><div className="bg-white" />
                  <div className="bg-slate-900" /><div className="bg-white" /><div className="bg-white" /><div className="bg-slate-900" />
                  <div className="bg-white" /><div className="bg-slate-900" /><div className="bg-white" /><div className="bg-white" />
                </div>
                <span className="block mt-1 text-center font-bold">RRR-TSA</span>
              </div>
            </div>

            <div className="text-center">
              <div className="font-serif italic text-emerald-900 font-bold text-sm mb-1">
                Alh. Musiliu A. Adeleke (FCA)
              </div>
              <div className="w-48 h-0.5 bg-slate-800 mx-auto" />
              <div className="text-[10px] font-bold text-slate-600 mt-1 uppercase">
                Bursar & Chief Financial Officer
              </div>
              <div className="text-[9px] text-slate-400">Federal University of Technology & Sciences</div>
            </div>
          </div>

          <div className="mt-6 text-center text-[9px] text-slate-400 border-t border-dashed border-slate-200 pt-2">
            This is a computer-generated official receipt. No physical signature is required. Verified under the Treasury Single Account regulations of the Central Bank of Nigeria (CBN).
          </div>
        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between no-print">
          <span className="text-[11px] text-slate-500">
            Keep this receipt for semester examination clearance and hostel allocation.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
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
