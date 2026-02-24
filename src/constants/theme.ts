export const colors = {
  primary: '#0a8f39',
  accent: '#ffcd00',
  background: '#f4f7f3',
  surface: '#ffffff',
  text: '#111827',
  subText: '#4b5563',
  border: '#d1d5db',
  successBg: '#dcfce7',
  warningBg: '#fef3c7',
  dangerBg: '#fee2e2',
} as const;

export const delivery = {
  freeThreshold: 200,
  chargeBelowThreshold: 25,
} as const;

export const image = {
  fallback:
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
} as const;

export const upi = {
  id: '8923541428@axl',
  number: '8923541428',
  name: 'Mrs Aneeta',
  qrImageUrl: 'https://grocery-app-flame-eight.vercel.app/phonepe-qr.jpeg',
} as const;
