import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { CartItemRow } from '../components/cart/CartItemRow';
import { colors, delivery } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { formatInr } from '../utils/format';

export function CartScreen() {
  const { cart, updateCartQty, subtotal, deliveryCharge, total, setTab, clearCart } = useAppContext();

  return (
    <FlatList
      data={cart}
      keyExtractor={item => item.product.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <CartItemRow
          item={item}
          onDecrease={() => updateCartQty(item.product.id, -1)}
          onIncrease={() => updateCartQty(item.product.id, 1)}
        />
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>Cart is empty.</Text>}
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
              <AppButton title="Proceed to Checkout" onPress={() => setTab('checkout')} />
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
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 18,
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
