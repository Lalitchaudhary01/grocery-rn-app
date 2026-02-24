import React, { useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, image } from '../../constants/theme';
import type { Product } from '../../types/models';
import { formatInr, parseCategoryLabel } from '../../utils/format';

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
  onOpen: (productId: string) => void;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function ProductCard({ product, onAdd, onOpen, quantity, onIncrease, onDecrease }: ProductCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const discount =
    typeof product.mrp === 'number' && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 25, bounciness: 0 }).start();
  }

  function pressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 25, bounciness: 0 }).start();
  }

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <Pressable style={styles.touchArea} onPress={() => onOpen(product.id)} onPressIn={pressIn} onPressOut={pressOut}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.imageUrl || image.fallback }} style={styles.image} />
          {discount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{discount}% OFF</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.meta}>{product.unit || parseCategoryLabel(product.category?.name || '') || 'General'}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatInr(product.price)}</Text>
            {product.mrp && product.mrp > product.price ? (
              <Text style={styles.mrp}>{formatInr(product.mrp)}</Text>
            ) : null}
          </View>
          <Text style={styles.stock}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</Text>
        </View>
      </Pressable>
      {quantity > 0 ? (
        <View style={styles.qtyControls}>
          <Pressable style={styles.qtyBtn} onPress={onDecrease}>
            <Text style={styles.qtyText}>-</Text>
          </Pressable>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <Pressable style={styles.qtyBtn} onPress={onIncrease}>
            <Text style={styles.qtyText}>+</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.addBtn, product.stock <= 0 && styles.addBtnDisabled]}
          disabled={product.stock <= 0}
          onPress={() => onAdd(product)}
        >
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dcfce7',
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  touchArea: {
    flex: 1,
    flexDirection: 'row',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: 108,
    height: 108,
    backgroundColor: '#e5e7eb',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 10,
  },
  body: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    marginTop: 2,
    color: '#6b7280',
    fontSize: 12,
  },
  price: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  mrp: {
    color: '#9ca3af',
    fontSize: 12,
    textDecorationLine: 'line-through',
    fontWeight: '700',
  },
  stock: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
  },
  addBtn: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  addText: {
    color: '#fff',
    fontWeight: '800',
  },
  qtyControls: {
    alignSelf: 'center',
    marginRight: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    lineHeight: 18,
  },
  qtyValue: {
    color: '#047857',
    fontWeight: '800',
    minWidth: 18,
    textAlign: 'center',
  },
});
