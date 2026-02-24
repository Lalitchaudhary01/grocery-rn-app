import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { colors, image } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { formatInr, parseCategoryLabel } from '../utils/format';

export function ProductDetailScreen() {
  const { selectedProduct, addToCart, closeProductDetail, user, products, openProductDetail } = useAppContext();

  if (!selectedProduct) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>Product details unavailable</Text>
        <AppButton title="Back" variant="outline" onPress={closeProductDetail} />
      </View>
    );
  }

  const related = products
    .filter(
      product =>
        product.id !== selectedProduct.id &&
        product.categoryId === selectedProduct.categoryId &&
        (product.stock > 0),
    )
    .slice(0, 6);
  const discount =
    typeof selectedProduct.mrp === 'number' && selectedProduct.mrp > selectedProduct.price
      ? Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100)
      : 0;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.card}>
        <Image source={{ uri: selectedProduct.imageUrl || image.fallback }} style={styles.heroImage} />

        <View style={styles.body}>
          <Text style={styles.name}>{selectedProduct.name}</Text>
          <Text style={styles.meta}>
            {selectedProduct.unit || parseCategoryLabel(selectedProduct.category?.name || '') || 'General'}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatInr(selectedProduct.price)}</Text>
            {selectedProduct.mrp && selectedProduct.mrp > selectedProduct.price ? (
              <Text style={styles.mrp}>{formatInr(selectedProduct.mrp)}</Text>
            ) : null}
            {discount > 0 ? <Text style={styles.discount}>Save {discount}%</Text> : null}
          </View>

          <Text style={styles.stock}>
            {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
          </Text>

          <Text style={styles.description}>
            {selectedProduct.description?.trim() || 'Fresh grocery item from your local store.'}
          </Text>
          <View style={styles.trustRow}>
            <Text style={styles.trustPill}>Fresh Quality</Text>
            <Text style={styles.trustPill}>Village Fast Delivery</Text>
            <Text style={styles.trustPill}>Best Price</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton title="Back" variant="outline" onPress={closeProductDetail} />
        <AppButton
          title={user?.role === 'CUSTOMER' ? 'Add to Cart' : 'Login to Add'}
          onPress={() => addToCart(selectedProduct)}
          disabled={selectedProduct.stock <= 0}
        />
      </View>

      {related.length > 0 ? (
        <View style={styles.relatedWrap}>
          <Text style={styles.relatedTitle}>Related Products</Text>
          <View style={styles.relatedGrid}>
            {related.map(product => (
              <Pressable key={product.id} style={styles.relatedCard} onPress={() => openProductDetail(product.id)}>
                <Image source={{ uri: product.imageUrl || image.fallback }} style={styles.relatedImage} />
                <Text style={styles.relatedName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.relatedPrice}>{formatInr(product.price)}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    borderColor: '#dcfce7',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 1.25,
    backgroundColor: '#e5e7eb',
  },
  body: {
    padding: 12,
  },
  name: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    color: colors.text,
  },
  meta: {
    marginTop: 6,
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '600',
  },
  priceRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  price: {
    color: '#047857',
    fontSize: 28,
    fontWeight: '900',
  },
  mrp: {
    color: '#9ca3af',
    fontSize: 15,
    textDecorationLine: 'line-through',
    paddingBottom: 3,
    fontWeight: '700',
  },
  discount: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  stock: {
    marginTop: 8,
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    marginTop: 10,
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
  },
  trustRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  trustPill: {
    color: '#065f46',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    marginTop: 12,
    gap: 8,
  },
  relatedWrap: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 12,
  },
  relatedTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedCard: {
    width: '48.7%',
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  relatedImage: {
    width: '100%',
    height: 90,
    backgroundColor: '#e5e7eb',
  },
  relatedName: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    paddingHorizontal: 8,
  },
  relatedPrice: {
    color: '#047857',
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingBottom: 8,
    marginTop: 2,
  },
  emptyWrap: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
});
