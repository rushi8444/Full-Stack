import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, Lock, Mail, User, MapPin, ArrowRight, ShieldCheck, ShoppingBag, UserCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const AuthPage = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation checks for Signup
  const nameLengthValid = formData.name.trim().length >= 10 && formData.name.trim().length <= 60;
  const passwordLengthValid = formData.password.length >= 8 && formData.password.length <= 16;
  const passwordUpperValid = /[A-Z]/.test(formData.password);
  const passwordSpecialValid = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const addressValid = formData.address.trim().length > 0 && formData.address.trim().length <= 400;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const isSignupValid =
    nameLengthValid &&
    passwordLengthValid &&
    passwordUpperValid &&
    passwordSpecialValid &&
    addressValid &&
    emailValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (isLogin) {
      const res = await login(formData.email, formData.password);
      setLoading(false);
      if (!res.success) {
        setError(res.error);
      }
    } else {
      if (!isSignupValid) {
        setLoading(false);
        setError('Please satisfy all registration requirements below.');
        return;
      }
      const res = await signup(formData);
      setLoading(false);
      if (res.success) {
        setSuccessMsg('Account created successfully! You can now sign in.');
        setIsLogin(true);
        setFormData((prev) => ({ ...prev, password: '' }));
      } else {
        setError(res.error);
      }
    }
  };

  const fillCredentials = (email, password) => {
    setFormData((prev) => ({
      ...prev,
      email,
      password,
    }));
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-200/40">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Brand Icon */}
        <div className="inline-flex w-14 h-14 rounded-2xl bg-indigo-600 items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
          <Store size={30} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          StoreSphere Portal
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Store Ratings, Performance & Community Feedback System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                isLogin
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                !isLogin
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error / Success Notifications */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-sm text-rose-700">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-500" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-sm text-emerald-700">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-500" />
              <div className="leading-snug">{successMsg}</div>
            </div>
          )}

          {/* Quick Demo Accounts Pill Bar (Login mode only) */}
          {isLogin && (
            <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Quick Fill Demo Accounts:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('system@example.com', 'Admin@1234')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-medium transition-colors"
                >
                  <ShieldCheck size={13} />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('owner@store.com', 'Owner@1234')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-medium transition-colors"
                >
                  <ShoppingBag size={13} />
                  <span>Store Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('janesmith@example.com', 'User@1234')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium transition-colors"
                >
                  <UserCheck size={13} />
                  <span>Normal User</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (Signup only) */}
            {!isLogin && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Full Name
                  </label>
                  <span
                    className={`text-xs ${
                      nameLengthValid ? 'text-emerald-600 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {formData.name.trim().length}/60 (min 10 chars)
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Jane Smith Richardson"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                  <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Address field (Signup only) */}
            {!isLogin && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Address
                  </label>
                  <span className="text-xs text-slate-400">
                    {formData.address.trim().length}/400 chars
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="123 Main Street, Suite 400, Springfield"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>
              </div>
            )}

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Live Password & Name Rules Box (Signup mode only) */}
            {!isLogin && (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-1.5 text-slate-600">
                <p className="font-semibold text-slate-700">Backend Validation Requirements:</p>
                <div className="flex items-center gap-2">
                  {nameLengthValid ? (
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                  )}
                  <span className={nameLengthValid ? 'text-emerald-700 font-medium' : ''}>
                    Name between 10 and 60 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordLengthValid ? (
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                  )}
                  <span className={passwordLengthValid ? 'text-emerald-700 font-medium' : ''}>
                    Password 8 to 16 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordUpperValid ? (
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                  )}
                  <span className={passwordUpperValid ? 'text-emerald-700 font-medium' : ''}>
                    At least 1 uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordSpecialValid ? (
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                  )}
                  <span className={passwordSpecialValid ? 'text-emerald-700 font-medium' : ''}>
                    At least 1 special symbol (!@#$%^&*...)
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || (!isLogin && !isSignupValid)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.99]"
              >
                <span>{loading ? 'Processing...' : isLogin ? 'Sign In to Portal' : 'Create Account'}</span>
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
