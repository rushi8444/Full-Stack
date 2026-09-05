import React, { useState, useEffect } from 'react';
import { ratingsApi, storesApi, getErrorMessage } from '../api/client';
import { Store, Star, Users, Calendar, AlertCircle, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';

export const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Store Creation Modal (if owner does not have a store yet)
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '' });
  const [storeFormError, setStoreFormError] = useState('');
  const [storeFormSuccess, setStoreFormSuccess] = useState('');
  const [storeFormLoading, setStoreFormLoading] = useState(false);

  const loadOwnerDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await ratingsApi.getOwnerDashboard();
      if (res.data?.data) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerDashboard();
  }, []);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setStoreFormError('');
    setStoreFormSuccess('');
    setStoreFormLoading(true);

    try {
      await storesApi.createStore(storeForm, 'Store Owner');
      setStoreFormLoading(false);
      setStoreFormSuccess('Store created successfully!');
      setTimeout(() => {
        setIsCreateStoreOpen(false);
        setStoreFormSuccess('');
        loadOwnerDashboard();
      }, 1000);
    } catch (err) {
      setStoreFormLoading(false);
      setStoreFormError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm font-medium">Loading store dashboard...</p>
      </div>
    );
  }

  const store = dashboardData?.store;
  const ratings = dashboardData?.ratings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Store Owner Portal</h1>
          <p className="text-sm text-slate-500">
            Monitor your store's average ratings and customer feedback in real time.
          </p>
        </div>

        {!store && (
          <button
            onClick={() => setIsCreateStoreOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all"
          >
            <Plus size={16} />
            <span>Create Your Store</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-sm text-rose-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* If Owner has no store registered */}
      {!store ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Store size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Store Registered Yet</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            You don't currently have a store linked to your account. You can register your store right now to start receiving customer ratings.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateStoreOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
            >
              <Plus size={16} />
              <span>Register Store</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Store Metrics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Store Information */}
            <div className="md:col-span-2 p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 mb-3">
                  <Sparkles size={13} />
                  <span>Active Registered Store</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  {store.store_name}
                </h2>
              </div>

              <div className="mt-8 pt-6 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-indigo-100">
                  <Users size={16} className="text-indigo-300" />
                  <span>Total Submissions: <strong className="text-white font-bold">{ratings.length}</strong></span>
                </div>
                <div className="text-xs text-indigo-300">
                  Real-time PostgreSQL analytics
                </div>
              </div>
            </div>

            {/* Average Rating Card */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Overall Store Rating
              </span>
              <div className="text-5xl font-black text-slate-900 tracking-tight mb-2">
                {parseFloat(store.average_rating || 0).toFixed(1)}
              </div>
              <div className="mb-2">
                <StarRating rating={parseFloat(store.average_rating || 0)} size={24} />
              </div>
              <p className="text-xs text-slate-500">
                Calculated from {ratings.length} customer review{ratings.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Customer Reviews & Feedback Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Customer Feedback & Ratings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customers who have rated your store.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                {ratings.length} total rating{ratings.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6">Email Address</th>
                    <th className="py-3 px-6">Location</th>
                    <th className="py-3 px-6">Rating Given</th>
                    <th className="py-3 px-6 text-right">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {ratings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">
                        No ratings have been submitted for your store yet.
                      </td>
                    </tr>
                  ) : (
                    ratings.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-900">{r.name}</td>
                        <td className="py-4 px-6 text-slate-600">{r.email}</td>
                        <td className="py-4 px-6 max-w-xs truncate" title={r.address}>
                          {r.address}
                        </td>
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                            <StarRating rating={parseFloat(r.rating)} size={16} />
                            <span className="ml-1 text-sm">{parseFloat(r.rating).toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right text-xs text-slate-500">
                          <div className="inline-flex items-center gap-1">
                            <Calendar size={13} className="text-slate-400" />
                            <span>
                              {r.submitted_at
                                ? new Date(r.submitted_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : '—'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal for Store Creation */}
      <Modal
        isOpen={isCreateStoreOpen}
        onClose={() => setIsCreateStoreOpen(false)}
        title="Create Your Store"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateStore} className="space-y-4">
          {storeFormError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{storeFormError}</span>
            </div>
          )}
          {storeFormSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{storeFormSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              required
              placeholder="e.g. Modern Artisan Bakery"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Store Email
            </label>
            <input
              type="email"
              value={storeForm.email}
              onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              required
              placeholder="owner@store.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Store Address
            </label>
            <textarea
              rows={3}
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              required
              placeholder="Full physical street address..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateStoreOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={storeFormLoading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm"
            >
              {storeFormLoading ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;
