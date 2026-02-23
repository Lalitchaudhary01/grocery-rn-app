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

export function AppRoot() {
  const insets = useSafeAreaInsets();
  const { user, cart, tab, setTab } = useAppContext();

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const userName = user?.role === 'ADMIN' ? 'Admin' : user?.name || 'Guest';

  return (
    <View style={styles.screen}>
      <TopHeader userName={userName} cartCount={cartCount} topInset={insets.top} />

      <View style={styles.content}>
        {!user ? <AuthScreen /> : null}

        {user?.role === 'CUSTOMER' && tab === 'products' ? <ProductsScreen /> : null}
        {user?.role === 'CUSTOMER' && tab === 'cart' ? <CartScreen /> : null}
        {user?.role === 'CUSTOMER' && tab === 'checkout' ? <CheckoutScreen /> : null}
        {user?.role === 'CUSTOMER' && tab === 'orders' ? <OrdersScreen /> : null}

        {user?.role === 'ADMIN' && tab === 'adminDashboard' ? <AdminDashboardScreen /> : null}
        {user?.role === 'ADMIN' && tab === 'adminOrders' ? <AdminOrdersScreen /> : null}
        {user?.role === 'ADMIN' && tab === 'adminProducts' ? <AdminProductsScreen /> : null}
        {user?.role === 'ADMIN' && tab === 'adminCategories' ? <AdminCategoriesScreen /> : null}

        {user && tab === 'profile' ? <ProfileScreen /> : null}
      </View>

      {user ? (
        <BottomTabs
          role={user.role}
          active={tab}
          cartCount={cartCount}
          bottomInset={insets.bottom}
          onChange={setTab}
        />
      ) : null}
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
