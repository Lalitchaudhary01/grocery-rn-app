import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../context/AppContext';
import { colors } from '../constants/theme';
import { AppButton } from '../components/common/AppButton';
import { AppInput } from '../components/common/AppInput';

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
    draftApiBaseUrl,
    setDraftApiBaseUrl,
    saveApiBaseUrl,
  } = useAppContext();

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.roleRow}>
        <AppButton title="Customer" variant={selectedRole === 'CUSTOMER' ? 'primary' : 'outline'} onPress={() => setSelectedRole('CUSTOMER')} />
        <AppButton title="Admin" variant={selectedRole === 'ADMIN' ? 'primary' : 'outline'} onPress={() => setSelectedRole('ADMIN')} />
      </View>

      {selectedRole === 'CUSTOMER' ? (
        <View style={styles.card}>
          <Text style={styles.heading}>{customerAuthMode === 'login' ? 'Customer Login' : 'Customer Register'}</Text>
          {customerAuthMode === 'register' ? <AppInput value={customerName} onChangeText={setCustomerName} placeholder="Name" /> : null}
          <AppInput value={customerMobile} onChangeText={setCustomerMobile} placeholder="Mobile Number" keyboardType="number-pad" maxLength={10} />

          <AppButton title={customerAuthMode === 'login' ? 'Login' : 'Register + Login'} loading={authLoading} onPress={() => submitAuth().catch(() => undefined)} />

          <Text style={styles.link} onPress={() => setCustomerAuthMode(customerAuthMode === 'login' ? 'register' : 'login')}>
            {customerAuthMode === 'login' ? 'Naya user? Register karein' : 'Account hai? Login karein'}
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.heading}>Admin Login</Text>
          <AppInput value={adminEmail} onChangeText={setAdminEmail} placeholder="Admin Email" autoCapitalize="none" />
          <AppInput value={adminPassword} onChangeText={setAdminPassword} placeholder="Password" secureTextEntry />
          <AppButton title="Admin Login" loading={authLoading} onPress={() => submitAuth().catch(() => undefined)} />
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Backend URL</Text>
        <AppInput value={draftApiBaseUrl} onChangeText={setDraftApiBaseUrl} autoCapitalize="none" placeholder="http://10.0.2.2:3000" />
        <AppButton title="Save API URL" variant="outline" onPress={() => saveApiBaseUrl().catch(() => undefined)} />
        <Text style={styles.helpText}>Android emulator: http://10.0.2.2:3000 | Physical phone: laptop LAN IP use karo.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 14,
    paddingBottom: 24,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  link: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: '700',
  },
  helpText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 12,
  },
});
