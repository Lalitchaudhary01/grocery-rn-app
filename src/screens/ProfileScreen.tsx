import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { colors } from '../constants/theme';
import { useAppContext } from '../context/AppContext';

export function ProfileScreen() {
  const {
    user,
    orderAddress,
    setOrderAddressField,
    paymentMethod,
    setPaymentMethod,
    logout,
    draftApiBaseUrl,
    setDraftApiBaseUrl,
    saveApiBaseUrl,
    setTab,
  } = useAppContext();

  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Text style={styles.text}>Role: {user?.role || '-'}</Text>
        <Text style={styles.text}>Name: {user?.name || '-'}</Text>
        <Text style={styles.text}>Mobile: {user?.mobile || '-'}</Text>
        <Text style={styles.text}>Email: {user?.email || '-'}</Text>
      </View>

      {isCustomer ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <AppInput value={orderAddress.street} onChangeText={v => setOrderAddressField('street', v)} placeholder="House / Street" />
          <AppInput value={orderAddress.phone} onChangeText={v => setOrderAddressField('phone', v)} placeholder="Phone" keyboardType="number-pad" maxLength={10} />
          <AppInput value={orderAddress.city} onChangeText={v => setOrderAddressField('city', v)} placeholder="City" />
          <AppInput value={orderAddress.state} onChangeText={v => setOrderAddressField('state', v)} placeholder="State" />
          <AppInput value={orderAddress.postalCode} onChangeText={v => setOrderAddressField('postalCode', v)} placeholder="Pincode" keyboardType="number-pad" maxLength={6} />
          <AppButton title="Go to Checkout" onPress={() => setTab('checkout')} />
        </View>
      ) : null}

      {isCustomer ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.btnCol}>
            <AppButton title="UPI QR" variant={paymentMethod === 'UPI_QR' ? 'primary' : 'outline'} onPress={() => setPaymentMethod('UPI_QR')} />
            <AppButton title="COD" variant={paymentMethod === 'COD' ? 'primary' : 'outline'} onPress={() => setPaymentMethod('COD')} />
          </View>
          <Text style={styles.helpText}>{paymentMethod === 'UPI_QR' ? 'UPI ID: 8923541428@axl | Number: 8923541428' : 'COD selected'}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <AppInput value={draftApiBaseUrl} onChangeText={setDraftApiBaseUrl} autoCapitalize="none" />
        <AppButton title="Save URL" variant="outline" onPress={() => saveApiBaseUrl().catch(() => undefined)} />
      </View>

      <AppButton title="Logout" variant="danger" onPress={() => logout().catch(() => undefined)} />
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    color: '#374151',
    fontSize: 14,
    marginBottom: 6,
  },
  btnCol: {
    gap: 8,
  },
  helpText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 12,
  },
});
