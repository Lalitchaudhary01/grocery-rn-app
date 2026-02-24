import { requestApi } from './api';
import type { DeliveryAddress, Order, PaymentMethod } from '../types/models';

type OrderCreatePayload = {
  deliveryAddress: DeliveryAddress;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: PaymentMethod;
};

export async function createOrder(baseUrl: string, payload: OrderCreatePayload) {
  return requestApi<{ orderId: string; order: Order; totalAmount: number }>(baseUrl, '/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMyOrders(baseUrl: string) {
  return requestApi<{ orders: Order[] }>(baseUrl, '/api/orders/my', {
    method: 'GET',
  }, { allowFallback: true });
}
