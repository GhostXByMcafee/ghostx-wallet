import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import { ToggleSwitchProps } from '../../types/index';

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  label,
  containerStyle,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#767577', true: '#3366FF' }}
        thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
});

export default ToggleSwitch; 