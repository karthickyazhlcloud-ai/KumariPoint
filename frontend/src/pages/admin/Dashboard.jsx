import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import BusinessProfileCard from '../../components/BusinessProfileCard'; // Path-ai ungaloda project-ku etha maatri check pannikonga

const Dashboard = () => {
  const { businesses, category, locationsList, handleApprove, handleDelete } = useAdmin();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const [searchName, setSearchName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const filteredBusinessesList = useMemo(() => {
    if (!businesses) return [];

    return businesses.filter((b) => {

      const matchesSearch = searchName
        ? (b.businessName?.toLowerCase().includes(searchName.toLowerCase()) ||
          b.category?.toLowerCase().includes(searchName.toLowerCase()) ||
          b.location?.toLowerCase().includes(searchName.toLowerCase()))
        : true;


      const matchesCategory = selectedCategory
        ? b.category === selectedCategory
        : true;


      const matchesLocation = selectedLocation
        ? b.location === selectedLocation
        : true;


      let matchesDate = true;
      if (startDate || endDate) {
        const itemDate = new Date(b.createdAt || b.date);
        itemDate.setHours(0, 0, 0, 0);

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (itemDate < start) matchesDate = false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
  }, [businesses, searchName, selectedCategory, selectedLocation, startDate, endDate]);

  const stats = useMemo(() => {
    if (!businesses) return {
      totalBusinesses: 0,
      todaysListings: 0,
      upcomingRenewals: [],
      expiredListings: [],
      inactiveListings: 0,
      categories: 0,
      locations: 0,
    };

    const filteredBusinesses = businesses.filter((b) => {
      if (!startDate || !endDate) return true;
      const createdDate = new Date(b.createdAt || b.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return createdDate >= start && createdDate <= end;
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysCount = filteredBusinesses.filter(b => {
      const bDate = new Date(b.createdAt || b.date).toISOString().split('T')[0];
      return bDate === todayStr;
    }).length;

    const currentDate = new Date();
    const expiredListings = filteredBusinesses.filter(b =>
      b.status === 'expired' || (b.expiryDate && new Date(b.expiryDate) < currentDate)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const upcomingRenewals = filteredBusinesses.filter(b => {
      if (b.status !== 'active' || !b.expiryDate) return false;
      const expDate = new Date(b.expiryDate);
      return expDate >= today && expDate <= nextWeek;
    });

    const inactiveListings = filteredBusinesses.filter(b => b.status === 'inactive').length;

    return {
      totalBusinesses: filteredBusinesses.length,
      todaysListings: todaysCount,
      upcomingRenewals,
      expiredListings,
      inactiveListings,
      categories: category ? category.length : 0,
      locations: locationsList ? locationsList.length : 0,
    };
  }, [businesses, category, locationsList, startDate, endDate]);

  console.log("filteredBusinessesList", filteredBusinessesList)

  if (!businesses) {
    return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-full p-4 sm:p-6 md:p-8">


      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1813]">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Overview of your business metrics and platform performance.</p>
        </div>


        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-xs sm:flex sm:flex-wrap sm:gap-3 sm:p-2.5 lg:w-auto">
          <span className="col-span-3 text-xs font-semibold text-gray-600 sm:col-span-1">Filter range</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Filter start date"
            className="min-w-0 w-full rounded-xl border border-gray-300 bg-white px-2 py-2 text-xs outline-none focus:border-[#D4AF37] sm:w-auto sm:p-1.5"
          />
          <span className="text-center text-xs text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="Filter end date"
            className="min-w-0 w-full rounded-xl border border-gray-300 bg-white px-2 py-2 text-xs outline-none focus:border-[#D4AF37] sm:w-auto sm:p-1.5"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className="col-span-3 justify-self-end text-[11px] font-medium text-red-600 hover:underline sm:ml-2 sm:justify-self-auto"
            >
              Clear
            </button>
          )}
        </div>
      </div>


      <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:gap-5 lg:grid-cols-4">


        <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:min-h-32 sm:p-5">
          <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-sm">Total businesses</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">{stats.totalBusinesses}</h3>
        </div>


        <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:min-h-32 sm:p-5">
          <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-sm">Today&apos;s listings</p>
          <h3 className="mt-2 text-2xl font-bold text-blue-600 sm:text-3xl">+{stats.todaysListings}</h3>
        </div>


        <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:min-h-32 sm:p-5">
          <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-sm">Upcoming renewals</p>
          <h3 className="mt-2 text-2xl font-bold text-amber-600 sm:text-3xl">
            {stats.upcomingRenewals.length}
          </h3>
        </div>


        <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:min-h-32 sm:p-5">
          <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-sm">Expired listings</p>
          <h3 className="mt-2 text-2xl font-bold text-red-500 sm:text-3xl">
            {stats.expiredListings.length}
          </h3>
        </div>


        <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:min-h-32 sm:p-5">
          <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-sm">Inactive listings</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-400 sm:text-3xl">{stats.inactiveListings}</h3>
        </div>


        <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:min-h-32 sm:p-5">
          <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-sm">Categories</p>
          <h3 className="mt-2 text-2xl font-bold text-purple-600 sm:text-3xl">{stats.categories}</h3>
        </div>


        <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:min-h-32 sm:p-5">
          <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-sm">Locations</p>
          <h3 className="mt-2 text-2xl font-bold text-emerald-600 sm:text-3xl">{stats.locations}</h3>
        </div>

      </div>


      <div className="mb-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-[#1C1813] sm:text-2xl">Businesses</h2>
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 items-center">


            <input
              type="text"
              placeholder="Search by business name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="text-xs border border-gray-300 p-2.5 rounded-xl outline-none focus:border-[#D4AF37] w-full md:flex-1 bg-white"
            />


            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-gray-300 p-2.5 rounded-xl outline-none focus:border-[#D4AF37] w-full md:w-48 bg-white"
            >
              <option value="">All Categories</option>
              {category && category.map((cat, idx) => {
                const catName = typeof cat === 'string' ? cat : (cat.name || cat.category || cat.categoryName);


                const count = businesses ? businesses.filter(b => b.category === catName).length : 0;

                return (
                  <option key={idx} value={catName}>
                    {catName} ({count})
                  </option>
                );
              })}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs border border-gray-300 p-2.5 rounded-xl outline-none focus:border-[#D4AF37] w-full md:w-48 bg-white"
            >
              <option value="">All Locations</option>
              {locationsList && locationsList.map((loc, idx) => {
                const locName = typeof loc === 'string' ? loc : (loc.locationName || loc.name || loc.location);


                const count = businesses ? businesses.filter(b => b.location === locName).length : 0;

                return (
                  <option key={idx} value={locName}>
                    {locName} ({count})
                  </option>
                );
              })}
            </select>


            <button
              onClick={() => {
                setSearchName('');
                setSelectedCategory('');
                setSelectedLocation('');
              }}
              className="text-xs font-semibold bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors w-full md:w-auto cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>


      <div className="mt-4 flex flex-col gap-3">
        {filteredBusinessesList && filteredBusinessesList.length > 0 ? (
          filteredBusinessesList.map((business) => (
            <div
              key={business._id}
              className="w-full cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              onClick={() => navigate(`/admin-dashboard/business/${business._id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/admin-dashboard/business/${business._id}`);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${business.businessName}`}
            >
              <BusinessProfileCard
                businessIMG={business.img}
                businessName={business.businessName}
                businessStatus={business.status}
                category={business.category}
                location={business.location}
                createdAt={business.createdAt}
                renewalat={business.expiryDate}
              />
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 text-center py-6 bg-white rounded-2xl border border-gray-200">
            No businesses found.
          </p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
