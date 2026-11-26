import React, { useState, useEffect } from 'react';
import BusinessProfileCard from '../../components/BusinessProfileCard';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const RecentBusinesses = () => {

  const API_URL = import.meta.env.VITE_API_URL;
  const { businesses } = useAdmin();
  const navigate = useNavigate();


  return (
    <div>
      <div className="min-h-full p-4 sm:p-6">
        <h3 className="mb-4 font-serif text-lg font-bold text-[#1A2E26] sm:text-xl">Recent businesses</h3>
        <div className="space-y-3">
          {businesses.length > 0 ? (
            businesses.map((b, idx) => (
              <BusinessProfileCard
                key={b._id || idx}
                businessName={b.businessName}
                location={b.location}
                createdAt={b.createdAt}
                renewalat={b.expiryDate}
                category={b.category}
                businessIMG={b.img}
                businessStatus={b.status}
                buttonOnClick={() => navigate(`/admin-dashboard/business/${b._id}`)}
              />
            ))
          ) : (
            <p className="text-xs text-gray-500 py-3">No businesses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentBusinesses;
