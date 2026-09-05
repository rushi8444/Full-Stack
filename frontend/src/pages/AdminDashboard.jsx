import React, { useState, useEffect } from 'react';
import { ratingsApi, usersApi, storesApi, getErrorMessage } from '../api/client';
import { Users, Store, Star, Plus, Search, Filter, ArrowUpDown, ShieldCheck, ShoppingBag, UserCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'stores'
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Users State
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [userSortBy, setUserSortBy] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState('ASC');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Stores State
  const [storesList, setStoresList] = useState([]);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortBy, setStoreSortBy] = useState('name');
  const [storeSortOrder, setStoreSortOrder] = useState('ASC');
  const [loadingStores, setLoadingStores] = useState(false);

  // Modals State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [storeOwners, setStoreOwners] = useState([]);

  // Form States
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'Normal User',
  });
  const [newStoreData, setNewStoreData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Load Metrics
  const loadMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const res = await ratingsApi.getAdminDashboard();
      if (res.data?.data) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Load Users
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await usersApi.getUsers({
        search: userSearch,
        role: roleFilter,
        sortBy: userSortBy,
        sortOrder: userSortOrder,
      });
      if (res.data?.data) {
        setUsersList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load Stores
  const loadStores = async () => {
    try {
      setLoadingStores(true);
      const res = await storesApi.getStores({
        search: storeSearch,
        sortBy: storeSortBy,
        sortOrder: storeSortOrder,
      });
      if (Array.isArray(res.data)) {
        setStoresList(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoadingStores(false);
    }
  };

  // Fetch Store Owners for dropdown
  const loadStoreOwners = async () => {
    try {
      const res = await usersApi.getUsers({ role: 'Store Owner' });
      if (res.data?.data) {
        setStoreOwners(res.data.data);
        if (res.data.data.length > 0 && !newStoreData.ownerId) {
          setNewStoreData((prev) => ({ ...prev, ownerId: res.data.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load store owners:', err);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      const timer = setTimeout(loadUsers, 250);
      return () => clearTimeout(timer);
    }
  }, [activeTab, userSearch, roleFilter, userSortBy, userSortOrder]);

  useEffect(() => {
    if (activeTab === 'stores') {
      const timer = setTimeout(loadStores, 250);
      return () => clearTimeout(timer);
    }
  }, [activeTab, storeSearch, storeSortBy, storeSortOrder]);

  // Handle Add User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    try {
      const res = await usersApi.createUser(newUserData);
      setFormLoading(false);
      setFormSuccess('User account successfully created!');
      loadMetrics();
      loadUsers();
      loadStoreOwners();
      setTimeout(() => {
        setIsAddUserOpen(false);
        setFormSuccess('');
        setNewUserData({
          name: '',
          email: '',
          password: '',
          address: '',
          role: 'Normal User',
        });
      }, 1200);
    } catch (err) {
      setFormLoading(false);
      setFormError(getErrorMessage(err));
    }
  };

  // Handle Add Store
  const handleCreateStore = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    try {
      await storesApi.createStore(newStoreData, 'System Administrator');
      setFormLoading(false);
      setFormSuccess('Store created and assigned successfully!');
      loadMetrics();
      loadStores();
      setTimeout(() => {
        setIsAddStoreOpen(false);
        setFormSuccess('');
        setNewStoreData({
          name: '',
          email: '',
          address: '',
          ownerId: storeOwners[0]?.id || '',
        });
      }, 1200);
    } catch (err) {
      setFormLoading(false);
      setFormError(getErrorMessage(err));
    }
  };

  // Open add store modal helper
  const openAddStoreModal = () => {
    loadStoreOwners();
    setFormError('');
    setFormSuccess('');
    setIsAddStoreOpen(true);
  };

  const getRolePill = (role) => {
    switch (role) {
      case 'System Administrator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck size={12} />
            Admin
          </span>
        );
      case 'Store Owner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <ShoppingBag size={12} />
            Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserCheck size={12} />
            Normal User
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Page Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Administration
          </h1>
          <p className="text-sm text-slate-500">
            System metrics, platform user accounts, and registered stores directory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFormError('');
              setFormSuccess('');
              setIsAddUserOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all"
          >
            <Plus size={16} />
            <span>Add User</span>
          </button>
          <button
            onClick={openAddStoreModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Add Store</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loadingMetrics ? '...' : metrics.totalUsers}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Stores</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loadingMetrics ? '...' : metrics.totalStores}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Store size={24} />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Ratings</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loadingMetrics ? '...' : metrics.totalRatings}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star size={24} className="fill-amber-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Users Directory ({metrics.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'stores'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Stores Directory ({metrics.totalStores})
          </button>
        </nav>
      </div>

      {/* Tab 1: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, or address..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Role filter */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Filter size={15} className="text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">All Roles</option>
                  <option value="Normal User">Normal User</option>
                  <option value="Store Owner">Store Owner</option>
                  <option value="System Administrator">System Administrator</option>
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ArrowUpDown size={15} className="text-slate-400" />
                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="role">Role</option>
                  <option value="created_at">Date Created</option>
                </select>
                <button
                  onClick={() => setUserSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                  className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {userSortOrder}
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Address</th>
                  <th className="py-3 px-6 text-right">Store Rating (If Owner)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{u.name}</div>
                      </td>
                      <td className="py-4 px-6">{u.email}</td>
                      <td className="py-4 px-6">{getRolePill(u.role)}</td>
                      <td className="py-4 px-6 max-w-xs truncate" title={u.address}>
                        {u.address}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.role === 'Store Owner' ? (
                          u.rating ? (
                            <div className="inline-flex items-center gap-1 text-slate-800 font-medium">
                              <Star size={14} className="fill-amber-400 text-amber-500" />
                              <span>{parseFloat(u.rating).toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">No ratings yet</span>
                          )
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Stores Directory */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Search stores by name or address..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ArrowUpDown size={15} className="text-slate-400" />
              <select
                value={storeSortBy}
                onChange={(e) => setStoreSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="name">Store Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
              </select>
              <button
                onClick={() => setStoreSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {storeSortOrder}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-6">Store Name</th>
                  <th className="py-3 px-6">Contact Email</th>
                  <th className="py-3 px-6">Address</th>
                  <th className="py-3 px-6 text-right">Average Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loadingStores ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400">
                      Loading stores...
                    </td>
                  </tr>
                ) : storesList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400">
                      No stores found matching your search.
                    </td>
                  </tr>
                ) : (
                  storesList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{s.name}</div>
                      </td>
                      <td className="py-4 px-6">{s.email}</td>
                      <td className="py-4 px-6 max-w-sm truncate" title={s.address}>
                        {s.address}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                          <StarRating rating={parseFloat(s.overall_rating || 0)} size={16} />
                          <span className="ml-1 text-sm">{parseFloat(s.overall_rating || 0).toFixed(1)}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New Platform User"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{formSuccess}</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <span className="text-xs text-slate-400">10-60 characters</span>
            </div>
            <input
              type="text"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              required
              placeholder="e.g. Eleanor Vance Wright"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              required
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Role
            </label>
            <select
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            >
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              <option value="System Administrator">System Administrator</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Address
              </label>
              <span className="text-xs text-slate-400">max 400 characters</span>
            </div>
            <textarea
              rows={2}
              value={newUserData.address}
              onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
              required
              placeholder="Full physical address..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-xs text-slate-400">8-16 chars, 1 upper, 1 special</span>
            </div>
            <div className="relative">
              <input
                type={showUserPassword ? 'text' : 'password'}
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                required
                placeholder="SecurePass@123"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowUserPassword(!showUserPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showUserPassword ? 'Hide password' : 'Show password'}
                aria-label={showUserPassword ? 'Hide password' : 'Show password'}
              >
                {showUserPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm"
            >
              {formLoading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Store Modal */}
      <Modal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        title="Register New Store"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateStore} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{formSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={newStoreData.name}
              onChange={(e) => setNewStoreData({ ...newStoreData, name: e.target.value })}
              required
              placeholder="e.g. Apex Hardware & Tools"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Store Email
            </label>
            <input
              type="email"
              value={newStoreData.email}
              onChange={(e) => setNewStoreData({ ...newStoreData, email: e.target.value })}
              required
              placeholder="contact@store.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Assign Store Owner
            </label>
            {storeOwners.length === 0 ? (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                No Store Owners available. Please add a user with role "Store Owner" first.
              </p>
            ) : (
              <select
                value={newStoreData.ownerId}
                onChange={(e) => setNewStoreData({ ...newStoreData, ownerId: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {storeOwners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Store Address
            </label>
            <textarea
              rows={2}
              value={newStoreData.address}
              onChange={(e) => setNewStoreData({ ...newStoreData, address: e.target.value })}
              required
              placeholder="Physical store address..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddStoreOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading || storeOwners.length === 0}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm"
            >
              {formLoading ? 'Saving...' : 'Register Store'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
