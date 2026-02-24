import { requestApi } from './api';
import type { Category, Order, OrderStatus, Product } from '../types/models';

export async function adminLogin(baseUrl: string, payload: { email: string; password: string }) {
  return requestApi<{ user: { id: string; role: 'ADMIN' } }>(baseUrl, '/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { allowFallback: true });
}

export async function adminLogout(baseUrl: string) {
  return requestApi<{ message: string }>(baseUrl, '/api/auth/logout', { method: 'POST' }, {
    allowFallback: true,
  });
}

export async function getAdminOrders(baseUrl: string) {
  return requestApi<{ orders: Order[] }>(baseUrl, '/api/orders/admin', undefined, {
    allowFallback: true,
  });
}

export async function updateOrderStatus(
  baseUrl: string,
  orderId: string,
  payload: { status?: OrderStatus; paymentStatus?: 'PENDING_VERIFICATION' | 'VERIFIED' | 'FAILED'; cancelReason?: string },
) {
  return requestApi<{ message: string; order: Order }>(baseUrl, `/api/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, { allowFallback: true });
}

export async function createProduct(
  baseUrl: string,
  payload: {
    name: string;
    description?: string | null;
    price: number;
    mrp?: number | null;
    stock: number;
    unit?: string | null;
    discountPercent?: number | null;
    imageUrl?: string | null;
    categoryId: string;
    isActive?: boolean;
  },
) {
  return requestApi<{ product: Product }>(baseUrl, '/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { allowFallback: true });
}

export async function updateProduct(
  baseUrl: string,
  productId: string,
  payload: Partial<{
    name: string;
    description: string | null;
    price: number;
    mrp: number | null;
    stock: number;
    unit: string | null;
    discountPercent: number | null;
    imageUrl: string | null;
    categoryId: string;
    isActive: boolean;
  }>,
) {
  return requestApi<{ product: Product }>(baseUrl, `/api/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, { allowFallback: true });
}

export async function deleteProduct(baseUrl: string, productId: string) {
  return requestApi<{ message: string }>(baseUrl, `/api/products/${productId}`, {
    method: 'DELETE',
  }, { allowFallback: true });
}

export async function createCategory(baseUrl: string, payload: { name: string }) {
  return requestApi<{ category: Category }>(baseUrl, '/api/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { allowFallback: true });
}

export async function updateCategory(baseUrl: string, categoryId: string, payload: { name: string }) {
  return requestApi<{ category: Category }>(baseUrl, `/api/categories/${categoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, { allowFallback: true });
}

export async function deleteCategory(baseUrl: string, categoryId: string) {
  return requestApi<{ message: string }>(baseUrl, `/api/categories/${categoryId}`, {
    method: 'DELETE',
  }, { allowFallback: true });
}
