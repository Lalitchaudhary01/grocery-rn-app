import { requestApi } from './api';
import type { User } from '../types/models';

export async function customerRegister(baseUrl: string, payload: { name: string; mobile: string }) {
  return requestApi<{ message: string }>(baseUrl, '/api/auth/customer-register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function customerLogin(baseUrl: string, payload: { mobile: string }) {
  return requestApi<{ user: User }>(baseUrl, '/api/auth/customer-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function customerMe(baseUrl: string) {
  return requestApi<{ user: User }>(baseUrl, '/api/auth/customer-me');
}

export async function customerLogout(baseUrl: string) {
  return requestApi<{ message: string }>(baseUrl, '/api/auth/customer-logout', {
    method: 'POST',
  });
}
