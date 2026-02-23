import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { defaultApiBaseUrl } from '../services/api';
import { customerLogin, customerLogout, customerMe, customerRegister } from '../services/auth';
import { adminLogin, adminLogout, createCategory, createProduct, deleteCategory, deleteProduct, getAdminOrders, updateCategory, updateOrderStatus, updateProduct } from '../services/admin';
import { getCategories, getProducts } from '../services/catalog';
import { createOrder, getMyOrders } from '../services/orders';
import type { AppTab } from '../navigation/tabs';
import type { AuthRole, Category, CartItem, DeliveryAddress, Order, OrderStatus, PaymentMethod, Product, User } from '../types/models';
import { deliveryChargeFromSubtotal } from '../utils/format';

type CustomerAuthMode = 'login' | 'register';

type AppContextValue = {
  apiBaseUrl: string;
  draftApiBaseUrl: string;
  setDraftApiBaseUrl: (value: string) => void;
  saveApiBaseUrl: () => Promise<void>;

  selectedRole: AuthRole;
  setSelectedRole: (role: AuthRole) => void;
  customerAuthMode: CustomerAuthMode;
  setCustomerAuthMode: (mode: CustomerAuthMode) => void;
  customerName: string;
  setCustomerName: (value: string) => void;
  customerMobile: string;
  setCustomerMobile: (value: string) => void;
  adminEmail: string;
  setAdminEmail: (value: string) => void;
  adminPassword: string;
  setAdminPassword: (value: string) => void;
  authLoading: boolean;
  submitAuth: () => Promise<void>;
  logout: () => Promise<void>;

  user: User | null;
  tab: AppTab;
  setTab: (tab: AppTab) => void;

  loadingProducts: boolean;
  loadingCategories: boolean;
  products: Product[];
  categories: Category[];
  categoryId: string;
  setCategoryId: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  filteredProducts: Product[];
  productsByCategory: Map<string, number>;
  reloadCatalog: () => Promise<void>;

  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;

  subtotal: number;
  deliveryCharge: number;
  total: number;

  orderAddress: DeliveryAddress;
  setOrderAddressField: (field: keyof DeliveryAddress, value: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
  placingOrder: boolean;
  placeOrder: () => Promise<void>;

  myOrders: Order[];
  loadingMyOrders: boolean;
  reloadMyOrders: () => Promise<void>;

  adminOrders: Order[];
  loadingAdminOrders: boolean;
  reloadAdminOrders: () => Promise<void>;
  adminSetOrderStatus: (orderId: string, status: OrderStatus, cancelReason?: string) => Promise<void>;

  adminCreateProduct: (payload: {
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
  }) => Promise<void>;
  adminUpdateProduct: (
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
  ) => Promise<void>;
  adminDeleteProduct: (productId: string) => Promise<void>;

  adminCreateCategory: (name: string) => Promise<void>;
  adminUpdateCategory: (categoryId: string, name: string) => Promise<void>;
  adminDeleteCategory: (categoryId: string) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

const initialAddress: DeliveryAddress = {
  street: '',
  phone: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [apiBaseUrl, setApiBaseUrl] = useState(defaultApiBaseUrl);
  const [draftApiBaseUrl, setDraftApiBaseUrl] = useState(defaultApiBaseUrl);

  const [selectedRole, setSelectedRole] = useState<AuthRole>('CUSTOMER');
  const [customerAuthMode, setCustomerAuthMode] = useState<CustomerAuthMode>('login');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<AppTab>('products');

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('all');
  const [search, setSearch] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);

  const [orderAddress, setOrderAddress] = useState<DeliveryAddress>(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI_QR');
  const [placingOrder, setPlacingOrder] = useState(false);

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loadingMyOrders, setLoadingMyOrders] = useState(false);

  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [loadingAdminOrders, setLoadingAdminOrders] = useState(false);

  const reloadCatalog = useCallback(async () => {
    setLoadingProducts(true);
    setLoadingCategories(true);

    const [productsRes, categoriesRes] = await Promise.all([getProducts(apiBaseUrl), getCategories(apiBaseUrl)]);

    if (productsRes.ok && productsRes.data) {
      setProducts(Array.isArray(productsRes.data.products) ? productsRes.data.products : []);
    } else {
      Alert.alert('Products error', productsRes.error || 'Failed to load products.');
    }

    if (categoriesRes.ok && categoriesRes.data) {
      setCategories(Array.isArray(categoriesRes.data.categories) ? categoriesRes.data.categories : []);
    } else {
      Alert.alert('Categories error', categoriesRes.error || 'Failed to load categories.');
    }

    setLoadingProducts(false);
    setLoadingCategories(false);
  }, [apiBaseUrl]);

  const reloadMyOrders = useCallback(async () => {
    if (!user || user.role !== 'CUSTOMER') return;
    setLoadingMyOrders(true);
    const res = await getMyOrders(apiBaseUrl);
    if (res.ok && res.data) {
      setMyOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } else if (res.status !== 401) {
      Alert.alert('Orders error', res.error || 'Failed to load orders.');
    }
    setLoadingMyOrders(false);
  }, [apiBaseUrl, user]);

  const reloadAdminOrders = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') return;
    setLoadingAdminOrders(true);
    const res = await getAdminOrders(apiBaseUrl);
    if (res.ok && res.data) {
      setAdminOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } else if (res.status !== 401) {
      Alert.alert('Admin orders error', res.error || 'Failed to load admin orders.');
    }
    setLoadingAdminOrders(false);
  }, [apiBaseUrl, user]);

  const loadSession = useCallback(async () => {
    const customerRes = await customerMe(apiBaseUrl);
    if (customerRes.ok && customerRes.data?.user) {
      setUser({ ...customerRes.data.user, role: 'CUSTOMER' });
      setTab('products');
      return;
    }

    const adminProbe = await getAdminOrders(apiBaseUrl);
    if (adminProbe.ok) {
      setUser({ id: 'admin-session', name: 'Admin', mobile: null, email: null, role: 'ADMIN' });
      setAdminOrders(Array.isArray(adminProbe.data?.orders) ? adminProbe.data?.orders ?? [] : []);
      setTab('adminDashboard');
      return;
    }

    setUser(null);
    setMyOrders([]);
    setAdminOrders([]);
  }, [apiBaseUrl]);

  useEffect(() => {
    reloadCatalog().catch(() => undefined);
    loadSession().catch(() => undefined);
  }, [reloadCatalog, loadSession]);

  useEffect(() => {
    if (!user) {
      setMyOrders([]);
      setAdminOrders([]);
      return;
    }
    if (user.role === 'CUSTOMER') {
      reloadMyOrders().catch(() => undefined);
    } else {
      reloadAdminOrders().catch(() => undefined);
    }
  }, [reloadAdminOrders, reloadMyOrders, user]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(product => {
      const matchesCategory = categoryId === 'all' || product.categoryId === categoryId;
      const matchesSearch =
        q.length === 0
          ? true
          : `${product.name} ${product.description || ''} ${product.category?.name || ''}`
              .toLowerCase()
              .includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryId, search]);

  const productsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of products) {
      map.set(product.categoryId, (map.get(product.categoryId) || 0) + 1);
    }
    return map;
  }, [products]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const deliveryCharge = useMemo(() => deliveryChargeFromSubtotal(subtotal), [subtotal]);
  const total = subtotal + deliveryCharge;

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) {
      Alert.alert('Out of stock', 'Ye product stock me nahi hai.');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateCartQty = useCallback((productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter(item => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const setOrderAddressField = useCallback((field: keyof DeliveryAddress, value: string) => {
    setOrderAddress(prev => ({ ...prev, [field]: value }));
  }, []);

  const saveApiBaseUrl = useCallback(async () => {
    const next = draftApiBaseUrl.trim();
    if (!next) {
      Alert.alert('Invalid URL', 'API URL empty nahi ho sakta.');
      return;
    }
    setApiBaseUrl(next);
    Alert.alert('Updated', 'API URL update ho gaya.');
  }, [draftApiBaseUrl]);

  const submitAuth = useCallback(async () => {
    setAuthLoading(true);

    if (selectedRole === 'CUSTOMER') {
      const mobile = customerMobile.trim();
      if (!/^\d{10}$/.test(mobile)) {
        setAuthLoading(false);
        Alert.alert('Invalid mobile', '10 digit mobile number dalein.');
        return;
      }

      if (customerAuthMode === 'register') {
        const name = customerName.trim();
        if (name.length < 2) {
          setAuthLoading(false);
          Alert.alert('Invalid name', 'Naam minimum 2 character hona chahiye.');
          return;
        }

        const registerRes = await customerRegister(apiBaseUrl, { name, mobile });
        if (!registerRes.ok) {
          setAuthLoading(false);
          Alert.alert('Register failed', registerRes.error || 'Try again');
          return;
        }
      }

      const loginRes = await customerLogin(apiBaseUrl, { mobile });
      setAuthLoading(false);

      if (!loginRes.ok || !loginRes.data?.user) {
        Alert.alert('Login failed', loginRes.error || 'Try again');
        return;
      }

      setUser({ ...loginRes.data.user, role: 'CUSTOMER' });
      setTab('products');
      setCustomerMobile('');
      setCustomerName('');
      Alert.alert('Success', 'Customer login successful.');
      return;
    }

    const email = adminEmail.trim().toLowerCase();
    const password = adminPassword;
    if (!email || !password) {
      setAuthLoading(false);
      Alert.alert('Missing fields', 'Admin email/password required.');
      return;
    }

    const res = await adminLogin(apiBaseUrl, { email, password });
    setAuthLoading(false);

    if (!res.ok || !res.data?.user) {
      Alert.alert('Admin login failed', res.error || 'Try again');
      return;
    }

    setUser({ id: res.data.user.id, name: 'Admin', mobile: null, email, role: 'ADMIN' });
    setAdminEmail('');
    setAdminPassword('');
    setTab('adminDashboard');
    await reloadCatalog();
    await reloadAdminOrders();
    Alert.alert('Success', 'Admin login successful.');
  }, [adminEmail, adminPassword, apiBaseUrl, customerAuthMode, customerMobile, customerName, reloadAdminOrders, reloadCatalog, selectedRole]);

  const logout = useCallback(async () => {
    if (!user) return;
    if (user.role === 'ADMIN') {
      await adminLogout(apiBaseUrl);
    } else {
      await customerLogout(apiBaseUrl);
    }
    setUser(null);
    setMyOrders([]);
    setAdminOrders([]);
    setTab('products');
  }, [apiBaseUrl, user]);

  const placeOrder = useCallback(async () => {
    if (!user || user.role !== 'CUSTOMER') {
      Alert.alert('Login required', 'Customer login required.');
      return;
    }

    if (cart.length === 0) {
      Alert.alert('Cart empty', 'Pehle products add karein.');
      return;
    }

    if (!orderAddress.street || !orderAddress.city || !orderAddress.state || !orderAddress.postalCode) {
      Alert.alert('Address required', 'Complete address fill karein.');
      return;
    }

    if (!/^\d{10}$/.test(orderAddress.phone)) {
      Alert.alert('Invalid phone', '10 digit phone number dalein.');
      return;
    }

    if (!/^\d{6}$/.test(orderAddress.postalCode)) {
      Alert.alert('Invalid pincode', '6 digit pincode dalein.');
      return;
    }

    setPlacingOrder(true);
    const response = await createOrder(apiBaseUrl, {
      deliveryAddress: orderAddress,
      items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
      paymentMethod,
    });
    setPlacingOrder(false);

    if (!response.ok) {
      Alert.alert('Order failed', response.error || 'Order place nahi ho paya.');
      return;
    }

    setCart([]);
    setTab('orders');
    await reloadMyOrders();
    Alert.alert('Order placed', paymentMethod === 'COD' ? 'Order COD se place hua.' : 'Order UPI verification ke sath place hua.');
  }, [apiBaseUrl, cart, orderAddress, paymentMethod, reloadMyOrders, user]);

  const adminSetOrderStatus = useCallback(async (orderId: string, status: OrderStatus, cancelReason?: string) => {
    const res = await updateOrderStatus(apiBaseUrl, orderId, {
      status,
      cancelReason,
    });
    if (!res.ok) {
      Alert.alert('Update failed', res.error || 'Order status update failed.');
      return;
    }
    await reloadAdminOrders();
    Alert.alert('Updated', `Order marked as ${status}.`);
  }, [apiBaseUrl, reloadAdminOrders]);

  const adminCreateProduct = useCallback(async (payload: {
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
  }) => {
    const res = await createProduct(apiBaseUrl, payload);
    if (!res.ok) {
      Alert.alert('Create failed', res.error || 'Product create failed.');
      return;
    }
    await reloadCatalog();
    Alert.alert('Created', 'Product created.');
  }, [apiBaseUrl, reloadCatalog]);

  const adminUpdateProduct = useCallback(async (
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
  ) => {
    const res = await updateProduct(apiBaseUrl, productId, payload);
    if (!res.ok) {
      Alert.alert('Update failed', res.error || 'Product update failed.');
      return;
    }
    await reloadCatalog();
    Alert.alert('Updated', 'Product updated.');
  }, [apiBaseUrl, reloadCatalog]);

  const adminDeleteProduct = useCallback(async (productId: string) => {
    const res = await deleteProduct(apiBaseUrl, productId);
    if (!res.ok) {
      Alert.alert('Delete failed', res.error || 'Product delete failed.');
      return;
    }
    await reloadCatalog();
    Alert.alert('Deleted', 'Product deleted.');
  }, [apiBaseUrl, reloadCatalog]);

  const adminCreateCategory = useCallback(async (name: string) => {
    const res = await createCategory(apiBaseUrl, { name });
    if (!res.ok) {
      Alert.alert('Create failed', res.error || 'Category create failed.');
      return;
    }
    await reloadCatalog();
    Alert.alert('Created', 'Category created.');
  }, [apiBaseUrl, reloadCatalog]);

  const adminUpdateCategory = useCallback(async (categoryIdArg: string, name: string) => {
    const res = await updateCategory(apiBaseUrl, categoryIdArg, { name });
    if (!res.ok) {
      Alert.alert('Update failed', res.error || 'Category update failed.');
      return;
    }
    await reloadCatalog();
    Alert.alert('Updated', 'Category updated.');
  }, [apiBaseUrl, reloadCatalog]);

  const adminDeleteCategory = useCallback(async (categoryIdArg: string) => {
    const res = await deleteCategory(apiBaseUrl, categoryIdArg);
    if (!res.ok) {
      Alert.alert('Delete failed', res.error || 'Category delete failed.');
      return;
    }
    await reloadCatalog();
    Alert.alert('Deleted', 'Category deleted.');
  }, [apiBaseUrl, reloadCatalog]);

  const value: AppContextValue = {
    apiBaseUrl,
    draftApiBaseUrl,
    setDraftApiBaseUrl,
    saveApiBaseUrl,

    selectedRole,
    setSelectedRole,
    customerAuthMode,
    setCustomerAuthMode,
    customerName,
    setCustomerName,
    customerMobile,
    setCustomerMobile,
    adminEmail,
    setAdminEmail,
    adminPassword,
    setAdminPassword,
    authLoading,
    submitAuth,
    logout,

    user,
    tab,
    setTab,

    loadingProducts,
    loadingCategories,
    products,
    categories,
    categoryId,
    setCategoryId,
    search,
    setSearch,
    filteredProducts,
    productsByCategory,
    reloadCatalog,

    cart,
    addToCart,
    updateCartQty,
    clearCart,

    subtotal,
    deliveryCharge,
    total,

    orderAddress,
    setOrderAddressField,
    paymentMethod,
    setPaymentMethod,
    placingOrder,
    placeOrder,

    myOrders,
    loadingMyOrders,
    reloadMyOrders,

    adminOrders,
    loadingAdminOrders,
    reloadAdminOrders,
    adminSetOrderStatus,

    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,

    adminCreateCategory,
    adminUpdateCategory,
    adminDeleteCategory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
