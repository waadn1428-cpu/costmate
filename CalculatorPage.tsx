import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  CheckCircle, 
  Sparkles, 
  HelpCircle, 
  DollarSign, 
  Percent, 
  ArrowRight,
  TrendingUp,
  Layers,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { Product, MaterialItem, LaborItem, OverheadItem, PageTab } from '../types';
import { 
  DEFAULT_CALCULATOR_MATERIALS, 
  DEFAULT_CALCULATOR_LABOR, 
  DEFAULT_CALCULATOR_OVERHEAD,
  CATEGORIES 
} from '../data/mockData';

interface CalculatorPageProps {
  onSaveProduct: (product: Product) => void;
  currency: string;
  setActiveTab: (tab: PageTab) => void;
  presetData?: Partial<Product> | null;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  onSaveProduct,
  currency,
  setActiveTab,
  presetData,
}) => {
  // General Info
  const [productName, setProductName] = useState(presetData?.name || 'دفعة شمع الصويا العطري الفاخر');
  const [category, setCategory] = useState(presetData?.category || 'عطور وشموع');
  const [sku, setSku] = useState(presetData?.sku || 'CM-CALC-01');
  const [batchSize, setBatchSize] = useState<number>(presetData?.batchSize || 100);
  const [sellingPrice, setSellingPrice] = useState<number>(presetData?.sellingPrice || 45);

  // Cost items state
  const [materials, setMaterials] = useState<MaterialItem[]>(
    DEFAULT_CALCULATOR_MATERIALS
  );

  const [laborItems, setLaborItems] = useState<LaborItem[]>(
    DEFAULT_CALCULATOR_LABOR
  );

  const [overheadItems, setOverheadItems] = useState<OverheadItem[]>(
    DEFAULT_CALCULATOR_OVERHEAD
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculations
  const directMaterialsCost = materials.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const directLaborCost = laborItems.reduce((sum, item) => sum + (item.hours * item.hourlyRate * (item.workersCount || 1)), 0);
  const overheadCost = overheadItems.reduce((sum, item) => sum + item.amount, 0);

  const totalBatchCost = directMaterialsCost + directLaborCost + overheadCost;
  const safeBatchSize = Math.max(1, batchSize || 1);
  const unitCost = totalBatchCost / safeBatchSize;

  const currentSellingPrice = Number(sellingPrice) || 0;
  const profitPerUnit = currentSellingPrice - unitCost;
  const totalBatchRevenue = currentSellingPrice * safeBatchSize;
  const totalBatchProfit = totalBatchRevenue - totalBatchCost;
  const profitMargin = currentSellingPrice > 0 ? (profitPerUnit / currentSellingPrice) * 100 : 0;
  const breakEvenUnits = currentSellingPrice > 0 ? Math.ceil(totalBatchCost / currentSellingPrice) : 0;
  const markupPercentage = unitCost > 0 ? ((currentSellingPrice - unitCost) / unitCost) * 100 : 0;

  // Percentage breakdown
  const materialsPct = totalBatchCost > 0 ? Math.round((directMaterialsCost / totalBatchCost) * 100) : 0;
  const laborPct = totalBatchCost > 0 ? Math.round((directLaborCost / totalBatchCost) * 100) : 0;
  const overheadPct = 100 - materialsPct - laborPct;

  // Handlers for Materials
  const handleAddMaterial = () => {
    const newItem: MaterialItem = {
      id: `m-${Date.now()}`,
      name: '',
      quantity: 1,
      unit: 'قطعة',
      unitPrice: 0,
      totalPrice: 0,
    };
    setMaterials([...materials, newItem]);
  };

  const handleUpdateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    setMaterials(materials.map((m) => {
      if (m.id !== id) return m;
      const updated = { ...m, [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updated.totalPrice = updated.quantity * updated.unitPrice;
      }
      return updated;
    }));
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  // Handlers for Labor
  const handleAddLabor = () => {
    const newItem: LaborItem = {
      id: `l-${Date.now()}`,
      task: '',
      hours: 1,
      hourlyRate: 30,
      workersCount: 1,
      totalCost: 30,
    };
    setLaborItems([...laborItems, newItem]);
  };

  const handleUpdateLabor = (id: string, field: keyof LaborItem, value: any) => {
    setLaborItems(laborItems.map((l) => {
      if (l.id !== id) return l;
      const updated = { ...l, [field]: value };
      if (field === 'hours' || field === 'hourlyRate' || field === 'workersCount') {
        updated.totalCost = updated.hours * updated.hourlyRate * (updated.workersCount || 1);
      }
      return updated;
    }));
  };

  const handleRemoveLabor = (id: string) => {
    setLaborItems(laborItems.filter((l) => l.id !== id));
  };

  // Handlers for Overhead
  const handleAddOverhead = () => {
    const newItem: OverheadItem = {
      id: `o-${Date.now()}`,
      category: '',
      amount: 50,
    };
    setOverheadItems([...overheadItems, newItem]);
  };

  const handleUpdateOverhead = (id: string, field: keyof OverheadItem, value: any) => {
    setOverheadItems(overheadItems.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  };

  const handleRemoveOverhead = (id: string) => {
    setOverheadItems(overheadItems.filter((o) => o.id !== id));
  };

  // Reset to empty
  const handleReset = () => {
    if (confirm('هل ترغب في تفريغ بيانات الحاسبة؟')) {
      setProductName('');
      setBatchSize(50);
      setSellingPrice(0);
      setMaterials([]);
      setLaborItems([]);
      setOverheadItems([]);
    }
  };

  // Preset quick markup helper
  const handleApplyMarkup = (targetMarginPct: number) => {
    if (unitCost <= 0) return;
    // sellingPrice = unitCost / (1 - targetMarginPct / 100)
    const suggestedPrice = Math.round((unitCost / (1 - targetMarginPct / 100)) * 10) / 10;
    setSellingPrice(suggestedPrice);
  };

  // Save to Product list
  const handleSaveToProducts = () => {
    if (!productName.trim()) {
      alert('يرجى تحديد اسم المنتج أولاً');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      sku: sku.trim() || `CM-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      batchSize: safeBatchSize,
      directMaterialsCost: Math.round(directMaterialsCost),
      directLaborCost: Math.round(directLaborCost),
      overheadCost: Math.round(overheadCost),
      totalBatchCost: Math.round(totalBatchCost),
      unitCost: Number(unitCost.toFixed(2)),
      sellingPrice: Number(currentSellingPrice),
      profitPerUnit: Number(profitPerUnit.toFixed(2)),
      profitMargin: Number(profitMargin.toFixed(1)),
      breakEvenUnits,
      createdAt: new Date().toISOString().split('T')[0],
      notes: 'تمت إضافته عبر حاسبة التكاليف التفاعلية',
    };

    onSaveProduct(newProduct);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1E1139]">حاسبة التكاليف الفورية</h1>
            <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
              محاسبة تكاليف ثلاثية
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            أدخل المواد المباشرة، الأجور المباشرة، والتكاليف الصناعية غير المباشرة لحساب تكلفة الوحدة والتسعير الأمثل
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تفريغ</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToProducts}
            className="flex items-center gap-1.5 bg-[#1E1139] hover:bg-[#2B1752] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Save className="w-4 h-4 text-sky-400" />
            <span>حفظ كمنتج في السجل</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ المنتج بنجاح في سجل المنتجات!</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className="font-bold underline text-emerald-900"
          >
            الانتقال للمنتجات
          </button>
        </div>
      )}

      {/* Main Grid: Inputs (Col 1-2) & Result Panel (Col 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: 4 Core Input Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 0: Batch & Product Metadata */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center text-xs font-bold">
                  ★
                </span>
                معلومات المنتج وكمية إنتاج الدفعة
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">اسم المنتج أو الدفعة</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="مثال: دفعة شوكولاتة محشوة بالفستق..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">التصنيف</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-purple-600 outline-none bg-white"
                >
                  {CATEGORIES.filter((c) => c !== 'الكل').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  كمية الإنتاج للدفعة (عدد الوحدات المنتجة)
                </label>
                <input
                  type="number"
                  min="1"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-purple-600 outline-none font-bold text-purple-950"
                />
                <span className="text-[10px] text-slate-400">
                  سيتم تقسيم إجمالي تكاليف الدفعة على هذه الكمية لحساب تكلفة الوحدة
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  سعر البيع المقترح للوحدة الواحدة
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-purple-600 outline-none font-bold text-emerald-700"
                  />
                  <span className="absolute left-3 top-2 text-xs text-slate-400">{currency}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                  <span>اقتراح هوامش سريعة:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyMarkup(30)}
                    className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    30%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyMarkup(50)}
                    className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyMarkup(70)}
                    className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    70%
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Direct Materials (المواد المباشرة) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#1E1139] text-sky-400 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  المواد المباشرة (Direct Materials)
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  الخامات الأساسية والمكونات ومواد التغليف والتعبئة المستهلكة في الدفعة
                </p>
              </div>

              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">إجمالي المواد</span>
                <span className="text-sm font-bold text-purple-950 font-mono">
                  {directMaterialsCost.toLocaleString()} {currency}
                </span>
              </div>
            </div>

            {/* Materials Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">اسم الخامة / البند</th>
                    <th className="py-2.5 px-3 w-20">الكمية</th>
                    <th className="py-2.5 px-3 w-24">الوحدة</th>
                    <th className="py-2.5 px-3 w-28">سعر الوحدة ({currency})</th>
                    <th className="py-2.5 px-3 w-28">الإجمالي ({currency})</th>
                    <th className="py-2.5 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {materials.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateMaterial(item.id, 'name', e.target.value)}
                          placeholder="مثال: شمع، زيوت، كرتون..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleUpdateMaterial(item.id, 'quantity', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none text-center font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateMaterial(item.id, 'unit', e.target.value)}
                          placeholder="كجم/قطعة"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none text-center"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateMaterial(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-800 font-mono">
                        {(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddMaterial}
              className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-xl text-xs font-semibold text-purple-900 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-sky-500" />
              <span>إضافة مادة خام جديدة</span>
            </button>
          </div>

          {/* Section 2: Direct Labor (الأجور المباشرة) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-500 text-purple-950 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  الأجور المباشرة (Direct Labor)
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ساعات العمل الفعلية المخصصة لتصنيع هذه الدفعة وتجهيزها
                </p>
              </div>

              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">إجمالي الأجور</span>
                <span className="text-sm font-bold text-purple-950 font-mono">
                  {directLaborCost.toLocaleString()} {currency}
                </span>
              </div>
            </div>

            {/* Labor Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">مهمة العمل / المرحلة</th>
                    <th className="py-2.5 px-3 w-24">ساعات العمل</th>
                    <th className="py-2.5 px-3 w-28">أجر الساعة ({currency})</th>
                    <th className="py-2.5 px-3 w-24">عدد العمال</th>
                    <th className="py-2.5 px-3 w-28">الإجمالي ({currency})</th>
                    <th className="py-2.5 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laborItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.task}
                          onChange={(e) => handleUpdateLabor(item.id, 'task', e.target.value)}
                          placeholder="مثال: الخلط، التشكيل، التعبئة..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.hours}
                          onChange={(e) => handleUpdateLabor(item.id, 'hours', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none text-center font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.hourlyRate}
                          onChange={(e) => handleUpdateLabor(item.id, 'hourlyRate', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          value={item.workersCount || 1}
                          onChange={(e) => handleUpdateLabor(item.id, 'workersCount', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none text-center font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-800 font-mono">
                        {(item.hours * item.hourlyRate * (item.workersCount || 1)).toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLabor(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddLabor}
              className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-xl text-xs font-semibold text-purple-900 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-sky-500" />
              <span>إضافة بند أجر مباشر جديد</span>
            </button>
          </div>

          {/* Section 3: Manufacturing Overhead (التكاليف الصناعية غير المباشرة) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-200 text-purple-950 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  التكاليف الصناعية غير المباشرة (Manufacturing Overhead)
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  مصاريف الكهرباء، إهلاك المعدات والأدوات، الإيجار الجزئي، ومستهلكات التشغيل
                </p>
              </div>

              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">إجمالي غير المباشرة</span>
                <span className="text-sm font-bold text-purple-950 font-mono">
                  {overheadCost.toLocaleString()} {currency}
                </span>
              </div>
            </div>

            {/* Overhead Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">بند المصروف غير المباشر</th>
                    <th className="py-2.5 px-3 w-40">المبلغ الموزع على الدفعة ({currency})</th>
                    <th className="py-2.5 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overheadItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => handleUpdateOverhead(item.id, 'category', e.target.value)}
                          placeholder="مثال: كهرباء الورشة، استهلاك قوالب الصب..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.amount}
                          onChange={(e) => handleUpdateOverhead(item.id, 'amount', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-purple-600 outline-none font-mono"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveOverhead(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddOverhead}
              className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-xl text-xs font-semibold text-purple-900 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-sky-500" />
              <span>إضافة بند تكلفة غير مباشرة</span>
            </button>
          </div>
        </div>

        {/* Right Side: Sticky Live Calculation Results Sidebar */}
        <div className="space-y-5">
          <div className="sticky top-20 bg-white rounded-2xl border border-purple-200/80 shadow-md p-5 space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-500" />
                لوحة النتائج الفورية
              </span>
              <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                حساب آلي حي
              </span>
            </div>

            {/* Prime Metric: Unit Cost */}
            <div className="bg-[#1E1139] text-white p-5 rounded-xl text-center space-y-1 shadow-sm relative overflow-hidden">
              <span className="text-xs text-sky-300 font-medium block">
                تكلفة إنتاج الوحدة الواحدة (Unit Cost)
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">
                {unitCost.toFixed(2)} <span className="text-sm font-normal text-purple-200">{currency}</span>
              </div>
              <p className="text-[10px] text-purple-200/80 mt-1">
                مقسومة على {safeBatchSize} وحدة في الدفعة
              </p>
              <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-sky-500/10 rounded-full blur-xl" />
            </div>

            {/* Financial Summary Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">إجمالي تكاليف الدفعة:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {totalBatchCost.toLocaleString()} {currency}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">سعر البيع المقترح للوحدة:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {currentSellingPrice} {currency}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">صافي ربح الوحدة:</span>
                <span className={`font-bold font-mono ${profitPerUnit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {profitPerUnit >= 0 ? '+' : ''}{profitPerUnit.toFixed(2)} {currency}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">إجمالي إيراد الدفعة المتوقع:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {totalBatchRevenue.toLocaleString()} {currency}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">إجمالي صافي ربح الدفعة:</span>
                <span className={`font-bold font-mono ${totalBatchProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {totalBatchProfit >= 0 ? '+' : ''}{totalBatchProfit.toLocaleString()} {currency}
                </span>
              </div>

              <div className="flex justify-between py-1.5 bg-slate-50 px-3 rounded-lg items-center">
                <span className="text-slate-700 font-semibold">نسبة هامش الربح:</span>
                <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${
                  profitMargin >= 40
                    ? 'bg-emerald-100 text-emerald-800'
                    : profitMargin >= 25
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {profitMargin.toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between py-1.5 bg-slate-50 px-3 rounded-lg items-center">
                <span className="text-slate-700 font-semibold">نسبة إضافة التكلفة (Markup):</span>
                <span className="font-bold text-purple-950 text-xs">
                  {markupPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Break-Even Highlight */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs space-y-1">
              <div className="font-bold text-purple-950 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-purple-700" />
                <span>نقطة التعادل (Break-Even)</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                تحتاج إلى بيع <strong className="text-purple-900 font-bold">{breakEvenUnits} وحدة</strong> لتغطية مصاريف هذه الدفعة البالغة {totalBatchCost.toLocaleString()} {currency}. كل وحدة تباع بعدها تمثل ربحًا خالصًا.
              </p>
            </div>

            {/* Cost Elements Progress Bar in Result Card */}
            <div className="space-y-1.5 text-xs pt-1">
              <span className="text-[11px] text-slate-500 block">نسب عناصر التكلفة في الدفعة:</span>
              <div className="h-3 rounded-full overflow-hidden flex bg-slate-100">
                <div style={{ width: `${materialsPct}%` }} className="bg-[#1E1139]" title="مواد" />
                <div style={{ width: `${laborPct}%` }} className="bg-sky-500" title="أجور" />
                <div style={{ width: `${overheadPct}%` }} className="bg-purple-300" title="غير مباشر" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>مواد: {materialsPct}%</span>
                <span>أجور: {laborPct}%</span>
                <span>غير مباشر: {overheadPct}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSaveToProducts}
                className="w-full py-2.5 rounded-xl bg-[#1E1139] hover:bg-[#2B1752] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <Save className="w-4 h-4 text-sky-400" />
                <span>حفظ في سجل المنتجات</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('analysis')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <span>تحليل هذا المنتج في الرسوم البيانية</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
