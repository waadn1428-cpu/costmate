import React, { useState } from 'react';
import { X, Plus, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../data/mockData';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  currency: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  currency,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1] || 'عطور وشموع');
  const [batchSize, setBatchSize] = useState<number>(50);
  const [directMaterialsCost, setDirectMaterialsCost] = useState<number>(500);
  const [directLaborCost, setDirectLaborCost] = useState<number>(250);
  const [overheadCost, setOverheadCost] = useState<number>(150);
  const [sellingPrice, setSellingPrice] = useState<number>(25);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Real-time calculations
  const totalCost = (directMaterialsCost || 0) + (directLaborCost || 0) + (overheadCost || 0);
  const calculatedBatchSize = Math.max(1, batchSize || 1);
  const unitCost = totalCost / calculatedBatchSize;
  const currentSellingPrice = sellingPrice || 0;
  const profitPerUnit = currentSellingPrice - unitCost;
  const profitMargin = currentSellingPrice > 0 ? (profitPerUnit / currentSellingPrice) * 100 : 0;
  const breakEvenUnits = currentSellingPrice > 0 ? Math.ceil(totalCost / currentSellingPrice) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة اسم المنتج');
      return;
    }
    if (batchSize <= 0) {
      setError('يجب أن تكون كمية الإنتاج أكبر من الصفر');
      return;
    }
    if (sellingPrice <= 0) {
      setError('يرجى تحديد سعر البيع المستهدف');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      sku: sku.trim() || `CM-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      batchSize: Number(batchSize),
      directMaterialsCost: Number(directMaterialsCost) || 0,
      directLaborCost: Number(directLaborCost) || 0,
      overheadCost: Number(overheadCost) || 0,
      totalBatchCost: totalCost,
      unitCost: Number(unitCost.toFixed(2)),
      sellingPrice: Number(sellingPrice),
      profitPerUnit: Number(profitPerUnit.toFixed(2)),
      profitMargin: Number(profitMargin.toFixed(1)),
      breakEvenUnits,
      notes: notes.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddProduct(newProduct);
    onClose();
    // Reset form
    setName('');
    setSku('');
    setNotes('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#1E1139] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">إضافة منتج وتكلفة جديدة</h3>
              <p className="text-xs text-purple-200/80">
                أدخل تفاصيل التكاليف لحساب تكلفة الوحدة وهامش الربح تلقائيًا
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-purple-200 hover:text-white p-1 rounded-lg hover:bg-purple-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                اسم المنتج <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: صابون طبيعي باللافندر، كيكة عسل..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">الفئة</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition bg-white"
              >
                {CATEGORIES.filter((c) => c !== 'الكل').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Batch Size & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                كمية إنتاج الدفعة (عدد الوحدات) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
              <span className="text-[10px] text-slate-400">عدد القطع المنتجة من هذه المواد</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">رمز المنتج (SKU اختياري)</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="مثال: CM-SOAP-01"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>
          </div>

          {/* Cost Inputs Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
            <div className="text-xs font-bold text-[#1E1139] flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-sky-500" />
              <span>عناصر تكلفة الدفعة الإجمالية ({currency})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-medium">1. المواد المباشرة</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={directMaterialsCost}
                    onChange={(e) => setDirectMaterialsCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-purple-600 outline-none"
                  />
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">{currency}</span>
                </div>
                <span className="text-[10px] text-slate-400">الخامات والتغليف الأولي</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-medium">2. الأجور المباشرة</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={directLaborCost}
                    onChange={(e) => setDirectLaborCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-purple-600 outline-none"
                  />
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">{currency}</span>
                </div>
                <span className="text-[10px] text-slate-400">أجور ساعات عمل التصنيع</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-medium">3. تكاليف صناعية غير مباشرة</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={overheadCost}
                    onChange={(e) => setOverheadCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-purple-600 outline-none"
                  />
                  <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">{currency}</span>
                </div>
                <span className="text-[10px] text-slate-400">كهرباء، استهلاك، أدوات</span>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                سعر البيع المقترح للوحدة <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none font-bold text-purple-900"
                />
                <span className="absolute left-3 top-2 text-xs text-slate-400">{currency}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ملاحظات إضافية</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: خصم خاص للموزعين أو تفاصيل التغليف"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-600 outline-none"
              />
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">إجمالي تكلفة الدفعة:</span>
              <span className="font-bold text-slate-800 text-sm">
                {totalCost.toLocaleString()} {currency}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">تكلفة الوحدة الواحدة:</span>
              <span className="font-bold text-purple-900 text-sm">
                {unitCost.toFixed(2)} {currency}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">ربح الوحدة:</span>
              <span className={`font-bold text-sm ${profitPerUnit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {profitPerUnit.toFixed(2)} {currency}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">هامش الربح:</span>
              <span className={`font-bold text-sm px-2 py-0.5 rounded-md ${
                profitMargin >= 40 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : profitMargin >= 20 
                  ? 'bg-sky-100 text-sky-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#1E1139] hover:bg-[#2A1852] text-white shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>حفظ المنتج في القائمة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
