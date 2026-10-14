import React from 'react';
import { Calculator, Plus, Menu, X, Coins, Sparkles } from 'lucide-react';
import { PageTab } from '../types';

interface HeaderNavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  currency: string;
  setCurrency: (c: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenAddModal: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenAddModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Right side (RTL start): Mobile toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Temporary text logo with modern badge */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1E1139] text-[#38BDF8] flex items-center justify-center font-bold shadow-md shadow-purple-950/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-brand font-extrabold text-xl tracking-tight text-[#1E1139]">
                  CostMate
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60">
                  كُلفة
                </span>
              </div>
              <p className="text-[10px] text-slate-600 hidden sm:block leading-none mt-0.5">
                محاسبة التكاليف للمشاريع الصغيرة
              </p>
            </div>
          </div>
        </div>

        {/* Center: Current view title pill for quick context */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>الوضع: مسودة أولية تفاعلية</span>
          <span className="text-slate-300">|</span>
          <span className="text-purple-900 font-medium">جاهز لحساب التكاليف وهوامش الربح</span>
        </div>

        {/* Left side (RTL end): Actions & Currency */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency selector */}
          <div className="flex items-center bg-slate-100/90 rounded-lg p-1 border border-slate-200/60 text-xs">
            <Coins className="w-3.5 h-3.5 text-slate-500 mr-1 ml-1" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer pr-1 pl-2 py-0.5"
            >
              <option value="ر.س">ر.س (ريال)</option>
              <option value="د.إ">د.إ (درهم)</option>
              <option value="د.ك">د.ك (دينار)</option>
              <option value="$">$ (دولار)</option>
            </select>
          </div>

          {/* Quick Add Product button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-[#1E1139] hover:bg-[#2A1852] text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">إضافة منتج</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
