import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { OrderCard } from '../components/orders/OrderCard';
import { colors } from '../constants/theme';
import { useAppContext } from '../context/AppContext';

export function OrdersScreen() {
  const { myOrders, loadingMyOrders, reloadMyOrders, openProductDetail } = useAppContext();

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <AppButton title="Refresh" variant="outline" onPress={() => reloadMyOrders().catch(() => undefined)} />
      </View>

      {loadingMyOrders ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      ) : (
        <FlatList
          data={myOrders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <OrderCard order={item} onOpenProduct={openProductDetail} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No orders yet.</Text>}
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
  emptyText: {
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 18,
  },
});
