import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Sliders, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  Info,
  DollarSign,
  Package
} from 'lucide-react';
import { Product, PageTab } from '../types';

interface AnalysisPageProps {
  products: Product[];
  currency: string;
  setActiveTab: (tab: PageTab) => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  products,
  currency,
  setActiveTab,
}) => {
  // Simulator State
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [materialCostDelta, setMaterialCostDelta] = useState<number>(0); // -30% to +50%
  const [priceDelta, setPriceDelta] = useState<number>(0); // -30% to +50%

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Calculated simulated values
  const baseMaterials = selectedProduct ? selectedProduct.directMaterialsCost : 0;
  const simulatedMaterials = baseMaterials * (1 + materialCostDelta / 100);
  const simulatedBatchCost = selectedProduct
    ? simulatedMaterials + selectedProduct.directLaborCost + selectedProduct.overheadCost
    : 0;
  const simulatedUnitCost = selectedProduct && selectedProduct.batchSize > 0
    ? simulatedBatchCost / selectedProduct.batchSize
    : 0;
  const baseSellingPrice = selectedProduct ? selectedProduct.sellingPrice : 0;
  const simulatedPrice = baseSellingPrice * (1 + priceDelta / 100);
  const simulatedProfitPerUnit = simulatedPrice - simulatedUnitCost;
  const simulatedMargin = simulatedPrice > 0
    ? (simulatedProfitPerUnit / simulatedPrice) * 100
    : 0;
  const simulatedBreakEven = simulatedPrice > 0
    ? Math.ceil(simulatedBatchCost / simulatedPrice)
    : 0;

  // Averages
  const avgUnitCost = products.length > 0
    ? (products.reduce((acc, p) => acc + p.unitCost, 0) / products.length).toFixed(2)
    : '0';
  const avgSellingPrice = products.length > 0
    ? (products.reduce((acc, p) => acc + p.sellingPrice, 0) / products.length).toFixed(2)
    : '0';
  const avgProfit = products.length > 0
    ? (products.reduce((acc, p) => acc + p.profitPerUnit, 0) / products.length).toFixed(2)
    : '0';
  const avgMargin = products.length > 0
    ? (products.reduce((acc, p) => acc + p.profitMargin, 0) / products.length).toFixed(1)
    : '0';

  // Find max values for chart scale
  const maxPrice = Math.max(...products.map((p) => p.sellingPrice), 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1E1139]">التحليل المالي وهيكل التكاليف</h1>
            <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
              تحليل تفاعلي
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مقارنة تكلفة الوحدة مقابل سعر البيع، وتحليل هوامش الأرباح ومحاكاة تغير الأسعار
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            تم تحليل {products.length} منتجات في الورشة
          </span>
        </div>
      </div>

      {/* 4 Average Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">متوسط تكلفة الوحدة</span>
          <div className="text-xl font-bold text-purple-950 font-mono mt-1">
            {avgUnitCost} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">تكلفة الإنتاج المباشرة وغير المباشرة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">متوسط سعر البيع</span>
          <div className="text-xl font-bold text-slate-800 font-mono mt-1">
            {avgSellingPrice} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">سعر السوق المقترح للعميل</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">متوسط ربح القطعة</span>
          <div className="text-xl font-bold text-emerald-600 font-mono mt-1">
            +{avgProfit} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">الفارق الصافي للوحدة الواحدة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">متوسط هامش الربح</span>
          <div className="text-xl font-bold text-[#1E1139] mt-1">
            {avgMargin}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">معدل ممتاز للمشاريع الصغيرة</span>
        </div>
      </div>

      {/* Chart 1: Unit Cost vs Selling Price Bar Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" />
              مقارنة تكلفة الوحدة وسعر البيع لكل منتج
            </h2>
            <p className="text-xs text-slate-500">
              الشريط الداكن يمثل تكلفة إنتاج الوحدة، والشريط السماوي يمثل سعر البيع للمستهلك
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-[#1E1139] inline-block" />
              تكلفة الوحدة
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-sky-500 inline-block" />
              سعر البيع
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              صافي الربح
            </span>
          </div>
        </div>

        {/* Visual Comparison Bars */}
        <div className="space-y-4 pt-3">
          {products.map((prod) => {
            const costBarWidth = (prod.unitCost / maxPrice) * 100;
            const priceBarWidth = (prod.sellingPrice / maxPrice) * 100;

            return (
              <div key={prod.id} className="space-y-1.5 p-3 rounded-xl hover:bg-slate-50/80 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{prod.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({prod.category})</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-purple-950 font-bold">
                      تكلفة: {prod.unitCost} {currency}
                    </span>
                    <span className="text-sky-700 font-bold">
                      بيع: {prod.sellingPrice} {currency}
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      ربح: +{prod.profitPerUnit} {currency} ({prod.profitMargin}%)
                    </span>
                  </div>
                </div>

                {/* Double Bar Visual */}
                <div className="space-y-1">
                  {/* Selling Price Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      style={{ width: `${Math.min(100, Math.max(5, priceBarWidth))}%` }}
                      className="bg-sky-500 rounded-full transition-all duration-500 flex items-center justify-end pr-1 text-[9px] text-white font-bold"
                    />
                  </div>
                  {/* Cost Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                    <div
                      style={{ width: `${Math.min(100, Math.max(5, costBarWidth))}%` }}
                      className="bg-[#1E1139] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator */}
      {selectedProduct && (
        <div className="bg-gradient-to-br from-white via-purple-50/20 to-sky-50/30 p-6 rounded-2xl border border-purple-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-900" />
                <h2 className="text-base font-bold text-[#1E1139]">
                  أداة محاكاة الحساسية (What-If Scenario Simulator)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                اختبر أثر تغيّر أسعار المواد الخام أو تعديل سعر البيع على هامش الربح ونقطة التعادل فوريًا
              </p>
            </div>

            {/* Select Product to Simulate */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 shrink-0">اختر المنتج للمحاكاة:</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setMaterialCostDelta(0);
                  setPriceDelta(0);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:border-purple-600 outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Sliders */}
            <div className="space-y-5 bg-white p-5 rounded-xl border border-slate-200/70 shadow-xs">
              {/* Slider 1: Material Cost Change */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    تغير تكلفة المواد الخام:
                  </span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                    materialCostDelta > 0 
                      ? 'bg-rose-100 text-rose-800' 
                      : materialCostDelta < 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {materialCostDelta > 0 ? `+${materialCostDelta}% ارتفاع` : materialCostDelta < 0 ? `${materialCostDelta}% انخفاض` : 'بدون تغيير (0%)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  step="5"
                  value={materialCostDelta}
                  onChange={(e) => setMaterialCostDelta(Number(e.target.value))}
                  className="w-full accent-purple-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-30% تخفيض تكلفة المواد</span>
                  <span>الأساس 0%</span>
                  <span>+50% ارتفاع أسعار المواد</span>
                </div>
              </div>

              {/* Slider 2: Selling Price Change */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    تعديل سعر البيع المستهدف:
                  </span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                    priceDelta > 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : priceDelta < 0 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {priceDelta > 0 ? `+${priceDelta}% زيادة السعر` : priceDelta < 0 ? `${priceDelta}% خصم` : 'بدون تغيير (0%)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  step="5"
                  value={priceDelta}
                  onChange={(e) => setPriceDelta(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-30% تخفيض السعر</span>
                  <span>السعر الحالي</span>
                  <span>+50% رفع السعر</span>
                </div>
              </div>

              {/* Reset Sliders */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMaterialCostDelta(0);
                    setPriceDelta(0);
                  }}
                  className="text-xs text-purple-900 font-semibold hover:underline"
                >
                  إعادة ضبط للمؤشرات الأصلية
                </button>
              </div>
            </div>

            {/* Right: Simulation Output Card */}
            <div className="bg-[#1E1139] text-white p-5 rounded-xl flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <span className="text-xs text-sky-300 font-semibold block mb-1">
                  نتائج السيناريو المتوقع: {selectedProduct.name}
                </span>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 rounded-lg bg-white/10 space-y-0.5">
                    <span className="text-[10px] text-purple-200 block">تكلفة الوحدة المحاكاة:</span>
                    <span className="text-base font-bold font-mono text-white">
                      {simulatedUnitCost.toFixed(2)} {currency}
                    </span>
                    <span className="text-[9px] text-purple-300 block">
                      (الأصل: {selectedProduct.unitCost} {currency})
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/10 space-y-0.5">
                    <span className="text-[10px] text-purple-200 block">سعر البيع المحاكى:</span>
                    <span className="text-base font-bold font-mono text-sky-300">
                      {simulatedPrice.toFixed(2)} {currency}
                    </span>
                    <span className="text-[9px] text-purple-300 block">
                      (الأصل: {selectedProduct.sellingPrice} {currency})
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/10 space-y-0.5">
                    <span className="text-[10px] text-purple-200 block">صافي ربح الوحدة الجديد:</span>
                    <span className={`text-base font-bold font-mono ${simulatedProfitPerUnit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {simulatedProfitPerUnit >= 0 ? '+' : ''}{simulatedProfitPerUnit.toFixed(2)} {currency}
                    </span>
                    <span className="text-[9px] text-purple-300 block">
                      (الأصل: +{selectedProduct.profitPerUnit} {currency})
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/10 space-y-0.5">
                    <span className="text-[10px] text-purple-200 block">هامش الربح المحاكى:</span>
                    <span className={`text-base font-bold font-mono ${simulatedMargin >= 30 ? 'text-emerald-400' : 'text-amber-300'}`}>
                      {simulatedMargin.toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-purple-300 block">
                      (الأصل: {selectedProduct.profitMargin}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Assessment Note */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs">
                <span className="text-sky-300 font-bold block mb-0.5">التقييم المحاسبي للسيناريو:</span>
                <p className="text-purple-200/90 text-[11px] leading-relaxed">
                  {simulatedMargin < 20
                    ? 'تحذير: هذا السيناريو يؤدي إلى انخفاض هامش الربح لأقل من 20%، مما يعرض المشروع لمخاطر العجز في تغطية المصاريف الطارئة.'
                    : simulatedMargin >= 50
                    ? 'ممتاز: هذا السيناريو يمنح المشروع هامش ربح استثنائي ومرونة عالية لتقديم عروض ترويجية وتسويقية مريحة.'
                    : 'جيد: هامش الربح ضمن النطاق المتوازن لمعظم المشروعات الصغيرة والحرفية.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Reduction & Pricing Tips for Small Businesses */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-700" />
          قواعد ذهبية في تسعير المنتجات وإدارة التكاليف
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h3 className="font-bold text-purple-950">1. لا تسعّر على أساس الخامات فقط</h3>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              الخطأ الشائع للمبتدئين هو احتساب سعر المنتج كضعف تكلفة المواد الخام وتجاهل أجور الوقت والجهد وتكاليف الكهرباء والتغليف.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h3 className="font-bold text-purple-950">2. وفر في شراء المواد بالجملة</h3>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              شراء المواد الخام بكميات أكبر يخفض تكلفة الوحدة مباشرة بنسبة تصل إلى 25%، مما يرفع هامش ربحك دون الحاجة لزيادة الأسعار.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h3 className="font-bold text-purple-950">3. احسب نسبة الهدر الطبيعي (Spoilage)</h3>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              في الصناعات الغذائية والشموع والحرف، يحدث هدر وتلف يتراوح بين 3% إلى 7%؛ أضف هذا الهدر ضمن تكلفة المواد لضمان دقة الأرقام.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
