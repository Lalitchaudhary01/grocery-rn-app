import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, image } from '../../constants/theme';
import type { CartItem } from '../../types/models';
import { formatInr } from '../../utils/format';

type CartItemRowProps = {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onOpen: (productId: string) => void;
};

export function CartItemRow({ item, onDecrease, onIncrease, onOpen }: CartItemRowProps) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.touchArea} onPress={() => onOpen(item.product.id)}>
        <Image source={{ uri: item.product.imageUrl || image.fallback }} style={styles.image} />
        <View style={styles.body}>
          <Text style={styles.name}>{item.product.name}</Text>
          <Text style={styles.meta}>{formatInr(item.product.price)} x {item.quantity}</Text>
          <Text style={styles.total}>{formatInr(item.product.price * item.quantity)}</Text>
        </View>
      </Pressable>
      <View style={styles.qtyRow}>
        <Pressable style={styles.qtyBtn} onPress={onDecrease}><Text style={styles.qtyBtnText}>-</Text></Pressable>
        <Text style={styles.qtyValue}>{item.quantity}</Text>
        <Pressable style={styles.qtyBtn} onPress={onIncrease}><Text style={styles.qtyBtnText}>+</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchArea: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: 90,
    height: 90,
    backgroundColor: '#e5e7eb',
  },
  body: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '700',
  },
  meta: {
    color: colors.subText,
    marginTop: 2,
    fontSize: 12,
  },
  total: {
    color: '#047857',
    fontWeight: '800',
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  qtyValue: {
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'center',
  },
});
