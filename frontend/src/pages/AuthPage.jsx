import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, Lock, Mail, User, MapPin, ArrowRight, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

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
        setSuccessMsg('Account created successfully. You can now sign in.');
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
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mb-6">
        <div className="inline-flex w-10 h-10 rounded-lg bg-zinc-900 items-center justify-center text-white mb-3">
          <Store size={20} />
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          {isLogin ? 'Sign in to your account' : 'Create an account'}
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Store Ratings & Community Reviews
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white py-6 px-6 sm:px-8 rounded-xl border border-zinc-200 shadow-sm">
          {/* Segmented Switcher */}
          <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-lg mb-5">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccessMsg('');
              }}
              className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                isLogin ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
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
              className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                !isLogin ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-zinc-100 border border-zinc-200 rounded-lg flex items-start gap-2 text-xs text-zinc-900">
              <Check size={15} className="shrink-0 mt-0.5 text-zinc-800" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Clean Demo Fill */}
          {isLogin && (
            <div className="mb-5 p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-xs">
              <span className="text-zinc-500 block mb-1.5 text-[11px]">Quick demo login:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fillCredentials('system@example.com', 'Admin@1234')}
                  className="px-2 py-1 bg-white border border-zinc-200 hover:bg-zinc-100 rounded text-zinc-700 text-[11px] font-medium transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('owner@store.com', 'Owner@1234')}
                  className="px-2 py-1 bg-white border border-zinc-200 hover:bg-zinc-100 rounded text-zinc-700 text-[11px] font-medium transition-colors"
                >
                  Store Owner
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('janesmith@example.com', 'User@1234')}
                  className="px-2 py-1 bg-white border border-zinc-200 hover:bg-zinc-100 rounded text-zinc-700 text-[11px] font-medium transition-colors"
                >
                  Normal User
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name (Signup only) */}
            {!isLogin && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-zinc-700">
                    Full Name
                  </label>
                  <span className="text-[11px] text-zinc-400">10-60 chars</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Jane Smith Richardson"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                  <User size={15} className="absolute left-3 top-2.5 text-zinc-400" />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
                />
                <Mail size={15} className="absolute left-3 top-2.5 text-zinc-400" />
              </div>
            </div>

            {/* Address (Signup only) */}
            {!isLogin && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-zinc-700">
                    Address
                  </label>
                  <span className="text-[11px] text-zinc-400">max 400 chars</span>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="Physical address..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
                  />
                  <MapPin size={15} className="absolute left-3 top-2.5 text-zinc-400" />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
                />
                <Lock size={15} className="absolute left-3 top-2.5 text-zinc-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Signup Validation Requirements */}
            {!isLogin && (
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  {nameLengthValid ? <Check size={13} className="text-zinc-900" /> : <span className="w-3 h-3 inline-block rounded-full border border-zinc-300" />}
                  <span className={nameLengthValid ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>Name between 10 and 60 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {passwordLengthValid ? <Check size={13} className="text-zinc-900" /> : <span className="w-3 h-3 inline-block rounded-full border border-zinc-300" />}
                  <span className={passwordLengthValid ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>Password 8 to 16 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {passwordUpperValid ? <Check size={13} className="text-zinc-900" /> : <span className="w-3 h-3 inline-block rounded-full border border-zinc-300" />}
                  <span className={passwordUpperValid ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>At least 1 uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {passwordSpecialValid ? <Check size={13} className="text-zinc-900" /> : <span className="w-3 h-3 inline-block rounded-full border border-zinc-300" />}
                  <span className={passwordSpecialValid ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>At least 1 special character</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || (!isLogin && !isSignupValid)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
              >
                <span>{loading ? 'Submitting...' : isLogin ? 'Sign In' : 'Create Account'}</span>
                {!loading && <ArrowRight size={14} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
