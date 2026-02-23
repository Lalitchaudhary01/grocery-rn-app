import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors } from '../../constants/theme';

export function AppInput(props: TextInputProps) {
  return <TextInput placeholderTextColor="#9ca3af" {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: colors.text,
    backgroundColor: '#fff',
  },
});
