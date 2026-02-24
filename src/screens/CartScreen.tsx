import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { CartItemRow } from '../components/cart/CartItemRow';
import { colors, delivery } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { formatInr } from '../utils/format';

export function CartScreen() {
  const {
    cart,
    updateCartQty,
    subtotal,
    deliveryCharge,
    total,
    setTab,
    clearCart,
    user,
    setSelectedRole,
    setCustomerAuthMode,
    openProductDetail,
  } = useAppContext();
  const leftForFree = Math.max(0, delivery.freeThreshold - subtotal);
  const progress = Math.min(1, subtotal / delivery.freeThreshold);

  return (
    <FlatList
      data={cart}
      keyExtractor={item => item.product.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Mera Cart</Text>
          <Text style={styles.headerSub}>{cart.length} items selected</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {leftForFree === 0
              ? 'Free delivery unlocked'
              : `${formatInr(leftForFree)} more for free delivery`}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <CartItemRow
          item={item}
          onDecrease={() => updateCartQty(item.product.id, -1)}
          onIncrease={() => updateCartQty(item.product.id, 1)}
          onOpen={openProductDetail}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Cart is empty</Text>
          <Text style={styles.emptyText}>Products page se items add karo.</Text>
        </View>
      }
      ListFooterComponent={
        cart.length > 0 ? (
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Bill Summary</Text>
            <BillRow label="Subtotal" value={formatInr(subtotal)} />
            <BillRow label="Delivery" value={deliveryCharge === 0 ? 'FREE' : formatInr(deliveryCharge)} />
            <BillRow label="Total" value={formatInr(total)} strong />
            <Text style={styles.note}>
              {deliveryCharge === 0
                ? 'Free delivery unlocked.'
                : `${formatInr(delivery.freeThreshold - subtotal)} more for free delivery.`}
            </Text>

            <View style={styles.btnRow}>
              <AppButton
                title="Proceed to Checkout"
                onPress={() => {
                  if (!user || user.role !== 'CUSTOMER') {
                    setSelectedRole('CUSTOMER');
                    setCustomerAuthMode('login');
                    setTab('profile');
                    Alert.alert('Login required', 'Checkout ke liye customer login karein.');
                    return;
                  }
                  setTab('checkout');
                }}
              />
              <AppButton title="Clear Cart" variant="outline" onPress={clearCart} />
            </View>
          </View>
        ) : null
      }
    />
  );
}

function BillRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.rowBetween}>
      <Text style={[styles.rowLabel, strong && styles.strongText]}>{label}</Text>
      <Text style={[styles.rowLabel, strong && styles.strongText]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 12,
    paddingBottom: 28,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dcfce7',
    padding: 12,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  headerSub: {
    marginTop: 2,
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '600',
  },
  progressTrack: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    marginTop: 8,
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 6,
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginTop: 8,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  rowLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  strongText: {
    color: colors.text,
    fontWeight: '800',
  },
  note: {
    marginTop: 8,
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  btnRow: {
    marginTop: 10,
    gap: 8,
  },
});
