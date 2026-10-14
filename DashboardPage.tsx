import React from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  ArrowRight,
  PieChart, 
  AlertCircle, 
  Plus, 
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Product, PageTab } from '../types';

interface DashboardPageProps {
  products: Product[];
  currency: string;
  setActiveTab: (tab: PageTab) => void;
  onOpenAddModal: () => void;
  onSelectProductForCalculator: (product: Product) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  products,
  currency,
  setActiveTab,
  onOpenAddModal,
  onSelectProductForCalculator,
}) => {
  // Aggregate Metrics
  const totalCost = products.reduce((acc, p) => acc + p.totalBatchCost, 0);
  const totalRevenue = products.reduce((acc, p) => acc + (p.sellingPrice * p.batchSize), 0);
  const totalProfit = totalRevenue - totalCost;
  const avgMargin = products.length > 0
    ? (products.reduce((acc, p) => acc + p.profitMargin, 0) / products.length).toFixed(1)
    : '0';

  const totalMaterials = products.reduce((acc, p) => acc + p.directMaterialsCost, 0);
  const totalLabor = products.reduce((acc, p) => acc + p.directLaborCost, 0);
  const totalOverhead = products.reduce((acc, p) => acc + p.overheadCost, 0);

  const materialsPercent = totalCost > 0 ? Math.round((totalMaterials / totalCost) * 100) : 0;
  const laborPercent = totalCost > 0 ? Math.round((totalLabor / totalCost) * 100) : 0;
  const overheadPercent = totalCost > 0 ? (100 - materialsPercent - laborPercent) : 0;

  // Best product by margin
  const topMarginProduct = [...products].sort((a, b) => b.profitMargin - a.profitMargin)[0];
  const lowestMarginProduct = [...products].sort((a, b) => a.profitMargin - b.profitMargin)[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#1E1139] via-[#2A1550] to-[#1E1139] text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-sky-300 text-xs font-medium border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>لوحة القيادة والمتابعة المالية</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              مرحبًا بك في منصة CostMate (كُلفة)
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              احسب التكاليف الحقيقية لمنتجاتك بدقة، وتعرّف على تكلفة كل وحدة، وحدد أسعار البيع التي تضمن لك هامش ربح مستدام لمشروعك الصغير.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-purple-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              <span>فتح حاسبة التكاليف</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
            >
              <Plus className="w-4 h-4 text-sky-300" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -top-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">إجمالي تكاليف الإنتاج</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-900">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">
              {totalCost.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">{currency}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>مجموع تكاليف {products.length} دفعات إنتاج</span>
            <span className="text-purple-700 font-medium">تشمل كافة المصاريف</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">إجمالي الإيرادات المتوقعة</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">
              {totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">{currency}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>عند بيع كامل الدفعات</span>
            <span className="text-sky-600 font-medium">سعر السوق</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">صافي الأرباح المتوقعة</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-600">
              +{totalProfit.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">{currency}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>الفارق بين الإيراد والتكلفة</span>
            <span className="text-emerald-700 font-medium font-semibold">ربح صافٍ</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">متوسط هامش الربح</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#1E1139]">{avgMargin}%</span>
            <span className="text-xs font-semibold text-emerald-600">معدل ممتاز</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>متوسط كافة منتجات الورشة</span>
            <span className="text-purple-700 font-medium">فوق الحد الأدنى 30%</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Cost Composition Breakdown & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Structure Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">هيكل تكاليف الإنتاج الكلي</h2>
              <p className="text-xs text-slate-500">
                توزيع المصاريف على العناصر الثلاثة الأساسية لمحاسبة التكاليف
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-semibold border border-purple-100">
              إجمالي: {totalCost.toLocaleString()} {currency}
            </span>
          </div>

          {/* Visual multi-segmented bar */}
          <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 my-4 shadow-inner">
            <div 
              style={{ width: `${materialsPercent}%` }} 
              className="bg-[#1E1139] hover:opacity-90 transition-all"
              title={`المواد المباشرة: ${materialsPercent}%`}
            />
            <div 
              style={{ width: `${laborPercent}%` }} 
              className="bg-sky-500 hover:opacity-90 transition-all"
              title={`الأجور المباشرة: ${laborPercent}%`}
            />
            <div 
              style={{ width: `${overheadPercent}%` }} 
              className="bg-purple-300 hover:opacity-90 transition-all"
              title={`التكاليف غير المباشرة: ${overheadPercent}%`}
            />
          </div>

          {/* Breakdown Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E1139] inline-block"></span>
                  المواد المباشرة
                </span>
                <span className="text-xs font-bold text-slate-900">{materialsPercent}%</span>
              </div>
              <p className="text-sm font-bold text-purple-950">
                {totalMaterials.toLocaleString()} <span className="text-[10px] text-slate-500">{currency}</span>
              </p>
              <p className="text-[10px] text-slate-400">الخامات، المكونات، وعبوات التغليف</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
                  الأجور المباشرة
                </span>
                <span className="text-xs font-bold text-slate-900">{laborPercent}%</span>
              </div>
              <p className="text-sm font-bold text-purple-950">
                {totalLabor.toLocaleString()} <span className="text-[10px] text-slate-500">{currency}</span>
              </p>
              <p className="text-[10px] text-slate-400">ساعات عمل الصناع والمساعدين</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-300 inline-block"></span>
                  تكاليف صناعية غير مباشرة
                </span>
                <span className="text-xs font-bold text-slate-900">{overheadPercent}%</span>
              </div>
              <p className="text-sm font-bold text-purple-950">
                {totalOverhead.toLocaleString()} <span className="text-[10px] text-slate-500">{currency}</span>
              </p>
              <p className="text-[10px] text-slate-400">الكهرباء، استهلاك المعدات، الصيانة</p>
            </div>
          </div>
        </div>

        {/* Highlights & Top performers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">أبرز مؤشرات المنتجات</h2>
            <p className="text-xs text-slate-500 mb-4">أعلى المنتجات ربحية وأكثرها استهلاكًا</p>

            {topMarginProduct && (
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 mb-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    المنتج الأعلى هامش ربح
                  </span>
                  <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md text-[11px]">
                    {topMarginProduct.profitMargin}%
                  </span>
                </div>
                <div className="font-semibold text-slate-800 text-xs truncate">
                  {topMarginProduct.name}
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>تكلفة: {topMarginProduct.unitCost} {currency}</span>
                  <span className="text-emerald-700 font-bold">بيع: {topMarginProduct.sellingPrice} {currency}</span>
                </div>
              </div>
            )}

            {lowestMarginProduct && (
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/60 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-900 font-bold flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    المنتج الأكثر تكلفة إنتاج
                  </span>
                  <span className="text-slate-700 font-bold text-[11px]">
                    {lowestMarginProduct.unitCost} {currency}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 text-xs truncate">
                  {lowestMarginProduct.name}
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>هامش الربح: {lowestMarginProduct.profitMargin}%</span>
                  <span className="text-purple-700 font-bold">ربح: {lowestMarginProduct.profitPerUnit} {currency}</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('analysis')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <span>انتقل إلى صفحة التحليل الموسعة</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Table: Recent Products */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">ملخص المنتجات المحسوبة</h2>
            <p className="text-xs text-slate-500">
              قائمة المنتجات مع تفكيك تكلفة الوحدة وهامش الربح
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className="text-xs font-semibold text-purple-900 hover:text-purple-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>عرض كل المنتجات ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/60">
              <tr>
                <th className="py-3 px-4">اسم المنتج</th>
                <th className="py-3 px-4">الفئة</th>
                <th className="py-3 px-4">كمية الدفعة</th>
                <th className="py-3 px-4">تكلفة الوحدة</th>
                <th className="py-3 px-4">سعر البيع</th>
                <th className="py-3 px-4">ربح الوحدة</th>
                <th className="py-3 px-4">هامش الربح</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.slice(0, 5).map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div>{prod.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{prod.sku}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{prod.category}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {prod.batchSize} وحدة
                  </td>
                  <td className="py-3.5 px-4 font-bold text-purple-950 font-mono">
                    {prod.unitCost} {currency}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                    {prod.sellingPrice} {currency}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                    +{prod.profitPerUnit} {currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        prod.profitMargin >= 45
                          ? 'bg-emerald-100 text-emerald-800'
                          : prod.profitMargin >= 30
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prod.profitMargin}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectProductForCalculator(prod)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 hover:bg-purple-100 font-medium text-[11px] transition"
                      title="فتح بيانات هذا المنتج في حاسبة التكاليف"
                    >
                      <Calculator className="w-3 h-3 text-sky-500" />
                      <span>الحاسبة</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Small Business Cost Accounting Advice */}
      <div className="bg-gradient-to-r from-purple-50/80 via-white to-sky-50/60 p-5 rounded-2xl border border-purple-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#1E1139] text-[#38BDF8] shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1E1139]">
              نصيحة محاسبية لأصحاب المشاريع الصغيرة
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
              لا تتجاهل التكاليف غير المباشرة (الكهرباء، استهلاك الأدوات، مصاريف الشحن والتغليف) عند التسعير، ولا تحتسب وقتك الشخصي كصفر. إدراج كافة العناصر يضمن حماية مشروعك من التآكل المالي.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className="shrink-0 px-4 py-2 rounded-xl bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 text-xs font-semibold shadow-2xs transition"
        >
          عرض تقرير التكاليف
        </button>
      </div>
    </div>
  );
};
