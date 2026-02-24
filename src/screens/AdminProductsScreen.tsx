import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { colors } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { formatInr, parseCategoryLabel } from '../utils/format';

export function AdminProductsScreen() {
  const { products, categories, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } = useAppContext();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) map.set(category.id, parseCategoryLabel(category.name));
    return map;
  }, [categories]);

  async function submit() {
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!name.trim() || !categoryId || !Number.isFinite(parsedPrice) || parsedPrice <= 0 || !Number.isFinite(parsedStock) || parsedStock < 0) {
      return;
    }

    if (!editingId) {
      await adminCreateProduct({
        name: name.trim(),
        price: parsedPrice,
        stock: parsedStock,
        unit: unit.trim() || null,
        categoryId,
        mrp: parsedPrice,
        isActive: true,
      });
    } else {
      await adminUpdateProduct(editingId, {
        name: name.trim(),
        price: parsedPrice,
        stock: parsedStock,
        unit: unit.trim() || null,
        categoryId,
      });
      setEditingId(null);
    }

    setName('');
    setPrice('');
    setStock('');
    setUnit('');
    setCategoryId('');
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.title}>{editingId ? 'Edit Product' : 'Add Product'}</Text>
        <Text style={styles.subtitle}>MRP, stock and category ke saath product manage karein.</Text>
        <AppInput value={name} onChangeText={setName} placeholder="Product name" />
        <AppInput value={price} onChangeText={setPrice} placeholder="Price" keyboardType="number-pad" />
        <AppInput value={stock} onChangeText={setStock} placeholder="Stock" keyboardType="number-pad" />
        <AppInput value={unit} onChangeText={setUnit} placeholder="Unit (optional)" />
        <AppInput value={categoryId} onChangeText={setCategoryId} placeholder="Category ID" />
        <AppButton title={editingId ? 'Update Product' : 'Create Product'} onPress={() => submit().catch(() => undefined)} />
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>{formatInr(item.price)} | Stock: {item.stock}</Text>
            <Text style={styles.itemMeta}>Category: {categoryNameById.get(item.categoryId) || item.categoryId}</Text>
            <View style={styles.row}>
              <AppButton
                title="Edit"
                variant="outline"
                onPress={() => {
                  setEditingId(item.id);
                  setName(item.name);
                  setPrice(String(Math.round(item.price)));
                  setStock(String(item.stock));
                  setUnit(item.unit || '');
                  setCategoryId(item.categoryId);
                }}
              />
              <AppButton title="Delete" variant="danger" onPress={() => adminDeleteProduct(item.id).catch(() => undefined)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No products.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 12 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  itemName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  itemMeta: {
    color: '#4b5563',
    fontSize: 12,
    marginTop: 3,
  },
  row: {
    marginTop: 8,
    gap: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 18,
  },
});
