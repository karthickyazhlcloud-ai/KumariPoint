import {
  BarChart3,
  Building2,
  ChevronRight,
  DiamondPlus,
  FolderPlus,
  LayoutDashboard,
  MapPin,
  MapPinPlus,
  Megaphone,
  Menu,
  PlusCircle,
  ReceiptText,
  Shapes,
  Wallet,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
  { label: 'Inactive businesses', icon: Building2, path: '/admin-dashboard/inactive-list' },
  { label: 'Pending submissions', icon: Wallet, path: '/admin-dashboard/pending-submission' },
  { label: 'Recent businesses', icon: BarChart3, path: '/admin-dashboard/recent-businesses' },
  { label: 'Advertisements', icon: Megaphone, path: '/admin-dashboard/advertisement-list' },
  { label: 'Renewals', icon: DiamondPlus, path: '/admin-dashboard/renewal-list' },
  { label: 'Top categories', icon: Shapes, path: '/admin-dashboard/other?view=categories' },
  { label: 'Top locations', icon: MapPin, path: '/admin-dashboard/other?view=locations' },
  { label: 'Billing & invoices', icon: ReceiptText, path: '/admin-dashboard/billing-settings' },
];

const AdminSlideBar = ({ setModalType, setIsModalOpen }) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const query = new URLSearchParams(search);

  const isActive = (item) => {
    if (item.path === '/admin-dashboard') return pathname === item.path;
    if (item.path.startsWith('/admin-dashboard/other')) {
      return pathname === '/admin-dashboard/other' && query.get('view') === item.path.split('=')[1];
    }
    return pathname === item.path || pathname.startsWith(`${item.path}/`);
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const openModal = (type) => {
    setMenuOpen(false);
    setModalType?.(type);
    setIsModalOpen?.(true);
  };

  const renderLinks = (mobile = false) => navigation.map((item) => {
    const Icon = item.icon;
    const active = isActive(item);
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => goTo(item.path)}
        aria-current={active ? 'page' : undefined}
        className={`group flex w-full items-center gap-3 rounded-xl text-left text-sm font-medium transition-colors ${
          mobile ? 'px-4 py-3.5' : 'px-3.5 py-3'
        } ${active ? 'bg-white/10 text-white' : 'text-[#A3C1AD] hover:bg-white/5 hover:text-white'}`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0 text-[#D4AF37]" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {mobile && <ChevronRight className="h-4 w-4 text-white/35" aria-hidden="true" />}
      </button>
    );
  });

  const quickActions = (
    <div className="space-y-2">
      <div className="grid grid-cols-1 justify-items-center gap-2">
        <button
          type="button"
          onClick={() => openModal('business')}
          className="flex min-h-9 w-full max-w-[190px] items-center justify-center gap-1.5 rounded-lg bg-[#D4AF37] px-2.5 py-1.5 text-[11px] font-bold text-[#1A2E26] transition-colors hover:bg-[#c29d30]"
        >
          <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" /> List Business
        </button>
        <button
          type="button"
          onClick={() => goTo('/admin-dashboard/advertisement-list?add=true')}
          className="flex min-h-9 w-full max-w-[190px] items-center justify-center gap-1.5 rounded-lg bg-[#D4AF37] px-2.5 py-1.5 text-[11px] font-bold text-[#1A2E26] transition-colors hover:bg-[#c29d30]"
        >
          <Megaphone className="h-3.5 w-3.5" aria-hidden="true" /> Add Advertisement
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => openModal('category')}
          className="flex min-h-8 items-center justify-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-white/10"
        >
          <FolderPlus className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" /> Category
        </button>
        <button
          type="button"
          onClick={() => openModal('location')}
          className="flex min-h-8 items-center justify-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-white/10"
        >
          <MapPinPlus className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" /> Location
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[#2A473C] bg-[#1A2E26] px-4 text-white shadow-sm md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-extrabold text-[#1A2E26]">KP</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5">Kumari Point</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A3C1AD]">Admin console</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open admin navigation"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#E6EEE8] transition-colors hover:bg-white/10"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            aria-label="Admin navigation"
            className="flex h-full w-[min(88vw,22rem)] flex-col bg-[#1A2E26] p-4 text-[#A3C1AD] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-[#2A473C] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-extrabold text-[#1A2E26]">KP</div>
                <div>
                  <p className="text-sm font-semibold text-white">Kumari Point</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#A3C1AD]">Admin console</p>
                </div>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close admin navigation" className="flex h-10 w-10 items-center justify-center rounded-xl text-[#A3C1AD] hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto" aria-label="Admin pages">
              {renderLinks(true)}
            </nav>
            <div className="mt-4 border-t border-[#2A473C] pt-4">
              <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A3C1AD]/70">Quick actions</p>
              {quickActions}
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden h-full w-full flex-col justify-between bg-[#1A2E26] p-5 text-[#A3C1AD] shadow-xl md:flex">
        <div className="min-h-0">
          <div className="mb-6 flex items-center gap-3 border-b border-[#2A473C] pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-extrabold text-[#1A2E26]">KP</div>
            <div className="min-w-0">
              <p className="truncate font-serif text-base font-bold tracking-wide text-white">Kumari Point</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#A3C1AD]">Admin console</p>
            </div>
          </div>
          <nav className="space-y-1 overflow-y-auto" aria-label="Admin pages">
            {renderLinks()}
          </nav>
        </div>
        <div className="mt-4 space-y-3 border-t border-[#2A473C] pt-4">
          <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A3C1AD]/70">Quick actions</p>
          {quickActions}
        </div>
      </aside>
    </>
  );
};

export default AdminSlideBar;
