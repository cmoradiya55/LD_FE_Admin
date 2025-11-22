"use client";

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductDetailPage from '@/components/ProductDetailPage';
import { LoadingSpinner } from '@/components/common';

// Mock product data (this should match the data in products/page.tsx)
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

export default function ProductDetailPageRoute() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productId = parseInt(params.id as string);
    const foundProduct = initialProducts.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [params.id]);

  const handleNavigate = (page: string) => {
    if (page === 'products') {
      router.push('/products');
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProduct(updatedProduct);
    // In a real app, you would also update the global state or make an API call
  };

  const handleDeleteProduct = (productId: number) => {
    // In a real app, you would make an API call to delete the product
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPage
      product={product}
      onNavigate={handleNavigate}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
    />
  );
}