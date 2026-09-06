import React, { useState, useEffect } from 'react';
import { storesApi, ratingsApi, getErrorMessage } from '../api/client';
import { Store, Search, ArrowUpDown, MapPin, Mail, Star, Check, AlertCircle } from 'lucide-react';
import StarRating from '../components/StarRating';

export const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [loading, setLoading] = useState(true);
  const [ratingLoadingStoreId, setRatingLoadingStoreId] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadStores = async () => {
    try {
      setLoading(true);
      const res = await storesApi.getStores({
        search,
        sortBy,
        sortOrder,
      });
      if (Array.isArray(res.data)) {
        setStores(res.data);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadStores, 250);
    return () => clearTimeout(timer);
  }, [search, sortBy, sortOrder]);

  const handleRateStore = async (storeId, newRating) => {
    setRatingLoadingStoreId(storeId);
    setNotification(null);

    try {
      // Optimistic update
      setStores((prevStores) =>
        prevStores.map((s) =>
          s.id === storeId ? { ...s, user_submitted_rating: newRating } : s
        )
      );

      await ratingsApi.submitRating({
        storeId,
        rating: newRating,
      });

      setNotification({
        type: 'success',
        message: `Submitted ${newRating} star${newRating > 1 ? 's' : ''}`,
      });

      const res = await storesApi.getStores({ search, sortBy, sortOrder });
      if (Array.isArray(res.data)) {
        setStores(res.data);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: getErrorMessage(err),
      });
      loadStores();
    } finally {
      setRatingLoadingStoreId(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Stores</h1>
          <p className="text-xs text-zinc-500">Discover and rate registered stores.</p>
        </div>

        {notification && (
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-zinc-100 border-zinc-300 text-zinc-900'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <Check size={14} className="text-zinc-900 shrink-0" />
            ) : (
              <AlertCircle size={14} className="text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-white rounded-lg border border-zinc-200">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores by name or address..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-transparent border-0 focus:outline-none text-zinc-900 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100">
          <ArrowUpDown size={13} className="text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1 text-xs text-zinc-700 focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
          </select>
          <button
            onClick={() => setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
            className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            {sortOrder}
          </button>
        </div>
      </div>

      {/* Stores List */}
      {loading && stores.length === 0 ? (
        <div className="py-16 text-center text-zinc-400">
          <div className="animate-spin w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs">Loading stores...</p>
        </div>
      ) : stores.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-zinc-200">
          <Store size={28} className="mx-auto text-zinc-300 mb-2" />
          <h3 className="text-sm font-medium text-zinc-800">No stores found</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Try a different search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((s) => {
            const overallScore = parseFloat(s.overall_rating || 0);
            const userRating = s.user_submitted_rating ? parseFloat(s.user_submitted_rating) : 0;
            const isSubmitting = ratingLoadingStoreId === s.id;

            return (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col justify-between hover:border-zinc-300 transition-colors"
              >
                <div>
                  {/* Top */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1" title={s.name}>
                      {s.name}
                    </h3>
                    <div className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-xs font-semibold text-zinc-800">
                      <Star size={12} className="fill-amber-400 text-amber-500" />
                      <span>{overallScore.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1.5 text-xs text-zinc-500 mb-5">
                    <div className="flex items-start gap-1.5">
                      <MapPin size={13} className="text-zinc-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2" title={s.address}>
                        {s.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-zinc-400 shrink-0" />
                      <span className="truncate" title={s.email}>
                        {s.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Interactive Bar */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-zinc-400 block mb-0.5">
                      {userRating > 0 ? `Your rating: ${userRating}★` : 'Rate this store'}
                    </span>
                    <StarRating
                      rating={userRating}
                      interactive={true}
                      size={18}
                      disabled={isSubmitting}
                      onChange={(star) => handleRateStore(s.id, star)}
                    />
                  </div>
                  {isSubmitting && (
                    <span className="text-[11px] text-zinc-400">Saving...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
