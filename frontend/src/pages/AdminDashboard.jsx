import React, { useState, useEffect } from 'react';
import { ratingsApi, usersApi, storesApi, getErrorMessage } from '../api/client';
import { Plus, Search, Filter, ArrowUpDown, Star, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
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
      await usersApi.createUser(newUserData);
      setFormLoading(false);
      setFormSuccess('User successfully created.');
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
      }, 1000);
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
      setFormSuccess('Store created and assigned.');
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
      }, 1000);
    } catch (err) {
      setFormLoading(false);
      setFormError(getErrorMessage(err));
    }
  };

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
          <span className="inline-flex items-center px-2 py-0.5 rounded border border-zinc-300 bg-zinc-100 text-zinc-800 text-[11px] font-medium">
            Admin
          </span>
        );
      case 'Store Owner':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 text-[11px] font-medium">
            Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded border border-zinc-200 bg-white text-zinc-500 text-[11px] font-medium">
            User
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Administration</h1>
          <p className="text-xs text-zinc-500">Platform users, stores, and system records.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFormError('');
              setFormSuccess('');
              setIsAddUserOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Plus size={14} />
            <span>Add User</span>
          </button>
          <button
            onClick={openAddStoreModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 text-xs font-medium rounded-lg transition-colors"
          >
            <Plus size={14} />
            <span>Add Store</span>
          </button>
        </div>
      </div>

      {/* Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-xl border border-zinc-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block">
            Total Users
          </span>
          <p className="text-2xl font-semibold text-zinc-900 tracking-tight mt-1">
            {loadingMetrics ? '—' : metrics.totalUsers}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block">
            Total Stores
          </span>
          <p className="text-2xl font-semibold text-zinc-900 tracking-tight mt-1">
            {loadingMetrics ? '—' : metrics.totalStores}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-zinc-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block">
            Total Ratings
          </span>
          <p className="text-2xl font-semibold text-zinc-900 tracking-tight mt-1">
            {loadingMetrics ? '—' : metrics.totalRatings}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 gap-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          Users ({metrics.totalUsers})
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'stores'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          Stores ({metrics.totalStores})
        </button>
      </div>

      {/* Tab 1: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          {/* Controls */}
          <div className="p-3 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Filter size={13} className="text-zinc-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs text-zinc-700 focus:outline-none"
                >
                  <option value="">All Roles</option>
                  <option value="Normal User">Normal User</option>
                  <option value="Store Owner">Store Owner</option>
                  <option value="System Administrator">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <ArrowUpDown size={13} className="text-zinc-400" />
                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs text-zinc-700 focus:outline-none"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="role">Role</option>
                  <option value="created_at">Date</option>
                </select>
                <button
                  onClick={() => setUserSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                  className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  {userSortOrder}
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-zinc-500 font-medium">
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Address</th>
                  <th className="py-2.5 px-4 text-right">Store Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-zinc-400">
                      Loading users...
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-zinc-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-zinc-900">{u.name}</td>
                      <td className="py-3 px-4 text-zinc-500">{u.email}</td>
                      <td className="py-3 px-4">{getRolePill(u.role)}</td>
                      <td className="py-3 px-4 text-zinc-500 max-w-xs truncate" title={u.address}>
                        {u.address}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role === 'Store Owner' ? (
                          u.rating ? (
                            <div className="inline-flex items-center gap-1 text-zinc-800 font-medium">
                              <Star size={12} className="fill-amber-400 text-amber-500" />
                              <span>{parseFloat(u.rating).toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-400 text-[11px]">Unrated</span>
                          )
                        ) : (
                          <span className="text-zinc-300">—</span>
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
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          {/* Controls */}
          <div className="p-3 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Search stores..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <ArrowUpDown size={13} className="text-zinc-400" />
              <select
                value={storeSortBy}
                onChange={(e) => setStoreSortBy(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs text-zinc-700 focus:outline-none"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
              </select>
              <button
                onClick={() => setStoreSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
                className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                {storeSortOrder}
              </button>
            </div>
          </div>

          {/* Stores Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-zinc-500 font-medium">
                  <th className="py-2.5 px-4">Store Name</th>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4">Address</th>
                  <th className="py-2.5 px-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {loadingStores ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-zinc-400">
                      Loading stores...
                    </td>
                  </tr>
                ) : storesList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-zinc-400">
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  storesList.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-zinc-900">{s.name}</td>
                      <td className="py-3 px-4 text-zinc-500">{s.email}</td>
                      <td className="py-3 px-4 text-zinc-500 max-w-sm truncate" title={s.address}>
                        {s.address}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1 font-medium text-zinc-900">
                          <StarRating rating={parseFloat(s.overall_rating || 0)} size={14} />
                          <span className="ml-1 text-xs">{parseFloat(s.overall_rating || 0).toFixed(1)}</span>
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
        title="Add User"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateUser} className="space-y-3.5">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-lg text-xs text-zinc-900">
              <span>{formSuccess}</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-zinc-700">Full Name</label>
              <span className="text-[11px] text-zinc-400">10-60 chars</span>
            </div>
            <input
              type="text"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              required
              placeholder="Full name..."
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
            <input
              type="email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              required
              placeholder="user@example.com"
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Role</label>
            <select
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            >
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              <option value="System Administrator">Admin</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-zinc-700">Address</label>
              <span className="text-[11px] text-zinc-400">max 400 chars</span>
            </div>
            <textarea
              rows={2}
              value={newUserData.address}
              onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
              required
              placeholder="Physical address..."
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-zinc-700">Password</label>
              <span className="text-[11px] text-zinc-400">8-16 chars, 1 upper, 1 special</span>
            </div>
            <div className="relative">
              <input
                type={showUserPassword ? 'text' : 'password'}
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full pl-3 pr-9 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
              <button
                type="button"
                onClick={() => setShowUserPassword(!showUserPassword)}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700"
                tabIndex={-1}
              >
                {showUserPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 rounded-md transition-colors"
            >
              {formLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Store Modal */}
      <Modal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        title="Register Store"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateStore} className="space-y-3.5">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-lg text-xs text-zinc-900">
              <span>{formSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Store Name</label>
            <input
              type="text"
              value={newStoreData.name}
              onChange={(e) => setNewStoreData({ ...newStoreData, name: e.target.value })}
              required
              placeholder="Store name..."
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Store Email</label>
            <input
              type="email"
              value={newStoreData.email}
              onChange={(e) => setNewStoreData({ ...newStoreData, email: e.target.value })}
              required
              placeholder="store@example.com"
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Assign Store Owner</label>
            {storeOwners.length === 0 ? (
              <p className="text-xs text-zinc-500 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                No Store Owners available. Add a Store Owner account first.
              </p>
            ) : (
              <select
                value={newStoreData.ownerId}
                onChange={(e) => setNewStoreData({ ...newStoreData, ownerId: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
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
            <label className="block text-xs font-medium text-zinc-700 mb-1">Store Address</label>
            <textarea
              rows={2}
              value={newStoreData.address}
              onChange={(e) => setNewStoreData({ ...newStoreData, address: e.target.value })}
              required
              placeholder="Physical address..."
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setIsAddStoreOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading || storeOwners.length === 0}
              className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 rounded-md transition-colors"
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
