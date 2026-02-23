import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../context/AppContext';
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
  } = useAppContext();

  return (
    <View style={styles.fill}>
      <View style={styles.toolbar}>
        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products"
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
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <ProductCard product={item} onAdd={addToCart} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  toolbar: {
    padding: 12,
    gap: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 18,
  },
});
