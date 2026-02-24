import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { colors } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { parseCategoryLabel } from '../utils/format';

export function AdminCategoriesScreen() {
  const { categories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');

  async function submit() {
    const clean = name.trim();
    if (!clean) return;

    if (!editingId) {
      await adminCreateCategory(clean);
    } else {
      await adminUpdateCategory(editingId, clean);
      setEditingId(null);
    }

    setName('');
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.title}>{editingId ? 'Edit Category' : 'Add Category'}</Text>
        <Text style={styles.subtitle}>Category naam simple aur clear rakhein.</Text>
        <AppInput value={name} onChangeText={setName} placeholder="Category name" />
        <AppButton title={editingId ? 'Update Category' : 'Create Category'} onPress={() => submit().catch(() => undefined)} />
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{parseCategoryLabel(item.name)}</Text>
            <Text style={styles.itemMeta}>{item.id}</Text>
            <View style={styles.row}>
              <AppButton title="Edit" variant="outline" onPress={() => { setEditingId(item.id); setName(parseCategoryLabel(item.name)); }} />
              <AppButton title="Delete" variant="danger" onPress={() => adminDeleteCategory(item.id).catch(() => undefined)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No categories.</Text>}
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
    fontSize: 11,
    marginTop: 4,
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
