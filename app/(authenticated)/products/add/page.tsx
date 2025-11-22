"use client";

import { useRouter } from 'next/navigation';
import AddProductPage from '@/components/AddProductPage';

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

export default function AddProductPageRoute() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    if (page === 'products') {
      router.push('/products');
    }
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    // In a real app, you would make an API call to add the product
    console.log('Adding product:', newProductData);
    
    // For now, just navigate back to products
    router.push('/products');
  };

  return (
    <AddProductPage
      onNavigate={handleNavigate}
      onAddProduct={handleAddProduct}
    />
  );
}