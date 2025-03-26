import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import analyticsService from '../../services/analytics/analyticsService';
import encryptionService from '../../services/encryption/encryptionService';
import useWalletStore from '../../store/useWalletStore';

const SettingsScreen: React.FC = () => {
  const { alias, isBiometricEnabled, setBiometricEnabled, logout } = useWalletStore();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
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
    try {
      if (value) {
        const authenticated = await encryptionService.authenticateWithBiometrics(
          "Confirm your identity to activate biometric authentication"
        );
        
        if (authenticated) {
          await setBiometricEnabled(true);
          Alert.alert(
            "Success",
            "Biometric authentication has been activated successfully"
          );
        }
      } else {
        await setBiometricEnabled(false);
        Alert.alert(
          "Disabled",
          "Biometric authentication has been disabled"
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to configure biometric authentication. Please try again."
      );
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

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    analyticsService.trackEvent({
      name: 'logout_confirmed',
    });
    await logout();
    setShowLogoutModal(false);
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
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>
                  Use fingerprint or face recognition to secure your wallet
                </Text>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={isBiometricEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>
          </Card>
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
          variant="secondary"
          style={[styles.logoutButton, { backgroundColor: '#DC3545' }]}
          onPress={handleLogoutPress}
        />
      </View>

      <Modal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need your password to access your wallet again."
        actions={[
          {
            text: 'Cancel',
            variant: 'outline',
            onPress: () => setShowLogoutModal(false),
          },
          {
            text: 'Logout',
            variant: 'secondary',
            onPress: handleLogoutConfirm,
          },
        ]}
      />
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
    marginTop: 32,
    marginBottom: 24,
  },
  logoutText: {
    color: '#FF4D4D',
  },
  settingCard: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen; 