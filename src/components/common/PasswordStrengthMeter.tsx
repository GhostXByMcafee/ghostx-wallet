import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  password: string;
}

const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  const calculateStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const getStrengthText = (strength: number): string => {
    switch (strength) {
      case 0: return 'Very weak';
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very strong';
      default: return '';
    }
  };

  const getStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0: return '#FF4444';
      case 1: return '#FFA500';
      case 2: return '#FFD700';
      case 3: return '#90EE90';
      case 4: return '#00FF00';
      default: return '#CCCCCC';
    }
  };

  const strength = calculateStrength(password);

  return (
    <View style={styles.container}>
      <View style={styles.meterContainer}>
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.meterSegment,
              { backgroundColor: index < strength ? getStrengthColor(strength) : '#333333' }
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthText, { color: getStrengthColor(strength) }]}>
        {getStrengthText(strength)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  meterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  meterSegment: {
    flex: 1,
    height: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    textAlign: 'right',
  },
});

export default PasswordStrengthMeter; 