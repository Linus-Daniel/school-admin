import React, { useState } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { Department, Faculty } from '../types';
import {
  Building2,
  Building,
  GraduationCap,
  Users,
  Plus,
  Edit2,
  CheckCircle2,
  BookOpen,
  MapPin,
  Calendar,
  X,
  Award,
} from 'lucide-react';

export const DepartmentManagement: React.FC = () => {
  const { faculties, departments, staff, addFaculty, addDepartment, updateDepartment } = useUniversity();

  const [activeFacultyId, setActiveFacultyId] = useState<string>(faculties[0]?.id || '');

  // Add Faculty Modal
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyCode, setNewFacultyCode] = useState('');
  const [newFacultyDean, setNewFacultyDean] = useState('');

  // Add/Edit Department Modal
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptFacultyId, setDeptFacultyId] = useState(faculties[0]?.id || '');
  const [deptHodName, setDeptHodName] = useState('');
  const [deptOffice, setDeptOffice] = useState('');
  const [deptProgramsInput, setDeptProgramsInput] = useState('');
  const [deptEstablishedYear, setDeptEstablishedYear] = useState(1995);

  const activeFaculty = faculties.find((f) => f.id === activeFacultyId) || faculties[0];
  const facultyDepartments = departments.filter((d) => d.facultyId === activeFaculty?.id);

  const handleOpenAddDeptModal = (targetFacId?: string) => {
    setEditingDept(null);
    setDeptFacultyId(targetFacId || activeFacultyId || faculties[0]?.id || '');
    setDeptName('');
    setDeptCode('');
    const candidateStaff = staff[0]?.fullName || 'Prof. Academic Staff';
    setDeptHodName(candidateStaff);
    setDeptOffice('Senate Academic Complex, 2nd Floor');
    setDeptProgramsInput('B.Sc Program, M.Sc Program, Ph.D Program');
    setDeptEstablishedYear(new Date().getFullYear());
    setIsDeptModalOpen(true);
  };

  const handleOpenEditDeptModal = (dept: Department) => {
    setEditingDept(dept);
    setDeptFacultyId(dept.facultyId);
    setDeptName(dept.name);
    setDeptCode(dept.code);
    setDeptHodName(dept.hodName);
    setDeptOffice(dept.officeLocation);
    setDeptProgramsInput(dept.programs.join(', '));
    setDeptEstablishedYear(dept.establishedYear);
    setIsDeptModalOpen(true);
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyName.trim() || !newFacultyCode.trim()) return;

    addFaculty({
      name: newFacultyName.trim(),
      code: newFacultyCode.trim().toUpperCase(),
      deanName: newFacultyDean || 'Prof. Dean of Faculty',
      deanStaffId: `FU/DEAN/${newFacultyCode.toUpperCase()}/001`,
    });

    setIsFacultyModalOpen(false);
    setNewFacultyName('');
    setNewFacultyCode('');
    setNewFacultyDean('');
  };

  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fac = faculties.find((f) => f.id === deptFacultyId);
    if (!fac || !deptName.trim() || !deptCode.trim()) return;

    const programs = deptProgramsInput
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (editingDept) {
      updateDepartment(editingDept.id, {
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        facultyId: fac.id,
        facultyName: fac.name,
        hodName: deptHodName,
        officeLocation: deptOffice,
        programs,
        establishedYear: deptEstablishedYear,
      });
    } else {
      addDepartment({
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        facultyId: fac.id,
        facultyName: fac.name,
        hodName: deptHodName,
        hodStaffId: `FU/HOD/${deptCode.toUpperCase()}/001`,
        officeLocation: deptOffice,
        programs,
        establishedYear: deptEstablishedYear,
      });
    }

    setIsDeptModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800">
              Faculties & Departmental Management
            </h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-[#008751] font-bold text-xs rounded-full">
              {faculties.length} Faculties • {departments.length} Departments
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional academic structure, Deanery governance, HOD appointments & degree programs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFacultyModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>New Faculty</span>
          </button>

          <button
            onClick={() => handleOpenAddDeptModal()}
            className="px-4 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Department</span>
          </button>
        </div>
      </div>

      {/* Faculties Ribbon / Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {faculties.map((fac) => {
          const isSelected = fac.id === activeFacultyId;
          const facDepts = departments.filter((d) => d.facultyId === fac.id);

          return (
            <div
              key={fac.id}
              onClick={() => setActiveFacultyId(fac.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-linear-to-br from-[#008751] to-emerald-900 text-white shadow-md border-emerald-700 ring-2 ring-emerald-500/30'
                  : 'bg-white hover:border-emerald-300 border-emerald-100 text-slate-800 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {fac.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {facDepts.length} Depts
                  </span>
                </div>

                <h3 className="font-extrabold text-xs md:text-sm leading-snug line-clamp-2">
                  {fac.name}
                </h3>
              </div>

              <div className="mt-3 pt-2.5 border-t border-current/15 text-[11px]">
                <div className={isSelected ? 'text-emerald-100' : 'text-slate-500'}>Dean:</div>
                <div className="font-semibold truncate">{fac.deanName}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Faculty Details & Departments Grid */}
      {activeFaculty && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-black text-slate-900 font-crest">
                  {activeFaculty.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Executive Dean: <strong className="text-slate-800">{activeFaculty.deanName}</strong> • Staff ID:{' '}
                <span className="font-mono text-emerald-800">{activeFaculty.deanStaffId}</span>
              </p>
            </div>

            <button
              onClick={() => handleOpenAddDeptModal(activeFaculty.id)}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Add Department to this Faculty</span>
            </button>
          </div>

          {/* Departments List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facultyDepartments.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-emerald-100 text-slate-400">
                No departments currently established under this faculty. Click 'Add Department' to create one.
              </div>
            ) : (
              facultyDepartments.map((dept) => (
                <div
                  key={dept.id}
                  className="bg-white rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-300 p-5 flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-sm font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {dept.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Est. {dept.establishedYear}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-800 text-base leading-snug">
                      Department of {dept.name}
                    </h3>

                    {/* HOD Info */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Head of Department (HOD):
                      </span>
                      <div className="font-bold text-slate-900">{dept.hodName}</div>
                      <div className="text-[10px] font-mono text-emerald-800">{dept.hodStaffId}</div>
                    </div>

                    {/* Office Location */}
                    <div className="mt-3 text-xs text-slate-600 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] truncate">{dept.officeLocation}</span>
                    </div>

                    {/* Programs Offered */}
                    <div className="mt-3 text-[11px]">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Accredited Programs:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {dept.programs.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-medium"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Metrics & Edit */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                        {dept.studentCount} Students
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        {dept.staffCount} Staff
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenEditDeptModal(dept)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Department"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
      {isFacultyModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#008751] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base font-crest">Establish New Faculty</h3>
                <p className="text-xs text-emerald-100">Senate Academic Governance Registry</p>
              </div>
              <button
                onClick={() => setIsFacultyModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFacultySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Faculty Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Environmental Sciences"
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Faculty Code (3-4 letters) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="FENV"
                  value={newFacultyCode}
                  onChange={(e) => setNewFacultyCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Appointed Dean of Faculty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prof. G. K. Adeleke (FNIS)"
                  value={newFacultyDean}
                  onChange={(e) => setNewFacultyDean(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFacultyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Establish Faculty</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Department Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-emerald-100 my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#008751] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base font-crest">
                  {editingDept ? `Edit Department: ${editingDept.name}` : 'Establish Academic Department'}
                </h3>
                <p className="text-xs text-emerald-100">National Universities Commission (NUC) Accreditation</p>
              </div>
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeptSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Parent Faculty *
                </label>
                <select
                  value={deptFacultyId}
                  onChange={(e) => setDeptFacultyId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber Security"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Department Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CYB"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Head of Department (HOD) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. (Mrs.) Funke Adebayo"
                  value={deptHodName}
                  onChange={(e) => setDeptHodName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Departmental Office Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Complex Block C, 3rd Floor"
                  value={deptOffice}
                  onChange={(e) => setDeptOffice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Academic Programs (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc Cyber Security, M.Sc Information Security"
                  value={deptProgramsInput}
                  onChange={(e) => setDeptProgramsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Year Established
                </label>
                <input
                  type="number"
                  min={1960}
                  max={2030}
                  value={deptEstablishedYear}
                  onChange={(e) => setDeptEstablishedYear(parseInt(e.target.value) || 2000)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingDept ? 'Update Department' : 'Establish Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
