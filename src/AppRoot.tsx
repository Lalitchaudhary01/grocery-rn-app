import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from './constants/theme';
import { useAppContext } from './context/AppContext';
import { BottomTabs } from './components/layout/BottomTabs';
import { TopHeader } from './components/layout/TopHeader';
import { AuthScreen } from './screens/AuthScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { AdminOrdersScreen } from './screens/AdminOrdersScreen';
import { AdminProductsScreen } from './screens/AdminProductsScreen';
import { AdminCategoriesScreen } from './screens/AdminCategoriesScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';

export function AppRoot() {
  const insets = useSafeAreaInsets();
  const { user, cart, tab, setTab } = useAppContext();

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const isGuest = !user;
  const isCustomer = user?.role === 'CUSTOMER';
  const isAdmin = user?.role === 'ADMIN';
  const userName = user?.role === 'ADMIN' ? 'Admin' : user?.name || 'Guest';

  return (
    <View style={styles.screen}>
      <TopHeader userName={userName} cartCount={cartCount} topInset={insets.top} />

      <View style={styles.content}>
        {tab === 'productDetail' ? <ProductDetailScreen /> : null}
        {isGuest && tab === 'products' ? <ProductsScreen /> : null}
        {isGuest && tab !== 'products' && tab !== 'productDetail' ? <AuthScreen /> : null}

        {isCustomer && tab === 'products' ? <ProductsScreen /> : null}
        {isCustomer && tab === 'cart' ? <CartScreen /> : null}
        {isCustomer && tab === 'checkout' ? <CheckoutScreen /> : null}
        {isCustomer && tab === 'orders' ? <OrdersScreen /> : null}

        {isAdmin && tab === 'adminDashboard' ? <AdminDashboardScreen /> : null}
        {isAdmin && tab === 'adminOrders' ? <AdminOrdersScreen /> : null}
        {isAdmin && tab === 'adminProducts' ? <AdminProductsScreen /> : null}
        {isAdmin && tab === 'adminCategories' ? <AdminCategoriesScreen /> : null}

        {(isCustomer || isAdmin) && tab === 'profile' ? <ProfileScreen /> : null}
      </View>

      <BottomTabs
        role={user?.role ?? 'CUSTOMER'}
        active={tab}
        cartCount={cartCount}
        bottomInset={insets.bottom}
        onChange={setTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
