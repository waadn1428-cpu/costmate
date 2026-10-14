export type PageTab = 'dashboard' | 'products' | 'calculator' | 'analysis' | 'reports';

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface LaborItem {
  id: string;
  task: string;
  hours: number;
  hourlyRate: number;
  workersCount: number;
  totalCost: number;
}

export interface OverheadItem {
  id: string;
  category: string;
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  batchSize: number; // كمية الدفعة
  directMaterialsCost: number; // تكلفة المواد المباشرة
  directLaborCost: number; // تكلفة الأجور المباشرة
  overheadCost: number; // التكاليف غير المباشرة
  totalBatchCost: number; // إجمالي تكلفة الدفعة
  unitCost: number; // تكلفة إنتاج الوحدة
  sellingPrice: number; // سعر البيع المقترح للوحدة
  profitPerUnit: number; // صافي الربح لكل وحدة
  profitMargin: number; // نسبة هامش الربح %
  breakEvenUnits: number; // نقطة التعادل بالوحدات
  notes?: string;
  materials?: MaterialItem[];
  createdAt: string;
}

export interface CostCalculationState {
  productName: string;
  category: string;
  batchSize: number;
  sellingPrice: number;
  materials: MaterialItem[];
  laborItems: LaborItem[];
  overheadItems: OverheadItem[];
}
