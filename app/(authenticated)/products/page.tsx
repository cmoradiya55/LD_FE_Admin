"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProductManagement from '@/components/ProductManagement';

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

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleNavigate = (page: string, productId?: number) => {
    if (page === 'product-detail' && productId) {
      router.push(`/products/${productId}`);
    } else if (page === 'add-product') {
      router.push('/products/add');
    }
  };

  return (
    <ProductManagement 
      onNavigate={handleNavigate}
      products={products}
      onUpdateProducts={setProducts}
    />
  );
}