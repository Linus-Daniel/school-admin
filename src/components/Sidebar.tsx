import React from 'react';
import { useUniversity } from '../context/UniversityContext';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users2,
  CreditCard,
  FileCheck2,
  Building,
  Printer,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { stats, currentSession, currentSemester } = useUniversity();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'students',
      label: 'Student Enrollment',
      icon: GraduationCap,
      badge: `${stats.totalStudents} Reg`,
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: BookOpen,
      badge: `${stats.coursesOffered} Courses`,
    },
    {
      id: 'faculty-records',
      label: 'Faculty & Staff Records',
      icon: Users2,
      badge: `${stats.totalFacultyStaff} Staff`,
    },
    {
      id: 'fees',
      label: 'School Fees & Remita',
      icon: CreditCard,
      badge: stats.pendingClearances > 0 ? `${stats.pendingClearances} Pending` : 'Verified',
      badgeColor: stats.pendingClearances > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'registrations',
      label: 'Semester Registrations',
      icon: FileCheck2,
      badge: stats.pendingRegistrations > 0 ? `${stats.pendingRegistrations} to Review` : null,
      badgeColor: 'bg-emerald-600 text-white animate-pulse',
    },
    {
      id: 'departments',
      label: 'Faculties & Departments',
      icon: Building,
      badge: `${stats.totalFaculties} Fac | ${stats.totalDepartments} Dept`,
    },
    {
      id: 'documents',
      label: 'Official Documents',
      icon: Printer,
      badge: 'ID & Slips',
    },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-emerald-950/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 md:top-[85px] left-0 h-screen md:h-[calc(100vh-85px)] w-64 md:w-68 bg-white border-r border-emerald-100 z-40 flex flex-col justify-between transition-transform duration-200 ease-in-out no-print ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Active Senate Status Notice */}
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs">
            <div className="flex items-center justify-between text-emerald-900 font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
                Active Senate Session
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>
            <p className="text-[11px] text-emerald-800 font-semibold">{currentSession}</p>
            <p className="text-[10px] text-emerald-700">{currentSemester}</p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Administration Modules
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#008751] text-white shadow-sm shadow-emerald-900/10'
                      : 'text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Institutional Seal / Accreditation Footer */}
        <div className="p-3.5 border-t border-emerald-100 bg-emerald-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-[11px] leading-tight">
              <div className="font-bold text-slate-800">Senate Registry</div>
              <div className="text-[10px] text-emerald-800 font-medium">Secured • Role: Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
