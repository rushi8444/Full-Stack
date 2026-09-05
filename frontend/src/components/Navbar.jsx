import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, KeyRound, LogOut, ShieldCheck, UserCheck, ShoppingBag } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'System Administrator':
        return {
          icon: <ShieldCheck size={14} className="text-purple-600" />,
          bg: 'bg-purple-50 border-purple-200 text-purple-700',
          label: 'Administrator',
        };
      case 'Store Owner':
        return {
          icon: <ShoppingBag size={14} className="text-amber-600" />,
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          label: 'Store Owner',
        };
      case 'Normal User':
      default:
        return {
          icon: <UserCheck size={14} className="text-emerald-600" />,
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          label: 'Consumer',
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Store size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">StoreSphere</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Store Ratings & Management Platform</p>
            </div>
          </div>

          {/* Right side: User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* User Details */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-semibold text-slate-800 truncate max-w-[150px]">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate max-w-[150px]">{user?.email}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${roleInfo.bg} ml-1`}>
                {roleInfo.icon}
                <span>{roleInfo.label}</span>
              </div>
            </div>

            {/* Mobile role badge */}
            <div className={`md:hidden flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${roleInfo.bg}`}>
              {roleInfo.icon}
              <span>{roleInfo.label}</span>
            </div>

            {/* Change Password Button */}
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Change Password"
            >
              <KeyRound size={18} />
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
