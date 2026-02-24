import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

type TopHeaderProps = {
  userName: string;
  cartCount: number;
  topInset: number;
};

export function TopHeader({ userName, cartCount, topInset }: TopHeaderProps) {
  return (
    <View style={[styles.wrap, { paddingTop: Math.max(topInset, 10) }]}>
      <View style={styles.left}>
        <View style={styles.logoDot} />
        <Text style={styles.name}>Apni Dukaan</Text>
        <Text style={styles.tagline}>3 KM ke andar Home Delivery</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {userName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'column',
    gap: 2,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginBottom: 2,
  },
  name: {
    color: '#fff',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
  },
  tagline: {
    color: '#d1fae5',
    fontSize: 13,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  badgeText: {
    color: '#1f2937',
    fontWeight: '800',
    fontSize: 12,
  },
  userName: {
    color: '#fff',
    fontWeight: '700',
    maxWidth: 100,
  },
});
