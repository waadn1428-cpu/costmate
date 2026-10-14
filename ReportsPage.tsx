import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Filter, 
  CheckCircle, 
  Layers, 
  Calendar,
  Building,
  Coins,
  Sparkles
} from 'lucide-react';
import { Product, PageTab } from '../types';
import { CATEGORIES } from '../data/mockData';

interface ReportsPageProps {
  products: Product[];
  currency: string;
  setActiveTab: (tab: PageTab) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  products,
  currency,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [businessName, setBusinessName] = useState('مشروعي الصغير للإنتاج الحرفي');

  // Filter
  const filteredProducts = products.filter(
    (p) => selectedCategory === 'الكل' || p.category === selectedCategory
  );

  // Totals
  const totalBatchSize = filteredProducts.reduce((sum, p) => sum + p.batchSize, 0);
  const totalMaterials = filteredProducts.reduce((sum, p) => sum + p.directMaterialsCost, 0);
  const totalLabor = filteredProducts.reduce((sum, p) => sum + p.directLaborCost, 0);
  const totalOverhead = filteredProducts.reduce((sum, p) => sum + p.overheadCost, 0);
  const totalBatchCost = filteredProducts.reduce((sum, p) => sum + p.totalBatchCost, 0);
  const totalRevenue = filteredProducts.reduce((sum, p) => sum + (p.sellingPrice * p.batchSize), 0);
  const totalProfit = totalRevenue - totalBatchCost;
  const avgMargin = filteredProducts.length > 0
    ? (filteredProducts.reduce((sum, p) => sum + p.profitMargin, 0) / filteredProducts.length).toFixed(1)
    : '0';

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'اسم المنتج',
      'الرمز SKU',
      'التصنيف',
      'حجم الدفعة',
      'المواد المباشرة',
      'الأجور المباشرة',
      'التكاليف غير المباشرة',
      'إجمالي تكلفة الدفعة',
      'تكلفة الوحدة',
      'سعر البيع',
      'ربح الوحدة',
      'هامش الربح %',
      'نقطة التعادل',
    ];

    const rows = filteredProducts.map((p) => [
      `"${p.name}"`,
      `"${p.sku}"`,
      `"${p.category}"`,
      p.batchSize,
      p.directMaterialsCost,
      p.directLaborCost,
      p.overheadCost,
      p.totalBatchCost,
      p.unitCost,
      p.sellingPrice,
      p.profitPerUnit,
      p.profitMargin,
      p.breakEvenUnits,
    ]);

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Arabic support in Excel
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_تكاليف_المنتجات_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1E1139]">تقرير ملخص تكاليف المنتجات</h1>
            <span className="text-xs bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
              جاهز للطباعة والتصدير
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            كشف تحليلي محاسبي شامل لعناصر تكاليف المواد، الأجور، وهوامش الربحية
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Category filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1.5 rounded-xl border border-slate-200/60 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5 text-purple-700" />
            <span className="hidden sm:inline">تصدير CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#1E1139] hover:bg-[#2B1752] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Official Printable Report Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Printable Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-brand font-extrabold text-2xl text-[#1E1139]">CostMate</span>
              <span className="text-xs bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded border border-sky-200/60">
                كُلفة
              </span>
            </div>
            <p className="text-xs text-slate-500">
              نظام محاسبة التكاليف وإدارة هوامش الأرباح للمشاريع الصغيرة
            </p>
          </div>

          <div className="text-left space-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="font-bold text-slate-800">{businessName}</span>
              <Building className="w-3.5 h-3.5 text-purple-900" />
            </div>
            <div className="flex items-center gap-1.5 justify-end text-slate-500">
              <span>تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-center gap-1.5 justify-end text-slate-500">
              <span>العملة المعتمدة: {currency}</span>
              <Coins className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Executive Summary Cards in Report */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-center">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">عدد المنتجات بالتقرير</span>
            <span className="text-lg font-bold text-slate-800">{filteredProducts.length} منتج</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-medium">إجمالي تكلفة الدفعات</span>
            <span className="text-lg font-bold text-purple-950 font-mono">
              {totalBatchCost.toLocaleString()} {currency}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-medium">إجمالي الإيراد المتوقع</span>
            <span className="text-lg font-bold text-slate-800 font-mono">
              {totalRevenue.toLocaleString()} {currency}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-medium">متوسط هامش الربح</span>
            <span className="text-lg font-bold text-emerald-700">
              {avgMargin}%
            </span>
          </div>
        </div>

        {/* Detailed Accounting Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-[#1E1139] text-white">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">اسم المنتج</th>
                <th className="py-3 px-3">الفئة</th>
                <th className="py-3 px-3">حجم الدفعة</th>
                <th className="py-3 px-3">مواد مباشرة</th>
                <th className="py-3 px-3">أجور مباشرة</th>
                <th className="py-3 px-3">غير مباشر</th>
                <th className="py-3 px-3">إجمالي التكلفة</th>
                <th className="py-3 px-3">تكلفة الوحدة</th>
                <th className="py-3 px-3">سعر البيع</th>
                <th className="py-3 px-3">ربح الوحدة</th>
                <th className="py-3 px-3">الهامش %</th>
                <th className="py-3 px-3">التعادل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((p, index) => (
                <tr key={p.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{index + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <div>{p.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{p.category}</td>
                  <td className="py-2.5 px-3 font-mono">{p.batchSize}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{p.directMaterialsCost}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{p.directLaborCost}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{p.overheadCost}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.totalBatchCost}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-purple-950 bg-purple-50/40">
                    {p.unitCost}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.sellingPrice}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">+{p.profitPerUnit}</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                        p.profitMargin >= 45
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.profitMargin >= 30
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.profitMargin}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{p.breakEvenUnits} وحدة</td>
                </tr>
              ))}
            </tbody>
            {/* Summary Footer Row */}
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={3} className="py-3 px-3 text-center">
                  الإجمالي العام ({filteredProducts.length} منتجات)
                </td>
                <td className="py-3 px-3 font-mono">{totalBatchSize}</td>
                <td className="py-3 px-3 font-mono">{totalMaterials.toLocaleString()}</td>
                <td className="py-3 px-3 font-mono">{totalLabor.toLocaleString()}</td>
                <td className="py-3 px-3 font-mono">{totalOverhead.toLocaleString()}</td>
                <td className="py-3 px-3 font-mono text-purple-950">{totalBatchCost.toLocaleString()} {currency}</td>
                <td className="py-3 px-3 font-mono text-slate-600">-</td>
                <td className="py-3 px-3 font-mono text-slate-600">-</td>
                <td className="py-3 px-3 font-mono text-emerald-700">+{totalProfit.toLocaleString()}</td>
                <td className="py-3 px-3 text-emerald-800">{avgMargin}% (متوسط)</td>
                <td className="py-3 px-3">-</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Cost Analysis Note & Verification Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-5 text-xs text-slate-600">
          <div className="space-y-1">
            <span className="font-bold text-slate-800 block">ملاحظات التحليل المحاسبي:</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              • تم احتساب تكلفة الوحدة بناءً على طريقة التكلفة الكلية (Absorption Costing) التي تشمل التكاليف المباشرة وغير المباشرة.
              <br />
              • نقطة التعادل تشير إلى الحد الأدنى من المبيعات لتغطية تكاليف التشغيل المباشرة والتشغيلية الموزعة.
            </p>
          </div>

          <div className="flex flex-col items-end justify-end space-y-1 text-left">
            <span className="text-[10px] text-slate-400">توقيع المراجعة والاعتماد:</span>
            <div className="w-48 border-b border-dashed border-slate-400 pt-6"></div>
            <span className="text-[10px] text-slate-500">مسؤول الحسابات والتسعير</span>
          </div>
        </div>
      </div>
    </div>
  );
};
