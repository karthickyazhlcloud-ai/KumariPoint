import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import beautyParlour from '../assets/svg/beauty-parlour.svg';
import construction from '../assets/svg/construction.svg';
import education from '../assets/svg/education.svg';
import gym from '../assets/svg/gym.svg';
import homeAppliances from '../assets/svg/home-appliances.svg';
import homeService from '../assets/svg/home-service.svg';
import hospital from '../assets/svg/hospital.svg';
import hotels from '../assets/svg/hotels.svg';
import market from '../assets/svg/market.svg';
import medical from '../assets/svg/medical.svg';
import restaurant from '../assets/svg/restaurant.svg';
import salon from '../assets/svg/salon.svg';
import shop from '../assets/svg/shop.svg';
import showroom from '../assets/svg/showroom.svg';
import store from '../assets/svg/store.svg';
import superMarket from '../assets/svg/super-market.svg';
import travel from '../assets/svg/travel.svg';
import turf from '../assets/svg/turf.svg';
import video from '../assets/svg/video.svg';
import wedding from '../assets/svg/wedding.svg';

export const categoryIcons = {
  'Beauty Parlour': beautyParlour,
  Construction: construction,
  Education: education,
  Gym: gym,
  'Home Appliances': homeAppliances,
  'Home Services': homeService,
  Hospital: hospital,
  Hotels: hotels,
  Market: market,
  Medical: medical,
  Restaurant: restaurant,
  Salon: salon,
  Shop: shop,
  Showroom: showroom,
  Store: store,
  'Super Market': superMarket,
  Travel: travel,
  Turf: turf,
  Video: video,
  Wedding: wedding,
};

const categorySlug = (name) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const PopularCategories = ({ category = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let intervalId;
    const startAutoScroll = () => {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }, 1000);
    };
    const stopAutoScroll = () => clearInterval(intervalId);

    startAutoScroll();
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);
    return () => {
      stopAutoScroll();
      container.removeEventListener('mouseenter', stopAutoScroll);
      container.removeEventListener('mouseleave', startAutoScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mt-6 w-full px-4 sm:px-[5%]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-[#1C1813] sm:text-3xl">Popular Categories</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="cursor-pointer rounded-full bg-amber-100 p-2 text-amber-900 shadow-sm transition hover:bg-amber-200" aria-label="Previous categories">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scroll('right')} className="cursor-pointer rounded-full bg-amber-100 p-2 text-amber-900 shadow-sm transition hover:bg-amber-200" aria-label="Next categories">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-1 pt-2 pb-4 scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {category.map((item) => (
          <Link
            key={item.name}
            to={`/${categorySlug(item.name)}`}
            className="shrink-0 snap-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
          >
            <div className="flex h-full w-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-transparent bg-white px-3 py-5 text-center shadow-md transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:border-[#D4AF37] active:-translate-y-1 active:scale-105 active:border-[#D4AF37] sm:w-32">
              <img src={item.img || categoryIcons[item.name] || store} className="h-8 w-8 rounded-full bg-white object-cover object-center p-1 shadow" alt={item.name} loading="lazy" />
              <h3 className="w-full text-xs font-bold text-black">{item.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;
