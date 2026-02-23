import { delivery } from '../constants/theme';

export function formatInr(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function deliveryChargeFromSubtotal(subtotal: number): number {
  return subtotal >= delivery.freeThreshold ? 0 : delivery.chargeBelowThreshold;
}

export function parseCategoryLabel(value: string): string {
  const trimmed = value.trim();
  const match = /^\[\[img:(.+?)\]\]\s*(.*)$/i.exec(trimmed);
  if (match) return match[2]?.trim() || trimmed;
  return trimmed;
}

export function runAsync(task: Promise<unknown>): void {
  task.catch(() => {
    // errors are handled in caller functions
  });
}
