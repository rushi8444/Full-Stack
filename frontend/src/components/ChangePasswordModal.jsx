import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { Lock, Check, X, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Password rules validation
  const hasLength = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isValid = hasLength && hasUppercase && hasSpecial && isMatch && currentPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setError('');
    setSuccess('');
    setLoading(true);

    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message || 'Password changed successfully.');
      setTimeout(() => {
        setSuccess('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1200);
    } else {
      setError(result.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-lg flex items-start gap-2 text-xs text-zinc-900">
            <Check size={15} className="shrink-0 mt-0.5 text-zinc-800" />
            <span>{success}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full pl-9 pr-9 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
              placeholder="••••••••"
            />
            <Lock size={15} className="absolute left-3 top-2.5 text-zinc-400" />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700"
              tabIndex={-1}
            >
              {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full pl-9 pr-9 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
              placeholder="8-16 characters"
            />
            <Lock size={15} className="absolute left-3 top-2.5 text-zinc-400" />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700"
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-9 pr-9 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
              placeholder="Repeat password"
            />
            <Lock size={15} className="absolute left-3 top-2.5 text-zinc-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Minimal requirements list */}
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 space-y-1">
          <div className="flex items-center gap-1.5">
            {hasLength ? <Check size={13} className="text-zinc-900" /> : <span className="w-3 h-3 inline-block rounded-full border border-zinc-300" />}
            <span className={hasLength ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>8–16 characters</span>
          </div>
          <div className="flex items-center gap-1.5">
            {hasUppercase ? <Check size={13} className="text-zinc-900" /> : <span className="w-3 h-3 inline-block rounded-full border border-zinc-300" />}
            <span className={hasUppercase ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>At least 1 uppercase letter</span>
          </div>
          <div className="flex items-center gap-1.5">
            {hasSpecial ? <Check size={13} className="text-zinc-900" /> : <span className="w-3 h-3 inline-block rounded-full border border-zinc-300" />}
            <span className={hasSpecial ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>At least 1 special character</span>
          </div>
          <div className="flex items-center gap-1.5">
            {isMatch ? <Check size={13} className="text-zinc-900" /> : <span className="w-3 h-3 inline-block rounded-full border border-zinc-300" />}
            <span className={isMatch ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>Passwords match</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || loading}
            className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {loading ? 'Updating...' : 'Save Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
