import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../context/AppContext';
import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { ProductCard } from '../components/product/ProductCard';
import { parseCategoryLabel } from '../utils/format';
import { colors } from '../constants/theme';

export function ProductsScreen() {
  const {
    search,
    setSearch,
    categoryId,
    setCategoryId,
    categories,
    products,
    productsByCategory,
    filteredProducts,
    loadingProducts,
    loadingCategories,
    addToCart,
    updateCartQty,
    cart,
    openProductDetail,
    user,
    setSelectedRole,
    setCustomerAuthMode,
    setTab,
  } = useAppContext();
  const cartQtyById = new Map(cart.map(item => [item.product.id, item.quantity]));

  return (
    <View style={styles.fill}>
      {!user ? (
        <View style={styles.guestNotice}>
          <Text style={styles.guestNoticeText}>Products dekh sakte ho. Cart/order ke liye login required hai.</Text>
          <AppButton
            title="Login / Register"
            variant="outline"
            onPress={() => {
              setSelectedRole('CUSTOMER');
              setCustomerAuthMode('login');
              setTab('profile');
            }}
          />
        </View>
      ) : null}

      <View style={styles.toolbar}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <Text style={styles.sectionSub}>{filteredProducts.length} items available</Text>
        </View>
        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search product ya category"
          style={styles.searchInput}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable style={[styles.chip, categoryId === 'all' && styles.chipActive]} onPress={() => setCategoryId('all')}>
            <Text style={[styles.chipText, categoryId === 'all' && styles.chipTextActive]}>All ({products.length})</Text>
          </Pressable>
          {categories.map(category => (
            <Pressable
              key={category.id}
              style={[styles.chip, categoryId === category.id && styles.chipActive]}
              onPress={() => setCategoryId(category.id)}
            >
              <Text style={[styles.chipText, categoryId === category.id && styles.chipTextActive]}>
                {parseCategoryLabel(category.name)} ({productsByCategory.get(category.id) || 0})
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loadingProducts || loadingCategories ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onAdd={addToCart}
              onOpen={openProductDetail}
              quantity={cartQtyById.get(item.id) || 0}
              onIncrease={() => updateCartQty(item.id, 1)}
              onDecrease={() => updateCartQty(item.id, -1)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>Search change karein ya category reset karein.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  guestNotice: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 4,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#facc15',
    backgroundColor: '#fffbeb',
    gap: 8,
  },
  guestNoticeText: {
    color: '#854d0e',
    fontSize: 12,
    fontWeight: '700',
  },
  toolbar: {
    padding: 12,
    gap: 10,
  },
  sectionHead: {
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
  sectionSub: {
    marginTop: 2,
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '600',
  },
  searchInput: {
    marginBottom: 0,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#dcfce7',
    borderColor: colors.primary,
  },
  chipText: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#166534',
  },
  center: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    gap: 10,
    paddingTop: 20,
  },
  skeletonCard: {
    height: 108,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  listContent: {
    padding: 12,
    paddingBottom: 30,
    gap: 2,
  },
  emptyWrap: {
    marginTop: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: 12,
  },
});
