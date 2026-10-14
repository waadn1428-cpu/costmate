/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageTab, Product } from './types';
import { INITIAL_PRODUCTS } from './data/mockData';
import { HeaderNavbar } from './components/HeaderNavbar';
import { Sidebar } from './components/Sidebar';
import { AddProductModal } from './components/AddProductModal';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ReportsPage } from './pages/ReportsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [currency, setCurrency] = useState<string>('ر.س');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [calculatorPreset, setCalculatorPreset] = useState<Partial<Product> | null>(null);

  // Add Product handler
  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  // Delete Product handler
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Switch to calculator with preset
  const handleOpenInCalculator = (product: Product) => {
    setCalculatorPreset(product);
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-800 flex flex-col antialiased selection:bg-[#1E1139] selection:text-white">
      {/* Top Navigation Bar */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar (Desktop persistent on Right + Mobile drawer) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          productsCount={products.length}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden pb-24 md:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardPage
              products={products}
              currency={currency}
              setActiveTab={setActiveTab}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onSelectProductForCalculator={handleOpenInCalculator}
            />
          )}

          {activeTab === 'products' && (
            <ProductsPage
              products={products}
              onDeleteProduct={handleDeleteProduct}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              currency={currency}
              onOpenInCalculator={handleOpenInCalculator}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'calculator' && (
            <CalculatorPage
              onSaveProduct={handleAddProduct}
              currency={currency}
              setActiveTab={setActiveTab}
              presetData={calculatorPreset}
            />
          )}

          {activeTab === 'analysis' && (
            <AnalysisPage
              products={products}
              currency={currency}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              products={products}
              currency={currency}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
        currency={currency}
      />
    </div>
  );
}
