import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import useWalletStore from '../../store/useWalletStore';
import encryptionService from '../../services/encryption/encryptionService';
import analyticsService from '../../services/analytics/analyticsService';

const SettingsScreen: React.FC = () => {
  const { alias, isBiometricEnabled, setBiometricEnabled, logout } = useWalletStore();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
  useEffect(() => {
    analyticsService.trackScreen('SettingsScreen');
    checkBiometricSupport();
    checkAnalyticsStatus();
  }, []);

  const checkBiometricSupport = async () => {
    const supported = await encryptionService.isBiometricSupported();
    setBiometricAvailable(supported);
  };

  const checkAnalyticsStatus = async () => {
    const isOptedOut = await analyticsService.isOptedOut();
    setAnalyticsEnabled(!isOptedOut);
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const authenticated = await encryptionService.authenticateWithBiometrics(
        "Confirm your identity to activate biometric authentication"
      );
      
      if (authenticated) {
        await setBiometricEnabled(true);
      } else {
        return;
      }
    } else {
      await setBiometricEnabled(false);
    }
  };

  const handleAnalyticsToggle = (value: boolean) => {
    if (value) {
      analyticsService.optIn();
    } else {
      analyticsService.optOut();
    }
    setAnalyticsEnabled(value);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm logout",
      "Are you sure you want to logout? You will need your password to access your wallet again.",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            analyticsService.trackEvent({
              name: 'user_logout',
            });
            await logout();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Account information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Alias:</Text>
          <Text style={styles.infoValue}>{alias}</Text>
        </View>
      </Card>
      
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        {biometricAvailable && (
          <ToggleSwitch
            label="Biometric authentication"
            value={isBiometricEnabled}
            onValueChange={handleBiometricToggle}
          />
        )}
        
        <Button
          title="Change password"
          variant="outline"
          onPress={() => Alert.alert("Function not implemented", "This function will be available in future versions.")}
          style={styles.button}
        />
      </Card>
      
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        
        <ToggleSwitch
          label="Share anonymous analytics"
          value={analyticsEnabled}
          onValueChange={handleAnalyticsToggle}
        />
        
        <Text style={styles.privacyText}>
          Analytics are anonymous and help us improve the application.
          We do not collect personal information or details of your transactions.
        </Text>
      </Card>
      
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </Card>
      
      <View style={styles.logoutContainer}>
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    margin: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
  },
  privacyText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 12,
    lineHeight: 20,
  },
  logoutContainer: {
    margin: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  logoutButton: {
    borderColor: '#FF4D4D',
  },
  logoutText: {
    color: '#FF4D4D',
  },
});

export default SettingsScreen; 