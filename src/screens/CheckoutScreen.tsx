import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';
import { useAppContext } from '../context/AppContext';
import { colors } from '../constants/theme';
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
    <View style={styles.wrap}>
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

      <View style={styles.summary}>
        <Text style={styles.summaryRow}>Subtotal: {formatInr(subtotal)}</Text>
        <Text style={styles.summaryRow}>Delivery: {deliveryCharge === 0 ? 'FREE' : formatInr(deliveryCharge)}</Text>
        <Text style={styles.summaryTotal}>Total: {formatInr(total)}</Text>
      </View>

      <View style={styles.actionRow}>
        <AppButton title="Back to Cart" variant="outline" onPress={() => setTab('cart')} />
        <AppButton title="Place Order" loading={placingOrder} onPress={() => placeOrder().catch(() => undefined)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 12,
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
