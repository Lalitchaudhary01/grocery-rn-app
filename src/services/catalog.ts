import { requestApi } from './api';
import type { Category, Product } from '../types/models';

export async function getProducts(baseUrl: string) {
  return requestApi<{ products: Product[] }>(baseUrl, '/api/products');
}

export async function getCategories(baseUrl: string) {
  return requestApi<{ categories: Category[] }>(baseUrl, '/api/categories');
}
