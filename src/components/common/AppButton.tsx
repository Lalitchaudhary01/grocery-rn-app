import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
};

export function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: AppButtonProps) {
  const variantStyle =
    variant === 'primary'
      ? styles.primary
      : variant === 'danger'
        ? styles.danger
        : styles.outline;
  const textStyle = variant === 'outline' ? styles.outlineText : styles.solidText;

  return (
    <Pressable style={[styles.base, variantStyle, (disabled || loading) && styles.disabled]} onPress={onPress} disabled={disabled || loading}>
      {loading ? <ActivityIndicator color={variant === 'outline' ? colors.primary : '#fff'} /> : <Text style={textStyle}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  danger: {
    backgroundColor: '#ef4444',
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
  },
  solidText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  outlineText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
});
