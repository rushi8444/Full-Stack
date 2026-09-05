import React, { useState, useEffect } from 'react';
import { storesApi, ratingsApi, getErrorMessage } from '../api/client';
import { Store, Search, ArrowUpDown, MapPin, Mail, Star, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
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
        message: `Successfully rated ${newRating} star${newRating > 1 ? 's' : ''}!`,
      });

      // Refresh to pull recalculated overall store rating
      const res = await storesApi.getStores({ search, sortBy, sortOrder });
      if (Array.isArray(res.data)) {
        setStores(res.data);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: getErrorMessage(err),
      });
      loadStores(); // revert on error
    } finally {
      setRatingLoadingStoreId(null);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero / Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Sparkles size={13} />
            <span>Community Store Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Explore & Rate Stores</h1>
          <p className="text-sm text-slate-500">
            Browse registered stores in your area and share your experience with quick 1-5 star ratings.
          </p>
        </div>

        {/* Global Toast Notification */}
        {notification && (
          <div
            className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full max-w-lg">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores by name or address..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-sm text-slate-600">
          <ArrowUpDown size={15} className="text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="address">Sort by Address</option>
          </select>
          <button
            onClick={() => setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {sortOrder}
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      {loading && stores.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm font-medium">Finding stores...</p>
        </div>
      ) : stores.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto">
          <Store size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No stores found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((s) => {
            const overallScore = parseFloat(s.overall_rating || 0);
            const userRating = s.user_submitted_rating ? parseFloat(s.user_submitted_rating) : 0;
            const isSubmitting = ratingLoadingStoreId === s.id;

            return (
              <div
                key={s.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Name & Overall Rating Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1" title={s.name}>
                      {s.name}
                    </h3>
                    <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
                      <Star size={13} className="fill-amber-400 text-amber-500" />
                      <span>{overallScore.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 text-xs text-slate-500 mb-6">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2" title={s.address}>
                        {s.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate" title={s.email}>
                        {s.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Interactive Section */}
                <div className="pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Your Rating:
                    </span>
                    {userRating > 0 ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {userRating} / 5 Stars
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Not rated yet</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <StarRating
                      rating={userRating}
                      interactive={true}
                      size={24}
                      disabled={isSubmitting}
                      onChange={(star) => handleRateStore(s.id, star)}
                    />
                    <span className="text-xs text-slate-400 italic">
                      {isSubmitting ? 'Saving...' : userRating > 0 ? 'Click to change' : 'Click to rate'}
                    </span>
                  </div>
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
