import React from 'react';
import { useUniversity } from '../context/UniversityContext';
import { UniversityCrest, NigerianFlagBadge } from './UniversityCrest';
import {
  Calendar,
  LogOut,
  Bell,
  Search,
  RotateCcw,
  Sparkles,
  Menu,
} from 'lucide-react';
import { AcademicSession, Semester } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenGlobalSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenGlobalSearch,
}) => {
  const {
    currentUser,
    logout,
    currentSession,
    currentSemester,
    setAcademicPeriod,
    stats,
    resetAllData,
  } = useUniversity();

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '2024/2025-First') setAcademicPeriod('2024/2025', 'First Semester');
    else if (val === '2024/2025-Second') setAcademicPeriod('2024/2025', 'Second Semester');
    else if (val === '2023/2024-Second') setAcademicPeriod('2023/2024', 'Second Semester');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#008751] text-white shadow-md border-b-2 border-emerald-800 no-print">
      {/* Top micro bar with Republic notice and motto */}
      <div className="bg-emerald-950/40 px-4 py-1 text-[11px] flex items-center justify-between border-b border-emerald-600/30">
        <div className="flex items-center gap-2">
          <NigerianFlagBadge />
          <span className="font-semibold text-emerald-100">
            FEDERAL REPUBLIC OF NIGERIA • NATIONAL UNIVERSITIES COMMISSION (NUC) APPROVED
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-emerald-200/90 text-[10px]">
          <span>Motto: <em className="text-white font-serif">Disciplina et Doctrina (Discipline & Learning)</em></span>
          <span>•</span>
          <span>TSA/Remita Gateway Active</span>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 hover:bg-emerald-700 rounded-lg text-emerald-100 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-xs shrink-0">
              <UniversityCrest size="md" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-crest font-extrabold text-base md:text-lg leading-tight tracking-wide text-white drop-shadow-xs">
                  FUTS IBADAN
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 bg-emerald-900/70 border border-emerald-400/40 rounded text-[10px] font-bold tracking-wider text-emerald-100 uppercase">
                  Senate Admin
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 hidden sm:block truncate max-w-xs md:max-w-md">
                Federal University of Technology & Sciences
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger */}
        <div className="flex-1 max-w-md hidden lg:block">
          <button
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-emerald-900/50 hover:bg-emerald-900/70 text-emerald-200 border border-emerald-600/40 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-emerald-300" />
              <span>Search student matric, staff ID, RRR, or course...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-emerald-800/80 rounded text-[10px] font-mono text-emerald-300 border border-emerald-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Academic Session selector, reset data, profile & logout */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile search button */}
          <button
            onClick={onOpenGlobalSearch}
            className="lg:hidden p-2 hover:bg-emerald-700 rounded-lg text-emerald-100"
            title="Search database"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Academic Session & Semester Select */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-600/40 rounded-xl px-2.5 py-1 text-xs text-white">
            <Calendar className="w-3.5 h-3.5 text-emerald-300" />
            <select
              aria-label="Active Academic Session and Semester"
              value={`${currentSession}-${currentSemester.startsWith('First') ? 'First' : 'Second'}`}
              onChange={handlePeriodChange}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="2024/2025-First" className="bg-emerald-900 text-white">
                2024/2025 • First (Harmattan)
              </option>
              <option value="2024/2025-Second" className="bg-emerald-900 text-white">
                2024/2025 • Second (Rain)
              </option>
              <option value="2023/2024-Second" className="bg-emerald-900 text-white">
                2023/2024 • Rain (Concluded)
              </option>
            </select>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all records to initial Nigerian University mock data?')) {
                resetAllData();
              }
            }}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-lg transition-colors"
            title="Reset Mock Database"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Pending Alerts Badge */}
          <div className="relative">
            <button
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-lg transition-colors relative"
              title={`${stats.pendingClearances + stats.pendingRegistrations} Pending Clearances`}
            >
              <Bell className="w-4 h-4" />
              {(stats.pendingClearances > 0 || stats.pendingRegistrations > 0) && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
              )}
              {(stats.pendingClearances > 0 || stats.pendingRegistrations > 0) && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </button>
          </div>

          {/* User profile dropdown / info */}
          <div className="flex items-center gap-2 pl-2 border-l border-emerald-700/60">
            <div className="w-8 h-8 rounded-full bg-white text-[#008751] font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-emerald-400/40">
              FA
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-bold text-white leading-tight">
                {currentUser?.name || 'Dr. Funmilayo Adeyemi'}
              </div>
              <div className="text-[10px] text-emerald-200 font-medium">University Registrar</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-emerald-200 hover:text-rose-200 hover:bg-rose-900/40 rounded-lg transition-colors ml-1"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
