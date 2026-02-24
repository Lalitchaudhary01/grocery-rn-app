import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { useAppContext } from '../context/AppContext';
import { colors, upi } from '../constants/theme';
import { formatInr } from '../utils/format';

export function CheckoutScreen() {
  const {
    orderAddress,
    setOrderAddressField,
    paymentMethod,
    setPaymentMethod,
    subtotal,
    deliveryCharge,
    total,
    placingOrder,
    placeOrder,
    setTab,
  } = useAppContext();

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Checkout</Text>

      <AppInput value={orderAddress.street} onChangeText={v => setOrderAddressField('street', v)} placeholder="House / Street" />
      <AppInput value={orderAddress.phone} onChangeText={v => setOrderAddressField('phone', v)} placeholder="Phone" keyboardType="number-pad" maxLength={10} />
      <AppInput value={orderAddress.city} onChangeText={v => setOrderAddressField('city', v)} placeholder="City" />
      <AppInput value={orderAddress.state} onChangeText={v => setOrderAddressField('state', v)} placeholder="State" />
      <AppInput value={orderAddress.postalCode} onChangeText={v => setOrderAddressField('postalCode', v)} placeholder="Pincode" keyboardType="number-pad" maxLength={6} />

      <Text style={styles.sectionLabel}>Payment Method</Text>
      <View style={styles.payRow}>
        <AppButton title="UPI QR" variant={paymentMethod === 'UPI_QR' ? 'primary' : 'outline'} onPress={() => setPaymentMethod('UPI_QR')} />
        <AppButton title="COD" variant={paymentMethod === 'COD' ? 'primary' : 'outline'} onPress={() => setPaymentMethod('COD')} />
      </View>

      {paymentMethod === 'UPI_QR' ? (
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Scan QR and Pay</Text>
          <Text style={styles.qrText}>UPI ID: {upi.id}</Text>
          <Text style={styles.qrText}>Number: {upi.number}</Text>
          <Text style={styles.qrText}>Name: {upi.name}</Text>
          <Image source={{ uri: upi.qrImageUrl }} style={styles.qrImage} />
          <Text style={styles.qrHelp}>Payment ke baad Place Order press karein.</Text>
        </View>
      ) : null}

      <View style={styles.summary}>
        <Text style={styles.summaryRow}>Subtotal: {formatInr(subtotal)}</Text>
        <Text style={styles.summaryRow}>Delivery: {deliveryCharge === 0 ? 'FREE' : formatInr(deliveryCharge)}</Text>
        <Text style={styles.summaryTotal}>Total: {formatInr(total)}</Text>
      </View>

      <View style={styles.actionRow}>
        <AppButton title="Back to Cart" variant="outline" onPress={() => setTab('cart')} />
        <AppButton title="Place Order" loading={placingOrder} onPress={() => placeOrder().catch(() => undefined)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 12,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  payRow: {
    gap: 8,
    marginBottom: 10,
  },
  qrCard: {
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    padding: 10,
    marginBottom: 10,
  },
  qrTitle: {
    color: '#166534',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  qrText: {
    color: '#065f46',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '600',
  },
  qrImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#e5e7eb',
  },
  qrHelp: {
    marginTop: 8,
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
  },
  summary: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
  },
  summaryRow: {
    color: '#374151',
    marginBottom: 4,
  },
  summaryTotal: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
  },
  actionRow: {
    gap: 8,
  },
});
