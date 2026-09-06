import React, { useState, useEffect } from 'react';
import { ratingsApi, storesApi, getErrorMessage } from '../api/client';
import { Store, Star, Users, Calendar, AlertCircle, Plus, MapPin, Mail } from 'lucide-react';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';

export const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Store Creation Modal
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
      setStoreFormSuccess('Store created successfully.');
      setTimeout(() => {
        setIsCreateStoreOpen(false);
        setStoreFormSuccess('');
        loadOwnerDashboard();
      }, 800);
    } catch (err) {
      setStoreFormLoading(false);
      setStoreFormError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-zinc-400">
        <div className="animate-spin w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-xs">Loading store dashboard...</p>
      </div>
    );
  }

  const store = dashboardData?.store;
  const ratings = dashboardData?.ratings || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Store Overview</h1>
          <p className="text-xs text-zinc-500">
            Ratings and customer feedback for your store.
          </p>
        </div>

        {!store && (
          <button
            onClick={() => setIsCreateStoreOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition-colors self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>Register Store</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* When no store registered */}
      {!store ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center max-w-md mx-auto">
          <Store size={32} className="mx-auto text-zinc-300 mb-3" />
          <h2 className="text-sm font-semibold text-zinc-900">No store linked yet</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Register your store to start receiving customer ratings.
          </p>
          <div className="mt-4">
            <button
              onClick={() => setIsCreateStoreOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-lg transition-colors"
            >
              <Plus size={14} />
              <span>Register Store</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Store Info & Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Store Details Card */}
            <div className="p-5 bg-white rounded-xl border border-zinc-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                  Store Details
                </span>
                <h2 className="text-base font-semibold text-zinc-900 mb-2">
                  {store.store_name}
                </h2>
                <div className="space-y-1 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{store.store_email || '—'}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin size={12} className="text-zinc-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{store.store_address || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Rating Card */}
            <div className="p-5 bg-white rounded-xl border border-zinc-200 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                Average Rating
              </span>
              <div className="my-1">
                <div className="text-3xl font-semibold text-zinc-900 tracking-tight mb-1">
                  {parseFloat(store.average_rating || 0).toFixed(1)}
                </div>
                <StarRating rating={parseFloat(store.average_rating || 0)} size={18} />
              </div>
              <p className="text-[11px] text-zinc-400">Out of 5 stars</p>
            </div>

            {/* Total Reviews Card */}
            <div className="p-5 bg-white rounded-xl border border-zinc-200 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                Total Reviews
              </span>
              <div className="my-1">
                <div className="text-3xl font-semibold text-zinc-900 tracking-tight">
                  {ratings.length}
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">Customer submissions</p>
            </div>
          </div>

          {/* Customer Reviews Table */}
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                Customer Ratings
              </h2>
              <span className="text-xs text-zinc-500">
                {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/60 text-zinc-500 font-medium">
                    <th className="py-2.5 px-5">Customer</th>
                    <th className="py-2.5 px-5">Email</th>
                    <th className="py-2.5 px-5">Address</th>
                    <th className="py-2.5 px-5">Rating</th>
                    <th className="py-2.5 px-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {ratings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-zinc-400">
                        No ratings have been submitted yet.
                      </td>
                    </tr>
                  ) : (
                    ratings.map((r, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 px-5 font-medium text-zinc-900">{r.name}</td>
                        <td className="py-3 px-5 text-zinc-500">{r.email}</td>
                        <td className="py-3 px-5 text-zinc-500 max-w-xs truncate" title={r.address}>
                          {r.address}
                        </td>
                        <td className="py-3 px-5">
                          <div className="inline-flex items-center gap-1 font-medium text-zinc-900">
                            <StarRating rating={parseFloat(r.rating)} size={14} />
                            <span className="ml-1 text-xs">{parseFloat(r.rating).toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-right text-zinc-400">
                          {r.submitted_at
                            ? new Date(r.submitted_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
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
        title="Register Store"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateStore} className="space-y-3.5">
          {storeFormError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{storeFormError}</span>
            </div>
          )}
          {storeFormSuccess && (
            <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-lg text-xs text-zinc-900">
              <span>{storeFormSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              required
              placeholder="e.g. Artisan Bakery"
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Store Email
            </label>
            <input
              type="email"
              value={storeForm.email}
              onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              required
              placeholder="store@example.com"
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Store Address
            </label>
            <textarea
              rows={2}
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              required
              placeholder="Store street address..."
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setIsCreateStoreOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={storeFormLoading}
              className="px-4 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 rounded-md transition-colors"
            >
              {storeFormLoading ? 'Saving...' : 'Create Store'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;
