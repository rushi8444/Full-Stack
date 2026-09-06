import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import UserDashboard from './pages/UserDashboard';

const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs text-zinc-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      <main className="flex-1 pb-16">
        {user?.role === 'System Administrator' && <AdminDashboard />}
        {user?.role === 'Store Owner' && <OwnerDashboard />}
        {user?.role === 'Normal User' && <UserDashboard />}
      </main>

      <footer className="border-t border-zinc-200 py-6 text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span>Stores Directory</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
