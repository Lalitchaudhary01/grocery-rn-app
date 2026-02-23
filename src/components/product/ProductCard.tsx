import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, image } from '../../constants/theme';
import type { Product } from '../../types/models';
import { formatInr, parseCategoryLabel } from '../../utils/format';

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.imageUrl || image.fallback }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>{product.unit || parseCategoryLabel(product.category?.name || '') || 'General'}</Text>
        <Text style={styles.price}>{formatInr(product.price)}</Text>
        <Text style={styles.stock}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</Text>
      </View>
      <Pressable
        style={[styles.addBtn, product.stock <= 0 && styles.addBtnDisabled]}
        disabled={product.stock <= 0}
        onPress={() => onAdd(product)}
      >
        <Text style={styles.addText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
  },
  image: {
    width: 96,
    height: 96,
    backgroundColor: '#e5e7eb',
  },
  body: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    marginTop: 2,
    color: '#6b7280',
    fontSize: 12,
  },
  price: {
    marginTop: 6,
    color: '#047857',
    fontSize: 17,
    fontWeight: '800',
  },
  stock: {
    fontSize: 12,
    color: '#6b7280',
  },
  addBtn: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    marginRight: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  addText: {
    color: '#fff',
    fontWeight: '800',
  },
});
