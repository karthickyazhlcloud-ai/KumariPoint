import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BusinessProfileCard from '../../components/BusinessProfileCard';
import { categoryIcons } from '../../components/PopularCategories';
import { ChevronRight, MapPin, Search, Shapes, X } from 'lucide-react';
import { mergeBusinessCategories } from '../../utils/businessCategories';

const Other = () => {
  const { adminFetch, category: adminCategories } = useAdmin();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') === 'locations' ? 'locations' : 'categories';
  const categories = mergeBusinessCategories(adminCategories);

  const [locationsList, setLocationsList] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_locations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [businessCounts, setBusinessCounts] = useState({ categories: [], locations: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const [relatedBusinesses, setRelatedBusinesses] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState('');
  const resultsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    adminFetch(`${API_URL}/api/businesses/admin/counts`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load business counts.');
        if (isMounted) setBusinessCounts(data);
      })
      .catch((error) => console.error('Could not load location and category counts:', error));
    return () => { isMounted = false; };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = new Map();
    businessCounts.categories.forEach(({ name, businessCount }) => counts.set(String(name).trim().toLocaleLowerCase(), businessCount));
    return counts;
  }, [businessCounts.categories]);
  const locationCounts = useMemo(() => {
    const counts = new Map();
    businessCounts.locations.forEach(({ name, businessCount }) => counts.set(String(name).trim().toLocaleLowerCase(), businessCount));
    return counts;
  }, [businessCounts.locations]);
  const rankedCategories = useMemo(() => [...categories].sort((left, right) => {
    const leftName = typeof left === 'object' && left !== null ? (left.name || left.categoryName || '') : left;
    const rightName = typeof right === 'object' && right !== null ? (right.name || right.categoryName || '') : right;
    const countDifference = (categoryCounts.get(String(rightName).trim().toLocaleLowerCase()) || 0)
      - (categoryCounts.get(String(leftName).trim().toLocaleLowerCase()) || 0);
    return countDifference || String(leftName).localeCompare(String(rightName));
  }), [categories, categoryCounts]);
  const rankedLocations = useMemo(() => [...locationsList].sort((left, right) => {
    const leftName = typeof left === 'object' && left !== null ? (left.locationName || '') : left;
    const rightName = typeof right === 'object' && right !== null ? (right.locationName || '') : right;
    const countDifference = (locationCounts.get(String(rightName).trim().toLocaleLowerCase()) || 0)
      - (locationCounts.get(String(leftName).trim().toLocaleLowerCase()) || 0);
    return countDifference || String(leftName).localeCompare(String(rightName));
  }), [locationsList, locationCounts]);

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const matchingCategories = useMemo(() => rankedCategories.filter((item) => {
    const name = typeof item === 'object' && item !== null ? (item.name || item.categoryName || '') : item;
    return String(name).toLocaleLowerCase().includes(normalizedSearch);
  }), [rankedCategories, normalizedSearch]);
  const matchingLocations = useMemo(() => rankedLocations.filter((item) => {
    const name = typeof item === 'object' && item !== null ? (item.locationName || '') : item;
    return String(name).toLocaleLowerCase().includes(normalizedSearch);
  }), [rankedLocations, normalizedSearch]);

  useEffect(() => {
    if (selection) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selection]);

  const selectItem = async (type, name) => {
    setSelection({ type, name });
    setRelatedBusinesses([]);
    setRelatedLoading(true);
    setRelatedError('');
    try {
      const params = new URLSearchParams({ type, name });
      const response = await adminFetch(`${API_URL}/api/businesses/admin/related?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load related businesses.');
      setRelatedBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      setRelatedError(error.message || 'Could not load related businesses.');
    } finally {
      setRelatedLoading(false);
    }
  };

  const openBusiness = (business) => navigate(`/admin-dashboard/business/${business._id}`);
  const itemClass = (type, name) => `flex w-full items-center justify-between gap-3 rounded-xl bg-[#EAEFEA]/50 p-3 text-left transition-colors hover:bg-[#EAEFEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBA55C] ${selection?.type === type && selection.name === name ? 'ring-2 ring-[#DBA55C]' : ''}`;

  return (
    <div className="flex min-h-full flex-col p-4 sm:p-5">
      <div className="mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A7022]">Business directory</p>
          <h1 className="mt-1 font-serif text-xl font-bold text-[#1A2E26] sm:text-2xl">
            {view === 'locations' ? 'Top locations' : 'Top categories'}
          </h1>
        </div>
      </div>

      <div className="sticky top-0 z-30 -mx-4 mb-3 flex justify-end bg-[#F7F8F6]/95 px-4 pb-3 pt-2 backdrop-blur-xl sm:-mx-5 sm:px-5">
        <div className={`group flex h-12 items-center rounded-2xl border bg-white shadow-[0_3px_12px_rgba(26,46,38,0.05)] transition-all duration-200 ${searchOpen ? 'w-64 max-w-full gap-3 border-[#9B853E] px-3 shadow-[0_5px_18px_rgba(26,46,38,0.1)] ring-4 ring-[#D4AF37]/10 sm:w-72' : 'w-12 justify-center border-[#E1E8E3]'}`}>
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={searchOpen ? 'Close search' : `Search ${view}`}
            aria-expanded={searchOpen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1A2E26] text-[#D4AF37] transition-colors hover:bg-[#243D32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBA55C]"
          ><Search className="h-[15px] w-[15px]" strokeWidth={2.25} aria-hidden="true" /></button>
          {searchOpen && <>
            <input
              id="admin-directory-search"
              aria-label={view === 'locations' ? 'Search locations' : 'Search categories'}
              type="text"
              inputMode="search"
              autoComplete="off"
              placeholder={view === 'locations' ? 'Search locations' : 'Search categories'}
              autoFocus
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-2 text-[13px] font-medium text-[#1A2E26] outline-none"
            />
            {searchTerm && <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[#8A958E] transition hover:bg-[#F0F4F1] hover:text-[#1A2E26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DBA55C]"
            ><X className="h-4 w-4" aria-hidden="true" /></button>}
          </>}
        </div>
      </div>

      <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-serif font-bold text-[#1A2E26]">
          {view === 'locations'
            ? <MapPin aria-hidden="true" className="h-5 w-5 text-[#D4AF37]" />
            : <Shapes aria-hidden="true" className="h-5 w-5 text-[#D4AF37]" />}
          {view === 'locations' ? 'Top locations' : 'Top categories'}
        </h2>
        <div className="space-y-2">
          {view === 'locations' ? matchingLocations.map((item, index) => {
            const name = typeof item === 'object' && item !== null ? item.locationName : item;
            const count = locationCounts.get(String(name).trim().toLocaleLowerCase()) || 0;
            return (
              <button key={item.id || name || index} type="button" onClick={() => selectItem('location', name)} aria-pressed={selection?.type === 'location' && selection.name === name} className={itemClass('location', name)}>
                <span className="min-w-0"><span className="block truncate text-xs font-bold text-[#1A2E26]">{name}</span><span className="mt-0.5 block text-[10px] text-gray-500">{count} {count === 1 ? 'business' : 'businesses'}</span></span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              </button>
            );
          }) : matchingCategories.map((item, index) => {
            const name = typeof item === 'object' && item !== null ? (item.name || item.categoryName) : item;
            const count = categoryCounts.get(String(name).trim().toLocaleLowerCase()) || 0;
            return (
              <button key={item.id || name || index} type="button" onClick={() => selectItem('category', name)} aria-pressed={selection?.type === 'category' && selection.name === name} className={itemClass('category', name)}>
                <span className="flex min-w-0 items-center gap-3">
                  <img src={item.img || categoryIcons[name] || categoryIcons.Store} className="h-10 w-10 shrink-0 rounded-full bg-white object-cover object-center p-1 shadow-sm" alt="" />
                  <span className="min-w-0"><span className="block truncate text-xs font-bold text-[#1A2E26]">{name}</span><span className="mt-0.5 block text-[10px] text-gray-500">{count} {count === 1 ? 'business' : 'businesses'}</span></span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              </button>
            );
          })}
          {((view === 'locations' && matchingLocations.length === 0) || (view !== 'locations' && matchingCategories.length === 0)) && (
            <p className="rounded-xl bg-gray-50 px-3 py-6 text-center text-xs text-gray-500">
              {normalizedSearch ? `No ${view === 'locations' ? 'locations' : 'categories'} match “${searchTerm}”.` : `No ${view === 'locations' ? 'locations' : 'categories'} found.`}
            </p>
          )}
        </div>
      </section>

      {selection && <section ref={resultsRef} className="mt-4 scroll-mt-20 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A7022]">Related businesses</p>
            <h2 className="mt-1 text-base font-serif font-bold text-[#1A2E26]">{selection.name}</h2>
          </div>
          <button type="button" onClick={() => { setSelection(null); setRelatedBusinesses([]); setRelatedError(''); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50">Close</button>
        </div>
        {relatedLoading ? <p className="py-8 text-center text-sm text-gray-500">Loading businesses…</p>
          : relatedError ? <p role="alert" className="py-8 text-center text-sm text-red-600">{relatedError}</p>
            : relatedBusinesses.length ? <div className="space-y-3">{relatedBusinesses.map((business) => <div key={business._id} role="button" tabIndex={0} onClick={() => openBusiness(business)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openBusiness(business); } }} className="cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><BusinessProfileCard businessName={business.businessName} location={business.location} category={business.category} businessIMG={business.img} businessStatus={business.status} /></div>)}</div>
              : <p className="py-8 text-center text-sm text-gray-500">No businesses are listed in this {selection.type} yet.</p>}
      </section>}
    </div>
  );
};

export default Other;
