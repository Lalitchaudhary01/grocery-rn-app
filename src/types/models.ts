export type AuthRole = 'CUSTOMER' | 'ADMIN';

export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  mrp?: number;
  unit?: string | null;
  stock: number;
  imageUrl?: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  } | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type PaymentMethod = 'UPI_QR' | 'COD';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'FAILED';

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl?: string | null;
  };
};

export type Order = {
  id: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  total: number;
  subtotalAmount?: number;
  deliveryCharge?: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: {
    name?: string | null;
    email?: string | null;
  };
  address?: {
    street?: string | null;
    phone?: string | null;
    city?: string | null;
  } | null;
};

export type User = {
  id: string;
  name: string | null;
  mobile: string | null;
  email: string | null;
  role: AuthRole;
};

export type DeliveryAddress = {
  street: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};
