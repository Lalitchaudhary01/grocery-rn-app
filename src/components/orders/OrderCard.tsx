import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Order } from '../../types/models';
import { colors } from '../../constants/theme';
import { formatInr } from '../../utils/format';

export function OrderCard({
  order,
  onOpenProduct,
}: {
  order: Order;
  onOpenProduct: (productId: string) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
        <StatusBadge status={order.status} />
      </View>
      <Text style={styles.date}>{new Date(order.createdAt).toLocaleString('en-IN')}</Text>
      <Text style={styles.meta}>Payment: {order.paymentMethod === 'COD' ? 'COD' : 'UPI QR'}</Text>
      <Text style={styles.meta}>Total: {formatInr(order.total)}</Text>
      {order.items.slice(0, 3).map(orderItem => (
        <Pressable key={orderItem.productId} onPress={() => onOpenProduct(orderItem.productId)}>
          <Text style={styles.itemText}>• {orderItem.product.name} x {orderItem.quantity}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const tone =
    status === 'PENDING'
      ? styles.pending
      : status === 'CONFIRMED'
        ? styles.confirmed
        : status === 'SHIPPED'
          ? styles.shipped
          : status === 'DELIVERED'
            ? styles.delivered
            : styles.cancelled;

  return (
    <View style={[styles.badge, tone]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dcfce7',
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  date: {
    marginTop: 3,
    color: colors.subText,
    fontSize: 12,
  },
  meta: {
    marginTop: 3,
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  itemText: {
    marginTop: 4,
    fontSize: 12,
    color: '#047857',
    fontWeight: '700',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pending: { backgroundColor: '#fef3c7' },
  confirmed: { backgroundColor: '#dbeafe' },
  shipped: { backgroundColor: '#e0e7ff' },
  delivered: { backgroundColor: '#dcfce7' },
  cancelled: { backgroundColor: '#fee2e2' },
  badgeText: {
    fontWeight: '700',
    color: '#1f2937',
    fontSize: 11,
  },
});
