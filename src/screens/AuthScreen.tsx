import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../context/AppContext';
import { colors, image } from '../constants/theme';
import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { formatInr, parseCategoryLabel } from '../utils/format';

export function AuthScreen() {
  const {
    selectedRole,
    setSelectedRole,
    customerAuthMode,
    setCustomerAuthMode,
    customerName,
    setCustomerName,
    customerMobile,
    setCustomerMobile,
    adminEmail,
    setAdminEmail,
    adminPassword,
    setAdminPassword,
    authLoading,
    submitAuth,
    categories,
    products,
  } = useAppContext();

  const featuredProducts = products.slice(0, 8);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.heroCard}>
        <Text style={styles.heroPill}>Gaon ki tez grocery delivery</Text>
        <Text style={styles.heroTitle}>Aaj ka saman, abhi ghar par</Text>
        <Text style={styles.heroSubtitle}>Fresh products, simple ordering, trusted local shop.</Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Categories</Text>
            <Text style={styles.heroStatValue}>{categories.length}</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Live Products</Text>
            <Text style={styles.heroStatValue}>{products.length}</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>Delivery</Text>
            <Text style={styles.heroStatValue}>3 KM</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Top Categories</Text>
        <View style={styles.chipsWrap}>
          {categories.slice(0, 10).map(category => (
            <View key={category.id} style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{parseCategoryLabel(category.name)}</Text>
            </View>
          ))}
          {categories.length === 0 ? <Text style={styles.emptyText}>Categories loading...</Text> : null}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Popular Products</Text>
        {featuredProducts.length === 0 ? (
          <Text style={styles.emptyText}>Products loading...</Text>
        ) : (
          <View style={styles.productsGrid}>
            {featuredProducts.map(product => (
              <View key={product.id} style={styles.productCard}>
                <Image source={{ uri: product.imageUrl || image.fallback }} style={styles.productImage} />
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.productPrice}>{formatInr(product.price)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.roleRow}>
        <AppButton title="Customer" variant={selectedRole === 'CUSTOMER' ? 'primary' : 'outline'} onPress={() => setSelectedRole('CUSTOMER')} />
        <AppButton title="Admin" variant={selectedRole === 'ADMIN' ? 'primary' : 'outline'} onPress={() => setSelectedRole('ADMIN')} />
      </View>

      {selectedRole === 'CUSTOMER' ? (
        <View style={styles.authCard}>
          <Text style={styles.heading}>{customerAuthMode === 'login' ? 'Customer Login' : 'Customer Register'}</Text>
          {customerAuthMode === 'register' ? <AppInput value={customerName} onChangeText={setCustomerName} placeholder="Name" /> : null}
          <AppInput value={customerMobile} onChangeText={setCustomerMobile} placeholder="Mobile Number" keyboardType="number-pad" maxLength={10} />

          <AppButton title={customerAuthMode === 'login' ? 'Login' : 'Register + Login'} loading={authLoading} onPress={() => submitAuth().catch(() => undefined)} />

          <Text style={styles.link} onPress={() => setCustomerAuthMode(customerAuthMode === 'login' ? 'register' : 'login')}>
            {customerAuthMode === 'login' ? 'Naya user? Register karein' : 'Account hai? Login karein'}
          </Text>
        </View>
      ) : (
        <View style={styles.authCard}>
          <Text style={styles.heading}>Admin Login</Text>
          <AppInput value={adminEmail} onChangeText={setAdminEmail} placeholder="Admin Email" autoCapitalize="none" />
          <AppInput value={adminPassword} onChangeText={setAdminPassword} placeholder="Password" secureTextEntry />
          <AppButton title="Admin Login" loading={authLoading} onPress={() => submitAuth().catch(() => undefined)} />
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 12,
    paddingBottom: 24,
    gap: 10,
  },
  heroCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: colors.primary,
  },
  heroPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    marginTop: 10,
    color: '#fff',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  heroSubtitle: {
    marginTop: 4,
    color: '#eafff2',
    fontSize: 13,
    fontWeight: '500',
  },
  heroStatsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  heroStat: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  heroStatLabel: {
    color: '#d1fae5',
    fontSize: 11,
    fontWeight: '600',
  },
  heroStatValue: {
    marginTop: 4,
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ecfdf3',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  categoryChipText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productCard: {
    width: '48.5%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 92,
    backgroundColor: '#e5e7eb',
  },
  productName: {
    paddingHorizontal: 8,
    paddingTop: 7,
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },
  productPrice: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    color: '#047857',
    fontSize: 13,
    fontWeight: '900',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  authCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  link: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: '700',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 12,
  },
});
