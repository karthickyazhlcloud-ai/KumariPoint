import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import ListYourBusinessButton from './ListYourBusinessButton';

const Footer = () => {
  const [businessFormOpen, setBusinessFormOpen] = useState(false);
  const [advertisementFormOpen, setAdvertisementFormOpen] = useState(false);
  const [annualListingAmount, setAnnualListingAmount] = useState(null);
  const [annualListingPriceError, setAnnualListingPriceError] = useState('');
  const actionClass = 'cursor-pointer text-left hover:text-[#DBA55C] hover:ps-1 transition-all duration-300';
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let mounted = true;
    fetch(`${API_URL}/api/pricing`)
      .then(async (response) => {
        const pricing = await response.json();
        if (!response.ok) throw new Error(pricing.error || 'Could not load annual price.');
        const amount = Number(pricing?.listingPlan?.totalAmount);
        if (!pricing?.listingPlan || pricing.listingPlan.totalAmount == null || !Number.isFinite(amount)) {
          throw new Error('Annual listing price is missing from the pricing response.');
        }
        return amount;
      })
      .then((amount) => {
        if (mounted) setAnnualListingAmount(amount);
      })
      .catch((error) => {
        if (mounted) setAnnualListingPriceError(error.message || 'Could not load annual listing price.');
      });
    return () => { mounted = false; };
  }, [API_URL]);

  return (
    <footer className="bg-[#1C1813] text-amber-100/70 pt-16 pb-8 border-t border-white/10 w-full">
      <div className="w-[88%] mx-auto">


        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">


          <div className="space-y-4">
            <h3 className="text-[#DBA55C] font-serif font-bold text-base tracking-wide">Company</h3>
            <ul className="space-y-2.5 text-xs font-light">
              <li><a href="#" className="hover:text-[#DBA55C] hover:ps-1 transition-all duration-300">About KumariPoint</a></li>
              <li><a href="#" className="hover:text-[#DBA55C] hover:ps-1 transition-all duration-300">Contact Us</a></li>
              <li><button type="button" onClick={() => setAdvertisementFormOpen(true)} className={actionClass}>Advertise with us</button></li>
              <li><button type="button" onClick={() => setBusinessFormOpen(true)} className="cursor-pointer text-left text-[#DBA55C] font-medium hover:underline">List Your Business{annualListingAmount !== null ? ` – ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(annualListingAmount)}/year` : annualListingPriceError ? ' – price unavailable' : ''}</button></li>
            </ul>
          </div>


          <div className="space-y-4">
            <h3 className="text-[#DBA55C] font-serif font-bold text-base tracking-wide">Support</h3>
            <ul className="space-y-2.5 text-xs font-light">
              <li><a href="#" className="hover:text-[#DBA55C] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#DBA55C] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#DBA55C] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#DBA55C] transition-colors">Refund Policy</a></li>
            </ul>
          </div>


          <div className="space-y-4">
            <h3 className="text-[#DBA55C] font-serif font-bold text-base tracking-wide">For Businesses</h3>
            <ul className="space-y-2.5 text-xs font-light">
              <li><a href="#" className="hover:text-[#DBA55C] transition-all ">Why KumariPoint?</a></li>
              <li><a href="#" className="hover:text-[#DBA55C] transition-all">Success Stories</a></li>
              <li><button type="button" onClick={() => setAdvertisementFormOpen(true)} className={actionClass}>Advertise</button></li>
            </ul>
          </div>


          <div className="space-y-4">
            <h3 className="text-[#DBA55C] font-serif font-bold text-base tracking-wide">Connect</h3>


            <div className="flex flex-col text-xs  gap-4 text-[#DBA55C]">
              <a href="https://facebook.com/yazhlcloudsolutions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">Facebook</a>
              <a href="https://instagram.com/yazhlcloud_solutions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">Instagram</a>
              <a href="https://www.youtube.com/@YazhlStudio" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">YouTube</a>
              <a href="#" className="hover:text-white transition-all ">Twitter</a>
            </div>


            <div className="space-y-1.5 text-xs font-light pt-1">
              <p>support@KumariPoint.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>

        </div>


        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-amber-100/50 font-light text-center gap-3">
          <p>© 2026 KumariPoint — Local Business Directory | Rated by Local Customers</p>

          <div className="flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-[#DBA55C]" />
            <span>Advertise with us</span>
            <button type="button" onClick={() => setAdvertisementFormOpen(true)} className="cursor-pointer text-[#DBA55C] font-medium underline hover:text-white transition-colors">Click Here</button>
          </div>
        </div>

        <ListYourBusinessButton open={businessFormOpen} onOpenChange={setBusinessFormOpen} showTrigger={false} />
        <ListYourBusinessButton open={advertisementFormOpen} onOpenChange={setAdvertisementFormOpen} showTrigger={false} isAdvertisement />
      </div>
    </footer>
  );
};

export default Footer;
