import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { colors } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { formatInr } from '../utils/format';

export function AdminDashboardScreen() {
  const { products, categories, adminOrders, reloadAdminOrders, reloadCatalog, setTab } = useAppContext();

  const totalRevenue = useMemo(
    () => adminOrders.filter(o => o.status === 'DELIVERED').reduce((sum, order) => sum + order.total, 0),
    [adminOrders],
  );
  const pendingCount = useMemo(() => adminOrders.filter(o => o.status === 'PENDING').length, [adminOrders]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock <= 3).length, [products]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Store insights and quick actions</Text>

      <View style={styles.grid}>
        <StatCard icon="₹" label="Delivered Revenue" value={formatInr(totalRevenue)} tone="green" />
        <StatCard icon="⏳" label="Pending Orders" value={String(pendingCount)} tone="amber" />
        <StatCard icon="📦" label="Total Products" value={String(products.length)} tone="blue" />
        <StatCard icon="🗂" label="Categories" value={String(categories.length)} tone="neutral" />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <AppButton title="Refresh Orders" variant="outline" onPress={() => reloadAdminOrders().catch(() => undefined)} />
          <AppButton title="Refresh Catalog" variant="outline" onPress={() => reloadCatalog().catch(() => undefined)} />
          <AppButton title={`Low Stock (${lowStockCount})`} onPress={() => setTab('adminProducts')} />
          <AppButton title="Manage Orders" onPress={() => setTab('adminOrders')} />
        </View>
      </View>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: string;
  tone: 'green' | 'amber' | 'blue' | 'neutral';
}) {
  const bg = tone === 'green' ? '#dcfce7' : tone === 'amber' ? '#fef3c7' : tone === 'blue' ? '#dbeafe' : '#f3f4f6';
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 10,
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffffffaa',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statLabel: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 14,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  actions: {
    gap: 8,
  },
});
