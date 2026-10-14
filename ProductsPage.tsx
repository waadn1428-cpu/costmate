import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Calculator, 
  Trash2, 
  Eye, 
  Layers, 
  TrendingUp, 
  Sparkles,
  CheckCircle,
  X,
  Tag
} from 'lucide-react';
import { Product, PageTab } from '../types';
import { CATEGORIES } from '../data/mockData';

interface ProductsPageProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onOpenAddModal: () => void;
  currency: string;
  onOpenInCalculator: (product: Product) => void;
  setActiveTab: (tab: PageTab) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onDeleteProduct,
  onOpenAddModal,
  currency,
  onOpenInCalculator,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'الكل' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1E1139]">سجل المنتجات ودراسات التكلفة</h1>
            <span className="text-xs bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
              {filteredProducts.length} منتجات
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة كافة المنتجات المصنعة وتفاصيل تكلفة الوحدة وهوامش الأرباح
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 bg-[#1E1139] hover:bg-[#2B1752] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، الفئة، أو رمز SKU..."
              className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="عرض كبطاقات"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">شبكة</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-medium transition ${
                viewMode === 'table'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="عرض كجدول"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">جدول</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-slate-400 text-xs shrink-0 flex items-center gap-1 ml-2">
            <Filter className="w-3.5 h-3.5" />
            <span>التصنيف:</span>
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1E1139] text-white shadow-xs'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-900 mx-auto flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">لم يتم العثور على أي منتج</h3>
          <p className="text-xs text-slate-500">
            جرّب تغيير كلمات البحث أو اختر فئة أخرى، أو ابدأ بإضافة منتجك الأول.
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 bg-[#1E1139] text-white px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>إضافة منتج الآن</span>
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const materialsPct = product.totalBatchCost > 0
              ? Math.round((product.directMaterialsCost / product.totalBatchCost) * 100)
              : 0;
            const laborPct = product.totalBatchCost > 0
              ? Math.round((product.directLaborCost / product.totalBatchCost) * 100)
              : 0;
            const overheadPct = 100 - materialsPct - laborPct;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold tracking-wide text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                        {product.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-purple-900 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {product.sku}
                      </span>
                    </div>

                    <div className="text-left">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg inline-block ${
                          product.profitMargin >= 45
                            ? 'bg-emerald-100 text-emerald-800'
                            : product.profitMargin >= 30
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {product.profitMargin}% هامش
                      </span>
                    </div>
                  </div>

                  {/* Financial Highlights */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">تكلفة الوحدة</span>
                      <span className="text-xs font-bold text-purple-950 font-mono">
                        {product.unitCost} {currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">سعر البيع</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {product.sellingPrice} {currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">صافي الربح</span>
                      <span className="text-xs font-bold text-emerald-600 font-mono">
                        +{product.profitPerUnit} {currency}
                      </span>
                    </div>
                  </div>

                  {/* Cost Elements Progress Breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>توزيع التكلفة ({product.totalBatchCost} {currency})</span>
                      <span className="text-slate-400">{product.batchSize} وحدة</span>
                    </div>

                    <div className="h-2 rounded-full overflow-hidden flex bg-slate-100">
                      <div
                        style={{ width: `${materialsPct}%` }}
                        className="bg-[#1E1139]"
                        title={`مواد مباشرة: ${materialsPct}%`}
                      />
                      <div
                        style={{ width: `${laborPct}%` }}
                        className="bg-sky-500"
                        title={`أجور مباشرة: ${laborPct}%`}
                      />
                      <div
                        style={{ width: `${overheadPct}%` }}
                        className="bg-purple-300"
                        title={`تكاليف غير مباشرة: ${overheadPct}%`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>مواد: {product.directMaterialsCost}</span>
                      <span>أجور: {product.directLaborCost}</span>
                      <span>غير مباشر: {product.overheadCost}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenInCalculator(product)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 text-xs font-semibold shadow-2xs transition"
                      title="فتح في الحاسبة لتجربة تعديل التكاليف"
                    >
                      <Calculator className="w-3.5 h-3.5 text-sky-500" />
                      <span>الحاسبة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProductDetails(product)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition"
                      title="عرض كامل التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من رغبتك في حذف ${product.name}؟`)) {
                        onDeleteProduct(product.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="حذف المنتج"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/60">
                <tr>
                  <th className="py-3 px-4">المنتج</th>
                  <th className="py-3 px-4">الفئة</th>
                  <th className="py-3 px-4">الدفعة</th>
                  <th className="py-3 px-4">مواد مباشرة</th>
                  <th className="py-3 px-4">أجور مباشرة</th>
                  <th className="py-3 px-4">غير مباشر</th>
                  <th className="py-3 px-4">تكلفة الوحدة</th>
                  <th className="py-3 px-4">سعر البيع</th>
                  <th className="py-3 px-4">هامش الربح</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div>{prod.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{prod.sku}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{prod.category}</td>
                    <td className="py-3.5 px-4 font-mono">{prod.batchSize}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{prod.directMaterialsCost} {currency}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{prod.directLaborCost} {currency}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{prod.overheadCost} {currency}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-950">{prod.unitCost} {currency}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{prod.sellingPrice} {currency}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenInCalculator(prod)}
                          className="p-1.5 rounded-lg bg-purple-50 text-purple-900 hover:bg-purple-100 transition"
                          title="فتح في الحاسبة"
                        >
                          <Calculator className="w-3.5 h-3.5 text-sky-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedProductDetails(prod)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                          title="تفاصيل"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-[#1E1139] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-md font-semibold">
                  {selectedProductDetails.category}
                </span>
                <h3 className="font-bold text-base mt-1 text-white">
                  {selectedProductDetails.name}
                </h3>
                <span className="text-xs text-purple-200/70 font-mono">
                  {selectedProductDetails.sku}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductDetails(null)}
                className="text-purple-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Key numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">حجم الدفعة</span>
                  <span className="text-sm font-bold text-slate-800">{selectedProductDetails.batchSize} وحدة</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <span className="text-purple-700 block text-[10px]">تكلفة الوحدة</span>
                  <span className="text-sm font-bold text-purple-950">{selectedProductDetails.unitCost} {currency}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">سعر البيع</span>
                  <span className="text-sm font-bold text-slate-800">{selectedProductDetails.sellingPrice} {currency}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <span className="text-emerald-700 block text-[10px]">هامش الربح</span>
                  <span className="text-sm font-bold text-emerald-800">{selectedProductDetails.profitMargin}%</span>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800">تفاصيل تكاليف الدفعة الإجمالية:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600">المواد المباشرة (الخامات والتغليف)</span>
                    <span className="font-bold text-slate-800">{selectedProductDetails.directMaterialsCost} {currency}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600">الأجور المباشرة (أجور التصنيع)</span>
                    <span className="font-bold text-slate-800">{selectedProductDetails.directLaborCost} {currency}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-600">التكاليف الصناعية غير المباشرة (كهرباء، استهلاك)</span>
                    <span className="font-bold text-slate-800">{selectedProductDetails.overheadCost} {currency}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-purple-50/70 px-3 rounded-lg font-bold text-purple-950">
                    <span>إجمالي تكلفة الدفعة</span>
                    <span>{selectedProductDetails.totalBatchCost} {currency}</span>
                  </div>
                </div>
              </div>

              {/* Break-even point */}
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1">
                <div className="font-bold text-sky-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  <span>نقطة التعادل للدفعة</span>
                </div>
                <p className="text-sky-800">
                  تحتاج إلى بيع <strong className="font-bold">{selectedProductDetails.breakEvenUnits} وحدة</strong> فقط من أصل {selectedProductDetails.batchSize} وحدة لاسترداد كافة تكاليف الإنتاج.
                </p>
              </div>

              {selectedProductDetails.notes && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-slate-400 block text-[10px]">ملاحظات المنتج:</span>
                  <p className="text-slate-700 mt-1">{selectedProductDetails.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const prod = selectedProductDetails;
                    setSelectedProductDetails(null);
                    onOpenInCalculator(prod);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1E1139] text-white font-medium text-xs flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-sky-400" />
                  <span>تعديل وحساب في الحاسبة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProductDetails(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium text-xs hover:bg-slate-200"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
