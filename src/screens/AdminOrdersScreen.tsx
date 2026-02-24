import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { colors } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { formatInr } from '../utils/format';

export function AdminOrdersScreen() {
  const {
    adminOrders,
    loadingAdminOrders,
    reloadAdminOrders,
    adminSetOrderStatus,
    adminSetPaymentStatus,
    openProductDetail,
  } = useAppContext();

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Orders</Text>
        <AppButton title="Refresh" variant="outline" onPress={() => reloadAdminOrders().catch(() => undefined)} />
      </View>

      {loadingAdminOrders ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      ) : (
        <FlatList
          data={adminOrders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.orderId}>#{item.id.slice(0, 8).toUpperCase()}</Text>
                <Text style={[styles.status, item.status === 'PENDING' ? styles.pending : item.status === 'DELIVERED' ? styles.delivered : styles.activeStatus]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.meta}>Customer: {item.customer?.name || item.customer?.email || 'N/A'}</Text>
              <Text style={styles.meta}>Phone: {item.address?.phone || 'N/A'}</Text>
              <Text style={styles.meta}>Amount: {formatInr(item.total)}</Text>
              <Text style={styles.meta}>Address: {item.address?.street || 'N/A'}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.meta}>
                  Payment: {item.paymentMethod === 'COD' ? 'COD' : 'UPI QR'}
                </Text>
                {item.paymentMethod === 'COD' ? (
                  <Text style={[styles.status, styles.codStatus]}>COD</Text>
                ) : (
                  <Text
                    style={[
                      styles.status,
                      item.paymentStatus === 'VERIFIED'
                        ? styles.verifiedStatus
                        : item.paymentStatus === 'FAILED'
                          ? styles.failedStatus
                          : styles.pendingPaymentStatus,
                    ]}
                  >
                    {item.paymentStatus || 'PENDING_VERIFICATION'}
                  </Text>
                )}
              </View>
              {item.items.slice(0, 4).map(orderItem => (
                <Pressable key={orderItem.productId} onPress={() => openProductDetail(orderItem.productId)}>
                  <Text style={styles.itemText}>• {orderItem.product.name} x {orderItem.quantity}</Text>
                </Pressable>
              ))}

              <View style={styles.actions}>
                {item.paymentMethod !== 'COD' && item.paymentStatus !== 'VERIFIED' ? (
                  <AppButton
                    title="Verify Payment"
                    onPress={() => adminSetPaymentStatus(item.id, 'VERIFIED').catch(() => undefined)}
                  />
                ) : null}
                <AppButton
                  title="Confirm"
                  variant="outline"
                  disabled={item.paymentMethod !== 'COD' && item.paymentStatus !== 'VERIFIED'}
                  onPress={() => adminSetOrderStatus(item.id, 'CONFIRMED').catch(() => undefined)}
                />
                <AppButton
                  title="Ship"
                  variant="outline"
                  disabled={item.paymentMethod !== 'COD' && item.paymentStatus !== 'VERIFIED'}
                  onPress={() => adminSetOrderStatus(item.id, 'SHIPPED').catch(() => undefined)}
                />
                <AppButton
                  title="Deliver"
                  disabled={item.paymentMethod !== 'COD' && item.paymentStatus !== 'VERIFIED'}
                  onPress={() => adminSetOrderStatus(item.id, 'DELIVERED').catch(() => undefined)}
                />
                <AppButton title="Cancel" variant="danger" onPress={() => adminSetOrderStatus(item.id, 'CANCELLED', 'Cancelled by admin').catch(() => undefined)} />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No orders.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 12,
    paddingTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
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
  status: {
    color: '#166534',
    fontWeight: '800',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#dcfce7',
  },
  pending: {
    color: '#92400e',
    backgroundColor: '#fef3c7',
  },
  delivered: {
    color: '#065f46',
    backgroundColor: '#d1fae5',
  },
  activeStatus: {
    color: '#1e40af',
    backgroundColor: '#dbeafe',
  },
  codStatus: {
    color: '#92400e',
    backgroundColor: '#fef3c7',
  },
  pendingPaymentStatus: {
    color: '#92400e',
    backgroundColor: '#fef3c7',
  },
  verifiedStatus: {
    color: '#065f46',
    backgroundColor: '#d1fae5',
  },
  failedStatus: {
    color: '#991b1b',
    backgroundColor: '#fee2e2',
  },
  meta: {
    marginTop: 3,
    color: '#374151',
    fontSize: 13,
  },
  itemText: {
    marginTop: 3,
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    marginTop: 8,
    gap: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 18,
  },
});
