import React, { useState } from 'react';
import { useUniversity } from '../context/UniversityContext';
import { UniversityCrest, NigerianFlagBadge } from './UniversityCrest';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, Building2, GraduationCap, CheckCircle } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login } = useUniversity();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = login(username, password);
      setIsLoading(false);
      if (!ok) {
        setError('Invalid credentials! Default: admin / password');
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('password');
    setIsLoading(true);
    setTimeout(() => {
      login('admin', 'password');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-950 via-[#008751] to-emerald-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Subtle Watermark Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border-[60px] border-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[40px] border-white" />
      </div>

      <div className="w-full max-w-md z-10">
        {/* University Header Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-2xl ring-4 ring-emerald-500/30 mb-3">
            <UniversityCrest size="xl" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <NigerianFlagBadge />
            <span className="text-xs tracking-widest uppercase font-bold text-emerald-200">
              Federal Republic of Nigeria
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-crest">
            FEDERAL UNIVERSITY OF TECHNOLOGY & SCIENCES
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 uppercase tracking-wider font-semibold">
            Central Administrative Portal & Senate Registry ERP
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-emerald-100">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Admin Staff Login</h2>
              <p className="text-xs text-slate-500">Enter authorized institutional credentials</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Quick Notice Banner with exact required credentials */}
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-950">Default System Credentials:</p>
              <div className="mt-1 flex items-center gap-2 flex-wrap text-emerald-800">
                <span>Username: <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono font-bold text-emerald-950">admin</code></span>
                <span>Password: <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono font-bold text-emerald-950">password</code></span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900 font-medium"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">TSA / Remita Protected</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900 font-medium"
                  placeholder="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#008751] hover:bg-[#007043] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-click Test Button */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-emerald-200 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>One-Click Instant Admin Sign In (Demo)</span>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 text-center text-[11px] text-slate-500">
            <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>5 Faculties Active</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span>Session 2024/2025</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-emerald-100/80">
          <p>© {new Date().getFullYear()} Federal University of Technology & Sciences, Ibadan.</p>
          <p className="text-[11px] text-emerald-200/60 mt-1">
            National Universities Commission (NUC) Accredited Portal
          </p>
        </div>
      </div>
    </div>
  );
};
