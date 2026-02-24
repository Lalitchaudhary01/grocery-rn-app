import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { AppTab } from '../../navigation/tabs';
import type { AuthRole } from '../../types/models';

type BottomTabsProps = {
  role: AuthRole;
  active: AppTab;
  cartCount: number;
  bottomInset: number;
  onChange: (tab: AppTab) => void;
};

export function BottomTabs({ role, active, cartCount, bottomInset, onChange }: BottomTabsProps) {
  const customerTabs: Array<{ label: string; tab: AppTab }> = [
    { label: 'Products', tab: 'products' },
    { label: `Cart (${cartCount})`, tab: 'cart' },
    { label: 'Orders', tab: 'orders' },
    { label: 'Profile', tab: 'profile' },
  ];

  const adminTabs: Array<{ label: string; tab: AppTab }> = [
    { label: 'Dashboard', tab: 'adminDashboard' },
    { label: 'Orders', tab: 'adminOrders' },
    { label: 'Products', tab: 'adminProducts' },
    { label: 'Category', tab: 'adminCategories' },
    { label: 'Profile', tab: 'profile' },
  ];

  const tabs = role === 'ADMIN' ? adminTabs : customerTabs;

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(bottomInset, 10) }]}>
      {tabs.map(item => {
        const isActive = active === item.tab;
        return (
          <Pressable key={item.tab} style={[styles.tabBtn, isActive && styles.tabBtnActive]} onPress={() => onChange(item.tab)}>
            <Text style={[styles.tabText, isActive && styles.tabTextActive]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#ffffffee',
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 6,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabBtn: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  tabBtnActive: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  tabText: {
    color: '#4b5563',
    fontWeight: '700',
    fontSize: 12,
  },
  tabTextActive: {
    color: colors.primary,
  },
});
