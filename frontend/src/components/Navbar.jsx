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
          icon: <ShieldCheck size={13} className="text-zinc-700" />,
          label: 'Admin',
        };
      case 'Store Owner':
        return {
          icon: <ShoppingBag size={13} className="text-zinc-700" />,
          label: 'Owner',
        };
      case 'Normal User':
      default:
        return {
          icon: <UserCheck size={13} className="text-zinc-700" />,
          label: 'User',
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Store size={16} />
            </div>
            <span className="font-semibold text-sm text-zinc-900 tracking-tight">Stores</span>
          </div>

          {/* Right: User & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Meta */}
            <div className="flex items-center gap-2 pl-2 text-xs text-zinc-600">
              <div className="w-7 h-7 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium text-xs flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="font-medium text-zinc-800 truncate max-w-[140px]">{user?.name}</p>
                <p className="text-[11px] text-zinc-400 truncate max-w-[140px]">{user?.email}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-600 text-[11px] font-medium ml-1">
                {roleInfo.icon}
                <span>{roleInfo.label}</span>
              </span>
            </div>

            <div className="h-4 w-px bg-zinc-200 mx-1 hidden sm:block" />

            {/* Change Password */}
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
              title="Change Password"
              aria-label="Change Password"
            >
              <KeyRound size={16} />
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
              title="Sign Out"
            >
              <LogOut size={14} />
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
