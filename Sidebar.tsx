import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  TrendingUp, 
  FileText, 
  Sparkles,
  Info,
  ChevronLeft
} from 'lucide-react';
import { PageTab } from '../types';

interface SidebarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  productsCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  productsCount,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navItems = [
    {
      id: 'dashboard' as PageTab,
      label: 'الرئيسية',
      description: 'ملخص الإنتاج والتكاليف',
      icon: LayoutDashboard,
    },
    {
      id: 'products' as PageTab,
      label: 'المنتجات',
      description: 'إدارة وتفاصيل المنتجات',
      icon: Package,
      badge: productsCount,
    },
    {
      id: 'calculator' as PageTab,
      label: 'حاسبة التكاليف',
      description: 'حساب عناصر التكلفة الفورية',
      icon: Calculator,
      highlight: true,
    },
    {
      id: 'analysis' as PageTab,
      label: 'التحليل',
      description: 'هوامش الربح والرسوم البيانية',
      icon: TrendingUp,
    },
    {
      id: 'reports' as PageTab,
      label: 'التقارير',
      description: 'كشوف وملخصات التكاليف',
      icon: FileText,
    },
  ];

  const handleNavClick = (tab: PageTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar: Desktop persistent + Mobile slide-over drawer */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-72 bg-[#1E1139] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 no-print ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col flex-1 overflow-y-auto">
          {/* Mobile top close button & title */}
          <div className="flex md:hidden items-center justify-between pb-4 mb-4 border-b border-purple-900/60">
            <div className="flex items-center gap-2">
              <span className="font-brand font-bold text-lg text-white">CostMate</span>
              <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">كُلفة</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-purple-300 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Section Label */}
          <div className="text-[11px] font-semibold text-purple-300/70 tracking-wider uppercase mb-3 px-2">
            قائمة التنقل
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-right transition-all group ${
                    isActive
                      ? 'bg-purple-900/80 text-white shadow-inner font-semibold border-r-4 border-sky-400'
                      : 'text-purple-200/80 hover:bg-purple-950/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-sky-400 text-purple-950 shadow-sm'
                          : item.highlight
                          ? 'bg-sky-500/20 text-sky-300 group-hover:bg-sky-400/30'
                          : 'bg-purple-900/40 text-purple-200 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm leading-tight flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.highlight && !isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        )}
                      </div>
                      <div className="text-[11px] text-purple-300/60 truncate mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-900/60 text-purple-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mini Helper Box in Sidebar */}
          <div className="mt-6 p-3.5 rounded-xl bg-purple-950/80 border border-purple-800/40 text-right">
            <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>معادلة التكلفة الأساسية</span>
            </div>
            <p className="text-[11px] text-purple-200/70 leading-relaxed">
              تكلفة الوحدة = (المواد المباشرة + الأجور + التكاليف غير المباشرة) ÷ حجم الدفعة
            </p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-purple-900/60 text-center text-xs text-purple-300/60">
          <div className="flex items-center justify-center gap-1.5 text-slate-300 text-xs">
            <span className="font-brand font-bold text-white">CostMate</span>
            <span>·</span>
            <span>كُلفة v1.0</span>
          </div>
          <p className="text-[10px] text-purple-300/50 mt-1">
            مصمم خصيصًا للمشاريع الصغيرة والإنتاج الحرفي
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar for quick access */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#1E1139]/95 backdrop-blur-md border-t border-purple-900/60 md:hidden flex justify-around items-center px-1 py-1.5 no-print text-white">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors min-w-[56px] ${
                isActive ? 'text-sky-300' : 'text-purple-300/70 hover:text-purple-100'
              }`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-purple-900 text-sky-300' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
