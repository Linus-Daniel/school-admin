import React, { useState } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { FeePayment, Level } from '../types';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  FileSpreadsheet,
  Building,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';

interface SchoolFeesManagementProps {
  onSelectReceipt: (payment: FeePayment) => void;
  openVerifyModalDefault?: boolean;
}

export const SchoolFeesManagement: React.FC<SchoolFeesManagementProps> = ({
  onSelectReceipt,
}) => {
  const {
    payments,
    feeSchedules,
    students,
    verifyFeePayment,
    recordFeePayment,
    currentSession,
    currentSemester,
  } = useUniversity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');

  // Interactive RRR verification input
  const [rrrInput, setRrrInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Record Payment Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(145000);
  const [paymentChannel, setPaymentChannel] = useState<
    'Remita TSA' | 'Bank Branch (e-Tranzact)' | 'Interswitch WebPay' | 'Quickteller'
  >('Remita TSA');
  const [narration, setNarration] = useState('Undergraduate Session Tuition & Sundry Charges');

  // Fee schedule active tab: 'ledger' | 'schedules'
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'schedules'>('ledger');

  const handleVerifyRRR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rrrInput.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      verifyFeePayment(rrrInput.trim());
      setIsVerifying(false);
      setRrrInput('');
    }, 600);
  };

  const handleOpenRecordModal = () => {
    const defaultStudent = students.find((s) => s.feeStatus !== 'Paid') || students[0];
    if (defaultStudent) {
      setSelectedStudentId(defaultStudent.id);
      // Find matching schedule amount
      const sched = feeSchedules.find(
        (s) => s.facultyId === defaultStudent.facultyId && s.level === defaultStudent.level
      );
      setPaymentAmount(sched ? sched.totalAmount : 135000);
    }
    setIsRecordModalOpen(true);
  };

  const handleStudentSelectInModal = (stuId: string) => {
    setSelectedStudentId(stuId);
    const stu = students.find((s) => s.id === stuId);
    if (stu) {
      const sched = feeSchedules.find(
        (s) => s.facultyId === stu.facultyId && s.level === stu.level
      );
      if (sched) setPaymentAmount(sched.totalAmount);
    }
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    // Generate authentic Remita RRR: XXXX-XXXX-XXXX
    const r1 = Math.floor(1000 + Math.random() * 9000);
    const r2 = Math.floor(1000 + Math.random() * 9000);
    const r3 = Math.floor(1000 + Math.random() * 9000);
    const rrr = `${r1}-${r2}-${r3}`;

    const newPay = recordFeePayment({
      rrr,
      studentId: student.id,
      matricNo: student.matricNo,
      studentName: student.fullName,
      departmentName: student.departmentName,
      facultyName: student.facultyName,
      level: student.level,
      session: currentSession,
      semester: currentSemester,
      amount: paymentAmount,
      paymentChannel,
      status: 'Successful',
      narration,
    });

    setIsRecordModalOpen(false);
    onSelectReceipt(newPay);
  };

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rrr.replace(/[\s-]/g, '').includes(searchQuery.replace(/[\s-]/g, '')) ||
      p.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    const matchesChannel = selectedChannel === 'ALL' || p.paymentChannel === selectedChannel;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'Successful')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === 'Pending Verification');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800">
              School Fees & Remita TSA Collection
            </h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-[#008751] font-bold text-xs rounded-full">
              TSA Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Federal Government Treasury Single Account (TSA) reconciliation, Remita RRR validation & e-Receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab(activeSubTab === 'ledger' ? 'schedules' : 'ledger')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{activeSubTab === 'ledger' ? 'View Fee Schedules' : 'View Transactions Ledger'}</span>
          </button>

          <button
            onClick={handleOpenRecordModal}
            className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* RRR Verification Tool Banner */}
      <div className="bg-linear-to-r from-emerald-900 to-emerald-950 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-sm text-white">Central Remita RRR Instant Verification Simulator</h2>
            </div>
            <p className="text-xs text-emerald-200/90">
              Verify student bank branch teller, ATM or WebPay reference directly against the Federal TSA gateway.
            </p>
          </div>

          <form onSubmit={handleVerifyRRR} className="flex items-center gap-2 max-w-md w-full">
            <input
              type="text"
              placeholder="Enter RRR e.g. 4401-7782-9903"
              value={rrrInput}
              onChange={(e) => setRrrInput(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-xs font-mono text-white placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-bold transition-colors shrink-0 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isVerifying ? (
                <span>Reconciling...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify RRR</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Pending RRR tags */}
        {pendingPayments.length > 0 && (
          <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center gap-2 text-xs flex-wrap">
            <span className="text-emerald-300 text-[11px] font-semibold">Pending Verification:</span>
            {pendingPayments.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setRrrInput(p.rrr)}
                className="px-2 py-0.5 bg-emerald-800/70 hover:bg-emerald-700 text-emerald-100 rounded text-[10px] font-mono border border-emerald-600/50 cursor-pointer flex items-center gap-1"
                title={`Click to load ${p.studentName}`}
              >
                <span>{p.rrr}</span>
                <span className="text-[9px] text-amber-300">({p.studentName.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeSubTab === 'schedules' ? (
        /* Fee Schedule Table by Faculty & Level */
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Senate Approved Undergraduate School Fees Schedule
              </h2>
              <p className="text-xs text-slate-500">
                Tuition, ICT portal, medical insurance & laboratory breakdown per session
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('ledger')}
              className="text-xs font-bold text-[#008751] hover:underline"
            >
              ← Back to Payments Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-emerald-950/5 border-b border-slate-200 text-emerald-950 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-3">Faculty</th>
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3 text-right">Tuition</th>
                  <th className="py-3 px-3 text-right">ICT Portal</th>
                  <th className="py-3 px-3 text-right">Medical & Library</th>
                  <th className="py-3 px-3 text-right">Lab / Workshop</th>
                  <th className="py-3 px-3 text-right">SUG Dues</th>
                  <th className="py-3 px-3 text-right font-black">Total (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeSchedules.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-800">{s.facultyName}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-800">{s.level}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₦{s.tuitionFee.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₦{s.ictFee.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₦{(s.medicalFee + s.libraryFee).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₦{s.labWorkshopFee.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      ₦{s.sugDues.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900 bg-emerald-50/50">
                      ₦{s.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Remita Transactions Ledger */
        <div className="space-y-4">
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
                  placeholder="Search student, matric, RRR, receipt..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <select
                  aria-label="Filter by Payment Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
                >
                  <option value="ALL">All Remita Statuses</option>
                  <option value="Successful">Successful / Cleared</option>
                  <option value="Pending Verification">Pending Verification</option>
                </select>
              </div>

              <div>
                <select
                  aria-label="Filter by Payment Channel"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium"
                >
                  <option value="ALL">All Payment Channels</option>
                  <option value="Remita TSA">Remita TSA</option>
                  <option value="Bank Branch (e-Tranzact)">Bank Branch (e-Tranzact)</option>
                  <option value="Interswitch WebPay">Interswitch WebPay</option>
                  <option value="Quickteller">Quickteller</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-emerald-950/5 border-b border-emerald-100 text-emerald-950 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-4">Remita RRR & Receipt</th>
                    <th className="py-3 px-4">Student & Matric No</th>
                    <th className="py-3 px-4">Department & Level</th>
                    <th className="py-3 px-4">Session / Semester</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-emerald-800 text-xs">{p.rrr}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.receiptNo}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{p.studentName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{p.matricNo}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-700">{p.departmentName}</div>
                        <div className="text-[10px] text-slate-400">{p.level}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div>{p.session}</div>
                        <div className="text-[10px] text-slate-400">{p.semester}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono font-black text-slate-900 text-sm">
                          ₦{p.amount.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">{p.paymentChannel}</td>

                      <td className="py-3 px-4">
                        {p.status === 'Successful' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                          </span>
                        ) : (
                          <button
                            onClick={() => verifyFeePayment(p.rrr)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 cursor-pointer"
                            title="Click to instantly verify with TSA"
                          >
                            <Clock className="w-3 h-3 text-amber-600" /> Verify Now
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectReceipt(p)}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-emerald-200 flex items-center gap-1 ml-auto"
                        >
                          <Printer className="w-3 h-3" />
                          <span>e-Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-emerald-100 my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#008751] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base font-crest">
                  Record Student School Fees Payment
                </h3>
                <p className="text-xs text-emerald-100">TSA Central Clearing & Remita Generation</p>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4">
              {/* Select Student */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Enrolled Student *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelectInModal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.matricNo}) - {s.departmentName} - {s.level} [{s.feeStatus}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Payment Amount (₦) *
                </label>
                <input
                  type="number"
                  required
                  min={5000}
                  step={1000}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Channel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Remita Payment Channel *
                </label>
                <select
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="Remita TSA">Remita TSA (Online Gateway)</option>
                  <option value="Bank Branch (e-Tranzact)">Bank Branch (e-Tranzact / CBN)</option>
                  <option value="Interswitch WebPay">Interswitch WebPay</option>
                  <option value="Quickteller">Quickteller ATM / Point-of-Sale</option>
                </select>
              </div>

              {/* Narration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Narration / Payment Purpose
                </label>
                <input
                  type="text"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Generate RRR & Clear Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
