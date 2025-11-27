"use client";

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../app/(authenticated)/dashboard/Dashboard';
import AddProductPage from './AddProductPage';
import NotificationScreen from '../app/(authenticated)/notifications/NotificationScreen';
import ChangePasswordScreen from '../app/(authenticated)/settings/change-password/ChangePasswordScreen';
import UserComponent from '../app/(authenticated)/users/UserComponent';
import CityComponent from '../app/(authenticated)/city/CityComponent';
import InspectionCenterComponent from '../app/(authenticated)/inspectionCenter/InspectionCenterComponent';
import CarComponent from '../app/(authenticated)/car/CarComponent';
import ProfileScreen from '@/app/(authenticated)/profile/ProfileScreen';

// Mock product data
const initialProducts = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    description: 'Apple MacBook Pro with M2 chip, 16-inch display',
    price: 2499.99,
    category: 'Electronics',
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design and A17 Pro chip',
    price: 999.99,
    category: 'Electronics',
    stock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    createdAt: '2024-02-01'
  },
  {
    id: 3,
    name: 'Office Chair Pro',
    description: 'Ergonomic office chair with lumbar support',
    price: 299.99,
    category: 'Furniture',
    stock: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    createdAt: '2024-01-20'
  },
  {
    id: 4,
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    price: 199.99,
    category: 'Electronics',
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    createdAt: '2024-01-10'
  }
];

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  image: string;
  createdAt: string;
}

interface AdminLayoutProps {
  onLogout: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function AdminLayout({ onLogout, user }: AdminLayoutProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleBackFromProfile = () => {
    setShowProfile(false);
  };

  const handleNavigate = (page: string, productId?: number) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    } else {
      setSelectedProductId(null);
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: Math.max(...products.map(p => p.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const getBackButtonProps = () => {
    switch (currentPage) {
      case 'product-detail':
        return {
          showBackButton: true,
          onBackClick: () => handleNavigate('products'),
          backButtonLabel: 'Back to Products'
        };
      case 'add-product':
        return {
          showBackButton: true,
          onBackClick: () => handleNavigate('products'),
          backButtonLabel: 'Back to Products'
        };
      case 'change-password':
        return {
          showBackButton: true,
          onBackClick: () => handleNavigate('settings'),
          backButtonLabel: 'Back to Settings'
        };
      default:
        return {
          showBackButton: false
        };
    }
  };

  const renderContent = () => {
    if (showProfile) {
      return <ProfileScreen onBack={handleBackFromProfile} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserComponent />;
      case 'city':
        return <CityComponent />;
      case 'inspectionCenter':
        return <InspectionCenterComponent />;
      case 'car':
        return <CarComponent />;
      case 'notifications':
        return <NotificationScreen />;
      case 'profile':
        return <ProfileScreen onBack={() => setCurrentPage('dashboard')} />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Settings page content goes here...</p>
            </div>
          </div>
        );
      case 'change-password':
        return <ChangePasswordScreen onBack={() => setCurrentPage('settings')} />;
      default:
        return <Dashboard />;
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={onLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={handleMobileMenuClose}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={onLogout}
          onProfileClick={handleProfileClick}
          onNotificationClick={() => handleNavigate('notifications')}
          onMobileMenuClick={handleMobileMenuToggle}
          user={user}
          {...getBackButtonProps()}
        />
        
        <main className="flex-1 overflow-y-auto p-1.5 sm:p-2 md:p-3 lg:p-4">
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}